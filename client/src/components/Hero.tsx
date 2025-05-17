import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, QrCode, FileSearch, Scroll, BarChart3, Coins } from "lucide-react";

export function Hero() {
  const featureIcons = [
    { icon: <QrCode className="h-6 w-6" />, label: "QR Smart Dustbins", delay: 0.1 },
    { icon: <FileSearch className="h-6 w-6" />, label: "Fake News Analyzer", delay: 0.2 },
    { icon: <Scroll className="h-6 w-6" />, label: "Civic Scroll", delay: 0.3 },
    { icon: <BarChart3 className="h-6 w-6" />, label: "Behavior Tracking", delay: 0.4 },
    { icon: <Coins className="h-6 w-6" />, label: "Civic Coins", delay: 0.5 }
  ];

  return (
    <section className="relative py-12 md:py-24 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute right-1/3 top-1/3 w-[500px] h-[500px] bg-gradient-to-br from-primary/20 to-purple-400/10 dark:from-primary/10 dark:to-purple-500/5 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute left-1/3 bottom-1/4 w-[400px] h-[400px] bg-gradient-to-tr from-purple-600/20 to-primary/10 dark:from-purple-600/10 dark:to-primary/5 rounded-full blur-3xl"></div>
        
        {/* Animated particles */}
        <div className="absolute inset-0 opacity-30 dark:opacity-20">
          {[...Array(8)].map((_, i) => (
            <motion.div 
              key={i}
              className="absolute bg-primary rounded-full blur-sm"
              style={{
                width: Math.random() * 8 + 4 + 'px',
                height: Math.random() * 8 + 4 + 'px',
                left: Math.random() * 100 + '%',
                top: Math.random() * 100 + '%',
              }}
              animate={{
                y: [0, Math.random() * -30 - 10, 0],
                opacity: [0.2, 0.8, 0.2],
              }}
              transition={{
                duration: Math.random() * 5 + 5,
                repeat: Infinity,
                delay: Math.random() * 5,
              }}
            />
          ))}
        </div>
        
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiMwMDAwMDAiIGZpbGwtb3BhY2l0eT0iMC4wMiIgZD0iTTAgMGg2MHY2MEgweiIvPjxwYXRoIGQ9Ik0zNiAxOGMwLTkuOTQtOC4wNi0xOC0xOC0xOFYyYzcuNzMgMCAxNCA2LjI3IDE0IDE0SDM0YzAgNy43MyA2LjI3IDE0IDE0IDE0djJjLTkuOTQgMC0xOC04LjA2LTE4LTE4eiIgZmlsbD0iI2ZmZmZmZiIgZmlsbC1vcGFjaXR5PSIwLjA1Ii8+PC9nPjwvc3ZnPg==')] opacity-10 dark:opacity-5"></div>
      </div>
      
      <div className="container px-4 mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left column - Hero text */}
          <motion.div 
            className="max-w-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="inline-block mb-4 px-4 py-1.5 bg-primary/10 dark:bg-primary/20 rounded-full text-primary font-medium text-sm tracking-wide"
            >
              Transforming Civic Engagement
            </motion.div>
            
            <motion.h1 
              className="mb-6 text-4xl md:text-6xl font-bold tracking-tight font-poppins"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              Building a <span className="text-gradient font-bold">Better Community</span> Together
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
              className="flex flex-wrap gap-4 mb-8" 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.6 }}
            >
              <Button size="lg" className="bg-gradient-primary hover:opacity-90 transition-opacity">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              
              <Button size="lg" variant="outline" className="border-primary/20 hover:bg-primary/5">
                Learn More
              </Button>
            </motion.div>
            
            {/* Feature tags */}
            <div className="flex flex-wrap gap-3 mt-8">
              {featureIcons.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.7 + item.delay }}
                  className="flex items-center gap-2 px-3 py-2 bg-background/80 dark:bg-background/40 backdrop-blur-sm rounded-lg border border-border shadow-sm"
                >
                  <span className="text-primary">{item.icon}</span>
                  <span className="text-sm font-medium">{item.label}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
          
          {/* Right column - 3D/Visual element */}
          <motion.div 
            className="relative hidden lg:flex justify-center items-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <div className="relative w-full max-w-md aspect-square">
              {/* Main circle with gradient */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/80 to-purple-500/80 blur-md animate-pulse-slow"></div>
              <div className="absolute inset-2 rounded-full glass-card flex items-center justify-center overflow-hidden">
                {/* Inner content - City illustration or visualization */}
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjYwMCIgdmlld0JveD0iMCAwIDYwMCA2MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTMwMCA1MDBWMTAwTTEwMCAyMDBWNTAwTTUwMCAyMDBWNTAwTTIwMCAxNTBWNTAwTTQwMCAxNTBWNTAwTTE1MCAzMDBWNTAwTTI1MCAyNTBWNTAwTTM1MCAyNTBWNTAwTTQ1MCAzMDBWNTAwIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLW9wYWNpdHk9IjAuMiIgc3Ryb2tlLXdpZHRoPSIyIi8+PHBhdGggZD0iTTEwMCAyMDBIMjAwTTQwMCAyMDBINTAwTTE1MCAzMDBIMjUwTTM1MCAzMDBINDUwTTEwMCA0MDBINTAwIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLW9wYWNpdHk9IjAuMiIgc3Ryb2tlLXdpZHRoPSIyIi8+PC9zdmc+')]  opacity-30 dark:opacity-20"></div>
                
                {/* Floating elements */}
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-12 h-12 rounded-lg glass-card flex items-center justify-center"
                    style={{
                      left: `${30 + Math.sin(i * 72 * Math.PI / 180) * 35}%`,
                      top: `${30 + Math.cos(i * 72 * Math.PI / 180) * 35}%`,
                    }}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.5 + i * 0.1 }}
                  >
                    <div className="text-primary">
                      {featureIcons[i].icon}
                    </div>
                  </motion.div>
                ))}
                
                {/* Center element */}
                <motion.div
                  className="relative w-20 h-20 rounded-2xl glass-card flex items-center justify-center shadow-lg"
                  initial={{ opacity: 0, rotateY: 90 }}
                  animate={{ opacity: 1, rotateY: 0 }}
                  transition={{ duration: 0.7, delay: 0.8 }}
                >
                  <div className="absolute inset-1 rounded-xl bg-gradient-primary opacity-20"></div>
                  <span className="text-2xl font-bold text-primary">CiviX</span>
                </motion.div>
              </div>
            </div>
            
            {/* Floating badges */}
            <motion.div 
              className="absolute -top-4 -right-4 px-4 py-2 bg-gradient-primary rounded-full text-white text-sm font-medium shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1 }}
            >
              Smart City
            </motion.div>
            
            <motion.div 
              className="absolute -bottom-4 -left-4 px-4 py-2 glass-card rounded-full text-sm font-medium shadow-lg"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.1 }}
            >
              <span className="text-gradient">Civic Engagement</span>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
