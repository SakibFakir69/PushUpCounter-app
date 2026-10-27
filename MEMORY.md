# Project Memory — pushup

Living log of the project. Append a dated entry for **every** change, decision, and notable finding. Newest entries at the bottom.

---

## Project Snapshot

| | |
|---|---|
| **App** | pushup (Expo / React Native mobile app) |
| **Expo SDK** | 57 (`expo ~57.0.27`) |
| **React** | 19.2.3 |
| **React Native** | 0.86.3 |
| **Router** | Expo Router, routes in `src/app/` |
| **TypeScript** | ~6.0.3, `strict: true` |
| **Package manager** | npm (`package-lock.json`; no bun.lock) |
| **Git branch** | working tree on `f66b57a Initial commit` |

## Conventions

- Routes live in `src/app/`; every file is a screen, `_layout.tsx` defines navigators.
- Keep non-route code (components, hooks, utils) outside `src/app/`.
- Import with `@/*` → `./src/*` and `@/assets/*` → `./assets/*` path aliases.
- Use `npx expo install <package>` (never npm/yarn add) for dependencies.
- Run `npx expo lint` and `npx tsc --noEmit` before declaring any task done.
- No `ios/` / `android/` dirs — configure native behavior in `app.json` + config plugins.

## Verification Commands

```bash
npx tsc --noEmit      # typecheck
npx expo lint         # lint
npx expo-doctor       # dependency/config diagnosis
npx expo start        # dev server
```

---

## Change Log

### 2026-10-12 — Initial review of scaffolded project

**State:** Fresh `create-expo-app` starter, manually stripped to the blank template (all example components/hooks/screens deleted, unstaged).

**Checks run:**
- `npx tsc --noEmit` → pass (0 errors)
- `npx expo lint` → pass (0 problems)
- `npx expo-doctor` → pass (21/21 checks)

**Actions taken:**
- Ran `npx expo lint` for the first time → ESLint was not configured. CLI auto-installed `eslint@^9` + `eslint-config-expo@~57.0.2` and generated `eslint.config.js`. This modified `package.json` and `package-lock.json`.

**Issues found (not yet fixed):**
1. `package.json` still declares `"reset-project": "node ./scripts/reset-project.js"` but `scripts/reset-project.js` is deleted → broken script.
2. `README.md` line 26 says edit files in `**app** directory`; project actually uses `src/app/`.
3. Large uncommitted cleanup (20+ deletions) sitting on top of `f66b57a`.
4. Unused deps installed: `@expo/ui`, `expo-glass-effect`, `expo-symbols`, `expo-web-browser`, `expo-device`, `react-native-gesture-handler`, `react-native-reanimated`, `react-native-worklets`.
5. `app.json` has `experiments.reactCompiler: true` — verify third-party lib compatibility before adding heavy deps.

**Current file tree:**
```
src/app/_layout.tsx   → bare <Stack />
src/app/index.tsx     → placeholder screen
```

---

## Change Log (continued)

### 2026-10-12 — Design system + auth & onboarding implemented

**Source:** Full-app mockup (RepUp) reviewed; scoped to splash → onboarding → auth.

