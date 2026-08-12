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
import { toast } from '@/components/ui/toast';
import { useRouter } from 'next/navigation';
import { RegisterFormValues, registerSchema } from '@/lib/validations/register';
import { ChefHat, User, Mail, Lock, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';


export default function RegisterPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  async function onSubmit(data: RegisterFormValues) {
    setLoading(true);
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: data.name, email: data.email, password: data.password }),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      toast.add({
        description: data.error ?? 'Erro ao fazer o registro.',
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
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-3xl animate-pulse-soft" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-indigo-600/8 rounded-full blur-3xl animate-pulse-soft delay-700" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-violet-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-[420px] px-5 py-10 animate-fade-in-up">
        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center 
                          shadow-xl shadow-purple-500/25 mb-5 animate-float">
            <ChefHat className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">Crie sua conta</h1>
          <p className="text-zinc-400 text-sm text-center">Comece a salvar as receitas da sua família</p>
        </div>

        {/* Card */}
        <div className="glass-strong rounded-2xl p-7 animate-fade-in-up delay-200">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5">
              
              {/* Campo Nome */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-1.5 space-y-0">
                    <FormLabel className="text-zinc-300 text-sm font-medium">
                      Nome
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                        <Input 
                          placeholder="Seu nome" 
                          type="text"
                          className="bg-zinc-800/60 border border-zinc-700/50 text-white placeholder:text-zinc-500 h-12 rounded-xl pl-10
                                     focus-visible:ring-2 focus-visible:ring-purple-500/50 focus-visible:border-purple-500/50 transition-all duration-300"
                          {...field} 
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-400 text-sm" />
                  </FormItem>
                )}
              />

              {/* Campo E-mail */}
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
                                     focus-visible:ring-2 focus-visible:ring-purple-500/50 focus-visible:border-purple-500/50 transition-all duration-300"
                          {...field} 
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-400 text-sm" />
                  </FormItem>
                )}
              />

              {/* Campo Senha */}
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
                                     focus-visible:ring-2 focus-visible:ring-purple-500/50 focus-visible:border-purple-500/50 transition-all duration-300"
                          {...field} 
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-400 text-sm" />
                  </FormItem>
                )}
              />

              {/* Campo Confirmar Senha */}
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-1.5 space-y-0">
                    <FormLabel className="text-zinc-300 text-sm font-medium">
                      Confirmar senha
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <ShieldCheck className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                        <Input 
                          placeholder="••••••••" 
                          type="password"
                          className="bg-zinc-800/60 border border-zinc-700/50 text-white placeholder:text-zinc-500 h-12 rounded-xl pl-10
                                     focus-visible:ring-2 focus-visible:ring-purple-500/50 focus-visible:border-purple-500/50 transition-all duration-300"
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
                className="w-full h-12 mt-1 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 
                           text-white text-sm font-semibold rounded-xl transition-all duration-300 cursor-pointer
                           shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-[1.01] active:scale-[0.99]
                           disabled:opacity-60 disabled:hover:scale-100 disabled:hover:shadow-purple-500/25
                           flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Criando conta...
                  </>
                ) : (
                  <>
                    Criar conta
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
              
            </form>
          </Form>
        </div>

        {/* Footer link */}
        <p className="mt-8 text-sm text-zinc-500 text-center animate-fade-in delay-500">
          Já tem uma conta?{' '}
          <Link href="/login" className="text-purple-400 hover:text-purple-300 font-medium transition-colors duration-200 cursor-pointer">
            Entrar
          </Link>
        </p>
      </div>
    </div>
  );
}