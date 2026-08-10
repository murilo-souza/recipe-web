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

// 1. Schema de validação avançado com verificação de senhas iguais
const registerSchema = z.object({
  name: z.string().min(2, { message: 'O nome deve ter pelo menos 2 caracteres.' }),
  email: z.string().email({ message: 'Digite um e-mail válido.' }),
  password: z.string().min(6, { message: 'A senha deve ter no mínimo 6 caracteres.' }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'As senhas não coincidem.',
  path: ['confirmPassword'], // O erro vai aparecer embaixo do campo de confirmar senha
});

type RegisterFormValues = z.infer<typeof registerSchema>;

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
    // Removido o bg-zinc-900 e min-h-screen daqui, pois já estão no layout.tsx
    <div className="flex flex-col items-center justify-center pt-12 pb-12 px-4">
      
      <div className="w-full max-w-[400px] flex flex-col items-center">
        
        {/* Placeholder - Mesma proporção do login */}
        <div className="w-40 h-52 bg-indigo-500 rounded-md relative flex items-center justify-center mb-10 shadow-lg">
          <div className="absolute left-4 top-4 bottom-4 w-1 bg-indigo-600 opacity-50 rounded-full" />
          <div className="absolute right-6 top-6 left-8 h-1 bg-indigo-600 opacity-50 rounded-full" />
          <span className="text-white font-medium text-sm text-center px-2">
            Ilustração
          </span>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-full flex flex-col gap-5">
            
            {/* Campo Nome */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-1 space-y-0">
                  <FormLabel className="text-white text-base font-normal">
                    Nome
                  </FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Digite seu nome" 
                      type="text"
                      className="bg-white border-0 text-zinc-900 placeholder:text-zinc-400 h-12 rounded-md focus-visible:ring-2 focus-visible:ring-indigo-500"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 text-sm" />
                </FormItem>
              )}
            />

            {/* Campo E-mail */}
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

            {/* Campo Senha */}
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

            {/* Campo Confirmar Senha */}
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-1 space-y-0">
                  <FormLabel className="text-white text-base font-normal">
                    Confirmar senha
                  </FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Confirme sua senha" 
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
              {loading ? 'Cadastrando...' : 'Cadastrar'}
            </Button>
            
          </form>
        </Form>

        <p className="mt-8 text-sm text-zinc-400">
          Já tem uma conta?{' '}
          <Link href="/login" className="text-indigo-400 hover:text-indigo-300 hover:underline font-medium">
            Entrar
          </Link>
        </p>

      </div>
    </div>
  );
}