**Created:**
- `DESIGN.md` — full design system + screen specs (colors #39FF14/#0B0F14/#1A1F2B/#E5E7EB, Nunito type scale, spacing/radius, component rules, motion, a11y, out-of-scope list).
- `src/constants/theme.ts` — single token source (colors, spacing, radius, typography, sizing, glow).
- `src/lib/storage.ts` — AsyncStorage helpers, keys namespaced `repup:*`.
- `src/context/auth.tsx` — `AuthProvider`/`useAuth`, local-only fake session (matches onboarding privacy promise).
- `src/components/` — `Screen`, `Button` (primary/outline/ghost), `TextField` (icons, focus/error, password eye), `SocialButton` (Google; Apple iOS-only), `Dots`, `Logo`, `Illustration` (geometric placeholders, replace with art/Lottie later).
- `src/app/index.tsx` — animated splash (1.8s progress) → routes by onboarding/session state.
- `src/app/onboarding.tsx` — 4-step FlatList carousel, Skip, dots, fade navigation.
- `src/app/login.tsx` / `signup.tsx` — validation (email regex, password 6/8 chars), password toggle, social stubs, KeyboardAvoidingView.
- `src/app/home.tsx` — minimal authed landing (greeting, streak chip, sign-out) to close the loop.

**Dependencies added:** `@expo/vector-icons`, `@react-native-async-storage/async-storage`, `@expo-google-fonts/nunito` (all via expo-compatible installs).

**Verification:** `npx tsc --noEmit` pass · `npx expo lint` pass (fixed React Compiler ref-in-render errors by switching to `useMemo` for Animated.Value, `useCallback` for onViewableItemsChanged, module-level VIEW_CONFIG; escaped apostrophe).

**Known gaps (tracked in DESIGN.md §11):** real illustrations, OAuth, password reset, tab bar, camera/pose detection.

---

## Change Log (continued)

### 2026-10-12 — NativeWind migration + complete auth flow

**NativeWind v4.2.7 installed & configured:**
- `nativewind@4.2.7`, `tailwindcss@^3.4.17`, `babel-preset-expo` (dev)
- `tailwind.config.js` — brand tokens as Tailwind theme (colors.primary/#39FF14, bg/#0B0F14, surface/#1A1F2B, content/#E5E7EB, danger, fonts Nunito, fontSize display→caption, h-cta/h-input, max-w-content)
- `global.css`, `babel.config.js` (`jsxImportSource: "nativewind"` + `nativewind/babel`), `metro.config.js` (`withNativeWind`), `nativewind-env.d.ts`
- `app.json` web.bundler → `metro`
- All primitives + screens refactored from StyleSheet to `className`

**New auth screens:**
- `/forgot-password` — email → send code
- `/otp` — 6-digit box input (hidden TextInput), resend cooldown 30s, demo code `123456`
- `/reset-password` — new + confirm password (min 8, match)
- Signup now routes through OTP before creating session; login "Forgot password?" wired
- Shared: `AuthHeader` (back button + title/subtitle), `OtpInput`, `src/lib/authFlow.ts` (mock send/verify/resend/reset)

**Verification:** `npx tsc --noEmit` pass · `npx expo lint` pass (fixed: css side-effect import path, Pressable className→style for pressed states, set-state-in-effect via lazy useState init, unused imports)

---

## Pending / TODO

- [ ] Remove or restore the `reset-project` script + update README
- [ ] Update README to reference `src/app/`
- [ ] Commit the template-cleanup + auth work
- [ ] Prune unused dependencies
- [ ] Build dashboard, challenges, leaderboard, profile screens
- [ ] Camera + pose detection (VisionCamera/MediaPipe) — core feature
- [ ] Real OAuth + real OTP delivery when backend decision is made

---

## Decisions

_(record "why" here, not just "what")_

- 2026-10-12: Adopted `MEMORY.md` as the single source of truth for project history.
- 2026-10-12: Dark-only theme for v1 (mockup is dark-native; half-baked light palette deferred).
- 2026-10-12: Local-only auth (fake session) in v1 — onboarding step 4 promises on-device/optional-cloud; real backend is a later decision behind the `AuthContext` seam.
- 2026-10-12: Nunito chosen as open-font stand-in for the mockup's SF Pro Rounded feel.
- 2026-10-12: Onboarding illustrations are intentional geometric placeholders (glow rings + icon + chip), not broken assets.
- 2026-10-12: Adopted NativeWind v4 (4.2.7) for styling per user request; tokens mirrored from `src/constants/theme.ts` into `tailwind.config.js` (theme.ts kept for non-stylable JS constants like glow/Animated).
- 2026-10-12: Full auth loop = login ⇄ signup → otp → home; forgot-password → otp → reset-password. Signup session is only created after OTP verify (matches "verification" mental model even in v1).
