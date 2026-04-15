// src/screens/LiveStreamScreen.js
import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  ActivityIndicator,
  Image,
  Dimensions,
  I18nManager,
} from 'react-native';
import Video from 'react-native-video';
import { colors, fonts, spacing } from '../theme/colors';

// ─────────────────────────────────────────────
//  ضع رابط البث هنا مباشرةً
// ─────────────────────────────────────────────
const STREAM_URL = 'https://your-stream-url/index.m3u8';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const PLAYER_HEIGHT = SCREEN_WIDTH * (9 / 16); // نسبة 16:9

I18nManager.forceRTL(true);

// ── مكوّن شارة LIVE ──────────────────────────
const LiveBadge = () => (
  <View style={styles.liveBadge}>
    <View style={styles.liveDot} />
    <Text style={styles.liveBadgeText}>مباشر</Text>
  </View>
);

// ── شاشة الدخول ──────────────────────────────
function EntryScreen({ article, onEnter }) {
  return (
    <SafeAreaView style={styles.entryContainer}>
      <StatusBar barStyle="light-content" backgroundColor="#0a0a0a" />

      {/* صورة الغلاف */}
      <View style={styles.thumbnailWrapper}>
        {article?.thumbnail ? (
          <Image
            source={{ uri: article.thumbnail }}
            style={styles.thumbnail}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.thumbnailPlaceholder} />
        )}
        <View style={styles.thumbnailOverlay} />
        <LiveBadge />
      </View>

      {/* معلومات البث */}
      <View style={styles.entryContent}>
        <Text style={styles.entryTitle} numberOfLines={2}>
          {article?.title ?? 'البث المباشر'}
        </Text>

        {article?.description ? (
          <Text style={styles.entryDescription} numberOfLines={3}>
            {article.description}
          </Text>
        ) : null}

        {/* معلومات إضافية */}
        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <View style={[styles.metaDot, { backgroundColor: '#22c55e' }]} />
            <Text style={styles.metaText}>البث نشط الآن</Text>
          </View>
          {article?.viewers ? (
            <View style={styles.metaItem}>
              <Text style={styles.metaText}>👁  {article.viewers} مشاهد</Text>
            </View>
          ) : null}
        </View>

        {/* زر الدخول */}
        <TouchableOpacity
          style={styles.enterButton}
          onPress={onEnter}
          activeOpacity={0.85}
        >
          <View style={styles.playIconSmall} />
          <Text style={styles.enterButtonText}>دخول البث المباشر</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// ── شاشة المشغّل ─────────────────────────────
function PlayerScreen({ article, onBack }) {
  const videoRef = useRef(null);
  const [buffering, setBuffering] = useState(true);
  const [error, setError] = useState(false);
  const [paused, setPaused] = useState(false);
  const [showControls, setShowControls] = useState(false);

  const handleBuffer = useCallback(({ isBuffering }) => {
    setBuffering(isBuffering);
  }, []);

  const handleError = useCallback(() => {
    setError(true);
    setBuffering(false);
  }, []);

  const handleLoad = useCallback(() => {
    setBuffering(false);
    setError(false);
  }, []);

  return (
    <View style={styles.playerContainer}>
      <StatusBar hidden />

      {/* مشغّل الفيديو */}
      <TouchableOpacity
        activeOpacity={1}
        style={styles.videoWrapper}
        onPress={() => setShowControls((v) => !v)}
      >
        <Video
          ref={videoRef}
          source={{ uri: STREAM_URL }}
          style={styles.video}
          resizeMode="contain"
          paused={paused}
          onBuffer={handleBuffer}
          onError={handleError}
          onLoad={handleLoad}
          repeat={false}
          playInBackground={false}
          ignoreSilentSwitch="obey"
        />

        {/* مؤشر التحميل */}
        {buffering && !error && (
          <View style={styles.bufferingOverlay}>
            <ActivityIndicator size="large" color={colors.primary ?? '#E24B4A'} />
            <Text style={styles.bufferingText}>جارٍ تحميل البث…</Text>
          </View>
        )}

        {/* رسالة خطأ */}
        {error && (
          <View style={styles.errorOverlay}>
            <Text style={styles.errorText}>⚠  تعذّر تحميل البث</Text>
            <TouchableOpacity
              style={styles.retryBtn}
              onPress={() => { setError(false); setBuffering(true); }}
            >
              <Text style={styles.retryText}>إعادة المحاولة</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* أزرار التحكّم (تظهر عند اللمس) */}
        {showControls && !buffering && !error && (
          <View style={styles.controlsOverlay}>
            <TouchableOpacity
              style={styles.pauseBtn}
              onPress={() => setPaused((p) => !p)}
              activeOpacity={0.8}
            >
              {paused ? (
                <View style={styles.playIconCtrl} />
              ) : (
                <View style={styles.pauseIcon}>
                  <View style={styles.pauseBar} />
                  <View style={styles.pauseBar} />
                </View>
              )}
            </TouchableOpacity>
          </View>
        )}
      </TouchableOpacity>

      {/* شريط معلومات تحت المشغّل */}
      <SafeAreaView style={styles.playerInfo}>
        <View style={styles.playerHeader}>
          <TouchableOpacity style={styles.backBtn} onPress={onBack}>
            <Text style={styles.backBtnText}>← رجوع</Text>
          </TouchableOpacity>
          <LiveBadge />
        </View>

        <Text style={styles.playerTitle} numberOfLines={2}>
          {article?.title ?? 'البث المباشر'}
        </Text>

        {article?.description ? (
          <Text style={styles.playerDescription} numberOfLines={2}>
            {article.description}
          </Text>
        ) : null}
      </SafeAreaView>
    </View>
  );
}

// ── الشاشة الرئيسية ───────────────────────────
export default function LiveStreamScreen({ route, navigation }) {
  const { article } = route?.params ?? {};
  const [entered, setEntered] = useState(false);

  const handleBack = useCallback(() => {
    if (navigation?.canGoBack()) {
      navigation.goBack();
    } else {
      setEntered(false);
    }
  }, [navigation]);

  if (!entered) {
    return (
      <EntryScreen
        article={article}
        onEnter={() => setEntered(true)}
      />
    );
  }

  return <PlayerScreen article={article} onBack={handleBack} />;
}

// ─────────────────────────────────────────────
const styles = StyleSheet.create({
  // ── شاشة الدخول ─────────────────────────────
  entryContainer: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  thumbnailWrapper: {
    width: '100%',
    height: 240,
    position: 'relative',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  thumbnailPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#1c1c1c',
  },
  thumbnailOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  liveBadge: {
    position: 'absolute',
    top: 14,
    right: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#E24B4A',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'white',
  },
  liveBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '700',
  },
  entryContent: {
    flex: 1,
    padding: spacing?.lg ?? 16,
  },
  entryTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'right',
    marginBottom: 10,
    lineHeight: 30,
  },
  entryDescription: {
    color: '#aaa',
    fontSize: 14,
    textAlign: 'right',
    lineHeight: 22,
    marginBottom: 16,
  },
  metaRow: {
    flexDirection: 'row-reverse',
    gap: 16,
    marginBottom: 28,
  },
  metaItem: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 6,
  },
  metaDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  metaText: {
    color: '#888',
    fontSize: 13,
  },
  enterButton: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E24B4A',
    borderRadius: 12,
    paddingVertical: 15,
    gap: 10,
  },
  playIconSmall: {
    width: 0,
    height: 0,
    borderTopWidth: 7,
    borderBottomWidth: 7,
    borderLeftWidth: 11,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: 'white',
  },
  enterButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },

  // ── شاشة المشغّل ─────────────────────────────
  playerContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  videoWrapper: {
    width: SCREEN_WIDTH,
    height: PLAYER_HEIGHT,
    backgroundColor: '#000',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  bufferingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    gap: 10,
  },
  bufferingText: {
    color: '#ccc',
    fontSize: 13,
  },
  errorOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.75)',
    gap: 12,
  },
  errorText: {
    color: 'white',
    fontSize: 15,
  },
  retryBtn: {
    paddingHorizontal: 20,
    paddingVertical: 9,
    backgroundColor: '#E24B4A',
    borderRadius: 8,
  },
  retryText: {
    color: 'white',
    fontSize: 13,
    fontWeight: '600',
  },
  controlsOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pauseBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playIconCtrl: {
    width: 0,
    height: 0,
    borderTopWidth: 10,
    borderBottomWidth: 10,
    borderLeftWidth: 16,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: 'white',
    marginLeft: 3,
  },
  pauseIcon: {
    flexDirection: 'row',
    gap: 5,
  },
  pauseBar: {
    width: 4,
    height: 18,
    backgroundColor: 'white',
    borderRadius: 2,
  },
  playerInfo: {
    flex: 1,
    backgroundColor: '#0f0f0f',
    padding: spacing?.lg ?? 16,
  },
  playerHeader: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  backBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 0.5,
    borderColor: '#444',
    borderRadius: 8,
  },
  backBtnText: {
    color: '#ccc',
    fontSize: 13,
  },
  playerTitle: {
    color: 'white',
    fontSize: 17,
    fontWeight: '600',
    textAlign: 'right',
    marginBottom: 8,
    lineHeight: 26,
  },
  playerDescription: {
    color: '#888',
    fontSize: 13,
    textAlign: 'right',
    lineHeight: 21,
  },
});
