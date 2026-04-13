// src/components/SectionHeader.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, fonts, spacing } from '../theme/colors';

export default function SectionHeader({ title, live = false }) {
  return (
    <View style={styles.container}>
      {live && <View style={styles.liveDot} />}
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: 15,
    color: colors.foreground,
    textAlign: 'right',
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.destructive,
  },
});
