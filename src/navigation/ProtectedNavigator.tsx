import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { AccountScreen } from '@/features/account/screens/AccountScreen';
import { ContactDetailScreen } from '@/features/contacts/screens/ContactDetailScreen';
import { ContactListScreen } from '@/features/contacts/screens/ContactListScreen';
import { EditContactScreen } from '@/features/contacts/screens/EditContactScreen';
import { NewContactScreen } from '@/features/contacts/screens/NewContactScreen';
import { AddPaymentScreen } from '@/features/debts/screens/AddPaymentScreen';
import { DebtDetailScreen } from '@/features/debts/screens/DebtDetailScreen';
import { EditDebtScreen } from '@/features/debts/screens/EditDebtScreen';
import { NewDebtScreen } from '@/features/debts/screens/NewDebtScreen';
import { PaymentHistoryScreen } from '@/features/debts/screens/PaymentHistoryScreen';
import { PremiumScreen } from '@/features/premium/screens/PremiumScreen';
import { ReminderCenterScreen } from '@/features/reminders/screens/ReminderCenterScreen';
import { BackupRestoreScreen } from '@/features/settings/screens/BackupRestoreScreen';
import { LoginScreen } from '@/features/settings/screens/LoginScreen';
import { SyncScreen } from '@/features/sync/screens/SyncScreen';
import type { RootStackParamList } from '@/types/navigation';

import { TabsWithFab } from './TabsNavigator';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function ProtectedNavigator(): React.JSX.Element {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="MainTabs" component={TabsWithFab} options={{ headerShown: false }} />
      <Stack.Screen name="DebtDetail" component={DebtDetailScreen} />
      <Stack.Screen name="AddDebt" component={NewDebtScreen} />
      <Stack.Screen name="EditDebt" component={EditDebtScreen} />
      <Stack.Screen name="AddPayment" component={AddPaymentScreen} />
      <Stack.Screen name="PaymentHistory" component={PaymentHistoryScreen} />
      <Stack.Screen name="ContactList" component={ContactListScreen} />
      <Stack.Screen name="ContactDetail" component={ContactDetailScreen} />
      <Stack.Screen name="AddContact" component={NewContactScreen} />
      <Stack.Screen name="EditContact" component={EditContactScreen} />
      <Stack.Screen name="ReminderCenter" component={ReminderCenterScreen} />
      <Stack.Screen name="BackupRestore" component={BackupRestoreScreen} />
      <Stack.Screen name="Premium" component={PremiumScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Sync" component={SyncScreen} />
      <Stack.Screen name="Account" component={AccountScreen} />
    </Stack.Navigator>
  );
}
