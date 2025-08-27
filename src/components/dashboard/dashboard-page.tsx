'use client';

import {
  Bell,
  FileText,
  HelpCircle,
  Home,
  LineChart,
  Search,
  Settings,
  TrendingUp,
  Lightbulb,
} from 'lucide-react';
import type { ReactNode } from 'react';
import Link from 'next/link';

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarInset,
} from '@/components/ui/sidebar';
import { Logo } from '@/components/logo';
import { Input } from '@/components/ui/input';
import { UserNav } from './user-nav';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { usePathname } from 'next/navigation';

export default function DashboardPage({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const isActive = (path: string) => {
    // Exact match for dashboard, startsWith for others
    if (path === '/dashboard') {
      return pathname === path;
    }
    return pathname.startsWith(path);
  };

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <Logo />
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <Link href="/dashboard" passHref>
                <SidebarMenuButton asChild isActive={isActive('/dashboard')}>
                  <Home />
                  Dashboard
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <Link href="/dashboard/reports" passHref>
                <SidebarMenuButton asChild isActive={isActive('/dashboard/reports')}>
                  <FileText />
                  Reports
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <Link href="/dashboard/analytics" passHref>
                <SidebarMenuButton asChild isActive={isActive('/dashboard/analytics')}>
                  <TrendingUp />
                  Analytics
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <Link href="/dashboard/notifications" passHref>
                <SidebarMenuButton asChild isActive={isActive('/dashboard/notifications')}>
                  <Bell />
                  Notifications
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <Link href="/dashboard/settings" passHref>
                <SidebarMenuButton asChild isActive={isActive('/dashboard/settings')}>
                  <Settings />
                  Settings
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <Link href="/dashboard/help" passHref>
                <SidebarMenuButton asChild isActive={isActive('/dashboard/help')}>
                  <HelpCircle />
                  Help
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <Card className="m-2 bg-sidebar-accent border-sidebar-border text-sidebar-foreground">
            <CardHeader className="p-4">
              <Lightbulb className="h-6 w-6 text-yellow-400 mb-2" />
              <CardTitle className="text-sm">Pro Tip</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 text-xs">
              Monitor your profit margins regularly to maintain healthy business
              growth.
            </CardContent>
          </Card>
          <UserNav />
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <div className="flex min-h-screen w-full flex-col">
          <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/95 px-4 backdrop-blur sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
            <SidebarTrigger className="sm:hidden" />
            <div className="relative flex-1 md:grow-0">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search..."
                className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
              />
            </div>
            <div className="ml-auto flex items-center gap-4">
              <Bell className="h-5 w-5 text-muted-foreground cursor-pointer" />
              <div className="hidden md:block">
                <UserNav />
              </div>
            </div>
          </header>
          <main className="flex flex-1 flex-col gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
            {children}
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
