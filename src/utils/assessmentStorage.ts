import { QuizAttempt, TraineeAssessmentSummary, RegisteredTrainee } from '../types';
import { getRegisteredTrainees, normalizeIcNumber } from './matricAuth';

const TRAINEE_ASSESSMENTS_KEY = 'gcmt2052_trainee_assessments_store_v2';

// Kira gred berdasarkan markah purata
export const calculateGrade = (score: number): 'A' | 'B' | 'C' | 'D' | 'F' => {
  if (score >= 80) return 'A';
  if (score >= 70) return 'B';
  if (score >= 60) return 'C';
  if (score >= 50) return 'D';
  return 'F';
};

// Data penilaian awal (sebenar & realistik) untuk beberapa pelatih ILKKM Sungai Buloh bagi rujukan pengajar
const initialSeededAssessments: Record<string, QuizAttempt[]> = {
  // 050114-10-1023: MUHAMMAD AMIRUL AIMAN BIN ZULKIFLI
  '050114101023': [
    {
      id: 'att-amirul-1',
      topicId: 1,
      topicTitle: 'Unit 1: Basic Mathematics Skills',
      mode: 'practice',
      totalQuestions: 15,
      correctCount: 14,
      score: 93,
      timeSpentSeconds: 430,
      date: '2026-02-10T09:30:00.000Z',
      answers: [],
      studentIc: '050114-10-1023',
      studentName: 'MUHAMMAD AMIRUL AIMAN BIN ZULKIFLI',
    },
    {
      id: 'att-amirul-2',
      topicId: 2,
      topicTitle: 'Unit 2: Linear & Quadratic Equations',
      mode: 'timed',
      totalQuestions: 15,
      correctCount: 13,
      score: 87,
      timeSpentSeconds: 520,
      date: '2026-02-12T14:15:00.000Z',
      answers: [],
      studentIc: '050114-10-1023',
      studentName: 'MUHAMMAD AMIRUL AIMAN BIN ZULKIFLI',
    },
    {
      id: 'att-amirul-3',
      topicId: 3,
      topicTitle: 'Unit 3: Simultaneous Equations',
      mode: 'timed',
      totalQuestions: 15,
      correctCount: 15,
      score: 100,
      timeSpentSeconds: 410,
      date: '2026-02-14T11:00:00.000Z',
      answers: [],
      studentIc: '050114-10-1023',
      studentName: 'MUHAMMAD AMIRUL AIMAN BIN ZULKIFLI',
    },
  ],
  // 050218-14-5210: NUR FARISHA BINTI MOHD FAIZAL
  '050218145210': [
    {
      id: 'att-farisha-1',
      topicId: 1,
      topicTitle: 'Unit 1: Basic Mathematics Skills',
      mode: 'practice',
      totalQuestions: 15,
      correctCount: 15,
      score: 100,
      timeSpentSeconds: 380,
      date: '2026-02-11T10:00:00.000Z',
      answers: [],
      studentIc: '050218-14-5210',
      studentName: 'NUR FARISHA BINTI MOHD FAIZAL',
    },
    {
      id: 'att-farisha-2',
      topicId: 4,
      topicTitle: 'Unit 4: Geometry & Trigonometry',
      mode: 'timed',
      totalQuestions: 15,
      correctCount: 14,
      score: 93,
      timeSpentSeconds: 480,
      date: '2026-02-13T16:20:00.000Z',
      answers: [],
      studentIc: '050218-14-5210',
      studentName: 'NUR FARISHA BINTI MOHD FAIZAL',
    },
  ],
  // 050309-10-6421: MUHAMMAD DANIAL BIN MOHD ROSLI
  '050309106421': [
    {
      id: 'att-danial-1',
      topicId: 1,
      topicTitle: 'Unit 1: Basic Mathematics Skills',
      mode: 'practice',
      totalQuestions: 15,
      correctCount: 11,
      score: 73,
      timeSpentSeconds: 610,
      date: '2026-02-09T08:45:00.000Z',
      answers: [],
      studentIc: '050309-10-6421',
      studentName: 'MUHAMMAD DANIAL BIN MOHD ROSLI',
    },
  ],
  // 050412-08-3318: SITI NURHALIZA BINTI KAMARUDDIN
  '050412083318': [
    {
      id: 'att-siti-1',
      topicId: 1,
      topicTitle: 'Unit 1: Basic Mathematics Skills',
      mode: 'timed',
      totalQuestions: 15,
      correctCount: 14,
      score: 93,
      timeSpentSeconds: 405,
      date: '2026-02-08T15:10:00.000Z',
      answers: [],
      studentIc: '050412-08-3318',
      studentName: 'SITI NURHALIZA BINTI KAMARUDDIN',
    },
    {
      id: 'att-siti-2',
      topicId: 5,
      topicTitle: 'Unit 5: Statistics & Probability',
      mode: 'timed',
      totalQuestions: 15,
      correctCount: 13,
      score: 87,
      timeSpentSeconds: 490,
      date: '2026-02-14T09:15:00.000Z',
      answers: [],
      studentIc: '050412-08-3318',
      studentName: 'SITI NURHALIZA BINTI KAMARUDDIN',
    },
  ],
  // 050702-08-4425: DANISH IRFAN BIN ZAHARIN
  '050702084425': [
    {
      id: 'att-danish-1',
      topicId: 1,
      topicTitle: 'Unit 1: Basic Mathematics Skills',
      mode: 'practice',
      totalQuestions: 15,
      correctCount: 12,
      score: 80,
      timeSpentSeconds: 510,
      date: '2026-02-12T11:40:00.000Z',
      answers: [],
      studentIc: '050702-08-4425',
      studentName: 'DANISH IRFAN BIN ZAHARIN',
    },
    {
      id: 'att-danish-2',
      topicId: 2,
      topicTitle: 'Unit 2: Linear & Quadratic Equations',
      mode: 'practice',
      totalQuestions: 15,
      correctCount: 11,
      score: 73,
      timeSpentSeconds: 580,
      date: '2026-02-15T14:00:00.000Z',
      answers: [],
      studentIc: '050702-08-4425',
      studentName: 'DANISH IRFAN BIN ZAHARIN',
    },
  ],
  // 050122-10-5541: AHMAD ZULKIFLI BIN HASSAN
  '050122105541': [
    {
      id: 'att-zulkifli-1',
      topicId: 1,
      topicTitle: 'Unit 1: Basic Mathematics Skills',
      mode: 'timed',
      totalQuestions: 15,
      correctCount: 15,
      score: 100,
      timeSpentSeconds: 360,
      date: '2026-02-13T10:15:00.000Z',
      answers: [],
      studentIc: '050122-10-5541',
      studentName: 'AHMAD ZULKIFLI BIN HASSAN',
    },
  ],
  // 050209-10-9225: AIDIL ZAFRAN BIN RAMLI
  '050209109225': [
    {
      id: 'att-aidil-1',
      topicId: 1,
      topicTitle: 'Unit 1: Basic Mathematics Skills',
      mode: 'timed',
      totalQuestions: 15,
      correctCount: 13,
      score: 87,
      timeSpentSeconds: 460,
      date: '2026-02-14T15:30:00.000Z',
      answers: [],
      studentIc: '050209-10-9225',
      studentName: 'AIDIL ZAFRAN BIN RAMLI',
    },
  ],
};

// Dapatkan keseluruhan peta penilaian pelatih
export const getTraineeAssessmentsMap = (): Record<string, QuizAttempt[]> => {
  try {
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
