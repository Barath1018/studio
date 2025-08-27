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
  CreditCard,
  DollarSign,
  Tag,
  Lightbulb,
  CheckCircle,
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
  SidebarGroup,
  SidebarGroupLabel,
} from '@/components/ui/sidebar';
import { Logo } from '@/components/logo';
import { Input } from '@/components/ui/input';
import { UserNav } from './user-nav';
import { KpiCard } from './kpi-card';
import { MonthlySalesPerformanceChart } from './monthly-sales-performance-chart';
import { ProfitTrendAnalysisChart } from './profit-trend-analysis-chart';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

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
                <FileText />
                Reports
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton href="#">
                <TrendingUp />
                Analytics
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton href="#">
                <Bell />
                Notifications
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton href="#">
                <Settings />
                Settings
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton href="#">
                <HelpCircle />
                Help
              </SidebarMenuButton>
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
              Monitor your profit margins regularly to maintain healthy business growth.
            </CardContent>
          </Card>
          <UserNav />
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <div className="flex min-h-screen w-full flex-col">
          <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/95 px-4 backdrop-blur sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
            <SidebarTrigger className="sm:hidden" />
            <div className="flex-1">
              <h1 className="text-2xl font-semibold">Dashboard</h1>
              <p className="text-sm text-muted-foreground">
                Overview of your business performance
              </p>
            </div>
            <div className="relative flex-1 md:grow-0">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search..."
                className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
              />
            </div>
            <Bell className="h-5 w-5 text-muted-foreground cursor-pointer" />
            <div className="hidden md:block">
              <UserNav />
            </div>
          </header>
          <main className="flex flex-1 flex-col gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
            <Alert className="bg-green-50 border-green-200 text-green-800 [&>svg]:text-green-600">
              <CheckCircle className="h-4 w-4" />
              <AlertTitle className="font-semibold">Strong Revenue Growth</AlertTitle>
              <AlertDescription className="text-sm">
                Revenue increased by 12.6% this month. Great job!
              </AlertDescription>
            </Alert>
            <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
              <KpiCard
                title="Total Revenue"
                value="$619,983"
                change="+$12,649 vs last month"
                icon={<DollarSign className="h-6 w-6 text-muted-foreground" />}
              />
              <KpiCard
                title="Total Expenses"
                value="$442,698"
                change="+$1,312 vs last month"
                icon={<CreditCard className="h-6 w-6 text-muted-foreground" />}
              />
              <KpiCard
                title="Net Profit"
                value="$177,285"
                change="+$6,325 vs last month"
                icon={<TrendingUp className="h-6 w-6 text-muted-foreground" />}
              />
              <KpiCard
                title="Avg. Order Value"
                value="+87.5%"
                change="+2.4% vs last month"
                icon={<Tag className="h-6 w-6 text-muted-foreground" />}
              />
            </div>
            <div className="grid gap-4 md:gap-8 lg:grid-cols-2">
              <Card className="rounded-2xl shadow-sm">
                <CardHeader>
                  <CardTitle>Monthly Sales Performance</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                  <MonthlySalesPerformanceChart />
                </CardContent>
              </Card>
              <Card className="rounded-2xl shadow-sm">
                <CardHeader>
                  <CardTitle>Profit Trend Analysis</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                  <ProfitTrendAnalysisChart />
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
