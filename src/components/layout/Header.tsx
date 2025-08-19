import { Trophy, Wallet, User, Settings, LogOut, Menu } from "lucide-react";
import { PremiumButton } from "@/components/ui/button-variants";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

interface HeaderProps {
  userBalance?: number;
  isAuthenticated?: boolean;
  username?: string;
  onLoginClick?: () => void;
  onLogoutClick?: () => void;
}

export function Header({
  userBalance = 0,
  isAuthenticated = false,
  username = "Guest",
  onLoginClick,
  onLogoutClick,
}: HeaderProps) {
  return (
    <header className="border-b border-border bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/30 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg gradient-gold">
              <Trophy className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">SportsPro</h1>
              <p className="text-xs text-muted-foreground">Premium Recommendations</p>
            </div>
          </div>

          {/* Navigation - Hidden on mobile */}
          <nav className="hidden md:flex items-center gap-6">
            <a href="#recommendations" className="text-sm text-muted-foreground hover:text-foreground transition-smooth">
              Recommendations
            </a>
            <a href="#history" className="text-sm text-muted-foreground hover:text-foreground transition-smooth">
              History
            </a>
            <a href="#about" className="text-sm text-muted-foreground hover:text-foreground transition-smooth">
              About
            </a>
          </nav>

          {/* User Section */}
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                {/* Balance Display */}
                <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/50">
                  <Wallet className="h-4 w-4 text-green-success" />
                  <span className="text-sm font-medium text-green-success">
                    ${userBalance.toFixed(2)}
                  </span>
                </div>

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <PremiumButton variant="glass" size="sm">
                      <User className="h-4 w-4" />
                      <span className="hidden sm:inline">{username}</span>
                    </PremiumButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem>
                      <Wallet className="mr-2 h-4 w-4" />
                      <span>Balance: ${userBalance.toFixed(2)}</span>
                      <Badge variant="secondary" className="ml-auto">
                        {userBalance > 0 ? "Active" : "Empty"}
                      </Badge>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={onLogoutClick}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Logout</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <PremiumButton variant="gold" onClick={onLoginClick}>
                Login
              </PremiumButton>
            )}

            {/* Mobile Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <PremiumButton variant="glass" size="icon" className="md:hidden">
                  <Menu className="h-4 w-4" />
                </PremiumButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem>
                  <span>Recommendations</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span>History</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span>About</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}