import { useEffect } from 'react';
import { useStore } from '@/stores/useStore';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const useTelegramAuth = () => {
  const { setUser } = useStore();

  useEffect(() => {
    const handleTelegramAuth = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const telegramAuth = urlParams.get('telegram_auth');
      const sessionLink = urlParams.get('session');
      const userId = urlParams.get('user_id');

      if (telegramAuth === 'success' && sessionLink) {
        try {
          // Extract the session from the magic link
          const url = new URL(decodeURIComponent(sessionLink));
          const accessToken = url.searchParams.get('access_token');
          const refreshToken = url.searchParams.get('refresh_token');

          if (accessToken && refreshToken) {
            const { data, error } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            });

            if (error) {
              console.error('Session error:', error);
              toast({
                title: "Authentication Error",
                description: "Failed to authenticate with Telegram",
                variant: "destructive"
              });
            } else if (data.user) {
              toast({
                title: "Success!",
                description: "Successfully connected with Telegram",
              });
            }
          }
        } catch (error) {
          console.error('Telegram auth error:', error);
          toast({
            title: "Authentication Error",
            description: "Failed to process Telegram authentication",
            variant: "destructive"
          });
        }

        // Clean up URL parameters
        window.history.replaceState({}, document.title, window.location.pathname);
      } else if (telegramAuth === 'existing' && userId) {
        toast({
          title: "Account Found",
          description: "Your Telegram account is already connected. Please login normally.",
        });
        
        // Clean up URL parameters
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    };

    handleTelegramAuth();
  }, [setUser]);

  const generateTelegramAuthUrl = () => {
    const botUsername = 'sportqwebot'; // Your bot username without @
    return `https://t.me/${botUsername}?start=auth`;
  };

  return {
    generateTelegramAuthUrl
  };
};