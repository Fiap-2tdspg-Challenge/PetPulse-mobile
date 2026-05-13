import React from 'react';
import { View, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const PAWS: { top: number; left?: number; right?: number; rotation: number; size: number; opacity: number }[] = [
  { top: 40,  left: 20,  rotation: -30, size: 36, opacity: 0.12 },
  { top: 80,  right: 30, rotation: 20,  size: 28, opacity: 0.10 },
  { top: 160, left: 50,  rotation: 15,  size: 44, opacity: 0.08 },
  { top: 220, right: 60, rotation: -45, size: 32, opacity: 0.12 },
  { top: 320, left: 10,  rotation: 40,  size: 40, opacity: 0.09 },
  { top: 400, right: 20, rotation: -20, size: 36, opacity: 0.11 },
  { top: 500, left: 70,  rotation: 10,  size: 30, opacity: 0.08 },
  { top: 580, right: 50, rotation: 50,  size: 42, opacity: 0.10 },
  { top: 650, left: 30,  rotation: -15, size: 34, opacity: 0.09 },
  { top: 720, right: 80, rotation: 35,  size: 38, opacity: 0.12 },
];

export const PawBackground = () => {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {PAWS.map((paw, index) => (
        <MaterialCommunityIcons
          key={index}
          name="paw"
          size={paw.size}
          color="white"
          style={{
            position: 'absolute',
            top: paw.top,
            left: paw.left,
            right: paw.right,
            opacity: paw.opacity,
            transform: [{ rotate: `${paw.rotation}deg` }],
          }}
        />
      ))}
    </View>
  );
};
