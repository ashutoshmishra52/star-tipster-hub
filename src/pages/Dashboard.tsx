import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { WalletCard } from "@/components/wallet/WalletCard";
import { RecommendationCard } from "@/components/recommendations/RecommendationCard";
import { PremiumButton } from "@/components/ui/button-variants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, Clock, ShoppingBag, BarChart3, Star, Target } from "lucide-react";

// Mock data - replace with actual API calls
const mockUser = {
  id: 1,
  username: "sportspro_user",
  balance: 45.50,
  isAuthenticated: true,
};

const mockRecommendations = [
  {
    id: 1,
    title: "Manchester United vs Arsenal - Over 2.5 Goals",
    price: 15.99,
    odds: 1.85,
    confidence: 4,
    bettingSites: "Bet365, William Hill, Betfair",
    expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours
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
    bettingSites: "DraftKings, FanDuel, PointsBet",
    expiresAt: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(), // 6 hours
    maxPurchases: 50,
    currentPurchases: 23,
    isUrgent: false,
  },
  {
    id: 3,
    title: "Chelsea vs Liverpool - Both Teams to Score",
    price: 18.99,
    odds: 1.78,
    confidence: 3,
    bettingSites: "Unibet, Ladbrokes, Coral",
    expiresAt: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(), // 12 hours
    currentPurchases: 45,
    isUrgent: false,
  },
];

const mockTransactions = [
  {
    type: 'deposit' as const,
    amount: 50.00,
    description: 'Wallet Top-up',
    date: '2024-01-15 14:30',
  },
  {
    type: 'purchase' as const,
    amount: 15.99,
    description: 'Man Utd vs Arsenal tip',
    date: '2024-01-15 12:15',
  },
  {
    type: 'purchase' as const,
    amount: 12.99,
    description: 'Lakers vs Warriors tip',
    date: '2024-01-14 20:45',
  },
];

const mockPurchases = [
  {
    id: 1,
    title: "Real Madrid vs Barcelona - Real Madrid Win",
    price: 19.99,
    odds: 2.15,
    result: "hit",
    purchaseDate: "2024-01-14 15:30",
    content: "Exclusive analysis revealed...",
  },
  {
    id: 2,
    title: "Patriots vs Bills - Under 45.5 Points",
    price: 14.99,
    odds: 1.88,
    result: "miss",
    purchaseDate: "2024-01-13 18:20",
    content: "Weather conditions analysis...",
  },
];

export default function Dashboard() {
  const [activeRecommendations, setActiveRecommendations] = useState(mockRecommendations);
  const [user, setUser] = useState(mockUser);

  const handlePurchase = (id: number) => {
    const recommendation = activeRecommendations.find(r => r.id === id);
    if (!recommendation) return;

    if (user.balance >= recommendation.price) {
      // Simulate purchase
      setUser(prev => ({
        ...prev,
        balance: prev.balance - recommendation.price
      }));
      
      // Update purchases count
      setActiveRecommendations(prev => 
        prev.map(r => 
          r.id === id ? { ...r, currentPurchases: r.currentPurchases + 1 } : r
        )
      );
      
      alert(`Successfully purchased: ${recommendation.title}`);
    } else {
      alert("Insufficient balance!");
    }
  };

  const stats = {
    totalPurchases: mockPurchases.length,
    successRate: Math.round((mockPurchases.filter(p => p.result === "hit").length / mockPurchases.length) * 100),
    totalSpent: mockPurchases.reduce((sum, p) => sum + p.price, 0),
    activeRecommendations: activeRecommendations.length,
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        userBalance={user.balance}
        isAuthenticated={user.isAuthenticated}
        username={user.username}
        onLoginClick={() => console.log("Login clicked")}
        onLogoutClick={() => console.log("Logout clicked")}
      />

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
              <div className="text-2xl font-bold">${stats.totalSpent.toFixed(2)}</div>
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
              recentTransactions={mockTransactions}
              onDeposit={() => console.log("Deposit clicked")}
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
                    {activeRecommendations.length} Available
                  </Badge>
                </div>
                
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {activeRecommendations.map((rec) => (
                    <RecommendationCard
                      key={rec.id}
                      {...rec}
                      userBalance={user.balance}
                      onPurchase={handlePurchase}
                    />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="purchases" className="space-y-6">
                <h2 className="text-2xl font-bold">My Purchases</h2>
                <div className="space-y-4">
                  {mockPurchases.map((purchase) => (
                    <Card key={purchase.id}>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-semibold">{purchase.title}</h3>
                          <Badge variant={purchase.result === "hit" ? "default" : "destructive"}>
                            {purchase.result === "hit" ? "✅ Hit" : "❌ Miss"}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Price: </span>
                            <span className="font-medium">${purchase.price}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Odds: </span>
                            <span className="font-medium">{purchase.odds}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Date: </span>
                            <span className="font-medium">{purchase.purchaseDate}</span>
                          </div>
                          <div className="md:text-right">
                            <PremiumButton variant="glass" size="sm">
                              View Details
                            </PremiumButton>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
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
    </div>
  );
}