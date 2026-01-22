import type { Category } from '@/types/post';
import { Badge } from '@/components/ui/badge';

interface CategoryBadgeProps {
  category: Category;
  showIcon?: boolean;
  showStats?: boolean;
  variant?: 'default' | 'secondary' | 'outline' | 'destructive';
}

export function CategoryBadge({
  category,
  showIcon = true,
  showStats = false,
  variant = 'secondary',
}: CategoryBadgeProps) {
  return (
    <Badge
      variant={variant}
      className="gap-1"
      style={category.color ? { borderColor: category.color, backgroundColor: category.color + '20' } : undefined}
    >
      {showIcon && category.icon && <span className="text-sm">{category.icon}</span>}
      <span>{category.name}</span>
      {showStats && <span className="opacity-70">({category.post_count})</span>}
    </Badge>
  );
}
