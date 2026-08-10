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

const loginSchema = z.object({
  email: z.string().email({ message: 'Digite um e-mail válido.' }),
  password: z.string().min(1, { message: 'A senha é obrigatória.' }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
    const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      setError(data.error ?? 'Erro ao fazer login.');
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

  async function handleGoogleLogin() {
    console.log('Iniciando login com Google...');
    // Lógica do NextAuth / Supabase / Firebase aqui
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-900 px-4">
      
      <div className="w-full max-w-[400px] flex flex-col items-center">
        
        <div className="w-40 h-52 bg-indigo-500 rounded-md relative flex items-center justify-center mb-10 shadow-lg">
          <div className="absolute left-4 top-4 bottom-4 w-1 bg-indigo-600 opacity-50 rounded-full" />
          <div className="absolute right-6 top-6 left-8 h-1 bg-indigo-600 opacity-50 rounded-full" />
          <span className="text-white font-medium text-sm text-center px-2">
            Ilustração
          </span>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-full flex flex-col gap-5">
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-1 space-y-0">
                  <FormLabel className="text-white text-base font-normal">
                    E-mail
                  </FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Digite seu e-mail" 
                      type="email"
                      className="bg-white border-0 text-zinc-900 placeholder:text-zinc-400 h-12 rounded-md focus-visible:ring-2 focus-visible:ring-indigo-500"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 text-sm" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-1 space-y-0">
                  <FormLabel className="text-white text-base font-normal">
                    Senha
                  </FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Digite sua senha" 
                      type="password"
                      className="bg-white border-0 text-zinc-900 placeholder:text-zinc-400 h-12 rounded-md focus-visible:ring-2 focus-visible:ring-indigo-500"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 text-sm" />
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              disabled={loading}
              className="w-full h-12 mt-2 bg-indigo-600 hover:bg-indigo-700 text-white text-base font-medium rounded-md transition-colors cursor-pointer"
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>
            
          </form>
        </Form>

        <div className="w-full flex items-center gap-4 my-6">
          <div className="h-px bg-zinc-700 flex-1" />
          <span className="text-zinc-400 text-sm">ou</span>
          <div className="h-px bg-zinc-700 flex-1" />
        </div>

        <Button 
          type="button"
          variant="outline"
          onClick={handleGoogleLogin}
          className="w-full h-12 bg-white hover:bg-zinc-100 text-zinc-900 border-0 text-base font-medium rounded-md transition-colors flex items-center justify-center gap-3 cursor-pointer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          Entrar com Google
        </Button>

        <p className="mt-8 text-sm text-zinc-400">
          Não tem uma conta?{' '}
          <Link href="/cadastro" className="text-indigo-400 hover:text-indigo-300 hover:underline font-medium cursor-pointer">
            Cadastrar
          </Link>
        </p>

      </div>
    </div>
  );
}