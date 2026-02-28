import React, { useState } from 'react';

const COLORS = {
  emerald: '#022E1F',
  gold: '#D4AF37',
  goldLight: '#E8C84A',
  ivory: '#F9F9F9',
};

const FILE_TREE = [
  { path: 'app/_layout.tsx', desc: 'Root layout — Google Fonts, providers, ErrorBoundary', type: 'layout' },
  { path: 'app/(tabs)/_layout.tsx', desc: 'Tab bar — NativeTabs (iOS 26+) / Tabs fallback', type: 'layout' },
  { path: 'app/(tabs)/index.tsx', desc: '∞ Counter — BigInt, AsyncStorage, pulsing golden orb, floating +1', type: 'screen' },
  { path: 'app/(tabs)/hadiths.tsx', desc: 'Prophetic Pearls — 8 Sahih hadiths, always bilingual (AR+EN)', type: 'screen' },
  { path: 'app/(tabs)/guide.tsx', desc: 'AI Spiritual Guide — GPT-5.2 streaming SSE chat', type: 'screen' },
  { path: 'app/(tabs)/reminders.tsx', desc: 'Smart Reminders — expo-notifications, DAILY triggers', type: 'screen' },
  { path: 'components/GlassCard.tsx', desc: 'Silk glassmorphism card with LinearGradient shimmer', type: 'component' },
  { path: 'components/FloatingPlusOne.tsx', desc: 'Gold +1 arc animation with Reanimated (native + web)', type: 'component' },
  { path: 'components/MilestoneModal.tsx', desc: 'Full-screen celebration modal with confetti burst', type: 'component' },
  { path: 'components/ConfettiParticles.tsx', desc: '20-particle radial burst (Reanimated, Expo Go safe)', type: 'component' },
  { path: 'components/TypingIndicator.tsx', desc: 'Animated 3-dot typing indicator for AI chat', type: 'component' },
  { path: 'components/ErrorBoundary.tsx', desc: 'Global error boundary with graceful fallback', type: 'component' },
  { path: 'context/CounterContext.tsx', desc: 'BigInt counter, AsyncStorage, milestone detection', type: 'context' },
  { path: 'context/ThemeContext.tsx', desc: 'Golden theme unlock at 1,000 Salawat', type: 'context' },
  { path: 'context/LanguageContext.tsx', desc: 'Arabic / English bilingual toggle + persistence', type: 'context' },
  { path: 'constants/colors.ts', desc: 'COLORS + GOLDEN_COLORS — Emerald #022E1F, Gold #D4AF37', type: 'constant' },
  { path: 'constants/hadiths.ts', desc: '8 Sahih hadiths (AR text, EN translation, narrators, refs)', type: 'constant' },
  { path: 'i18n/index.ts', desc: 'All UI strings in Arabic & English', type: 'i18n' },
  { path: 'server/routes.ts', desc: 'POST /api/chat — OpenAI SSE streaming endpoint', type: 'server' },
  { path: 'server/index.ts', desc: 'Express server — port 5000', type: 'server' },
];

const TYPE_META: Record<string, { color: string; label: string }> = {
  layout:    { color: '#7C3AED', label: 'Layout' },
  screen:    { color: '#D4AF37', label: 'Screen' },
  component: { color: '#06B6D4', label: 'Component' },
  context:   { color: '#10B981', label: 'Context' },
  constant:  { color: '#F97316', label: 'Constant' },
  i18n:      { color: '#EC4899', label: 'i18n' },
  server:    { color: '#6B7280', label: 'Server' },
};

const FEATURES = [
  { icon: '∞', title: 'Infinite BigInt Counter', desc: 'Never overflows. Persisted via AsyncStorage. Pulsing golden orb with Reanimated spring physics + haptic sync.' },
  { icon: '✨', title: 'Golden Theme Unlock', desc: 'Unlocks at 1,000 Salawat. Full palette shift: Emerald → Amber-Gold. Confetti celebration modal with 20 animated particles.' },
  { icon: '📖', title: 'Prophetic Pearls', desc: '8 authentic Sahih hadiths. Arabic text (Amiri font) + English translation always visible. Expand for narrator + reference.' },
  { icon: '🤖', title: 'AI Spiritual Guide', desc: 'GPT-5.2 via Replit AI Integration. Real-time SSE streaming. Language toggle instantly resets the welcome message.' },
  { icon: '🔔', title: 'Smart Reminders', desc: 'expo-notifications with DAILY triggers: 7:00 AM · 1:00 PM · 8:00 PM + 5 random throughout the day. Permission-gated.' },
  { icon: '🌐', title: 'Full Bilingual AR/EN', desc: 'Complete RTL support. Amiri font for Arabic, Inter for English. Toggle propagates app-wide instantly with context.' },
];

