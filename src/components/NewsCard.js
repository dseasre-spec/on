// src/components/NewsCard.js
import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { colors, fonts, radius, spacing } from '../theme/colors';

export default function NewsCard({ article, onPress }) {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.75}
    >
      {/* Text area (RTL → right side) */}
      <View style={styles.textArea}>
        <Text style={styles.title} numberOfLines={2}>
          {article.title}
        </Text>

        {article.summary ? (
          <Text style={styles.summary} numberOfLines={1}>
            {article.summary}
          </Text>
        ) : null}

        {article.category ? (
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{article.category}</Text>
          </View>
        ) : null}
      </View>

      {/* Thumbnail (left side in RTL layout) */}
      <View style={styles.thumbnail}>
        {article.image_url ? (
          <Image
            source={{ uri: article.image_url }}
            style={styles.thumbnailImage}
            resizeMode="cover"
          />
        ) : (
          <View style={[styles.thumbnailImage, styles.thumbnailFallback]} />
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row-reverse',   // RTL: text on right, image on left
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.card,
    borderRadius: radius.xl,
    padding: spacing.md,
  },
  textArea: {
    flex: 1,
    alignItems: 'flex-end',
    gap: spacing.xs,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: 13,
    color: colors.foreground,
    lineHeight: 20,
    textAlign: 'right',
  },
  summary: {
    fontFamily: fonts.regular,
    fontSize: 11,
    color: colors.mutedForeground,
    textAlign: 'right',
  },
  categoryBadge: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radius.full,
    marginTop: spacing.xs,
  },
  categoryText: {
    fontFamily: fonts.medium,
    fontSize: 10,
    color: colors.primary,
  },
  thumbnail: {
    width: 90,
    height: 76,
    flexShrink: 0,
    borderRadius: radius.md,
    overflow: 'hidden',
    backgroundColor: colors.secondary,
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  thumbnailFallback: {
    backgroundColor: colors.secondary,
  },
});
