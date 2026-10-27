# RepUp — Design System & UX Spec

> Source of truth for all UI in this app. Every component/screen must conform to the tokens and rules below.
> Mockup reference: full app flow (splash → onboarding → auth → home/challenges/leaderboard/profile).
> **Scope implemented:** splash, onboarding (4 steps), login, sign-up. Other screens are out of scope for now but tokens already cover them.

---

## 1. Brand

| | |
|---|---|
| Name | **RepUp** |
| Tagline | Better You — One Push-Up at a Time |
| Voice | Direct, motivating, no-fluff. Short sentences. Action verbs. |
| Personality | Gym-floor energy + tech precision. Neon on matte black. |

---

## 2. Color tokens

Defined in `src/constants/theme.ts` as `colors`.

| Token | Hex | Usage |
|---|---|---|
| `primary` | `#39FF14` | CTAs, active states, progress, focus rings, logo |
| `primaryPressed` | `#2FE010` | Pressed CTA |
| `primaryDim` | `rgba(57,255,20,0.12)` | Chip/icon backgrounds, glow fills |
| `secondary` | `#00C853` | Secondary accents, gradients toward primary |
| `background` | `#0B0F14` | Screen background (near-black, cool tint) |
| `surface` | `#1A1F2B` | Cards, inputs, list rows |
| `surfaceElevated` | `#212736` | Sheets, modals, pressed surfaces |
| `border` | `#2A3142` | Hairline borders on cards/inputs |
| `borderFocus` | `#39FF14` | Focused input border |
| `text` | `#E5E7EB` | Primary text |
| `textMuted` | `#9CA3AF` | Secondary text, placeholders, captions |
| `textInverse` | `#0B0F14` | Text on primary buttons |
| `danger` | `#FF4D4D` | Validation errors |
| `success` | `#00C853` | Success states |
| `overlay` | `rgba(0,0,0,0.6)` | Modal/scrim backdrop |

**Rules**
- Dark theme only for v1 (design is dark-native). Light mode deferred; do not build half-baked light palettes.
- Primary green is never used for long body text — contrast on dark is fine for large/short labels only.
- On primary CTAs, text color is always `textInverse` (dark), never white.

---

## 3. Typography

