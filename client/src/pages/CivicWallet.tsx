import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { civicScore, mockTransactions } from "@/components/mock-data";
import { ArrowUp, ArrowDown, Coins, Gift, TrendingUp, Calendar, ChevronUp, ChevronDown, Award, CreditCard, Shield, ZapIcon, Sparkles } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "next-themes";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import CivicCoin from "@/components/CivicCoin";

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
  const [totalBalance] = useState(2450);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        <div className="container px-4 mx-auto py-8">
          <h1 className="text-3xl font-bold mb-8">Civic Wallet</h1>
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
                          <div className="text-4xl font-bold mr-2">{totalBalance}</div>
                          <Badge variant="secondary" className="ml-2 bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
                            Gold Tier
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">Your current Civic Coins balance</p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3 mt-2">
                        <Button variant="outline" size="sm" className="flex items-center justify-center">
                          <Gift className="h-4 w-4 mr-2" />
                          Redeem Rewards
                        </Button>
                        <Button variant="secondary" size="sm" className="flex items-center justify-center">
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
          
          <Card className="mb-8 overflow-hidden relative">
            <div className="absolute -top-6 -right-6 opacity-10">
              <CivicCoin size="lg" animate={false} />
        </div>
      </TabsContent>
      
      <TabsContent value="earned">
        <div className="space-y-4">
          {mockTransactions
            .filter(t => t.type === "earned")
            .map((transaction, index) => (
              <motion.div 
                key={transaction.id} 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className={cn(
                  "flex items-center justify-between p-4 rounded-xl border relative overflow-hidden",
                  "transition-all duration-200 hover:shadow-md",
                  "border-green-500/20 hover:border-green-500/30 dark:border-green-400/20 dark:hover:border-green-400/30"
                )}
              >
                {/* Background gradient */}
                <div className="absolute inset-0 opacity-5 bg-gradient-to-r from-green-300 to-green-100 dark:from-green-900/30 dark:to-green-800/10" />
                
                <div className="flex items-center relative z-10">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center mr-4 shadow-sm backdrop-blur-sm bg-green-500/20 text-green-500 dark:bg-green-400/20 dark:text-green-400">
                    <ArrowUp className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium text-base">{transaction.description}</p>
                    <div className="flex items-center text-xs text-muted-foreground mt-1">
                      <Calendar className="h-3 w-3 mr-1" />
                      {transaction.date}
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col items-end relative z-10">
                  <div className="font-bold text-lg text-green-600 dark:text-green-400">
                    +{transaction.amount}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Civic Coins
                  </div>
                </div>
              </motion.div>
            ))}
          <div className="text-center text-sm text-muted-foreground">
            © 2025 CiviX. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CivicWallet;
