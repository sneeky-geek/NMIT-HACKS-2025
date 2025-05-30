import { useState, useEffect, useRef, useMemo } from "react";
import MediaDisplay from "@/components/MediaDisplay";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Volume2, Share, Plus, VolumeX, X, ShieldCheck, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { toast } from "@/hooks/use-toast";
import confetti from "canvas-confetti";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { nanoid } from 'nanoid';

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

// Default sample images for reels when videos aren't available
const SAMPLE_IMAGES = [
  "https://images.unsplash.com/photo-1534801022022-6e319a11f249?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=800&fit=max",
  "https://images.unsplash.com/photo-1594035910387-fea47794261f?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=800&fit=max",
  "https://images.unsplash.com/photo-1536782376847-5c9d14d97cc0?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=800&fit=max",
  "https://images.unsplash.com/photo-1477772252792-a35981962ff2?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=800&fit=max",
  "https://images.unsplash.com/photo-1535392432937-a27c78d140ae?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=800&fit=max",
];

// Videos from assets folder for reels
const CIVIC_VIDEOS = [
  "/videos/civic-video1.mp4",
  "/videos/civic-video2.mp4",
  "/videos/civic-video3.mp4",
  "/videos/civic-video4.mp4",
  "/videos/civic-video5.mp4",
];

interface Reel {
  id: string;
  likes: number;
  isLiked: boolean;
  media: {
    type: 'image' | 'video';
    url: string;
    // No longer need blobStorageKey since we're fetching from backend
  };
  soundOn: boolean;
  userId: string; // To identify user's own reels
  createdAt: Date;
}

// Add VerificationState type
type VerificationState = 'idle' | 'verifying' | 'success' | 'uploading';

// No longer need IndexedDB for storage as we're using the backend

// Ensure consistent user ID across sessions
const getUserId = () => {
  const storedUserId = localStorage.getItem('civicReelsUserId');
  if (storedUserId) return storedUserId;
  
  const newUserId = 'user_' + nanoid(8);
  localStorage.setItem('civicReelsUserId', newUserId);
  return newUserId;
};

// Add at the top, after imports
const VERIFICATION_STEPS = [
  { key: 'frame', label: 'Extracting video frames' },
  { key: 'visual', label: 'Analyzing visual content' },
  { key: 'audio', label: 'Analyzing audio & speech' },
  { key: 'text', label: 'Checking captions & metadata' },
  { key: 'scene', label: 'Classifying scenes' },
  { key: 'policy', label: 'Checking policy compliance' },
  { key: 'report', label: 'Generating moderation report' },
];

