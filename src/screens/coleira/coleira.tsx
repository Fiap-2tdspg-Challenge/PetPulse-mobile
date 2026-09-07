import React from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { cores } from '../../theme/cores';
import { Footer } from '../../components/Footer';
import { Sparkline } from '../../components/Sparkline';
import { useAuth } from '../../context/AuthContext';
import { usePets } from '../../hooks/usePets';
import { COLEIRA_API_URL } from '../../services/coleiraApi';
import { useColeiraLive } from '../../hooks/useColeiraLive';
import { PetResponse } from '../../types/types';
import { EstadoColeira } from '../../types/coleiraLivre';

const ESTADO_CONFIG: Record<
  EstadoColeira,
  { label: string; cor: string; corFundo: string; icone: keyof typeof Ionicons.glyphMap }
> = {
  OK: { label: 'NORMAL', cor: cores.sucesso, corFundo: '#ECFDF5', icone: 'checkmark-circle' },
  ALERTA: { label: 'ALERTA', cor: cores.aviso, corFundo: '#FFFBEB', icone: 'warning' },
  CRITICO: { label: 'CRÍTICO', cor: cores.erro, corFundo: '#FEF2F2', icone: 'alert-circle' },
};

function tempParaPct(t: number): number {
  return Math.min(100, Math.max(0, ((t - 36) / 5) * 100));
}

function tempCor(t: number): string {
  if (t >= 40.5) return cores.erro;
  if (t >= 39.5) return '#FF7700';
  if (t >= 39.2) return cores.aviso;
  if (t < 37.0) return cores.azulClaro;
  return cores.sucesso;
}

function scoreCor(s: number): string {
  if (s >= 80) return cores.sucesso;
  if (s >= 60) return '#7EE787';
  if (s >= 40) return cores.aviso;
  if (s >= 20) return '#FF9900';
  return cores.erro;
}

function scoreDesc(s: number): string {
  if (s >= 80) return 'Excelente';
  if (s >= 60) return 'Bom';
  if (s >= 40) return 'Atenção';
  if (s >= 20) return 'Ruim';
  return 'Crítico';
}

