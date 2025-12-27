import React, { Suspense, lazy } from 'react';
import { Card } from '@/components/ui/card';

// Skeleton Loader
const SkeletonCard = () => (
  <Card className="animate-pulse bg-gray-200 h-48 rounded-xl" />
);

// Lazy Load Wrapper
export const LazyLoad = ({ importFunc, fallback = <SkeletonCard /> }) => {
  const LazyComponent = lazy(importFunc);
  
  return (
    <Suspense fallback={fallback}>
      <LazyComponent />
    </Suspense>
  );
};

export default LazyLoad;