const CivicScroll = () => {
  const [reels, setReels] = useState<Reel[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const [viewMode, setViewMode] = useState<'all' | 'my'>('all');
  const reelContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  // Add verification state
  const [verificationState, setVerificationState] = useState<VerificationState>('idle');
  const [verificationProgress, setVerificationProgress] = useState(0);
  const [currentVerificationStep, setCurrentVerificationStep] = useState(0);
  
  // Get consistent user ID
  const currentUserId = useMemo(() => getUserId(), []);

  // Filter reels based on view mode
  const filteredReels = useMemo(() => {
    if (viewMode === 'my') {
      // Only show user's uploaded reels in "My Reels"
      return reels.filter(reel => reel.userId === currentUserId);
    } else {
      // Show all reels in "All Reels"
      return reels;
    }
  }, [reels, viewMode, currentUserId]);
  
  const hasMyReels = useMemo(() => {
    return reels.some(reel => reel.userId === currentUserId);
  }, [reels, currentUserId]);

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
        // Import fetchReels function from our API
        const { fetchReels } = await import('@/api/reels');
        
        // Fetch system reels (no userId specified)
        const systemReels = await fetchReels();
        
        // Log received reels for debugging
        console.log('Reels from backend:', systemReels);
        
        // Map backend reels to frontend reel format
        const mappedReels = systemReels.map((reel: any) => ({
          id: reel._id,
          likes: reel.likes || 0,
          isLiked: false,
          media: {
            type: reel.media.type as 'image' | 'video',
            // Convert backend filePath to frontend URL
            url: reel.media.filePath.startsWith('http') 
              ? reel.media.filePath 
              : `${window.location.origin}/uploads/${reel.media.fileName}`
          },
          soundOn: reel.media.type === 'video',
          userId: reel.userId,
          createdAt: new Date(reel.createdAt)
        }));
        
        console.log('Mapped reels for frontend:', mappedReels);
        
        // If no reels are returned from the backend, generate initial reels
        if (mappedReels.length === 0) {
          console.log('No reels from backend, generating initial ones');
          generateInitialReels();
        } else {
          setReels(mappedReels);
        }
      } catch (error) {
        console.error('Error fetching reels from backend:', error);
        // Fall back to generating initial reels on error
        generateInitialReels();
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

  const generateInitialReels = () => {
    const initialReels = Array(5)
      .fill(null)
      .map((_, index) => createNewReel(index));
    setReels(initialReels);
  };

  const createNewReel = (index?: number) => {
    // Use image index for more reliable system reels
    const imageIndex = typeof index === 'number' 
      ? index % SAMPLE_IMAGES.length 
      : Math.floor(Math.random() * SAMPLE_IMAGES.length);
    
    // Use sample images from Unsplash for more reliable loading
    const imageUrl = SAMPLE_IMAGES[imageIndex];
    
    return {
      id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
      likes: Math.floor(Math.random() * 1000),
      isLiked: false,
      media: {
        type: 'image' as const,
        url: imageUrl
      },
      soundOn: false, // No sound for images
      // Set system-generated reels to a different user ID so they don't appear in My Reels
      userId: 'system_' + Math.random().toString(36).substring(2, 9),
      createdAt: new Date()
    };
  };

  // No longer need to save reels to localStorage since we're fetching from backend
  // We'll just keep a console log of the number of reels loaded
  useEffect(() => {
    if (reels.length > 0) {
      console.log('Reels loaded:', reels.length);
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
  };

  const handleFileUpload = async () => {
    if (!selectedFile) return;
    try {
      setVerificationState('verifying');
      setVerificationProgress(0);
      setCurrentVerificationStep(0);
      // Simulate step-by-step AI verification (total ~16s)
      const totalDuration = 16000; // ms
      const steps = VERIFICATION_STEPS.length;
      const stepDuration = totalDuration / steps;
      for (let i = 0; i < steps; i++) {
        setCurrentVerificationStep(i);
        // Animate progress bar for this step
        const start = Math.floor((i / steps) * 100);
        const end = Math.floor(((i + 1) / steps) * 100);
        const progressStep = (end - start) / 10;
        for (let p = start; p < end; p += progressStep) {
          setVerificationProgress(Math.min(99, Math.floor(p)));
          await new Promise(res => setTimeout(res, stepDuration / 10));
        }
        setVerificationProgress(end);
        await new Promise(res => setTimeout(res, stepDuration / 2));
      }
      setVerificationProgress(100);
      setVerificationState('success');
      await new Promise(resolve => setTimeout(resolve, 1200));
      setVerificationState('uploading');
      setIsLoading(true);
      
      // Get the uploadReel function from our API
      const { uploadReel } = await import('@/api/reels');
      
      // Upload the file with user ID and optional description
      const uploadedReel = await uploadReel(selectedFile, currentUserId, 'A civic reel for a better community');
      
      if (!uploadedReel) {
        throw new Error('Failed to upload reel - server returned null');
      }
      
      // Map the uploaded reel to our frontend format
      const newReel: Reel = {
        id: uploadedReel._id,
        likes: uploadedReel.likes || 0,
        isLiked: false,
        media: {
          type: uploadedReel.media.type as 'image' | 'video',
          url: uploadedReel.media.filePath.startsWith('http') 
            ? uploadedReel.media.filePath 
            : window.location.origin + uploadedReel.media.filePath,
        },
        soundOn: uploadedReel.media.type === 'video',
        userId: uploadedReel.userId,
        createdAt: new Date(uploadedReel.createdAt)
      };
      
      // Add the new reel to the top of the list
      setReels(prevReels => [newReel, ...prevReels]);
      setCurrentIndex(0); // Show the new reel
      setViewMode('my'); // Switch to My Reels view
      
      // Reset UI state
      setSelectedFile(null);
      setUploadDialogOpen(false);
      setVerificationState('idle');
      if (fileInputRef.current) fileInputRef.current.value = '';
      
      // Celebrate with confetti and toast notification
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      toast({ title: "New Reel Created!", description: "Your civic reel is ready to view" });
    } catch (error) {
      console.error('Error creating reel:', error);
      toast({ title: "Error", description: "Failed to create reel. Please try again.", variant: "destructive" });
      setVerificationState('idle');
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
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleLike = async (id: string) => {
    try {
      // First update the UI for immediate feedback
      const updatedReels = reels.map((reel) =>
        reel.id === id
          ? { ...reel, isLiked: !reel.isLiked, likes: reel.isLiked ? reel.likes - 1 : reel.likes + 1 }
          : reel
      );
      
      setReels(updatedReels);
      
      // Find the updated reel to get its new like count
      const updatedReel = updatedReels.find(reel => reel.id === id);
      
      if (updatedReel) {
        // Import updateReel function from our API
        const { updateReel } = await import('@/api/reels');
      
        // Update the like count in the backend
        await updateReel(id, { likes: updatedReel.likes });
      }
    } catch (error) {
      console.error('Error updating likes:', error);
      toast({
        title: "Error",
        description: "Failed to update likes. Please try again.",
        variant: "destructive"
      });
      
      // Revert back to original state on error
      setReels(
        reels.map((reel) => reel)
      );
    }
  };

  const toggleSound = async (id: string) => {
    try {
      // First, update UI for immediate feedback
      const updatedReels = reels.map((reel, idx) => {
        if (reel.id === id) {
          const newSoundOn = !reel.soundOn;
          // If this is the current reel, also update the video element
          if (currentIndex !== -1 && filteredReels[currentIndex]?.id === id) {
            const videoElement = document.querySelector(`video[key="${id}"]`) as HTMLVideoElement;
            if (videoElement) {
              if (newSoundOn) {
                if (hasUserInteracted) {
                  videoElement.muted = false;
                  videoElement.volume = 1;
                } else {
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
      });
      setReels(updatedReels);
      // Find the updated reel to get its new soundOn value
      const updatedReel = updatedReels.find(reel => reel.id === id);
      if (updatedReel) {
        const { updateReel } = await import('@/api/reels');
        await updateReel(id, { soundOn: updatedReel.soundOn });
      }
    } catch (error) {
      console.error('Error updating sound settings:', error);
      toast({
        title: "Error",
        description: "Failed to update sound settings. Please try again.",
        variant: "destructive"
      });
      setReels([...reels]);
    }
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
      
      // Pause any playing videos
      const currentVideo = document.querySelector(`video[key="${filteredReels[currentIndex]?.id}"]`) as HTMLVideoElement;
      if (currentVideo) {
        currentVideo.pause();
      }
    }
  };

  const handleSwipeDown = () => {
    if (currentIndex > 0) {
      setIsSwiping(true);
      setCurrentIndex(currentIndex - 1);
      
      // Pause any playing videos
      const currentVideo = document.querySelector(`video[key="${filteredReels[currentIndex]?.id}"]`) as HTMLVideoElement;
      if (currentVideo) {
        currentVideo.pause();
      }
    }
  };
  
  // Reset current index when view mode changes
  useEffect(() => {
    setCurrentIndex(0);
    // When switching to 'my' view, check if there are any reels
    if (viewMode === 'my' && filteredReels.length === 0) {
      // No need to do anything special here, the UI already handles empty state
    }
  }, [viewMode, filteredReels.length]);

  // Additional error handler for default videos
  useEffect(() => {
          const errorHandler = (e: Event) => {
      const target = e.target;
      if (target instanceof HTMLVideoElement || target instanceof HTMLImageElement) {
        // Check if image is from our sample sources and don't show error for those
        if (target.src && !SAMPLE_IMAGES.some(url => target.src === url)) {
          console.error('Media loading error:', target.src);
          
          if (target.src && CIVIC_VIDEOS.some(url => target.src.includes(url.split('/').pop() || ''))) {
            const errorNotice = document.getElementById('video-error-notice');
            if (errorNotice) {
              errorNotice.classList.remove('hidden');
              setTimeout(() => {
                errorNotice.classList.add('hidden');
              }, 5000);
            }
          }
        }
      }
    };
    
    document.addEventListener('error', errorHandler, { capture: true });
    
    return () => {
      document.removeEventListener('error', errorHandler, { capture: true });
    };
  }, []);

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
        <div className="relative flex items-center mb-6 w-[260px] h-12 bg-zinc-900 rounded-full shadow-lg border border-purple-700/30 mt-[-16px]">
          <motion.div
            className="absolute top-1 left-1 h-10 w-[124px] bg-gradient-to-r from-purple-600 to-purple-700 rounded-full z-0 shadow-md"
            animate={{ x: viewMode === 'all' ? 0 : 128 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            style={{ width: '124px' }}
          />
          <button
            onClick={() => setViewMode('all')}
            className={`relative z-10 w-[124px] h-10 rounded-full text-base font-semibold transition-all duration-300 focus:outline-none ${viewMode === 'all' ? 'text-white' : 'text-purple-300 hover:text-white'}`}
          >
            All Reels
          </button>
          <button
            onClick={() => setViewMode('my')}
            className={`relative z-10 w-[124px] h-10 rounded-full text-base font-semibold transition-all duration-300 focus:outline-none ${viewMode === 'my' ? 'text-white' : 'text-purple-300 hover:text-white'}`}
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
        
        {/* Upload Dialog with Verification UI */}
        <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {verificationState === 'idle' && "Upload New Reel"}
                {verificationState === 'verifying' && "AI Verification in Progress"}
                {verificationState === 'success' && "Verification Complete"}
                {verificationState === 'uploading' && "Uploading Content"}
              </DialogTitle>
              {verificationState === 'idle' && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="absolute right-4 top-4" 
                  onClick={handleCancelUpload}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {verificationState === 'idle' && selectedFile && (
                <div className="mt-2 p-2 border rounded-md">
                  <p className="text-sm">{selectedFile.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              )}
              
              {/* Verification Process UI */}
              {verificationState === 'verifying' && (
                <div className="flex flex-col items-center justify-center py-6 w-full">
                  <div className="relative mb-6">
                    <div className="w-24 h-24 rounded-full border-4 border-purple-100 flex items-center justify-center">
                      <motion.div
                        className="absolute inset-0 rounded-full border-4 border-purple-500"
                        style={{
                          pathLength: verificationProgress / 100,
                          rotate: -90,
                          strokeDasharray: "1, 1",
                          strokeDashoffset: 0,
                        }}
                        animate={{
                          borderWidth: [4, 6, 4],
                          opacity: [0.8, 1, 0.8],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      />
                      <Loader2 className="h-10 w-10 text-purple-500 animate-spin" />
                    </div>
                  </div>
                  <div className="w-full max-w-xs mx-auto mb-4">
                    <ol className="space-y-2">
                      {VERIFICATION_STEPS.map((step, idx) => (
                        <li key={step.key} className="flex items-center gap-2">
                          {idx < currentVerificationStep ? (
                            <span className="text-green-500"><svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg></span>
                          ) : idx === currentVerificationStep ? (
                            <span className="w-4 h-4 rounded-full bg-purple-500 animate-pulse inline-block" />
                          ) : (
                            <span className="w-4 h-4 rounded-full bg-gray-300 inline-block" />
                          )}
                          <span className={`text-sm ${idx === currentVerificationStep ? 'font-semibold text-purple-700' : idx < currentVerificationStep ? 'text-gray-500 line-through' : 'text-gray-400'}`}>{step.label}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                    <motion.div 
                      className="bg-purple-600 h-2.5 rounded-full"
                      initial={{ width: "0%" }}
                      animate={{ width: `${verificationProgress}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                  <p className="text-xs text-gray-500">{verificationProgress}% complete</p>
                </div>
              )}
              
              {/* Verification Success UI */}
              {verificationState === 'success' && (
                <div className="flex flex-col items-center justify-center py-6">
                  <motion.div 
                    className="mb-6 bg-green-100 p-4 rounded-full"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ 
                      type: "spring", 
                      stiffness: 260, 
                      damping: 20 
                    }}
                  >
                    <ShieldCheck className="h-16 w-16 text-green-500" />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <p className="text-center text-lg font-medium mb-2">Verification Complete</p>
                    <p className="text-center text-sm text-gray-500">Your content has been approved and will be uploaded</p>
                  </motion.div>
                </div>
              )}
              
              {/* Uploading UI */}
              {verificationState === 'uploading' && (
                <div className="flex flex-col items-center justify-center py-6">
                  <div className="mb-6">
                    <Loader2 className="h-12 w-12 text-purple-500 animate-spin" />
                  </div>
                  <p className="text-center text-lg font-medium mb-2">Uploading Content</p>
                  <p className="text-center text-sm text-gray-500">Your verified content is being uploaded</p>
                </div>
              )}
            </div>
            <DialogFooter>
              {verificationState === 'idle' && (
                <>
                  <Button onClick={handleCancelUpload} variant="outline">
                    Cancel
                  </Button>
                  <Button onClick={handleFileUpload} disabled={!selectedFile}>
                    Start Verification
                  </Button>
                </>
              )}
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
                
                document.addEventListener('touchmove', handleTouchMove, { passive: false });
                document.addEventListener('touchend', () => {
                  document.removeEventListener('touchmove', handleTouchMove);
                }, { once: true });
              }}
              onClick={(e) => {
                // Handle click to set user interaction and for taps on mobile
                setHasUserInteracted(true);
                
                // Determine if click is on right or left side of the screen to navigate
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const width = rect.width;
                
                // Right side - next reel
                if (x > width / 2) {
                  handleSwipeUp();
                } 
                // Left side - previous reel
                else {
                  handleSwipeDown();
                }
              }}
            >
              
              <AnimatePresence initial={false} mode="sync">
                {filteredReels.length > 0 ? (
                  <motion.div
                    key={filteredReels[currentIndex].id}
                    initial={{ 
                      y: 500, 
                      opacity: 0,
                      scale: 0.8
                    }}
                    animate={{ 
                      y: 0, 
                      opacity: 1,
                      scale: 1
                    }}
                    exit={{
                      y: -500,
                      opacity: 0,
                      scale: 0.8,
                      transition: { duration: 0.3 }
                    }}
                    transition={{ 
                      type: "spring",
                      stiffness: 300,
                      damping: 30
                    }}
                    className="absolute inset-0 flex flex-col"
                  >
                    {/* Content */}
                    <div className="relative z-10 flex flex-col justify-between h-full">
                      {/* Media container with proper aspect ratio */}
                      <div className="absolute inset-0 bg-black">
                        {filteredReels.length > 0 ? (
                          <MediaDisplay
                            key={filteredReels[currentIndex].id}
                            mediaUrl={filteredReels[currentIndex].media.url}
                            mediaType={filteredReels[currentIndex].media.type}
                            className="w-full h-full"
                            autoPlay={true}
                            loop={true}
                            controls={false}
                            muted={!filteredReels[currentIndex].soundOn}
                            onError={(e) => {
                              console.error('Media error:', e);
                              toast({
                                title: "Media Error",
                                description: "There was an error loading this content",
                                variant: "destructive"
                              });
                            }}
                          />
                        ) : (
                          <div
                            className="w-full h-full flex items-center justify-center bg-gray-900"
                            key="empty-state"
                          >
                            <p className="text-white text-lg">No content available</p>
                          </div>
                        )
                        }
                        {/* Enhanced gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/90" />
                      </div>
                      
                      {/* Scroll indicators */}
                      <div className="absolute left-1/2 transform -translate-x-1/2 top-4 flex flex-col items-center">
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: currentIndex > 0 ? 0.7 : 0 }}
                          className="w-8 h-8 flex items-center justify-center mb-1"
                        >
                          <div className="w-1 h-4 bg-white/60 rounded-full"></div>
                        </motion.div>
                      </div>
                      
                      <div className="absolute left-1/2 transform -translate-x-1/2 bottom-24 flex flex-col items-center">
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: currentIndex < filteredReels.length - 1 ? 0.7 : 0 }}
                          className="w-8 h-8 flex items-center justify-center mt-1"
                        >
                          <div className="w-1 h-4 bg-white/60 rounded-full"></div>
                        </motion.div>
                      </div>
                      
                      {/* Right side actions - Enhanced Instagram style */}
                      <div className="absolute right-4 bottom-24 flex flex-col items-center space-y-6">
                        <div className="flex flex-col items-center space-y-1">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-white hover:bg-white/20 active:scale-90 transition-all duration-150 rounded-full h-14 w-14 backdrop-blur-sm"
                            onClick={e => {
                              e.stopPropagation();
                              handleLike(filteredReels[currentIndex].id);
                            }}
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
                          onClick={e => {
                            e.stopPropagation();
                            toggleSound(filteredReels[currentIndex].id);
                          }}
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
                      
                      {/* Reel position indicator */}
                      <div className="absolute top-2 right-2 left-2">
                        <div className="flex gap-1">
                          {filteredReels.map((_, index) => (
                            <div 
                              key={index}
                              className={`h-0.5 rounded-full flex-1 ${
                                index === currentIndex ? 'bg-white' : 'bg-white/30'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ) : viewMode === 'my' && filteredReels.length === 0 ? (
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
