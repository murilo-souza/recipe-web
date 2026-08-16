'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MailCheck, ArrowRight, Loader2, AlertCircle, ArrowLeft } from 'lucide-react';

function VerifyResetCodeForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') ?? '';

  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await fetch('/api/auth/verify-reset-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, code }),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? 'Código inválido.');
      return;
    }

    const data: { resetToken: string } = await res.json();

    // guarda o resetToken em sessionStorage — só sobrevive nessa aba, some ao fechar,
    // e é curto o suficiente (5 min de validade no backend) pra não ser um risco
    sessionStorage.setItem('resetToken', data.resetToken);

    router.push('/reset-password');
  }

  return (
    <div className="noise-overlay relative flex min-h-screen items-center justify-center overflow-hidden bg-zinc-900">
      {/* Background decorative elements */}
      <div className="pointer-events-none absolute inset-0">
        <div className="animate-pulse-soft absolute -top-40 -left-40 h-125 w-125 rounded-full bg-indigo-600/10 blur-3xl" />
        <div className="animate-pulse-soft absolute -right-40 -bottom-40 h-125 w-125 rounded-full bg-purple-600/8 blur-3xl delay-700" />
        <div className="absolute top-1/2 left-1/2 h-75 w-75 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-500/5 blur-3xl" />
      </div>

      <div className="animate-fade-in-up relative z-10 w-full max-w-105 px-5">
        {/* Header */}
        <div className="mb-10 flex flex-col items-center">
          <div className="animate-float mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-indigo-500 to-purple-600 shadow-xl shadow-indigo-500/25">
            <MailCheck className="h-8 w-8 text-white" />
          </div>
          <h1 className="mb-1 text-2xl font-bold text-white">Verifique seu e-mail</h1>
          <p className="text-center text-sm text-zinc-400">
            Enviamos um código de 6 dígitos para{' '}
            <span className="font-medium text-zinc-300">{email}</span>
          </p>
        </div>

        {/* Card */}
        <div className="glass-strong animate-fade-in-up rounded-2xl p-7 delay-200">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-zinc-300">Código de segurança</label>
              <Input
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="000000"
                maxLength={6}
                required
                className="h-16 rounded-xl border border-zinc-700/50 bg-zinc-800/60 text-center text-3xl tracking-[0.5em] text-white transition-all duration-300 placeholder:text-zinc-600 focus-visible:border-indigo-500/50 focus-visible:ring-2 focus-visible:ring-indigo-500/50"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-red-400">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              disabled={loading || code.length !== 6}
              className="mt-1 flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-linear-to-r from-indigo-500 to-purple-600 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all duration-300 hover:scale-[1.01] hover:from-indigo-400 hover:to-purple-500 hover:shadow-indigo-500/40 active:scale-[0.99] disabled:opacity-60 disabled:hover:scale-100 disabled:hover:shadow-indigo-500/25"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Verificando...
                </>
              ) : (
                <>
                  Verificar código
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>
        </div>

        <Link
          href="/forgot-password"
          className="animate-fade-in mt-8 flex cursor-pointer items-center justify-center gap-2 text-sm font-medium text-zinc-500 transition-colors delay-500 duration-200 hover:text-indigo-400"
        >
          <ArrowLeft className="h-4 w-4" />
          Tentar outro e-mail
        </Link>
      </div>
    </div>
  );
}

export default function VerifyResetCodePage() {
  return (
    <Suspense fallback={null}>
      <VerifyResetCodeForm />
    </Suspense>
  );
}