function capitalizar(texto: string): string {
  if (!texto) return texto;
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

function formatarUptime(segundos: number): string {
  const h = Math.floor(segundos / 3600);
  const m = Math.floor((segundos % 3600) / 60);
  const s = Math.floor(segundos % 60);
  if (h > 0) return `${h}h ${m}min`;
  if (m > 0) return `${m}min ${s}s`;
  return `${s}s`;
}

function formatarHora(data: Date): string {
  return data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

const VitalCard = ({
  icone,
  label,
  valor,
  unidade,
  destaque,
  corDestaque,
  filho,
}: {
  icone: keyof typeof Ionicons.glyphMap;
  label: string;
  valor: string;
  unidade?: string;
  destaque?: boolean;
  corDestaque?: string;
  filho?: React.ReactNode;
}) => (
  <View style={[styles.card, destaque && { borderColor: corDestaque, borderWidth: 1.5 }]}>
    <View style={styles.cardLabelRow}>
      <Ionicons name={icone} size={14} color={cores.roxoMedio} />
      <Text style={styles.cardLabel}>{label}</Text>
    </View>
    <Text style={styles.cardValor}>{valor}</Text>
    {unidade ? <Text style={styles.cardUnidade}>{unidade}</Text> : null}
    {filho}
  </View>
);

export const Coleira = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { usuario } = useAuth();
  const petParam = (route.params as { pet: PetResponse } | undefined)?.pet;
  const { data: pets, isLoading: carregandoPets } = usePets(!petParam ? usuario?.id : undefined);
  const pet = petParam ?? pets?.[0] ?? null;
  const carregandoPet = !petParam && carregandoPets;

  const { dados, historico, carregando, atualizando, erro, atualizadoEm, recarregar } = useColeiraLive();

  const estadoCfg = ESTADO_CONFIG[dados?.estado ?? 'OK'];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={cores.roxoPrimario} />

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color={cores.branco} />
        </TouchableOpacity>
        <Text style={styles.headerTitulo}>Coleira Inteligente</Text>
        <TouchableOpacity style={styles.headerBtn} onPress={recarregar}>
          <Ionicons name="refresh" size={20} color={cores.branco} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
        refreshControl={<RefreshControl refreshing={atualizando} onRefresh={recarregar} tintColor={cores.roxoMedio} />}
      >
        {/* PET + STATUS */}
        <View style={styles.topo}>
          <View style={styles.petAvatar}>
            <Ionicons name="paw" size={22} color={cores.branco} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.petNome}>
              {carregandoPet ? 'Carregando…' : pet?.name ?? 'Pet não encontrado'}
            </Text>
            <Text style={styles.petSub}>
              {dados ? `Dispositivo ${dados.idDispositivo}` : `Buscando em ${COLEIRA_API_URL}…`}
            </Text>
          </View>
          {dados && (
            <View style={[styles.badge, { backgroundColor: estadoCfg.cor }]}>
              <Ionicons name={estadoCfg.icone} size={13} color={cores.branco} />
              <Text style={styles.badgeTexto}>{estadoCfg.label}</Text>
            </View>
          )}
        </View>

        {/* ESTADO DE CARREGAMENTO / ERRO */}
        {carregando && !dados && (
          <View style={styles.centrado}>
            <ActivityIndicator size="large" color={cores.roxoMedio} />
            <Text style={styles.carregandoTexto}>Conectando à coleira…</Text>
          </View>
        )}

        {erro && !dados && (
          <View style={styles.erroBox}>
            <Ionicons name="cloud-offline-outline" size={32} color={cores.erro} />
            <Text style={styles.erroTitulo}>Não foi possível conectar</Text>
            <Text style={styles.erroTexto}>{erro}</Text>
            <TouchableOpacity style={styles.tentarNovamenteBtn} onPress={recarregar}>
              <Text style={styles.tentarNovamenteTexto}>Tentar novamente</Text>
            </TouchableOpacity>
          </View>
        )}

        {erro && dados && (
          <View style={styles.avisoReconexao}>
            <Ionicons name="warning-outline" size={16} color={cores.aviso} />
            <Text style={styles.avisoReconexaoTexto} numberOfLines={2}>
              Última leitura antes de perder a conexão. {erro}
            </Text>
          </View>
        )}

        {dados && (
          <>
            {/* ALERTA CLÍNICO */}
            <View
              style={[
                styles.alertaBox,
                dados.alerta ? { backgroundColor: estadoCfg.corFundo, borderColor: estadoCfg.cor } : null,
              ]}
            >
              {dados.alerta ? (
                <>
                  <Ionicons name="warning" size={18} color={estadoCfg.cor} />
                  <Text style={[styles.alertaTexto, { color: estadoCfg.cor }]}>{dados.alerta}</Text>
                </>
              ) : (
                <Text style={styles.alertaTextoVazio}>Nenhum alerta no momento.</Text>
              )}
            </View>

            {/* CARDS DE VITAIS */}
            <View style={styles.grid}>
              <VitalCard icone="heart" label="Freq. cardíaca" valor={String(dados.frequenciaCardiaca)} unidade="bpm" />
              <VitalCard
                icone="water"
                label="Pressão"
                valor={`${dados.pressaoSistolica}/${dados.pressaoDiastolica}`}
                unidade="mmHg"
              />
              <VitalCard
                icone="walk"
                label="Atividade"
                valor={`${dados.nivelAtividade}%`}
                unidade={capitalizar(dados.descAtividade)}
              />
              <VitalCard icone="speedometer" label="Aceleração" valor={dados.aceleracaoTotal.toFixed(2)} unidade="m/s²" />
              <VitalCard
                icone="thermometer"
                label="Temperatura"
                valor={`${dados.temperatura.toFixed(1)}°C`}
                filho={
                  <View style={styles.barraFundo}>
                    <View
                      style={[
                        styles.barraPreenchida,
                        { width: `${tempParaPct(dados.temperatura)}%`, backgroundColor: tempCor(dados.temperatura) },
                      ]}
                    />
                  </View>
                }
              />
              <VitalCard
                icone="pulse"
                label="Score de saúde"
                valor={String(dados.score)}
                unidade={scoreDesc(dados.score)}
                destaque
                corDestaque={scoreCor(dados.score)}
              />
            </View>

            {/* HISTÓRICO / TENDÊNCIA */}
            {historico.length > 1 && (
              <View style={styles.historicoCard}>
                <Text style={styles.historicoTitulo}>Tendência — últimas {historico.length} leituras</Text>

                <View style={styles.historicoLinha}>
                  <View style={styles.historicoLegenda}>
                    <View style={[styles.legendaDot, { backgroundColor: cores.azulPrimario }]} />
                    <Text style={styles.legendaTexto}>BPM</Text>
                  </View>
                  <Sparkline data={historico.map((h) => h.frequenciaCardiaca)} color={cores.azulPrimario} />
                </View>

                <View style={styles.historicoLinha}>
                  <View style={styles.historicoLegenda}>
                    <View style={[styles.legendaDot, { backgroundColor: cores.roxoMedio }]} />
                    <Text style={styles.legendaTexto}>Pressão</Text>
                  </View>
                  <Sparkline data={historico.map((h) => h.pressaoSistolica)} color={cores.roxoMedio} />
                </View>

                <View style={styles.historicoLinha}>
                  <View style={styles.historicoLegenda}>
                    <View style={[styles.legendaDot, { backgroundColor: '#FF7700' }]} />
                    <Text style={styles.legendaTexto}>Temp.</Text>
                  </View>
                  <Sparkline data={historico.map((h) => h.temperatura)} color="#FF7700" />
                </View>
              </View>
            )}

            {/* RODAPÉ DE STATUS */}
            <View style={styles.statusRodape}>
              <View style={styles.statusPonto} />
              <Text style={styles.statusTexto}>
                Atualiza a cada 3s · Uptime: {formatarUptime(dados.uptime)}
                {atualizadoEm ? ` · Última leitura: ${formatarHora(atualizadoEm)}` : ''}
              </Text>
            </View>
          </>
        )}
      </ScrollView>

      <Footer />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: cores.cinzaClaro },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: cores.roxoPrimario,
    paddingHorizontal: 12,
    paddingVertical: 14,
  },
  headerBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitulo: { fontSize: 17, fontWeight: '700', color: cores.branco },

  scroll: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 16 },

  topo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: cores.roxoMedio,
    borderRadius: 16,
    padding: 14,
  },
  petAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  petNome: { fontSize: 16, fontWeight: '700', color: cores.branco },
  petSub: { fontSize: 12, color: 'rgba(255,255,255,0.75)', marginTop: 2 },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  badgeTexto: { fontSize: 11, fontWeight: '800', color: cores.branco, letterSpacing: 0.5 },

  centrado: { alignItems: 'center', justifyContent: 'center', paddingVertical: 48, gap: 12 },
  carregandoTexto: { fontSize: 13, color: cores.cinzaMedio },

  erroBox: {
    marginTop: 16,
    backgroundColor: cores.branco,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    gap: 6,
  },
  erroTitulo: { fontSize: 15, fontWeight: '700', color: cores.cinzaEscuro, marginTop: 4 },
  erroTexto: { fontSize: 12, color: cores.cinzaMedio, textAlign: 'center', lineHeight: 18 },
  tentarNovamenteBtn: {
    marginTop: 10,
    backgroundColor: cores.roxoMedio,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
  },
  tentarNovamenteTexto: { color: cores.branco, fontWeight: '700', fontSize: 13 },

  avisoReconexao: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFFBEB',
    borderRadius: 12,
    padding: 10,
  },
  avisoReconexaoTexto: { flex: 1, fontSize: 11, color: '#92610A' },

  alertaBox: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: cores.branco,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: cores.cinzaClaro,
    padding: 12,
  },
  alertaTexto: { flex: 1, fontSize: 13, fontWeight: '700' },
  alertaTextoVazio: { flex: 1, fontSize: 13, color: cores.cinzaMedio },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  card: {
    width: '48%',
    backgroundColor: cores.branco,
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
  },
  cardLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 },
  cardLabel: { fontSize: 11, fontWeight: '600', color: cores.cinzaMedio, textTransform: 'uppercase' },
  cardValor: { fontSize: 22, fontWeight: '800', color: cores.preto },
  cardUnidade: { fontSize: 11, color: cores.cinzaMedio, marginTop: 2 },

  barraFundo: {
    marginTop: 8,
    height: 6,
    borderRadius: 3,
    backgroundColor: cores.cinzaClaro,
    overflow: 'hidden',
  },
  barraPreenchida: { height: '100%', borderRadius: 3 },

  historicoCard: {
    marginTop: 4,
    backgroundColor: cores.branco,
    borderRadius: 16,
    padding: 16,
    gap: 14,
  },
  historicoTitulo: { fontSize: 13, fontWeight: '700', color: cores.cinzaEscuro, marginBottom: 2 },
  historicoLinha: { gap: 6 },
  historicoLegenda: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendaDot: { width: 8, height: 8, borderRadius: 4 },
  legendaTexto: { fontSize: 11, color: cores.cinzaMedio, fontWeight: '600' },

  statusRodape: {
    marginTop: 16,
    marginBottom: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  statusPonto: { width: 6, height: 6, borderRadius: 3, backgroundColor: cores.sucesso },
  statusTexto: { fontSize: 11, color: cores.cinzaMedio },
});
