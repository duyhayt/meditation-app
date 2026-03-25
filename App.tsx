import 'react-native-gesture-handler';

import { StatusBar } from 'expo-status-bar';

import { RootNavigator } from '@/navigation/RootNavigator';
import { AppProviders } from '@/providers/AppProviders';
import { useResolvedThemeMode } from '@/theme';

function AppContent(): React.JSX.Element {
  const mode = useResolvedThemeMode();

  return (
    <>
      <StatusBar style={mode === 'dark' ? 'light' : 'dark'} />
      <RootNavigator />
    </>
  );
}

export default function App(): React.JSX.Element {
  return (
    <AppProviders>
      <AppContent />
    </AppProviders>
  );
}
