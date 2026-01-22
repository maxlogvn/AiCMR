"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface QuickNavLink {
  label: string;
  href: string;
  icon: ReactNode;
  description?: string;
}

interface QuickNavigationProps {
  links: QuickNavLink[];
  title?: string;
}

export default function QuickNavigation({
  links,
  title = "Truy Cập Nhanh",
}: QuickNavigationProps) {
  return (
    <div className="mb-8">
      {title && (
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">
          {title}
        </h2>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="group relative overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-300 hover:shadow-md"
          >
            {/* Background gradient on hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <div className="relative p-4 flex flex-col">
              {/* Icon and Label */}
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex-1">
                  <h3 className="font-semibold text-zinc-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {link.label}
                  </h3>
                </div>
                <div className="text-zinc-600 dark:text-zinc-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors flex-shrink-0">
                  {link.icon}
                </div>
              </div>

              {/* Description */}
              {link.description && (
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-3">
                  {link.description}
                </p>
              )}

              {/* Arrow indicator */}
              <div className="flex items-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400 group-hover:gap-3 transition-all">
                <span>Truy cập</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
