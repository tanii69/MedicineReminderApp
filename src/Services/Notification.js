import { Platform, PermissionsAndroid } from "react-native";
import PushNotification, { Importance } from "react-native-push-notification"; 

async function requestNotificationPermission() {
  if (Platform.OS === 'android' && Platform.Version >= 33) {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    );
    if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
      console.log('Notification permission denied');
      return false;
    }
  }
  return true;
}

export async function initNotifications() {
  if (Platform.OS !== 'android') {
    return;
  }

  const hasPermission = await requestNotificationPermission();
  if (!hasPermission) return;

  PushNotification.configure({
    onNotification: function(notification) {
      console.log("NOTIFICATION:", notification);
    },
    requestPermissions: false,
  });

  PushNotification.createChannel(
    {
      channelId: "medibuddy-channel",
      channelName: "MediBuddy Channel",
      channelDescription: "Reminder to take your medicine",
      playSound: true,
      soundName: "default",
      importance: Importance.HIGH, 
      vibrate: true,
    },
    (created) => console.log("Channel created:", created)
  );
}

export function nextOccurrenceFromTime(hhmm) {
  const [h, m] = hhmm.split(':').map(Number);
  if (isNaN(h) || isNaN(m) || h > 23 || m > 59) {
    throw new Error("Invalid time format: " + hhmm);
  }
  const now = new Date();
  const dt = new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, m, 0, 0);
  if (dt <= now) {
    dt.setDate(dt.getDate() + 1);
  }
  return dt;
}

export function scheduleDailyMedicineNotification(medicine) {
  if (Platform.OS !== 'android') return;

  const when = nextOccurrenceFromTime(medicine.timeHHMM);
  PushNotification.localNotificationSchedule({
    channelId: "medibuddy-channel",
    message: `Take your Medicine or DIE ☠️⚰️: ${medicine.name} (${medicine.dose})`,
    date: when,
    allowWhileIdle: true, 
    repeatType: 'day',
    playSound: true,
    vibrate: true,
    importance: Importance.HIGH, 
  });
}

export function cancelAllNotifications() {
  if (Platform.OS !== 'android') return;

  PushNotification.cancelAllLocalNotifications();
  PushNotification.removeAllDeliveredNotifications();

  console.log('All Notifications cancelled');
}