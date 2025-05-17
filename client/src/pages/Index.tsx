import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { FeatureCard } from "@/components/FeatureCard";
import { Calendar, Coins, Info, Trash, Bookmark, BarChart3, Heart, ArrowRight, LogIn, UserCircle, Building2 } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const features = [
    {
      title: "CivicScroll",
      description: "Personalized civic content feed curated by AI, keeping you informed about your community.",
      icon: <Bookmark className="h-6 w-6" />
    },
    {
      title: "Smart Dustbin",
      description: "Scan QR codes on smart bins and earn civic coins for responsible waste disposal.",
      icon: <Trash className="h-6 w-6" />
    },
    {
      title: "Civic Coin Wallet",
      description: "Track your earned coins and redeem them for rewards or use them for donations.",
      icon: <Coins className="h-6 w-6" />
    },
    {
      title: "Behavior Tracker",
      description: "Monitor your civic score based on your community contributions and engagement.",
      icon: <BarChart3 className="h-6 w-6" />
    },
    {
      title: "Info Verifier",
      description: "Submit content for verification and earn rewards for sharing accurate information.",
      icon: <Info className="h-6 w-6" />
    },
    {
      title: "Mental Health Room",
      description: "Access resources for mental well-being, including guides and support services.",
      icon: <Heart className="h-6 w-6" />
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
        

        
        {/* How It Works Section */}
        <section className="py-24 bg-gradient-to-b from-background to-secondary/50 relative overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <div className="absolute left-1/4 bottom-1/3 w-[300px] h-[300px] bg-purple-400/10 dark:bg-purple-500/5 rounded-full blur-3xl"></div>
            <div className="absolute right-1/4 top-1/3 w-[250px] h-[250px] bg-purple-600/10 dark:bg-purple-600/5 rounded-full blur-3xl"></div>
          </div>
          
          <div className="container px-4 mx-auto">
            <motion.div 
              className="text-center max-w-3xl mx-auto mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold mb-4 font-poppins">How It Works</h2>
              <p className="text-foreground/70 font-inter">
                CiviX makes civic engagement simple, rewarding, and impactful.
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-4xl mx-auto">
              <motion.div 
                className="flex flex-col items-center text-center"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className="w-16 h-16 flex items-center justify-center rounded-2xl glass-card shadow-glass text-2xl font-bold mb-5 text-primary">1</div>
                <h3 className="text-xl font-semibold mb-3 font-poppins">Engage</h3>
                <p className="text-foreground/70 font-inter">Participate in civic activities like proper waste disposal, information verification</p>
              </motion.div>
              
              <motion.div 
                className="flex flex-col items-center text-center"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                whileHover={{ y: -5 }}
              >
                <div className="w-16 h-16 flex items-center justify-center rounded-2xl glass-card shadow-glass text-2xl font-bold mb-5 text-primary">2</div>
                <h3 className="text-xl font-semibold mb-3 font-poppins">Earn</h3>
                <p className="text-foreground/70 font-inter">Collect Civic Coins as rewards for your positive contributions to the community</p>
              </motion.div>
              
              <motion.div 
                className="flex flex-col items-center text-center"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                whileHover={{ y: -5 }}
              >
                <div className="w-16 h-16 flex items-center justify-center rounded-2xl glass-card shadow-glass text-2xl font-bold mb-5 text-primary">3</div>
                <h3 className="text-xl font-semibold mb-3 font-poppins">Benefit</h3>
                <p className="text-foreground/70 font-inter">Redeem coins for rewards or donate them to community causes</p>
              </motion.div>
            </div>
          </div>
        </section>
        
        
      </main>
      
      <footer className="py-0 border-t">
        <div className="container px-2 mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <div className="flex items-center space-x-2">
                <img src="/logo.png" alt="CiviX Logo" className="h-16 w-auto" />
                <span className="font-semibold text-lg font-poppins">CiviX</span>
              </div>
            </div>
            <div className="text-sm text-foreground/70 font-inter">
              2025 CiviX. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;