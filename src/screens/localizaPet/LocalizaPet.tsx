import { View, Text } from "react-native"
import { cores } from "../../theme/cores"

export const LocalizaPet = () => {
    return(
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: cores.roxoMedio }}>
            <Text style={{ color: cores.branco, fontSize: 18 }}>Em breve: Localiza Pet</Text>
        </View>
    )
}