import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ChevronUp, X } from 'lucide-react';
import { AnalysisMode } from '@/pages/Analysis';
import { cn } from '@/lib/utils';

export interface BracketFilter {
  min: number;
  max: number;
  label: string;
  color: string;
  count?: number;
}

interface AnalysisLegendProps {
  mode: AnalysisMode;
  brackets: BracketFilter[];
  selectedBrackets: number[];
  onBracketToggle: (index: number) => void;
  onReset: () => void;
}

const AnalysisLegend: React.FC<AnalysisLegendProps> = ({
  mode,
  brackets,
  selectedBrackets,
  onBracketToggle,
  onReset,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  if (brackets.length === 0) return null;

  return (
    <div className="absolute top-20 left-4 z-10 bg-background/95 backdrop-blur-sm rounded-lg border border-border shadow-lg max-w-xs">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-border">
        <h3 className="text-sm font-semibold">Legend & Filters</h3>
        <div className="flex items-center gap-1">
          {selectedBrackets.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onReset}
              className="h-6 px-2 text-xs"
            >
              Reset
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-6 w-6"
          >
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Brackets */}
      {isExpanded && (
        <div className="p-3 space-y-2">
          {brackets.map((bracket, index) => {
            const isSelected = selectedBrackets.includes(index);
            return (
              <button
                key={index}
                onClick={() => onBracketToggle(index)}
                className={cn(
                  "w-full flex items-center justify-between p-2 rounded-md transition-all",
                  "hover:bg-muted/50 border",
                  isSelected
                    ? "border-primary bg-primary/10"
                    : "border-transparent"
                )}
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-6 h-6 rounded border border-border"
                    style={{ backgroundColor: bracket.color }}
                  />
                  <span className="text-sm font-medium">{bracket.label}</span>
                </div>
                {bracket.count !== undefined && (
                  <Badge variant="secondary" className="text-xs">
                    {bracket.count}
                  </Badge>
                )}
              </button>
            );
          })}
          
          {selectedBrackets.length > 0 && (
            <p className="text-xs text-muted-foreground pt-2 border-t">
              {selectedBrackets.length} filter{selectedBrackets.length !== 1 ? 's' : ''} active
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default AnalysisLegend;
