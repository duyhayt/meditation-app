import AsyncStorage from '@react-native-async-storage/async-storage';

const SLEEP_TIMER_TARGET_KEY = 'audio:sleep-timer-target-ms';

export async function getSleepTimerTargetEpochMs(): Promise<number | null> {
  const value = await AsyncStorage.getItem(SLEEP_TIMER_TARGET_KEY);

  if (!value) {
    return null;
  }

  const parsedValue = Number(value);

  return Number.isFinite(parsedValue) ? parsedValue : null;
}

export async function setSleepTimerTargetEpochMs(targetEpochMs: number | null): Promise<void> {
  if (targetEpochMs === null) {
    await AsyncStorage.removeItem(SLEEP_TIMER_TARGET_KEY);
    return;
  }

  await AsyncStorage.setItem(SLEEP_TIMER_TARGET_KEY, String(targetEpochMs));
}
