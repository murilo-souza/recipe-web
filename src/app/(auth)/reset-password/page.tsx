'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ShieldCheck, Lock, ArrowRight, Loader2, AlertCircle } from 'lucide-react';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [resetToken, setResetToken] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = sessionStorage.getItem('resetToken');
    if (!token) {
      router.push('/forgot-password'); // sem token válido, não devia estar aqui
      return;
    }
    setResetToken(token);
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (newPassword !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    setLoading(true);

    const res = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resetToken, newPassword }),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? 'Não foi possível redefinir a senha.');
      return;
    }

    sessionStorage.removeItem('resetToken');
    router.push('/login');
  }

  if (!resetToken) return null; // evita flash de conteúdo antes do redirect

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
            <ShieldCheck className="h-8 w-8 text-white" />
          </div>
          <h1 className="mb-1 text-2xl font-bold text-white">Criar nova senha</h1>
          <p className="text-sm text-zinc-400 text-center">
            Sua nova senha deve ser diferente da senha anterior
          </p>
        </div>

        {/* Card */}
        <div className="glass-strong animate-fade-in-up rounded-2xl p-7 delay-200">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-zinc-300">Nova senha</label>
              <div className="relative">
                <Lock className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                <Input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="h-12 rounded-xl border border-zinc-700/50 bg-zinc-800/60 pl-10 text-white transition-all duration-300 placeholder:text-zinc-500 focus-visible:border-indigo-500/50 focus-visible:ring-2 focus-visible:ring-indigo-500/50"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-zinc-300">Confirmar nova senha</label>
              <div className="relative">
                <Lock className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="h-12 rounded-xl border border-zinc-700/50 bg-zinc-800/60 pl-10 text-white transition-all duration-300 placeholder:text-zinc-500 focus-visible:border-indigo-500/50 focus-visible:ring-2 focus-visible:ring-indigo-500/50"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-red-400">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="mt-1 flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-linear-to-r from-indigo-500 to-purple-600 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all duration-300 hover:scale-[1.01] hover:from-indigo-400 hover:to-purple-500 hover:shadow-indigo-500/40 active:scale-[0.99] disabled:opacity-60 disabled:hover:scale-100 disabled:hover:shadow-indigo-500/25"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  Redefinir senha
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
