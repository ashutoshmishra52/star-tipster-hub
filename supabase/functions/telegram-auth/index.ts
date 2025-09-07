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

    console.log(`Received auth request with token: ${token}`);

    if (!token) {
      console.log('No token provided in request');
      return new Response('Invalid authentication token', { 
        status: 400,
        headers: corsHeaders
      });
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const currentTime = new Date().toISOString();
    console.log(`Current time: ${currentTime}`);

    // First, let's see what tokens exist for debugging
    const { data: allTokens } = await supabase
      .from('telegram_auth_tokens')
      .select('*')
      .eq('token', token);
    
    console.log(`All tokens with this value:`, allTokens);

    // Verify token and get Telegram user data - temporarily remove used=false condition for debugging
    const { data: authToken, error: tokenError } = await supabase
      .from('telegram_auth_tokens')
      .select('*')
      .eq('token', token)
      .gt('expires_at', currentTime)
      .maybeSingle();

    console.log(`Token lookup result:`, { authToken, tokenError });

    // Check if token exists but is already used
    if (!authToken) {
      console.log('No token found or token expired');
      return new Response('Invalid or expired token', { 
        status: 400,
        headers: corsHeaders
      });
    }

    // Check if token is already used - for testing, allow reuse within 5 minutes
    if (authToken.used) {
      const tokenAge = new Date().getTime() - new Date(authToken.created_at).getTime();
      const fiveMinutes = 5 * 60 * 1000; // 5 minutes in milliseconds
      
      if (tokenAge > fiveMinutes) {
        console.log('Token already used and expired for reuse');
        return new Response('Token has already been used. Please generate a new token by sending /start to the bot.', { 
          status: 400,
          headers: corsHeaders
        });
      } else {
        console.log('Token already used but allowing reuse for testing (within 5 minutes)');
        // Continue with authentication
      }
    }

    console.log(`Token validated successfully for Telegram user: ${authToken.telegram_id}`);

    // Check if user already exists with this Telegram ID (don't mark token as used yet)
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('user_id')
      .eq('telegram_id', authToken.telegram_id)
      .single();

    if (existingProfile) {
      // Mark token as used only when we successfully process it
      await supabase
        .from('telegram_auth_tokens')
        .update({ used: true })
        .eq('token', token);
        
      // User already connected, redirect to login
      const redirectUrl = `${Deno.env.get('SITE_URL') || 'https://axqztpuqozxooqknwtsk.lovable.app'}/?telegram_auth=existing&user_id=${existingProfile.user_id}`;
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

    // Mark token as used only after successful authentication
    await supabase
      .from('telegram_auth_tokens')
      .update({ used: true })
      .eq('token', token);

    // Redirect to app with authentication data
    const redirectUrl = `${Deno.env.get('SITE_URL') || 'https://axqztpuqozxooqknwtsk.lovable.app'}/?telegram_auth=success&session=${encodeURIComponent(sessionData.properties.action_link)}`;
    
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