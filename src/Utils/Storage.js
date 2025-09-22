import AsyncStorage from "@react-native-async-storage/async-storage";

const KEYS = {
  USER: 'user',
  MEDS: 'medicines',
  STATS: 'mr_stats',
};

export async function saveUser(username) {
  await AsyncStorage.setItem(KEYS.USER, JSON.stringify(username));
}

export async function getUser() {
  const raw = await AsyncStorage.getItem(KEYS.USER);
  return raw ? JSON.parse(raw) : null;
}

export async function getMedicines() {
  const raw = await AsyncStorage.getItem(KEYS.MEDS);
  return raw ? JSON.parse(raw) : [];
}

export async function saveMedicines(meds) {
  await AsyncStorage.setItem(KEYS.MEDS, JSON.stringify(meds));
}

export async function getStats() {
  const raw = await AsyncStorage.getItem(KEYS.STATS);
  return raw ? JSON.parse(raw) : {};
}

export async function saveStats(stats) {
  await AsyncStorage.setItem(KEYS.STATS, JSON.stringify(stats));
}

export function todayKey(d = new Date()) {
  return d.toISOString().slice(0, 10);
}