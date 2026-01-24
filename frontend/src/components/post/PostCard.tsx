import Link from 'next/link';
import Image from 'next/image';
import type { Post } from '@/types/post';
import { getFileUrl } from '@/lib/api';
import { Eye, Heart, MessageSquare, Calendar, User } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface PostCardProps {
  post: Post;
  showThumbnail?: boolean;
  showExcerpt?: boolean;
  showStats?: boolean;
  showAuthor?: boolean;
  showCategory?: boolean;
  showTags?: boolean;
  variant?: 'default' | 'compact' | 'featured';
}

export function PostCard({
  post,
  showThumbnail = true,
  showExcerpt = true,
  showStats = true,
  showAuthor = true,
  showCategory = true,
  showTags = false,
  variant = 'default',
}: PostCardProps) {
  const isFeatured = variant === 'featured';

  return (
    <Link href={`/blog/${post.slug}`}>
      <Card
        hover
        className={`group overflow-hidden transition-all duration-300 ${
          isFeatured ? 'border-primary-600' : ''
        }`}
      >
        {/* Thumbnail */}
        {showThumbnail && post.thumbnail_image && (
          <div
            className={`relative overflow-hidden bg-gray-100 dark:bg-gray-800 ${
              isFeatured ? 'h-64' : 'h-48'
            }`}
          >
            <Image
              src={getFileUrl(post.thumbnail_image.id)}
              alt={post.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {post.is_featured && (
              <Badge className="absolute top-4 right-4 bg-primary">
                Featured
              </Badge>
            )}
          </div>
        )}

        <div className="p-4">
          {/* Category */}
          {showCategory && post.category && (
            <Badge variant="secondary" className="mb-2">
              {post.category.name}
            </Badge>
          )}

          {/* Title */}
          <h3
            className={`font-bold text-gray-900 dark:text-gray-100 mb-2 group-hover:text-primary transition-colors ${
              isFeatured ? 'text-2xl' : 'text-lg'
            }`}
          >
            {post.title}
          </h3>

          {/* Excerpt */}
          {showExcerpt && post.excerpt && (
            <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
              {post.excerpt}
            </p>
          )}

          {/* Tags */}
          {showTags && post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-4">
              {post.tags.map((tag) => (
                <Badge key={tag.id} variant="outline" className="text-xs">
                  {tag.name}
                </Badge>
              ))}
            </div>
          )}

          {/* Stats & Author */}
          {(showStats || showAuthor) && (
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              {showAuthor && post.author && (
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  <span>{post.author.username}</span>
                </div>
              )}

              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <time>
                  {new Date(post.published_at || post.created_at).toLocaleDateString()}
                </time>
              </div>

              {showStats && (
                <>
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    <span>{post.view_count}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <Heart className="w-4 h-4" />
                    <span>{post.like_count}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <MessageSquare className="w-4 h-4" />
                    <span>{post.comment_count}</span>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </Card>
    </Link>
  );
}
