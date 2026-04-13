// src/components/HeroSlider.js
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, fonts, radius, spacing } from '../theme/colors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SLIDE_HEIGHT = SCREEN_WIDTH * (9 / 16); // 16:9 aspect ratio

export default function HeroSlider({ articles }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    if (articles.length <= 1) return;
    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => {
        const next = (prev + 1) % articles.length;
        flatListRef.current?.scrollToIndex({ index: next, animated: true });
        return next;
      });
    }, 5000);
    return () => clearInterval(timerRef.current);
  }, [articles.length]);

  if (!articles.length) {
    return (
      <View style={styles.empty}>
        <LinearGradient
          colors={['#0D9488', '#0891B2', '#1D4ED8']}
          start={{ x: 1, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.emptyGradient}
        >
          <Text style={styles.emptyText}>لا توجد مقالات مميزة</Text>
        </LinearGradient>
      </View>
    );
  }

  const renderSlide = ({ item }) => (
    <View style={styles.slide}>
      {item.image_url ? (
        <Image
          source={{ uri: item.image_url }}
          style={styles.image}
          resizeMode="cover"
        />
      ) : (
        <LinearGradient
          colors={['#0D9488', '#0891B2', '#1D4ED8']}
          start={{ x: 1, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.image}
        />
      )}

      {/* Dark gradient overlay */}
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.20)', 'rgba(0,0,0,0.75)']}
        style={styles.overlay}
      />

      {/* Text content */}
      <View style={styles.textContent}>
        {item.is_live && (
          <View style={styles.liveBadge}>
            <View style={styles.livePulse} />
            <Text style={styles.liveBadgeText}>مباشر</Text>
          </View>
        )}
        <Text style={styles.title} numberOfLines={2}>
          {item.title}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={articles}
        keyExtractor={(item) => item.id}
        renderItem={renderSlide}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
          setCurrentIndex(index);
        }}
      />

      {/* Dot indicators */}
      {articles.length > 1 && (
        <View style={styles.dots}>
          {articles.map((_, i) => (
            <TouchableOpacity
              key={i}
              onPress={() => {
                flatListRef.current?.scrollToIndex({ index: i, animated: true });
                setCurrentIndex(i);
              }}
              style={[styles.dot, i === currentIndex && styles.dotActive]}
            />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: spacing.lg,
    borderRadius: radius.xl,
    overflow: 'hidden',
  },
  slide: {
    width: SCREEN_WIDTH - spacing.lg * 2,
    height: SLIDE_HEIGHT,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  textContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.xl,
    alignItems: 'flex-end',   // RTL: align to right
  },
  liveBadge: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.destructive,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.full,
    marginBottom: spacing.sm,
  },
  livePulse: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.white,
  },
  liveBadgeText: {
    fontFamily: fonts.bold,
    fontSize: 11,
    color: colors.white,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: 17,
    color: colors.white,
    textAlign: 'right',
    lineHeight: 26,
  },
  dots: {
    position: 'absolute',
    bottom: spacing.lg,
    left: spacing.xl,
    flexDirection: 'row',
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  dotActive: {
    width: 22,
    backgroundColor: colors.white,
  },
  empty: {
    marginHorizontal: spacing.lg,
    borderRadius: radius.xl,
    overflow: 'hidden',
    height: SLIDE_HEIGHT,
  },
  emptyGradient: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: spacing.xl,
  },
  emptyText: {
    fontFamily: fonts.bold,
    fontSize: 16,
    color: colors.white,
    textAlign: 'right',
  },
});
