import { QuizAttempt, TraineeAssessmentSummary, RegisteredTrainee } from '../types';
import { getRegisteredTrainees, normalizeIcNumber } from './matricAuth';

const TRAINEE_ASSESSMENTS_KEY = 'gcmt2052_trainee_assessments_store_v3';

// Kira gred berdasarkan markah purata
export const calculateGrade = (score: number): 'A' | 'B' | 'C' | 'D' | 'F' => {
  if (score >= 80) return 'A';
  if (score >= 70) return 'B';
  if (score >= 60) return 'C';
  if (score >= 50) return 'D';
  return 'F';
};

// Data penilaian awal dikosongkan (penilaian sebenar akan direkodkan apabila pelatih mengambil kuiz)
const initialSeededAssessments: Record<string, QuizAttempt[]> = {};

// Dapatkan keseluruhan peta penilaian pelatih
export const getTraineeAssessmentsMap = (): Record<string, QuizAttempt[]> => {
  try {
    if (typeof window !== "undefined") {
      if (localStorage.getItem("gcmt2052_trainee_assessments_store_v2")) {
        localStorage.removeItem("gcmt2052_trainee_assessments_store_v2");
      }
    }
    const raw = localStorage.getItem(TRAINEE_ASSESSMENTS_KEY);
    if (!raw) {
      localStorage.setItem(TRAINEE_ASSESSMENTS_KEY, JSON.stringify(initialSeededAssessments));
      return initialSeededAssessments;
    }
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : initialSeededAssessments;
  } catch (e) {
    console.error('Error fetching assessments store', e);
    return initialSeededAssessments;
  }
};

// Simpan peta penilaian pelatih
export const saveTraineeAssessmentsMap = (map: Record<string, QuizAttempt[]>): void => {
  try {
    localStorage.setItem(TRAINEE_ASSESSMENTS_KEY, JSON.stringify(map));
  } catch (e) {
    console.error('Error saving assessments store', e);
  }
};

// Catat percubaan kuiz untuk pelatih tertentu
export const recordTraineeQuizAttempt = (
  attempt: QuizAttempt,
  traineeIc?: string | null,
  traineeName?: string | null
): void => {
  if (!traineeIc) return;
  const normIc = normalizeIcNumber(traineeIc);
  if (!normIc) return;

  const map = getTraineeAssessmentsMap();
  const studentAttempts = map[normIc] ? [...map[normIc]] : [];

  const attemptWithStudent: QuizAttempt = {
    ...attempt,
    studentIc: traineeIc,
    studentName: traineeName || attempt.studentName || 'Pelatih',
  };

  studentAttempts.unshift(attemptWithStudent);
  map[normIc] = studentAttempts.slice(0, 50); // Simpan sehingga 50 percubaan
  saveTraineeAssessmentsMap(map);
};

// Padam rekod penilaian seorang pelatih oleh pengajar
export const resetSingleTraineeAssessment = (icNumber: string): void => {
  const normIc = normalizeIcNumber(icNumber);
  const map = getTraineeAssessmentsMap();
  if (map[normIc]) {
    delete map[normIc];
    saveTraineeAssessmentsMap(map);
  }
};

// Dapatkan senarai ringkasan pemantauan bagi semua pelatih
export const getAllTraineeAssessments = (): TraineeAssessmentSummary[] => {
  const trainees: RegisteredTrainee[] = getRegisteredTrainees();
  const assessmentsMap = getTraineeAssessmentsMap();

  return trainees.map((t) => {
    const norm = normalizeIcNumber(t.icNumber);
    const attempts = assessmentsMap[norm] || [];
    const isEvaluated = attempts.length > 0;

    let averageScore = 0;
    let highestScore = 0;
    let completedTopics: number[] = [];
    let lastAttemptDate: string | null = null;

    if (isEvaluated) {
      const totalScore = attempts.reduce((acc, curr) => acc + (curr.score || 0), 0);
      averageScore = Math.round(totalScore / attempts.length);
      highestScore = Math.max(...attempts.map((a) => a.score || 0));

      const topicSet = new Set<number>();
      attempts.forEach((a) => {
        if (a.topicId) topicSet.add(a.topicId);
      });
      completedTopics = Array.from(topicSet).sort((a, b) => a - b);
      lastAttemptDate = attempts[0]?.date || null;
    }

    const grade = isEvaluated ? calculateGrade(averageScore) : 'Belum Dinilai';

    return {
      icNumber: t.icNumber,
      fullName: t.fullName,
      matricNumber: t.matricNumber,
      programme: t.programme,
      status: t.status,
      totalAttempts: attempts.length,
      completedTopics,
      averageScore,
      highestScore,
      grade,
      isEvaluated,
      lastAttemptDate,
      attempts,
    };
  });
};

// Eksport laporan penilaian ke format CSV
export const exportAssessmentReportToCsv = (): string => {
  const list = getAllTraineeAssessments();
  const headers = [
    'Bil',
    'No. Kad Pengenalan',
    'Nama Penuh Pelatih',
    'No. Matrik',
    'Program',
    'Status Penilaian',
    'Bil. Percubaan',
    'Topik Dinilai',
    'Purata Skor (%)',
    'Skor Tertinggi (%)',
    'Gred',
    'Tarikh Penilaian Terkini',
  ];

  const rows = list.map((item, idx) => [
    idx + 1,
    `"${item.icNumber}"`,
    `"${item.fullName}"`,
    `"${item.matricNumber || '-'}"`,
    `"${item.programme}"`,
    `"${item.isEvaluated ? 'Telah Dinilai' : 'Belum Dinilai'}"`,
    item.totalAttempts,
    `"${item.completedTopics.length > 0 ? item.completedTopics.map((u) => `Unit ${u}`).join('; ') : '-'}"`,
    item.isEvaluated ? `${item.averageScore}%` : '-',
    item.isEvaluated ? `${item.highestScore}%` : '-',
    `"${item.grade}"`,
    `"${item.lastAttemptDate ? new Date(item.lastAttemptDate).toLocaleDateString('ms-MY') : '-'}"`,
  ]);

  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
};

// Padam semua rekod penilaian
export const clearAllTraineeAssessments = (): void => {
  saveTraineeAssessmentsMap({});
};
