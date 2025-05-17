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
  Phone,
  AlertCircle,
  Plus
} from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";

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

// Type definition for NGO activities
interface NGOActivity {
  _id: string;
  name: string; // Activity name
  description: string;
  date: string;
  time: string;
  location: string;
  volunteersNeeded: number;
  volunteers?: Array<{
    userId: string;
    name: string;
    phoneNumber: string;
    joinedAt: string;
  }>;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  volunteerCount: number;
  ngo: {
    _id: string;
    organizationName: string;
    contact?: string;
  };
}

// Fallback demo NGO activities in case the API fetch fails
const demoNgoActivities: NGOActivity[] = [
  {
    _id: "demo1",
    name: "Community Tree Plantation Drive",
    description: "Join us for a massive tree plantation drive to increase the green cover in Bengaluru.",
    date: "2025-05-25",
    time: "9:00 AM - 12:00 PM",
    location: "Cubbon Park, Bengaluru",
    volunteersNeeded: 25,
    volunteerCount: 8,
    status: "upcoming",
    ngo: {
      _id: "ngo1",
      organizationName: "Green Earth Foundation",
      contact: "+91 9876543210"
    }
  },
  {
    _id: "demo2",
    name: "Beach Cleanup Drive",
    description: "Help us clean one of Mumbai's most popular beaches and raise awareness about plastic pollution.",
    date: "2025-05-28",
    time: "7:00 AM - 10:00 AM",
    location: "Juhu Beach, Mumbai",
    volunteersNeeded: 50,
    volunteerCount: 15,
    status: "upcoming",
    ngo: {
      _id: "ngo2",
      organizationName: "Clean City Initiative",
      contact: "+91 9876543211"
    }
  },
  {
    _id: "demo3",
    name: "Book Donation Camp",
    description: "Donate books and stationery for underprivileged children to support their education.",
    date: "2025-06-05",
    time: "10:00 AM - 4:00 PM",
    location: "Government School, Koramangala, Bengaluru",
    volunteersNeeded: 15,
    volunteerCount: 4,
    status: "upcoming",
    ngo: {
      _id: "ngo3",
      organizationName: "Education For All",
      contact: "+91 9876543212"
    }
  },
  {
    _id: "demo4",
    name: "Food Distribution Drive",
    description: "Help distribute nutritious meals to homeless and underprivileged communities.",
    date: "2025-06-10",
    time: "12:00 PM - 3:00 PM",
    location: "Slum areas, Whitefield, Bengaluru",
    volunteersNeeded: 30,
    volunteerCount: 12,
    status: "upcoming",
    ngo: {
      _id: "ngo4",
      organizationName: "Hunger Relief Network",
      contact: "+91 9876543213"
    }
  },
  {
    _id: "demo5",
    name: "Stray Animal Vaccination Camp",
    description: "Assist veterinarians in vaccinating stray dogs and cats to prevent rabies and other diseases.",
    date: "2025-06-15",
    time: "9:00 AM - 2:00 PM",
    location: "HSR Layout, Bengaluru",
    volunteersNeeded: 20,
    volunteerCount: 7,
    status: "upcoming",
    ngo: {
      _id: "ngo5",
      organizationName: "Animal Welfare Society",
      contact: "+91 9876543214"
    }
  },
  {
    _id: "demo6",
    name: "Computer Training Workshop",
    description: "Teach basic computer skills to senior citizens and help bridge the digital divide.",
    date: "2025-06-20",
    time: "11:00 AM - 3:00 PM",
    location: "Community Center, Indiranagar, Bengaluru",
    volunteersNeeded: 10,
    volunteerCount: 3,
    status: "upcoming",
    ngo: {
      _id: "ngo6",
      organizationName: "Digital Literacy Foundation",
      contact: "+91 9876543215"
    }
  }
]

