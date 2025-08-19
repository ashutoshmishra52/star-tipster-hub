import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { HeroSection } from "@/components/home/HeroSection";
import { RecommendationCard } from "@/components/recommendations/RecommendationCard";
import { WalletCard } from "@/components/wallet/WalletCard";
import { PremiumButton } from "@/components/ui/button-variants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, Users, TrendingUp, Shield, Star, CheckCircle, DollarSign } from "lucide-react";

// Mock data for homepage
const featuredRecommendations = [
  {
    id: 1,
    title: "Manchester United vs Arsenal - Over 2.5 Goals",
    price: 15.99,
    odds: 1.85,
    confidence: 4,
    bettingSites: "Bet365, William Hill, Betfair",
    expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
    maxPurchases: 100,
    currentPurchases: 67,
    isUrgent: true,
  },
  {
    id: 2,
    title: "Lakers vs Warriors - Lakers +5.5",
    price: 12.99,
    odds: 1.92,
    confidence: 5,
    bettingSites: "DraftKings, FanDuel",
    expiresAt: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
    maxPurchases: 50,
    currentPurchases: 23,
    isUrgent: false,
  },
];

const testimonials = [
  {
    name: "Alex M.",
    image: "🏆",
    text: "Made $2,400 profit in my first month! The predictions are incredibly accurate.",
    profit: "+240%",
  },
  {
    name: "Sarah K.", 
    image: "💎",
    text: "Finally found a reliable source for sports betting tips. Worth every penny!",
    profit: "+180%",
  },
  {
    name: "Mike R.",
    image: "🎯", 
    text: "85% win rate speaks for itself. This platform changed my betting game completely.",
    profit: "+310%",
  },
];

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  const handleGetStarted = () => {
    // Navigate to dashboard or show auth modal
    setIsAuthenticated(true);
  };

  if (isAuthenticated) {
    // Redirect to dashboard component
    window.location.href = "/dashboard";
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header
        isAuthenticated={false}
        onLoginClick={() => setIsAuthenticated(true)}
      />

      {/* Hero Section */}
      <HeroSection onGetStarted={handleGetStarted} />

      {/* Featured Recommendations Preview */}
      <section className="py-20 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4 px-4 py-2">
              🔥 Hot Recommendations
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Current Live Recommendations
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              See what our professional analysts are recommending right now. 
              <span className="text-primary font-semibold"> Join to unlock full access.</span>
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-8">
            {featuredRecommendations.map((rec) => (
              <div key={rec.id} className="relative">
                <RecommendationCard
                  {...rec}
                  userBalance={0}
                  onPurchase={() => handleGetStarted()}
                />
                {/* Overlay for non-authenticated users */}
                <div className="absolute inset-0 bg-background/80 backdrop-blur-sm rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Shield className="h-8 w-8 text-primary mx-auto mb-3" />
                    <h3 className="font-semibold mb-2">Premium Content</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Sign up to view and purchase recommendations
                    </p>
                    <PremiumButton variant="gold" onClick={handleGetStarted}>
                      Get Access
                    </PremiumButton>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <PremiumButton variant="gold" size="lg" onClick={handleGetStarted}>
              <Trophy className="h-5 w-5" />
              View All Recommendations
            </PremiumButton>
          </div>
        </div>
      </section>

      {/* Social Proof & Testimonials */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Join Thousands of Winning Bettors
            </h2>
            <p className="text-xl text-muted-foreground">
              Our community is crushing the sportsbooks every day
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="gradient-card shadow-card">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="text-2xl">{testimonial.image}</div>
                    <div>
                      <div className="font-semibold">{testimonial.name}</div>
                      <Badge variant="default" className="text-xs">
                        {testimonial.profit} ROI
                      </Badge>
                    </div>
                  </div>
                  <p className="text-muted-foreground italic">"{testimonial.text}"</p>
                  <div className="flex mt-4">
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Trust indicators */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-success mb-2">1000+</div>
              <div className="text-sm text-muted-foreground">Active Members</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">85%</div>
              <div className="text-sm text-muted-foreground">Win Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-info mb-2">$50K+</div>
              <div className="text-sm text-muted-foreground">Member Profits</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-premium mb-2">24/7</div>
              <div className="text-sm text-muted-foreground">Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-xl text-muted-foreground">
              Start winning in 3 simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full gradient-gold mb-6 text-2xl font-bold text-primary-foreground">
                1
              </div>
              <h3 className="text-xl font-semibold mb-4">Sign Up & Fund</h3>
              <p className="text-muted-foreground">
                Create your account and add funds using crypto, stars, or other payment methods
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full gradient-success mb-6 text-2xl font-bold text-white">
                2
              </div>
              <h3 className="text-xl font-semibold mb-4">Browse & Purchase</h3>
              <p className="text-muted-foreground">
                Choose from our premium recommendations with detailed analysis and confidence ratings
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-info mb-6 text-2xl font-bold text-white">
                3
              </div>
              <h3 className="text-xl font-semibold mb-4">Place Bets & Win</h3>
              <p className="text-muted-foreground">
                Use our recommendations on your favorite sportsbooks and start winning consistently
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Ready to Start Winning?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join our exclusive community of successful sports bettors today
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <PremiumButton variant="gold" size="xl" onClick={handleGetStarted}>
                <Trophy className="h-5 w-5" />
                Get Started Now
              </PremiumButton>
              <PremiumButton variant="glass" size="xl">
                <DollarSign className="h-5 w-5" />
                View Pricing
              </PremiumButton>
            </div>

            <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <CheckCircle className="h-4 w-4 text-green-success" />
                No subscription fees
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle className="h-4 w-4 text-green-success" />
                Pay per recommendation
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle className="h-4 w-4 text-green-success" />
                Transparent results
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 bg-card/50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Trophy className="h-6 w-6 text-primary" />
                <span className="font-bold text-lg">SportsPro</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Premium sports betting recommendations from professional analysts.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>How it works</li>
                <li>Pricing</li>
                <li>Success stories</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Help center</li>
                <li>Contact us</li>
                <li>Terms of service</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Community</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Telegram channel</li>
                <li>Discord server</li>
                <li>Twitter</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 SportsPro. All rights reserved. Bet responsibly.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
