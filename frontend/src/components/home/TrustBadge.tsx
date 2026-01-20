interface TrustBadgeProps {
  icon: LucideIcon;
  title: string;
  value: string;
}

import { LucideIcon } from "lucide-react";

export function TrustBadge({ icon: Icon, title, value }: TrustBadgeProps) {
  return (
    <div className="flex flex-col items-center p-4 bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300">
      <Icon className="h-10 w-10 text-blue-600 dark:text-blue-400 mb-3" />
      <h4 className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-1">
        {title}
      </h4>
      <p className="text-2xl font-bold text-zinc-900 dark:text-white">
        {value}
      </p>
    </div>
  );
}
