import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, Calendar, MapPin, LoaderCircle, Users, Clock, AlertTriangle } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/Navbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Event {
  _id: string;
  name: string;
  description: string;
  date: string;
  time: string;
  location: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  participationDate: string | null;
  totalVolunteers: number;
  volunteersNeeded: number;
  ngoId: {
    firstName: string;
    lastName: string;
    ngoDetails: {
      organizationName: string;
    }
  }
}

const MyWork = () => {
  const { user, isAuthenticated, token } = useAuth();
  const navigate = useNavigate();
  const [volunteerEvents, setVolunteerEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>('all');

  useEffect(() => {
    // Redirect if not authenticated
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Fetch user's volunteered events
    const fetchEvents = async () => {
      try {
        if (!token) return;

        const response = await fetch('/api/tokens/history', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setVolunteerEvents(data.history || []);
          setFilteredEvents(data.history || []);
        } else {
          console.error('Failed to fetch volunteering history');
        }
      } catch (error) {
        console.error('Error fetching volunteering history:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, [isAuthenticated, navigate, token]);
  
  // Filter events based on active tab
  useEffect(() => {
    if (activeTab === 'all') {
      setFilteredEvents(volunteerEvents);
    } else {
      setFilteredEvents(volunteerEvents.filter(event => event.status === activeTab));
    }
  }, [activeTab, volunteerEvents]);

  // Status badge variant
  const getStatusVariant = (status: string) => {
    switch(status) {
      case 'upcoming': return 'secondary';
      case 'ongoing': return 'default';
      case 'completed': return 'outline';
      case 'cancelled': return 'destructive';
      default: return 'outline';
    }
  };
  
  // Format date helper
  const formatEventDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, 'PPP'); // Localized date like "April 29th, 2022"
    } catch (error) {
      return dateString;
    }
  };
  
  // Format relative date
  const formatRelativeDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      return 'N/A';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto py-8 px-4 md:px-6">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Briefcase className="w-6 h-6 mr-2" />
            <h1 className="text-2xl font-bold">My Volunteering Work</h1>
          </div>
          
          <div className="hidden sm:flex items-center gap-2">
            <Button 
              variant="secondary" 
              className="flex items-center gap-2"
              onClick={() => navigate('/complaints')}
            >
              <AlertTriangle className="w-4 h-4" />
              Report Issues
            </Button>
            
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={() => navigate('/missions')}
            >
              Explore More Activities
            </Button>
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <LoaderCircle className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : volunteerEvents.length === 0 ? (
          <Card className="border-dashed bg-muted/50">
            <CardContent className="pt-6 text-center py-16">
              <div className="flex justify-center mb-4">
                <Briefcase className="w-12 h-12 text-muted-foreground opacity-50" />
              </div>
              <h3 className="text-xl font-medium mb-2">No Volunteering History</h3>
              <p className="text-muted-foreground mb-6">You haven't volunteered for any events yet.</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button 
                  variant="default" 
                  size="lg"
                  onClick={() => navigate('/missions')}
                >
                  Find Volunteering Opportunities
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => navigate('/complaints')}
                >
                  <AlertTriangle className="mr-2 h-4 w-4" />
                  Report Community Issues
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
                <TabsList>
                  <TabsTrigger value="all">All ({volunteerEvents.length})</TabsTrigger>
                  <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                  <TabsTrigger value="ongoing">Ongoing</TabsTrigger>
                  <TabsTrigger value="completed">Completed</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            
            {filteredEvents.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No events found in this category.</p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredEvents.map((event) => (
                  <Card key={event._id} className="overflow-hidden transition-all hover:shadow-md">
                    <CardHeader className="pb-4">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{event.name}</CardTitle>
                        <Badge variant={getStatusVariant(event.status)}>
                          {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                        </Badge>
                      </div>
                      <CardDescription className="line-clamp-2 min-h-[40px]">
                        {event.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pb-4 space-y-3 text-sm">
                      <div className="flex items-center text-muted-foreground">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span>
                          {formatEventDate(event.date)} • {event.time}
                        </span>
                      </div>
                      <div className="flex items-center text-muted-foreground">
                        <MapPin className="w-4 h-4 mr-2" />
                        <span className="truncate">{event.location}</span>
                      </div>
                      <div className="flex items-center text-muted-foreground">
                        <Users className="w-4 h-4 mr-2" />
                        <span>{event.totalVolunteers} / {event.volunteersNeeded} volunteers</span>
                      </div>
                      {event.participationDate && (
                        <div className="flex items-center text-muted-foreground">
                          <Clock className="w-4 h-4 mr-2" />
                          <span>Registered {formatRelativeDate(event.participationDate)}</span>
                        </div>
                      )}
                    </CardContent>
                    <CardFooter className="border-t bg-muted/20 pt-3 text-xs text-muted-foreground">
                      Organized by: {event.ngoId.ngoDetails?.organizationName || `${event.ngoId.firstName} ${event.ngoId.lastName}`}
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyWork;
