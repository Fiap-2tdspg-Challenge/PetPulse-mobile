import React, { useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useQueryClient } from '@tanstack/react-query';
import { cores } from '../../theme/cores';
import { useAuth } from '../../context/AuthContext';
import { usePets } from '../../hooks/usePets';
import { useAlertasPendentes } from '../../hooks/useAlertas';
import { useHistoricosDeVariosPets } from '../../hooks/useHistorico';
import { calcularProximoRetorno } from '../../utils/lembretes';
import { Footer } from '../../components/Footer';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

const NIVEL_CONFIG: Record<string, { cor: string; corFundo: string; icone: string }> = {
  BAIXO: { cor: cores.sucesso, corFundo: '#ECFDF5', icone: 'information-circle' },
  MEDIO: { cor: '#F59E0B',     corFundo: '#FFFBEB', icone: 'warning'            },
  ALTO:  { cor: cores.erro,    corFundo: '#FEF2F2', icone: 'alert-circle'       },
};

const ACOES = [
  { id: '1', label: 'Vacinas',    icone: 'medical'       as const, rota: 'HistoricoClinico', params: { categoriaInicial: 'VACINA'     } },
  { id: '2', label: 'Medicações', icone: 'medkit'        as const, rota: 'HistoricoClinico', params: { categoriaInicial: 'MEDICAMENTO' } },
  { id: '3', label: 'Exames',     icone: 'document-text' as const, rota: 'HistoricoClinico', params: { categoriaInicial: 'EXAME'      } },
  { id: '4', label: 'Localizar',  icone: 'location'      as const, rota: 'LocalizaPet',      params: undefined                          },
];

function formatarData(iso: string): string {
  const [ano, mes, dia] = iso.split('-');
  return `${dia}/${mes}/${ano}`;
}

function diasAte(iso: string): number {
  const hoje = new Date(); hoje.setHours(0, 0, 0, 0);
  const alvo = new Date(iso); alvo.setHours(0, 0, 0, 0);
  return Math.ceil((alvo.getTime() - hoje.getTime()) / 86400000);
}

function textoFaltam(dias: number): string {
  if (dias === 0) return 'Hoje!';
  if (dias === 1) return 'Amanhã';
  if (dias < 0) return `Venceu há ${Math.abs(dias)} ${Math.abs(dias) === 1 ? 'dia' : 'dias'}`;
  return `Faltam ${dias} dias`;
}

