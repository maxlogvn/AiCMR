import type { Tag } from '@/types/post';
import { Badge } from '@/components/ui/badge';

interface TagBadgeProps {
  tag: Tag;
  showStats?: boolean;
  variant?: 'default' | 'secondary' | 'outline' | 'destructive';
}

export function TagBadge({
  tag,
  showStats = false,
  variant = 'secondary',
}: TagBadgeProps) {
  return (
    <Badge
      variant={variant}
      className="gap-1"
      style={tag.color ? { backgroundColor: tag.color + '20', borderColor: tag.color } : undefined}
    >
      <span>{tag.name}</span>
      {showStats && <span className="opacity-70">({tag.post_count})</span>}
    </Badge>
  );
}
