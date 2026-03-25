# Router Setup

Tai lieu nay mo ta setup navigation hien tai cua Debt Note App sau Phase 1.

## Muc tieu

- Tach ro bootstrap gate va app shell.
- Dung native stack cho root/detail flow.
- Dung bottom tabs cho 4 man hinh chinh.
- Giu san route placeholder cho phase sau.

## So do navigation

```text
RootNavigator
├─ SplashScreen (khi preferences chua hydrate)
├─ PublicNavigator
│  └─ Onboarding
└─ ProtectedNavigator
   ├─ MainTabs
   │  ├─ HomeTab
   │  ├─ DebtsTab
   │  ├─ StatisticsTab
   │  └─ SettingsTab
   ├─ DebtDetail
   ├─ AddDebt
   ├─ EditDebt
   ├─ AddPayment
   ├─ PaymentHistory
   ├─ ContactList
   ├─ ContactDetail
   ├─ AddContact
   ├─ EditContact
   ├─ ReminderCenter
   ├─ BackupRestore
   ├─ Premium
   ├─ Login
   ├─ Sync
   └─ Account
```

## File chinh

- [src/navigation/RootNavigator.tsx](/Users/townsoftvina/Desktop/hand/react-native-template/src/navigation/RootNavigator.tsx)
- [src/navigation/PublicNavigator.tsx](/Users/townsoftvina/Desktop/hand/react-native-template/src/navigation/PublicNavigator.tsx)
- [src/navigation/ProtectedNavigator.tsx](/Users/townsoftvina/Desktop/hand/react-native-template/src/navigation/ProtectedNavigator.tsx)
- [src/navigation/TabsNavigator.tsx](/Users/townsoftvina/Desktop/hand/react-native-template/src/navigation/TabsNavigator.tsx)
- [src/types/navigation.ts](/Users/townsoftvina/Desktop/hand/react-native-template/src/types/navigation.ts)

## Quy uoc

1. Navigator files chi dang ky route va shell-level options.
2. Business logic va query logic khong dat trong navigator.
3. Screen detail/form duoc mount o root stack de co the duoc mo tu nhieu entry point.
4. Bottom tabs chi chua top-level destinations cua san pham.
