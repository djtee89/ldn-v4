import React from 'react';
import { Button } from '@/components/ui/button';
import { Banknote, TrendingUp, GraduationCap, Trees, Wind, Shield } from 'lucide-react';
import { AnalysisMode } from '@/pages/Analysis';
import { cn } from '@/lib/utils';

interface AnalysisModeSelectorProps {
  activeMode: AnalysisMode;
  onModeChange: (mode: AnalysisMode) => void;
}

const modes: { id: AnalysisMode; label: string; icon: React.ReactNode }[] = [
  { id: 'price-per-sqft', label: '£/ft²', icon: <Banknote className="h-4 w-4" /> },
  { id: 'yield', label: 'Yield', icon: <TrendingUp className="h-4 w-4" /> },
  { id: 'growth', label: 'Growth', icon: <TrendingUp className="h-4 w-4" /> },
  { id: 'schools', label: 'Schools', icon: <GraduationCap className="h-4 w-4" /> },
  { id: 'green', label: 'Green', icon: <Trees className="h-4 w-4" /> },
  { id: 'noise-air', label: 'Noise/Air', icon: <Wind className="h-4 w-4" /> },
  { id: 'crime', label: 'Crime', icon: <Shield className="h-4 w-4" /> },
];

const AnalysisModeSelector: React.FC<AnalysisModeSelectorProps> = ({ activeMode, onModeChange }) => {
  return (
    <div className="bg-background/95 backdrop-blur-sm rounded-lg border border-border shadow-lg p-2 flex flex-wrap gap-1">
      {modes.map((mode) => (
        <Button
          key={mode.id}
          variant={activeMode === mode.id ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onModeChange(mode.id)}
          className={cn(
            "text-xs font-medium transition-all",
            activeMode === mode.id && "shadow-md"
          )}
        >
          {mode.icon}
          <span className="ml-1">{mode.label}</span>
        </Button>
      ))}
    </div>
  );
};

export default AnalysisModeSelector;
