interface RankLevel {
  rank: string;
  label: string;
  color: string;
}

const rankLevels: RankLevel[] = [
  { rank: "0", label: "Khách", color: "bg-zinc-200 dark:bg-zinc-700" },
  { rank: "1-2", label: "Thành viên", color: "bg-zinc-300 dark:bg-zinc-600" },
  { rank: "3-4", label: "Moderator", color: "bg-blue-200 dark:bg-blue-800" },
  { rank: "5", label: "Admin", color: "bg-blue-600 dark:bg-blue-400 text-white dark:text-zinc-900" },
];

export function RankSystem() {
  return (
    <div className="p-6 bg-zinc-50 dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800">
      <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4 text-center">
        Hệ thống Rank & Phân Quyền
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {rankLevels.map((level) => (
          <div
            key={level.rank}
            className="flex flex-col items-center p-4 bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 hover:border-blue-400 dark:hover:border-blue-500 transition-all duration-300"
          >
            <span
              className={`w-12 h-12 flex items-center justify-center ${level.color} rounded-lg text-zinc-900 dark:text-white font-bold text-lg mb-2 transition-colors duration-300`}
            >
              {level.rank}
            </span>
            <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              {level.label}
            </span>
          </div>
        ))}
      </div>
      <p className="text-xs text-zinc-500 dark:text-zinc-400 text-center mt-4">
        Phân quyền linh hoạt theo rank cho từng người dùng
      </p>
    </div>
  );
}
