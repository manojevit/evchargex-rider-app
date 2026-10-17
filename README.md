# EVCHARGEX — Rider App (Demo)

A **frontend-only** React Native + Expo prototype of the EVCHARGEX battery-swap
rider app, built to demo the full user experience (no backend — all data is
local/dummy). Content is taken from the real product (rider *Manoj*, EVIDEMO
stations across Delhi-NCR, real battery serials and cabinet layouts) and dressed
in a polished EVCHARGEX design.

## ✨ What's inside

- **19 screens**: splash, onboarding, login, OTP, PIN, home, stations (list +
  stylised map), station detail (live cabinet grid), scan, pre-flight, live swap
  (auto-playing 6-step animation), swap complete, history, wallet, top-up, plan,
  alerts, menu, support, settings.
- **Floating QR scan button** in the bottom-right corner (as requested).
- **Empty ↔ rich account toggle** — flip the whole app between a brand-new rider
  and an active rider live during the demo (Menu → Settings → *Demo controls*).
- Fully clickable with real animations (Moti / Reanimated). No network calls.

## 🧰 Stack

| Concern | Choice |
|---|---|
| Framework | Expo SDK 58 + Expo Router (file-based) |
| Language | TypeScript (strict) |
| Styling | NativeWind (Tailwind for RN) |
| Animation | Moti + Reanimated |
| Icons | lucide-react-native |
| Gradients | expo-linear-gradient |
| Fonts | Inter (@expo-google-fonts/inter) |
| Data | Local dummy data + React Context |

## ▶️ Run it on your phone (fastest)

```bash
npm install
npx expo start
```

Scan the QR with the **Expo Go** app (Android). The app opens instantly.

> Demo logins are pre-filled: phone `78770 18453`, OTP `1234`, then set any PIN.

## 📦 Build an installable APK (EAS — cloud)

```bash
npm i -g eas-cli
eas login                 # free Expo account (expo.dev)
eas build -p android --profile preview
```

EAS builds the APK in the cloud (~10–15 min) and gives you a download link.
Download the `.apk`, send it to your phone, and install it (allow "install from
unknown sources"). Profiles live in `eas.json` — `preview` produces a plain APK.

## 🏗️ Build an APK locally with Android Studio (backup)

```bash
npx expo prebuild --platform android   # generates the native android/ project
cd android
./gradlew assembleRelease              # APK at android/app/build/outputs/apk/release/
```

Open the generated `android/` folder in Android Studio if you prefer the GUI.

## 🎬 Demo flow (suggested narration)

1. **Splash → Onboarding → Login (1234) → PIN** — the first-run experience.
2. **Home** — profile, vehicle battery, subscription, nearest stations.
3. Tap the **blue QR button (bottom-right)** → scanner auto-detects a cabinet.
4. **Pre-flight checks** → *Start swap* → watch the **6-step live swap** play out
   (slot opens → insert → verify → dispense → collect → complete).
5. **Stations** — list + tap *Map* for the pin view; open a station to see the
   live 9-slot cabinet grid.
6. **Plan / Wallet / History / Alerts** from the tabs and Menu.
7. **Menu → Settings → Demo controls** — flip to *New rider* to show the empty
   states, then back to *Active rider*.

## 📁 Structure

```
app/                 # screens (expo-router)
  (auth)/            # login, otp, pin
  (tabs)/            # home, stations, plan, menu  (+ floating scan button)
  swap/              # preflight, live
  station/[id].tsx   # cabinet detail
  scan, history, alerts, support, settings, wallet/
components/          # UI primitives + domain components
lib/
  data/              # dummy data (stations, account personas, types)
  store.tsx          # auth + persona toggle
  theme.ts, format.ts, motion.tsx, cn.ts
docs/design-reference/  # sir's screens + the polished design refs
```
