import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Volume2, Share, Plus, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { toast } from "@/hooks/use-toast";
import confetti from "canvas-confetti";

// Array of civic sense prompts
const CIVIC_PROMPTS = [
  "✨ Small actions, big impact! Keep our streets clean and our hearts proud. 🌟",
  "♻️ Every piece of waste sorted is a step towards a greener tomorrow. Make it count!",
  "💧 Water is life. Save it like it's your superpower, because it is!",
  "🌍 Choose public transport: Be the climate hero our planet needs!",
  "🌳 Plant a seed of change today, grow a forest of hope tomorrow.",
  "🏛️ Our city is our canvas, let's make it a masterpiece together.",
  "🎵 Be the harmony in your community, not the noise.",
  "❤️ Volunteer: Because the best way to find yourself is to serve others.",
  "✊ Your vote is your voice. Make it echo through generations!",
  "📱 See something? Say something! Be the change catalyst.",
  "🌟 Clean streets reflect bright communities. Shine on!",
  "💡 Energy saved is future earned. Be brilliant, use less!",
  "🚦 Traffic rules are life rules. Stay safe, stay smart!",
  "🌊 Choose planet over plastic. Every. Single. Time.",
  "🤝 Local action, global impact. Your community needs YOU!",
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
  media: {
    type: 'image' | 'video';
    url: string;
  };
  soundOn: boolean;
  userId?: string; // To identify user's own reels
  createdAt: Date;
}

