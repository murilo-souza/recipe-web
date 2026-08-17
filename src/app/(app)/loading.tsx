import { LoadingState } from '@/components/ui/loading-state';
import { ChefHat } from 'lucide-react';

export default function Loading() {
  return <LoadingState message="Carregando receitas" />;
}
