import React from 'react';
import { View, StyleSheet } from 'react-native';

interface SparklineProps {
  data: number[];
  color: string;
  height?: number;
  barWidth?: number;
  gap?: number;
}

/**
 * Mini gráfico de barras, sem dependências externas — usado para mostrar a
 * tendência das últimas leituras da coleira (BPM, pressão, temperatura)
 * direto no dashboard mobile, sem precisar instalar uma lib de gráficos.
 */
export const Sparkline = ({ data, color, height = 40, barWidth = 4, gap = 3 }: SparklineProps) => {
  if (data.length === 0) {
    return <View style={{ height }} />;
  }

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  return (
    <View style={[styles.container, { height }]}>
      {data.map((valor, index) => {
        const pct = (valor - min) / range;
        const barHeight = Math.max(3, pct * height);
        return (
          <View
            key={index}
            style={{
              width: barWidth,
              height: barHeight,
              marginRight: index < data.length - 1 ? gap : 0,
              borderRadius: barWidth / 2,
              backgroundColor: color,
              opacity: 0.35 + pct * 0.65,
            }}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
});
