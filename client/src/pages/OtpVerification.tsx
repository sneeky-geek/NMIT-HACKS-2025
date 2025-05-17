import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const OtpVerification = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { login } = useAuth();
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Get phone number and user type from query params
  const searchParams = new URLSearchParams(location.search);
  const phoneNumber = searchParams.get('phone') || '';
  const userType = searchParams.get('userType') || 'user';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber) {
      setError('Phone number not found');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber,
          code: otp,
          userType
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Verification failed');
      }

      // Use auth context to login and store token
      login(data.token);
      
      // Navigate to appropriate dashboard based on user type
      if (data.user.userType === 'ngo') {
        navigate('/ngo-dashboard');
      } else {
        navigate('/dashboard');
      }
      
      toast({
        title: 'Success',
        description: 'Account verified successfully',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Verification failed');
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl font-bold text-center">Verify Phone Number</CardTitle>
          <CardDescription className="text-center">
            We've sent an OTP to {phoneNumber}
          </CardDescription>
          <div className="mt-2 text-center">
            <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary">
              {userType === 'ngo' ? 'NGO Account' : 'Volunteer Account'}
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="otp" className="text-sm font-medium">
                Enter OTP
              </label>
              <Input
                id="otp"
                type="text"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
              {error && (
                <p className="mt-2 text-sm text-destructive">{error}</p>
              )}
            </div>
            <Button 
              type="submit" 
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Verifying...' : 'Verify & Continue'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default OtpVerification;
