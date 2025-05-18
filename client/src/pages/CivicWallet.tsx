import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { API_CONFIG, getApiUrl } from "@/config";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { useCivicCoins } from "@/contexts/CivicCoinsContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { civicScore, mockTransactions, mockRewards, RewardCoupon } from "@/components/mock-data";
import { ArrowUp, ArrowDown, Coins, Gift, TrendingUp, Calendar, ChevronUp, ChevronDown, Award, CreditCard, Shield, ZapIcon, Sparkles, Tag } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "next-themes";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import CivicCoin from "@/components/CivicCoin";
import { RewardCouponCard } from "@/components/RewardCouponCard";
import { RewardFilters } from "@/components/RewardFilters";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";

// Premium Civic Card Component
const CivicCard = () => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const [isFlipped, setIsFlipped] = useState(false);
  const [scoreLoading, setScoreLoading] = useState(true);
  const [scoreProgress, setScoreProgress] = useState(0);
  const [scoreLevel, setScoreLevel] = useState("Good");
  const [trendingUp, setTrendingUp] = useState(true);
  const [lastMonthScore, setLastMonthScore] = useState(75);

  const getScoreColor = (score: number) => {
    const percentage = civicScore.maxScore ? (score / civicScore.maxScore) * 100 : score;
    if (percentage >= 90) return "bg-gradient-to-r from-emerald-500 to-emerald-600";
    if (percentage >= 75) return "bg-gradient-to-r from-blue-500 to-blue-600";
    if (percentage >= 60) return "bg-gradient-to-r from-amber-500 to-amber-600";
    return "bg-gradient-to-r from-red-500 to-red-600";
  };

  const getScoreLevel = (score: number) => {
    const percentage = civicScore.maxScore ? (score / civicScore.maxScore) * 100 : score;
    if (percentage >= 90) return "Excellent";
    if (percentage >= 75) return "Good";
    if (percentage >= 60) return "Average";
    return "Needs Improvement";
  };

  const cardVariants = {
    initial: { rotateY: 0 },
    flipped: { rotateY: 180 }
  };

  // Shimmer animation for card
  const shimmerVariants = {
    initial: { backgroundPosition: "0 0" },
    animate: { 
      backgroundPosition: ["0 0", "100% 100%"]
    }
  };

  useEffect(() => {
    // Simulate loading delay
    const loadTimer = setTimeout(() => {
      setScoreLoading(false);
      
      // Animate score filling
      const scoreTimer = setTimeout(() => {
        setScoreProgress(civicScore.overall);
      }, 400);
      
      return () => clearTimeout(scoreTimer);
    }, 1500);
    
    return () => clearTimeout(loadTimer);
  }, []);

  useEffect(() => {
    setScoreLevel(getScoreLevel(civicScore.overall));
    setTrendingUp(civicScore.overall > lastMonthScore);
  }, [scoreProgress]);

  return (
    <div className="perspective-1000">
      <motion.div 
        animate={isFlipped ? "flipped" : "initial"}
        variants={cardVariants}
        className="relative w-full max-w-md mx-auto"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Front of Card */}
        <motion.div 
          className={cn(
            "relative w-full h-56 sm:h-64 rounded-2xl overflow-hidden",
            "shadow-lg border border-white/10",
            "bg-gradient-to-br from-primary/10 via-primary/5 to-background/80",
            "backdrop-blur-lg p-5", 
            theme === "dark" ? "dark-card-glow" : "light-card-glow",
            "cursor-pointer"
          )}
          style={{ 
            transformStyle: "preserve-3d", 
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden"
          }}
          onClick={() => setIsFlipped(!isFlipped)}
        >
          <div className="relative flex flex-col h-full">
            {/* Header */}
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center">
                  <CreditCard className="h-5 w-5 mr-2 text-primary" />
                  <h3 className="font-bold text-xl tracking-wide">CIVIC CARD</h3>
                </div>
                <p className="text-sm opacity-70 mt-1">Member since 2024</p>
              </div>
              <motion.div 
                whileHover={{ scale: 1.05 }} 
                className="w-10 h-10 rounded-full flex items-center justify-center bg-primary/20 backdrop-blur-lg"
              >
                <Shield className="w-5 h-5 text-primary" />
              </motion.div>
            </div>

            {/* Horizontal Civic Score Display */}
            <div className="flex-1 flex items-center justify-center gap-4 my-1 px-2">
              <motion.div 
                key="score-circle-front"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className={`w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 ${getScoreColor(civicScore.overall)}`}
              >
                <span className="text-white font-bold text-lg">{civicScore.overall}</span>
              </motion.div>
              
              <div className="flex flex-col flex-grow justify-center">
                <div className="flex items-center gap-1 mb-1">
                  <p className="text-xs uppercase tracking-wide">
                    Civic Score 
                    <span className="text-xs opacity-70">{civicScore.overall}/{civicScore.maxScore}</span>
                  </p>
                  {trendingUp ? 
                    <ChevronUp className="h-3 w-3 text-green-500" /> : 
                    <ChevronDown className="h-3 w-3 text-red-500" />}
                </div>
                
                {!scoreLoading && (
                  <>
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.8 }}
                      className="text-xs mb-1">
                      {scoreLevel}
                    </motion.div>
                    
                    <motion.div 
                      className="w-full bg-primary/10 rounded-full overflow-hidden h-1"
                    >
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${(scoreProgress / civicScore.maxScore) * 100}%` }}
                        transition={{ delay: 1.8, duration: 1 }}
                        className="h-full bg-primary rounded-full"
                      />
                    </motion.div>
                  </>
                )}
              </div>
            </div>

            {/* User Info */}
            <div className="flex justify-between items-end">
              <div>
                <div className="flex items-center mb-1 space-x-2">
                  <Avatar className="h-8 w-8 border-2 border-primary/30">
                    <AvatarImage src="https://github.com/shadcn.png" alt="User" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  
                  <h4 className="font-semibold">{user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : "Jane Doe"}</h4>
                  
                  <Badge variant="outline" className="ml-2 bg-background/50 backdrop-blur-md">
                    Gold Tier
                  </Badge>
                </div>
                <p className="text-xs tracking-widest opacity-70">ID: {user?.id || "CX48672193"}</p>
              </div>
            </div>
            
            <motion.div 
              className="absolute bottom-3 right-5 text-xs opacity-60"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              transition={{ delay: 2 }}
            >
              Tap to flip
            </motion.div>
          </div>
        </motion.div>
        
        {/* Back of Card - Exact copy of front */}
        <motion.div 
          className={cn(
            "absolute inset-0 w-full h-56 sm:h-64 rounded-2xl overflow-hidden",
            "shadow-lg border border-white/10",
            "bg-gradient-to-br from-primary/10 via-primary/5 to-background/80",
            "backdrop-blur-lg p-5", 
            theme === "dark" ? "dark-card-glow" : "light-card-glow",
            "cursor-pointer"
          )}
          style={{ 
            transform: "rotateY(180deg)",
            transformStyle: "preserve-3d", 
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden"
          }}
          onClick={() => setIsFlipped(!isFlipped)}
        >
          <div className="relative flex flex-col h-full">
            {/* Header */}
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center">
                  <CreditCard className="h-5 w-5 mr-2 text-primary" />
                  <h3 className="font-bold text-xl tracking-wide">CIVIC CARD</h3>
                </div>
                <p className="text-sm opacity-70 mt-1">Member since 2024</p>
              </div>
              <motion.div 
                whileHover={{ scale: 1.05 }} 
                className="w-10 h-10 rounded-full flex items-center justify-center bg-primary/20 backdrop-blur-lg"
              >
                <Shield className="w-5 h-5 text-primary" />
              </motion.div>
            </div>

            {/* Horizontal Civic Score Display */}
            <div className="flex-1 flex items-center justify-center gap-4 my-1 px-2">
              <motion.div 
                key="score-circle-back"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className={`w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 ${getScoreColor(civicScore.overall)}`}
              >
                <span className="text-white font-bold text-lg">{civicScore.overall}</span>
              </motion.div>
              
              <div className="flex flex-col flex-grow justify-center">
                <div className="flex items-center gap-1 mb-1">
                  <p className="text-xs uppercase tracking-wide">
                    Civic Score 
                    <span className="text-xs opacity-70">{civicScore.overall}/{civicScore.maxScore}</span>
                  </p>
                  {trendingUp ? 
                    <ChevronUp className="h-3 w-3 text-green-500" /> : 
                    <ChevronDown className="h-3 w-3 text-red-500" />}
                </div>
                
                {!scoreLoading && (
                  <>
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.8 }}
                      className="text-xs mb-1">
                      {scoreLevel}
                    </motion.div>
                    
                    <motion.div 
                      className="w-full bg-primary/10 rounded-full overflow-hidden h-1"
                    >
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${(scoreProgress / civicScore.maxScore) * 100}%` }}
                        transition={{ delay: 1.8, duration: 1 }}
                        className="h-full bg-primary rounded-full"
                      />
                    </motion.div>
                  </>
                )}
              </div>
            </div>

            {/* User Info */}
            <div className="flex justify-between items-end">
              <div>
                <div className="flex items-center mb-1 space-x-2">
                  <Avatar className="h-8 w-8 border-2 border-primary/30">
                    <AvatarImage src="https://github.com/shadcn.png" alt="User" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  
                  <h4 className="font-semibold">{user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : "Jane Doe"}</h4>
                  
                  <Badge variant="outline" className="ml-2 bg-background/50 backdrop-blur-md">
                    Gold Tier
                  </Badge>
                </div>
                <p className="text-xs tracking-widest opacity-70">ID: {user?.id || "CX48672193"}</p>
              </div>
            </div>
            
            <motion.div 
              className="absolute bottom-3 right-5 text-xs opacity-60"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              transition={{ delay: 2 }}
            >
              Tap to flip
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