Font: **Nunito** (rounded, friendly-athletic — closest open match to the mockup's SF Pro Rounded feel).
Loaded via `expo-font` + `@expo-google-fonts/nunito`. Weights used: `400, 600, 700, 800`.

| Style | Weight | Size / Line | Usage |
|---|---|---|---|
| `display` | 800 | 34 / 40 | Splash wordmark, hero numbers (42 Push-Ups) |
| `title` | 800 | 26 / 32 | Onboarding headlines, auth headers |
| `heading` | 700 | 20 / 26 | Section titles |
| `body` | 400 | 15 / 22 | Descriptions, form labels |
| `bodyStrong` | 600 | 15 / 22 | Emphasized body |
| `button` | 700 | 16 / 20 | Button labels (sentence case, never all-caps) |
| `caption` | 600 | 12 / 16 | Meta text, links, legal, dots labels |

**Rules**
- Sentence case everywhere. No ALL CAPS buttons.
- Max two weights per screen region.
- Headline max-width ≈ 300pt centered — keeps 2–3 line wraps like the mockup.

---

## 4. Spacing & layout

Scale (4pt base): `xs 4 · sm 8 · md 12 · lg 16 · xl 24 · xxl 32 · xxxl 48`

| | |
|---|---|
| Screen horizontal padding | `24` (auth/onboarding), `20` (dense lists later) |
| Card padding | `16` |
| Card gap | `12` |
| CTA height | `52` |
| Input height | `52` |
| Hit target min | `44×44` |
| Top safe area | respected via `useSafeAreaInsets()` |
| Bottom CTA zone | pinned above `insets.bottom + 16`, never scrolls with content on auth/onboarding |

**Rules**
- Content that must be seen (headline, first field, CTA) sits in the top ⅔ and bottom ⅓ respectively — thumb zone respected.
- Onboarding/auth never scroll; if copy grows, tighten type first, scroll second.

---

## 5. Shape & elevation

| Token | Value | Usage |
|---|---|---|
| `radius.sm` | `10` | Chips, small buttons |
| `radius.md` | `14` | Inputs, cards, social buttons |
| `radius.lg` | `20` | Feature cards, sheets |
| `radius.pill` | `999` | Primary CTAs, segmented control, avatars |

- Elevation: flat design. Use `border` hairlines + surface contrast, not shadows.
- Glow: primary elements may use a soft green glow (`0 0 24px rgba(57,255,20,0.35)`) on hero elements only (splash mark, countdown ring) — sparingly.

---

## 6. Components

### Button (primary)
- Height 52, pill, `background: primary`, label `button` + `textInverse`.
- States: pressed → `primaryPressed`; disabled → 40% opacity, no press feedback.
- Full width of parent. One primary CTA per screen region.

### Button (secondary / outline)
- Transparent bg, 1px `border`, text `text`. Used for "Try Again" style actions.

### TextField
- Height 52, `radius.md`, `background: surface`, 1px `border`.
- Left icon (20px, `textMuted`), input text `body`/`text`, placeholder `textMuted`.
- Focused: border → `borderFocus`, no layout shift (border stays 1px).
- Password: trailing eye toggle (24px hit target ≥44), never auto-capitalized, `textContentType` set per platform.
- Error: border → `danger`, message below in `caption`/`danger`.

### SocialButton
- Height 52, `radius.md`, `background: surface`, 1px `border`.
- Provider icon 20px left, centered label `Continue with Google` / `Continue with Apple`.
- Apple button only renders on iOS (product rule: platform-correct auth affordances).

### Dots (pagination)
- Inactive: 8×8 circle `border` color. Active: 20×8 pill `primary`. Gap 6.
- Non-interactive; purely informational.

### Divider
- 1px `border` line, "or" centered in `caption`/`textMuted` on background-colored chip.

### LinkText
- Base `caption`/`textMuted`, action word `caption`/`primary`, weight 700. Inline within a centered sentence.

### Logo (RepUp mark)
- Wordmark "RepUp" in `display`/`primary`. Under tagline in `caption`/`textMuted`.
- Splash adds a subtle glow behind the mark.

---

## 7. Screen specs

### 7.1 Splash (`/`)
1. Full-bleed `background`.
2. Centered: logo mark + "RepUp" (`display`/primary) + tagline "Better You / One Push-Up at a Time" (`caption`/`textMuted`).
3. Bottom-pinned progress bar (3px, pill, track `surfaceElevated`, fill `primary`) animating 0→100% over ~1.8s.
4. On complete, navigate once (guard with ref):
   - not onboarded → `/onboarding`
   - onboarded + signed out → `/login`
   - onboarded + signed in → `/home`
5. No back gesture. No header.

### 7.2 Onboarding (`/onboarding`) — 4 steps
Layout (identical across steps):
- Top-right **Skip** (`caption`/textMuted) → jumps to `/login`. Hidden on step 4.
- Centered illustration area (~280pt tall) — placeholder graphic slots (replace with real art/Lottie later).
- Headline (`title`, centered, max 3 lines) + body (`body`/`textMuted`, centered).
- Bottom: dots + primary CTA ("Next" ×3, "Get Started" on step 4).

| # | Headline | Body | CTA |
|---|---|---|---|
| 1 | Get Stronger Every Day | Track your push-ups, build healthy habits and reach your goals. | Next |
| 2 | AI-Powered Push-Up Counter | Our AI detects your body position and counts only real push-ups. | Next |
| 3 | Challenges & Global Competition | Join daily challenges, earn rewards and compete with people worldwide. | Next |
| 4 | Your Privacy Our Priority | Your data, progress and videos stay on your device. No accounts, no cloud (optional). | Get Started |

- Step change: fade+slide 220ms. Swipe left/right also advances (FlatList paging, momentum).
- "Get Started" → sets `onboarded=true` → `/login`.

### 7.3 Login (`/login`)
- Header: "Welcome Back" (`title`) + "Log in to continue your journey" (`body`/`textMuted`).
- Fields: Email or Username · Password (eye toggle). Order: email → password → Log In.
- "Forgot password?" right-aligned under password, `caption`/primary. (No-op for now — toast.)
- Primary CTA: **Log In**. Disabled until both fields non-empty; validates on submit.
- Divider "or".
- Social: Continue with Google · Continue with Apple (iOS only).
- Footer: "Don't have an account? **Sign Up**" → `/signup`.
- Validation:
  - empty → "Required"
  - password < 6 → "Password must be at least 6 characters"
- Success → fake auth (any credentials) → `/home` replace.

### 7.4 Sign Up (`/signup`)
- Header: "Create Account" + "Join the RepUp community".
- Fields: Full Name · Email · Password. CTA: **Sign Up**.
- Validation: name ≥ 2 chars; email regex; password ≥ 8.
- Social + footer "Already have an account? **Log In**" → `/login`.
- Success → sends verification code → `/otp` (flow=signup); session created only after OTP verify → `/home`.

### 7.5 Forgot Password (`/forgot-password`)
- Header (back) + "Forgot Password" + "Enter your email and we’ll send you a verification code".
- Field: Email. CTA: **Send Code**. Ghost: Back to Log In.
- Validation: email regex. Success → `/otp` (flow=forgot).

### 7.6 OTP Verification (`/otp`)
- Header (back) + "Enter Verification Code" + "We sent a 6-digit code to {email}".
- 6 digit boxes (single hidden TextInput drives value; auto-format strips non-digits).
- CTA: **Verify** (disabled until 6 digits). Resend link with 30s cooldown.
- v1 demo code: `123456` (shown on-screen; remove when real email/SMS is wired).
- flow=forgot → `/reset-password`; flow=signup → create session → `/home`.

### 7.7 Reset Password (`/reset-password`)
- Header (back) + "New Password" + "Choose a strong password you haven’t used before".
- Fields: New Password (min 8) · Confirm (must match). CTA: **Reset Password** → `/login`.

### 7.8 Home (placeholder `/home`)
- Minimal: "Good Morning, {name}" + streak chip + sign-out. Exists so the auth loop closes; full dashboard is a later milestone.

## 7a. Auth flow map

```
splash → onboarding → login ⇄ signup → otp(signup) → home
                        ↓                ↑
                  forgot-password → otp(forgot) → reset-password → login
```

---

## 8. Motion & feedback

| Interaction | Motion |
|---|---|
| Screen push | native stack (iOS slide, Android fade) |
| Onboarding step | 220ms fade/slide |
| Button press | opacity 0.85, 80ms |
| Input focus | border color 150ms |
| Splash progress | ease-out 1.8s |
| Validation | appear instantly, no shake |

Haptics: light impact on primary CTA tap (via `expo-haptics` — **not yet installed; add when implementing workout screens**).

---

## 9. Accessibility

- All CTAs ≥ 44pt hit target.
- Icon-only buttons get `accessibilityLabel` (eye toggle, skip).
- Text contrast ≥ 4.5:1 for body (verified: `#E5E7EB` on `#0B0F14` ≈ 13:1; `#0B0F14` on `#39FF14` ≈ 14:1).
- Respect `useReduceMotion` for the splash bar and onboarding transitions when RN accessibility flag is on (TODO when touching Reanimated screens).

---

## 10. Engineering rules

- **Styling: NativeWind v4** (`className` + Tailwind). Tokens live in `tailwind.config.js` (colors, fonts, radii, sizing) — components use utility classes like `bg-bg`, `text-content-muted`, `h-cta`, `rounded-card`.
- JS-only values (e.g. dynamic opacity, `Animated` widths, iOS glow shadow) still use inline `style`; `src/constants/theme.ts` remains for non-stylable constants.
- Never hardcode hex in components when a token exists.
- Screens live in `src/app/`; primitives in `src/components/`; domain logic in `src/lib/` or `src/context/`.
- Persistence: `AsyncStorage` keys namespaced `repup:*` (`repup:onboarded`, `repup:session`).
- Auth in v1 is **local-only** (fake session + mock OTP `123456`) — matches the privacy promise in onboarding step 4. Real backend is a later decision; the `AuthContext` API is the seam.

---

## 11. Out of scope (tracked for later)

- Real illustrations / Lottie (placeholders currently geometric)
- Real OAuth (Google/Apple) — buttons are non-functional stubs with press feedback
- Real email/SMS delivery for OTP (v1 uses demo code `123456`)
- Light theme
- Tab bar (Home / Challenges / Leaderboard / Profile) — needs `expo-router` tabs once those screens exist
- Camera + pose detection (VisionCamera/MediaPipe) — the core feature, separate milestone
