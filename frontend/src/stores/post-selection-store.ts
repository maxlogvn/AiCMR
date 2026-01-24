import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface PostSelectionStore {
  selectedIds: number[];
  toggle: (id: number) => void;
  add: (id: number) => void;
  remove: (id: number) => void;
  setAll: (ids: number[]) => void;
  clear: () => void;
  isSelected: (id: number) => boolean;
  count: () => number;
}

export const usePostSelectionStore = create<PostSelectionStore>()(
  persist(
    (set, get) => ({
      selectedIds: [],

      toggle: (id) => {
        set((state) => {
          const isSelected = state.selectedIds.includes(id);
          return {
            selectedIds: isSelected
              ? state.selectedIds.filter((selectedId) => selectedId !== id)
              : [...state.selectedIds, id],
          };
        });
      },

      add: (id) => {
        set((state) => {
          if (state.selectedIds.includes(id)) return state;
          return { selectedIds: [...state.selectedIds, id] };
        });
      },

      remove: (id) => {
        set((state) => ({
          selectedIds: state.selectedIds.filter((selectedId) => selectedId !== id),
        }));
      },

      setAll: (ids) => {
        set({ selectedIds: ids });
      },

      clear: () => {
        set({ selectedIds: [] });
      },

      isSelected: (id) => {
        return get().selectedIds.includes(id);
      },

      count: () => {
        return get().selectedIds.length;
      },
    }),
    {
      name: 'post-selection-storage',
    }
  )
);