const CivicWallet = () => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const { civicCoins, addCoins } = useCivicCoins(); // Use global civic coins state
  const { toast } = useToast();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        <div className="container px-4 mx-auto py-8">
         
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-1">Civic Wallet</h1>
              <p className="text-muted-foreground">
                Manage your Civic Coins and track your civic engagement metrics
              </p>
            </div>
            <Button size="sm" className="mt-2 sm:mt-0 flex items-center">
              <Coins className="h-4 w-4 mr-2" />
              Earn More Coins
            </Button>
          </div>
          
          {/* Premium Civic Card Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Award className="h-5 w-5 mr-2 text-primary" /> 
              Your Civic Card
            </h2>
            <CivicCard />
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="col-span-1 md:col-span-2">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Civic Coins Balance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                  <div className="col-span-1 md:col-span-2">
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5 }}
                      className="flex justify-center"
                    >
                      <CivicCoin size="lg" animate={true} />
                    </motion.div>
                  </div>
                  <div className="col-span-1 md:col-span-3">
                    <div className="flex flex-col space-y-4">
                      <div>
                        <div className="flex items-center">
                          <div className="text-4xl font-bold mr-2">{civicCoins}</div>
                          <Badge variant="secondary" className="ml-2 bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
                            Gold Tier
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">Your current Civic Coins balance</p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3 mt-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex items-center justify-center"
                          onClick={() => {
                            const rewardsSection = document.getElementById('rewards-section');
                            if (rewardsSection) {
                              rewardsSection.scrollIntoView({ behavior: 'smooth' });
                            }
                          }}
                        >
                          <Gift className="h-4 w-4 mr-2" />
                          Redeem Rewards
                        </Button>
                        <Button 
                          variant="secondary" 
                          size="sm" 
                          className="flex items-center justify-center"
                          onClick={async () => {
                            // First update the UI optimistically
                            addCoins(500);
                            
                            // Show success toast notification immediately
                            toast({
                              title: "Coins Added!",
                              description: "You've earned 500 Civic Coins for your participation.",
                              variant: "default",
                            });
                            
                            // Then update the database in the background
                            try {
                              const token = localStorage.getItem('token');
                              if (token) {
                                await fetch(getApiUrl(API_CONFIG.ENDPOINTS.TOKENS.ADD), {
                                  method: 'POST',
                                  headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': `Bearer ${token}`
                                  },
                                  body: JSON.stringify({ 
                                    amount: 500,
                                    source: 'wallet_bonus',
                                    itemDetails: {
                                      reason: 'Earn More button clicked'
                                    }
                                  })
                                }).catch(err => {
                                  // Silently log any errors without showing to user
                                  console.error('Background save error (coins still added to UI):', err);
                                  // We won't revert the coins as this would be confusing to users
                                  // The next page refresh will sync with the database anyway
                                });
                              }
                            } catch (error) {
                              // Just log the error without showing the user
                              // since we've already shown a success message
                              console.error('Error in background coin update:', error);
                            }
                          }}
                        >
                          <Sparkles className="h-4 w-4 mr-2" />
                          Earn More
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockTransactions.slice(0, 3).map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${transaction.type === "earned" ? "bg-green-500/10" : "bg-red-500/10"}`}>
                          {transaction.type === "earned" ? 
                            <ArrowUp className="h-4 w-4 text-green-500" /> : 
                            <ArrowDown className="h-4 w-4 text-red-500" />
                          }
                        </div>
                        <div className="ml-2">
                          <div className="text-sm font-medium truncate max-w-[140px]">{transaction.description}</div>
                          <div className="text-xs text-muted-foreground">{transaction.date}</div>
                        </div>
                      </div>
                      <div className={`text-sm font-medium ${transaction.type === "earned" ? "text-green-500" : "text-red-500"}`}>
                        {transaction.type === "earned" ? "+" : "-"}{transaction.amount}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-center">
                  <Button variant="ghost" size="sm" className="text-xs w-full">
                    View All Transactions
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Rewards Section */}
          <motion.div
            id="rewards-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-12"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold mb-1 flex items-center">
                  <Gift className="h-5 w-5 mr-2 text-primary" /> 
                  Redeem Rewards
                </h2>
                <p className="text-muted-foreground text-sm">
                  Use your Civic Coins to redeem exclusive rewards from our partners
                </p>
              </div>
              
              <Button size="sm" variant="outline" className="mt-2 sm:mt-0 flex items-center gap-1.5">
                <Tag className="h-4 w-4" />
                My Coupons
              </Button>
            </div>
            
            {/* Reward Filters */}
            <RewardFiltersSection />
            
            {/* Featured Rewards */}
            <FeaturedRewards />
            
            {/* All Rewards Grid */}
            <AllRewardsGrid />
          </motion.div>

        </div>
      </main>
      
      <footer className="py-6 border-t">
        <div className="container px-4 mx-auto">
          <div className="text-center text-sm text-muted-foreground">
            © 2025 CiviX. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

