import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Volume2, Share, Plus, VolumeX, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { toast } from "@/hooks/use-toast";
import confetti from "canvas-confetti";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { nanoid } from 'nanoid';

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
    // For persisting File objects across refreshes
    blobStorageKey?: string; // Key for retrieving from IndexedDB
    fileName?: string;
    fileType?: string;
  };
  soundOn: boolean;
  userId?: string; // To identify user's own reels
  createdAt: Date;
}

// IndexedDB setup for storing media blobs
const DB_NAME = 'reelsDB';
const STORE_NAME = 'mediaBlobs';
const DB_VERSION = 1;

const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onerror = (event) => {
      console.error('IndexedDB error:', event);
      reject('Error opening IndexedDB');
    };
    
    request.onsuccess = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      resolve(db);
    };
    
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
  });
};

const storeBlob = async (blob: Blob, id: string): Promise<void> => {
  try {
    const db = await openDB();
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    
    return new Promise((resolve, reject) => {
      const request = store.put({ id, blob });
      
      request.onsuccess = () => {
        resolve();
      };
      
      request.onerror = (event) => {
        console.error('Error storing blob:', event);
        reject('Error storing blob');
      };
    });
  } catch (error) {
    console.error('Failed to store blob:', error);
    throw error;
  }
};

const getBlob = async (id: string): Promise<Blob | null> => {
  try {
    const db = await openDB();
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    
    return new Promise((resolve, reject) => {
      const request = store.get(id);
      
      request.onsuccess = () => {
        const result = request.result;
        if (result) {
          resolve(result.blob);
        } else {
          resolve(null);
        }
      };
      
      request.onerror = (event) => {
        console.error('Error getting blob:', event);
        reject('Error getting blob');
      };
    });
  } catch (error) {
    console.error('Failed to get blob:', error);
    return null;
  }
};

