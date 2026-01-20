import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export function FeatureCard({ icon: Icon, title, description }: FeatureCardProps) {
  return (
    <div className="group flex flex-col items-center p-6 bg-white dark:bg-zinc-900 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 border border-zinc-200 dark:border-zinc-800">
      <div className="w-16 h-16 flex items-center justify-center bg-blue-50 dark:bg-zinc-800 rounded-full group-hover:bg-blue-500 dark:group-hover:bg-blue-600 transition-colors duration-300 mb-4">
        <Icon className="h-8 w-8 text-blue-600 dark:text-blue-400 group-hover:text-white transition-colors duration-300" />
      </div>
      <h3 className="text-xl font-semibold text-zinc-900 dark:text-white mb-2 text-center">
        {title}
      </h3>
      <p className="text-sm text-zinc-600 dark:text-zinc-400 text-center leading-relaxed">
        {description}
      </p>
    </div>
  );
}