function Tag({ type }: { type: string }) {
  const meta = TYPE_META[type];
  return (
    <span style={{
      display: 'inline-block',
      fontSize: 10,
      fontWeight: 700,
      letterSpacing: 1,
      padding: '2px 8px',
      borderRadius: 999,
      backgroundColor: meta.color + '22',
      color: meta.color,
      border: `1px solid ${meta.color}44`,
      textTransform: 'uppercase' as const,
      whiteSpace: 'nowrap' as const,
    }}>
      {meta.label}
    </span>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState<'files' | 'features'>('files');
  const [search, setSearch] = useState('');

  const filtered = FILE_TREE.filter(
    f => f.path.toLowerCase().includes(search.toLowerCase()) || f.desc.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{
      minHeight: '100vh',
      background: `linear-gradient(135deg, ${COLORS.emerald} 0%, #033d28 50%, #011a12 100%)`,
      fontFamily: "'Inter', system-ui, sans-serif",
      color: COLORS.ivory,
    }}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '48px 24px' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 52 }}>
          <div style={{ fontSize: 64, marginBottom: 8, lineHeight: 1 }}>☽</div>
          <h1 style={{
            fontSize: 40,
            fontWeight: 800,
            color: COLORS.gold,
            margin: '0 0 4px',
            letterSpacing: -1,
            textShadow: '0 0 40px rgba(212,175,55,0.45)',
          }}>
            Infinite Light <span style={{ opacity: 0.75, fontSize: 30 }}>ﷺ</span>
          </h1>
          <p style={{ color: 'rgba(249,249,249,0.55)', marginTop: 10, fontSize: 15, lineHeight: 1.6 }}>
            Infinite Edition — Expo React Native SDK 54 · GPT-5.2 · BigInt · Bilingual AR/EN
          </p>

          {/* Tech badges */}
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap', marginTop: 20 }}>
            {['Expo SDK 54', 'GPT-5.2 Streaming', 'BigInt Counter', 'Reanimated', 'RTL Ready', 'APK Ready', 'Expo Go ✓'].map(b => (
              <span key={b} style={{
                background: 'rgba(212,175,55,0.10)',
                border: '1px solid rgba(212,175,55,0.28)',
                borderRadius: 999,
                padding: '5px 14px',
                fontSize: 12,
                color: COLORS.goldLight,
                fontWeight: 600,
              }}>{b}</span>
            ))}
          </div>

          {/* Color chips */}
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginTop: 24 }}>
            {[
              { color: '#022E1F', label: 'Deep Emerald' },
              { color: '#D4AF37', label: 'Royal Gold' },
              { color: '#F9F9F9', label: 'Ivory' },
              { color: '#FFD700', label: 'Golden Theme' },
            ].map(c => (
              <div key={c.color} style={{ textAlign: 'center' }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: c.color, border: '1px solid rgba(255,255,255,0.2)', margin: '0 auto 4px' }} />
                <div style={{ fontSize: 10, color: 'rgba(249,249,249,0.5)', fontFamily: 'monospace' }}>{c.color}</div>
                <div style={{ fontSize: 10, color: 'rgba(249,249,249,0.35)' }}>{c.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 32, justifyContent: 'center' }}>
          {(['files', 'features'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '10px 30px',
                borderRadius: 999,
                border: '1px solid',
                borderColor: activeTab === tab ? COLORS.gold : 'rgba(212,175,55,0.3)',
                background: activeTab === tab ? 'rgba(212,175,55,0.14)' : 'transparent',
                color: activeTab === tab ? COLORS.gold : 'rgba(249,249,249,0.45)',
                fontWeight: 700,
                fontSize: 14,
                cursor: 'pointer',
              }}
            >
              {tab === 'files' ? '📁 File Structure' : '✨ Features'}
            </button>
          ))}
        </div>

        {activeTab === 'files' && (
          <>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 16 }}>
              {Object.entries(TYPE_META).map(([k, v]) => (
                <span key={k} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'rgba(249,249,249,0.5)' }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: v.color, display: 'inline-block' }} />
                  {v.label}
                </span>
              ))}
            </div>

            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search files or descriptions..."
              style={{
                width: '100%',
                padding: '11px 18px',
                borderRadius: 14,
                border: '1px solid rgba(212,175,55,0.22)',
                background: 'rgba(255,255,255,0.05)',
                color: COLORS.ivory,
                fontSize: 14,
                marginBottom: 16,
                outline: 'none',
                boxSizing: 'border-box' as const,
              }}
            />

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {filtered.map((f, i) => (
                <div key={i} style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 16,
                  background: 'rgba(255,255,255,0.035)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  borderRadius: 14,
                  padding: '14px 18px',
                }}>
                  <div style={{ minWidth: 90, paddingTop: 2 }}>
                    <Tag type={f.type} />
                  </div>
                  <div>
                    <div style={{ fontFamily: 'monospace', fontSize: 13, color: COLORS.goldLight, marginBottom: 5 }}>
                      {f.path}
                    </div>
                    <div style={{ fontSize: 13, color: 'rgba(249,249,249,0.55)', lineHeight: 1.6 }}>
                      {f.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === 'features' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: 16 }}>
            {FEATURES.map((f, i) => (
              <div key={i} style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(212,175,55,0.16)',
                borderRadius: 20,
                padding: '24px',
              }}>
                <div style={{ fontSize: 40, marginBottom: 14, lineHeight: 1 }}>{f.icon}</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: COLORS.gold, marginBottom: 10 }}>{f.title}</div>
                <div style={{ fontSize: 13, color: 'rgba(249,249,249,0.6)', lineHeight: 1.75 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <div style={{ textAlign: 'center', marginTop: 64, paddingTop: 32, borderTop: '1px solid rgba(212,175,55,0.1)' }}>
          <div style={{ fontSize: 22, color: COLORS.gold, marginBottom: 10, lineHeight: 1.8 }}>
            اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ
          </div>
          <div style={{ fontSize: 13, color: 'rgba(249,249,249,0.35)', letterSpacing: 0.3 }}>
            Infinite Light Infinite Edition · Expo Go Compatible · APK Ready via EAS Build
          </div>
        </div>
      </div>
    </div>
  );
}
