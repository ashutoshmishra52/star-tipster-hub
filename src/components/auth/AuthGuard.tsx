import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useStore } from '@/stores/useStore';
import { AuthModal } from './AuthModal';
import { Loader2 } from 'lucide-react';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

export function AuthGuard({ children, requireAuth = false }: AuthGuardProps) {
  const { user } = useAuth();
  const { setAuthModalOpen, isAuthModalOpen } = useStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Give auth state time to initialize
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isLoading && requireAuth && !user?.isAuthenticated && !isAuthModalOpen) {
      setAuthModalOpen(true);
    }
  }, [isLoading, requireAuth, user, isAuthModalOpen, setAuthModalOpen]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (requireAuth && !user?.isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
          <p className="text-muted-foreground mb-6">
            Please log in to access SportXBet premium features and recommendations.
          </p>
          <AuthModal />
        </div>
      </div>
    );
  }

  return <>{children}</>;
}