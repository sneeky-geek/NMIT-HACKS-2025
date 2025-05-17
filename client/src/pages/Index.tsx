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
        
        {/* Features Section */}
        <section className="py-24 bg-gradient-to-b from-secondary/50 to-background">
          <div className="container px-4 mx-auto">
            <motion.div 
              className="text-center max-w-3xl mx-auto mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold mb-4 font-poppins">Our Features</h2>
              <p className="text-foreground/70 font-inter">
                Explore the tools and services that make civic engagement rewarding and enjoyable.
              </p>
              
              {!isAuthenticated && (
                <div className="mt-6">
                  <p className="text-sm text-primary mb-3">
                    Sign in to access all features
                  </p>
                  <div className="flex justify-center gap-4 flex-wrap">
                    <Button
                      onClick={() => navigate('/login')}
                      className="flex items-center gap-2"
                      size="lg"
                    >
                      <LogIn className="h-4 w-4" />
                      Login to Continue
                    </Button>
                  </div>
                </div>
              )}
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <FeatureCard
                  key={feature.title}
                  title={feature.title}
                  description={feature.description}
                  icon={feature.icon}
                  index={index}
                />
              ))}
            </div>
          </div>
        </section>
        
        {/* How It Works Section */}
        <section className="py-24 relative overflow-hidden">
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
        
        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-br from-purple-600 to-purple-700 text-white">
          <div className="container px-4 mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold mb-6 font-poppins">Ready to Make a Difference?</h2>
              <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90 font-inter">
                Join CiviX today and start your journey toward better civic engagement and a stronger community.
              </p>
              {!isAuthenticated ? (
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <motion.button
                    className="px-8 py-4 bg-white text-purple-700 rounded-full font-medium hover:bg-white/90 transition-all duration-300 flex items-center gap-2 btn-hover"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate('/login')}
                  >
                    <UserCircle className="w-5 h-5" />
                    Login as Volunteer
                  </motion.button>
                  
                  <motion.button
                    className="px-8 py-4 bg-purple-900 text-white rounded-full font-medium hover:bg-purple-800 transition-all duration-300 flex items-center gap-2 btn-hover"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate('/login?type=ngo')}
                  >
                    <Building2 className="w-5 h-5" />
                    Login as NGO
                  </motion.button>
                </div>
              ) : (
                <motion.button
                  className="px-8 py-4 bg-white text-purple-700 rounded-full font-medium hover:bg-white/90 transition-all duration-300 flex items-center gap-2 mx-auto btn-hover"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate(user?.userType === 'ngo' ? '/ngo-dashboard' : '/dashboard')}
                >
                  Go to Dashboard
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              )}
            </motion.div>
          </div>
        </section>
      </main>
      
      <footer className="py-10 border-t">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-md">
                  <span className="text-white font-bold">C</span>
                </div>
                <span className="font-semibold text-lg font-poppins">CiviX</span>
              </div>
            </div>
            <div className="text-sm text-foreground/70 font-inter">
              © 2025 CiviX. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
