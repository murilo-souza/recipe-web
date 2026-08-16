'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChefHat, Mail, ArrowRight, Loader2, KeyRound, ArrowLeft } from 'lucide-react';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    setLoading(false);
    setSent(true);
  }

  function handleContinue() {
    router.push(`/verify-reset-code?email=${encodeURIComponent(email)}`);
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
            <KeyRound className="h-8 w-8 text-white" />
          </div>
          <h1 className="mb-1 text-2xl font-bold text-white">Esqueci minha senha</h1>
          <p className="text-center text-sm text-zinc-400">
            {sent
              ? 'Verifique sua caixa de entrada'
              : 'Enviaremos um código para redefinir sua senha'}
          </p>
        </div>

        {/* Card */}
        <div className="glass-strong animate-fade-in-up rounded-2xl p-7 delay-200">
          {sent ? (
            <div className="flex flex-col gap-6">
              <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/10 p-4 text-center">
                <p className="text-sm text-indigo-200">
                  Se existir uma conta com o e-mail informado, enviamos um código de verificação
                  para ele.
                </p>
              </div>
              <Button
                onClick={handleContinue}
                className="flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-linear-to-r from-indigo-500 to-purple-600 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all duration-300 hover:scale-[1.01] hover:from-indigo-400 hover:to-purple-500 hover:shadow-indigo-500/40 active:scale-[0.99]"
              >
                Já tenho o código
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-zinc-300">E-mail</label>
                <div className="relative">
                  <Mail className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                  <Input
                    placeholder="seu@email.com"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-12 rounded-xl border border-zinc-700/50 bg-zinc-800/60 pl-10 text-white transition-all duration-300 placeholder:text-zinc-500 focus-visible:border-indigo-500/50 focus-visible:ring-2 focus-visible:ring-indigo-500/50"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="mt-1 flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-linear-to-r from-indigo-500 to-purple-600 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all duration-300 hover:scale-[1.01] hover:from-indigo-400 hover:to-purple-500 hover:shadow-indigo-500/40 active:scale-[0.99] disabled:opacity-60 disabled:hover:scale-100 disabled:hover:shadow-indigo-500/25"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    Enviar código
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          )}
        </div>

        <Link
          href="/login"
          className="animate-fade-in mt-8 flex cursor-pointer items-center justify-center gap-2 text-sm font-medium text-zinc-500 transition-colors delay-500 duration-200 hover:text-indigo-400"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para o login
        </Link>
      </div>
    </div>
  );
}
