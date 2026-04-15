// src/screens/HomeScreen.js
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  RefreshControl,
  Alert,
} from 'react-native';
import Header from '../components/Header';
import HeroSlider from '../components/HeroSlider';
import NewsCard from '../components/NewsCard';
import LiveCard from '../components/LiveCard';
import SectionHeader from '../components/SectionHeader';
import { fetchArticles } from '../api/articlesApi';
import { colors, fonts, spacing } from '../theme/colors';

export default function HomeScreen({ navigation }) {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('live');

  const load = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      const data = await fetchArticles();
      setArticles(data);
    } catch (e) {
      Alert.alert('خطأ', 'تعذّر تحميل المقالات. حاول مجدداً.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const featured = articles.filter((a) => a.is_featured);
  const live = articles.filter((a) => a.is_live);
  const news = articles.filter((a) => !a.is_featured);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  // ── Navigate to live stream ───────────────────────────────────────────────
  const handleLiveCardPress = (article) => {
    navigation.navigate('LiveStream', { article });
  };

  const buildLiveTabItems = () => {
    const items = [];
    items.push({ key: 'hero', type: 'hero', data: featured.length ? featured : articles.slice(0, 3) });
    if (live.length > 0) {
      items.push({ key: 'live-header', type: 'section-header', title: 'البث المباشر', live: true });
      live.forEach((a) => items.push({ key: `live-${a.id}`, type: 'live', article: a }));
    }
    items.push({ key: 'news-header', type: 'section-header', title: 'اخر الاخبار', live: false });
    if (news.length > 0) {
      news.forEach((a) => items.push({ key: `news-${a.id}`, type: 'news', article: a }));
    } else {
      items.push({ key: 'empty-news', type: 'empty' });
    }
    return items;
  };

  const buildNewsTabItems = () => {
    const items = [];
    items.push({ key: 'news-header', type: 'section-header', title: 'اخر الاخبار', live: false });
    if (news.length > 0) {
      news.forEach((a) => items.push({ key: `news-${a.id}`, type: 'news', article: a }));
    } else {
      items.push({ key: 'empty-news', type: 'empty' });
    }
    return items;
  };

  const listItems = activeTab === 'live' ? buildLiveTabItems() : buildNewsTabItems();

  const renderItem = ({ item }) => {
    switch (item.type) {
      case 'hero':
        return <View style={styles.heroContainer}><HeroSlider articles={item.data} /></View>;
      case 'section-header':
        return (
          <View style={styles.sectionHeaderContainer}>
            <SectionHeader title={item.title} live={item.live} />
          </View>
        );
      case 'live':
        return (
          <View style={styles.cardContainer}>
            {/* ✅ نمرّر onPress لفتح شاشة البث */}
            <LiveCard
              article={item.article}
              onPress={() => handleLiveCardPress(item.article)}
            />
          </View>
        );
      case 'news':
        return <View style={styles.cardContainer}><NewsCard article={item.article} /></View>;
      case 'empty':
        return (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>لا توجد اخبار حالياً</Text>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.screen}>
      <Header activeTab={activeTab} onTabChange={setActiveTab} />
      <FlatList
        data={listItems}
        keyExtractor={(item) => item.key}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => load(true)}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  loadingContainer: { flex: 1, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' },
  listContent: { paddingBottom: spacing.xxl * 2, gap: spacing.md, paddingTop: spacing.md },
  heroContainer: {},
  sectionHeaderContainer: { paddingHorizontal: spacing.lg, marginTop: spacing.sm },
  cardContainer: { paddingHorizontal: spacing.lg },
  emptyContainer: { paddingVertical: spacing.xxl * 2, alignItems: 'center' },
  emptyText: { fontFamily: fonts.regular, fontSize: 13, color: colors.mutedForeground },
});
