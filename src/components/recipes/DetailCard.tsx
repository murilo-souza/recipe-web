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
    <div className={`rounded-2xl bg-zinc-800/50 border border-zinc-700/40 p-6 space-y-4 
                     hover:border-zinc-600/50 transition-colors duration-300 animate-fade-in-up ${delay}`}>
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-zinc-700/50 flex items-center justify-center">
          {icon}
        </div>
        <span className="text-white text-sm font-semibold">{label}</span>
        {count != null && (
          <span className="text-xs text-zinc-500 bg-zinc-700/40 px-2 py-0.5 rounded-full ml-auto">
            {count} {count === 1 ? 'item' : 'itens'}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}