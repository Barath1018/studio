
'use client';

import { Bell, AlertTriangle, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
  TableHead,
} from '@/components/ui/table';
import type { BusinessMetrics } from '@/ai/schemas/business-metrics';
import { useEffect, useState } from 'react';
import { generateBusinessMetrics } from '@/ai/flows/generate-business-metrics';
import { Skeleton } from '@/components/ui/skeleton';

const iconMap = {
  success: <CheckCircle className="h-5 w-5 text-green-500" />,
  warning: <AlertTriangle className="h-5 w-5 text-yellow-500" />,
  info: <Bell className="h-5 w-5 text-blue-500" />,
};

export default function NotificationsPage() {
  const [notifications, setNotifications] =
    useState<BusinessMetrics['notifications'] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getNotifications() {
      try {
        const data = await generateBusinessMetrics();
        setNotifications(data.notifications);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    getNotifications();
  }, []);

  return (
    <>
      <div className="flex-1">
        <h1 className="text-2xl font-semibold">Notifications</h1>
        <p className="text-sm text-muted-foreground">
          Stay updated with important events and alerts.
        </p>
      </div>
      <main className="flex flex-1 flex-col gap-4 pt-4 sm:px-6 sm:py-0 md:gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Recent Notifications</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[64px]"></TableHead>
                    <TableHead>Details</TableHead>
                    <TableHead className="text-right">Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {notifications?.map((notification, index) => (
                    <TableRow key={index}>
                      <TableCell>{iconMap[notification.type]}</TableCell>
                      <TableCell>
                        <div className="font-medium">{notification.title}</div>
                        <div className="text-sm text-muted-foreground">
                          {notification.description}
                        </div>
                      </TableCell>
                      <TableCell className="text-right text-sm text-muted-foreground">
                        {notification.time}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </main>
    </>
  );
}
