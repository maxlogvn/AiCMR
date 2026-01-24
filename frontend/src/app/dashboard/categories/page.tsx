"use client";

/**
 * Categories Page - Linear/Vercel Style Redesign
 *
 * Features:
 * - Tree view with dotted connectors
 * - Subtle cards for nodes
 * - Drag handles for reordering
 * - Empty state with icon + CTA
 */

import { useState } from "react";
import { FolderTree, Plus } from "lucide-react";
import { PageHeader } from "@/components/dashboard";
import { Button } from "@/components/ui/button";
import { CategoryTree, CategoryForm } from "@/components/category";
import type { Category } from "@/types/post";

export default function CategoriesPage() {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleCreate = () => {
    setSelectedCategory(null);
    setIsFormOpen(true);
  };

  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    setIsFormOpen(true);
  };

  return (
    <div>
      {/* Page Header */}
      <PageHeader
        title="Danh mục"
        subtitle="Tổ chức bài viết bằng cây danh mục phân cấp"
        icon={FolderTree}
        actions={
          <Button onClick={handleCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Tạo danh mục
          </Button>
        }
      />

      {/* Tree View */}
      <CategoryTree
        onCreateCategory={handleCreate}
        onEditCategory={handleEdit}
      />

      {/* Form Dialog */}
      <CategoryForm
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        category={selectedCategory}
      />
    </div>
  );
}
