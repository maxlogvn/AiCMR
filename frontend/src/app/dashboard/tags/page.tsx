"use client";

/**
 * Tags Page - Linear/Vercel Style Redesign
 *
 * Features:
 * - Grid of minimal cards with color badges
 * - Color badge only (not full colored card)
 * - Empty state with icon + CTA
 * - Merge tags functionality
 */

import { useState } from "react";
import { Tag as TagIcon, Plus, Hash } from "lucide-react";
import { PageHeader } from "@/components/dashboard";
import { Button } from "@/components/ui/button";
import { TagList, TagForm, MergeDialog } from "@/components/tag";
import type { Tag } from "@/types/post";

export default function TagsPage() {
  const [selectedTag, setSelectedTag] = useState<Tag | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isMergeOpen, setIsMergeOpen] = useState(false);

  const handleCreate = () => {
    setSelectedTag(null);
    setIsFormOpen(true);
  };

  const handleEdit = (tag: Tag) => {
    setSelectedTag(tag);
    setIsFormOpen(true);
  };

  return (
    <div>
      {/* Page Header */}
      <PageHeader
        title="Tags"
        subtitle="Quản lý tags để người dùng dễ dàng tìm kiếm nội dung"
        icon={TagIcon}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => setIsMergeOpen(true)}>
              <Hash className="h-4 w-4 mr-2" />
              Gộp tags
            </Button>
            <Button onClick={handleCreate}>
              <Plus className="h-4 w-4 mr-2" />
              Tạo tag
            </Button>
          </div>
        }
      />

      {/* Tags Grid */}
      <TagList
        onCreateTag={handleCreate}
        onEditTag={handleEdit}
      />

      {/* Form Dialog */}
      <TagForm
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        tag={selectedTag}
      />

      {/* Merge Dialog */}
      <MergeDialog
        open={isMergeOpen}
        onClose={() => setIsMergeOpen(false)}
      />
    </div>
  );
}
