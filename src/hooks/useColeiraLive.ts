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
    refetchInterval: INTERVALO_MS,
    refetchIntervalInBackground: true,
    // A coleira pode estar offline; melhor reportar o erro no próximo poll
    // de 3s do que ficar tentando de novo dentro do mesmo ciclo.
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
