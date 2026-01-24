import Link from 'next/link';
import Image from 'next/image';
import type { Post } from '@/types/post';
import { getFileUrl } from '@/lib/api';
import { Eye, Heart, MessageSquare, Calendar, User } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/ui/status-badge';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Pencil, Trash2, Archive, Check } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface PostListProps {
  posts: Post[];
  isLoading?: boolean;
  showActions?: boolean;
  onEdit?: (post: Post) => void;
  onDelete?: (post: Post) => void;
  onPublish?: (post: Post) => void;
  onArchive?: (post: Post) => void;
}

export function PostList({
  posts,
  isLoading,
  showActions = false,
  onEdit,
  onDelete,
  onPublish,
  onArchive,
}: PostListProps) {
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
    <div className="space-y-4">
      {posts.map((post) => (
        <Card key={post.id}>
          <div className="flex gap-4 p-4">
            {/* Thumbnail */}
            {post.thumbnail_image && (
              <Link href={`/blog/${post.slug}`} className="flex-shrink-0">
                <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                  <Image
                    src={getFileUrl(post.thumbnail_image.id)}
                    alt={post.title}
                    fill
                    className="object-cover"
                  />
                </div>
              </Link>
            )}

            {/* Content */}
            <div className="flex-1 min-w-0">
              {/* Header */}
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex-1 min-w-0">
                  {/* Category & Status */}
                  <div className="flex items-center gap-2 mb-1">
                    {post.category && (
                      <Badge variant="secondary" className="text-xs">
                        {post.category.name}
                      </Badge>
                    )}
                    <StatusBadge status={post.status as any} className="text-xs" />
                    {post.is_featured && (
                      <Badge variant="default" className="text-xs">
                        Featured
                      </Badge>
                    )}
                  </div>

                  {/* Title */}
                  <Link href={`/blog/${post.slug}`}>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 hover:text-primary transition-colors line-clamp-1">
                      {post.title}
                    </h3>
                  </Link>
                </div>

                {/* Actions */}
                {showActions && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="flex-shrink-0">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {onEdit && (
                        <DropdownMenuItem onClick={() => onEdit(post)}>
                          <Pencil className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                      )}
                      {post.status === 'draft' && onPublish && (
                        <DropdownMenuItem onClick={() => onPublish(post)}>
                          <Check className="w-4 h-4 mr-2" />
                          Publish
                        </DropdownMenuItem>
                      )}
                      {post.status === 'published' && onArchive && (
                        <DropdownMenuItem onClick={() => onArchive(post)}>
                          <Archive className="w-4 h-4 mr-2" />
                          Archive
                        </DropdownMenuItem>
                      )}
                      {onDelete && (
                        <DropdownMenuItem
                          onClick={() => onDelete(post)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>

              {/* Excerpt */}
              {post.excerpt && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">
                  {post.excerpt}
                </p>
              )}

              {/* Footer */}
              <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                {post.author && (
                  <div className="flex items-center gap-1">
                    <User className="w-3.5 h-3.5" />
                    <span>{post.author.username}</span>
                  </div>
                )}

                <div className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <time>
                    {new Date(post.published_at || post.created_at).toLocaleDateString()}
                  </time>
                </div>

                <div className="flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5" />
                  <span>{post.view_count}</span>
                </div>

                <div className="flex items-center gap-1">
                  <Heart className="w-3.5 h-3.5" />
                  <span>{post.like_count}</span>
                </div>

                <div className="flex items-center gap-1">
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>{post.comment_count}</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
