'use client';

import { useState, useEffect } from 'react';
import { BusinessData } from '@/services/data-analysis-service';

export function useBusinessData() {
  const [businessData, setBusinessData] = useState<BusinessData | null>(null);
  const [loading, setLoading] = useState(false);

  // This hook will be used to share business data across dashboard components
  // The actual data will be set by the FileUpload component when files are processed
  
  return {
    businessData,
    setBusinessData,
    loading,
    setLoading
  };
}
