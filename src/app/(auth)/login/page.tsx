'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? 'Erro ao fazer login.');
      return;
    }

    router.push('/');
    router.refresh(); 
  }

  return (
    // Substituí o style inline por: max-w-[360px] mx-auto mt-20
    <div className="max-w-[360px] mx-auto mt-20 p-6 border border-gray-200 rounded-lg shadow-sm">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Entrar</h1>
      
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-600">Email</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required  
            // Borda cinza por padrão, fica âmbar ao clicar (focus)
            className="border-2 border-gray-300 rounded-md p-2 outline-none focus:border-amber-600 transition-colors"
          />
        </div>
        
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-600">Senha</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
            className="border-2 border-gray-300 rounded-md p-2 outline-none focus:border-amber-600 transition-colors"
          />
        </div>
        
        {error && <p className="text-red-500 text-sm">{error}</p>}
        
        <button 
          type="submit" 
          disabled={loading}
          // Sem borda no botão, mas com background âmbar
          className="bg-amber-600 text-white font-medium py-2 rounded-md hover:bg-amber-700 disabled:opacity-50 transition-colors mt-2"
        >
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
        
      </form>
    </div>
  );
}