import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { FeatureCard } from "@/components/FeatureCard";
import { Calendar, Coins, Info, Trash, Bookmark, BarChart3, Heart, ArrowRight, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Index = () => {
  const features = [
    {
      title: "QR Smart Dustbins",
      description: "Scan QR codes on smart bins and earn civic coins for responsible waste disposal.",
      icon: <Trash className="h-6 w-6" />
    },
    {
      title: "Fake News Analyzer",
      description: "Submit content for verification and earn rewards for sharing accurate information.",
      icon: <Info className="h-6 w-6" />
    },
    {
      title: "Civic Scroll",
      description: "Personalized civic content feed curated by AI, keeping you informed about your community.",
      icon: <Bookmark className="h-6 w-6" />
    },
    {
      title: "Behavior Tracking",
      description: "Monitor your civic score based on your community contributions and engagement.",
      icon: <BarChart3 className="h-6 w-6" />
    },
    {
      title: "Civic Coins",
      description: "Track your earned coins and redeem them for rewards or use them for donations.",
      icon: <Coins className="h-6 w-6" />
    },
    {
      title: "Mental Health Room",
      description: "Access resources for mental well-being, including guides and support services.",
      icon: <Heart className="h-6 w-6" />
    }
  ];

  // Animation variants for staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
        
        {/* Features Section */}
        <section className="py-24 relative overflow-hidden">
          {/* Background elements */}
          <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background via-secondary/20 to-background"></div>
          <div className="absolute inset-0 -z-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiMwMDAwMDAiIGZpbGwtb3BhY2l0eT0iMC4wMiIgZD0iTTAgMGg2MHY2MEgweiIvPjxwYXRoIGQ9Ik0zNiAxOGMwLTkuOTQtOC4wNi0xOC0xOC0xOFYyYzcuNzMgMCAxNCA2LjI3IDE0IDE0SDM0YzAgNy43MyA2LjI3IDE0IDE0IDE0djJjLTkuOTQgMC0xOC04LjA2LTE4LTE4eiIgZmlsbD0iI2ZmZmZmZiIgZmlsbC1vcGFjaXR5PSIwLjA1Ii8+PC9nPjwvc3ZnPg==')] opacity-5"></div>
          
          <div className="container px-4 mx-auto">
            <motion.div 
              className="text-center max-w-3xl mx-auto mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-block mb-4 px-4 py-1.5 bg-primary/10 dark:bg-primary/20 rounded-full text-primary font-medium text-sm tracking-wide">
                Powerful Features
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 font-poppins">
                Smart <span className="text-gradient">Civic Tools</span>
              </h2>
              <p className="text-xl text-muted-foreground font-inter max-w-2xl mx-auto">
                Explore the tools and services that make civic engagement rewarding and enjoyable.
              </p>
            </motion.div>
            
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
            >
              {features.map((feature, index) => (
                <motion.div key={feature.title} variants={itemVariants}>
                  <FeatureCard
                    title={feature.title}
                    description={feature.description}
                    icon={feature.icon}
                    index={index}
                  />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
        
        {/* How It Works Section */}
        <section className="py-24 relative overflow-hidden">
          {/* Background elements */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute left-1/4 bottom-1/3 w-[300px] h-[300px] bg-gradient-to-br from-primary/10 to-purple-400/5 dark:from-primary/5 dark:to-purple-500/5 rounded-full blur-3xl"></div>
            <div className="absolute right-1/4 top-1/3 w-[250px] h-[250px] bg-gradient-to-tr from-purple-600/10 to-primary/5 dark:from-purple-600/5 dark:to-primary/5 rounded-full blur-3xl"></div>
          </div>
          
          <div className="container px-4 mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              {/* Left column - Text content */}
              <motion.div 
                className="max-w-xl"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7 }}
                viewport={{ once: true, margin: "-100px" }}
              >
                <div className="inline-block mb-4 px-4 py-1.5 bg-primary/10 dark:bg-primary/20 rounded-full text-primary font-medium text-sm tracking-wide">
                  Simple Process
                </div>
                <h2 className="text-4xl font-bold mb-6 font-poppins">
                  How It <span className="text-gradient">Works</span>
                </h2>
                <p className="text-xl text-muted-foreground font-inter mb-8">
                  CiviX makes civic engagement simple, rewarding, and impactful through a gamified approach.
                </p>
                
                {/* Steps with numbers */}
                <div className="space-y-8">
                  <motion.div 
                    className="flex items-start gap-4"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    viewport={{ once: true }}
                  >
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold text-lg shadow-lg">
                      1
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2 font-poppins">Engage</h3>
                      <p className="text-foreground/70 font-inter">Participate in civic activities like proper waste disposal and information verification.</p>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    className="flex items-start gap-4"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    viewport={{ once: true }}
                  >
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold text-lg shadow-lg">
                      2
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2 font-poppins">Earn</h3>
                      <p className="text-foreground/70 font-inter">Collect Civic Coins as rewards for your positive contributions to the community.</p>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    className="flex items-start gap-4"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    viewport={{ once: true }}
                  >
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold text-lg shadow-lg">
                      3
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2 font-poppins">Benefit</h3>
                      <p className="text-foreground/70 font-inter">Redeem coins for rewards or donate them to community causes of your choice.</p>
                    </div>
                  </motion.div>
                </div>
                
                <motion.div 
                  className="mt-10"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  viewport={{ once: true }}
                >
                  <Button size="lg" className="bg-gradient-primary hover:opacity-90 transition-opacity">
                    Get Started <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </motion.div>
              </motion.div>
              
              {/* Right column - Visual element */}
              <motion.div 
                className="relative hidden lg:block"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7 }}
                viewport={{ once: true, margin: "-100px" }}
              >
                <div className="relative aspect-square max-w-md mx-auto">
                  {/* Main circle with gradient */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/30 to-purple-500/30 blur-md"></div>
                  <div className="absolute inset-4 rounded-full glass-card flex items-center justify-center">
                    {/* Inner content - Animated elements */}
                    <div className="absolute inset-0 rounded-full overflow-hidden">
                      {/* Circular progress track */}
                      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
                        <circle 
                          cx="50" 
                          cy="50" 
                          r="45" 
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="2" 
                          strokeDasharray="1,3" 
                          className="text-primary/20 animate-spin-slow" 
                          style={{ transformOrigin: 'center' }}
                        />
                      </svg>
                      
                      {/* Animated coins */}
                      {[...Array(5)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute w-14 h-14 rounded-full glass-card flex items-center justify-center shadow-lg"
                          style={{
                            left: `${30 + Math.sin(i * 72 * Math.PI / 180) * 35}%`,
                            top: `${30 + Math.cos(i * 72 * Math.PI / 180) * 35}%`,
                          }}
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ 
                            opacity: 1, 
                            scale: 1,
                            x: [0, Math.sin(i * 72 * Math.PI / 180) * 10, 0],
                            y: [0, Math.cos(i * 72 * Math.PI / 180) * 10, 0],
                          }}
                          transition={{ 
                            duration: 5, 
                            repeat: Infinity, 
                            delay: i * 0.5,
                            ease: "easeInOut"
                          }}
                        >
                          <Coins className="h-6 w-6 text-primary" />
                        </motion.div>
                      ))}
                      
                      {/* Center element */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <motion.div
                          className="w-24 h-24 rounded-full glass-card flex items-center justify-center shadow-lg"
                          initial={{ opacity: 0, rotateY: 90 }}
                          animate={{ opacity: 1, rotateY: 0 }}
                          transition={{ duration: 0.7, delay: 0.5 }}
                        >
                          <div className="absolute inset-1 rounded-full bg-gradient-primary opacity-20"></div>
                          <span className="text-2xl font-bold text-gradient">CiviX</span>
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Floating badges */}
                <motion.div 
                  className="absolute top-10 right-0 px-4 py-2 bg-gradient-primary rounded-full text-white text-sm font-medium shadow-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                >
                  Earn Rewards
                </motion.div>
                
                <motion.div 
                  className="absolute bottom-10 left-0 px-4 py-2 glass-card rounded-full text-sm font-medium shadow-lg"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.9 }}
                >
                  <span className="text-gradient">Make an Impact</span>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background via-primary/5 to-background"></div>
          
          <div className="container px-4 mx-auto">
            <motion.div 
              className="relative max-w-4xl mx-auto rounded-3xl overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              {/* Background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/80 to-purple-500/80"></div>
              
              {/* Content */}
              <div className="relative p-8 md:p-12 text-white">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <div>
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 font-poppins">Ready to make a difference?</h2>
                    <p className="text-white/80 mb-6 font-inter">Join our community of civic-minded individuals and start earning rewards for your positive contributions.</p>
                    <div className="flex flex-wrap gap-4">
                      <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-white/90 transition-colors">
                        Get Started <ChevronRight className="ml-1 h-4 w-4" />
                      </Button>
                      <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 transition-colors">
                        Learn More
                      </Button>
                    </div>
                  </div>
                  
                  <div className="hidden md:block">
                    <div className="relative aspect-square max-w-xs mx-auto">
                      {/* Decorative elements */}
                      <div className="absolute inset-0 rounded-full bg-white/10 backdrop-blur-sm"></div>
                      <div className="absolute inset-4 rounded-full bg-white/5 backdrop-blur-sm flex items-center justify-center">
                        <motion.div
                          animate={{ 
                            scale: [1, 1.05, 1],
                            rotate: [0, 5, 0, -5, 0]
                          }}
                          transition={{ 
                            duration: 8, 
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                          className="text-center"
                        >
                          <Coins className="h-16 w-16 mx-auto mb-4 text-white" />
                          <div className="text-2xl font-bold">Civic Coins</div>
                          <div className="text-white/70 mt-2">Earn & Redeem</div>
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;
