// src/components/LiveCard.js
import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, fonts, radius, spacing } from '../theme/colors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_HEIGHT = (SCREEN_WIDTH - spacing.lg * 2) * (9 / 16);

export default function LiveCard({ article, onPress }) {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.85}
    >
      {/* Background image or fallback */}
      {article.image_url ? (
        <Image
          source={{ uri: article.image_url }}
          style={styles.image}
          resizeMode="cover"
        />
      ) : (
        <View style={[styles.image, styles.imageFallback]}>
          <Text style={styles.fallbackText} numberOfLines={1}>
            {article.title.substring(0, 20)}
          </Text>
        </View>
      )}

      {/* Bottom gradient + title */}
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.65)']}
        style={styles.bottomGradient}
      >
        <Text style={styles.title} numberOfLines={1}>
          {article.title}
        </Text>
      </LinearGradient>

      {/* LIVE badge — top right (RTL) */}
      <View style={styles.liveBadge}>
        <Text style={styles.liveIcon}>⬤</Text>
        <Text style={styles.liveBadgeText}>مباشر</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: radius.xl,
    overflow: 'hidden',
    height: CARD_HEIGHT,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageFallback: {
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fallbackText: {
    fontFamily: fonts.black,
    fontSize: 36,
    color: colors.primary,
  },
  bottomGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    paddingTop: spacing.xl * 2,
    alignItems: 'flex-end',   // RTL
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: 15,
    color: colors.white,
    textAlign: 'right',
  },
  liveBadge: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,     // RTL: top-right
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 5,
    backgroundColor: colors.destructive,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.full,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 6,
  },
  liveIcon: {
    fontSize: 7,
    color: colors.white,
  },
  liveBadgeText: {
    fontFamily: fonts.bold,
    fontSize: 11,
    color: colors.white,
  },
});
