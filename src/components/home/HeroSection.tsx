import { Trophy, TrendingUp, Shield, Users } from "lucide-react";
import { PremiumButton } from "@/components/ui/button-variants";
import { Badge } from "@/components/ui/badge";

interface HeroSectionProps {
  onGetStarted?: () => void;
}

export function HeroSection({ onGetStarted }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden py-20 lg:py-32">
      {/* Background gradient */}
      <div className="absolute inset-0 gradient-hero" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/90 to-background/50" />
      
      {/* Floating elements */}
      <div className="absolute top-20 left-10 animate-float">
        <div className="w-20 h-20 rounded-full bg-gold-primary/20 blur-xl" />
      </div>
      <div className="absolute bottom-20 right-10 animate-float" style={{ animationDelay: "1s" }}>
        <div className="w-32 h-32 rounded-full bg-green-success/20 blur-xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <Badge variant="secondary" className="mb-6 px-4 py-2 text-sm animate-pulse-gold">
            🏆 #1 Sports Betting Recommendations Platform
          </Badge>

          {/* Main Headline */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-gold-secondary to-green-success bg-clip-text text-transparent">
            Premium Sports
            <br />
            Betting Intelligence
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Get exclusive recommendations from professional analysts with proven track records. 
            <span className="text-green-success font-semibold"> Start winning today.</span>
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-green-success">85%</div>
              <div className="text-sm text-muted-foreground">Win Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-primary">1000+</div>
              <div className="text-sm text-muted-foreground">Happy Users</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-blue-info">24/7</div>
              <div className="text-sm text-muted-foreground">Support</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-purple-premium">5★</div>
              <div className="text-sm text-muted-foreground">Rating</div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <PremiumButton 
              variant="gold" 
              size="xl" 
              onClick={onGetStarted}
              className="animate-glow"
            >
              <Trophy className="h-5 w-5" />
              Start Winning Now
            </PremiumButton>
            <PremiumButton variant="glass" size="xl">
              View Track Record
            </PremiumButton>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg gradient-gold mb-4">
                <TrendingUp className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="font-semibold mb-2">Expert Analysis</h3>
              <p className="text-sm text-muted-foreground">Professional analysts with years of experience</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg gradient-success mb-4">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold mb-2">Proven Results</h3>
              <p className="text-sm text-muted-foreground">Transparent track record and verified wins</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-blue-info mb-4">
                <Users className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold mb-2">Community</h3>
              <p className="text-sm text-muted-foreground">Join thousands of successful bettors</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}