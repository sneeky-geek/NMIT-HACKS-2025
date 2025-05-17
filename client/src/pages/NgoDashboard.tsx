import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navbar } from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  Users, 
  PlusCircle, 
  ClipboardList, 
  MapPin, 
  Clock 
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface Activity {
  _id: string;
  name: string;
  description: string;
  date: string;
  time: string;
  location: string;
  volunteersNeeded: number;
  volunteers: {
    userId: string;
    name: string;
    phoneNumber: string;
    joinedAt: string;
  }[];
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  volunteerCount: number;
}

const NgoDashboard = () => {
  const { user, token } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newActivity, setNewActivity] = useState({
    name: '',
    description: '',
    date: '',
    time: '',
    location: '',
    volunteersNeeded: 1
  });
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [isViewVolunteersOpen, setIsViewVolunteersOpen] = useState(false);

  // Fetch NGO's activities
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await fetch('/api/ngo/my-activities', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setActivities(data.activities);
        } else {
          toast({
            title: 'Error',
            description: 'Failed to fetch activities',
            variant: 'destructive'
          });
        }
      } catch (error) {
        console.error('Error fetching activities:', error);
        toast({
          title: 'Error',
          description: 'Failed to connect to server',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchActivities();
    }
  }, [token, toast]);

  // Handle creating a new activity
  const handleCreateActivity = async () => {
    try {
      const response = await fetch('/api/ngo/activities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newActivity)
      });

      if (response.ok) {
        const data = await response.json();
        setActivities([...activities, data.activity]);
        setIsCreateDialogOpen(false);
        setNewActivity({
          name: '',
          description: '',
          date: '',
          time: '',
          location: '',
          volunteersNeeded: 1
        });
        toast({
          title: 'Success',
          description: 'Activity created successfully'
        });
      } else {
        const error = await response.json();
        toast({
          title: 'Error',
          description: error.message || 'Failed to create activity',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Error creating activity:', error);
      toast({
        title: 'Error',
        description: 'Failed to connect to server',
        variant: 'destructive'
      });
    }
  };

  // Handle viewing volunteers for an activity
  const handleViewVolunteers = async (activity: Activity) => {
    setSelectedActivity(activity);
    
    try {
      const response = await fetch(`/api/ngo/activities/${activity._id}/volunteers`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        // Update the selected activity with the volunteers data
        setSelectedActivity({
          ...activity,
          volunteers: data.volunteers
        });
        setIsViewVolunteersOpen(true);
      } else {
        toast({
          title: 'Error',
          description: 'Failed to fetch volunteers',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Error fetching volunteers:', error);
      toast({
        title: 'Error',
        description: 'Failed to connect to server',
        variant: 'destructive'
      });
    }
  };

  // Handle updating activity status
  const handleUpdateStatus = async (id: string, status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled') => {
    try {
      const response = await fetch(`/api/ngo/activities/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });

      if (response.ok) {
        const data = await response.json();
        // Update activities list
        setActivities(activities.map(activity => 
          activity._id === id ? data.activity : activity
        ));
        toast({
          title: 'Success',
          description: `Activity status updated to ${status}`
        });
      } else {
        const error = await response.json();
        toast({
          title: 'Error',
          description: error.message || 'Failed to update status',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: 'Error',
        description: 'Failed to connect to server',
        variant: 'destructive'
      });
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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold">NGO Dashboard</h1>
              <p className="text-muted-foreground">
                {user?.ngoDetails?.organizationName || 'Your NGO'} - Manage your activities and volunteers
              </p>
            </div>
            <Button 
              onClick={() => setIsCreateDialogOpen(true)}
              className="flex items-center gap-2"
            >
              <PlusCircle className="h-4 w-4" />
              Create Activity
            </Button>
          </div>
          
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : activities.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <div className="mb-4 flex justify-center">
                  <Calendar className="h-12 w-12 text-muted-foreground opacity-50" />
                </div>
                <h3 className="text-xl font-medium mb-2">No Activities Yet</h3>
                <p className="text-muted-foreground mb-6">
                  Create your first activity to start engaging volunteers in your cause.
                </p>
                <Button 
                  onClick={() => setIsCreateDialogOpen(true)}
                  className="flex items-center gap-2"
                >
                  <PlusCircle className="h-4 w-4" />
                  Create Activity
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {activities.map((activity) => (
                <Card key={activity._id} className="overflow-hidden">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl">{activity.name}</CardTitle>
                        <CardDescription className="mt-1">
                          <Badge variant={
                            activity.status === 'upcoming' ? 'outline' :
                            activity.status === 'ongoing' ? 'default' :
                            activity.status === 'completed' ? 'secondary' : 'destructive'
                          }>
                            {activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
                          </Badge>
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">{activity.description}</p>
                    
                    <div className="space-y-3">
                      <div className="flex items-center text-sm">
                        <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{formatDate(activity.date)}</span>
                      </div>
                      
                      <div className="flex items-center text-sm">
                        <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{activity.time}</span>
                      </div>
                      
                      <div className="flex items-center text-sm">
                        <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{activity.location}</span>
                      </div>
                      
                      <div className="flex items-center text-sm">
                        <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>
                          {activity.volunteerCount} / {activity.volunteersNeeded} volunteers
                        </span>
                      </div>
                    </div>
                  </CardContent>
                  
                  <CardFooter className="flex flex-col gap-2">
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => handleViewVolunteers(activity)}
                    >
                      <ClipboardList className="h-4 w-4 mr-2" />
                      View Volunteers
                    </Button>
                    
                    {activity.status !== 'completed' && activity.status !== 'cancelled' && (
                      <div className="flex gap-2 w-full">
                        {activity.status === 'upcoming' && (
                          <Button 
                            variant="default" 
                            className="flex-1"
                            onClick={() => handleUpdateStatus(activity._id, 'ongoing')}
                          >
                            Start Activity
                          </Button>
                        )}
                        
                        {activity.status === 'ongoing' && (
                          <Button 
                            variant="default" 
                            className="flex-1"
                            onClick={() => handleUpdateStatus(activity._id, 'completed')}
                          >
                            Complete Activity
                          </Button>
                        )}
                        
                        <Button 
                          variant="destructive" 
                          className="flex-1"
                          onClick={() => handleUpdateStatus(activity._id, 'cancelled')}
                        >
                          Cancel
                        </Button>
                      </div>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Create Activity Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create New Activity</DialogTitle>
            <DialogDescription>
              Create a new volunteer activity for your organization.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Activity Name</Label>
              <Input 
                id="name" 
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
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateActivity}>Create Activity</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* View Volunteers Dialog */}
      <Dialog open={isViewVolunteersOpen} onOpenChange={setIsViewVolunteersOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Volunteers for {selectedActivity?.name}</DialogTitle>
            <DialogDescription>
              {selectedActivity?.volunteerCount} / {selectedActivity?.volunteersNeeded} registered volunteers
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            {selectedActivity?.volunteers?.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-muted-foreground opacity-50 mx-auto mb-4" />
                <p className="text-muted-foreground">No volunteers have registered yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {selectedActivity?.volunteers?.map((volunteer, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-medium">{volunteer.name}</h4>
                          <p className="text-sm text-muted-foreground">{volunteer.phoneNumber}</p>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(volunteer.joinedAt).toLocaleDateString()}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button onClick={() => setIsViewVolunteersOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NgoDashboard;
