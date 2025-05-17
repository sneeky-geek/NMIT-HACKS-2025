import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { 
  ShoppingBag, 
  Wifi, 
  Film, 
  Utensils, 
  Plane, 
  MapPin,
  Sparkles
} from "lucide-react";

type CategoryType = 'all' | 'shopping' | 'telecom' | 'entertainment' | 'food' | 'travel' | 'local';

interface RewardFiltersProps {
  onFilterChange: (category: CategoryType) => void;
  activeFilter: CategoryType;
}

export function RewardFilters({ onFilterChange, activeFilter }: RewardFiltersProps) {
  const filters = [
    { id: 'all', label: 'All Rewards', icon: <Sparkles className="h-4 w-4" /> },
    { id: 'shopping', label: 'Shopping', icon: <ShoppingBag className="h-4 w-4" /> },
    { id: 'telecom', label: 'Telecom', icon: <Wifi className="h-4 w-4" /> },
    { id: 'entertainment', label: 'Entertainment', icon: <Film className="h-4 w-4" /> },
    { id: 'food', label: 'Food', icon: <Utensils className="h-4 w-4" /> },
    { id: 'travel', label: 'Travel', icon: <Plane className="h-4 w-4" /> },
    { id: 'local', label: 'Local Offers', icon: <MapPin className="h-4 w-4" /> },
  ];

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {filters.map((filter) => (
        <Button
          key={filter.id}
          size="sm"
          variant={activeFilter === filter.id ? "default" : "outline"}
          className={cn(
            "rounded-full px-4 flex items-center gap-1.5",
            activeFilter === filter.id ? "shadow-md" : "bg-background/50 backdrop-blur-sm"
          )}
          onClick={() => onFilterChange(filter.id as CategoryType)}
        >
          {filter.icon}
          <span>{filter.label}</span>
        </Button>
      ))}
    </div>
  );
}