const CivicScroll = () => {
  const [reels, setReels] = useState<Reel[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const [viewMode, setViewMode] = useState<'all' | 'my'>('all');
  const reelContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [uploadCaption, setUploadCaption] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  
  // Mock user ID (in a real app, this would come from auth)
  const currentUserId = 'user123';

  // Initialize with stored reels or generate random ones
  // Track user interaction to enable unmuted playback
  useEffect(() => {
    const handleUserInteraction = () => {
      if (!hasUserInteracted) {
        setHasUserInteracted(true);
        
        // Try to unmute current video if it should be playing with sound
        if (reels.length > 0 && reels[currentIndex]?.media.type === 'video' && reels[currentIndex].soundOn) {
          const videoElement = document.querySelector(`video[key="${reels[currentIndex].id}"]`) as HTMLVideoElement;
          if (videoElement) {
            videoElement.muted = false;
          }
        }
      }
    };
    
    // Add event listeners for common user interactions
    document.addEventListener('click', handleUserInteraction);
    document.addEventListener('touchstart', handleUserInteraction);
    document.addEventListener('keydown', handleUserInteraction);
    
    return () => {
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('touchstart', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
    };
  }, [hasUserInteracted, currentIndex, reels]);
  
  useEffect(() => {
    const loadReels = async () => {
      setIsLoading(true);
      try {
        // Try to load reels metadata from localStorage
        const storedReels = localStorage.getItem('civicReels');
        if (storedReels) {
          try {
            const parsedReels = JSON.parse(storedReels);
            // Convert string dates back to Date objects
            const reelsWithDates = parsedReels.map((reel: any) => ({
              ...reel,
              createdAt: new Date(reel.createdAt)
            }));
            
            // Process each reel to restore media from IndexedDB if needed
            const processedReels = await Promise.all(
              reelsWithDates.map(async (reel: Reel) => {
                // If the reel has a blobStorageKey, try to retrieve the blob from IndexedDB
                if (reel.media.blobStorageKey) {
                  try {
                    const blob = await getBlob(reel.media.blobStorageKey);
                    if (blob) {
                      // Create a URL for the blob
                      const url = URL.createObjectURL(blob);
                      return {
                        ...reel,
                        media: {
                          ...reel.media,
                          url
                        }
                      };
                    }
                  } catch (error) {
                    console.error('Error retrieving blob for reel:', reel.id, error);
                  }
                }
                return reel;
              })
            );
            
            setReels(processedReels);
            // Set view mode to 'all' initially
            setViewMode('all');
          } catch (error) {
            console.error('Error parsing stored reels:', error);
            generateInitialReels();
          }
        } else {
          generateInitialReels();
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    loadReels();
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

  // Auto-play videos when the current index changes
  useEffect(() => {
    if (filteredReels.length > 0 && filteredReels[currentIndex]?.media.type === 'video') {
      // Find the current video element and play it
      const videoElement = document.querySelector(`video[key="${filteredReels[currentIndex].id}"]`) as HTMLVideoElement;
      if (videoElement) {
        // Always mute first to ensure autoplay works
        videoElement.muted = true;
        
        videoElement.play()
          .then(() => {
            // If user has interacted, we can unmute if the reel's soundOn is true
            if (hasUserInteracted && filteredReels[currentIndex].soundOn) {
              videoElement.muted = false;
            }
          })
          .catch(err => console.error('Error auto-playing video on index change:', err));
      }
    }
  }, [currentIndex, filteredReels, hasUserInteracted]);

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
      // Set system-generated reels to a different user ID so they don't appear in My Reels
      userId: 'system_' + Math.random().toString(36).substring(2, 9),
      createdAt: new Date()
    };
  };

  // Save reels metadata to localStorage whenever they change
  useEffect(() => {
    if (reels.length > 0) {
      try {
        // Create a copy of reels with minimal data for localStorage
        const reelsForStorage = reels.map(reel => ({
          ...reel,
          // Don't include the URL in localStorage as it could be a blob URL that won't persist
          media: {
            ...reel.media,
            url: '' // Clear the URL to save space, we'll recreate it on load
          }
        }));
        
        localStorage.setItem('civicReels', JSON.stringify(reelsForStorage));
        console.log('Reels metadata saved to localStorage:', reels.length);
      } catch (error) {
        console.error('Error saving reels to localStorage:', error);
        // If localStorage is full, try to save just the most recent reels
        if (error instanceof DOMException && error.name === 'QuotaExceededError') {
          try {
            // Keep only the 5 most recent reels to save space
            const recentReels = reels.slice(0, 5).map(reel => ({
              ...reel,
              media: {
                ...reel.media,
                url: ''
              }
            }));
            localStorage.setItem('civicReels', JSON.stringify(recentReels));
            toast({
              title: "Storage Limit Reached",
              description: "Only the 5 most recent reels were saved",
              variant: "destructive"
            });
          } catch (innerError) {
            console.error('Failed to save even reduced reels:', innerError);
          }
        }
      }
    }
  }, [reels]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check if file is video or image
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

    setSelectedFile(file);
    setUploadDialogOpen(true);
    // Generate a random caption as default
    setUploadCaption(CIVIC_PROMPTS[Math.floor(Math.random() * CIVIC_PROMPTS.length)]);
  };

  const handleFileUpload = async () => {
    if (!selectedFile) return;

    try {
      setIsLoading(true);
      // Check if file is video or image
      const isVideo = selectedFile.type.startsWith('video/');
      
      // Generate a unique ID for the blob storage
      const blobId = nanoid();
      
      // Store the file blob in IndexedDB
      await storeBlob(selectedFile, blobId);
      
      // Create a URL for immediate display
      const url = URL.createObjectURL(selectedFile);

      const newReel: Reel = {
        id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
        message: uploadCaption || CIVIC_PROMPTS[Math.floor(Math.random() * CIVIC_PROMPTS.length)],
        likes: 0,
        isLiked: false,
        media: {
          type: isVideo ? 'video' : 'image',
          url: url, // Blob URL for display
          blobStorageKey: blobId, // Key to retrieve from IndexedDB
          fileName: selectedFile.name,
          fileType: selectedFile.type
        },
        soundOn: true,
        userId: currentUserId,
        createdAt: new Date()
      };

      setReels([newReel, ...reels]);
      setCurrentIndex(0);
      
      // Switch to 'my' view mode to show the uploaded reel
      setViewMode('my');
      
      // Reset state
      setSelectedFile(null);
      setUploadDialogOpen(false);
      setUploadCaption('');
      
      // Clear file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
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
    } catch (error) {
      console.error('Error creating reel:', error);
      toast({
        title: "Error",
        description: "Failed to create reel. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }

  };

  const handleCreateReel = () => {
    fileInputRef.current?.click();
  };
  
  const handleCancelUpload = () => {
    setSelectedFile(null);
    setUploadDialogOpen(false);
    setUploadCaption('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const filteredReels = useMemo(() => {
    return viewMode === 'my' 
      ? reels.filter(reel => reel.userId === currentUserId)
      : reels;
  }, [reels, viewMode]);
  
  const hasMyReels = useMemo(() => {
    return reels.some(reel => reel.userId === currentUserId);
  }, [reels]);

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
    // Update the reel's soundOn state
    setReels(
      reels.map((reel) => {
        if (reel.id === id) {
          const newSoundOn = !reel.soundOn;
          
          // If this is the current reel, also update the video element
          if (currentIndex !== -1 && reels[currentIndex]?.id === id) {
            const videoElement = document.querySelector(`video[key="${id}"]`) as HTMLVideoElement;
            if (videoElement) {
              // If turning sound on, we need user interaction
              if (newSoundOn) {
                if (hasUserInteracted) {
                  videoElement.muted = false;
                } else {
                  // If no user interaction yet, show a toast
                  toast({
                    title: "Interaction Required",
                    description: "Please click anywhere on the page to enable sound",
                  });
                }
              } else {
                videoElement.muted = true;
              }
            }
          }
          
          return { ...reel, soundOn: newSoundOn };
        }
        return reel;
      })
    );
  };

  const handleShare = () => {
    toast({
      title: "Sharing",
      description: "Sharing functionality would go here!",
    });
  };

  const handleSwipeUp = () => {
    if (currentIndex < filteredReels.length - 1) {
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
  
  // Reset current index when view mode or filtered reels change
  useEffect(() => {
    setCurrentIndex(0);
  }, [viewMode, filteredReels.length]);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background">
      <Navbar />
      
      <main className="flex-1 flex flex-col items-center pt-4 sm:pt-6 md:pt-8 lg:pt-8 pb-4">
        {/* Loading indicator */}
        {isLoading && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-background p-6 rounded-lg shadow-lg flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
              <p className="text-foreground">Loading...</p>
            </div>
          </div>
        )}
        
        {/* Sound permission notice - shown if not interacted yet */}
        {!hasUserInteracted && reels.length > 0 && (
          <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-black/80 text-white px-4 py-2 rounded-full text-sm z-50 animate-pulse">
            Click anywhere to enable sound
          </div>
        )}
        {/* Toggle buttons */}
        <div className="flex items-center gap-2 mb-6 bg-black/20 p-1.5 rounded-full backdrop-blur-sm border border-purple-500/20 shadow-glass">
          <button
            onClick={() => setViewMode('all')}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              viewMode === 'all'
                ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg'
                : 'text-white hover:bg-white/10'
            }`}
          >
            All Reels
          </button>
          <button
            onClick={() => setViewMode('my')}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              viewMode === 'my'
                ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg'
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
          onChange={handleFileSelect}
        />
        
        {/* Upload Dialog */}
        <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Upload New Reel</DialogTitle>
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute right-4 top-4" 
                onClick={handleCancelUpload}
              >
                <X className="h-4 w-4" />
              </Button>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="caption" className="text-sm font-medium">
                  Caption
                </label>
                <Input
                  id="caption"
                  value={uploadCaption}
                  onChange={(e) => setUploadCaption(e.target.value)}
                  placeholder="Add a caption to your reel..."
                  className="col-span-3"
                />
              </div>
              {selectedFile && (
                <div className="mt-2 p-2 border rounded-md">
                  <p className="text-sm">{selectedFile.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button onClick={handleCancelUpload} variant="outline">
                Cancel
              </Button>
              <Button onClick={handleFileUpload} disabled={!selectedFile}>
                Upload
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <div className="flex max-w-[900px] w-full h-[calc(100vh-5.5rem)] sm:h-[calc(100vh-6rem)] md:h-[calc(100vh-6.5rem)] lg:h-[calc(100vh-6.5rem)] items-center justify-center px-4 relative mt-[-20px]">
          {/* Reels viewer - centered */}
          <div className="relative w-full max-w-[360px] h-full flex items-center justify-center mt-[-15px]">
            {/* Phone frame outer shell */}
            <div className="absolute w-full h-[90%] max-h-[85vh] rounded-[40px] bg-gradient-to-br from-zinc-800 to-zinc-900 transform translate-y-[-10px]"
              style={{
                boxShadow: `
                  0 0 0 1px rgba(255, 255, 255, 0.15),
                  0 6px 16px rgba(0, 0, 0, 0.5),
                  0 12px 32px rgba(0, 0, 0, 0.4),
                  inset 0 1px 3px rgba(255, 255, 255, 0.05),
                  inset 0 0 10px rgba(0, 0, 0, 0.3)
                `,
                border: '1px solid rgba(70, 70, 70, 0.3)'
              }}
            >
              {/* Phone notch */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[130px] h-[30px] bg-black rounded-b-[18px] z-20 flex items-center justify-center gap-4">
                <div className="w-[8px] h-[8px] bg-zinc-600 rounded-full opacity-70" /> {/* Camera */}
                <div className="w-[55px] h-[6px] bg-zinc-700 rounded-full" /> {/* Speaker */}
                <div className="w-[8px] h-[8px] bg-zinc-600 rounded-full opacity-70" /> {/* Sensor */}
              </div>
              {/* Volume buttons */}
              <div className="absolute left-[-2px] top-[100px] w-[4px] h-[45px] bg-zinc-500 rounded-r-md shadow-sm" />
              <div className="absolute left-[-2px] top-[160px] w-[4px] h-[45px] bg-zinc-500 rounded-r-md shadow-sm" />
              {/* Power button */}
              <div className="absolute right-[-2px] top-[120px] w-[4px] h-[70px] bg-zinc-500 rounded-l-md shadow-sm" />
              {/* Silent switch */}
              <div className="absolute left-[-2px] top-[60px] w-[3px] h-[20px] bg-zinc-500 rounded-r-md shadow-sm" />
            </div>
            
            {/* Content container */}
            <div 
              ref={reelContainerRef}
              className="relative bg-black overflow-hidden"
              style={{ 
                width: '100%', 
                height: '90%', 
                maxHeight: '80vh',
                aspectRatio: '9/16',
                borderRadius: '32px',
                boxShadow: 'inset 0 0 20px rgba(0, 0, 0, 0.5)',
                border: '3px solid rgba(20, 20, 20, 0.95)',
                background: 'linear-gradient(160deg, #000000, #0a0a0a)',
                transition: 'all 0.3s ease-in-out',
                overflow: 'hidden'
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
                {filteredReels.length > 0 ? (
                  <motion.div
                    key={filteredReels[currentIndex].id}
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
                        {filteredReels[currentIndex]?.media.type === 'video' ? (
                          <video
                            key={reels[currentIndex].id} // Add key to force re-render
                            src={reels[currentIndex].media.url}
                            className="w-full h-full object-cover object-center"
                            autoPlay
                            loop
                            controls={false}
                            muted={true} // Always start muted to ensure autoplay works
                            playsInline
                            onLoadedData={(e) => {
                              // Force play when video is loaded (always muted first)
                              const video = e.target as HTMLVideoElement;
                              video.play()
                                .then(() => {
                                  // Only unmute if user has interacted and the reel should have sound
                                  if (hasUserInteracted && filteredReels[currentIndex].soundOn) {
                                    video.muted = false;
                                  }
                                })
                                .catch(err => console.error('Error auto-playing video:', err));
                            }}
                            onError={(e) => {
                              console.error('Video error:', e);
                              // Try to reload the video from IndexedDB if there's an error
                              if (filteredReels[currentIndex].media.blobStorageKey) {
                                getBlob(reels[currentIndex].media.blobStorageKey)
                                  .then(blob => {
                                    if (blob) {
                                      const videoElement = e.target as HTMLVideoElement;
                                      const url = URL.createObjectURL(blob);
                                      videoElement.src = url;
                                      videoElement.load();
                                      // Force play after reload (always muted first to ensure it works)
                                      videoElement.muted = true;
                                      videoElement.play()
                                        .then(() => {
                                          // Only unmute if user has interacted and the reel should have sound
                                          if (hasUserInteracted && reels[currentIndex].soundOn) {
                                            videoElement.muted = false;
                                          }
                                        })
                                        .catch(err => console.error('Error playing reloaded video:', err));
                                      // Update the reel's URL in state
                                      setReels(currentReels => {
                                        return currentReels.map(reel => {
                                          if (reel.id === reels[currentIndex].id) {
                                            return {
                                              ...reel,
                                              media: {
                                                ...reel.media,
                                                url
                                              }
                                            };
                                          }
                                          return reel;
                                        });
                                      });
                                    } else {
                                      toast({
                                        title: "Video Error",
                                        description: "Could not reload video from storage",
                                        variant: "destructive"
                                      });
                                    }
                                  })
                                  .catch(error => {
                                    console.error('Error reloading video:', error);
                                    toast({
                                      title: "Video Error",
                                      description: "There was an error playing this video",
                                      variant: "destructive"
                                    });
                                  });
                              } else {
                                toast({
                                  title: "Video Error",
                                  description: "There was an error playing this video",
                                  variant: "destructive"
                                });
                              }
                            }}
                            style={{ objectPosition: '50% 50%' }}
                          />
                        ) : (
                          <img
                            key={reels[currentIndex].id} // Add key to force re-render
                            src={reels[currentIndex].media.url}
                            alt="Civic awareness"
                            className="w-full h-full object-cover object-center"
                            onError={(e) => {
                              console.error('Image error:', e);
                              // Try to reload the image from IndexedDB if there's an error
                              if (reels[currentIndex].media.blobStorageKey) {
                                getBlob(reels[currentIndex].media.blobStorageKey)
                                  .then(blob => {
                                    if (blob) {
                                      const imgElement = e.target as HTMLImageElement;
                                      const url = URL.createObjectURL(blob);
                                      imgElement.src = url;
                                      // Update the reel's URL in state
                                      setReels(currentReels => {
                                        return currentReels.map(reel => {
                                          if (reel.id === reels[currentIndex].id) {
                                            return {
                                              ...reel,
                                              media: {
                                                ...reel.media,
                                                url
                                              }
                                            };
                                          }
                                          return reel;
                                        });
                                      });
                                    } else {
                                      toast({
                                        title: "Image Error",
                                        description: "Could not reload image from storage",
                                        variant: "destructive"
                                      });
                                    }
                                  })
                                  .catch(error => {
                                    console.error('Error reloading image:', error);
                                    toast({
                                      title: "Image Error",
                                      description: "There was an error loading this image",
                                      variant: "destructive"
                                    });
                                  });
                              } else {
                                toast({
                                  title: "Image Error",
                                  description: "There was an error loading this image",
                                  variant: "destructive"
                                });
                              }
                            }}
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
                          {filteredReels[currentIndex].message}
                        </h2>
                      </motion.div>
                    
                      {/* Right side actions - Enhanced Instagram style */}
                      <div className="absolute right-4 bottom-24 flex flex-col items-center space-y-6">
                        <div className="flex flex-col items-center space-y-1">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-white hover:bg-white/20 active:scale-90 transition-all duration-150 rounded-full h-14 w-14 backdrop-blur-sm"
                            onClick={() => handleLike(filteredReels[currentIndex].id)}
                          >
                            <Heart 
                              className={`h-8 w-8 drop-shadow-lg transform transition-transform duration-200 ${filteredReels[currentIndex].isLiked ? "fill-red-500 text-red-500 scale-110" : "text-white"}`} 
                            />
                          </Button>
                          <span className="text-white text-sm font-semibold drop-shadow-lg">{filteredReels[currentIndex].likes}</span>
                        </div>
                        
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-white hover:bg-white/20 active:scale-90 transition-all duration-150 rounded-full h-14 w-14 backdrop-blur-sm"
                          onClick={() => toggleSound(filteredReels[currentIndex].id)}
                        >
                          {filteredReels[currentIndex].soundOn ? 
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
                ) : viewMode === 'my' && !hasMyReels ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80">
                    <div className="text-center p-6 rounded-lg">
                      <div className="mb-4 flex justify-center">
                        <Plus className="h-16 w-16 text-gray-400" />
                      </div>
                      <h3 className="text-white text-2xl font-bold mb-2">No Reels Yet</h3>
                      <p className="text-gray-300 mb-6">Upload your first civic reel to get started!</p>
                      <Button
                        onClick={handleCreateReel}
                        className="rounded-full bg-gradient-to-r from-purple-600 to-purple-400 hover:from-purple-700 hover:to-purple-500 text-white font-bold shadow-lg shadow-purple-500/30 border border-white/20"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Upload Reel
                      </Button>
                    </div>
                  </div>
                ) : null}
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
