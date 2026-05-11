import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { cores } from '../../theme/cores';

type RootStack = { Home: undefined; Login: undefined };

const acoesRapidas = [
  { id: '1', label: 'Vacinas',    icone: 'medical'                    as const },
  { id: '2', label: 'Medicações', icone: 'fitness'                    as const },
  { id: '3', label: 'Exames',     icone: 'document-text'              as const },
  { id: '4', label: 'Mais',       icone: 'ellipsis-horizontal-circle' as const },
];

export const Home = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStack>>();

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
          <Text style={styles.saudacao}>Olá, User! </Text>
          <View style={styles.headerAcoes}>
            <TouchableOpacity>
              <Ionicons name="notifications-outline" size={26} color={cores.cinzaEscuro} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.replace('Login')} style={styles.logoutBtn}>
              <Ionicons name="log-out-outline" size={24} color={cores.roxoMedio} />
            </TouchableOpacity>
          </View>
        </View>

        {/* SEU PET */}
        <View style={styles.secao}>
          <View style={styles.cardPet}>
            <View style={styles.cardPetTopo}>
              <Text style={styles.cardPetTitulo}>Seu pet</Text>
              <TouchableOpacity>
                <Text style={styles.adicionarPet}>adicionar pet</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.petItem} activeOpacity={0.7}>
              <View style={styles.petAvatar}>
                <Ionicons name="paw" size={22} color={cores.branco} />
              </View>
              <View style={styles.petInfo}>
                <Text style={styles.petNome}>Beluga</Text>
                <Text style={styles.petRaca}>Golden Retriever · 3 anos</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={cores.branco} />
            </TouchableOpacity>
          </View>
        </View>

        {/* PRÓXIMO LEMBRETE */}
        <View style={styles.secao}>
          <Text style={styles.secaoTitulo}>Próximo lembrete</Text>
          <View style={styles.cardLembrete}>
            <View style={styles.lembreteInfo}>
              <Text style={styles.lembreteNome}>Vacina VB</Text>
              <Text style={styles.lembreteData}>20/05/2025</Text>
              <Text style={styles.lembreteFaltam}>Faltam 5 dias</Text>
            </View>
            <TouchableOpacity style={styles.lembreteSino}>
              <Ionicons name="notifications" size={24} color={cores.roxoMedio} />
            </TouchableOpacity>
          </View>
        </View>

        {/* AÇÕES RÁPIDAS */}
        <View style={[styles.secao, styles.ultimaSecao]}>
          <Text style={styles.secaoTitulo}>Ações rápidas</Text>
          <View style={styles.acoesGrid}>
            {acoesRapidas.map((acao) => (
              <TouchableOpacity key={acao.id} style={styles.acaoItem} activeOpacity={0.8}>
                <View style={styles.acaoIconeWrap}>
                  <Ionicons name={acao.icone} size={26} color={cores.roxoMedio} />
                </View>
                <Text style={styles.acaoLabel}>{acao.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: cores.branco,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 8,
  },
  headerAcoes: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  logoutBtn: {
    padding: 2,
  },
  saudacao: {
    fontSize: 24,
    fontWeight: '800',
    color: cores.preto,
  },
  secao: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  ultimaSecao: {
    marginBottom: 8,
  },
  secaoTitulo: {
    fontSize: 16,
    fontWeight: '700',
    color: cores.cinzaEscuro,
    marginBottom: 12,
  },
  cardPet: {
    backgroundColor: cores.roxoMedio,
    borderRadius: 16,
    padding: 16,
  },
  cardPetTopo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardPetTitulo: {
    fontSize: 14,
    fontWeight: '700',
    color: cores.branco,
  },
  adicionarPet: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '500',
  },
  petItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  petAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  petInfo: {
    flex: 1,
  },
  petNome: {
    fontSize: 15,
    fontWeight: '700',
    color: cores.branco,
  },
  petRaca: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.75)',
    marginTop: 2,
  },
  cardLembrete: {
    backgroundColor: cores.roxoFundo,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  lembreteInfo: {
    gap: 4,
  },
  lembreteNome: {
    fontSize: 16,
    fontWeight: '800',
    color: cores.preto,
  },
  lembreteData: {
    fontSize: 14,
    color: cores.cinzaEscuro,
  },
  lembreteFaltam: {
    fontSize: 12,
    color: cores.roxoMedio,
    fontWeight: '600',
  },
  lembreteSino: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: cores.branco,
    alignItems: 'center',
    justifyContent: 'center',
  },
  acoesGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  acaoItem: {
    alignItems: 'center',
    width: '22%',
    gap: 6,
  },
  acaoIconeWrap: {
    width: 58,
    height: 58,
    borderRadius: 16,
    backgroundColor: cores.roxoFundo,
    alignItems: 'center',
    justifyContent: 'center',
  },
  acaoLabel: {
    fontSize: 11,
    color: cores.cinzaEscuro,
    fontWeight: '600',
    textAlign: 'center',
  },
});
