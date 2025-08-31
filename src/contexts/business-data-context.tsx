'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { BusinessData, AnalyzedMetrics } from '@/services/data-analysis-service';

interface BusinessDataContextType {
  businessData: BusinessData | null;
  analyzedMetrics: AnalyzedMetrics | null;
  isProcessing: boolean;
  setBusinessData: (data: BusinessData | null) => void;
  setAnalyzedMetrics: (metrics: AnalyzedMetrics | null) => void;
  setIsProcessing: (processing: boolean) => void;
}

const BusinessDataContext = createContext<BusinessDataContextType | undefined>(undefined);

export function BusinessDataProvider({ children }: { children: ReactNode }) {
  const [businessData, setBusinessData] = useState<BusinessData | null>(null);
  const [analyzedMetrics, setAnalyzedMetrics] = useState<AnalyzedMetrics | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  return (
    <BusinessDataContext.Provider
      value={{
        businessData,
        analyzedMetrics,
        isProcessing,
        setBusinessData,
        setAnalyzedMetrics,
        setIsProcessing,
      }}
    >
      {children}
    </BusinessDataContext.Provider>
  );
}

export function useBusinessData() {
  const context = useContext(BusinessDataContext);
  if (context === undefined) {
    throw new Error('useBusinessData must be used within a BusinessDataProvider');
  }
  return context;
}
