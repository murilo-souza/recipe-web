export function DetailCard({
  icon,
  label,
  count,
  delay = '',
  children,
}: {
  icon: React.ReactNode;
  label: string;
  count?: number;
  delay?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`animate-fade-in-up space-y-4 rounded-2xl border border-zinc-700/40 bg-zinc-800/50 p-6 transition-colors duration-300 hover:border-zinc-600/50 ${delay}`}
    >
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-700/50">
          {icon}
        </div>
        <span className="text-sm font-semibold text-white">{label}</span>
        {count != null && (
          <span className="ml-auto rounded-full bg-zinc-700/40 px-2 py-0.5 text-xs text-zinc-500">
            {count} {count === 1 ? 'item' : 'itens'}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}
