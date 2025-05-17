import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Trash2, FileText, Bookmark, BarChart3, Coins, Coffee } from "lucide-react";

export function Hero() {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute right-1/3 top-1/3 w-[500px] h-[500px] bg-purple-400/20 dark:bg-purple-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute left-1/3 bottom-1/4 w-[400px] h-[400px] bg-purple-600/20 dark:bg-purple-600/10 rounded-full blur-3xl"></div>
        <div className="absolute left-1/4 top-1/4 w-12 h-12 bg-purple-400 rounded-full blur-md opacity-30 animate-float"></div>
        <div className="absolute right-1/4 bottom-1/3 w-16 h-16 bg-purple-500 rounded-full blur-md opacity-30 animate-float" style={{ animationDelay: "1s" }}></div>
        <div className="absolute right-1/2 top-1/2 w-8 h-8 bg-purple-300 rounded-full blur-sm opacity-30 animate-float" style={{ animationDelay: "2s" }}></div>
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
            className="flex flex-col sm:flex-row justify-center gap-4" 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
          >
            <Button asChild size="lg" className="gap-2 group">
              <Link to="/register">
                Get Started
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/about">Learn More</Link>
            </Button>
          </motion.div>

          {/* Key Features */}
          <motion.div
            className="mt-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.8 }}
          >
            <h3 className="text-xl font-semibold mb-6 font-poppins">Key Features</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              <motion.div 
                className="flex flex-col items-center text-center p-4 rounded-lg hover:bg-secondary/30 transition-colors"
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-primary/10 mb-3">
                  <Trash2 className="h-6 w-6 text-primary" />
                </div>
                <h4 className="font-medium">QR Smart Dustbins</h4>
              </motion.div>
              
              <motion.div 
                className="flex flex-col items-center text-center p-4 rounded-lg hover:bg-secondary/30 transition-colors"
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-primary/10 mb-3">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <h4 className="font-medium">Fake News Analyzer</h4>
              </motion.div>
              
              <motion.div 
                className="flex flex-col items-center text-center p-4 rounded-lg hover:bg-secondary/30 transition-colors"
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-primary/10 mb-3">
                  <Bookmark className="h-6 w-6 text-primary" />
                </div>
                <h4 className="font-medium">Civic Scroll</h4>
              </motion.div>
              
              <motion.div 
                className="flex flex-col items-center text-center p-4 rounded-lg hover:bg-secondary/30 transition-colors"
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-primary/10 mb-3">
                  <BarChart3 className="h-6 w-6 text-primary" />
                </div>
                <h4 className="font-medium">Behavior Tracking & Civic Score</h4>
              </motion.div>
              
              <motion.div 
                className="flex flex-col items-center text-center p-4 rounded-lg hover:bg-secondary/30 transition-colors"
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-primary/10 mb-3">
                  <Coins className="h-6 w-6 text-primary" />
                </div>
                <h4 className="font-medium">Civic Coins</h4>
              </motion.div>
              
              <motion.div 
                className="flex flex-col items-center text-center p-4 rounded-lg hover:bg-secondary/30 transition-colors"
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-primary/10 mb-3">
                  <Coffee className="h-6 w-6 text-primary" />
                </div>
                <h4 className="font-medium">Free Food</h4>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
