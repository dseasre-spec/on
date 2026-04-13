// src/api/articlesApi.js
//
// ──────────────────────────────────────────────────────────────────────────────
// Replace the mock implementation below with your real backend calls.
// If you use Base44, install the SDK and uncomment the base44 block.
// ──────────────────────────────────────────────────────────────────────────────

import { mockArticles } from '../data/mockArticles';

// ── MOCK (default) ────────────────────────────────────────────────────────────
export async function fetchArticles() {
  // Simulate network delay
  await new Promise((r) => setTimeout(r, 600));
  return mockArticles;
}

// ── BASE44 (uncomment when ready) ─────────────────────────────────────────────
// import { base44 } from './base44Client';
//
// export async function fetchArticles() {
//   return base44.entities.Article.list('-created_date', 50);
// }

// ── REST (uncomment when ready) ───────────────────────────────────────────────
// const BASE_URL = 'https://your-api.com';
//
// export async function fetchArticles() {
//   const res = await fetch(`${BASE_URL}/articles?sort=-created_date&limit=50`);
//   if (!res.ok) throw new Error('Failed to fetch articles');
//   return res.json();
// }
