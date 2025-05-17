import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  className?: string;
  delay?: number;
  index?: number;
}

export function FeatureCard({ title, description, icon, className, delay = 0, index = 0 }: FeatureCardProps) {
  return (
    <motion.div 
      className={cn(
        "relative p-6 rounded-2xl glass-card hover:shadow-xl transition-all duration-300 overflow-hidden group",
        className
      )}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 + (index * 0.1) }}
      whileHover={{ y: -8 }}
    >
      {/* Background gradient that appears on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      {/* Border glow effect */}
      <div className="absolute -inset-0.5 bg-gradient-primary opacity-0 group-hover:opacity-20 blur-sm rounded-2xl transition-opacity duration-300"></div>
      
      <div className="relative flex flex-col h-full">
        <div className="flex items-start">
          <div className="mb-4 p-3 rounded-xl bg-primary/10 dark:bg-primary/20 text-primary shadow-sm group-hover:bg-gradient-primary group-hover:text-white transition-all duration-300">
            {icon}
          </div>
          
          <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <ArrowRight className="h-5 w-5 text-primary" />
          </div>
        </div>
        
        <div>
          <h3 className="mb-2 text-xl font-semibold font-poppins">{title}</h3>
          <p className="text-foreground/70 font-inter">{description}</p>
        </div>
        
        {/* Subtle indicator line that animates on hover */}
        <div className="mt-4 pt-4 border-t border-border/40 group-hover:border-primary/30 transition-colors duration-300">
          <span className="text-sm text-primary font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
            Learn more
          </span>
        </div>
      </div>
    </motion.div>
  );
}
