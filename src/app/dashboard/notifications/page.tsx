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

const notifications = [
  {
    icon: <CheckCircle className="h-5 w-5 text-green-500" />,
    title: 'Q1 Report Generated',
    description: 'Your quarterly financial summary for Q1 2024 is ready.',
    time: '2 hours ago',
  },
  {
    icon: <AlertTriangle className="h-5 w-5 text-yellow-500" />,
    title: 'High Server Load',
    description: 'Server CPU usage is at 92%. Consider scaling resources.',
    time: '1 day ago',
  },
  {
    icon: <Bell className="h-5 w-5 text-blue-500" />,
    title: 'New Integration',
    description: 'Salesforce has been successfully integrated.',
    time: '3 days ago',
  },
];

export default function NotificationsPage() {
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
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[64px]"></TableHead>
                  <TableHead>Details</TableHead>
                  <TableHead className="text-right">Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {notifications.map((notification, index) => (
                  <TableRow key={index}>
                    <TableCell>{notification.icon}</TableCell>
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
          </CardContent>
        </Card>
      </main>
    </>
  );
}
