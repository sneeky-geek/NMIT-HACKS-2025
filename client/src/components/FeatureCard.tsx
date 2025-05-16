import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

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
        "p-8 rounded-2xl glass-card shadow-glass hover:-translate-y-2 transition-all duration-300",
        className
      )}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 + (index * 0.1) }}
      whileHover={{ scale: 1.03 }}
    >
      <div className="flex flex-col items-center text-center md:items-start md:text-left md:flex-row md:space-x-6">
        <div className="mb-4 md:mb-0 p-3.5 rounded-xl bg-primary/10 text-primary shadow-sm">
          {icon}
        </div>
        <div>
          <h3 className="mb-2 text-xl font-semibold font-poppins">{title}</h3>
          <p className="text-foreground/70 font-inter">{description}</p>
        </div>
      </div>
    </motion.div>
  );
}
