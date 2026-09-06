import { useEffect, useRef, useState } from "react"
import {
    ActivityIndicator,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import * as Location from "expo-location"
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps"
import { Ionicons } from "@expo/vector-icons"
import { cores } from "../../theme/cores"
import { usePets } from "../../hooks/usePets"
import { useAuth } from "../../context/AuthContext"
import { Footer } from "../../components/Footer"

const GOOGLE_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_KEY ?? ""

export const LocalizaPet = () => {
    const { usuario } = useAuth()
    const { data: pets } = usePets(usuario?.tutorId)
    const pet = pets?.[0] ?? null
    const [location, setLocation] = useState<Location.LocationObject | null>(null)
    const [address, setAddress] = useState<string | null>(null)
    const [updatedAt, setUpdatedAt] = useState<Date | null>(null)
    const [loading, setLoading] = useState(true)
    const [errorMsg, setErrorMsg] = useState<string | null>(null)
    const mapRef = useRef<MapView>(null)
    const subscriptionRef = useRef<Location.LocationSubscription | null>(null)

    const applyLocation = async (loc: Location.LocationObject) => {
        const { latitude, longitude } = loc.coords
        setLocation(loc)
        setUpdatedAt(new Date())

        mapRef.current?.animateToRegion(
            { latitude, longitude, latitudeDelta: 0.005, longitudeDelta: 0.005 },
            500
        )

        try {
            const res = await fetch(
                `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_KEY}&language=pt-BR`
            )
            const data = await res.json()
            if (data.status === "OK" && data.results.length > 0) {
                setAddress(data.results[0].formatted_address)
            } else {
                setAddress(`${latitude.toFixed(5)}, ${longitude.toFixed(5)}`)
            }
        } catch {
            setAddress(`${latitude.toFixed(5)}, ${longitude.toFixed(5)}`)
        }
    }

    const startTracking = async () => {
        setLoading(true)
        setErrorMsg(null)
        try {
            const { status } = await Location.requestForegroundPermissionsAsync()
            if (status !== "granted") {
                setErrorMsg("Permissão de localização negada.")
                setLoading(false)
                return
            }

            const initial = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High })
            await applyLocation(initial)

            subscriptionRef.current?.remove()
            subscriptionRef.current = await Location.watchPositionAsync(
                { accuracy: Location.Accuracy.High, timeInterval: 5000, distanceInterval: 2 },
                applyLocation
            )
        } catch {
            setErrorMsg("Não foi possível obter a localização.")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        startTracking()
        return () => { subscriptionRef.current?.remove() }
    }, [])

    const formatTime = (date: Date) => {
        const diff = Math.floor((Date.now() - date.getTime()) / 1000)
        if (diff < 60) return "Atualizado agora há menos de 1 min"
        if (diff < 3600) return `Atualizado há ${Math.floor(diff / 60)} min`
        return `Atualizado às ${date.getHours()}:${String(date.getMinutes()).padStart(2, "0")}`
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" backgroundColor={cores.branco} />
            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Localiza pet</Text>
                </View>

                <View style={styles.card}>
                    <Text style={styles.petName}>{pet?.nome ?? "Pet"}</Text>

                    {/* Mapa Google */}
                    <View style={styles.mapContainer}>
                        {!location ? (
                            <View style={styles.mapPlaceholder}>
                                {errorMsg ? (
                                    <>
                                        <Ionicons name="warning-outline" size={32} color={cores.erro} />
                                        <Text style={styles.errorText}>{errorMsg}</Text>
                                    </>
                                ) : (
                                    <>
                                        <ActivityIndicator size="large" color={cores.roxoMedio} />
                                        <Text style={styles.loadingText}>Obtendo localização...</Text>
                                    </>
                                )}
                            </View>
                        ) : (
                            <MapView
                                ref={mapRef}
                                provider={PROVIDER_GOOGLE}
                                style={styles.map}
                                initialRegion={{
                                    latitude: location.coords.latitude,
                                    longitude: location.coords.longitude,
                                    latitudeDelta: 0.005,
                                    longitudeDelta: 0.005,
                                }}
                                scrollEnabled={false}
                                zoomEnabled={false}
                                rotateEnabled={false}
                                pitchEnabled={false}
                            >
                                <Marker
                                    coordinate={{
                                        latitude: location.coords.latitude,
                                        longitude: location.coords.longitude,
                                    }}
                                    title={pet?.nome}
                                    description="Localização atual do pet"
                                    pinColor={cores.roxoMedio}
                                />
                            </MapView>
                        )}
                    </View>

                    {/* Última localização */}
                    <View style={styles.infoSection}>
                        <Text style={styles.infoTitle}>Última localização</Text>
                        <Text style={styles.infoAddress}>
                            {address ?? (loading ? "Obtendo endereço..." : "—")}
                        </Text>
                        {updatedAt && (
                            <Text style={styles.infoTime}>{formatTime(updatedAt)}</Text>
                        )}
                    </View>

                    <TouchableOpacity
                        style={[styles.button, loading && styles.buttonDisabled]}
                        onPress={startTracking}
                        disabled={loading}
                        activeOpacity={0.8}
                    >
                        {loading ? (
                            <ActivityIndicator size="small" color={cores.branco} />
                        ) : (
                            <Text style={styles.buttonText}>Atualizar localização</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </ScrollView>

            <Footer />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: cores.cinzaClaro,
    },
    scroll: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 16,
        paddingBottom: 16,
    },
    header: {
        paddingVertical: 16,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: "700",
        color: cores.cinzaEscuro,
    },
    card: {
        backgroundColor: cores.branco,
        borderRadius: 20,
        padding: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },
    petName: {
        fontSize: 22,
        fontWeight: "700",
        color: cores.cinzaEscuro,
        textAlign: "center",
        marginBottom: 16,
    },
    mapContainer: {
        height: 240,
        borderRadius: 16,
        overflow: "hidden",
    },
    map: {
        flex: 1,
    },
    mapPlaceholder: {
        flex: 1,
        backgroundColor: cores.cinzaClaro,
        justifyContent: "center",
        alignItems: "center",
        gap: 8,
    },
    loadingText: {
        color: cores.cinzaMedio,
        fontSize: 14,
    },
    errorText: {
        color: cores.erro,
        fontSize: 14,
        textAlign: "center",
        paddingHorizontal: 16,
    },
    infoSection: {
        marginTop: 20,
        gap: 4,
    },
    infoTitle: {
        fontSize: 15,
        fontWeight: "600",
        color: cores.cinzaEscuro,
    },
    infoAddress: {
        fontSize: 14,
        color: cores.cinzaEscuro,
        lineHeight: 20,
    },
    infoTime: {
        fontSize: 12,
        color: cores.cinzaMedio,
        marginTop: 2,
    },
    button: {
        marginTop: 20,
        backgroundColor: cores.roxoMedio,
        borderRadius: 14,
        paddingVertical: 14,
        alignItems: "center",
        justifyContent: "center",
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    buttonText: {
        color: cores.branco,
        fontSize: 15,
        fontWeight: "600",
    },
})