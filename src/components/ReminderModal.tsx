import React, { useState } from 'react';
import { Bell, X, Check, Clock, Sparkles, Send } from 'lucide-react';
import { ReminderSettings, UserProfile } from '../types';
import { requestNotificationPermission, sendStudyNotification } from '../utils/notification';

interface ReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: ReminderSettings;
  userProfile: UserProfile;
  onSaveSettings: (settings: Partial<ReminderSettings>) => void;
  onSaveProfile: (profile: Partial<UserProfile>) => void;
}

export const ReminderModal: React.FC<ReminderModalProps> = ({
  isOpen,
  onClose,
  settings,
  userProfile,
  onSaveSettings,
  onSaveProfile,
}) => {
  const [enabled, setEnabled] = useState(settings.enabled);
  const [time, setTime] = useState(settings.time);
  const [dailyGoal, setDailyGoal] = useState(userProfile.dailyGoalQuestions || 15);
  const [targetScore, setTargetScore] = useState(userProfile.targetScore || 85);
  const [testSent, setTestSent] = useState(false);

  if (!isOpen) return null;

  const handleSave = async () => {
    if (enabled) {
      await requestNotificationPermission();
    }
    onSaveSettings({ enabled, time });
    onSaveProfile({ dailyGoalQuestions: dailyGoal, targetScore });
    onClose();
  };

  const handleTestNotification = async () => {
    const granted = await requestNotificationPermission();
    sendStudyNotification(
      'Ujian Peringatan GCMT 2052 📚',
      'Pemberitahuan peringatan harian anda telah berjaya diaktifkan! Jom mulakan latihan ulangkaji hari ini.'
    );
    setTestSent(true);
    setTimeout(() => setTestSent(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#4A4A40]/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-[32px] shadow-xl border border-[#E0E0D0] overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-[#E0E0D0] flex items-center justify-between bg-[#FAF9F5]">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#A3AD94] text-white flex items-center justify-center shadow-xs">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#4A4A40]">
                Peringatan Harian & Sasaran Ulangkaji
              </h3>
              <p className="text-xs text-[#7A7A6A]">Kekal konsisten belajar setiap hari</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#8A8A7A] hover:text-[#4A4A40] hover:bg-[#F5F5F0] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* Notification Toggle */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-[#E8F0E8]/40 border border-[#C8D6C4]">
            <div>
              <span className="text-sm font-bold text-[#4A4A40] block">
                Aktifkan Peringatan Harian
              </span>
              <span className="text-xs text-[#7A7A6A]">
                Terima notifikasi untuk membuat latihan matematik GCMT 2052
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={enabled}
                onChange={(e) => setEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-[#D9D9D0] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#A3AD94]"></div>
            </label>
          </div>

          {/* Time Picker */}
          {enabled && (
            <div className="space-y-2">
              <label className="block text-xs font-bold text-[#5A5A50] uppercase tracking-wider flex items-center gap-1">
                <Clock className="w-4 h-4 text-[#A3AD94]" />
                <span>Masa Peringatan Harian:</span>
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full p-3 rounded-2xl border border-[#E0E0D0] text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#A3AD94] bg-[#FAF9F5] text-[#4A4A40]"
              />
              <div className="pt-2">
                <button
                  onClick={handleTestNotification}
                  className="text-xs text-[#A3AD94] hover:text-[#8F9A7F] font-semibold flex items-center gap-1"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{testSent ? 'Notifikasi dihantar!' : 'Uji Notifikasi Sekarang'}</span>
                </button>
              </div>
            </div>
          )}

          {/* Daily Goal Settings */}
          <div className="space-y-4 pt-2 border-t border-[#E8E8E0]">
            <div>
              <label className="block text-xs font-bold text-[#5A5A50] uppercase tracking-wider mb-1.5">
                Sasaran Soalan Harian: ({dailyGoal} Soalan/Hari)
              </label>
              <input
                type="range"
                min="5"
                max="30"
                step="5"
                value={dailyGoal}
                onChange={(e) => setDailyGoal(Number(e.target.value))}
                className="w-full h-2 bg-[#E0E0D0] rounded-lg appearance-none cursor-pointer accent-[#A3AD94]"
              />
              <div className="flex justify-between text-[11px] text-[#8A8A7A] font-medium mt-1">
                <span>5 soalan</span>
                <span>15 soalan</span>
                <span>30 soalan</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#5A5A50] uppercase tracking-wider mb-1.5">
                Sasaran Markah Peperiksaan: ({targetScore}%)
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[75, 85, 95].map((score) => (
                  <button
                    key={score}
                    type="button"
                    onClick={() => setTargetScore(score)}
                    className={`py-2.5 rounded-2xl border text-xs font-bold transition-all ${
                      targetScore === score
                        ? 'bg-[#A3AD94] border-[#A3AD94] text-white shadow-xs'
                        : 'bg-[#FAF9F5] border-[#E0E0D0] text-[#5A5A50] hover:bg-[#F5F5F0]'
                    }`}
                  >
                    {score}% (Gred A{score === 95 ? '+' : score === 75 ? '-' : ''})
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-[#FAF9F5] border-t border-[#E0E0D0] flex items-center justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-2xl border border-[#E0E0D0] bg-white hover:bg-[#FAF9F5] text-[#5A5A50] text-xs font-semibold transition-colors"
          >
            Batal
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2.5 rounded-2xl bg-[#A3AD94] hover:bg-[#8F9A7F] text-white text-xs font-bold transition-colors shadow-xs"
          >
            Simpan Tetapan
          </button>
        </div>
      </div>
    </div>
  );
};
