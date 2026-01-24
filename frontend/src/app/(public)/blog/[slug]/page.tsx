'use client';

import { useParams } from 'next/navigation';
import { usePostBySlug, usePostRaw } from '@/hooks/usePosts';
import { getFileUrl } from '@/lib/api';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/ui/status-badge';
import { Button } from '@/components/ui/button';
import { Eye, Heart, MessageSquare, Calendar, User, Share2, BookOpen, Tag as TagIcon, FolderOpen } from 'lucide-react';

export default function PostDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const { data: post, isLoading, error } = usePostBySlug(slug);
  const { data: rawContent } = usePostRaw(slug, !isLoading && !error);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="container mx-auto max-w-4xl px-4 sm:px-6 py-8">
        <div className="text-center py-12 text-red-600 dark:text-red-500">
          <p>Failed to load post. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 sm:px-6 py-8">
      {/* Breadcrumb */}
      <div className="mb-6">
        <a href="/blog" className="text-primary-600 hover:underline">
          ← Back to Blog
        </a>
      </div>

      {/* Header */}
      <header className="mb-8">
        {/* Category */}
        {post.category && (
          <Badge variant="secondary" className="mb-4">
            {post.category.name}
          </Badge>
        )}

        {/* Title */}
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          {post.title}
        </h1>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
          {post.author && (
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>{post.author.username}</span>
            </div>
          )}

          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <time>
              {new Date(post.published_at || post.created_at).toLocaleDateString()}
            </time>
          </div>

          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            <span>{post.view_count} views</span>
          </div>

          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4" />
            <span>{post.like_count} likes</span>
          </div>

          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            <span>{post.comment_count} comments</span>
          </div>
        </div>

        {/* Featured Badge */}
        {post.is_featured && (
          <Badge variant="default" className="mb-4">
            Featured Post
          </Badge>
        )}

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map((tag) => (
              <Badge key={tag.id} variant="outline" className="flex items-center gap-1">
                <TagIcon className="w-3 h-3" />
                {tag.name}
              </Badge>
            ))}
          </div>
        )}
      </header>

      {/* Thumbnail */}
      {post.thumbnail_image && (
        <div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden mb-8">
          <img
            src={getFileUrl(post.thumbnail_image.id)}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Content */}
      <Card className="p-6 md:p-8 mb-8">
        <div
          className="prose prose-gray dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: rawContent || post.content }}
        />
      </Card>

      {/* Actions */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Heart className="w-4 h-4 mr-2" />
            Like
          </Button>
          <Button variant="outline" size="sm">
            <MessageSquare className="w-4 h-4 mr-2" />
            Comment
          </Button>
        </div>
        <Button variant="outline" size="sm">
          <Share2 className="w-4 h-4 mr-2" />
          Share
        </Button>
      </div>

      {/* SEO Metadata (for debugging) */}
      {process.env.NODE_ENV === 'development' && post.seo_title && (
        <Card className="p-4 mb-8 bg-gray-50 dark:bg-gray-800">
          <h3 className="font-semibold mb-2">SEO Metadata</h3>
          <div className="space-y-1 text-sm">
            {post.seo_title && <p><strong>Title:</strong> {post.seo_title}</p>}
            {post.seo_description && <p><strong>Description:</strong> {post.seo_description}</p>}
            {post.seo_keywords && <p><strong>Keywords:</strong> {post.seo_keywords}</p>}
          </div>
        </Card>
      )}

      {/* Related Posts (placeholder) */}
      {post.category && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Related Posts
          </h2>
          <Card className="p-6">
            <p className="text-gray-500 dark:text-gray-400">
              More posts in {post.category.name} coming soon...
            </p>
          </Card>
        </div>
      )}

      {/* Comments Section (placeholder) */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Comments ({post.comment_count})
        </h2>
        <Card className="p-6">
          <p className="text-gray-500 dark:text-gray-400">
            Comments feature coming soon...
          </p>
        </Card>
      </div>
    </div>
  );
}
