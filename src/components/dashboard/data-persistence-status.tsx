'use client';

import { useAuth } from '@/contexts/auth-context';
import { useBusinessData } from '@/contexts/business-data-context';
import { Badge } from '@/components/ui/badge';
import { HelpCircle, Cloud, X } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export function DataPersistenceStatus() {
  const { user } = useAuth();
  const { businessData, fileUrl } = useBusinessData();

  // Determine the current storage status
  const getStorageStatus = () => {
    if (!businessData) {
      return {
        label: 'No Data',
        variant: 'outline' as const,
        message: 'No business data has been uploaded yet.'
      };
    }

    // Consider the user authenticated with Google as having Firebase persistence,
    // regardless of whether a specific file URL has been created yet.
    const isGoogleAuthenticated = !!user?.providerData?.some((provider) => provider.providerId === 'google.com');

    if (isGoogleAuthenticated) {
      return {
        label: 'Firebase',
        variant: 'default' as const,
        message: 'Your data is securely stored in Firebase and will persist across browsers and devices.'
      };
    }

    return {
      label: 'local only',
      variant: 'destructive' as const,
      message: 'Your data is only stored in this browser. Log in with Google for secure cloud storage.'
    };
  };

  const status = getStorageStatus();

  // Get the appropriate icon based on storage status
  const getStatusIcon = () => {
    if (!businessData) {
      return <HelpCircle size={16} />;
    }
    const isGoogleAuthenticated = !!user?.providerData?.some((provider) => provider.providerId === 'google.com');
    return isGoogleAuthenticated ? 
      <Cloud size={16} className="text-green-500" /> : 
      <X size={16} className="text-red-500" />;
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-2 cursor-help">
            <Badge variant={status.variant} className="flex items-center gap-1">
              {getStatusIcon()}
              <span>{status.label}</span>
            </Badge>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p className="max-w-xs">{status.message}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export default DataPersistenceStatus;