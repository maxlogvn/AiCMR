import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface PostEditorState {
  // Editor state
  editorDraft: Record<number, string>;
  unsavedChanges: Record<number, boolean>;

  // Auto-save timers
  autoSaveTimer: Record<number, NodeJS.Timeout>;

  // Actions
  setEditorDraft: (postId: number, content: string) => void;
  clearEditorDraft: (postId: number) => void;
  setUnsavedChanges: (postId: number, hasChanges: boolean) => void;
  startAutoSave: (postId: number, content: string, onSave: () => Promise<void>) => void;
  stopAutoSave: (postId: number) => void;
  resetEditor: (postId: number) => void;
}

export const usePostEditorStore = create<PostEditorState>()(
  persist(
    (set, get) => ({
      // Initial state
      editorDraft: {},
      unsavedChanges: {},
      autoSaveTimer: {},

      // Set editor draft
      setEditorDraft: (postId, content) =>
        set((state) => ({
          editorDraft: { ...state.editorDraft, [postId]: content },
          unsavedChanges: {
            ...state.unsavedChanges,
            [postId]: true,
          },
        })),

      // Clear editor draft
      clearEditorDraft: (postId) =>
        set((state) => {
          const { [postId]: _, ...rest } = state.editorDraft;
          const { [postId]: __, ...unsavedRest } = state.unsavedChanges;
          return {
            editorDraft: rest,
            unsavedChanges: unsavedRest,
          };
        }),

      // Set unsaved changes flag
      setUnsavedChanges: (postId, hasChanges) =>
        set((state) => ({
          unsavedChanges: { ...state.unsavedChanges, [postId]: hasChanges },
        })),

      // Start auto-save timer
      startAutoSave: (postId, content, onSave) => {
        // Clear existing timer if any
        const existingTimer = get().autoSaveTimer[postId];
        if (existingTimer) {
          clearTimeout(existingTimer);
        }

        // Set new timer (30 seconds)
        const timer = setTimeout(async () => {
          try {
            await onSave();
            // Mark as saved after successful save
            set((state) => ({
              unsavedChanges: { ...state.unsavedChanges, [postId]: false },
            }));
          } catch (error) {
            console.error('Auto-save failed:', error);
          }
        }, 30000); // 30 seconds

        set((state) => ({
          autoSaveTimer: { ...state.autoSaveTimer, [postId]: timer },
          editorDraft: { ...state.editorDraft, [postId]: content },
          unsavedChanges: { ...state.unsavedChanges, [postId]: true },
        }));
      },

      // Stop auto-save timer
      stopAutoSave: (postId) =>
        set((state) => {
          const timer = state.autoSaveTimer[postId];
          if (timer) {
            clearTimeout(timer);
          }
          const { [postId]: _, ...rest } = state.autoSaveTimer;
          return {
            autoSaveTimer: rest,
          };
        }),

      // Reset editor state for a post
      resetEditor: (postId) =>
        set((state) => {
          const timer = state.autoSaveTimer[postId];
          if (timer) {
            clearTimeout(timer);
          }
          const { [postId]: _, ...editorRest } = state.editorDraft;
          const { [postId]: __, ...unsavedRest } = state.unsavedChanges;
          const { [postId]: ___, ...timerRest } = state.autoSaveTimer;
          return {
            editorDraft: editorRest,
            unsavedChanges: unsavedRest,
            autoSaveTimer: timerRest,
          };
        }),
    }),
    {
      name: 'post-editor-storage',
      partialize: (state) => ({
        // Only persist drafts, not timers
        editorDraft: state.editorDraft,
      }),
    }
  )
);
