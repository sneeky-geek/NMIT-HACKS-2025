import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { RewardCoupon } from "./mock-data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Coins, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCivicCoins } from "@/contexts/CivicCoinsContext";
import { toast } from "@/components/ui/use-toast";

interface RewardCouponCardProps {
  reward: RewardCoupon;
}

export function RewardCouponCard({ reward }: RewardCouponCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isClaimed, setIsClaimed] = useState(false);
  const { civicCoins, spendCoins } = useCivicCoins();
  const canRedeem = civicCoins >= reward.coinCost && !isClaimed;
  
  // Check local storage for claimed status on component mount
  useEffect(() => {
    const claimedRewards = JSON.parse(localStorage.getItem('claimedRewards') || '[]');
    if (claimedRewards.includes(reward.id)) {
      setIsClaimed(true);
    }
  }, [reward.id]);

  const handleRedeem = () => {
    if (!canRedeem) {
      if (isClaimed) {
        toast({
          title: "Already Claimed",
          description: `You have already claimed this reward.`,
          variant: "default",
        });
      } else {
        toast({
          title: "Not enough Civic Coins",
          description: `You need ${reward.coinCost - civicCoins} more coins to redeem this reward.`,
          variant: "destructive",
        });
      }
      return;
    }

    spendCoins(reward.coinCost);
    setIsClaimed(true);
    
    // Save claimed status to local storage
    const claimedRewards = JSON.parse(localStorage.getItem('claimedRewards') || '[]');
    claimedRewards.push(reward.id);
    localStorage.setItem('claimedRewards', JSON.stringify(claimedRewards));
    
    toast({
      title: "Reward Redeemed!",
      description: `You've successfully redeemed ${reward.title} from ${reward.brand}. Check your email for details.`,
      variant: "default",
    });
  };

  const cardVariants = {
    front: {
      rotateY: 0,
    },
    back: {
      rotateY: 180,
    },
  };

  return (
    <div className="perspective-1000 h-full">
      <motion.div
        className={cn(
          "relative w-full h-full cursor-pointer",
          isClaimed && "opacity-80"
        )}
        initial="front"
        animate={isFlipped ? "back" : "front"}
        variants={cardVariants}
        transition={{ duration: 0.6, type: "spring", stiffness: 80 }}
        style={{ transformStyle: "preserve-3d" }}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        {/* Front of card */}
        <motion.div
          className={cn(
            "absolute inset-0 rounded-xl overflow-hidden p-4",
            "bg-gradient-to-br from-background/80 to-background/40",
            "backdrop-blur-md border border-white/10",
            "shadow-lg hover:shadow-xl transition-shadow",
            "flex flex-col justify-between",
            isClaimed ? "from-gray-500/20 to-gray-600/20" : (reward.bgGradient || "from-primary/10 to-primary/5")
          )}
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
          }}
        >
          <div className="flex justify-between items-start">
            <div className="h-12 w-12 rounded-full bg-white/90 p-1 shadow-md flex items-center justify-center">
              <img
                src={reward.brandLogo}
                alt={reward.brand}
                className={cn("h-8 w-8 object-contain", isClaimed && "opacity-70")}
                onError={(e) => {
                  // Fallback if image fails to load
                  const target = e.target as HTMLImageElement;
                  target.src = "/logos/placeholder.png";
                }}
              />
            </div>
            {isClaimed ? (
              <Badge variant="secondary" className="bg-gray-500/20 text-gray-500 border-gray-500/20">
                Claimed
              </Badge>
            ) : reward.discount && (
              <Badge variant="secondary" className="bg-primary/20 text-primary">
                {reward.discount}
              </Badge>
            )}
          </div>

          <div className="mt-3">
            <h3 className="font-semibold text-base">{reward.title}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
              {reward.description}
            </p>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center">
              <Coins className="h-4 w-4 text-yellow-500 mr-1" />
              <span className="font-semibold">{reward.coinCost}</span>
            </div>
            <Badge
              variant="outline"
              className="text-xs bg-background/50 backdrop-blur-sm"
            >
              {reward.category}
            </Badge>
          </div>
        </motion.div>

        {/* Back of card */}
        <motion.div
          className={cn(
            "absolute inset-0 rounded-xl overflow-hidden p-4",
            "bg-gradient-to-br from-background/80 to-background/40",
            "backdrop-blur-md border border-white/10",
            "shadow-lg hover:shadow-xl transition-shadow",
            "flex flex-col justify-between",
            isClaimed ? "from-gray-500/20 to-gray-600/20" : (reward.bgGradient || "from-primary/10 to-primary/5")
          )}
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <div className="flex flex-col h-full justify-between">
            <div>
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold">{reward.brand}</h3>
                <Badge variant="outline" className="text-xs">
                  Expires in {reward.expiryDays} days
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                {reward.description}
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Cost</span>
                <div className="flex items-center">
                  <Coins className="h-3.5 w-3.5 text-yellow-500 mr-1" />
                  <span className="font-medium">{reward.coinCost}</span>
                </div>
              </div>
              
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRedeem();
                }}
                className={cn(
                  "w-full",
                  (!canRedeem || isClaimed) && "opacity-70 cursor-not-allowed"
                )}
                disabled={!canRedeem}
                variant={isClaimed ? "outline" : "default"}
              >
                {isClaimed ? (
                  <span className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 mr-1" />
                    Claimed
                  </span>
                ) : canRedeem ? "Redeem Now" : "Not Enough Coins"}
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
