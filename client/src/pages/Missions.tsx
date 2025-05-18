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
import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useAuth } from '@/contexts/AuthContext';
import { API_CONFIG, getApiUrl } from '@/config';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

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
  userHasVolunteered?: boolean; // To track whether current user has volunteered
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
  
  // Fetch NGO activities when component mounts or when user data changes
  useEffect(() => {
    if (activeTab === "ngo") {
      fetchNgoActivities();
    }
  }, [activeTab, user]); // Add user dependency to re-fetch when user data changes
  
  // Log user type for debugging
  useEffect(() => {
    if (user) {
      console.log('Current user type:', user.userType);
    }
  }, [user]);

  // Fetch activities from the API
  const fetchNgoActivities = async () => {
    setActivitiesLoading(true);
    try {
      // Use authorization header if user is logged in
      const headers: HeadersInit = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(getApiUrl('/api/ngo/activities'), { headers });
      const data = await response.json();
      
      if (response.ok) {
        // Ensure data.activities is an array before processing
        const activities = data.activities || [];
        if (Array.isArray(activities)) {
          // If user is logged in, check which activities they've already volunteered for
          if (user && user.volunteeredEvents && user.volunteeredEvents.length > 0) {
            // Mark activities user has already volunteered for
            activities.forEach(activity => {
              activity.userHasVolunteered = user.volunteeredEvents.includes(activity._id);
            });
          }
          setNgoActivities(activities);
        } else {
          console.error('API response activities is not an array:', data);
          setNgoActivities(demoNgoActivities);
          toast({
            title: "Invalid Data Format",
            description: "Received invalid data format from server. Using demo activities instead.",
            variant: "destructive"
          });
        }
      } else {
        // Fallback to demo data on error
        setNgoActivities(demoNgoActivities);
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
    // Check if user is NGO
    if (user?.userType !== 'ngo') {
      toast({
        title: "Access Denied",
        description: "Only NGOs can create activities",
        variant: "destructive"
      });
      return;
    }

    // Validate form
    if (!newActivity.name.trim() || !newActivity.description.trim() || 
        !newActivity.date || !newActivity.time.trim() || 
        !newActivity.location.trim()) {
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
      // Use the user's organization name from their NGO profile
      const organizationName = user.ngoDetails?.organizationName || '';
      
      // Make API call to create activity in the database
      const response = await fetch(getApiUrl('/api/ngo/activities'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: newActivity.name,
          description: newActivity.description,
          date: newActivity.date,
          time: newActivity.time,
          location: newActivity.location,
          volunteersNeeded: newActivity.volunteersNeeded,
          contact: newActivity.contact
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Add the created activity to the activities list
        if (data.activity) {
          // Convert the returned activity to match our UI format
          const createdActivity: NGOActivity = {
            ...data.activity,
            volunteerCount: 0,
            ngo: {
              _id: user?.id || data.activity.ngoId || 'unknown',
              organizationName: organizationName,
              contact: newActivity.contact || undefined
            }
          };
          
          // Add to activities list
          setNgoActivities([createdActivity, ...ngoActivities]);
        } else {
          // Refresh the activities list
          fetchNgoActivities();
        }
        
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
      } else {
        // Handle error from API
        toast({
          title: "Error",
          description: data.message || "Failed to create activity",
          variant: "destructive"
        });
      }
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
    if (!selectedActivity) {
      toast({
        title: "Error",
        description: "No activity selected. Please try again.",
        variant: "destructive"
      });
      return;
    }
    
    // Additional validations
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please login to volunteer for activities",
        variant: "destructive"
      });
      setIsVolunteerDialogOpen(false);
      return;
    }
    
    // Verify user is not an NGO
    if (user.userType === 'ngo') {
      toast({
        title: "Not Available",
        description: "NGO users cannot register as volunteers",
        variant: "destructive"
      });
      setIsVolunteerDialogOpen(false);
      return;
    }
    
    // Create safe check for volunteeredEvents array
    const userVolunteeredEvents = Array.isArray(user.volunteeredEvents) ? user.volunteeredEvents : [];
    
    // Check if user already volunteered
    if (userVolunteeredEvents.includes(selectedActivity._id) || selectedActivity.userHasVolunteered) {
      toast({
        title: "Already Registered",
        description: "You have already volunteered for this activity",
        variant: "destructive"
      });
      setIsVolunteerDialogOpen(false);
      return;
    }
    
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
      try {
        // For demo activities, simulate a successful registration
        setTimeout(() => {
          try {
            // Create a volunteer entry for the current user
            const newVolunteer = {
              userId: user?.id || 'demo-user',
              name: volunteerForm.name,
              phoneNumber: volunteerForm.phoneNumber,
              joinedAt: new Date().toISOString()
            };
            
            // Update the volunteer count and list in the UI for the demo activity
            // Make a deep copy of ngoActivities to avoid mutation issues
            const updatedActivities = ngoActivities.map(activity => 
              activity._id === selectedActivity?._id 
                ? { 
                    ...activity, 
                    volunteerCount: (activity.volunteerCount || 0) + 1,
                    userHasVolunteered: true,
                    volunteers: [...(activity.volunteers || []), newVolunteer]
                  } 
                : activity
            );
            
            // Update state with the new activities list
            setNgoActivities(updatedActivities);
            
            // Update local user object to include this activity
            if (user && selectedActivity) {
              // Create a safe copy of volunteeredEvents array or initialize it
              const currentEvents = Array.isArray(user.volunteeredEvents) ? user.volunteeredEvents : [];
              if (!currentEvents.includes(selectedActivity._id)) {
                // Create a new array to avoid mutation issues
                const updatedEvents = [...currentEvents, selectedActivity._id];
                // Update the user object safely
                user.volunteeredEvents = updatedEvents;
              }
            }
            
            setIsVolunteerDialogOpen(false);
            
            toast({
              title: "Success",
              description: "You've successfully registered as a volunteer!",
            });
          } catch (error) {
            console.error('Error in demo registration process:', error);
            toast({
              title: "Error",
              description: "Failed to complete registration. Please try again.",
              variant: "destructive"
            });
          } finally {
            setLoading(false);
          }
        }, 800); // Simulate network delay
      } catch (error) {
        console.error('Error in demo mode:', error);
        setLoading(false);
        toast({
          title: "Error",
          description: "Something went wrong. Please try again.",
          variant: "destructive"
        });
      }
      return;
    }
    
    // For real activities, make the API call
    try {
      if (!selectedActivity || !selectedActivity._id) {
        throw new Error('Invalid activity selected');
      }

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
        // Create a volunteer entry for the current user
        const newVolunteer = {
          userId: user?.id || 'user-id',
          name: volunteerForm.name,
          phoneNumber: volunteerForm.phoneNumber,
          joinedAt: new Date().toISOString()
        };
        
        // Update the volunteer count and list in the UI - create deep copies to avoid state mutation issues
        const updatedActivities = ngoActivities.map(activity => {
          if (activity._id === selectedActivity._id) {
            return { 
              ...activity, 
              volunteerCount: data.volunteerCount || (activity.volunteerCount + 1),
              userHasVolunteered: true,
              volunteers: [...(activity.volunteers || []), newVolunteer]
            };
          }
          return activity;
        });
        
        // Update state with the new activities list
        setNgoActivities(updatedActivities);
        
        // Safely update local user object to include this activity
        if (user) {
          // Make sure volunteeredEvents exists and is an array before updating
          const currentEvents = Array.isArray(user.volunteeredEvents) ? user.volunteeredEvents : [];
          if (!currentEvents.includes(selectedActivity._id)) {
            // Create a new array instead of mutating the existing one
            const updatedEvents = [...currentEvents, selectedActivity._id];
            user.volunteeredEvents = updatedEvents;
            
            // Optionally update tokens if the API returns that info
            if (data.totalTokens) {
              user.tokens = data.totalTokens;
            }
          }
        }
        
        // Close the dialog and show success message
        setIsVolunteerDialogOpen(false);
        toast({
          title: "Success",
          description: "You've successfully registered as a volunteer!",
        });
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to register as a volunteer",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error registering as volunteer:', error);
      toast({
        title: "Error",
        description: "Failed to register as volunteer. Please try again.",
        variant: "destructive"
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
            {/* Only show create button if user is logged in */}
            {activeTab === "ngo" && token && (
              <Button 
                onClick={() => {
                  // Check if user is NGO before allowing activity creation
                  if (user?.userType === 'ngo') {
                    setIsCreateActivityDialogOpen(true);
                  } else {
                    toast({
                      title: "Access Denied",
                      description: "Only NGO users can create activities",
                      variant: "destructive"
                    });
                  }
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
              (Array.isArray(ngoActivities) ? ngoActivities : []).map((activity, index) => (
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
                          <div className="text-sm flex items-center gap-2 mt-1 mb-1">
                            {activity.ngo && activity.ngo.organizationName ? (
                              <Badge variant="outline" className="font-normal">{activity.ngo.organizationName}</Badge>
                            ) : (
                              <Badge variant="outline" className="font-normal">NGO</Badge>
                            )}
                            <Badge variant={activity.status === 'upcoming' ? 'outline' : 
                                   activity.status === 'ongoing' ? 'default' : 
                                   activity.status === 'completed' ? 'secondary' : 'destructive'}
                            >
                              {activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
                            </Badge>
                          </div>
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
                        
                        {activity.ngo && activity.ngo.contact && (
                          <div className="flex items-center">
                            <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>{activity.ngo.contact}</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                    
                    <CardFooter>
                      <Button 
                        variant={activity.userHasVolunteered || (user?.volunteeredEvents && Array.isArray(user.volunteeredEvents) && user.volunteeredEvents.includes(activity._id)) ? "outline" : "default"}
                        className="w-full"
                        disabled={
                          // Disable if activity is not upcoming or ongoing
                          (activity.status !== 'upcoming' && activity.status !== 'ongoing') ||
                          // Disable if user is an NGO
                          user?.userType === 'ngo' ||
                          // Disable if max volunteers reached
                          activity.volunteerCount >= activity.volunteersNeeded ||
                          // Disable if user already volunteered for this activity
                          activity.userHasVolunteered || (user?.volunteeredEvents && Array.isArray(user.volunteeredEvents) && user.volunteeredEvents.includes(activity._id))
                        }
                        onClick={() => {
                          if (!token) {
                            toast({
                              title: "Authentication Required",
                              description: "Please login to volunteer for activities",
                              variant: "destructive"
                            });
                            return;
                          }

                          // Show appropriate feedback based on condition
                          if (user?.userType === 'ngo') {
                            toast({
                              title: "Not Available",
                              description: "NGO users cannot register as volunteers",
                              variant: "destructive"
                            });
                            return;
                          }
                          
                          if (activity.volunteerCount >= activity.volunteersNeeded) {
                            toast({
                              title: "Maximum Volunteers Reached",
                              description: "This activity has reached its volunteer capacity",
                              variant: "destructive"
                            });
                            return;
                          }
                          
                          if (activity.userHasVolunteered || (user?.volunteeredEvents && Array.isArray(user.volunteeredEvents) && user.volunteeredEvents.includes(activity._id))) {
                            toast({
                              title: "Already Registered",
                              description: "You have already volunteered for this activity",
                              variant: "destructive"
                            });
                            return;
                          }
                          
                          // Set the activity before opening the dialog
                          try {
                            // First set the selected activity
                            setSelectedActivity(activity);
                            
                            // Then safely set volunteer form with user data if available
                            const fullName = user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : "";
                            setVolunteerForm({
                              name: fullName,
                              phoneNumber: user?.phoneNumber || ""
                            });
                            
                            // Finally open the dialog
                            setTimeout(() => {
                              setIsVolunteerDialogOpen(true);
                            }, 100); // Small delay to ensure state updates properly
                          } catch (error) {
                            console.error('Error preparing volunteer form:', error);
                            toast({
                              title: "Error",
                              description: "Something went wrong. Please try again.",
                              variant: "destructive"
                            });
                          }
                        }}
                      >
                        {activity.status === 'completed' ? 'Activity Completed' :
                         activity.status === 'cancelled' ? 'Activity Cancelled' :
                         activity.userHasVolunteered || (user?.volunteeredEvents && Array.isArray(user.volunteeredEvents) && user.volunteeredEvents.includes(activity._id)) ? 'Already Volunteered' :
                         activity.volunteerCount >= activity.volunteersNeeded ? 'Fully Booked' :
                         user?.userType === 'ngo' ? 'NGOs Cannot Volunteer' :
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
          
          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setIsCreateActivityDialogOpen(false)} disabled={loading}>Cancel</Button>
            <Button onClick={handleCreateActivity} disabled={loading}>
              {loading ? (
                <>
                  <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent"></span>
                  Creating...
                </>
              ) : (
                'Create Activity'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Volunteer Registration Dialog */}
      <Dialog open={isVolunteerDialogOpen} onOpenChange={(open) => {
        // Only allow closing if not currently loading
        if (!loading || !open) {
          setIsVolunteerDialogOpen(open);
        }
      }}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Volunteer Registration</DialogTitle>
            <DialogDescription>
              Join {selectedActivity?.ngo?.organizationName || 'this organization'} as a volunteer for this activity.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="activity">Activity</Label>
              <div className="p-2 bg-secondary/20 rounded-md text-sm">
                {selectedActivity?.name || 'Loading...'}
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="organization">Organization</Label>
              <div className="p-2 bg-secondary/20 rounded-md text-sm">
                {selectedActivity?.ngo?.organizationName || 'Loading...'}
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="name">Your Name <span className="text-destructive">*</span></Label>
              <Input 
                id="name" 
                value={volunteerForm.name}
                onChange={(e) => setVolunteerForm({...volunteerForm, name: e.target.value})}
                placeholder="Enter your full name"
                autoComplete="name"
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="phone">Phone Number <span className="text-destructive">*</span></Label>
              <Input 
                id="phone" 
                value={volunteerForm.phoneNumber}
                onChange={(e) => setVolunteerForm({...volunteerForm, phoneNumber: e.target.value})}
                placeholder="Enter your phone number"
                autoComplete="tel"
                required
              />
              <p className="text-xs text-muted-foreground">This will be shared with the organization for coordination</p>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsVolunteerDialogOpen(false)} disabled={loading}>
              Cancel
            </Button>
            <Button onClick={handleVolunteerSubmit} disabled={loading || !volunteerForm.name || !volunteerForm.phoneNumber}>
              {loading ? (
                <>
                  <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent"></span>
                  Registering...
                </>
              ) : (
                'Register as Volunteer'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}