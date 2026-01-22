'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import type { Post } from '@/types/post';
import { getFileUrl } from '@/lib/api';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface FeaturedPostsCarouselProps {
  posts: Post[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
  showDots?: boolean;
  showArrows?: boolean;
}

export function FeaturedPostsCarousel({
  posts,
  autoPlay = true,
  autoPlayInterval = 5000,
  showDots = true,
  showArrows = true,
}: FeaturedPostsCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-play
  useEffect(() => {
    if (!autoPlay || posts.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % posts.length);
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [autoPlay, autoPlayInterval, posts.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + posts.length) % posts.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % posts.length);
  };

  if (!posts || posts.length === 0) {
    return null;
  }

  const currentPost = posts[currentIndex];

  return (
    <Card className="relative overflow-hidden h-[400px] md:h-[500px]">
      {/* Background Image */}
      {currentPost.thumbnail_image && (
        <div className="absolute inset-0">
          <Image
            src={getFileUrl(currentPost.thumbnail_image.id)}
            alt={currentPost.title}
            fill
            className="object-cover"
            priority={currentIndex === 0}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        </div>
      )}

      {/* Arrows */}
      {showArrows && posts.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full"
            onClick={goToPrevious}
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full"
            onClick={goToNext}
          >
            <ChevronRight className="w-6 h-6" />
          </Button>
        </>
      )}

      {/* Content */}
      <div className="relative h-full flex flex-col justify-end p-6 md:p-10">
        <div className="max-w-3xl">
          {/* Category */}
          {currentPost.category && (
            <Badge className="bg-primary text-primary-foreground mb-4">
              {currentPost.category.name}
            </Badge>
          )}

          {/* Title */}
          <Link href={`/blog/${currentPost.slug}`}>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3 hover:text-primary transition-colors">
              {currentPost.title}
            </h2>
          </Link>

          {/* Excerpt */}
          {currentPost.excerpt && (
            <p className="text-gray-200 text-lg mb-4 line-clamp-2">
              {currentPost.excerpt}
            </p>
          )}

          {/* Meta */}
          <div className="flex items-center gap-4 text-gray-200 text-sm">
            {currentPost.author && (
              <span>By {currentPost.author.username}</span>
            )}
            <span>
              {new Date(currentPost.published_at || currentPost.created_at).toLocaleDateString()}
            </span>
            {currentPost.view_count > 0 && (
              <span>{currentPost.view_count} views</span>
            )}
          </div>

          {/* Featured Badge */}
          <div className="flex items-center gap-2 mt-4">
            <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
            <span className="text-yellow-400 font-semibold">Featured Post</span>
          </div>
        </div>
      </div>

      {/* Dots */}
      {showDots && posts.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {posts.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex ? 'bg-primary w-6' : 'bg-white/50'
              }`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </Card>
  );
}