export const Home = () => {
  const navigation = useNavigation();
  const { usuario, logout } = useAuth();
  const queryClient = useQueryClient();

  const { data: pets = [] } = usePets(usuario?.tutorId);
  const idsPets = useMemo(() => pets.map((p) => p.idPet), [pets]);
  const { data: alertas = [] } = useAlertasPendentes(idsPets);
  const { data: historicos } = useHistoricosDeVariosPets(idsPets);
  const lembrete = useMemo(() => calcularProximoRetorno(historicos, pets), [historicos, pets]);

  useFocusEffect(
    useCallback(() => {
      if (!usuario) return;
      queryClient.invalidateQueries({ queryKey: ['pets', usuario.tutorId] });
      queryClient.invalidateQueries({ queryKey: ['alertas'] });
      queryClient.invalidateQueries({ queryKey: ['historico'] });
    }, [usuario, queryClient])
  );

  const primeiroNome = usuario?.nome.split(' ')[0] ?? 'Usuário';

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={cores.branco} />
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.saudacao}>Olá, {primeiroNome}!</Text>
          <View style={styles.headerAcoes}>
            <View>
              <Ionicons name="notifications-outline" size={26} color={cores.cinzaEscuro} />
              {alertas.length > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{alertas.length > 9 ? '9+' : alertas.length}</Text>
                </View>
              )}
            </View>
            <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
              <Ionicons name="log-out-outline" size={24} color={cores.roxoMedio} />
            </TouchableOpacity>
          </View>
        </View>

        {/* SEUS PETS */}
        <View style={styles.secao}>
          <View style={styles.cardPet}>
            <View style={styles.cardPetTopo}>
              <Text style={styles.cardPetTitulo}>Seus pets</Text>
              <TouchableOpacity onPress={() => navigation.navigate('CadastraPet' as never)}>
                <Text style={styles.adicionarPet}>+ adicionar pet</Text>
              </TouchableOpacity>
            </View>
            {pets.length === 0 ? (
              <Text style={styles.semPets}>Nenhum pet cadastrado ainda.</Text>
            ) : (
              pets.map((pet) => {
                const anoNasc = new Date(pet.dtNascimento).getFullYear();
                const idade = new Date().getFullYear() - anoNasc;
                return (
                  <TouchableOpacity
                    key={pet.idPet}
                    style={styles.petItem}
                    activeOpacity={0.7}
                    onPress={() => (navigation as any).navigate('MeuPet', { pet })}
                  >
                    <View style={styles.petAvatar}>
                      <Ionicons name="paw" size={22} color={cores.branco} />
                    </View>
                    <View style={styles.petInfo}>
                      <Text style={styles.petNome}>{pet.nome}</Text>
                      <Text style={styles.petRaca}>{pet.raca} · {idade} {idade === 1 ? 'ano' : 'anos'}</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color={cores.branco} />
                  </TouchableOpacity>
                );
              })
            )}
          </View>
        </View>

        {/* PRÓXIMO RETORNO */}
        {lembrete && (
          <View style={styles.secao}>
            <Text style={styles.secaoTitulo}>Próximo retorno</Text>
            <View style={styles.cardLembrete}>
              <View style={styles.lembreteSino}>
                <Ionicons name="notifications" size={22} color={cores.roxoMedio} />
              </View>
              <View style={styles.lembreteInfo}>
                <Text style={styles.lembreteNome}>{lembrete.descricao}</Text>
                {lembrete.petNome ? <Text style={styles.lembretePet}>{lembrete.petNome}</Text> : null}
                <Text style={styles.lembreteData}>{formatarData(lembrete.dtRetorno)}</Text>
              </View>
              <Text style={[
                styles.lembreteFaltam,
                diasAte(lembrete.dtRetorno) < 0 && { color: cores.erro },
              ]}>
                {textoFaltam(diasAte(lembrete.dtRetorno))}
              </Text>
            </View>
          </View>
        )}

        {/* NOTIFICAÇÕES */}
        {alertas.length > 0 && (
          <View style={styles.secao}>
            <Text style={styles.secaoTitulo}>Notificações</Text>
            {alertas.map((alerta) => {
              const cfg = NIVEL_CONFIG[alerta.nivelRisco];
              return (
                <View
                  key={alerta.idAlerta}
                  style={[styles.cardAlerta, { backgroundColor: cfg.corFundo, borderLeftColor: cfg.cor }]}
                >
                  <Ionicons name={cfg.icone as any} size={22} color={cfg.cor} style={{ marginRight: 10 }} />
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.alertaMensagem, { color: cfg.cor }]}>{alerta.mensagem}</Text>
                    <Text style={styles.alertaRecomendacao}>{alerta.recomendacao}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {/* AÇÕES RÁPIDAS */}
        <View style={[styles.secao, styles.ultimaSecao]}>
          <Text style={styles.secaoTitulo}>Ações rápidas</Text>
          <View style={styles.acoesGrid}>
            {ACOES.map((acao) => (
              <TouchableOpacity
                key={acao.id}
                style={styles.acaoItem}
                activeOpacity={0.8}
                onPress={() => (navigation as any).navigate(acao.rota, acao.params)}
              >
                <View style={styles.acaoIconeWrap}>
                  <Ionicons name={acao.icone} size={26} color={cores.roxoMedio} />
                </View>
                <Text style={styles.acaoLabel}>{acao.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
      <Footer />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea:      { flex: 1, backgroundColor: cores.branco },
  container:     { flex: 1 },
  scrollContent: { paddingBottom: 32 },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 8,
  },
  headerAcoes: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  logoutBtn:   { padding: 2 },
  saudacao:    { fontSize: 24, fontWeight: '800', color: cores.preto },

  badge: {
    position: 'absolute',
    top: -4, right: -4,
    minWidth: 16, height: 16,
    borderRadius: 8,
    backgroundColor: cores.erro,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeText: { fontSize: 9, color: cores.branco, fontWeight: '700' },

  secao:       { marginTop: 20, paddingHorizontal: 20 },
  ultimaSecao: { marginBottom: 8 },
  secaoTitulo: { fontSize: 16, fontWeight: '700', color: cores.cinzaEscuro, marginBottom: 12 },

  // pets
  cardPet:     { backgroundColor: cores.roxoMedio, borderRadius: 16, padding: 16 },
  cardPetTopo: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  cardPetTitulo: { fontSize: 14, fontWeight: '700', color: cores.branco },
  adicionarPet:  { fontSize: 12, color: 'rgba(255,255,255,0.8)', fontWeight: '500' },
  semPets:       { color: 'rgba(255,255,255,0.7)', fontSize: 13, textAlign: 'center', paddingVertical: 8 },
  petItem:    { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 4 },
  petAvatar:  { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.25)', alignItems: 'center', justifyContent: 'center' },
  petInfo:    { flex: 1 },
  petNome:    { fontSize: 15, fontWeight: '700', color: cores.branco },
  petRaca:    { fontSize: 12, color: 'rgba(255,255,255,0.75)', marginTop: 2 },

  // próximo retorno
  cardLembrete: {
    backgroundColor: cores.roxoFundo,
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  lembreteSino:  { width: 44, height: 44, borderRadius: 22, backgroundColor: cores.branco, alignItems: 'center', justifyContent: 'center' },
  lembreteInfo:  { flex: 1, gap: 2 },
  lembreteNome:  { fontSize: 14, fontWeight: '700', color: cores.preto },
  lembretePet:   { fontSize: 12, color: cores.cinzaMedio },
  lembreteData:  { fontSize: 12, color: cores.cinzaEscuro },
  lembreteFaltam: { fontSize: 12, color: cores.roxoMedio, fontWeight: '600', textAlign: 'right' },

  // notificações
  cardAlerta: {
    borderRadius: 12,
    borderLeftWidth: 4,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  alertaMensagem:    { fontSize: 13, fontWeight: '700', marginBottom: 2 },
  alertaRecomendacao:{ fontSize: 12, color: cores.cinzaEscuro },

  // ações rápidas
  acoesGrid:    { flexDirection: 'row', justifyContent: 'space-between' },
  acaoItem:     { alignItems: 'center', width: '22%', gap: 6 },
  acaoIconeWrap:{ width: 58, height: 58, borderRadius: 16, backgroundColor: cores.roxoFundo, alignItems: 'center', justifyContent: 'center' },
  acaoLabel:    { fontSize: 11, color: cores.cinzaEscuro, fontWeight: '600', textAlign: 'center' },
});

