# ركنية — Expo React Native

Dark-themed, RTL Arabic sports news app converted from the original React/Base44 web app.

---

## 📁 Project Structure

```
ruknia/
├── App.js                          ← Root entry (fonts + SafeAreaProvider)
├── app.json
├── babel.config.js
├── package.json
└── src/
    ├── theme/
    │   └── colors.js               ← Design tokens (colors, fonts, spacing)
    ├── data/
    │   └── mockArticles.js         ← Sample data (replace with real API)
    ├── api/
    │   └── articlesApi.js          ← API layer (mock / Base44 / REST)
    ├── components/
    │   ├── Header.js               ← Sticky header with tab bar
    │   ├── HeroSlider.js           ← Auto-rotating featured articles
    │   ├── NewsCard.js             ← Horizontal thumbnail + text card
    │   ├── LiveCard.js             ← Full-width live broadcast card
    │   └── SectionHeader.js        ← Section title with optional live dot
    └── screens/
        └── HomeScreen.js           ← Main feed screen
```

---

## 🚀 Setup

```bash
# 1. Install dependencies
npm install

# 2. Start Expo dev server
npx expo start

# 3. Run on device / simulator
# iOS:     press i
# Android: press a
# Web:     press w
```

---

## 🔌 Connecting Your Backend

Open `src/api/articlesApi.js` and uncomment the block that matches your backend:

### Base44
```js
import { base44 } from './base44Client';

export async function fetchArticles() {
  return base44.entities.Article.list('-created_date', 50);
}
```

### REST API
```js
export async function fetchArticles() {
  const res = await fetch('https://your-api.com/articles?sort=-created_date&limit=50');
  return res.json();
}
```

---

## 📦 Dependencies

| Package | Purpose |
|---|---|
| `expo` | Expo SDK |
| `expo-status-bar` | Status bar theming |
| `expo-font` | Custom font loading |
| `expo-linear-gradient` | Gradient overlays |
| `@expo-google-fonts/tajawal` | Arabic Tajawal font family |
| `react-native-safe-area-context` | Safe area insets |
| `react-native-reanimated` | (Optional) Animation primitives |

---

## 🎨 Design Tokens

All colours, font names, border radii, and spacing live in `src/theme/colors.js`.
Change `primary` (`#00C764`) to rebrand the whole app instantly.

---

## 🌍 RTL

All components use `flexDirection: 'row-reverse'` and `textAlign: 'right'` for RTL.
No external RTL library required.
