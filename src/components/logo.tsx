import { DollarSign } from 'lucide-react';

export function Logo() {
  return (
    <div className="flex items-center gap-2">
      <div className="bg-primary/20 text-primary p-2 rounded-md">
        <DollarSign className="h-6 w-6" />
      </div>
      <div>
        <h1 className="text-xl font-bold text-black">InsightEdge</h1>
        <p className="text-xs text-black/70">Business Intelligence</p>
      </div>
    </div>
  );
}
