import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { OnboardingScreen } from '@/features/app/screens/OnboardingScreen';
import type { PublicStackParamList } from '@/types/navigation';

const Stack = createNativeStackNavigator<PublicStackParamList>();

export function PublicNavigator(): React.JSX.Element {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'fade_from_bottom' }}>
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
    </Stack.Navigator>
  );
}
