import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ColeiraApiError, getLeituraColeira } from '../services/coleiraApi';
import { LeituraColeira } from '../types/coleiraLivre';

const INTERVALO_MS = 3000; // mesmo intervalo de atualização do dashboard embarcado no ESP32
const MAX_PONTOS = 20; // mesma janela do gráfico embarcado (MAX_PONTOS em PetPulse-Iot.ino)

export interface ColeiraLiveState {
  dados: LeituraColeira | null;
  historico: LeituraColeira[];
  carregando: boolean;
  atualizando: boolean;
  erro: string | null;
  atualizadoEm: Date | null;
  recarregar: () => void;
}

/**
 * Faz polling em GET /api/dados da coleira a cada 3s (mesmo ritmo do
 * dashboard HTML servido pelo próprio ESP32) via TanStack Query, e mantém
 * uma janela das últimas leituras para alimentar os mini-gráficos da tela.
 */
export function useColeiraLive(): ColeiraLiveState {
  const query = useQuery({
    queryKey: ['coleira', 'leitura'],
    queryFn: ({ signal }) => getLeituraColeira(signal),
    // Só reagenda o próximo poll automático enquanto a coleira está
    // respondendo (status "success") — assim que a conexão falha, para de
    // tentar sozinho em loop, ficando só a tentativa automática inicial (e
    // qualquer nova depois disso é manual, via recarregar()). Enquanto
    // conectada, continua o "ao vivo" normalmente a cada 3s.
    refetchInterval: (query) => (query.state.status === 'error' ? false : INTERVALO_MS),
    refetchIntervalInBackground: true,
    // Sem retry interno: se a tentativa falhar, cai direto no estado de
    // erro (ver refetchInterval acima) em vez de insistir no mesmo ciclo.
    retry: false,
  });

  const [historico, setHistorico] = useState<LeituraColeira[]>([]);

  useEffect(() => {
    if (!query.data) return;
    setHistorico((atual) => [...atual, query.data].slice(-MAX_PONTOS));
  }, [query.data]);

  const erro = query.error
    ? query.error instanceof ColeiraApiError
      ? query.error.message
      : 'Erro inesperado ao buscar dados da coleira.'
    : null;

  return {
    dados: query.data ?? null,
    historico,
    carregando: query.isLoading,
    atualizando: query.isFetching,
    erro,
    atualizadoEm: query.dataUpdatedAt ? new Date(query.dataUpdatedAt) : null,
    recarregar: () => {
      void query.refetch();
    },
  };
}
