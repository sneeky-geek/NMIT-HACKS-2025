import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { API_CONFIG, getApiUrl } from '@/config';

function toE164(phone, defaultCountry = '+91') {
  if (phone.startsWith('+')) return phone;
  return defaultCountry + phone.replace(/\D/g, '');
}

const Verify = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const phone = searchParams.get('phone') || '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const formattedPhone = toE164(phone);
      const res = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.AUTH.VERIFY_OTP), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber: formattedPhone, code: otp })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'OTP verification failed');
      // Save user info & token
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('token', data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
      <Card className="w-full max-w-md p-8">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Verify OTP</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700">Enter OTP sent to {phone}</label>
              <Input id="otp" type="text" value={otp} onChange={e => setOtp(e.target.value)} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
            </div>
            <Button type="submit" className="w-full bg-indigo-600 text-white" disabled={loading}>
              {loading ? 'Verifying...' : 'Verify'}
            </Button>
            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Verify;