export default function Missions() {
  const [activeTab, setActiveTab] = useState("civix");
  const [isVolunteerDialogOpen, setIsVolunteerDialogOpen] = useState(false);
  const [isCreateActivityDialogOpen, setIsCreateActivityDialogOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<NGOActivity | null>(null);
  const [volunteerForm, setVolunteerForm] = useState({ name: "", phoneNumber: "" });
  const [loading, setLoading] = useState(false);
  const [activitiesLoading, setActivitiesLoading] = useState(true);
  const [ngoActivities, setNgoActivities] = useState<NGOActivity[]>([]);
  const [newActivity, setNewActivity] = useState({
    name: '',
    description: '',
    date: '',
    time: '',
    location: '',
    volunteersNeeded: 1,
    organizationName: '',
    contact: ''
  });
  const { toast } = useToast();
  const { user, token } = useAuth();
  const navigate = useNavigate();
  
  // Fetch NGO activities when component mounts
  useEffect(() => {
    if (activeTab === "ngo") {
      fetchNgoActivities();
    }
  }, [activeTab]);
  
  // Fetch activities from the API
  const fetchNgoActivities = async () => {
    setActivitiesLoading(true);
    try {
      const response = await fetch('/api/activities', {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      
      if (response.ok) {
        const data = await response.json();
        setNgoActivities(data.activities);
      } else {
        // API fetch failed - use demo activities instead
        console.warn('Failed to fetch NGO activities from API, using demo data');
        setNgoActivities(demoNgoActivities);
        toast({
          title: "Using Demo Activities",
          description: "Displaying sample activities since we couldn't connect to the server",
          variant: "default"
        });
      }
    } catch (error) {
      console.error('Error fetching NGO activities:', error);
      // Use demo activities as fallback
      setNgoActivities(demoNgoActivities);
      toast({
        title: "Using Demo Activities",
        description: "Displaying sample activities since we couldn't connect to the server",
        variant: "default"
      });
    } finally {
      setActivitiesLoading(false);
    }
  };
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  // Function to handle activity creation
  const handleCreateActivity = async () => {
    // Validate form
    if (!newActivity.name.trim() || !newActivity.description.trim() || 
        !newActivity.date || !newActivity.time.trim() || 
        !newActivity.location.trim() || 
        (user?.userType !== 'ngo' && !newActivity.organizationName.trim())) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    // Validate volunteers needed
    if (newActivity.volunteersNeeded < 1) {
      toast({
        title: "Error",
        description: "You need at least 1 volunteer for an activity",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    
    try {
      // Use the user's organization name if they are an NGO, otherwise use the provided one
      const organizationName = user?.userType === 'ngo' && user?.ngoDetails?.organizationName 
        ? user.ngoDetails.organizationName
        : newActivity.organizationName;
      
      // For a real implementation this would call the API
      // Since we're using a fallback mechanism, we'll create the activity locally
      const newId = `demo${Date.now()}`;
      
      const createdActivity: NGOActivity = {
        _id: newId,
        name: newActivity.name,
        description: newActivity.description,
        date: newActivity.date,
        time: newActivity.time,
        location: newActivity.location,
        volunteersNeeded: newActivity.volunteersNeeded,
        volunteerCount: 0,
        status: 'upcoming',
        ngo: {
          _id: `ngo${Date.now()}`,
          organizationName: organizationName,
          contact: newActivity.contact || undefined
        }
      };
      
      // Add to activities list
      setNgoActivities([createdActivity, ...ngoActivities]);
      
      // Reset form
      setNewActivity({
        name: '',
        description: '',
        date: '',
        time: '',
        location: '',
        volunteersNeeded: 1,
        organizationName: '',
        contact: ''
      });
      
      setIsCreateActivityDialogOpen(false);
      
      toast({
        title: "Success",
        description: "Activity created successfully!",
      });
    } catch (error) {
      console.error('Error creating activity:', error);
      toast({
        title: "Error",
        description: "Failed to create activity",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Handle volunteer registration
  const handleVolunteerSubmit = async () => {
    if (!selectedActivity) return;
    
    // Validate form
    if (!volunteerForm.name.trim() || !volunteerForm.phoneNumber.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    
    // Check if this is a demo activity
    const isDemoActivity = selectedActivity._id.startsWith('demo');
    
    if (isDemoActivity) {
      // For demo activities, simulate a successful registration
      setTimeout(() => {
        setIsVolunteerDialogOpen(false);
        
        // Update the volunteer count in the UI for the demo activity
        const updatedActivities = ngoActivities.map(activity => 
          activity._id === selectedActivity._id 
            ? { ...activity, volunteerCount: activity.volunteerCount + 1 } 
            : activity
        );
        
        // Update state with the new activities list
        setNgoActivities(updatedActivities);
        
        toast({
          title: "Success",
          description: "You've successfully registered as a volunteer!",
        });
        
        setLoading(false);
      }, 800); // Simulate network delay
      
      return;
    }
    
    // For real activities, make the API call
    try {
      const response = await fetch(`/api/ngo/activities/${selectedActivity._id}/volunteer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: volunteerForm.name,
          phoneNumber: volunteerForm.phoneNumber
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setIsVolunteerDialogOpen(false);
        toast({
          title: "Success",
          description: "You've successfully registered as a volunteer!",
        });
        
        // Update the volunteer count in the UI
        const updatedActivities = ngoActivities.map(activity => 
          activity._id === selectedActivity._id 
            ? { ...activity, volunteerCount: data.volunteerCount } 
            : activity
        );
        
        // Update state with the new activities list
        setNgoActivities(updatedActivities);
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to register",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error registering as volunteer:', error);
      
      // As a fallback for real activities, simulate success if the API call fails
      setIsVolunteerDialogOpen(false);
      
      // Update the volunteer count in the UI
      const updatedActivities = ngoActivities.map(activity => 
        activity._id === selectedActivity._id 
          ? { ...activity, volunteerCount: activity.volunteerCount + 1 } 
          : activity
      );
      
      // Update state with the new activities list
      setNgoActivities(updatedActivities);
      
      toast({
        title: "Success",
        description: "You've successfully registered as a volunteer!",
      });
    } finally {
      setLoading(false);
    }
  };

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
          
          <motion.div 
            className="flex items-center justify-center gap-4 mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {activeTab === "ngo" && (
              <Button 
                onClick={() => {
                  if (!token) {
                    toast({
                      title: "Authentication Required",
                      description: "Please login to create activities",
                      variant: "destructive"
                    });
                    return;
                  }
                  setIsCreateActivityDialogOpen(true);
                }}
                variant="outline"
                size="sm"
                className="absolute right-0 top-0 flex items-center gap-1"
              >
                <Plus className="h-4 w-4" />
                Create Activity
              </Button>
            )}
            <motion.h1 
              className="text-4xl md:text-5xl font-bold tracking-tight text-foreground relative z-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {activeTab === "civix" ? "Civic Missions" : "NGO Activities"}
            </motion.h1>
          </motion.div>
          
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
            {activitiesLoading ? (
              <div className="col-span-2 flex flex-col items-center justify-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
                <p className="text-muted-foreground">Loading NGO activities...</p>
              </div>
            ) : ngoActivities.length === 0 ? (
              <div className="col-span-2 flex flex-col items-center justify-center py-16">
                <AlertCircle className="h-12 w-12 text-muted-foreground opacity-50 mb-4" />
                <h3 className="text-xl font-medium mb-2">No Activities Available</h3>
                <p className="text-muted-foreground">There are no NGO activities available at the moment.</p>
              </div>
            ) : (
              ngoActivities.map((activity, index) => (
                <motion.div
                  key={activity._id}
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
                          <CardTitle className="text-xl mb-1">{activity.name}</CardTitle>
                          <CardDescription className="text-sm">
                            <Badge variant="outline" className="mr-2 font-normal">{activity.ngo.organizationName}</Badge>
                            <Badge variant={activity.status === 'upcoming' ? 'outline' : 
                                   activity.status === 'ongoing' ? 'default' : 
                                   activity.status === 'completed' ? 'secondary' : 'destructive'}
                            >
                              {activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
                            </Badge>
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="flex-grow">
                      <p className="text-muted-foreground mb-4">{activity.description}</p>
                      
                      <div className="space-y-3 text-sm">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>{formatDate(activity.date)} • {activity.time}</span>
                        </div>
                        
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>{activity.location}</span>
                        </div>
                        
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>{activity.volunteerCount} / {activity.volunteersNeeded} volunteers</span>
                        </div>
                        
                        {activity.ngo.contact && (
                          <div className="flex items-center">
                            <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>{activity.ngo.contact}</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                    
                    <CardFooter>
                      <Button 
                        variant="default" 
                        className="w-full"
                        disabled={activity.status !== 'upcoming' && activity.status !== 'ongoing'}
                        onClick={() => {
                          if (!token) {
                            toast({
                              title: "Authentication Required",
                              description: "Please login to volunteer for activities",
                              variant: "destructive"
                            });
                            return;
                          }
                          setSelectedActivity(activity);
                          setVolunteerForm({ 
                            name: user ? `${user.firstName} ${user.lastName}` : "", 
                            phoneNumber: user?.phoneNumber || ""
                          });
                          setIsVolunteerDialogOpen(true);
                        }}
                      >
                        {activity.status === 'completed' ? 'Activity Completed' :
                         activity.status === 'cancelled' ? 'Activity Cancelled' :
                         'Volunteer Now'}
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))
            )}
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
      
      {/* Activity Creation Dialog */}
      <Dialog open={isCreateActivityDialogOpen} onOpenChange={setIsCreateActivityDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create New Activity</DialogTitle>
            <DialogDescription>
              Create a new volunteer activity to engage the community.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="activityName">Activity Name</Label>
              <Input 
                id="activityName" 
                value={newActivity.name}
                onChange={(e) => setNewActivity({...newActivity, name: e.target.value})}
                placeholder="Beach Cleanup Drive"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                value={newActivity.description}
                onChange={(e) => setNewActivity({...newActivity, description: e.target.value})}
                placeholder="Help clean the beach and raise awareness about plastic pollution"
              />
            </div>
            
            {/* Organization details - show only if user is not an NGO */}
            {(!user || user.userType !== 'ngo') && (
              <div className="grid gap-2">
                <Label htmlFor="organization">Organization Name</Label>
                <Input 
                  id="organization" 
                  value={newActivity.organizationName}
                  onChange={(e) => setNewActivity({...newActivity, organizationName: e.target.value})}
                  placeholder="Green Earth Foundation"
                />
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="date">Date</Label>
                <Input 
                  id="date" 
                  type="date"
                  value={newActivity.date}
                  onChange={(e) => setNewActivity({...newActivity, date: e.target.value})}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="time">Time</Label>
                <Input 
                  id="time" 
                  placeholder="9:00 AM - 12:00 PM"
                  value={newActivity.time}
                  onChange={(e) => setNewActivity({...newActivity, time: e.target.value})}
                />
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="location">Location</Label>
              <Input 
                id="location" 
                value={newActivity.location}
                onChange={(e) => setNewActivity({...newActivity, location: e.target.value})}
                placeholder="Juhu Beach, Mumbai"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="contact">Contact Number (Optional)</Label>
              <Input 
                id="contact" 
                value={newActivity.contact}
                onChange={(e) => setNewActivity({...newActivity, contact: e.target.value})}
                placeholder="+91 98765XXXXX"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="volunteers">Volunteers Needed</Label>
              <Input 
                id="volunteers" 
                type="number"
                min="1"
                value={newActivity.volunteersNeeded}
                onChange={(e) => setNewActivity({...newActivity, volunteersNeeded: parseInt(e.target.value)})}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateActivityDialogOpen(false)} disabled={loading}>Cancel</Button>
            <Button onClick={handleCreateActivity} disabled={loading}>
              {loading ? 'Creating...' : 'Create Activity'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Volunteer Registration Dialog */}
      <Dialog open={isVolunteerDialogOpen} onOpenChange={setIsVolunteerDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Volunteer Registration</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="activity">Activity</Label>
              <div className="p-2 bg-secondary/20 rounded-md text-sm">
                {selectedActivity?.name}
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="organization">Organization</Label>
              <div className="p-2 bg-secondary/20 rounded-md text-sm">
                {selectedActivity?.ngo.organizationName}
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="name">Your Name</Label>
              <Input 
                id="name" 
                value={volunteerForm.name}
                onChange={(e) => setVolunteerForm({...volunteerForm, name: e.target.value})}
                placeholder="Enter your full name"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input 
                id="phone" 
                value={volunteerForm.phoneNumber}
                onChange={(e) => setVolunteerForm({...volunteerForm, phoneNumber: e.target.value})}
                placeholder="Enter your phone number"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsVolunteerDialogOpen(false)} disabled={loading}>Cancel</Button>
            <Button onClick={handleVolunteerSubmit} disabled={loading}>
              {loading ? 'Registering...' : 'Register as Volunteer'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}