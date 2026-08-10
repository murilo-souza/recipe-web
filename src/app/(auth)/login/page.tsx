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

        <GoogleLoginButton />

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