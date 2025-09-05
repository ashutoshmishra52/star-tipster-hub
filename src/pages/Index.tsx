import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { HeroSection } from "@/components/home/HeroSection";
import { RecommendationCard } from "@/components/recommendations/RecommendationCard";
import { PremiumButton } from "@/components/ui/button-variants";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AuthModal } from "@/components/auth/AuthModal";
import { useStore } from "@/stores/useStore";
import { useAuth } from "@/hooks/useAuth";
import { 
  Star, 
  Trophy, 
  Clock, 
  Shield, 
  TrendingUp, 
  Users, 
  CheckCircle, 
  ArrowRight, 
  Zap,
  Target,
  Crown,
  DollarSign
} from "lucide-react";

// Mock data for featured recommendations
const featuredRecommendations = [
  {
    id: "featured-1",
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
    id: "featured-2", 
    title: "Lakers vs Warriors - Lakers +5.5",
    price: 12.99,
    odds: 1.92,
    confidence: 5,
    bettingSites: "DraftKings, FanDuel, PointsBet",
    expiresAt: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
    maxPurchases: 50,
    currentPurchases: 23,
    isUrgent: false,
  },
  {
    id: "featured-3",
    title: "Chelsea vs Liverpool - Both Teams to Score",
    price: 18.99,
    odds: 1.78,
    confidence: 3,
    bettingSites: "Unibet, Ladbrokes, Coral",
    expiresAt: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
    currentPurchases: 45,
    isUrgent: false,
  }
];

// Mock testimonials
const testimonials = [
  {
    name: "Rajesh Kumar",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
    rating: 5,
    comment: "SportXBet tips helped me win ₹25,000 last month! Their football predictions are incredibly accurate."
  },
  {
    name: "Priya Singh",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face",
    rating: 5,
    comment: "Best sports betting platform in India. I've doubled my investment in just 3 months!"
  }
];

