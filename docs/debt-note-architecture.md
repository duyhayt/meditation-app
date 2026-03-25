# Debt Note App Architecture - Phase 6

## Muc tieu

Den Phase 6, app quan ly so no offline-first da co app shell, schema versioned, repository layer, contact/debt/payment/reminder flows, statistics, backup/restore local, va hardening co ban cho maintainability va runtime safety.

## Nguyen tac

- Local-first architecture
- UI tokenized va reusable
- Business logic khong dat trong screen
- Theme, language, onboarding state duoc quan ly tap trung
- Navigation sap xep theo product flow thay vi demo flow
- Backup/restore lam viec tren local snapshot, chua sync cloud
- Service contracts duoc giu ro rang de mo rong cho notification/sync phase sau

## Cau truc thu muc chinh

```text
src/
  components/
    layout/
    ui/
  domain/
  features/
    account/
    app/
    contacts/
    debts/
    home/
    premium/
    reminders/
    settings/
    statistics/
    sync/
  navigation/
  providers/
  services/
    backup/
    contacts/
    db/
    debts/
    payments/
    reminder-scheduler/
    reminders/
    settings/
    statistics/
  state/
  theme/
```

## Theme va UI System

- `src/theme/tokens.ts`: spacing, radius, typography, shadows.
- `src/theme/light.ts` va `src/theme/dark.ts`: semantic colors cho background, text, border, debt tones, FAB.
- `src/theme/index.tsx`: resolve `system | light | dark` tu Zustand preference + system scheme.
- UI primitives: `Text`, `Button`, `Card`, `Screen`, `FloatingActionButton`, `StatCard`, `AppHeader`, `Badge`, `InfoRow`, `SelectField`.
- List item components duoc memo hoa cho contacts va debts de giam re-render khong can thiet.

## App State Foundation

- `preferences.store` la persisted store cho:
  - `language`
  - `themePreference`
  - `hasCompletedOnboarding`
  - `currencyCode`
  - `hasHydrated`
- `PreferencesDatabaseSynchronizer` ghi cac preference quan trong vao bang `app_settings` de backup/restore co the phuc hoi local options.

## Navigation Foundation

- `RootNavigator` chia `PublicNavigator` va `ProtectedNavigator` theo onboarding state.
- `ProtectedNavigator`: root stack cho tabs va cac route CRUD/detail.
- `ReminderCenter` co the mo tong quat hoac theo `debtId` context tu `DebtDetail`.

## Database Foundation

- SQLite service bootstrap qua `src/services/db/database.service.ts`.
- Schema version hien tai: `2`.
- Migration `v1`: tao 10 bang chinh.
- Migration `v2`: bo sung index cho reminder queue va statistics queries.
- `getDatabase()` luon cho `initialize()` hoan tat de tranh race condition bootstrap.
- Repository layer da co cho contacts, debts, payments, reminders, tags, settings, statistics.

## Reminder Architecture

- Repository `reminders.repository` quan ly CRUD va state update reminder.
- `ReminderSchedulerService` hien tai la abstraction no-op + logging.
- App bootstrap goi `reconcile()` sau khi DB init xong.
- Khi create/update/delete reminder, UI hooks se goi scheduler abstraction de giu san contract cho phase notification sau.

## Backup Restore Architecture

- `backup-restore.service` export snapshot JSON cua toan bo local tables duoc ho tro.
- Restore xoa data cu, insert lai snapshot, sau do UI ap dung cac local settings quan trong tu `app_settings` vao Zustand/i18n.
- Backup la file JSON trong `Paths.document`, restore thong qua file picker.

## Performance va Hardening

- FlatList cac man hinh chinh da duoc bo sung `initialNumToRender`, `maxToRenderPerBatch`, `windowSize`, `removeClippedSubviews`.
- `ContactListItem` va `DebtListItem` duoc memo hoa.
- Service tests da co cho migration, debt calculations, payment repository, statistics repository, backup restore service.
- Error/loading/empty states duoc giu nhat quan o man hinh list/detail chinh.

## Screen Scope Sau Phase 6

- Hoan thanh app shell va flow cho `S01-S18`.
- Placeholder phase sau van duoc giu cho `S19-S22`.
- Da co feature chay that cho:
  - contacts CRUD
  - debts CRUD
  - payments create + history
  - reminders create/status/toggle/delete
  - statistics summary + status breakdown
  - settings local + backup/restore
