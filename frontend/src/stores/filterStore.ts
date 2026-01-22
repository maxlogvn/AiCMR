import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { GetPostsParams, PostFilters } from '@/types/post';

interface FilterStoreState {
  // Current filters
  filters: GetPostsParams;

  // Presets
  savedPresets: Record<string, GetPostsParams>;

  // Actions
  setFilters: (filters: Partial<GetPostsParams>) => void;
  clearFilters: () => void;
  resetToDefaults: () => void;
  savePreset: (name: string) => void;
  loadPreset: (name: string) => void;
  deletePreset: (name: string) => void;
  updateFilter: <K extends keyof GetPostsParams>(key: K, value: GetPostsParams[K]) => void;
}

// Default filters
const defaultFilters: GetPostsParams = {
  page: 1,
  pageSize: 10,
  status: 'published',
};

export const useFilterStore = create<FilterStoreState>()(
  persist(
    (set, get) => ({
      // Initial state
      filters: { ...defaultFilters },
      savedPresets: {},

      // Set filters
      setFilters: (newFilters) =>
        set((state) => ({
          filters: { ...state.filters, ...newFilters },
        })),

      // Update single filter
      updateFilter: <K extends keyof GetPostsParams>(key: K, value: GetPostsParams[K]) =>
        set((state) => ({
          filters: { ...state.filters, [key]: value },
        })),

      // Clear all filters (reset to defaults)
      clearFilters: () =>
        set(() => ({
          filters: { ...defaultFilters },
        })),

      // Reset to defaults but keep current page
      resetToDefaults: () =>
        set((state) => ({
          filters: {
            ...defaultFilters,
            page: state.filters.page,
          },
        })),

      // Save current filters as preset
      savePreset: (name) =>
        set((state) => ({
          savedPresets: {
            ...state.savedPresets,
            [name]: { ...state.filters },
          },
        })),

      // Load preset
      loadPreset: (name) =>
        set((state) => {
          const preset = state.savedPresets[name];
          if (!preset) return state;

          return {
            filters: { ...preset },
          };
        }),

      // Delete preset
      deletePreset: (name) =>
        set((state) => {
          const { [name]: _, ...rest } = state.savedPresets;
          return {
            savedPresets: rest,
          };
        }),
    }),
    {
      name: 'post-filters-storage',
    }
  )
);
