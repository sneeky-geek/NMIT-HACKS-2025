
import { cn } from "@/lib/utils";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  className?: string;
  delay?: number;
}

export function FeatureCard({ title, description, icon, className, delay = 0 }: FeatureCardProps) {
  return (
    <div 
      className={cn(
        "p-6 rounded-xl bg-card hover-scale card-shadow animate-fade-in",
        className
      )}
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="flex flex-col items-center text-center md:items-start md:text-left md:flex-row md:space-x-4">
        <div className="mb-4 md:mb-0 p-3 rounded-full bg-primary/10 text-primary">
          {icon}
        </div>
        <div>
          <h3 className="mb-2 text-xl font-semibold">{title}</h3>
          <p className="text-muted-foreground">{description}</p>
        </div>
      </div>
    </div>
  );
}
