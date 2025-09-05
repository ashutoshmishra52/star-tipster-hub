import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { WalletCard } from "@/components/wallet/WalletCard";
import { RecommendationCard } from "@/components/recommendations/RecommendationCard";
import { PremiumButton } from "@/components/ui/button-variants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AuthModal } from "@/components/auth/AuthModal";
import { AdminPanel } from "@/components/admin/AdminPanel";
import { DepositModal } from "@/components/deposit/DepositModal";
import { useStore } from "@/stores/useStore";
import { Trophy, Clock, ShoppingBag, BarChart3, Star, Target, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Dashboard() {
  const { 
    user, 
    recommendations, 
    purchases, 
    transactions,
    purchaseRecommendation,
    logout,
    setAdminPanelOpen,
    setRecommendations
  } = useStore();
  
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const { toast } = useToast();

  // Initialize with sample data if empty
  useEffect(() => {
    if (recommendations.length === 0) {
      const sampleRecommendations = [
        {
          id: '1',
          title: "Manchester United vs Arsenal - Over 2.5 Goals",
          price: 15.99,
          odds: 1.85,
          confidence: 4,
          bettingSites: "Bet365, William Hill, Betfair",
          expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
          maxPurchases: 100,
          currentPurchases: 67,
          isUrgent: true,
          category: 'football' as const,
          status: 'active' as const,
          content: "Manchester United's attacking form has been exceptional at home, while Arsenal's defense shows vulnerabilities against high-pressing teams. Both teams have scored in 8 of their last 10 meetings."
        },
        {
          id: '2',
          title: "Lakers vs Warriors - Lakers +5.5",
          price: 12.99,
          odds: 1.92,
          confidence: 5,
          bettingSites: "DraftKings, FanDuel, PointsBet",
          expiresAt: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
          maxPurchases: 50,
          currentPurchases: 23,
          isUrgent: false,
          category: 'basketball' as const,
          status: 'active' as const,
          content: "Lakers have covered the spread in 4 of their last 5 games against Golden State. Their defensive improvements under the new coaching system give them excellent value at +5.5."
        },
        {
          id: '3',
          title: "Chelsea vs Liverpool - Both Teams to Score",
          price: 18.99,
          odds: 1.78,
          confidence: 3,
          bettingSites: "Unibet, Ladbrokes, Coral",
          expiresAt: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
          currentPurchases: 45,
          isUrgent: false,
          category: 'football' as const,
          status: 'active' as const,
          content: "Both teams have strong attacking options and have struggled defensively in recent matches. Statistical analysis shows 85% probability of both teams scoring."
        }
      ];
      setRecommendations(sampleRecommendations);
    }
  }, [recommendations.length, setRecommendations]);

  if (!user?.isAuthenticated) {
    window.location.href = "/";
    return null;
  }

  const handlePurchase = (id: string) => {
    purchaseRecommendation(id);
    const recommendation = recommendations.find(r => r.id === id);
    if (recommendation) {
      toast({
        title: "Purchase Successful!",
        description: `You've purchased: ${recommendation.title}`,
      });
    }
  };

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  const stats = {
    totalPurchases: purchases.length,
    successRate: purchases.length > 0 ? Math.round((purchases.filter(p => p.result === "hit").length / purchases.length) * 100) : 0,
    totalSpent: purchases.reduce((sum, p) => sum + p.price, 0),
    activeRecommendations: recommendations.filter(r => r.status === 'active').length,
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        userBalance={user.balance}
        isAuthenticated={user.isAuthenticated}
        username={user.username}
        onLoginClick={() => {}}
        onLogoutClick={handleLogout}
      />

      {/* Admin Button */}
      {user.isAdmin && (
        <div className="fixed bottom-4 right-4 z-50">
          <PremiumButton 
            variant="premium" 
            onClick={() => setAdminPanelOpen(true)}
            className="shadow-lg"
          >
            <Settings className="h-4 w-4" />
            Admin Panel
          </PremiumButton>
        </div>
      )}

      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, <span className="text-primary">{user.username}</span>! 👋
          </h1>
          <p className="text-muted-foreground">
            Ready to make some winning bets? Check out our latest recommendations below.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Purchases</span>
              </div>
              <div className="text-2xl font-bold">{stats.totalPurchases}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <Target className="h-4 w-4 text-green-success" />
                <span className="text-sm text-muted-foreground">Success Rate</span>
              </div>
              <div className="text-2xl font-bold text-green-success">{stats.successRate}%</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Total Spent</span>
              </div>
              <div className="text-2xl font-bold">₹{stats.totalSpent.toFixed(2)}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-primary" />
                <span className="text-sm text-muted-foreground">Active Tips</span>
              </div>
              <div className="text-2xl font-bold text-primary">{stats.activeRecommendations}</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <WalletCard
              balance={user.balance}
              recentTransactions={transactions.slice(-3)}
              onDeposit={() => setIsDepositModalOpen(true)}
              onViewHistory={() => console.log("View history clicked")}
            />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="recommendations" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="recommendations">Live Recommendations</TabsTrigger>
                <TabsTrigger value="purchases">My Purchases</TabsTrigger>
                <TabsTrigger value="history">Results History</TabsTrigger>
              </TabsList>

              <TabsContent value="recommendations" className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    <Trophy className="h-6 w-6 text-primary" />
                    Live Recommendations
                  </h2>
                  <Badge variant="secondary" className="px-3 py-1">
                    {recommendations.filter(r => r.status === 'active').length} Available
                  </Badge>
                </div>
                
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {recommendations.filter(r => r.status === 'active').map((rec) => (
                    <RecommendationCard
                      key={rec.id}
                      {...rec}
                      userBalance={user.balance}
                      onPurchase={handlePurchase}
                    />
                  ))}
                </div>
                
                {recommendations.filter(r => r.status === 'active').length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    <Trophy className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p>No active recommendations available at the moment.</p>
                    <p className="text-sm">Check back soon for new premium tips!</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="purchases" className="space-y-6">
                <h2 className="text-2xl font-bold">My Purchases</h2>
                <div className="space-y-4">
                  {purchases.map((purchase) => (
                    <Card key={purchase.id}>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-semibold">{purchase.title}</h3>
                          <Badge variant={purchase.result === "hit" ? "default" : purchase.result === "miss" ? "destructive" : "secondary"}>
                            {purchase.result === "hit" ? "✅ Hit" : purchase.result === "miss" ? "❌ Miss" : "⏳ Pending"}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                          <div>
                            <span className="text-muted-foreground">Price: </span>
                            <span className="font-medium">₹{purchase.price}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Odds: </span>
                            <span className="font-medium">{purchase.odds}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Date: </span>
                            <span className="font-medium">{new Date(purchase.purchaseDate).toLocaleDateString()}</span>
                          </div>
                          <div className="md:text-right">
                            <PremiumButton variant="glass" size="sm">
                              View Details
                            </PremiumButton>
                          </div>
                        </div>
                        <div className="p-4 bg-accent/10 rounded-lg">
                          <p className="text-sm">{purchase.content}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  
                  {purchases.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                      <ShoppingBag className="h-16 w-16 mx-auto mb-4 opacity-50" />
                      <p>No purchases yet.</p>
                      <p className="text-sm">Browse our recommendations to get started!</p>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="history" className="space-y-6">
                <h2 className="text-2xl font-bold">Platform Results History</h2>
                <div className="text-center py-12 text-muted-foreground">
                  <BarChart3 className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p>Results history will be displayed here once available.</p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>

      <AuthModal />
      <AdminPanel />
      <DepositModal 
        isOpen={isDepositModalOpen} 
        onClose={() => setIsDepositModalOpen(false)} 
      />
    </div>
  );
}