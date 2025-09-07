import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface TelegramUpdate {
  update_id: number;
  message?: {
    message_id: number;
    from: {
      id: number;
      is_bot: boolean;
      first_name: string;
      last_name?: string;
      username?: string;
    };
    chat: {
      id: number;
      type: string;
    };
    text?: string;
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const update: TelegramUpdate = await req.json();
    console.log('Received Telegram update:', update);

    if (!update.message || !update.message.text) {
      return new Response(JSON.stringify({ ok: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { message } = update;
    const { from, text } = message;

    // Handle /start command for authentication
    if (text.startsWith('/start')) {
      const authToken = crypto.randomUUID();
      
      // Store temporary authentication token
      const { error: insertError } = await supabase
        .from('telegram_auth_tokens')
        .insert({
          token: authToken,
          telegram_id: from.id,
          telegram_username: from.username,
          telegram_first_name: from.first_name,
          telegram_last_name: from.last_name,
        });

      if (insertError) {
        console.error('Error storing auth token:', insertError);
        return new Response(JSON.stringify({ error: 'Failed to create auth token' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Send authentication link back to user
      const authUrl = `https://axqztpuqozxooqknwtsk.supabase.co/functions/v1/telegram-auth?token=${authToken}`;
      
      const botToken = Deno.env.get('TELEGRAM_BOT_TOKEN');
      if (botToken) {
        const telegramApiUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
        
        await fetch(telegramApiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: message.chat.id,
            text: `🎯 SportXBet Authentication\n\nClick this link to connect your account:\n${authUrl}\n\nThis link expires in 10 minutes.`,
            parse_mode: 'HTML',
          }),
        });
      }

      return new Response(JSON.stringify({ ok: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Handle other commands or messages
    if (text === '/help') {
      const botToken = Deno.env.get('TELEGRAM_BOT_TOKEN');
      if (botToken) {
        const telegramApiUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
        
        await fetch(telegramApiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: message.chat.id,
            text: `🤖 SportXBet Bot Commands:\n\n/start - Connect your account\n/help - Show this help message\n\nTo get started, use the /start command!`,
          }),
        });
      }
    }

    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Webhook error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});