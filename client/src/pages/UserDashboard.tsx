import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navbar } from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Scroll, Recycle, Wallet, Target } from 'lucide-react';

const UserDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const features = [
    {
      title: 'Civic Scroll',
      description: 'Discover civic updates and community news',
      icon: <Scroll className="h-6 w-6 text-primary" />,
      path: '/civic-scroll'
    },
    {
      title: 'Smart Dustbin',
      description: 'Locate and use smart waste management solutions',
      icon: <Recycle className="h-6 w-6 text-green-600" />,
      path: '/smart-dustbin'
    },
    {
      title: 'Civic Wallet',
      description: 'Manage your civic rewards and contributions',
      icon: <Wallet className="h-6 w-6 text-amber-600" />,
      path: '/civic-wallet'
    },
    {
      title: 'Missions',
      description: 'Join civic missions and NGO activities',
      icon: <Target className="h-6 w-6 text-indigo-600" />,
      path: '/missions'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-2">Welcome, {user?.firstName}!</h1>
            <p className="text-muted-foreground">
              Access all CiviX features and start making a difference in your community.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {features.map((feature, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-md transition-all duration-300">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-md bg-primary/10">
                      {feature.icon}
                    </div>
                    <CardTitle>{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-4">{feature.description}</CardDescription>
                  <Button 
                    variant="default" 
                    className="w-full"
                    onClick={() => navigate(feature.path)}
                  >
                    Access {feature.title}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
