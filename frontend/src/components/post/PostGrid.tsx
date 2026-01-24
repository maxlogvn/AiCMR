import { PostCard } from './PostCard';
import type { Post } from '@/types/post';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

interface PostGridProps {
  posts: Post[];
  isLoading?: boolean;
  columns?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
  };
  cardVariant?: 'default' | 'compact' | 'featured';
}

export function PostGrid({
  posts,
  isLoading,
  columns = {
    mobile: 1,
    tablet: 2,
    desktop: 3,
  },
  cardVariant = 'default',
}: PostGridProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
        <p>No posts found</p>
      </div>
    );
  }

  return (
    <div
      className={`grid gap-6 ${
        columns.mobile ? `grid-cols-1` : ''
      } ${
        columns.tablet ? `sm:grid-cols-${columns.tablet}` : ''
      } ${
        columns.desktop ? `lg:grid-cols-${columns.desktop}` : ''
      }`}
    >
      {posts.map((post) => (
        <PostCard key={post.id} post={post} variant={cardVariant} />
      ))}
    </div>
  );
}
