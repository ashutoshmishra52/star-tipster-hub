import { useEffect } from 'react';
import { useStore } from '@/stores/useStore';
import { supabase } from '@/integrations/supabase/client';

export const useAuth = () => {
  const { setUser, user } = useStore();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const supabaseUser = {
          id: session.user.id,
          email: session.user.email!,
          username: session.user.user_metadata?.username || session.user.email!.split('@')[0],
          balance: user?.balance || 50.00, // Keep existing balance or default
          isAuthenticated: true,
          isAdmin: session.user.email === 'admin@sportxbet.com'
        };
        setUser(supabaseUser);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const supabaseUser = {
          id: session.user.id,
          email: session.user.email!,
          username: session.user.user_metadata?.username || session.user.email!.split('@')[0],
          balance: user?.balance || 50.00,
          isAuthenticated: true,
          isAdmin: session.user.email === 'admin@sportxbet.com'
        };
        setUser(supabaseUser);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [setUser, user]);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return {
    user,
    signOut
  };
};