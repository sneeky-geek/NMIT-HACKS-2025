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
  ChevronRight,
  Calendar,
  MapPin,
  Users,
  Phone
} from "lucide-react";
import { useState } from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// CiviX missions data
const civixMissions = [
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

// NGO activities data
const ngoActivities = [
  {
    id: 1,
    name: "Green Earth Foundation",
    activity: "Community Tree Plantation Drive",
    date: "May 25, 2025",
    time: "9:00 AM - 12:00 PM",
    location: "Cubbon Park, Bengaluru",
    volunteers: 25,
    contact: "+91 9876543210",
    description: "Join us for a massive tree plantation drive to increase the green cover in Bengaluru."
  },
  {
    id: 2,
    name: "Clean City Initiative",
    activity: "Beach Cleanup Drive",
    date: "May 28, 2025",
    time: "7:00 AM - 10:00 AM",
    location: "Juhu Beach, Mumbai",
    volunteers: 50,
    contact: "+91 9876543211",
    description: "Help us clean one of Mumbai's most popular beaches and raise awareness about plastic pollution."
  },
  {
    id: 3,
    name: "Education For All",
    activity: "Book Donation Camp",
    date: "June 5, 2025",
    time: "10:00 AM - 4:00 PM",
    location: "Government School, Koramangala, Bengaluru",
    volunteers: 15,
    contact: "+91 9876543212",
    description: "Donate books and stationery for underprivileged children to support their education."
  },
  {
    id: 4,
    name: "Hunger Relief Network",
    activity: "Food Distribution Drive",
    date: "June 10, 2025",
    time: "12:00 PM - 3:00 PM",
    location: "Slum areas, Whitefield, Bengaluru",
    volunteers: 30,
    contact: "+91 9876543213",
    description: "Help distribute nutritious meals to homeless and underprivileged communities."
  },
  {
    id: 5,
    name: "Animal Welfare Society",
    activity: "Stray Animal Vaccination Camp",
    date: "June 15, 2025",
    time: "9:00 AM - 2:00 PM",
    location: "HSR Layout, Bengaluru",
    volunteers: 20,
    contact: "+91 9876543214",
    description: "Assist veterinarians in vaccinating stray dogs and cats to prevent rabies and other diseases."
  },
  {
    id: 6,
    name: "Digital Literacy Foundation",
    activity: "Computer Training Workshop",
    date: "June 20, 2025",
    time: "11:00 AM - 3:00 PM",
    location: "Community Center, Indiranagar, Bengaluru",
    volunteers: 10,
    contact: "+91 9876543215",
    description: "Teach basic computer skills to senior citizens and help bridge the digital divide."
  }
];

export default function Missions() {
  const [activeTab, setActiveTab] = useState("civix");
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        {/* Toggle between CiviX Missions and NGO Activities */}
        <div className="flex justify-center mb-8">
          <ToggleGroup type="single" value={activeTab} onValueChange={(value) => value && setActiveTab(value)} className="border rounded-lg">
            <ToggleGroupItem value="civix" className="px-6 py-2 text-sm font-medium">
              CiviX Missions
            </ToggleGroupItem>
            <ToggleGroupItem value="ngo" className="px-6 py-2 text-sm font-medium">
              NGO Activities
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
        
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
            {activeTab === "civix" ? "Civic Missions" : "NGO Activities"}
          </motion.h1>
          
          <motion.p 
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {activeTab === "civix" 
              ? "Join our impactful civic and environmental initiatives to create a more sustainable and compassionate world."
              : "Participate in NGO-led activities and volunteer opportunities to make a positive impact in your community."}
          </motion.p>
        </div>
        
        {activeTab === "civix" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {civixMissions.map((mission, index) => (
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
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {ngoActivities.map((ngo, index) => (
              <motion.div
                key={ngo.id}
                className="rounded-xl border border-border overflow-hidden bg-card shadow-sm hover:shadow-md transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <Card className="border-0 shadow-none h-full flex flex-col">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl mb-1">{ngo.activity}</CardTitle>
                        <CardDescription className="text-sm">
                          <Badge variant="outline" className="mr-2 font-normal">{ngo.name}</Badge>
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="flex-grow">
                    <p className="text-muted-foreground mb-4">{ngo.description}</p>
                    
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{ngo.date} • {ngo.time}</span>
                      </div>
                      
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{ngo.location}</span>
                      </div>
                      
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{ngo.volunteers} volunteers needed</span>
                      </div>
                      
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{ngo.contact}</span>
                      </div>
                    </div>
                  </CardContent>
                  
                  <CardFooter>
                    <Button variant="default" className="w-full">
                      Volunteer Now
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
        
        <div className="mt-16 text-center">
          <div className="mb-6">
            <div className="inline-block p-4 rounded-full bg-primary/10">
              {activeTab === "civix" ? (
                <Leaf className="h-6 w-6 text-primary" />
              ) : (
                <HeartHandshake className="h-6 w-6 text-primary" />
              )}
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-4">Ready to make a difference?</h2>
          <p className="text-muted-foreground max-w-lg mx-auto mb-6">
            {activeTab === "civix"
              ? "Start your journey towards positive change by joining one of our missions today."
              : "Connect with NGOs and participate in volunteer activities to support community causes."}
          </p>
          <Button size="lg" className="rounded-full px-6">
            {activeTab === "civix" ? "Explore All Missions" : "Browse All NGOs"}
          </Button>
        </div>
      </div>
    </div>
  );
} 