import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const token = url.searchParams.get('token');

    if (!token) {
      return new Response('Invalid authentication token', { 
        status: 400,
        headers: corsHeaders
      });
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Verify token and get Telegram user data
    const { data: authToken, error: tokenError } = await supabase
      .from('telegram_auth_tokens')
      .select('*')
      .eq('token', token)
      .eq('used', false)
      .gt('expires_at', new Date().toISOString())
      .single();

    if (tokenError || !authToken) {
      return new Response('Invalid or expired token', { 
        status: 400,
        headers: corsHeaders
      });
    }

    // Mark token as used
    await supabase
      .from('telegram_auth_tokens')
      .update({ used: true })
      .eq('token', token);

    // Check if user already exists with this Telegram ID
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('user_id')
      .eq('telegram_id', authToken.telegram_id)
      .single();

    if (existingProfile) {
      // User already connected, redirect to login
      const redirectUrl = `https://axqztpuqozxooqknwtsk.lovable.app/?telegram_auth=existing&user_id=${existingProfile.user_id}`;
      return new Response(null, {
        status: 302,
        headers: {
          ...corsHeaders,
          'Location': redirectUrl
        }
      });
    }

    // Create new user account
    const email = `telegram_${authToken.telegram_id}@sportxbet.temp`;
    const password = crypto.randomUUID();

    const { data: authUser, error: signUpError } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: {
        username: authToken.telegram_username || `user_${authToken.telegram_id}`,
        display_name: `${authToken.telegram_first_name} ${authToken.telegram_last_name || ''}`.trim(),
        telegram_id: authToken.telegram_id,
        telegram_username: authToken.telegram_username,
        telegram_first_name: authToken.telegram_first_name,
        telegram_last_name: authToken.telegram_last_name,
      },
      email_confirm: true
    });

    if (signUpError || !authUser.user) {
      console.error('Error creating user:', signUpError);
      return new Response('Failed to create user account', { 
        status: 500,
        headers: corsHeaders
      });
    }

    // Update profile with Telegram data
    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        telegram_id: authToken.telegram_id,
        telegram_username: authToken.telegram_username,
        telegram_first_name: authToken.telegram_first_name,
        telegram_last_name: authToken.telegram_last_name,
        username: authToken.telegram_username || `user_${authToken.telegram_id}`,
        display_name: `${authToken.telegram_first_name} ${authToken.telegram_last_name || ''}`.trim(),
      })
      .eq('user_id', authUser.user.id);

    if (profileError) {
      console.error('Error updating profile:', profileError);
    }

    // Generate access token for automatic login
    const { data: sessionData, error: sessionError } = await supabase.auth.admin.generateLink({
      type: 'magiclink',
      email: authUser.user.email!,
    });

    if (sessionError || !sessionData) {
      console.error('Error generating session:', sessionError);
      return new Response('Account created but login failed', { 
        status: 500,
        headers: corsHeaders
      });
    }

    // Redirect to app with authentication data
    const redirectUrl = `https://axqztpuqozxooqknwtsk.lovable.app/?telegram_auth=success&session=${encodeURIComponent(sessionData.properties.action_link)}`;
    
    return new Response(null, {
      status: 302,
      headers: {
        ...corsHeaders,
        'Location': redirectUrl
      }
    });

  } catch (error) {
    console.error('Auth error:', error);
    return new Response('Internal server error', { 
      status: 500,
      headers: corsHeaders
    });
  }
});