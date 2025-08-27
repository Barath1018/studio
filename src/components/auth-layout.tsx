import type { ReactNode } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Logo } from '@/components/logo';

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="mb-6 flex justify-center">
          <Link href="/">
            <Logo />
          </Link>
        </div>
        <Card className="w-full">{children}</Card>
      </div>
    </div>
  );
}
