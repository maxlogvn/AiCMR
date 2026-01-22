import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type ViewMode = 'grid' | 'list';
type SortBy = 'created_at' | 'updated_at' | 'published_at' | 'view_count' | 'like_count' | 'title';
type SortOrder = 'asc' | 'desc';

interface UIStoreState {
  // View mode
  postViewMode: ViewMode;
  setPostViewMode: (mode: ViewMode) => void;

  // Sort options
  sortBy: SortBy;
  sortOrder: SortOrder;
  setSort: (sortBy: SortBy, sortOrder: SortOrder) => void;
  toggleSortOrder: () => void;

  // Sidebar state
  isFilterSidebarOpen: boolean;
  toggleFilterSidebar: () => void;
  openFilterSidebar: () => void;
  closeFilterSidebar: () => void;

  // Post card display options
  showThumbnails: boolean;
  showExcerpt: boolean;
  showStats: boolean;
  setPostCardOptions: (options: Partial<{
    showThumbnails: boolean;
    showExcerpt: boolean;
    showStats: boolean;
  }>) => void;

  // Layout
  sidebarWidth: number;
  setSidebarWidth: (width: number) => void;
}

export const useUIStore = create<UIStoreState>()(
  persist(
    (set) => ({
      // Initial state
      postViewMode: 'grid',
      sortBy: 'created_at',
      sortOrder: 'desc',
      isFilterSidebarOpen: true,
      showThumbnails: true,
      showExcerpt: true,
      showStats: true,
      sidebarWidth: 320,

      // View mode actions
      setPostViewMode: (mode) => set({ postViewMode: mode }),

      // Sort actions
      setSort: (sortBy, sortOrder) =>
        set({
          sortBy,
          sortOrder,
        }),

      toggleSortOrder: () =>
        set((state) => ({
          sortOrder: state.sortOrder === 'asc' ? 'desc' : 'asc',
        })),

      // Sidebar actions
      toggleFilterSidebar: () =>
        set((state) => ({
          isFilterSidebarOpen: !state.isFilterSidebarOpen,
        })),

      openFilterSidebar: () => set({ isFilterSidebarOpen: true }),

      closeFilterSidebar: () => set({ isFilterSidebarOpen: false }),

      // Post card options
      setPostCardOptions: (options) =>
        set((state) => ({
          showThumbnails: options.showThumbnails ?? state.showThumbnails,
          showExcerpt: options.showExcerpt ?? state.showExcerpt,
          showStats: options.showStats ?? state.showStats,
        })),

      // Layout
      setSidebarWidth: (width) => set({ sidebarWidth: width }),
    }),
    {
      name: 'post-ui-storage',
    }
  )
);
