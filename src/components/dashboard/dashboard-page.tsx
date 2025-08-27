'use client';

import Link from 'next/link';
import {
  AreaChart,
  BarChart,
  Home,
  PieChart,
  Search,
  Settings,
  Users,
} from 'lucide-react';

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
import { Button } from '@/components/ui/button';
import { UserNav } from './user-nav';
import { KpiCard } from './kpi-card';
import { ChildrenOnboardedChart } from './children-onboarded-chart';
import { RegionalDistributionChart } from './regional-distribution-chart';
import { VerificationStatusChart } from './verification-status-chart';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

export default function DashboardPage() {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <Logo />
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton href="#" isActive>
                <Home />
                Dashboard
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton href="#">
                <Users />
                Children
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton href="#">
                <BarChart />
                Reports
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton href="#">
                <Settings />
                Settings
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <UserNav />
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <div className="flex min-h-screen w-full flex-col">
          <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background/95 px-4 backdrop-blur sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
            <SidebarTrigger className="sm:hidden" />
            <div className="relative ml-auto flex-1 md:grow-0">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search..."
                className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
              />
            </div>
            <Button>Create Report</Button>
            <div className="hidden md:block">
              <UserNav />
            </div>
          </header>
          <main className="flex flex-1 flex-col gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
            <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
              <KpiCard
                title="Children Onboarded"
                value="12,345"
                change="+20.1% from last month"
                icon={<Users className="h-4 w-4 text-muted-foreground" />}
              />
              <KpiCard
                title="Verified Children"
                value="10,890"
                change="+18.1% from last month"
                icon={<Users className="h-4 w-4 text-muted-foreground" />}
              />
              <KpiCard
                title="Pending Verification"
                value="1,455"
                change="-5.2% from last month"
                icon={<Users className="h-4 w-4 text-muted-foreground" />}
              />
              <KpiCard
                title="Total Regions"
                value="27"
                change="+2 since last month"
                icon={<AreaChart className="h-4 w-4 text-muted-foreground" />}
              />
            </div>
            <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
              <Card className="xl:col-span-2 rounded-2xl shadow-sm">
                <CardHeader>
                  <CardTitle>Onboarding Overview</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                  <ChildrenOnboardedChart />
                </CardContent>
              </Card>
              <Card className="rounded-2xl shadow-sm">
                <CardHeader>
                  <CardTitle>Verification Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <VerificationStatusChart />
                </CardContent>
              </Card>
            </div>
            <div className="grid gap-4 md:gap-8 lg:grid-cols-1">
               <Card className="rounded-2xl shadow-sm">
                <CardHeader>
                  <CardTitle>Regional Distribution</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                  <RegionalDistributionChart />
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
