'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useRouter } from 'next/navigation';
import { toast } from '@/components/ui/toast';
import { GoogleLoginButton } from '../components/GoogleLoginButton';
import { LoginFormValues, loginSchema } from '@/lib/validations/login';
import { ChefHat, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(data: LoginFormValues) {
    setLoading(true);
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: data.email, password: data.password }),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));

      toast.add({
        description: data.error ?? 'Erro ao fazer login.',
        type: 'error',
        priority: 'high',
      });
      return;
    }

    router.push('/');
    router.refresh();
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
        {/* Logo */}
        <div className="mb-10 flex flex-col items-center">
          <div className="animate-float mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-indigo-500 to-purple-600 shadow-xl shadow-indigo-500/25">
            <ChefHat className="h-8 w-8 text-white" />
          </div>
          <h1 className="mb-1 text-2xl font-bold text-white">Bem-vindo de volta</h1>
          <p className="text-sm text-zinc-400">Entre na sua conta para acessar suas receitas</p>
        </div>

        {/* Card */}
        <div className="glass-strong animate-fade-in-up rounded-2xl p-7 delay-200">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-1.5 space-y-0">
                    <FormLabel className="text-sm font-medium text-zinc-300">E-mail</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                        <Input
                          placeholder="seu@email.com"
                          type="email"
                          className="h-12 rounded-xl border border-zinc-700/50 bg-zinc-800/60 pl-10 text-white transition-all duration-300 placeholder:text-zinc-500 focus-visible:border-indigo-500/50 focus-visible:ring-2 focus-visible:ring-indigo-500/50"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-sm text-red-400" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-1.5 space-y-0">
                    <FormLabel className="text-sm font-medium text-zinc-300">Senha</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                        <Input
                          placeholder="••••••••"
                          type="password"
                          className="h-12 rounded-xl border border-zinc-700/50 bg-zinc-800/60 pl-10 text-white transition-all duration-300 placeholder:text-zinc-500 focus-visible:border-indigo-500/50 focus-visible:ring-2 focus-visible:ring-indigo-500/50"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-sm text-red-400" />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={loading}
                className="mt-1 flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-linear-to-r from-indigo-500 to-purple-600 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all duration-300 hover:scale-[1.01] hover:from-indigo-400 hover:to-purple-500 hover:shadow-indigo-500/40 active:scale-[0.99] disabled:opacity-60 disabled:hover:scale-100 disabled:hover:shadow-indigo-500/25"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Entrando...
                  </>
                ) : (
                  <>
                    Entrar
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          </Form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-zinc-700/60" />
            <span className="text-xs font-medium tracking-wider text-zinc-500 uppercase">ou</span>
            <div className="h-px flex-1 bg-zinc-700/60" />
          </div>

          <GoogleLoginButton />
        </div>

        {/* Footer link */}
        <p className="animate-fade-in mt-8 text-center text-sm text-zinc-500 delay-500">
          Não tem uma conta?{' '}
          <Link
            href="/register"
            className="cursor-pointer font-medium text-indigo-400 transition-colors duration-200 hover:text-indigo-300"
          >
            Criar conta
          </Link>
        </p>
      </div>
    </div>
  );
}
