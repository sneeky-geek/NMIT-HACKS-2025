import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { motion } from "framer-motion";
import { 
  Leaf, 
  HeartHandshake, 
  Recycle, 
  Droplets, 
  Sun, 
  Bus,
  ChevronRight
} from "lucide-react";

const missions = [
  {
    id: 1,
    title: "Plant a Tree",
    description: "Join our community tree planting initiative to enhance green spaces and improve air quality.",
    icon: <Leaf className="h-6 w-6" />,
    color: "bg-green-100 dark:bg-green-900/20",
    iconColor: "text-green-600 dark:text-green-400",
    borderColor: "border-green-200 dark:border-green-800",
  },
  {
    id: 2,
    title: "Help a Stranger",
    description: "Practice random acts of kindness by offering assistance to someone in need in your community.",
    icon: <HeartHandshake className="h-6 w-6" />,
    color: "bg-purple-100 dark:bg-purple-900/20",
    iconColor: "text-purple-600 dark:text-purple-400",
    borderColor: "border-purple-200 dark:border-purple-800",
  },
  {
    id: 3,
    title: "Reduce Plastic",
    description: "Minimize single-use plastic consumption by adopting reusable alternatives in your daily life.",
    icon: <Recycle className="h-6 w-6" />,
    color: "bg-blue-100 dark:bg-blue-900/20",
    iconColor: "text-blue-600 dark:text-blue-400",
    borderColor: "border-blue-200 dark:border-blue-800",
  },
  {
    id: 4,
    title: "Save Water",
    description: "Conserve water through simple daily practices and raise awareness about water scarcity.",
    icon: <Droplets className="h-6 w-6" />,
    color: "bg-cyan-100 dark:bg-cyan-900/20",
    iconColor: "text-cyan-600 dark:text-cyan-400",
    borderColor: "border-cyan-200 dark:border-cyan-800",
  },
  {
    id: 5,
    title: "Promote Clean Energy",
    description: "Support renewable energy initiatives and advocate for sustainable power solutions.",
    icon: <Sun className="h-6 w-6" />,
    color: "bg-amber-100 dark:bg-amber-900/20",
    iconColor: "text-amber-600 dark:text-amber-400",
    borderColor: "border-amber-200 dark:border-amber-800",
  },
  {
    id: 6,
    title: "Use Public Transport",
    description: "Reduce carbon emissions by choosing public transportation over personal vehicles when possible.",
    icon: <Bus className="h-6 w-6" />,
    color: "bg-indigo-100 dark:bg-indigo-900/20",
    iconColor: "text-indigo-600 dark:text-indigo-400",
    borderColor: "border-indigo-200 dark:border-indigo-800",
  },
];

export default function Missions() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        <div className="relative mb-12 max-w-3xl mx-auto text-center">
          <div className="absolute inset-0 flex items-center justify-center opacity-10">
            <div className="w-40 h-40 rounded-full bg-primary blur-3xl"></div>
          </div>
          
          <motion.h1 
            className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-foreground relative z-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Civic Missions
          </motion.h1>
          
          <motion.p 
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Join our impactful civic and environmental initiatives to create a more sustainable and compassionate world.
          </motion.p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {missions.map((mission, index) => (
            <motion.div
              key={mission.id}
              className={`rounded-xl border ${mission.borderColor} overflow-hidden bg-card shadow-sm hover:shadow-md transition-all duration-300`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div className="p-6">
                <div className={`w-12 h-12 rounded-lg ${mission.color} flex items-center justify-center mb-4`}>
                  <div className={`${mission.iconColor}`}>
                    {mission.icon}
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold mb-2">{mission.title}</h3>
                <p className="text-muted-foreground mb-6">{mission.description}</p>
                
                <Button variant="outline" className="group w-full flex items-center justify-center gap-2">
                  Join Mission
                  <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <div className="mb-6">
            <div className="inline-block p-4 rounded-full bg-primary/10">
              <Leaf className="h-6 w-6 text-primary" />
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-4">Ready to make a difference?</h2>
          <p className="text-muted-foreground max-w-lg mx-auto mb-6">
            Start your journey towards positive change by joining one of our missions today.
          </p>
          <Button size="lg" className="rounded-full px-6">
            Explore All Missions
          </Button>
        </div>
      </div>
    </div>
  );
} 