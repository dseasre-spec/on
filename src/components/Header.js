// src/components/Header.js
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fonts, radius, spacing } from '../theme/colors';

const TABS = [
  { id: 'live', label: 'البث المباشر', icon: '⬤' },
  { id: 'news', label: 'اخر الاخبار', icon: null },
];

export default function Header({ activeTab, onTabChange }) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top + spacing.sm }]}>
      {/* Top row: logo + menu */}
      <View style={styles.topRow}>
        <TouchableOpacity style={styles.menuButton} activeOpacity={0.7}>
          <View style={styles.menuLine} />
          <View style={[styles.menuLine, { width: 20 }]} />
          <View style={styles.menuLine} />
        </TouchableOpacity>

        <Text style={styles.logo}>ركنية</Text>
      </View>

      {/* Tab bar */}
      <View style={styles.tabRow}>
        {TABS.map((tab) => {
          const active = activeTab === tab.id;
          return (
            <TouchableOpacity
              key={tab.id}
              onPress={() => onTabChange(tab.id)}
              activeOpacity={0.8}
              style={[styles.tab, active && styles.tabActive]}
            >
              {tab.id === 'live' && (
                <View style={[styles.liveDot, active && styles.liveDotActive]} />
              )}
              <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  topRow: {
    flexDirection: 'row-reverse',   // RTL: logo on right, menu on left
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  logo: {
    fontFamily: fonts.black,
    fontSize: 26,
    color: colors.primary,
    letterSpacing: -0.5,
  },
  menuButton: {
    gap: 4,
    padding: 4,
    justifyContent: 'center',
  },
  menuLine: {
    height: 2,
    width: 26,
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
  tabRow: {
    flexDirection: 'row-reverse',   // RTL
    gap: spacing.sm,
  },
  tab: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: radius.full,
    backgroundColor: colors.transparent,
  },
  tabActive: {
    backgroundColor: colors.foreground,
  },
  tabLabel: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.mutedForeground,
  },
  tabLabelActive: {
    color: colors.background,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.mutedForeground,
  },
  liveDotActive: {
    backgroundColor: colors.destructive,
  },
});
