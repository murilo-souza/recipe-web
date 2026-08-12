import { ChefHat } from 'lucide-react';

export default function Loading() {
  return (
    <div className="min-h-screen bg-zinc-900 relative noise-overlay flex items-center justify-center">
      {/* Background decorative elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-500/8 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -left-32 w-80 h-80 bg-purple-500/6 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-6 animate-fade-in">
        {/* Pulsing logo */}
        <div className="relative">
          <div className="absolute inset-0 bg-indigo-500/20 rounded-2xl blur-xl animate-pulse-soft scale-150" />
          <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center 
                          shadow-xl shadow-indigo-500/25 animate-float">
            <ChefHat className="w-8 h-8 text-white" />
          </div>
        </div>

        {/* Loading dots */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-zinc-400 font-medium">Carregando receita</span>
          <span className="flex gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '300ms' }} />
          </span>
        </div>
      </div>
    </div>
  );
}