import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

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
            
          </motion.div>
        </motion.div>
      </div>


    </section>
  );
}
