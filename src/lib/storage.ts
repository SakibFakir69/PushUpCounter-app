import AsyncStorage from "@react-native-async-storage/async-storage";

const PREFIX = "repup:";

export const keys = {
  onboarded: `${PREFIX}onboarded`,
  session: `${PREFIX}session`,
} as const;

export async function getItem<T>(key: string): Promise<T | null> {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export async function setItem<T>(key: string, value: T): Promise<void> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch {
    // best-effort; storage failure should never crash the UI
  }
}

export async function removeItem(key: string): Promise<void> {
  try {
    await AsyncStorage.removeItem(key);
  } catch {
    // ignore
  }
}

export async function isOnboarded(): Promise<boolean> {
  return (await getItem<boolean>(keys.onboarded)) === true;
}

export async function setOnboarded(): Promise<void> {
  await setItem(keys.onboarded, true);
}
