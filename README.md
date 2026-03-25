# Debt Note App Foundation

Debt Note App is an Expo + React Native + TypeScript codebase for an offline-first debt notebook. The current state covers Phase 1 foundation: app shell, navigation, theme system, localization, reusable UI primitives, and production-oriented project structure for later local-database work.

## Stack

- Expo SDK 55
- React Native 0.83 + TypeScript strict
- React Navigation (native stack + bottom tabs)
- Zustand for local app preferences
- TanStack Query for async orchestration
- Expo SQLite for local persistence in upcoming phases
- i18next + react-i18next for `vi` / `en`
- React Hook Form + Zod for upcoming forms

## Current Product Scope

- Offline-first local debt notebook
- No login in current phase
- No cloud sync in current phase
- Dark mode and light mode support
- App shell for Home, Debts, Statistics, Settings
- Placeholder routes for Premium, Login, Sync, Account

## Scripts

```bash
npm install
npm run start
npm run ios
npm run android
npm run lint
npm run typecheck
npm run test
```

## Architecture

- `src/features` keeps domain screens grouped by module.
- `src/components/ui` contains reusable primitives and variants.
- `src/components/layout` contains structural presentation helpers.
- `src/navigation` owns route registration and flow composition.
- `src/services` contains infrastructure services such as SQLite, language, logging, DI.
- `src/state` stores persisted local app preferences and onboarding state.
- `src/theme` defines tokens, semantic colors, and light/dark theme resolution.
- `docs` contains architecture and navigation flow notes.

## Phase 1 Deliverables

- Removed demo `posts/auth` app flow from the main experience.
- Added Debt Note app flow: `Splash -> Onboarding -> Main Tabs`.
- Added route skeletons for required screens `S01-S22`.
- Expanded design tokens and semantic theme colors.
- Added language and theme preferences via Zustand persistence.
- Replaced locale content with Debt Note domain copy in English and Vietnamese.
- Prepared SQLite bootstrap service for later schema migrations.

## Next Phases

1. Phase 2: full SQLite schema, migrations, repositories, dev seed data.
2. Phase 3: contacts, debts, payments CRUD and debt status calculations.
3. Phase 4: reminders and statistics queries.
4. Phase 5: backup/restore and local settings persistence expansion.
5. Phase 6: hardening, tests, and documentation completion.
