'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AuthLayout } from '@/components/auth-layout';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { app } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const onSubmit = async () => {
    if (!email) {
      toast({ title: 'Email required', description: 'Please enter your email address.', variant: 'destructive' });
      return;
    }
    setIsLoading(true);
    const auth = getAuth(app);
    try {
      await sendPasswordResetEmail(auth, email);
      toast({ title: 'Reset link sent', description: 'Check your inbox for the password reset email.' });
    } catch (error: any) {
      toast({ title: 'Failed to send reset email', description: error?.message ?? 'Try again later.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <AuthLayout>
      <CardHeader>
        <CardTitle className="text-2xl">Forgot Password</CardTitle>
        <CardDescription>
          Enter your email below and we&apos;ll send you a link to reset your password.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-11 rounded-lg border-gray-200 focus-visible:ring-2 focus-visible:ring-blue-500"
            />
          </div>
          <Button type="button" className="w-full h-11 rounded-lg bg-[#0F172A] hover:bg-[#0b1226] text-white" onClick={onSubmit} disabled={isLoading}>
            {isLoading ? 'Sending…' : 'Send Reset Link'}
          </Button>
        </div>
        <div className="mt-4 text-center text-sm">
          Remember your password?{' '}
          <Link href="/login" className="underline">
            Log in
          </Link>
        </div>
      </CardContent>
    </AuthLayout>
  );
}
