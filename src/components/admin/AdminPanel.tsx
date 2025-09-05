import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useStore } from '@/stores/useStore';
import { Plus, Edit, Trash2, TrendingUp, Users, DollarSign, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface RecommendationForm {
  title: string;
  price: number;
  odds: number;
  confidence: number;
  bettingSites: string;
  expiresAt: string;
  maxPurchases: number;
  content: string;
  category: 'football' | 'basketball' | 'tennis' | 'other';
  isUrgent: boolean;
}

const initialForm: RecommendationForm = {
  title: '',
  price: 0,
  odds: 1.0,
  confidence: 3,
  bettingSites: '',
  expiresAt: '',
  maxPurchases: 100,
  content: '',
  category: 'football',
  isUrgent: false
};

export function AdminPanel() {
  const { isAdminPanelOpen, setAdminPanelOpen, recommendations, addRecommendation, updateRecommendation, deleteRecommendation, purchases, transactions } = useStore();
  const [form, setForm] = useState<RecommendationForm>(initialForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.title || !form.bettingSites || form.price <= 0) {
      toast({
        title: "Error",
        description: "Please fill all required fields",
        variant: "destructive"
      });
      return;
    }

    const recommendation = {
      id: editingId || Date.now().toString(),
      ...form,
      currentPurchases: editingId ? recommendations.find(r => r.id === editingId)?.currentPurchases || 0 : 0,
      status: 'active' as const
    };

    if (editingId) {
      updateRecommendation(editingId, recommendation);
      toast({
        title: "Success",
        description: "Recommendation updated successfully"
      });
    } else {
      addRecommendation(recommendation);
      toast({
        title: "Success", 
        description: "New recommendation added successfully"
      });
    }

    setForm(initialForm);
    setEditingId(null);
  };

  const handleEdit = (rec: any) => {
    setForm({
      title: rec.title,
      price: rec.price,
      odds: rec.odds,
      confidence: rec.confidence,
      bettingSites: rec.bettingSites,
      expiresAt: rec.expiresAt.slice(0, 16), // Format for datetime-local input
      maxPurchases: rec.maxPurchases || 100,
      content: rec.content || '',
      category: rec.category || 'football',
      isUrgent: rec.isUrgent
    });
    setEditingId(rec.id);
  };

  const handleDelete = (id: string) => {
    deleteRecommendation(id);
    toast({
      title: "Deleted",
      description: "Recommendation deleted successfully"
    });
  };

  const handleMarkResult = (id: string, result: 'hit' | 'miss') => {
    updateRecommendation(id, { result, status: 'completed' });
    toast({
      title: "Updated",
      description: `Recommendation marked as ${result}`
    });
  };

  const stats = {
    totalRecommendations: recommendations.length,
    totalPurchases: purchases.length,
    totalRevenue: transactions.filter(t => t.type === 'purchase').reduce((sum, t) => sum + t.amount, 0),
    activeRecommendations: recommendations.filter(r => r.status === 'active').length
  };

  return (
    <Dialog open={isAdminPanelOpen} onOpenChange={setAdminPanelOpen}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>SportXBet Admin Panel</DialogTitle>
          <DialogDescription>
            Manage recommendations and monitor platform performance
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="create" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="create">Create/Edit</TabsTrigger>
            <TabsTrigger value="manage">Manage Tips</TabsTrigger>
            <TabsTrigger value="results">Results</TabsTrigger>
            <TabsTrigger value="stats">Statistics</TabsTrigger>
          </TabsList>

          <TabsContent value="create" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  {editingId ? 'Edit Recommendation' : 'Create New Recommendation'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Title *</Label>
                      <Input
                        id="title"
                        value={form.title}
                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                        placeholder="Manchester United vs Arsenal - Over 2.5 Goals"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select value={form.category} onValueChange={(value: any) => setForm({ ...form, category: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="football">Football</SelectItem>
                          <SelectItem value="basketball">Basketball</SelectItem>
                          <SelectItem value="tennis">Tennis</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="price">Price (₹) *</Label>
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        min="0"
                        value={form.price}
                        onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) || 0 })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="odds">Odds</Label>
                      <Input
                        id="odds"
                        type="number"
                        step="0.01"
                        min="1"
                        value={form.odds}
                        onChange={(e) => setForm({ ...form, odds: parseFloat(e.target.value) || 1.0 })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confidence">Confidence (1-5)</Label>
                      <Select value={form.confidence.toString()} onValueChange={(value) => setForm({ ...form, confidence: parseInt(value) })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 Star</SelectItem>
                          <SelectItem value="2">2 Stars</SelectItem>
                          <SelectItem value="3">3 Stars</SelectItem>
                          <SelectItem value="4">4 Stars</SelectItem>
                          <SelectItem value="5">5 Stars</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="bettingSites">Betting Sites *</Label>
                      <Input
                        id="bettingSites"
                        value={form.bettingSites}
                        onChange={(e) => setForm({ ...form, bettingSites: e.target.value })}
                        placeholder="Bet365, William Hill, Betfair"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="maxPurchases">Max Purchases</Label>
                      <Input
                        id="maxPurchases"
                        type="number"
                        min="1"
                        value={form.maxPurchases}
                        onChange={(e) => setForm({ ...form, maxPurchases: parseInt(e.target.value) || 100 })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="expiresAt">Expires At</Label>
                    <Input
                      id="expiresAt"
                      type="datetime-local"
                      value={form.expiresAt}
                      onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="content">Tip Content</Label>
                    <Textarea
                      id="content"
                      value={form.content}
                      onChange={(e) => setForm({ ...form, content: e.target.value })}
                      placeholder="Detailed analysis and reasoning for this tip..."
                      rows={4}
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="urgent"
                      checked={form.isUrgent}
                      onCheckedChange={(checked) => setForm({ ...form, isUrgent: checked })}
                    />
                    <Label htmlFor="urgent">Mark as Urgent</Label>
                  </div>

                  <div className="flex gap-2">
                    <Button type="submit" className="gradient-gold">
                      {editingId ? 'Update Recommendation' : 'Create Recommendation'}
                    </Button>
                    {editingId && (
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => {
                          setForm(initialForm);
                          setEditingId(null);
                        }}
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="manage" className="space-y-4">
            <div className="space-y-4">
              {recommendations.map((rec) => (
                <Card key={rec.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold">{rec.title}</h4>
                          {rec.isUrgent && <Badge variant="destructive">Urgent</Badge>}
                          <Badge variant="outline">{rec.category}</Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          ₹{rec.price} • {rec.odds} odds • {rec.confidence}/5 confidence
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {rec.currentPurchases} purchases • Expires: {new Date(rec.expiresAt).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline" onClick={() => handleEdit(rec)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDelete(rec.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="results" className="space-y-4">
            <div className="space-y-4">
              {recommendations.filter(r => r.status === 'active').map((rec) => (
                <Card key={rec.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold">{rec.title}</h4>
                        <div className="text-sm text-muted-foreground">
                          {rec.currentPurchases} purchases • {rec.odds} odds
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          className="gradient-success"
                          onClick={() => handleMarkResult(rec.id, 'hit')}
                        >
                          Mark Hit ✅
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => handleMarkResult(rec.id, 'miss')}
                        >
                          Mark Miss ❌
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="stats" className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-4 w-4 text-primary" />
                    <span className="text-sm text-muted-foreground">Total Tips</span>
                  </div>
                  <div className="text-2xl font-bold">{stats.totalRecommendations}</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="h-4 w-4 text-green-success" />
                    <span className="text-sm text-muted-foreground">Total Sales</span>
                  </div>
                  <div className="text-2xl font-bold text-green-success">{stats.totalPurchases}</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="h-4 w-4 text-primary" />
                    <span className="text-sm text-muted-foreground">Revenue</span>
                  </div>
                  <div className="text-2xl font-bold">₹{stats.totalRevenue.toFixed(2)}</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="h-4 w-4 text-primary" />
                    <span className="text-sm text-muted-foreground">Active Tips</span>
                  </div>
                  <div className="text-2xl font-bold text-primary">{stats.activeRecommendations}</div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {transactions.slice(-10).reverse().map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-2 rounded bg-background/50">
                      <div className="text-sm">
                        <div className="font-medium">{transaction.description}</div>
                        <div className="text-muted-foreground">{new Date(transaction.date).toLocaleString()}</div>
                      </div>
                      <div className={`font-medium ${transaction.type === 'deposit' ? 'text-green-success' : 'text-red-urgent'}`}>
                        {transaction.type === 'deposit' ? '+' : '-'}₹{transaction.amount.toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}