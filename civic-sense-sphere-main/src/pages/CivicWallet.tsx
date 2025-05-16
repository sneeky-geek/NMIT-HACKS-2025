
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { civicScore, mockTransactions } from "@/components/mock-data";
import { ArrowUp, ArrowDown, Coins, Gift, TrendingUp, Calendar } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const CivicWallet = () => {
  // Calculate total balance
  const totalBalance = mockTransactions.reduce((total, transaction) => {
    if (transaction.type === "earned") {
      return total + transaction.amount;
    } else {
      return total - transaction.amount;
    }
  }, 100); // Starting with 100 coins
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-8">
        <div className="container px-4 mx-auto">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-4">Civic Wallet</h1>
            <p className="text-muted-foreground mb-8">
              Manage your Civic Coins and track your civic engagement metrics
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="col-span-1 md:col-span-2">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Coin Balance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <Coins className="h-8 w-8 mr-4 text-yellow-500" />
                    <div className="text-4xl font-bold">{totalBalance}</div>
                  </div>
                  <div className="flex items-center justify-between mt-6">
                    <Button variant="outline" size="sm" className="flex items-center">
                      <Gift className="h-4 w-4 mr-2" />
                      Redeem Rewards
                    </Button>
                    <Button size="sm" className="flex items-center">
                      <Coins className="h-4 w-4 mr-2" />
                      Earn More
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Civic Score</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center">
                    <div className="relative w-24 h-24 flex items-center justify-center">
                      <svg className="w-full h-full" viewBox="0 0 100 100">
                        <circle
                          className="text-muted stroke-current"
                          strokeWidth="10"
                          fill="transparent"
                          r="40"
                          cx="50"
                          cy="50"
                        />
                        <circle
                          className="text-primary stroke-current"
                          strokeWidth="10"
                          strokeLinecap="round"
                          fill="transparent"
                          r="40"
                          cx="50"
                          cy="50"
                          strokeDasharray={`${civicScore.overall * 2.51} 251`}
                          strokeDashoffset="0"
                          transform="rotate(-90 50 50)"
                        />
                      </svg>
                      <span className="absolute text-2xl font-bold">
                        {civicScore.overall}
                      </span>
                    </div>
                    <div className="flex items-center mt-2 text-sm text-muted-foreground">
                      <TrendingUp className="h-4 w-4 mr-1" /> 
                      +5 this month
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Score Breakdown</CardTitle>
                <CardDescription>
                  Your civic score categorized by different areas of engagement
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {civicScore.categories.map((category) => (
                    <div key={category.name} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span>{category.name}</span>
                        <span className="font-medium">{category.score}/100</span>
                      </div>
                      <Progress value={category.score} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Transaction History</CardTitle>
                <CardDescription>
                  Recent activity in your Civic Wallet
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="all">
                  <TabsList className="mb-4">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="earned">Earned</TabsTrigger>
                    <TabsTrigger value="spent">Spent</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="all">
                    <div className="space-y-4">
                      {mockTransactions.map((transaction) => (
                        <div key={transaction.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                          <div className="flex items-center">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${transaction.type === "earned" ? "bg-green-500/10" : "bg-red-500/10"}`}>
                              {transaction.type === "earned" ? (
                                <ArrowUp className="h-5 w-5 text-green-500" />
                              ) : (
                                <ArrowDown className="h-5 w-5 text-red-500" />
                              )}
                            </div>
                            <div>
                              <div className="font-medium">{transaction.description}</div>
                              <div className="flex items-center text-xs text-muted-foreground">
                                <Calendar className="h-3 w-3 mr-1" />
                                {transaction.date}
                              </div>
                            </div>
                          </div>
                          <div className={`font-medium ${transaction.type === "earned" ? "text-green-500" : "text-red-500"}`}>
                            {transaction.type === "earned" ? "+" : "-"}{transaction.amount}
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="earned">
                    <div className="space-y-4">
                      {mockTransactions
                        .filter(t => t.type === "earned")
                        .map((transaction) => (
                          <div key={transaction.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                            <div className="flex items-center">
                              <div className="w-10 h-10 rounded-full flex items-center justify-center mr-3 bg-green-500/10">
                                <ArrowUp className="h-5 w-5 text-green-500" />
                              </div>
                              <div>
                                <div className="font-medium">{transaction.description}</div>
                                <div className="flex items-center text-xs text-muted-foreground">
                                  <Calendar className="h-3 w-3 mr-1" />
                                  {transaction.date}
                                </div>
                              </div>
                            </div>
                            <div className="font-medium text-green-500">
                              +{transaction.amount}
                            </div>
                          </div>
                        ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="spent">
                    <div className="space-y-4">
                      {mockTransactions
                        .filter(t => t.type === "spent")
                        .map((transaction) => (
                          <div key={transaction.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                            <div className="flex items-center">
                              <div className="w-10 h-10 rounded-full flex items-center justify-center mr-3 bg-red-500/10">
                                <ArrowDown className="h-5 w-5 text-red-500" />
                              </div>
                              <div>
                                <div className="font-medium">{transaction.description}</div>
                                <div className="flex items-center text-xs text-muted-foreground">
                                  <Calendar className="h-3 w-3 mr-1" />
                                  {transaction.date}
                                </div>
                              </div>
                            </div>
                            <div className="font-medium text-red-500">
                              -{transaction.amount}
                            </div>
                          </div>
                        ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <footer className="py-8 border-t mt-12">
        <div className="container px-4 mx-auto">
          <div className="text-center text-sm text-muted-foreground">
            © 2025 CiviX. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CivicWallet;
