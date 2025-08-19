import { Wallet, Plus, TrendingUp, TrendingDown, History } from "lucide-react";
import { PremiumButton } from "@/components/ui/button-variants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Transaction {
  type: 'deposit' | 'purchase';
  amount: number;
  description: string;
  date: string;
}

interface WalletCardProps {
  balance: number;
  recentTransactions?: Transaction[];
  onDeposit?: () => void;
  onViewHistory?: () => void;
}

export function WalletCard({ 
  balance, 
  recentTransactions = [], 
  onDeposit, 
  onViewHistory 
}: WalletCardProps) {
  return (
    <Card className="gradient-card shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <div className="p-2 rounded-lg gradient-gold">
            <Wallet className="h-5 w-5 text-primary-foreground" />
          </div>
          Your Wallet
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Balance Display */}
        <div className="text-center p-6 rounded-lg bg-background/50">
          <div className="text-sm text-muted-foreground mb-2">Available Balance</div>
          <div className="text-4xl font-bold text-green-success mb-4">
            ${balance.toFixed(2)}
          </div>
          <Badge variant={balance > 0 ? "default" : "secondary"} className="px-4 py-1">
            {balance > 0 ? "Active Account" : "Fund Required"}
          </Badge>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <PremiumButton variant="success" onClick={onDeposit} className="flex-1">
            <Plus className="h-4 w-4" />
            Add Funds
          </PremiumButton>
          <PremiumButton variant="glass" onClick={onViewHistory} className="flex-1">
            <History className="h-4 w-4" />
            History
          </PremiumButton>
        </div>

        {/* Recent Transactions */}
        {recentTransactions.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-semibold text-sm text-muted-foreground">Recent Activity</h4>
            <div className="space-y-2">
              {recentTransactions.slice(0, 3).map((transaction, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg bg-background/30"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-1 rounded ${
                      transaction.type === 'deposit' ? 'bg-green-success/20' : 'bg-red-urgent/20'
                    }`}>
                      {transaction.type === 'deposit' ? (
                        <TrendingUp className="h-4 w-4 text-green-success" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-urgent" />
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-medium">
                        {transaction.description}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {transaction.date}
                      </div>
                    </div>
                  </div>
                  <div className={`font-medium ${
                    transaction.type === 'deposit' ? 'text-green-success' : 'text-red-urgent'
                  }`}>
                    {transaction.type === 'deposit' ? '+' : '-'}${transaction.amount.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Low Balance Warning */}
        {balance < 10 && (
          <div className="p-4 rounded-lg bg-red-urgent/10 border border-red-urgent/20">
            <div className="text-sm text-red-urgent font-medium mb-2">
              ⚠️ Low Balance Warning
            </div>
            <div className="text-xs text-muted-foreground">
              Add funds to continue purchasing premium recommendations
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}