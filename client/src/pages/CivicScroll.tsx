import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Volume2, Share, Plus, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { toast } from "@/hooks/use-toast";
import confetti from "canvas-confetti";

// Array of civic sense prompts
const CIVIC_PROMPTS = [
  "Don't litter - keep our community clean! 🌿",
  "Segregate your waste - recycle responsibly! ♻️",
  "Save water - turn off the tap when not in use! 💧",
  "Use public transport to reduce pollution! 🚌",
  "Plant a tree - improve air quality! 🌳",
  "Respect public property - it belongs to everyone! 🏛️",
  "Be mindful of noise pollution! 🔇",
  "Volunteer for community service! 🤝",
  "Vote in elections - your voice matters! 🗳️",
  "Report civic issues to local authorities! 📱",
  "Keep your neighborhood clean! 🧹",
  "Conserve electricity - switch off when not needed! 💡",
  "Respect traffic rules for everyone's safety! 🚦",
  "Say no to single-use plastics! 🚫",
  "Participate in local governance! 📝",
];

// Stock images for civic awareness (assuming these images exist in your public folder)
const CIVIC_IMAGES = [
  "/images/clean-environment.jpg",
  "/images/recycling.jpg",
  "/images/water-conservation.jpg",
  "/images/public-transport.jpg",
  "/images/tree-planting.jpg",
  "/images/public-property.jpg",
  "/images/noise-pollution.jpg",
  "/images/community-service.jpg",
  "/images/voting.jpg",
  "/images/civic-reporting.jpg",
  "/images/neighborhood-cleaning.jpg",
  "/images/energy-conservation.jpg",
  "/images/traffic-safety.jpg",
  "/images/no-plastic.jpg",
  "/images/local-governance.jpg",
];

// Fallback images if the above don't exist
const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b",
  "https://images.unsplash.com/photo-1618477462146-050d2757350d",
  "https://images.unsplash.com/photo-1441974231531-c6227db76b6e",
  "https://images.unsplash.com/photo-1523712999610-f77fbcfc3843",
  "https://images.unsplash.com/photo-1470770903676-69b98201ea1c",
];

interface Reel {
  id: string;
  message: string;
  likes: number;
  isLiked: boolean;
  image: string;
  soundOn: boolean;
}

