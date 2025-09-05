import { Clock, Star, TrendingUp, ShoppingCart, Users, AlertTriangle } from "lucide-react";
import { PremiumButton } from "@/components/ui/button-variants";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface RecommendationCardProps {
  id: string;
  title: string;
  price: number;
  odds: number;
  confidence: number;
  bettingSites: string;
  expiresAt: string;
  maxPurchases?: number;
  currentPurchases: number;
  isUrgent?: boolean;
  onPurchase?: (id: string) => void;
  userBalance?: number;
}

export function RecommendationCard({
  id,
  title,
  price,
  odds,
  confidence,
  bettingSites,
  expiresAt,
  maxPurchases,
  currentPurchases,
  isUrgent = false,
  onPurchase,
  userBalance = 0,
}: RecommendationCardProps) {
  const timeRemaining = calculateTimeRemaining(expiresAt);
  const canAfford = userBalance >= price;
  const isAvailable = !maxPurchases || currentPurchases < maxPurchases;
  
  const progressPercent = maxPurchases ? (currentPurchases / maxPurchases) * 100 : 0;
  
  return (
    <Card className={`relative overflow-hidden transition-smooth hover:shadow-card group ${
      isUrgent ? 'shadow-urgent animate-pulse-gold' : 'shadow-card'
    }`}>
      {/* Urgent indicator */}
      {isUrgent && (
        <div className="absolute top-0 left-0 right-0 h-1 gradient-urgent" />
      )}
      
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-smooth">
              {title}
            </h3>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <TrendingUp className="h-4 w-4" />
                <span>Odds: {odds}</span>
              </div>
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star 
                    key={i} 
                    className={`h-4 w-4 ${
                      i < confidence ? 'fill-primary text-primary' : 'text-muted'
                    }`} 
                  />
                ))}
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-2xl font-bold text-green-success">₹{price}</div>
            {isUrgent && (
              <Badge variant="destructive" className="text-xs">
                <AlertTriangle className="h-3 w-3 mr-1" />
                URGENT
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Time remaining */}
        <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
          <Clock className={`h-4 w-4 ${isUrgent ? 'text-red-urgent' : 'text-muted-foreground'}`} />
          <span className={`text-sm font-medium ${isUrgent ? 'text-red-urgent' : 'text-muted-foreground'}`}>
            {timeRemaining}
          </span>
        </div>

        {/* Betting sites */}
        <div className="text-sm">
          <span className="text-muted-foreground">Available on: </span>
          <span className="font-medium">{formatBettingSites(bettingSites)}</span>
        </div>

        {/* Purchase progress */}
        {maxPurchases && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground flex items-center gap-1">
                <Users className="h-4 w-4" />
                Purchases
              </span>
              <span className="font-medium">
                {currentPurchases}/{maxPurchases}
              </span>
            </div>
            <Progress value={progressPercent} className="h-2" />
          </div>
        )}
      </CardContent>

      <CardFooter>
        <PremiumButton
          variant={isUrgent ? "urgent" : canAfford ? "gold" : "outline"}
          className="w-full"
          disabled={!canAfford || !isAvailable}
          onClick={() => onPurchase?.(id)}
        >
          <ShoppingCart className="h-4 w-4" />
           {!isAvailable ? "Sold Out" : 
            !canAfford ? `Need ₹${(price - userBalance).toFixed(2)} More` : 
            `Purchase - ₹${price}`}
        </PremiumButton>
        
        {!canAfford && isAvailable && (
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Your balance: ₹{userBalance.toFixed(2)}
          </p>
        )}
      </CardFooter>
    </Card>
  );
}

function calculateTimeRemaining(expiresAt: string): string {
  const now = new Date();
  const expiry = new Date(expiresAt);
  const diff = expiry.getTime() - now.getTime();
  
  if (diff <= 0) return "Expired";
  
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) return `${days}d ${hours % 24}h remaining`;
  if (hours > 0) return `${hours}h ${minutes % 60}m remaining`;
  return `${minutes}m remaining`;
}

function formatBettingSites(sites: string): string {
  if (!sites) return "Various sites";
  const siteList = sites.split(',').map(s => s.trim());
  if (siteList.length <= 3) return siteList.join(', ');
  return `${siteList.slice(0, 3).join(', ')} +${siteList.length - 3} more`;
}