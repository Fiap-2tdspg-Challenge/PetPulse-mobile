import { useCallback, useEffect, useRef, useState } from 'react';
import { ColeiraApiError, getLeituraColeira } from '../services/coleiraApi';
import { LeituraColeira } from '../types/coleiraLive';

const INTERVALO_MS = 3000; // mesmo intervalo de atualização do dashboard embarcado no ESP32
const MAX_PONTOS = 20; // mesma janela do gráfico embarcado (MAX_PONTOS em PetPulse-Iot.ino)

export interface ColeiraLiveState {
  dados: LeituraColeira | null;
  historico: LeituraColeira[];
  carregando: boolean;
  erro: string | null;
  atualizadoEm: Date | null;
  recarregar: () => void;
}

/**
 * Faz polling em GET /api/dados da coleira a cada 3s (mesmo ritmo do
 * dashboard HTML servido pelo próprio ESP32) e mantém uma janela das
 * últimas leituras para alimentar os mini-gráficos da tela.
 */
export function useColeiraLive(): ColeiraLiveState {
  const [dados, setDados] = useState<LeituraColeira | null>(null);
  const [historico, setHistorico] = useState<LeituraColeira[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [atualizadoEm, setAtualizadoEm] = useState<Date | null>(null);
  const montadoRef = useRef(true);

  const buscar = useCallback(async () => {
    try {
      const leitura = await getLeituraColeira();
      if (!montadoRef.current) return;
      setDados(leitura);
      setHistorico((atual) => [...atual, leitura].slice(-MAX_PONTOS));
      setErro(null);
      setAtualizadoEm(new Date());
    } catch (e) {
      if (!montadoRef.current) return;
      setErro(e instanceof ColeiraApiError ? e.message : 'Erro inesperado ao buscar dados da coleira.');
    } finally {
      if (montadoRef.current) setCarregando(false);
    }
  }, []);

  useEffect(() => {
    montadoRef.current = true;
    buscar();
    const id = setInterval(buscar, INTERVALO_MS);
    return () => {
      montadoRef.current = false;
      clearInterval(id);
    };
  }, [buscar]);

  return { dados, historico, carregando, erro, atualizadoEm, recarregar: buscar };
}
