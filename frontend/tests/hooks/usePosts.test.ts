import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, expect, beforeEach } from 'vitest';
import { usePosts } from '@/hooks/usePosts';
import { postsApi } from '@/lib/api-posts';
import type { Post } from '@/types/post';

// Mock posts API
vi.mock('@/lib/api-posts', () => ({
  postsApi: {
    getPosts: vi.fn(),
  },
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        staleTime: Infinity,
      },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('usePosts', () => {
  const mockPosts: Post[] = [
    {
      id: 1,
      title: 'Test Post 1',
      slug: 'test-post-1',
      excerpt: 'Test excerpt 1',
      content: '# Test Content 1',
      status: 'published',
      author_id: 1,
      category_id: 1,
      thumbnail_image_id: null,
      is_featured: false,
      is_pinned: false,
      view_count: 10,
      like_count: 5,
      comment_count: 3,
      seo_title: null,
      seo_description: null,
      seo_keywords: null,
      created_at: '2026-01-22T00:00:00Z',
      updated_at: '2026-01-22T00:00:00Z',
      published_at: '2026-01-22T00:00:00Z',
    },
    {
      id: 2,
      title: 'Test Post 2',
      slug: 'test-post-2',
      excerpt: 'Test excerpt 2',
      content: '# Test Content 2',
      status: 'published',
      author_id: 1,
      category_id: 1,
      thumbnail_image_id: null,
      is_featured: false,
      is_pinned: false,
      view_count: 20,
      like_count: 10,
      comment_count: 5,
      seo_title: null,
      seo_description: null,
      seo_keywords: null,
      created_at: '2026-01-22T00:00:00Z',
      updated_at: '2026-01-22T00:00:00Z',
      published_at: '2026-01-22T00:00:00Z',
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches posts successfully', async () => {
    const mockResponse = {
      data: {
        items: mockPosts,
        total: 2,
        page: 1,
        size: 10,
      },
    };

    vi.mocked(postsApi.getPosts).mockResolvedValue(mockResponse.data);

    const { result } = renderHook(
      () => usePosts({ page: 1, pageSize: 10 }),
      {
        wrapper: createWrapper(),
      }
    );

    await waitFor(() => {
      expect(result.current.data).toEqual(mockResponse.data);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe(null);
    });

    expect(vi.mocked(postsApi.getPosts)).toHaveBeenCalledWith(
      { page: 1, pageSize: 10 }
    );
  });

  it('handles loading state', () => {
    vi.mocked(postsApi.getPosts).mockImplementation(
      () => new Promise(() => {}) // Never resolves
    );

    const { result } = renderHook(
      () => usePosts({ page: 1, pageSize: 10 }),
      {
        wrapper: createWrapper(),
      }
    );

    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeUndefined();
  });

  it('handles error state', async () => {
    const mockError = new Error('Failed to fetch posts');
    vi.mocked(postsApi.getPosts).mockRejectedValue(mockError);

    const { result } = renderHook(
      () => usePosts({ page: 1, pageSize: 10 }),
      {
        wrapper: createWrapper(),
      }
    );

    await waitFor(() => {
      expect(result.current.error).not.toBe(null);
      expect(result.current.isLoading).toBe(false);
    });
  });

  it('caches results', async () => {
    const mockResponse = {
      data: {
        items: mockPosts,
        total: 2,
        page: 1,
        size: 10,
      },
    };

    vi.mocked(postsApi.getPosts).mockResolvedValue(mockResponse.data);

    const { result, rerender } = renderHook(
      () => usePosts({ page: 1, pageSize: 10 }),
      {
        wrapper: createWrapper(),
      }
    );

    await waitFor(() => {
      expect(result.current.data).toEqual(mockResponse.data);
    });

    // Rerender with same params - should use cache
    rerender();

    await waitFor(() => {
      expect(vi.mocked(postsApi.getPosts)).toHaveBeenCalledTimes(1);
    });
  });

  it('refetches on filter change', async () => {
    const mockResponse = {
      data: {
        items: mockPosts,
        total: 2,
        page: 1,
        size: 10,
      },
    };

    vi.mocked(postsApi.getPosts).mockResolvedValue(mockResponse.data);

    const { result, rerender } = renderHook(
      () => usePosts({ page: 1, pageSize: 10, status: 'published' }),
      {
        wrapper: createWrapper(),
      }
    );

    await waitFor(() => {
      expect(result.current.data).toEqual(mockResponse.data);
    });

    // Change filter - should refetch
    rerender();

    const { result: result2 } = renderHook(
      () => usePosts({ page: 1, pageSize: 10, status: 'draft' }),
      {
        wrapper: createWrapper(),
      }
    );

    await waitFor(() => {
      expect(vi.mocked(postsApi.getPosts)).toHaveBeenCalledTimes(2);
    });
  });
});
