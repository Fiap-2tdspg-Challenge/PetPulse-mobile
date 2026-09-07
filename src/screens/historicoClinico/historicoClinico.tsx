import React, { useEffect, useMemo, useRef, useState } from "react"
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation, useRoute } from "@react-navigation/native"
import { cores } from "../../theme/cores"
import { useAuth } from "../../context/AuthContext"
import { usePets } from "../../hooks/usePets"
import { useDeleteHistorico, useHistorico } from "../../hooks/useHistorico"
import { PetResponse, ClinicalHistoryResponse, ApiRecordType } from "../../types/types"
import { Footer } from "../../components/Footer"

const CATEGORIAS: Array<{
    tipo: ApiRecordType
    label: string
    icone: string
    cor: string
    corFundo: string
}> = [
    { tipo: "VACINA",     label: "Vacinas",      icone: "fitness",       cor: "#2563EB", corFundo: "#EFF6FF" },
    { tipo: "CONSULTA",   label: "Consultas",    icone: "calendar",      cor: cores.verde, corFundo: "#ECFEFF" },
    { tipo: "EXAME",      label: "Exames",       icone: "document-text", cor: cores.roxoMedio, corFundo: cores.roxoFundo },
    { tipo: "MEDICAMENTO",label: "Medicamentos", icone: "medkit",        cor: "#EA580C", corFundo: "#FFF7ED" },
    { tipo: "DOENCA",     label: "Doenças",      icone: "bandage",       cor: cores.erro, corFundo: "#FEF2F2" },
    { tipo: "OBSERVACAO", label: "Observações",  icone: "ellipsis-horizontal-circle", cor: cores.cinzaEscuro, corFundo: cores.cinzaClaro },
]

function calcularIdade(dtNascimento: string): string {
    const nasc = new Date(dtNascimento)
    const hoje = new Date()
    const mesesTotal =
        (hoje.getFullYear() - nasc.getFullYear()) * 12 +
        hoje.getMonth() - nasc.getMonth() +
        (hoje.getDate() < nasc.getDate() ? -1 : 0)
    if (mesesTotal < 12) return `${mesesTotal} ${mesesTotal === 1 ? "mês" : "meses"}`
    const a = Math.floor(mesesTotal / 12)
    return `${a} ${a === 1 ? "ano" : "anos"}`
}

function formatarData(iso: string): string {
    const [ano, mes, dia] = iso.split("-")
    return `${dia}/${mes}/${ano}`
}

type Categoria = typeof CATEGORIAS[number]

