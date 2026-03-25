# Luong Mo App Den Home

Tai lieu nay mo ta luong runtime Debt Note App tu luc nguoi dung mo app den khi vao man hinh `Home` sau Phase 6.

## 1) App Entry

1. Expo load entrypoint theo `main` trong [package.json](/Users/townsoftvina/Desktop/hand/react-native-template/package.json).
2. App root render qua [App.tsx](/Users/townsoftvina/Desktop/hand/react-native-template/App.tsx).
3. `App.tsx` wrap:
   - `AppProviders`
   - `AppContent`
   - `RootNavigator`

## 2) Bootstrap Providers

Trong [src/providers/AppProviders.tsx](/Users/townsoftvina/Desktop/hand/react-native-template/src/providers/AppProviders.tsx):

1. Tao `services` instance bang `createAppServices()`.
2. Khoi tao local DB som qua `services.databaseService.initialize()`.
3. Sau khi DB san sang, goi `services.reminderSchedulerService.reconcile()`.
4. Dong bo ngon ngu da luu vao i18n qua `LanguageSynchronizer`.
5. Dong bo local preferences quan trong vao `app_settings` qua `PreferencesDatabaseSynchronizer`.
6. Wrap app bang:
   - `ThemeProvider`
   - `ServicesProvider`
   - `QueryClientProvider`

## 3) Root Gate

Trong [src/navigation/RootNavigator.tsx](/Users/townsoftvina/Desktop/hand/react-native-template/src/navigation/RootNavigator.tsx):

1. Doc `hasHydrated` va `hasCompletedOnboarding` tu [src/state/preferences.store.ts](/Users/townsoftvina/Desktop/hand/react-native-template/src/state/preferences.store.ts).
2. Neu store chua hydrate xong:
   - Render `SplashScreen`.
3. Khi hydrate xong:
   - Neu chua onboarding xong -> `PublicNavigator` -> `OnboardingScreen`.
   - Neu da onboarding xong -> `ProtectedNavigator` -> `MainTabs`.

## 4) Public Flow

1. [src/navigation/PublicNavigator.tsx](/Users/townsoftvina/Desktop/hand/react-native-template/src/navigation/PublicNavigator.tsx) chi render `OnboardingScreen`.
2. User nhan CTA tren [src/features/app/screens/OnboardingScreen.tsx](/Users/townsoftvina/Desktop/hand/react-native-template/src/features/app/screens/OnboardingScreen.tsx).
3. `completeOnboarding()` update Zustand store.
4. `RootNavigator` re-render va chuyen sang `ProtectedNavigator`.

## 5) Protected Flow

1. [src/navigation/ProtectedNavigator.tsx](/Users/townsoftvina/Desktop/hand/react-native-template/src/navigation/ProtectedNavigator.tsx) mount native stack chua:
   - `MainTabs`
   - debt/contact/payment/reminder/settings routes
   - placeholder routes cho Premium, Login, Sync, Account
2. `MainTabs` duoc render qua [src/navigation/TabsNavigator.tsx](/Users/townsoftvina/Desktop/hand/react-native-template/src/navigation/TabsNavigator.tsx).
3. Tab mac dinh la `HomeTab` -> [src/features/home/screens/HomeScreen.tsx](/Users/townsoftvina/Desktop/hand/react-native-template/src/features/home/screens/HomeScreen.tsx).
4. FAB global duoc mount cung tab shell de mo nhanh route `AddDebt`.

## 6) Data Hydration Giai Doan Dau

Khi user vao app shell:

1. `Home`, `Debts`, `Statistics`, `Settings` doc du lieu local qua repositories + React Query.
2. `Upcoming reminders` dung query SQL toi uu (`listUpcoming`) thay vi filter tren UI.
3. `app_settings` luu local options de backup/restore co the phuc hoi language/theme/currency/onboarding.

## 7) Route Map Tong Quan

```text
Open App
 -> App.tsx
 -> AppProviders
    -> DB init
    -> Reminder scheduler reconcile
    -> Language sync
    -> Preferences -> app_settings sync
 -> RootNavigator
    -> hasHydrated = false -> SplashScreen
    -> hasHydrated = true
       -> hasCompletedOnboarding = false -> PublicNavigator -> Onboarding
       -> hasCompletedOnboarding = true  -> ProtectedNavigator
          -> MainTabs
             -> Home
             -> Debts
             -> Statistics
             -> Settings
          -> FAB -> AddDebt
```

## 8) Cac File Chinh Nen Nho

1. App entry: [App.tsx](/Users/townsoftvina/Desktop/hand/react-native-template/App.tsx)
2. Provider/bootstrap: [src/providers/AppProviders.tsx](/Users/townsoftvina/Desktop/hand/react-native-template/src/providers/AppProviders.tsx)
3. Root routing gate: [src/navigation/RootNavigator.tsx](/Users/townsoftvina/Desktop/hand/react-native-template/src/navigation/RootNavigator.tsx)
4. Tab shell: [src/navigation/TabsNavigator.tsx](/Users/townsoftvina/Desktop/hand/react-native-template/src/navigation/TabsNavigator.tsx)
5. Preferences state: [src/state/preferences.store.ts](/Users/townsoftvina/Desktop/hand/react-native-template/src/state/preferences.store.ts)
6. Theme system: [src/theme/index.tsx](/Users/townsoftvina/Desktop/hand/react-native-template/src/theme/index.tsx)
7. Backup/settings bridge: [src/features/settings/screens/BackupRestoreScreen.tsx](/Users/townsoftvina/Desktop/hand/react-native-template/src/features/settings/screens/BackupRestoreScreen.tsx)
