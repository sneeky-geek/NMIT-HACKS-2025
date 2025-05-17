import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FeatureCard } from "@/components/FeatureCard";
import { ArrowRight, Bookmark, BarChart3, Coins, Trash2, FileText, Coffee } from "lucide-react";

export function Hero() {
  const features = [
    {
      title: "QR Smart Dustbins",
      description: "Scan QR codes on smart bins and earn civic coins for responsible waste disposal.",
      icon: <Trash2 className="h-6 w-6" />
    },
    {
      title: "Fake News Analyzer",
      description: "Verify information and detect fake news with our AI-powered analyzer.",
      icon: <FileText className="h-6 w-6" />
    },
    {
      title: "Civic Scroll",
      description: "Personalized civic content feed curated by AI, keeping you informed about your community.",
      icon: <Bookmark className="h-6 w-6" />
    },
    {
      title: "Behavior Tracking & Civic Score",
      description: "Monitor your civic score based on your community contributions and engagement.",
      icon: <BarChart3 className="h-6 w-6" />
    },
    {
      title: "Civic Coins",
      description: "Track your earned coins and redeem them for rewards or use them for donations.",
      icon: <Coins className="h-6 w-6" />
    },
    {
      title: "Free Food",
      description: "Redeem your civic coins for free food at participating local restaurants and cafes.",
      icon: <Coffee className="h-6 w-6" />
    }
  ];
  return (
    <>
      {/* Hero Section */}
      <section className="relative pt-24 pb-12 overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute right-1/4 top-1/4 w-[450px] h-[450px] bg-purple-400/15 dark:bg-purple-500/8 rounded-full blur-3xl animate-pulse-slow"></div>
          <div className="absolute left-1/4 bottom-1/3 w-[400px] h-[400px] bg-purple-600/15 dark:bg-purple-600/8 rounded-full blur-3xl"></div>
          <div className="absolute left-1/3 top-1/3 w-10 h-10 bg-purple-400 rounded-full blur-md opacity-20 animate-float"></div>
          <div className="absolute right-1/3 bottom-1/4 w-12 h-12 bg-purple-500 rounded-full blur-md opacity-20 animate-float" style={{ animationDelay: "1s" }}></div>
          <div className="absolute right-1/2 top-1/2 w-8 h-8 bg-purple-300 rounded-full blur-sm opacity-20 animate-float" style={{ animationDelay: "2s" }}></div>
        </div>
        
        <div className="container px-4 mx-auto">
          <motion.div 
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <motion.h1 
              className="mb-6 text-4xl md:text-6xl font-bold tracking-tight font-poppins"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              Building a <span className="text-primary">Better Community</span> Together
            </motion.h1>
            <motion.p 
              className="mb-8 text-lg md:text-xl text-muted-foreground font-inter" 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
            >
              CiviX rewards civic engagement through gamification, digital rewards, and smart civic tools. Make your community better while earning civic coins.
            </motion.p>
            <motion.div 
              className="flex flex-col sm:flex-row justify-center gap-4 mb-4" 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.6 }}
            >
              <Button size="lg" className="gap-2 group">
                Get Started
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button size="lg" variant="outline">
                Learn More
              </Button>
            </motion.div>
          </motion.div>
        </div>
              {/* Features Section */}
      <section className="relative mt-8 pt-8 pb-16 overflow-hidden">
        {/* Background elements for features section - using similar styling as hero section */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute right-1/4 bottom-1/4 w-[350px] h-[350px] bg-purple-400/10 dark:bg-purple-500/5 rounded-full blur-3xl"></div>
          <div className="absolute left-1/4 top-1/3 w-[300px] h-[300px] bg-purple-600/10 dark:bg-purple-600/5 rounded-full blur-3xl"></div>
          <div className="absolute left-1/3 bottom-1/3 w-8 h-8 bg-purple-400 rounded-full blur-md opacity-15 animate-float"></div>
        </div>
        
        <div className="container px-4 mx-auto">
          <motion.div 
            className="text-center max-w-3xl mx-auto mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <img src="/logo.png" alt="CiviX Logo" className="h-16 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-4 font-poppins">Our Features</h2>
            <p className="text-foreground/70 font-inter">
              Discover how CiviX empowers you to make a difference in your community.
            </p>
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
      
      </section>
      

    </>
  );
}
