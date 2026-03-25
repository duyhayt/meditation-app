# Dependency Injection Trong Debt Note App

## Hien tai dang inject gi

`createAppServices()` trong [src/services/di/app-services.ts](/Users/townsoftvina/Desktop/hand/react-native-template/src/services/di/app-services.ts) dang cung cap:

- `languageService`
- `dateTimeService`
- `loggerService`
- `databaseService`

## Vi sao van giu DI tu Phase 1

- De repository phase sau co the duoc compose tu service level.
- De test service/repository quan trong ma khong bind cung implementation that.
- De screen/hook chi phu thuoc vao contract thay vi import truc tiep service concretions.

## Truy cap trong UI

- `useLanguageService()`
- `useDateTimeService()`
- `useLoggerService()`
- `useDatabaseService()`

Tat ca cac hook nay duoc export tu [src/providers/ServicesProvider.tsx](/Users/townsoftvina/Desktop/hand/react-native-template/src/providers/ServicesProvider.tsx).

## Huong mo rong phase sau

1. Phase 2 them repository contracts cho `contacts`, `debts`, `payments`, `reminders`, `settings`, `backup`.
2. Phase 2 tiep tuc inject migration runner va seed service neu can.
3. Test se mock `AppServices` de verify business logic o hook/service layer.
