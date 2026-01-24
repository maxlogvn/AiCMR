"use client";

import { Avatar } from "@/components/ui/avatar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Link from "next/link";

interface AuthorData {
  id: number;
  username: string;
  full_name: string | null;
  avatar: string | null;
  count: number;
}

interface TopAuthorsProps {
  data: AuthorData[];
  isLoading?: boolean;
}

export function TopAuthors({ data, isLoading = false }: TopAuthorsProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Tác giả tiêu biểu</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-10 h-10 bg-muted/50 rounded-full animate-pulse" />
                <div className="flex-1">
                  <div className="h-4 bg-muted/50 rounded animate-pulse mb-1" />
                  <div className="h-3 bg-muted/50 rounded animate-pulse w-20" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Tác giả tiêu biểu</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-32 flex items-center justify-center text-muted-foreground">
            Không có dữ liệu
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tác giả tiêu biểu</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {data.map((author, index) => {
            const displayName = author.full_name || author.username;

            return (
              <Link
                key={author.id}
                href={`/dashboard/users-manager`}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors group"
              >
                {/* Rank */}
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 ${
                    index === 0
                      ? "bg-yellow-100 text-yellow-700"
                      : index === 1
                      ? "bg-gray-100 text-gray-700"
                      : index === 2
                      ? "bg-orange-100 text-orange-700"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {index + 1}
                </div>

                {/* Avatar */}
                <Avatar
                  src={author.avatar}
                  alt={displayName}
                  fallback={displayName.charAt(0).toUpperCase()}
                  className="w-10 h-10"
                />

                {/* Author info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate group-hover:text-orange-500 transition-colors">
                    {displayName}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    @{author.username}
                  </p>
                </div>

                {/* Post count */}
                <div className="text-right">
                  <p className="text-sm font-semibold text-foreground">
                    {author.count}
                  </p>
                  <p className="text-xs text-muted-foreground">bài viết</p>
                </div>
              </Link>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

export default TopAuthors;
