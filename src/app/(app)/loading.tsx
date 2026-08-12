import { ChefHat } from 'lucide-react';

export default function Loading() {
  return (
    <div className="noise-overlay relative flex min-h-screen items-center justify-center bg-zinc-900">
      {/* Background decorative elements */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-indigo-500/8 blur-3xl" />
        <div className="absolute bottom-1/4 -left-32 h-80 w-80 rounded-full bg-purple-500/6 blur-3xl" />
      </div>

      <div className="animate-fade-in relative z-10 flex flex-col items-center gap-6">
        {/* Pulsing logo */}
        <div className="relative">
          <div className="animate-pulse-soft absolute inset-0 scale-150 rounded-2xl bg-indigo-500/20 blur-xl" />
          <div className="animate-float relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-xl shadow-indigo-500/25">
            <ChefHat className="h-8 w-8 text-white" />
          </div>
        </div>

        {/* Loading dots */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-zinc-400">Carregando receita</span>
          <span className="flex gap-1">
            <span
              className="h-1.5 w-1.5 animate-bounce rounded-full bg-indigo-400"
              style={{ animationDelay: '0ms' }}
            />
            <span
              className="h-1.5 w-1.5 animate-bounce rounded-full bg-indigo-400"
              style={{ animationDelay: '150ms' }}
            />
            <span
              className="h-1.5 w-1.5 animate-bounce rounded-full bg-indigo-400"
              style={{ animationDelay: '300ms' }}
            />
          </span>
        </div>
      </div>
    </div>
  );
}
