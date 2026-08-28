import { QuizAttempt, UserProfile, ReminderSettings } from '../types';

const PROFILE_KEY = 'gcmt2052_user_profile';
const ATTEMPTS_KEY = 'gcmt2052_quiz_attempts';
const BOOKMARKS_KEY = 'gcmt2052_bookmarked_questions';
const REMINDER_KEY = 'gcmt2052_reminder_settings';

const defaultProfile: UserProfile = {
  name: 'MUHAMMAD AMIRUL AIMAN BIN ZULKIFLI',
  matricNumber: 'GCMT/2026/0482',
  institution: 'Institut Latihan Kementerian Kesihatan Malaysia Sungai Buloh',
  programme: 'Sains Kesihatan / Farmasi / Kesihatan Persekitaran',
  targetScore: 85,
  dailyGoalQuestions: 15,
  streakDays: 1,
  lastActiveDate: new Date().toISOString().split('T')[0],
  completedQuestions: [],
  correctQuestions: [],
  wrongQuestions: [],
};

const defaultReminder: ReminderSettings = {
  enabled: true,
  time: '20:00',
  days: ['Isnin', 'Selasa', 'Rabu', 'Khamis', 'Jumaat', 'Sabtu', 'Ahad'],
  lastNotifiedDate: null,
};

export const getStoredProfile = (): UserProfile => {
  try {
    const data = localStorage.getItem(PROFILE_KEY);
    if (!data) return defaultProfile;
    const parsed = JSON.parse(data);
    
    // Check streak
    const today = new Date().toISOString().split('T')[0];
    const lastActive = parsed.lastActiveDate || today;
    
    if (lastActive !== today) {
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      if (lastActive === yesterday) {
        parsed.streakDays = (parsed.streakDays || 0) + 1;
      } else {
        parsed.streakDays = 1;
      }
      parsed.lastActiveDate = today;
      localStorage.setItem(PROFILE_KEY, JSON.stringify(parsed));
    }
    
    return { ...defaultProfile, ...parsed };
  } catch (e) {
    console.error('Error loading profile', e);
    return defaultProfile;
  }
};

export const saveProfile = (profile: Partial<UserProfile>): UserProfile => {
  const current = getStoredProfile();
  const updated = { ...current, ...profile, lastActiveDate: new Date().toISOString().split('T')[0] };
  localStorage.setItem(PROFILE_KEY, JSON.stringify(updated));
  return updated;
};

export const getStoredAttempts = (): QuizAttempt[] => {
  try {
    const data = localStorage.getItem(ATTEMPTS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('Error loading attempts', e);
    return [];
  }
};

export const saveQuizAttempt = (attempt: QuizAttempt): void => {
  try {
    const attempts = getStoredAttempts();
    attempts.unshift(attempt); // newest first
    // Limit to 50 attempts for clean storage
    const trimmed = attempts.slice(0, 50);
    localStorage.setItem(ATTEMPTS_KEY, JSON.stringify(trimmed));

    // Update user profile statistics
    const profile = getStoredProfile();
    const completedSet = new Set(profile.completedQuestions);
    const correctSet = new Set(profile.correctQuestions);
    const wrongSet = new Set(profile.wrongQuestions);

    attempt.answers.forEach((ans) => {
      completedSet.add(ans.questionId);
      if (ans.isCorrect) {
        correctSet.add(ans.questionId);
        wrongSet.delete(ans.questionId);
      } else {
        wrongSet.add(ans.questionId);
        correctSet.delete(ans.questionId);
      }
    });

    saveProfile({
      completedQuestions: Array.from(completedSet),
      correctQuestions: Array.from(correctSet),
      wrongQuestions: Array.from(wrongSet),
    });
  } catch (e) {
    console.error('Error saving attempt', e);
  }
};

export const getBookmarkedQuestionIds = (): string[] => {
  try {
    const data = localStorage.getItem(BOOKMARKS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
};

export const toggleBookmarkQuestion = (questionId: string): string[] => {
  try {
    const current = getBookmarkedQuestionIds();
    const exists = current.includes(questionId);
    const updated = exists ? current.filter((id) => id !== questionId) : [...current, questionId];
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    return [];
  }
};

export const getReminderSettings = (): ReminderSettings => {
  try {
    const data = localStorage.getItem(REMINDER_KEY);
    return data ? JSON.parse(data) : defaultReminder;
  } catch (e) {
    return defaultReminder;
  }
};

export const saveReminderSettings = (settings: Partial<ReminderSettings>): ReminderSettings => {
  const current = getReminderSettings();
  const updated = { ...current, ...settings };
  localStorage.setItem(REMINDER_KEY, JSON.stringify(updated));
  return updated;
};

export const resetAllProgress = (): void => {
  localStorage.removeItem(PROFILE_KEY);
  localStorage.removeItem(ATTEMPTS_KEY);
  localStorage.removeItem(BOOKMARKS_KEY);
};
