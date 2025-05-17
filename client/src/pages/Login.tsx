import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle2, Building2 } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [userType, setUserType] = useState('user'); // 'user' for volunteer, 'ngo' for NGO

  const [isRegistering, setIsRegistering] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber) {
      setError('Please enter your phone number');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Use the correct API endpoint with full URL
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber,
          userType
        }),
      });

      // Check if response is ok before trying to parse JSON
      if (!response.ok) {
        // Try to parse error message from response
        try {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Login failed');
        } catch (jsonError) {
          // If JSON parsing fails, use status text
          throw new Error(`Login failed: ${response.status} ${response.statusText}`);
        }
      }

      // Parse response data
      const data = await response.json();
      
      // Navigate to OTP verification with phone number and user type
      navigate(`/verify?phone=${encodeURIComponent(phoneNumber)}&userType=${userType}`);
      
      toast({
        title: 'Success',
        description: 'OTP sent to your phone. Please verify.',
      });
    } catch (err) {
      console.error('Login error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl font-bold text-center">Login to CiviX</CardTitle>
          <CardDescription className="text-center">
            Select your role and enter your phone number
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="user" className="mb-6" onValueChange={(value) => setUserType(value)}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="user" className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                <span>Volunteer</span>
              </TabsTrigger>
              <TabsTrigger value="ngo" className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                <span>NGO</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="user" className="mt-0">
              <div className="rounded-lg bg-muted/50 p-4 mb-4">
                <h3 className="font-medium mb-2">Volunteer Account</h3>
                <p className="text-sm text-muted-foreground">
                  Login as a volunteer to participate in community activities, earn civic points, and track your impact.
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="ngo" className="mt-0">
              <div className="rounded-lg bg-muted/50 p-4 mb-4">
                <h3 className="font-medium mb-2">NGO Account</h3>
                <p className="text-sm text-muted-foreground">
                  Login as an NGO to create activities, manage volunteers, and connect with the community.
                </p>
              </div>
            </TabsContent>
          </Tabs>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="phone" className="text-sm font-medium">
                Phone Number
              </label>
              <Input
                id="phone"
                type="tel"
                placeholder="Enter your phone number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Sending OTP...' : 'Login with OTP'}
            </Button>
            
            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
          </form>
          
          <div className="text-center mt-6">
            <p className="text-sm text-muted-foreground">
              New to CiviX?{' '}
              <Button variant="link" className="p-0" onClick={() => navigate('/signup')}>
                Create an account
              </Button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
