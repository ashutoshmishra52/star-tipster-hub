import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { useStore } from '@/stores/useStore';
import { supabase } from '@/integrations/supabase/client';
import { Mail, Lock, User, AlertCircle, Chrome } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function AuthModal() {
  const { isAuthModalOpen, setAuthModalOpen, login, register, setUser } = useStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { toast } = useToast();

  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  });

  const [registerForm, setRegisterForm] = useState({
    email: '',
    password: '',
    username: '',
    confirmPassword: ''
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // First try Supabase authentication
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginForm.email,
        password: loginForm.password,
      });

      if (error) {
        // Fallback to local authentication for demo
        const success = await login(loginForm.email, loginForm.password);
        if (success) {
          toast({
            title: "Welcome back!",
            description: "Successfully logged in to SportXBet",
          });
        } else {
          setError('Invalid credentials');
        }
      } else if (data.user) {
        // Supabase login successful
        const user = {
          id: data.user.id,
          email: data.user.email!,
          username: data.user.user_metadata?.username || data.user.email!.split('@')[0],
          balance: 50.00,
          isAuthenticated: true,
          isAdmin: data.user.email === 'admin@sportxbet.com'
        };
        setUser(user);
        setAuthModalOpen(false);
        toast({
          title: "Welcome back!",
          description: "Successfully logged in to SportXBet",
        });
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (registerForm.password !== registerForm.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (registerForm.password.length < 6) {
      setError('Password must be at least 6 characters');
      setIsLoading(false);
      return;
    }

    try {
      // First try Supabase registration
      const { data, error } = await supabase.auth.signUp({
        email: registerForm.email,
        password: registerForm.password,
        options: {
          data: {
            username: registerForm.username,
          }
        }
      });

      if (error) {
        // Fallback to local registration for demo
        const success = await register(registerForm.email, registerForm.password, registerForm.username);
        if (success) {
          toast({
            title: "Welcome to SportXBet!",
            description: "Account created successfully. ₹25 welcome bonus added!",
          });
        } else {
          setError('Registration failed');
        }
      } else if (data.user) {
        // Supabase registration successful
        toast({
          title: "Welcome to SportXBet!",
          description: "Please check your email to verify your account.",
        });
        setAuthModalOpen(false);
      }
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError('');

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      });

      if (error) {
        setError('Google login failed. Please try again.');
      }
    } catch (err) {
      setError('Google login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isAuthModalOpen} onOpenChange={setAuthModalOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl">
            <span className="gradient-text">SportXBet</span>
          </DialogTitle>
          <DialogDescription className="text-center">
            Join the winning team - Get premium betting tips
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="space-y-4">
            {/* Google Login Button */}
            <Button 
              onClick={handleGoogleLogin} 
              variant="outline" 
              className="w-full h-12 text-base"
              disabled={isLoading}
            >
              <Chrome className="h-5 w-5 mr-2" />
              Continue with Google
            </Button>

            <Button 
              onClick={() => window.open('https://t.me/sportqwebot', '_blank')}
              variant="outline" 
              className="w-full h-12 text-base bg-blue-500/10 hover:bg-blue-500/20 border-blue-500/30"
            >
              <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.374 0 0 5.373 0 12s5.374 12 12 12 12-5.373 12-12S18.626 0 12 0zm5.568 8.16c-.169 1.858-.896 6.728-.896 6.728-.377 2.65-.377 2.65-1.377 2.65-.896 0-1.209-.896-1.209-.896l-2.411-1.828-1.23-.896-2.035-.979c-.308-.154-.64-.358-.64-.715 0-.447.332-.745.64-.896l8.991-3.485c.524-.201.896.045.896.597 0 .169 0 .338-.169.507z"/>
              </svg>
              Connect via Telegram Bot
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or continue with email</span>
              </div>
            </div>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="your@email.com"
                    className="pl-10"
                    value={loginForm.email}
                    onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="login-password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="Your password"
                    className="pl-10"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 text-destructive text-sm">
                  <AlertCircle className="h-4 w-4" />
                  {error}
                </div>
              )}

              <Button type="submit" className="w-full gradient-gold" disabled={isLoading}>
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            <div className="text-center text-sm text-muted-foreground">
              Demo: Use any email/password or Google sign-in
            </div>
          </TabsContent>

          <TabsContent value="register" className="space-y-4">
            {/* Google Signup Button */}
            <Button 
              onClick={handleGoogleLogin} 
              variant="outline" 
              className="w-full h-12 text-base"
              disabled={isLoading}
            >
              <Chrome className="h-5 w-5 mr-2" />
              Sign up with Google
            </Button>

            <Button 
              onClick={() => window.open('https://t.me/sportqwebot', '_blank')}
              variant="outline" 
              className="w-full h-12 text-base bg-blue-500/10 hover:bg-blue-500/20 border-blue-500/30"
            >
              <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.374 0 0 5.373 0 12s5.374 12 12 12 12-5.373 12-12S18.626 0 12 0zm5.568 8.16c-.169 1.858-.896 6.728-.896 6.728-.377 2.65-.377 2.65-1.377 2.65-.896 0-1.209-.896-1.209-.896l-2.411-1.828-1.23-.896-2.035-.979c-.308-.154-.64-.358-.64-.715 0-.447.332-.745.64-.896l8.991-3.485c.524-.201.896.045.896.597 0 .169 0 .338-.169.507z"/>
              </svg>
              Sign up via Telegram Bot
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or create account with email</span>
              </div>
            </div>
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="register-username">Username</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="register-username"
                    type="text"
                    placeholder="Choose username"
                    className="pl-10"
                    value={registerForm.username}
                    onChange={(e) => setRegisterForm({ ...registerForm, username: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="register-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="register-email"
                    type="email"
                    placeholder="your@email.com"
                    className="pl-10"
                    value={registerForm.email}
                    onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="register-password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="register-password"
                    type="password"
                    placeholder="Choose password"
                    className="pl-10"
                    value={registerForm.password}
                    onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="Confirm password"
                    className="pl-10"
                    value={registerForm.confirmPassword}
                    onChange={(e) => setRegisterForm({ ...registerForm, confirmPassword: e.target.value })}
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 text-destructive text-sm">
                  <AlertCircle className="h-4 w-4" />
                  {error}
                </div>
              )}

              <Button type="submit" className="w-full gradient-success" disabled={isLoading}>
                {isLoading ? 'Creating account...' : 'Create Account'}
              </Button>
            </form>

            <div className="text-center text-sm text-muted-foreground">
              Get ₹25 welcome bonus on signup!
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}