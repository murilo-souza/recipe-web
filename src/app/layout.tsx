import type { Metadata } from 'next';
import { Inter } from 'next/font/google'; // Substitua caso esteja usando outra fonte
import './globals.css';
import { Toaster } from '@/components/ui/toast';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Receitas de Família',
  description: 'Salve receitas criadas pela sua família em um banco de dados e nunca as perca.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} min-h-screen bg-zinc-900 text-zinc-50 antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
