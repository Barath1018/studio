'use client'; 

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Download, FileText } from 'lucide-react';


interface ReportsPageProps {
  reports: {
    name: string;
    date: string;
    type: string;
    status: 'Final' | 'Draft';
  }[];
}

export default function ReportsPage({ reports }: Partial<ReportsPageProps>) {
  if (!reports || reports.length === 0) {
    return (
       <div className="flex flex-col gap-4">
        <div className="flex-1">
          <h1 className="text-2xl font-semibold">Reports</h1>
          <p className="text-sm text-muted-foreground">
            Download and view your generated business reports.
          </p>
        </div>
        <Card>
            <CardHeader>
                <CardTitle>Generated Reports</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">Upload a CSV on the dashboard page to see your reports.</p>
            </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <>
      <div className="flex-1">
        <h1 className="text-2xl font-semibold">Reports</h1>
        <p className="text-sm text-muted-foreground">
          Download and view your generated business reports.
        </p>
      </div>
      <main className="flex flex-1 flex-col gap-4 pt-4 sm:px-6 sm:py-0 md:gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Generated Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Report Name</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reports.map((report) => (
                  <TableRow key={report.name}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        {report.name}
                      </div>
                    </TableCell>
                    <TableCell>{report.date}</TableCell>
                    <TableCell>{report.type}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          report.status === 'Final' ? 'default' : 'secondary'
                        }
                        className={
                          report.status === 'Final'
                            ? 'bg-green-100 text-green-800'
                            : ''
                        }
                      >
                        {report.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </Button>
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
