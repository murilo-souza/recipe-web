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
    <div className="min-h-screen flex items-center justify-center bg-zinc-900 relative overflow-hidden noise-overlay">
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-3xl animate-pulse-soft" />
        <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-purple-600/8 rounded-full blur-3xl animate-pulse-soft delay-700" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-violet-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-[420px] px-5 animate-fade-in-up">
        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center 
                          shadow-xl shadow-indigo-500/25 mb-5 animate-float">
            <ChefHat className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">Bem-vindo de volta</h1>
          <p className="text-zinc-400 text-sm">Entre na sua conta para acessar suas receitas</p>
        </div>

        {/* Card */}
        <div className="glass-strong rounded-2xl p-7 animate-fade-in-up delay-200">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5">
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-1.5 space-y-0">
                    <FormLabel className="text-zinc-300 text-sm font-medium">
                      E-mail
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                        <Input 
                          placeholder="seu@email.com" 
                          type="email"
                          className="bg-zinc-800/60 border border-zinc-700/50 text-white placeholder:text-zinc-500 h-12 rounded-xl pl-10
                                     focus-visible:ring-2 focus-visible:ring-indigo-500/50 focus-visible:border-indigo-500/50 transition-all duration-300"
                          {...field} 
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-400 text-sm" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-1.5 space-y-0">
                    <FormLabel className="text-zinc-300 text-sm font-medium">
                      Senha
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                        <Input 
                          placeholder="••••••••" 
                          type="password"
                          className="bg-zinc-800/60 border border-zinc-700/50 text-white placeholder:text-zinc-500 h-12 rounded-xl pl-10
                                     focus-visible:ring-2 focus-visible:ring-indigo-500/50 focus-visible:border-indigo-500/50 transition-all duration-300"
                          {...field} 
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-400 text-sm" />
                  </FormItem>
                )}
              />

              <Button 
                type="submit" 
                disabled={loading}
                className="w-full h-12 mt-1 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 
                           text-white text-sm font-semibold rounded-xl transition-all duration-300 cursor-pointer
                           shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.01] active:scale-[0.99]
                           disabled:opacity-60 disabled:hover:scale-100 disabled:hover:shadow-indigo-500/25
                           flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Entrando...
                  </>
                ) : (
                  <>
                    Entrar
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
              
            </form>
          </Form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="h-px bg-zinc-700/60 flex-1" />
            <span className="text-zinc-500 text-xs font-medium uppercase tracking-wider">ou</span>
            <div className="h-px bg-zinc-700/60 flex-1" />
          </div>

          <GoogleLoginButton />
        </div>

        {/* Footer link */}
        <p className="mt-8 text-sm text-zinc-500 text-center animate-fade-in delay-500">
          Não tem uma conta?{' '}
          <Link href="/register" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors duration-200 cursor-pointer">
            Criar conta
          </Link>
        </p>
      </div>
    </div>
  );
}