export interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
}

export function Card({ children, className = '', title }: CardProps) {
  return (
    <div className={`bg-white dark:bg-zinc-900 rounded-lg shadow-lg ${className}`}>
      {title && (
        <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
            {title}
          </h2>
        </div>
      )}
      <div className={title ? 'p-6' : ''}>
        {children}
      </div>
    </div>
  );
}
