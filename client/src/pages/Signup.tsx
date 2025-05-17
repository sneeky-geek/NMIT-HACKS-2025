import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle2, Building2 } from 'lucide-react';

const Signup = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Track user type selection
  const [userType, setUserType] = useState('user'); // 'user' for volunteer, 'ngo' for NGO
  
  const [formData, setFormData] = useState({
    // Common fields
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
    dateOfBirth: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    // NGO-specific fields
    organizationName: '',
    registrationNumber: '',
    website: '',
    description: '',
    causeAreas: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Handle input changes including textareas
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle user type change
  const handleUserTypeChange = (value: string) => {
    setUserType(value);
    console.log('User type changed to:', value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.phoneNumber || !formData.email) {
      setError('Phone number and email are required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Choose the appropriate API endpoint based on user type
      const endpoint = userType === 'ngo' 
        ? 'http://localhost:3000/api/auth/register-ngo'
        : 'http://localhost:3000/api/auth/register';
      
      console.log(`Registering as ${userType} using endpoint:`, endpoint);
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(
          userType === 'ngo' 
            ? {
                // Include NGO-specific fields
                firstName: formData.firstName,
                lastName: formData.lastName,
                phoneNumber: formData.phoneNumber,
                email: formData.email,
                dateOfBirth: formData.dateOfBirth,
                address: formData.address,
                city: formData.city,
                state: formData.state,
                pincode: formData.pincode,
                // NGO specific details
                organizationName: formData.organizationName,
                registrationNumber: formData.registrationNumber,
                website: formData.website,
                description: formData.description,
                causeAreas: formData.causeAreas ? formData.causeAreas.split(',').map(area => area.trim()) : []
              }
            : {
                // Standard user fields
                firstName: formData.firstName,
                lastName: formData.lastName,
                phoneNumber: formData.phoneNumber,
                email: formData.email,
                dateOfBirth: formData.dateOfBirth,
                address: formData.address,
                city: formData.city,
                state: formData.state,
                pincode: formData.pincode
              }
        ),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      // Navigate to OTP verification with phone number and user type
      navigate(`/verify?phone=${encodeURIComponent(formData.phoneNumber)}&userType=${userType}`);
      
      toast({
        title: 'Success',
        description: 'Registration successful. Please verify your phone number.',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
      toast({
        title: 'Error',
        description: error,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
      <Card className="w-full max-w-md p-8">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Sign Up</CardTitle>
          <CardDescription className="text-center">
            Create your account to get started
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* User Type Selection Tabs */}
          <Tabs defaultValue="user" className="mb-6" onValueChange={handleUserTypeChange}>
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
                  Register as a volunteer to participate in community activities, earn civic points, and track your impact.
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="ngo" className="mt-0">
              <div className="rounded-lg bg-muted/50 p-4 mb-4">
                <h3 className="font-medium mb-2">NGO Account</h3>
                <p className="text-sm text-muted-foreground">
                  Register as an NGO to create activities, manage volunteers, and connect with the community.
                </p>
              </div>
            </TabsContent>
          </Tabs>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                  First Name
                </label>
                <Input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                  Last Name
                </label>
                <Input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <Input
                id="phone"
                name="phoneNumber"
                type="tel"
                required
                value={formData.phoneNumber}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>



            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700">
                  Date of Birth
                </label>
                <Input
                  id="dateOfBirth"
                  name="dateOfBirth"
                  type="date"
                  required
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                Address (Optional)
              </label>
              <Input
                id="address"
                name="address"
                type="text"
                value={formData.address}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                  City (Optional)
                </label>
                <Input
                  id="city"
                  name="city"
                  type="text"
                  value={formData.city}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                  State (Optional)
                </label>
                <Input
                  id="state"
                  name="state"
                  type="text"
                  value={formData.state}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label htmlFor="pincode" className="block text-sm font-medium text-gray-700">
                Pincode (Optional)
              </label>
              <Input
                id="pincode"
                name="pincode"
                type="text"
                value={formData.pincode}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            {error && (
              <p className="text-red-600 text-sm">{error}</p>
            )}

            {/* NGO-specific fields that only show when NGO is selected */}
            {userType === 'ngo' && (
              <div className="space-y-6 mt-6 pt-6 border-t border-gray-200">
                <h3 className="font-medium">NGO Details</h3>
                
                <div>
                  <label htmlFor="organizationName" className="block text-sm font-medium text-gray-700">
                    Organization Name*
                  </label>
                  <Input
                    id="organizationName"
                    name="organizationName"
                    type="text"
                    required
                    value={formData.organizationName}
                    onChange={handleChange}
                    className="mt-1 block w-full"
                  />
                </div>
                
                <div>
                  <label htmlFor="registrationNumber" className="block text-sm font-medium text-gray-700">
                    Registration Number
                  </label>
                  <Input
                    id="registrationNumber"
                    name="registrationNumber"
                    type="text"
                    value={formData.registrationNumber}
                    onChange={handleChange}
                    className="mt-1 block w-full"
                  />
                </div>
                
                <div>
                  <label htmlFor="website" className="block text-sm font-medium text-gray-700">
                    Website
                  </label>
                  <Input
                    id="website"
                    name="website"
                    type="url"
                    value={formData.website}
                    onChange={handleChange}
                    className="mt-1 block w-full"
                    placeholder="https://example.org"
                  />
                </div>
                
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description*
                  </label>
                  <Textarea
                    id="description"
                    name="description"
                    required
                    value={formData.description}
                    onChange={handleChange}
                    className="mt-1 block w-full"
                    placeholder="Tell us about your organization and its mission"
                  />
                </div>
                
                <div>
                  <label htmlFor="causeAreas" className="block text-sm font-medium text-gray-700">
                    Cause Areas
                  </label>
                  <Textarea
                    id="causeAreas"
                    name="causeAreas"
                    value={formData.causeAreas}
                    onChange={handleChange}
                    className="mt-1 block w-full"
                    placeholder="Environment, Education, Health (comma separated)"
                  />
                </div>
              </div>
            )}
            
            <Button 
              type="submit" 
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-md py-2 px-4"
              disabled={loading}
            >
              {loading ? 'Registering...' : `Register as ${userType === 'ngo' ? 'NGO' : 'Volunteer'}`}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Signup;