const Index = () => {
  const { user, setAuthModalOpen, recommendations, purchaseRecommendation } = useStore();
  useAuth(); // Initialize auth listener
  
  const handleGetStarted = () => {
    if (user?.isAuthenticated) {
      window.location.href = "/dashboard";
    } else {
      setAuthModalOpen(true);
    }
  };

  const handlePurchase = (id: string) => {
    if (user?.isAuthenticated) {
      purchaseRecommendation(id);
    } else {
      setAuthModalOpen(true);
    }
  };

  if (user?.isAuthenticated) {
    // Redirect to dashboard component
    window.location.href = "/dashboard";
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header
        userBalance={user?.balance || 0}
        isAuthenticated={user?.isAuthenticated || false}
        username={user?.username || "Guest"}
        onLoginClick={() => setAuthModalOpen(true)}
        onLogoutClick={() => {}}
      />
      
      <AuthModal />

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
              Featured <span className="gradient-text">Premium Tips</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Check out our most popular recommendations with high success rates. 
              Join thousands of winning bettors today.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {featuredRecommendations.map((rec) => (
              <RecommendationCard
                key={rec.id}
                {...rec}
                userBalance={user?.balance || 0}
                onPurchase={handlePurchase}
              />
            ))}
          </div>
          
          <div className="text-center">
            <PremiumButton variant="premium" size="lg" onClick={handleGetStarted}>
              View All Recommendations
              <ArrowRight className="h-4 w-4" />
            </PremiumButton>
          </div>
        </div>
      </section>

      {/* Social Proof & Testimonials */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Trusted by <span className="gradient-text">10,000+</span> Bettors
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              See what our community is saying about SportXBet premium tips
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="gradient-card shadow-card">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <img 
                      src={testimonial.avatar} 
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <h4 className="font-semibold">{testimonial.name}</h4>
                      <div className="flex items-center gap-1">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-muted-foreground italic">"{testimonial.comment}"</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-primary mb-2">10,000+</div>
                <div className="text-sm text-muted-foreground">Active Users</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-green-success mb-2">78%</div>
                <div className="text-sm text-muted-foreground">Win Rate</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-primary mb-2">₹5M+</div>
                <div className="text-sm text-muted-foreground">Winnings Paid</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-green-success mb-2">24/7</div>
                <div className="text-sm text-muted-foreground">Support</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How SportXBet <span className="gradient-text">Works</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Get started with premium sports betting tips in just 3 simple steps
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center gradient-card shadow-card">
              <CardContent className="p-8">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full gradient-gold flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-xl">1</span>
                </div>
                <h3 className="text-xl font-bold mb-4">Sign Up & Add Funds</h3>
                <p className="text-muted-foreground">
                  Create your account and add funds to your wallet securely. Get ₹25 welcome bonus!
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center gradient-card shadow-card">
              <CardContent className="p-8">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full gradient-success flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-xl">2</span>
                </div>
                <h3 className="text-xl font-bold mb-4">Browse Premium Tips</h3>
                <p className="text-muted-foreground">
                  Explore our curated recommendations from professional analysts with proven track records.
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center gradient-card shadow-card">
              <CardContent className="p-8">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full gradient-urgent flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-xl">3</span>
                </div>
                <h3 className="text-xl font-bold mb-4">Place Bets & Win</h3>
                <p className="text-muted-foreground">
                  Follow our expert analysis and place your bets with confidence. Track your success!
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose <span className="gradient-text">SportXBet</span>?
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="gradient-card shadow-card">
              <CardContent className="p-6">
                <Target className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-lg font-bold mb-2">Expert Analysis</h3>
                <p className="text-sm text-muted-foreground">
                  Professional analysts with years of experience in sports betting
                </p>
              </CardContent>
            </Card>
            
            <Card className="gradient-card shadow-card">
              <CardContent className="p-6">
                <Shield className="h-12 w-12 text-green-success mb-4" />
                <h3 className="text-lg font-bold mb-2">Secure Platform</h3>
                <p className="text-sm text-muted-foreground">
                  Bank-grade security with encrypted transactions and data protection
                </p>
              </CardContent>
            </Card>
            
            <Card className="gradient-card shadow-card">
              <CardContent className="p-6">
                <Clock className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-lg font-bold mb-2">Real-time Updates</h3>
                <p className="text-sm text-muted-foreground">
                  Get instant notifications for new tips and live match updates
                </p>
              </CardContent>
            </Card>
            
            <Card className="gradient-card shadow-card">
              <CardContent className="p-6">
                <TrendingUp className="h-12 w-12 text-green-success mb-4" />
                <h3 className="text-lg font-bold mb-2">High Success Rate</h3>
                <p className="text-sm text-muted-foreground">
                  Proven track record with 78% average success rate across all sports
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-card/50">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <Crown className="h-16 w-16 text-primary mx-auto mb-6" />
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Start <span className="gradient-text">Winning</span>?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join SportXBet today and get access to premium sports betting tips from expert analysts. 
              Your winning streak starts here!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <PremiumButton variant="gold" size="xl" onClick={handleGetStarted}>
                <Zap className="h-5 w-5" />
                Get Started Now
              </PremiumButton>
              <Button variant="outline" size="lg">
                Learn More
              </Button>
            </div>
            <div className="mt-6 text-sm text-muted-foreground">
              ✨ Get ₹25 welcome bonus • No hidden fees • Cancel anytime
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
                <span className="font-bold text-lg">SportXBet</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Premium sports betting recommendations from professional analysts at SportXBet.
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
              <h4 className="font-semibold mb-4">Sports</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Football</li>
                <li>Basketball</li>
                <li>Tennis</li>
                <li>Cricket</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Help Center</li>
                <li>Contact Us</li>
                <li>Terms of Service</li>
                <li>Privacy Policy</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 SportXBet. All rights reserved. Bet responsibly.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;