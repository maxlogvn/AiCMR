'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { usePosts } from '@/hooks/usePosts';
import { PostGrid, PostList, PostPagination, FilterSidebar, FeaturedPostsCarousel, PostViewToggle } from '@/components/post';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import type { GetPostsParams, PostFilters } from '@/types/post';
import { useDebounce } from '@/hooks/useDebounce';

type ViewMode = 'grid' | 'list';

export default function BlogPage() {
  const searchParams = useSearchParams();
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [filters, setFilters] = useState<PostFilters>({});

  // Get query params from URL
  const page = Number(searchParams.get('page')) || 1;
  const pageSize = Number(searchParams.get('pageSize')) || 10;

  // Debounce filters
  const debouncedFilters = useDebounce(filters, 300);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedFilters.status) params.set('status', debouncedFilters.status);
    if (debouncedFilters.category_id) params.set('category_id', debouncedFilters.category_id.toString());
    if (debouncedFilters.tags && debouncedFilters.tags.length > 0) {
      debouncedFilters.tags.forEach(tag => params.append('tags', tag.toString()));
    }
    if (debouncedFilters.search) params.set('search', debouncedFilters.search);
    if (debouncedFilters.date_from) params.set('date_from', debouncedFilters.date_from);
    if (debouncedFilters.date_to) params.set('date_to', debouncedFilters.date_to);
    if (page > 1) params.set('page', page.toString());
    if (pageSize !== 10) params.set('pageSize', pageSize.toString());

    const newUrl = `?${params.toString()}`;
    window.history.replaceState({}, '', newUrl);
  }, [debouncedFilters, page, pageSize]);

  // Build query params
  const queryParams: GetPostsParams = {
    page,
    pageSize,
    status: 'published',
    category_id: debouncedFilters.category_id,
    tags: debouncedFilters.tags,
    search: debouncedFilters.search,
    date_from: debouncedFilters.date_from,
    date_to: debouncedFilters.date_to,
  };

  // Fetch posts
  const { data, isLoading, error } = usePosts(queryParams);

  // Fetch featured posts
  const featuredQueryParams: GetPostsParams = {
    page: 1,
    pageSize: 5,
    status: 'published',
    is_featured: true,
    sort_by: 'published_at',
    sort_order: 'desc',
  };
  const { data: featuredData } = usePosts(featuredQueryParams);
  const featuredPosts = featuredData?.items || [];

  // Reset filters
  const handleResetFilters = () => {
    setFilters({});
  };

  // Handle page change
  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(window.location.search);
    params.set('page', newPage.toString());
    window.history.pushState({}, '', `?${params.toString()}`);
    window.location.reload();
  };

  // Error state
  if (error) {
    return (
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 py-8">
        <div className="text-center py-12 text-red-600 dark:text-red-400">
          <p>Failed to load posts. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Blog
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Khám phá nội dung bổ ích từ cộng đồng
        </p>
      </div>

      {/* Featured Posts Carousel */}
      {featuredPosts.length > 0 && (
        <div className="mb-8">
          <FeaturedPostsCarousel posts={featuredPosts} />
        </div>
      )}

      {/* Main Content */}
      <div className="flex gap-6 flex-col lg:flex-row">
        {/* Main Content Area */}
        <div className="flex-1">
          {/* View Toggle */}
          <div className="flex justify-between items-center mb-6">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {data?.total || 0} posts found
            </p>
            <PostViewToggle viewMode={viewMode} onViewModeChange={setViewMode} />
          </div>

          {/* Posts Grid/List */}
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <LoadingSpinner />
            </div>
          ) : data && data.items.length > 0 ? (
            <>
              {viewMode === 'grid' ? (
                <PostGrid posts={data.items} isLoading={isLoading} />
              ) : (
                <PostList posts={data.items} isLoading={isLoading} />
              )}

              {/* Pagination */}
              {data.pages && data.pages > 1 && (
                <div className="mt-8">
                  <PostPagination
                    total={data.total}
                    page={data.page}
                    pageSize={data.size}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12 text-gray-600 dark:text-gray-400">
              <p>No posts found</p>
            </div>
          )}
        </div>

        {/* Sidebar Filters */}
        <div className="w-full lg:w-72 shrink-0">
          <FilterSidebar
            filters={filters}
            onFiltersChange={setFilters}
            onReset={handleResetFilters}
          />
        </div>
      </div>
    </div>
  );
}
