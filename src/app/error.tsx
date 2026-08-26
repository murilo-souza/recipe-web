'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AlertTriangle, ArrowLeft, RefreshCw } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="noise-overlay relative flex min-h-screen items-center justify-center overflow-hidden bg-zinc-900 px-5">
      {/* Background decorative elements */}
      <div className="pointer-events-none absolute inset-0">
        <div className="animate-pulse-soft absolute -top-40 -left-40 h-125 w-125 rounded-full bg-red-600/10 blur-3xl" />
        <div className="animate-pulse-soft absolute -right-40 -bottom-40 h-125 w-125 rounded-full bg-orange-600/8 blur-3xl delay-700" />
      </div>

      <div className="animate-fade-in-up relative z-10 w-full max-w-md">
        {/* Card */}
        <div className="glass-strong flex flex-col items-center rounded-3xl border-red-500/20 p-10 text-center">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl border border-red-500/30 bg-gradient-to-br from-red-500/20 to-orange-500/20 shadow-xl shadow-red-500/10">
            <AlertTriangle className="h-10 w-10 text-red-400" />
          </div>

          <h1 className="mb-2 text-2xl font-bold text-white">Algo deu errado!</h1>
          <p className="mb-8 text-sm text-zinc-400">
            Ocorreu um erro inesperado na aplicação. Nossa equipe foi notificada.
          </p>

          <div className="flex w-full flex-col gap-3">
            <Link href="/" className="w-full">
              <Button className="flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all duration-300 hover:scale-[1.01] hover:from-indigo-400 hover:to-purple-500 hover:shadow-indigo-500/40 active:scale-[0.99]">
                <ArrowLeft className="h-4 w-4" />
                Voltar para a Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
