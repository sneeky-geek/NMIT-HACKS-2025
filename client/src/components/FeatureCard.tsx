import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { LockIcon } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  className?: string;
  delay?: number;
  index?: number;
}

export function FeatureCard({ title, description, icon, className, delay = 0, index = 0 }: FeatureCardProps) {
  const { isAuthenticated } = useAuth();
  // Determine if feature should appear locked based on authentication status
  const isLocked = !isAuthenticated && (title === "CivicScroll" || title === "Smart Dustbin" || 
                    title === "Civic Coin Wallet" || title === "Missions");
  return (
    <motion.div 
      className={cn(
        "p-8 rounded-2xl glass-card shadow-glass hover:-translate-y-2 transition-all duration-300",
        isLocked && "bg-muted/70 backdrop-blur-sm border border-muted-foreground/10",
        className
      )}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 + (index * 0.1) }}
      whileHover={{ scale: 1.03 }}
    >
      <div className="flex flex-col items-center text-center md:items-start md:text-left md:flex-row md:space-x-6 relative">
        {isLocked && (
          <div className="absolute -top-3 -right-3 bg-primary text-primary-foreground rounded-full p-1.5 shadow-md z-10">
            <LockIcon className="h-3.5 w-3.5" />
          </div>
        )}
        <div className={cn(
          "mb-4 md:mb-0 p-3.5 rounded-xl bg-primary/10 text-primary shadow-sm",
          isLocked && "bg-primary/5 text-primary/70"
        )}>
          {icon}
        </div>
        <div>
          <h3 className="mb-2 text-xl font-semibold font-poppins flex items-center gap-2">
            {title}
            {isLocked && <span className="text-xs text-muted-foreground font-normal">(Login required)</span>}
          </h3>
          <p className={cn("text-foreground/70 font-inter", isLocked && "text-foreground/50")}>
            {description}
          </p>
          {isLocked && (
            <p className="mt-2 text-xs text-primary font-medium">
              Sign in to access this feature
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}