const CivicScroll = () => {
  const [reels, setReels] = useState<Reel[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const [viewMode, setViewMode] = useState<'all' | 'my'>('all');
  const reelContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Mock user ID (in a real app, this would come from auth)
  const currentUserId = 'user123';

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
      media: {
        type: 'image' as const,
        url: chooseImage()
      },
      soundOn: Math.random() > 0.5,
      userId: currentUserId,
      createdAt: new Date()
    };
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check if file is video
    const isVideo = file.type.startsWith('video/');
    const isImage = file.type.startsWith('image/');

    if (!isVideo && !isImage) {
      toast({
        title: "Invalid File",
        description: "Please upload a video or image file",
        variant: "destructive"
      });
      return;
    }

    // In a real app, you would upload to a server/storage here
    // For now, we'll use local URL
    const mediaUrl = URL.createObjectURL(file);

    const newReel: Reel = {
      id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
      message: CIVIC_PROMPTS[Math.floor(Math.random() * CIVIC_PROMPTS.length)],
      likes: 0,
      isLiked: false,
      media: {
        type: isVideo ? 'video' : 'image',
        url: mediaUrl
      },
      soundOn: true,
      userId: currentUserId,
      createdAt: new Date()
    };

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
      description: "Your civic reel is ready to view",
    });
  };

  const handleCreateReel = () => {
    fileInputRef.current?.click();
  };

  const filteredReels = useMemo(() => {
    return viewMode === 'my' 
      ? reels.filter(reel => reel.userId === currentUserId)
      : reels;
  }, [reels, viewMode]);

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
      
      <main className="flex-1 flex flex-col items-center pt-4 sm:pt-6 md:pt-8 lg:pt-8 pb-4">
        {/* Toggle buttons */}
        <div className="flex items-center gap-2 mb-6 bg-black/10 p-1 rounded-full backdrop-blur-sm">
          <button
            onClick={() => setViewMode('all')}
            className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
              viewMode === 'all'
                ? 'bg-white text-black shadow-lg'
                : 'text-white hover:bg-white/10'
            }`}
          >
            All Reels
          </button>
          <button
            onClick={() => setViewMode('my')}
            className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
              viewMode === 'my'
                ? 'bg-white text-black shadow-lg'
                : 'text-white hover:bg-white/10'
            }`}
          >
            My Reels
          </button>
        </div>

        {/* Hidden file input */}
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="video/*,image/*"
          onChange={handleFileUpload}
        />
        <div className="flex max-w-[900px] w-full h-[calc(100vh-5.5rem)] sm:h-[calc(100vh-6rem)] md:h-[calc(100vh-6.5rem)] lg:h-[calc(100vh-6.5rem)] items-center justify-center px-4 relative">
          {/* Reels viewer - centered */}
          <div className="relative w-full max-w-[400px] h-full flex items-center justify-center">
            {/* Phone frame outer shell */}
            <div className="absolute w-full h-[92%] max-h-[95vh] rounded-[40px] bg-gradient-to-br from-zinc-700 to-zinc-800"
              style={{
                boxShadow: `
                  0 0 0 1px rgba(255, 255, 255, 0.1),
                  0 4px 12px rgba(0, 0, 0, 0.5),
                  0 8px 24px rgba(0, 0, 0, 0.4),
                  inset 0 0 10px rgba(0, 0, 0, 0.2)
                `
              }}
            >
              {/* Phone notch */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[120px] h-[25px] bg-black rounded-b-[20px] z-20 flex items-center justify-center">
                <div className="w-[50px] h-[6px] bg-zinc-800 rounded-full" />
              </div>
              {/* Volume buttons */}
              <div className="absolute left-[-2px] top-[100px] w-[4px] h-[60px] bg-zinc-600 rounded-r-md" />
              <div className="absolute left-[-2px] top-[180px] w-[4px] h-[60px] bg-zinc-600 rounded-r-md" />
              {/* Power button */}
              <div className="absolute right-[-2px] top-[120px] w-[4px] h-[80px] bg-zinc-600 rounded-l-md" />
            </div>
            
            {/* Content container */}
            <div 
              ref={reelContainerRef}
              className="relative bg-black overflow-hidden"
              style={{ 
                width: '100%', 
                height: '92%', 
                maxHeight: '90vh',
                borderRadius: '35px',
                boxShadow: 'inset 0 0 20px rgba(0, 0, 0, 0.5)',
                border: '3px solid rgba(30, 30, 30, 0.9)',
                background: 'linear-gradient(160deg, #000000, #111111)',
                transition: 'all 0.3s ease-in-out'
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

                    
                    {/* Content */}
                    <div className="relative z-10 flex flex-col justify-between h-full">
                      {/* Media container with proper aspect ratio */}
                      <div className="absolute inset-0 bg-black">
                        {reels[currentIndex].media.type === 'video' ? (
                          <video
                            src={reels[currentIndex].media.url}
                            className="w-full h-full object-cover object-center"
                            autoPlay
                            loop
                            muted={!reels[currentIndex].soundOn}
                            playsInline
                            style={{ objectPosition: '50% 50%' }}
                          />
                        ) : (
                          <img
                            src={reels[currentIndex].media.url}
                            alt="Civic awareness"
                            className="w-full h-full object-cover object-center"
                            style={{ objectPosition: '50% 50%' }}
                          />
                        )}
                        {/* Enhanced gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/90" />
                      </div>
                      
                      {/* Message with improved positioning */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1, duration: 0.3 }}
                        className="relative z-20 p-6 mt-auto"
                      >
                        <h2 className="text-white text-2xl md:text-3xl font-bold leading-snug drop-shadow-xl">
                          {reels[currentIndex].message}
                        </h2>
                      </motion.div>
                    
                      {/* Right side actions - Enhanced Instagram style */}
                      <div className="absolute right-4 bottom-24 flex flex-col items-center space-y-6">
                        <div className="flex flex-col items-center space-y-1">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-white hover:bg-white/20 active:scale-90 transition-all duration-150 rounded-full h-14 w-14 backdrop-blur-sm"
                            onClick={() => handleLike(reels[currentIndex].id)}
                          >
                            <Heart 
                              className={`h-8 w-8 drop-shadow-lg transform transition-transform duration-200 ${reels[currentIndex].isLiked ? "fill-red-500 text-red-500 scale-110" : "text-white"}`} 
                            />
                          </Button>
                          <span className="text-white text-sm font-semibold drop-shadow-lg">{reels[currentIndex].likes}</span>
                        </div>
                        
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-white hover:bg-white/20 active:scale-90 transition-all duration-150 rounded-full h-14 w-14 backdrop-blur-sm"
                          onClick={() => toggleSound(reels[currentIndex].id)}
                        >
                          {reels[currentIndex].soundOn ? 
                            <Volume2 className="h-8 w-8 drop-shadow-lg" /> : 
                            <VolumeX className="h-8 w-8 drop-shadow-lg" />
                          }
                        </Button>
                        
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-white hover:bg-white/20 active:scale-90 transition-all duration-150 rounded-full h-14 w-14 backdrop-blur-sm"
                          onClick={handleShare}
                        >
                          <Share className="h-8 w-8 drop-shadow-lg" />
                        </Button>
                      </div>
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
