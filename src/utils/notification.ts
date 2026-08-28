import { getReminderSettings, saveReminderSettings } from './storage';

export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!('Notification' in window)) {
    return false;
  }
  
  if (Notification.permission === 'granted') {
    return true;
  }
  
  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }
  
  return false;
};

export const sendStudyNotification = (title: string, body: string): void => {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(title, {
      body,
      icon: '/icon.png',
      badge: '/icon.png',
    });
  }
};

const motivationalQuotes = [
  'Masa terbaik untuk mengasah kemahiran matematik GCMT 2052 adalah hari ini!',
  'Latihan 10 soalan sehari menjamin kefahaman mantap sebelum peperiksaan.',
  'Uji ketepatan & kepantasan anda dengan Mod Cabaran Masa sekarang!',
  'Kecemerlangan lahir daripada konsistensi. Jom semak kemajuan matematik anda!',
  'Fahami formula, kuasai konsep, capai A dalam GCMT 2052!',
];

export const checkAndTriggerDailyReminder = (): boolean => {
  const settings = getReminderSettings();
  if (!settings.enabled) return false;

  const today = new Date().toISOString().split('T')[0];
  if (settings.lastNotifiedDate === today) {
    return false; // already notified today
  }

  const now = new Date();
  const currentHours = now.getHours().toString().padStart(2, '0');
  const currentMinutes = now.getMinutes().toString().padStart(2, '0');
  const currentTimeStr = `${currentHours}:${currentMinutes}`;

  // Check if current time is equal or past reminder time
  if (currentTimeStr >= settings.time) {
    const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
    sendStudyNotification('Peringatan Ulangkaji GCMT 2052 📚', randomQuote);
    saveReminderSettings({ lastNotifiedDate: today });
    return true;
  }

  return false;
};