export const HistoricoClinico = () => {
    const navigation = useNavigation()
    const route = useRoute()
    const { usuario } = useAuth()
    const categoriaInicial = (route.params as { categoriaInicial?: ApiRecordType } | undefined)?.categoriaInicial
    const categoriaInicialAbertaRef = useRef(false)

    const { data: pets = [], isLoading: carregandoPets } = usePets(usuario?.id)
    const [petSelecionado, setPetSelecionado] = useState<PetResponse | null>(null)
    const [categoriaAberta, setCategoriaAberta] = useState<Categoria | null>(null)

    useEffect(() => {
        if (pets.length > 0 && !petSelecionado) {
            setPetSelecionado(pets[0])
        }
    }, [pets, petSelecionado])

    useEffect(() => {
        if (petSelecionado && categoriaInicial && !categoriaInicialAbertaRef.current) {
            categoriaInicialAbertaRef.current = true
            const cat = CATEGORIAS.find((c) => c.tipo === categoriaInicial)
            if (cat) setCategoriaAberta(cat)
        }
    }, [petSelecionado])

    const { data: historicoPet = [], isLoading: carregandoHistorico } = useHistorico(
        petSelecionado?.id,
        { enabled: !!categoriaAberta }
    )

    const registros = useMemo(() => {
        if (!categoriaAberta) return []
        return historicoPet
            .filter((r) => r.recordType === categoriaAberta.tipo)
            .sort((a, b) => new Date(b.recordDate).getTime() - new Date(a.recordDate).getTime())
    }, [historicoPet, categoriaAberta])

    const carregando = categoriaAberta ? carregandoHistorico : carregandoPets

    const excluirHistorico = useDeleteHistorico()

    const abrirCategoria = (cat: Categoria) => {
        if (!petSelecionado) return
        setCategoriaAberta(cat)
    }

    const voltarMenu = () => {
        setCategoriaAberta(null)
    }

    const irParaNovoRegistro = () => {
        if (!petSelecionado || !categoriaAberta) return
        navigation.navigate("CadastraHistorico" as never, {
            petId: petSelecionado.id,
            tipoRegistro: categoriaAberta.tipo,
        } as never)
    }

    const irParaEditarRegistro = (item: ClinicalHistoryResponse) => {
        if (!petSelecionado || !categoriaAberta) return
        navigation.navigate("CadastraHistorico" as never, {
            petId: petSelecionado.id,
            tipoRegistro: categoriaAberta.tipo,
            historico: item,
        } as never)
    }

    const handleExcluirRegistro = (id: number) => {
        Alert.alert(
            "Excluir registro",
            "Tem certeza que deseja excluir este registro do histórico? Essa ação não pode ser desfeita.",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Excluir",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await excluirHistorico.mutateAsync(id)
                        } catch {
                            Alert.alert("Erro", "Não foi possível excluir o registro. Tente novamente.")
                        }
                    },
                },
            ]
        )
    }

    /* ── TELA DE DETALHE ── */
    if (categoriaAberta) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <StatusBar barStyle="light-content" backgroundColor={cores.roxoPrimario} />

                <View style={styles.header}>
                    <TouchableOpacity style={styles.voltarBtn} onPress={voltarMenu}>
                        <Ionicons name="arrow-back" size={22} color={cores.branco} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitulo}>{categoriaAberta.label}</Text>
                    <TouchableOpacity style={styles.voltarBtn} onPress={irParaNovoRegistro}>
                        <Ionicons name="add" size={22} color={cores.branco} />
                    </TouchableOpacity>
                </View>

                {/* card do pet no topo */}
                {petSelecionado && (
                    <View style={styles.petCardDetalhe}>
                        <View style={styles.petAvatarDetalhe}>
                            <Ionicons name="paw" size={20} color={cores.branco} />
                        </View>
                        <View>
                            <Text style={styles.petCardNome}>{petSelecionado.name}</Text>
                            <Text style={styles.petCardSub}>
                                {petSelecionado.speciesName} · {calcularIdade(petSelecionado.birthDate)}
                            </Text>
                        </View>
                    </View>
                )}

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollDetalhe}>
                    <Text style={styles.secaoTitulo}>{categoriaAberta.label} Aplicadas</Text>

                    {carregando ? (
                        <View style={styles.centrado}>
                            <ActivityIndicator size="large" color={cores.roxoMedio} />
                        </View>
                    ) : registros.length === 0 ? (
                        <View style={styles.centrado}>
                            <Ionicons name="document-text-outline" size={44} color={cores.cinzaMedio} />
                            <Text style={styles.semRegistros}>Nenhum registro encontrado.</Text>
                        </View>
                    ) : (
                        registros.map((item, idx) => (
                            <TouchableOpacity
                                key={item.id}
                                style={[styles.itemRow, idx < registros.length - 1 && styles.itemRowBorder]}
                                activeOpacity={0.7}
                                onPress={() => irParaEditarRegistro(item)}
                            >
                                <View style={styles.itemBody}>
                                    <Text style={styles.itemDescricao}>{item.description}</Text>
                                    {item.professionalName ? (
                                        <Text style={styles.itemProfissional}>{item.professionalName}</Text>
                                    ) : null}
                                    {item.returnDate && (
                                        <View style={styles.retornoRow}>
                                            <Ionicons name="calendar-outline" size={12} color={cores.verde} />
                                            <Text style={styles.retornoText}>
                                                Retorno: {formatarData(item.returnDate)}
                                            </Text>
                                        </View>
                                    )}
                                    {item.observations && (
                                        <Text style={styles.itemObs}>{item.observations}</Text>
                                    )}
                                </View>
                                <View style={styles.itemDireita}>
                                    <TouchableOpacity
                                        onPress={() => handleExcluirRegistro(item.id)}
                                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                                    >
                                        <Ionicons name="trash-outline" size={16} color={cores.erro} />
                                    </TouchableOpacity>
                                    <Text style={styles.itemData}>{formatarData(item.recordDate)}</Text>
                                    <Ionicons name="chevron-forward" size={16} color={cores.cinzaMedio} />
                                </View>
                            </TouchableOpacity>
                        ))
                    )}
                </ScrollView>

                <Footer />
            </SafeAreaView>
        )
    }

    /* ── TELA DE MENU ── */
    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" backgroundColor={cores.branco} />

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollMenu}>
                <Text style={styles.menuTitulo}>Histórico</Text>

                {/* CARD DO PET */}
                <Text style={styles.secaoLabel}>Seu pet</Text>

                {carregando ? (
                    <View style={styles.centrado}>
                        <ActivityIndicator size="large" color={cores.roxoMedio} />
                    </View>
                ) : petSelecionado ? (
                    <>
                        {/* se tiver múltiplos pets, mostra seletor */}
                        {pets.length > 1 && (
                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={styles.petTabsContent}
                                style={{ marginBottom: 8 }}
                            >
                                {pets.map((p) => {
                                    const ativo = petSelecionado.id === p.id
                                    return (
                                        <TouchableOpacity
                                            key={p.id}
                                            style={[styles.petTab, ativo && styles.petTabAtivo]}
                                            onPress={() => setPetSelecionado(p)}
                                            activeOpacity={0.7}
                                        >
                                            <Text style={[styles.petTabText, ativo && styles.petTabTextAtivo]}>
                                                {p.name}
                                            </Text>
                                        </TouchableOpacity>
                                    )
                                })}
                            </ScrollView>
                        )}

                        <TouchableOpacity
                            style={styles.petCard}
                            activeOpacity={0.85}
                            onPress={() => navigation.navigate("MeuPet" as never)}
                        >
                            <View style={styles.petAvatar}>
                                <Ionicons name="paw" size={22} color={cores.branco} />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.petNome}>{petSelecionado.name}</Text>
                                <Text style={styles.petSub}>
                                    {petSelecionado.breedName} · {calcularIdade(petSelecionado.birthDate)}
                                </Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color={cores.branco} />
                        </TouchableOpacity>
                    </>
                ) : (
                    <TouchableOpacity
                        style={styles.petCardVazio}
                        onPress={() => navigation.navigate("CadastraPet" as never)}
                        activeOpacity={0.8}
                    >
                        <Ionicons name="add-circle-outline" size={24} color={cores.roxoMedio} />
                        <Text style={styles.petCardVazioText}>Cadastrar pet</Text>
                    </TouchableOpacity>
                )}

                {/* CATEGORIAS */}
                {petSelecionado && (
                    <>
                        <Text style={[styles.secaoLabel, { marginTop: 24 }]}>Veja os dados que deseja</Text>
                        <View style={styles.categoriasCard}>
                            {CATEGORIAS.map((cat, idx) => (
                                <TouchableOpacity
                                    key={cat.tipo}
                                    style={[
                                        styles.categoriaRow,
                                        idx < CATEGORIAS.length - 1 && styles.categoriaRowBorder,
                                    ]}
                                    onPress={() => abrirCategoria(cat)}
                                    activeOpacity={0.7}
                                >
                                    <View style={[styles.categoriaIcone, { backgroundColor: cat.corFundo }]}>
                                        <Ionicons name={cat.icone as any} size={20} color={cat.cor} />
                                    </View>
                                    <Text style={styles.categoriaLabel}>{cat.label}</Text>
                                    <Ionicons name="chevron-forward" size={18} color={cores.cinzaMedio} />
                                </TouchableOpacity>
                            ))}
                        </View>
                    </>
                )}
            </ScrollView>

            <Footer />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: cores.cinzaClaro },

    /* ── MENU ── */
    scrollMenu: { paddingHorizontal: 16, paddingBottom: 16 },
    menuTitulo: {
        fontSize: 26,
        fontWeight: "800",
        color: cores.preto,
        marginTop: 20,
        marginBottom: 16,
    },
    secaoLabel: {
        fontSize: 13,
        fontWeight: "600",
        color: cores.cinzaMedio,
        textTransform: "uppercase",
        letterSpacing: 0.5,
        marginBottom: 8,
    },

    // pet card menu
    petCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: cores.roxoMedio,
        borderRadius: 16,
        padding: 16,
        gap: 12,
    },
    petAvatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: "rgba(255,255,255,0.2)",
        alignItems: "center",
        justifyContent: "center",
    },
    petNome: { fontSize: 16, fontWeight: "700", color: cores.branco },
    petSub: { fontSize: 13, color: "rgba(255,255,255,0.75)", marginTop: 2 },
    petCardVazio: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        backgroundColor: cores.branco,
        borderRadius: 16,
        padding: 20,
        borderWidth: 1.5,
        borderColor: cores.roxoClaro,
        borderStyle: "dashed",
    },
    petCardVazioText: { fontSize: 15, color: cores.roxoMedio, fontWeight: "600" },

    // pet tabs (múltiplos pets)
    petTabsContent: { gap: 8, paddingVertical: 4 },
    petTab: {
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: cores.roxoClaro,
        backgroundColor: cores.branco,
    },
    petTabAtivo: { backgroundColor: cores.roxoMedio, borderColor: cores.roxoMedio },
    petTabText: { fontSize: 13, color: cores.roxoMedio, fontWeight: "500" },
    petTabTextAtivo: { color: cores.branco },

    // categorias
    categoriasCard: {
        backgroundColor: cores.branco,
        borderRadius: 16,
        overflow: "hidden",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
        elevation: 2,
    },
    categoriaRow: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 14,
        gap: 14,
    },
    categoriaRowBorder: { borderBottomWidth: 1, borderBottomColor: cores.cinzaClaro },
    categoriaIcone: {
        width: 40,
        height: 40,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
    },
    categoriaLabel: { flex: 1, fontSize: 15, fontWeight: "500", color: cores.cinzaEscuro },

    /* ── DETALHE ── */
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: cores.roxoPrimario,
        paddingHorizontal: 16,
        paddingVertical: 14,
    },
    voltarBtn: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: "rgba(255,255,255,0.15)",
        alignItems: "center",
        justifyContent: "center",
    },
    headerTitulo: { fontSize: 18, fontWeight: "700", color: cores.branco },

    petCardDetalhe: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: cores.roxoMedio,
        paddingHorizontal: 16,
        paddingVertical: 12,
        gap: 12,
    },
    petAvatarDetalhe: {
        width: 38,
        height: 38,
        borderRadius: 19,
        backgroundColor: "rgba(255,255,255,0.2)",
        alignItems: "center",
        justifyContent: "center",
    },
    petCardNome: { fontSize: 15, fontWeight: "700", color: cores.branco },
    petCardSub: { fontSize: 12, color: "rgba(255,255,255,0.75)" },

    scrollDetalhe: { paddingHorizontal: 16, paddingBottom: 16, paddingTop: 8 },
    secaoTitulo: {
        fontSize: 16,
        fontWeight: "700",
        color: cores.cinzaEscuro,
        marginTop: 12,
        marginBottom: 8,
    },

    // itens de detalhe
    itemRow: {
        flexDirection: "row",
        alignItems: "flex-start",
        backgroundColor: cores.branco,
        paddingHorizontal: 16,
        paddingVertical: 14,
    },
    itemRowBorder: { borderBottomWidth: 1, borderBottomColor: cores.cinzaClaro },
    itemBody: { flex: 1 },
    itemDescricao: { fontSize: 14, fontWeight: "600", color: cores.cinzaEscuro },
    itemProfissional: { fontSize: 12, color: cores.cinzaMedio, marginTop: 2 },
    retornoRow: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 4 },
    retornoText: { fontSize: 12, color: cores.verde, fontWeight: "500" },
    itemObs: {
        fontSize: 12,
        color: cores.cinzaEscuro,
        fontStyle: "italic",
        marginTop: 4,
    },
    itemDireita: { alignItems: "flex-end", gap: 6, marginLeft: 8 },
    itemData: { fontSize: 12, color: cores.cinzaMedio },

    centrado: { alignItems: "center", justifyContent: "center", paddingVertical: 60 },
    semRegistros: { fontSize: 15, color: cores.cinzaMedio, marginTop: 12 },
})