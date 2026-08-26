import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FileQuestion, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="noise-overlay relative flex min-h-screen items-center justify-center overflow-hidden bg-zinc-900 px-5">
      {/* Background decorative elements */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 -left-40 h-125 w-125 rounded-full bg-indigo-600/10 blur-3xl animate-pulse-soft" />
        <div className="absolute -right-40 -bottom-40 h-125 w-125 rounded-full bg-purple-600/8 blur-3xl animate-pulse-soft delay-700" />
        <div className="absolute top-1/2 left-1/2 h-75 w-75 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-500/5 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md animate-fade-in-up">
        {/* Card */}
        <div className="glass-strong flex flex-col items-center rounded-3xl p-10 text-center">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-600/20 border border-indigo-500/30 shadow-xl shadow-indigo-500/10">
            <FileQuestion className="h-10 w-10 text-indigo-400" />
          </div>
          
          <h1 className="mb-2 text-3xl font-bold text-white">404</h1>
          <h2 className="mb-4 text-xl font-semibold text-zinc-200">Página não encontrada</h2>
          <p className="mb-8 text-sm text-zinc-400">
            A página que você está procurando não existe ou foi movida.
          </p>

          <Link href="/" className="w-full">
            <Button className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all duration-300 hover:scale-[1.01] hover:from-indigo-400 hover:to-purple-500 hover:shadow-indigo-500/40 active:scale-[0.99] cursor-pointer">
              <ArrowLeft className="h-4 w-4" />
              Voltar para a Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
