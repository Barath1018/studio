'use client';

import { useState } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import ContactForm from '@/components/contact-form';

export default function HelpPage() {
  const [showContactForm, setShowContactForm] = useState(false);

  return (
    <>
      <div className="flex-1">
        <h1 className="text-2xl font-semibold">Help & Support</h1>
        <p className="text-sm text-muted-foreground">
          Find answers to your questions and get help.
        </p>
      </div>
      <main className="flex flex-1 flex-col gap-4 pt-4 sm:px-6 sm:py-0 md:gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative mb-6">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search FAQs..."
                className="w-full rounded-lg bg-background pl-8"
              />
            </div>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>
                  How do I generate a new report?
                </AccordionTrigger>
                <AccordionContent>
                  To generate a new report, navigate to the Reports page from
                  the sidebar, click the &quot;Generate Report&quot; button,
                  select your desired parameters, and the system will create it
                  for you.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>
                  Can I customize the dashboard view?
                </AccordionTrigger>
                <AccordionContent>
                  Yes, you can customize the dashboard by clicking the
                  &quot;Customize&quot; button in the top right corner. This
                  allows you to add, remove, and rearrange KPI cards and charts.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>
                  How do I connect a new data source?
                </AccordionTrigger>
                <AccordionContent>
                  You can connect a new data source by going to Settings &gt;
                  Integrations. From there, you can select from a list of
                  supported platforms like Salesforce, Google Analytics, and
                  more.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger>
                  Who can I contact for technical support?
                </AccordionTrigger>
                <AccordionContent>
                  For technical support, you can email our support team at
                  support@insightedge.com or use the live chat widget at the
                  bottom right of the screen.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Contact Support</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Still have questions? Our support team is here to help.
            </p>
            <Button 
              className="mt-4" 
              onClick={() => setShowContactForm(true)}
            >
              Contact Us
            </Button>
          </CardContent>
        </Card>
      </main>
      
      {showContactForm && (
        <ContactForm onClose={() => setShowContactForm(false)} />
      )}
    </>
  );
}