const CivicScroll = () => {
  const [reels, setReels] = useState<Reel[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const reelContainerRef = useRef<HTMLDivElement>(null);

  // Initialize with some random reels
  useEffect(() => {
    generateInitialReels();
  }, []);

  // Add wheel event listener for mouse navigation
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      // Prevent default to stop page scrolling
      e.preventDefault();
      
      // Scroll down - show next reel
      if (e.deltaY > 0) {
        handleSwipeUp();
      } 
      // Scroll up - show previous reel
      else if (e.deltaY < 0) {
        handleSwipeDown();
      }
    };

    const currentRef = reelContainerRef.current;
    if (currentRef) {
      currentRef.addEventListener('wheel', handleWheel, { passive: false });
    }

    return () => {
      if (currentRef) {
        currentRef.removeEventListener('wheel', handleWheel);
      }
    };
  }, [currentIndex, reels.length]);

  const generateInitialReels = () => {
    const initialReels = Array(5)
      .fill(null)
      .map((_, index) => createNewReel(index));
    setReels(initialReels);
  };

  const createNewReel = (index?: number) => {
    const promptIndex = typeof index === 'number' 
      ? index % CIVIC_PROMPTS.length 
      : Math.floor(Math.random() * CIVIC_PROMPTS.length);
    
    // Use matching image if available, otherwise use a random fallback
    const imageIndex = typeof index === 'number' 
      ? index % CIVIC_IMAGES.length 
      : Math.floor(Math.random() * CIVIC_IMAGES.length);
    
    const chooseImage = () => {
      // If using local images, we'll provide a fallback for demo purposes
      // In a real app, you'd ensure these images exist in your public folder
      const useFallback = true; // Set to false if you have local images
      return useFallback ? FALLBACK_IMAGES[imageIndex % FALLBACK_IMAGES.length] : CIVIC_IMAGES[imageIndex];
    };

    return {
      id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
      message: CIVIC_PROMPTS[promptIndex],
      likes: Math.floor(Math.random() * 1000),
      isLiked: false,
      image: chooseImage(),
      soundOn: Math.random() > 0.5,
    };
  };

  const handleCreateReel = () => {
    const newReel = createNewReel();
    setReels([newReel, ...reels]);
    setCurrentIndex(0);
    
    // Trigger confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
    
    toast({
      title: "New Reel Created!",
      description: "Your new civic reel is ready to view",
    });
  };

  const handleLike = (id: string) => {
    setReels(
      reels.map((reel) =>
        reel.id === id
          ? { ...reel, isLiked: !reel.isLiked, likes: reel.isLiked ? reel.likes - 1 : reel.likes + 1 }
          : reel
      )
    );
  };

  const toggleSound = (id: string) => {
    setReels(
      reels.map((reel) =>
        reel.id === id
          ? { ...reel, soundOn: !reel.soundOn }
          : reel
      )
    );
  };

  const handleShare = () => {
    toast({
      title: "Sharing",
      description: "Sharing functionality would go here!",
    });
  };

  const handleSwipeUp = () => {
    if (currentIndex < reels.length - 1) {
      setIsSwiping(true);
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleSwipeDown = () => {
    if (currentIndex > 0) {
      setIsSwiping(true);
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background">
      <Navbar />
      
      <main className="flex-1 flex justify-center items-center pt-8 sm:pt-10 md:pt-14 lg:pt-14 pb-4">
        <div className="flex max-w-[900px] w-full h-[calc(100vh-5.5rem)] sm:h-[calc(100vh-6rem)] md:h-[calc(100vh-6.5rem)] lg:h-[calc(100vh-6.5rem)] items-center justify-center px-4 relative">
          {/* Reels viewer - centered */}
          <div className="relative w-full max-w-[420px] h-full flex items-center justify-center">
            <div 
              ref={reelContainerRef}
              className="relative bg-black rounded-md overflow-hidden"
              style={{ 
                width: '100%', 
                height: '92%', 
                maxHeight: '90vh',
                boxShadow: `
                  0 0 0 2px rgba(168, 85, 247, 0.4),
                  0 0 0 4px rgba(139, 92, 246, 0.3),
                  0 0 0 6px rgba(124, 58, 237, 0.2),
                  0 0 15px rgba(139, 92, 246, 0.6),
                  0 10px 20px -5px rgba(88, 28, 135, 0.5)
                `,
                border: '1px solid rgba(216, 180, 254, 0.6)',
                borderRadius: '12px'
              }}
              onTouchStart={(e) => {
                const touchStartY = e.touches[0].clientY;
                const handleTouchMove = (e: TouchEvent) => {
                  const touchY = e.touches[0].clientY;
                  const diff = touchStartY - touchY;
                  if (diff > 50) {
                    handleSwipeUp();
                    document.removeEventListener('touchmove', handleTouchMove);
                  } else if (diff < -50) {
                    handleSwipeDown();
                    document.removeEventListener('touchmove', handleTouchMove);
                  }
                };
                
                document.addEventListener('touchmove', handleTouchMove);
                document.addEventListener('touchend', () => {
                  document.removeEventListener('touchmove', handleTouchMove);
                }, { once: true });
              }}
            >
              
              <AnimatePresence initial={false} mode="sync">
                {reels.length > 0 && (
                  <motion.div
                    key={reels[currentIndex].id}
                    initial={{ 
                      y: isSwiping ? 500 : 0, 
                      opacity: isSwiping ? 0 : 1 
                    }}
                    animate={{ 
                      y: 0, 
                      opacity: 1 
                    }}
                    transition={{ 
                      duration: 0.3,
                      ease: "easeOut" 
                    }}
                    className="absolute inset-0 flex flex-col"
                  >
                    {/* Image as background */}
                    <img 
                      src={reels[currentIndex].image} 
                      alt="Civic awareness" 
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    
                    {/* Gradient overlay for better text visibility */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
                    
                    {/* Content */}
                    <div className="relative z-10 flex flex-col justify-between h-full p-4">
                          
                      
                      {/* Message */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1, duration: 0.3 }}
                        className="mb-16"
                      >
                        <h2 className="text-white text-2xl md:text-3xl font-bold drop-shadow-lg">
                          {reels[currentIndex].message}
                        </h2>
                      </motion.div>
                    </div>
                    
                    {/* Right side actions - Instagram style */}
                    <div className="absolute right-4 bottom-16 flex flex-col items-center space-y-8">
                      <div className="flex flex-col items-center">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-white hover:bg-white/10 rounded-full h-12 w-12"
                          onClick={() => handleLike(reels[currentIndex].id)}
                        >
                          <Heart 
                            className={`h-7 w-7 ${reels[currentIndex].isLiked ? "fill-red-500 text-red-500" : "text-white"}`} 
                          />
                        </Button>
                        <span className="text-white text-xs font-semibold">{reels[currentIndex].likes}</span>
                      </div>
                      
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-white hover:bg-white/10 rounded-full h-12 w-12"
                        onClick={() => toggleSound(reels[currentIndex].id)}
                      >
                        {reels[currentIndex].soundOn ? 
                          <Volume2 className="h-7 w-7" /> : 
                          <VolumeX className="h-7 w-7" />
                        }
                      </Button>
                      
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-white hover:bg-white/10 rounded-full h-12 w-12"
                        onClick={handleShare}
                      >
                        <Share className="h-7 w-7" />
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          
          {/* Create button on desktop - right side (renamed and moved up) */}
          <div className="hidden md:block absolute right-4 top-[-15px]">
            <Button
              onClick={handleCreateReel}
              className="rounded-full bg-gradient-to-r from-purple-600 to-purple-400 hover:from-purple-700 hover:to-purple-500 text-white font-bold shadow-lg shadow-purple-500/30 border border-white/20"
              size="default"
            >
              <Plus className="h-4 w-4 mr-2" />
              Upload Reel
            </Button>
          </div>
        </div>
        
        {/* Mobile create button (visible on small screens) - renamed and moved up */}
        <Button
          onClick={handleCreateReel}
          className="md:hidden fixed right-4 top-8 sm:top-10 z-50 rounded-full bg-gradient-to-r from-purple-600 to-purple-400 hover:from-purple-700 hover:to-purple-500 text-white font-bold shadow-lg shadow-purple-500/30 border border-white/20"
          size="icon"
        >
          <Plus className="h-5 w-5" />
        </Button>
      </main>
    </div>
  );
};

export default CivicScroll;
