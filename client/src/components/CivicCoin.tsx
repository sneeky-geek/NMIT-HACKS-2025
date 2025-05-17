import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';

interface CivicCoinProps {
  size?: 'sm' | 'md' | 'lg';
  animate?: boolean;
  className?: string;
}

export const CivicCoin: React.FC<CivicCoinProps> = ({
  size = 'md',
  animate = true,
  className
}) => {
  const { theme } = useTheme();
  const coinRef = useRef<HTMLDivElement>(null);

  const sizeMap = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32'
  };

  // 3D rotation animation on hover
  const hoverAnimation = {
    rest: { 
      rotateY: 0,
      scale: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    },
    hover: { 
      rotateY: 20, 
      scale: 1.05,
      transition: { duration: 0.5, ease: "easeIn" }
    }
  };

  // Floating animation
  const floatingAnimation = animate ? {
    y: [0, -8, 0],
    transition: {
      y: {
        repeat: Infinity,
        duration: 2,
        ease: "easeInOut"
      }
    }
  } : {};

  // Shine effect animation
  const shineAnimation = animate ? {
    background: [
      "linear-gradient(40deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0) 40%, rgba(255,255,255,0.5) 50%, rgba(255,255,255,0) 60%, rgba(255,255,255,0) 100%)",
      "linear-gradient(40deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0) 0%, rgba(255,255,255,0.5) 10%, rgba(255,255,255,0) 20%, rgba(255,255,255,0) 100%)",
      "linear-gradient(40deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0) 60%, rgba(255,255,255,0.5) 70%, rgba(255,255,255,0) 80%, rgba(255,255,255,0) 100%)",
      "linear-gradient(40deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0) 100%, rgba(255,255,255,0.5) 100%, rgba(255,255,255,0) 100%, rgba(255,255,255,0) 100%)"
    ],
    backgroundSize: "200% 200%",
    backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
    transition: {
      background: {
        repeat: Infinity,
        duration: 3,
        ease: "linear"
      }
    }
  } : {};

  // Pulse glow animation
  const pulseAnimation = animate ? {
    boxShadow: [
      "0 0 10px 0px rgba(255, 215, 0, 0.5)",
      "0 0 15px 2px rgba(255, 215, 0, 0.7)",
      "0 0 10px 0px rgba(255, 215, 0, 0.5)"
    ],
    transition: {
      boxShadow: {
        repeat: Infinity,
        duration: 2,
        ease: "easeInOut"
      }
    }
  } : {};

  // Lightning bolt animation
  const boltAnimation = animate ? {
    opacity: [0.85, 1, 0.85],
    scale: [1, 1.05, 1],
    transition: {
      opacity: {
        repeat: Infinity,
        duration: 1.5,
        ease: "easeInOut"
      },
      scale: {
        repeat: Infinity,
        duration: 1.5,
        ease: "easeInOut"
      }
    }
  } : {};

  return (
    <motion.div
      className={cn('relative perspective-1000', className)}
      initial="rest"
      whileHover="hover"
      animate={{ ...floatingAnimation }}
      ref={coinRef}
    >
      {/* Main coin */}
      <motion.div
        className={cn(
          'relative rounded-full',
          'bg-gradient-to-br from-yellow-400 via-yellow-300 to-amber-500',
          'flex items-center justify-center',
          'shadow-lg',
          sizeMap[size]
        )}
        variants={hoverAnimation}
        animate={{ ...pulseAnimation }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Shine effect overlay */}
        <motion.div 
          className="absolute inset-0 rounded-full overflow-hidden"
          animate={{ ...shineAnimation }}
        />

        {/* 3D edge effect */}
        <div className="absolute inset-0 rounded-full border-4 border-amber-300 opacity-50" />
        
        {/* Outer ring */}
        <div className="absolute inset-2 rounded-full border-2 border-amber-600 opacity-30" />
        
        {/* Inner coin face */}
        <div className="absolute inset-3 rounded-full bg-gradient-to-br from-yellow-300 to-amber-400 flex items-center justify-center">
          {/* Lightning symbol */}
          <motion.div
            className="w-1/2 h-1/2 flex items-center justify-center"
            animate={{ ...boltAnimation }}
          >
            <svg viewBox="0 0 24 24" className="w-full h-full fill-white drop-shadow-md">
              <path d="M13 3L4 14h7l-1 7 9-11h-7l1-7z" />
            </svg>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CivicCoin;
