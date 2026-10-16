export interface Question {
  id: string;
  topicId: number;
  topicTitle: string;
  subtopicCode: string;
  questionNumber: number;
  questionText: string;
  options: {
    id: string;
    label: string;
    text: string;
  }[];
  correctAnswer: string; // 'A' | 'B' | 'C' | 'D'
  explanation: string;
  formulaUsed?: string;
  difficulty?: 'Mudah' | 'Sederhana' | 'Sukar';
  realLifeContext?: string; // e.g. "Farmasi / Kesihatan Persekitaran"
}

export interface TopicInfo {
  id: number;
  code: string;
  title: string;
  subtopics: string[];
  description: string;
  iconName: string;
  totalQuestions: number;
  color: string;
}

export interface UserAnswerRecord {
  questionId: string;
  selectedOptionId: string;
  isCorrect: boolean;
  timeSpentSeconds: number;
}

export interface QuizAttempt {
  id: string;
  topicId: number;
  topicTitle: string;
  mode: 'practice' | 'timed';
  totalQuestions: number;
  correctCount: number;
  score: number;
  timeSpentSeconds: number;
  date: string;
  answers: UserAnswerRecord[];
  studentIc?: string;
  studentName?: string;
  studentMatric?: string;
}

export interface ReminderSettings {
  enabled: boolean;
  time: string; // e.g. "20:00"
  days: string[];
  lastNotifiedDate: string | null;
}

export interface UserProfile {
  name: string;
  icNumber?: string;
  matricNumber?: string;
  institution?: string;
  programme?: string;
  targetScore: number;
  dailyGoalQuestions: number;
  streakDays: number;
  lastActiveDate: string;
  completedQuestions: string[];
  correctQuestions: string[];
  wrongQuestions: string[];
}

export interface UnitCertificateInfo {
  unitId: number;
  unitCode: string;
  unitTitle: string;
  score: number;
  correctCount: number;
  totalQuestions: number;
  completedDate: string;
  certificateId: string;
}

export interface RegisteredTrainee {
  icNumber: string; // Nombor Kad Pengenalan rasmi
  fullName: string; // Nama Penuh rasmi
  matricNumber?: string; // No Matrik (jika ada)
  programme: string; // Diploma Farmasi / Diploma Kesihatan Persekitaran
  institution: string; // ILKKM Sungai Buloh
  cohort: string; // Sesi 2026/2027
  registrationDate: string;
  status: 'Aktif' | 'Digantung';
}

export interface MatricAuthSession {
  isVerified: boolean;
  icNumber: string | null;
  matricNumber: string | null;
  studentName: string | null;
  programme: string | null;
  verifiedAt: string | null;
}

export interface TraineeAssessmentSummary {
  icNumber: string;
  fullName: string;
  matricNumber?: string;
  programme: string;
  status: 'Aktif' | 'Digantung';
  totalAttempts: number;
  completedTopics: number[];
  averageScore: number;
  highestScore: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'F' | 'Belum Dinilai';
  isEvaluated: boolean;
  lastAttemptDate: string | null;
  attempts: QuizAttempt[];
}

