'use client';

import { Grid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type ViewMode = 'grid' | 'list';

interface PostViewToggleProps {
  viewMode: ViewMode;
  onViewModeChange: (viewMode: ViewMode) => void;
  disabled?: boolean;
}

export function PostViewToggle({
  viewMode,
  onViewModeChange,
  disabled = false,
}: PostViewToggleProps) {
  return (
    <div className="inline-flex items-center rounded-md border bg-background p-1">
      <Button
        variant={viewMode === 'grid' ? 'default' : 'ghost'}
        size="icon"
        className={cn(
          'h-8 w-8 transition-all',
          viewMode === 'grid' && 'shadow-sm'
        )}
        onClick={() => onViewModeChange('grid')}
        disabled={disabled}
        aria-label="Grid view"
      >
        <Grid className="w-4 h-4" />
      </Button>
      <Button
        variant={viewMode === 'list' ? 'default' : 'ghost'}
        size="icon"
        className={cn(
          'h-8 w-8 transition-all',
          viewMode === 'list' && 'shadow-sm'
        )}
        onClick={() => onViewModeChange('list')}
        disabled={disabled}
        aria-label="List view"
      >
        <List className="w-4 h-4" />
      </Button>
    </div>
  );
}
