import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { cores } from "../theme/cores";

const ITENS = [
  { label: "home",         icone: "home",          lib: "Ionicons",              rota: "Home"        },
  { label: "Localiza pet", icone: "location-sharp", lib: "Ionicons",              rota: "LocalizaPet" },
  { label: "Coleira",      icone: "pulse",          lib: "Ionicons",              rota: "Coleira"     },
  { label: "Historico",    icone: "clipboard-list", lib: "MaterialCommunityIcons", rota: "HistoricoClinico"   },
  { label: "Meu pet",      icone: "paw",            lib: "MaterialCommunityIcons", rota: "MeuPet"      },
  { label: "Perfil",       icone: "person",         lib: "Ionicons",              rota: "Perfil"      },
] as const;

export const Footer = () => {
  const navigation = useNavigation();
  const route = useRoute();

  return (
    <View style={styles.container}>
      {ITENS.map((item) => {
        const ativo = route.name === item.rota;
        const cor = ativo ? cores.branco : "rgba(255,255,255,0.55)";

        return (
          <TouchableOpacity
            key={item.rota}
            style={styles.item}
            onPress={() => navigation.navigate(item.rota as never)}
            activeOpacity={0.7}
          >
            {item.lib === "Ionicons" ? (
              <Ionicons name={item.icone as any} size={22} color={cor} />
            ) : (
              <MaterialCommunityIcons name={item.icone as any} size={22} color={cor} />
            )}
            <Text style={[styles.label, { color: cor }]}>{item.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: cores.roxoMedio,
    paddingVertical: 10,
    paddingHorizontal: 4,
    borderRadius: 20,
    marginHorizontal: 12,
    marginBottom: 16,
    justifyContent: "space-around",
    alignItems: "center",
  },
  item: {
    alignItems: "center",
    gap: 4,
    flex: 1,
  },
  label: {
    fontSize: 9,
    fontWeight: "500",
  },
});
