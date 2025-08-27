import { BarChartHorizontal } from 'lucide-react';

export function Logo() {
  return (
    <div className="flex items-center gap-2">
      <BarChartHorizontal className="h-8 w-8 text-primary" />
      <h1 className="text-2xl font-bold text-foreground">VisionBoard</h1>
    </div>
  );
}