// Reward Filters Section Component
function RewardFiltersSection() {
  const [activeFilter, setActiveFilter] = useState<'all' | 'shopping' | 'telecom' | 'entertainment' | 'food' | 'travel' | 'local'>('all');
  
  return (
    <div className="overflow-x-auto pb-2 -mx-4 px-4">
      <RewardFilters activeFilter={activeFilter} onFilterChange={setActiveFilter} />
    </div>
  );
}

// Featured Rewards Component
function FeaturedRewards() {
  const featuredRewards = mockRewards.filter(reward => reward.featured);
  
  return (
    <div className="mb-8">
      <h3 className="text-lg font-medium mb-4 flex items-center">
        <Sparkles className="h-4 w-4 mr-2 text-yellow-500" />
        Featured Deals
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {featuredRewards.map(reward => (
          <div key={reward.id} className="h-[180px]">
            <RewardCouponCard reward={reward} />
          </div>
        ))}
      </div>
    </div>
  );
}

// All Rewards Grid Component
function AllRewardsGrid() {
  const [activeFilter, setActiveFilter] = useState<'all' | 'shopping' | 'telecom' | 'entertainment' | 'food' | 'travel' | 'local'>('all');
  
  const filteredRewards = activeFilter === 'all' 
    ? mockRewards 
    : mockRewards.filter(reward => reward.category === activeFilter);
  
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">All Rewards</h3>
        <div className="flex items-center gap-2">
          <select 
            className="text-sm bg-background border rounded-md px-2 py-1"
            value={activeFilter}
            onChange={(e) => setActiveFilter(e.target.value as any)}
          >
            <option value="all">All Categories</option>
            <option value="shopping">Shopping</option>
            <option value="telecom">Telecom</option>
            <option value="entertainment">Entertainment</option>
            <option value="food">Food</option>
            <option value="travel">Travel</option>
            <option value="local">Local Offers</option>
          </select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredRewards.map(reward => (
          <div key={reward.id} className="h-[180px]">
            <RewardCouponCard reward={reward} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default CivicWallet;
