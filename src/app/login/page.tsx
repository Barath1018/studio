'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AuthLayout } from '@/components/auth-layout';
import { useState } from 'react';
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { app } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleLogin = async () => {
    setIsLoading(true);
    const auth = getAuth(app);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push(`/dashboard`);
    } catch (error: any) {
      toast({
        title: 'Login Failed',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleGoogleLogin = async () => {
    setIsLoading(true);
    const auth = getAuth(app);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      router.push('/dashboard');
    } catch (error: any) {
      toast({
        title: 'Google Login Failed',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <CardHeader className="text-center space-y-3">
        <div className="mx-auto h-16 w-16 rounded-full flex items-center justify-center shadow-sm bg-white ring-4 ring-offset-2 ring-offset-white ring-blue-200">
          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 via-indigo-500 to-fuchsia-500 flex items-center justify-center">
            <span className="text-white font-semibold">IE</span>
          </div>
        </div>
        <CardTitle className="text-2xl tracking-tight">Welcome to InsightEdge</CardTitle>
        <CardDescription className="text-muted-foreground">Sign in to continue</CardDescription>
        <div className="mt-2 p-3 bg-blue-50/80 border border-blue-200 text-blue-800 rounded-md">
          <p className="text-sm text-blue-800 font-medium">
            <span className="font-bold">Storage:</span> Google login → <span className="font-bold">Firebase</span> | Email login → Local only
          </p>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          <Button variant="outline" type="button" className="w-full h-11 rounded-lg bg-white border border-gray-200 text-gray-800 hover:bg-gray-50 hover:shadow-sm" onClick={handleGoogleLogin} disabled={isLoading}>
            <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
              <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
            </svg>
            Continue with Google
          </Button>

          <div className="relative my-1">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground tracking-wider">OR</span>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="email" className="text-gray-700">Email</Label>
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
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password" className="text-gray-700">Password</Label>
              <Link
                href="/forgot-password"
                className="ml-auto inline-block text-sm underline"
              >
                Forgot your password?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-11 rounded-lg border-gray-200 focus-visible:ring-2 focus-visible:ring-blue-500"
            />
          </div>
          <Button type="submit" className="w-full h-11 rounded-lg bg-[#0F172A] hover:bg-[#0b1226] text-white" onClick={handleLogin} disabled={isLoading}>
            {isLoading ? 'Signing in…' : 'Sign in'}
          </Button>
        </div>
        <div className="mt-4 text-center text-sm">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="underline">
            Sign up
          </Link>
        </div>
      </CardContent>
    </AuthLayout>
  );
}
