import { RegisteredTrainee, MatricAuthSession } from '../types';
import { getStoredProfile, saveProfile } from './storage';

const REGISTERED_TRAINEES_KEY = 'gcmt2052_registered_trainees_v1';
const MATRIC_SESSION_KEY = 'gcmt2052_matric_session_v1';
const OWNER_PASSWORD_KEY = 'gcmt2052_owner_password_v1';

// Senarai kata laluan lalai yang diterima bagi Pengajar / Owner ILKKM Sungai Buloh
export const DEFAULT_OWNER_PASSWORDS = ['OWNER2026', 'PENSYARAH2026', 'ILKKMSB2026', 'NORASHIKIN2026'];

export const OFFICIAL_INSTITUTION_NAME = 'Institut Latihan Kementerian Kesihatan Malaysia Sungai Buloh';

// Semak dan peroleh kata laluan Owner semasa
export const getOwnerPassword = (): string => {
  return localStorage.getItem(OWNER_PASSWORD_KEY) || 'OWNER2026';
};

// Pengesahan kata laluan Owner
export const verifyOwnerPassword = (inputPass: string): boolean => {
  const cleanInput = inputPass.trim();
  const currentOwnerPass = getOwnerPassword();
  if (cleanInput === currentOwnerPass) return true;
  return DEFAULT_OWNER_PASSWORDS.some((p) => p.toUpperCase() === cleanInput.toUpperCase());
};

// Kemaskini kata laluan Owner
export const updateOwnerPassword = (newPass: string): { success: boolean; message: string } => {
  const clean = newPass.trim();
  if (clean.length < 4) {
    return { success: false, message: 'Kata laluan Owner mestilah sekurang-kurangnya 4 aksara.' };
  }
  localStorage.setItem(OWNER_PASSWORD_KEY, clean);
  return { success: true, message: 'Kata laluan Owner berjaya dikemaskini.' };
};

// Senarai asal pelatih berdaftar di ILKKM Sungai Buloh bagi kursus GCMT 2052
const defaultRegisteredTrainees: RegisteredTrainee[] = [
  {
    matricNumber: 'GCMT/2026/0482',
    fullName: 'MUHAMMAD AMIRUL AIMAN BIN ZULKIFLI',
    programme: 'Diploma Farmasi',
    institution: OFFICIAL_INSTITUTION_NAME,
    cohort: 'Sesi 2026/2027',
    registrationDate: '2026-01-05',
    status: 'Aktif',
  },
  {
    matricNumber: 'ILKKMSB/2026/0041',
    fullName: 'NORASHIKIN BINTI HASHIM',
    programme: 'Diploma Farmasi',
    institution: OFFICIAL_INSTITUTION_NAME,
    cohort: 'Sesi 2026/2027',
    registrationDate: '2026-01-05',
    status: 'Aktif',
  },
  {
    matricNumber: 'GCMT/2026/0115',
    fullName: 'NUR AINA NATASHA BINTI AHMAD',
    programme: 'Diploma Kesihatan Persekitaran',
    institution: OFFICIAL_INSTITUTION_NAME,
    cohort: 'Sesi 2026/2027',
    registrationDate: '2026-01-08',
    status: 'Aktif',
  },
  {
    matricNumber: 'GCMT/2026/0234',
    fullName: 'MUHAMMAD DANIAL BIN MOHD ROSLI',
    programme: 'Diploma Farmasi',
    institution: OFFICIAL_INSTITUTION_NAME,
    cohort: 'Sesi 2026/2027',
    registrationDate: '2026-01-08',
    status: 'Aktif',
  },
  {
    matricNumber: 'GCMT/2026/0345',
    fullName: 'SITI NURHALIZA BINTI KAMARUDDIN',
    programme: 'Diploma Sains Kejururawatan',
    institution: OFFICIAL_INSTITUTION_NAME,
    cohort: 'Sesi 2026/2027',
    registrationDate: '2026-01-10',
    status: 'Aktif',
  },
  {
    matricNumber: 'ILKKMSB/2026/0101',
    fullName: 'MOHAMAD FARHAN BIN ABDULLAH',
    programme: 'Diploma Pembantu Pegawai Perubatan',
    institution: OFFICIAL_INSTITUTION_NAME,
    cohort: 'Sesi 2026/2027',
    registrationDate: '2026-01-12',
    status: 'Aktif',
  },
  {
    matricNumber: 'ILKKMSB/2026/0102',
    fullName: 'NURUL IZZAH BINTI ISMAIL',
    programme: 'Diploma Kesihatan Persekitaran',
    institution: OFFICIAL_INSTITUTION_NAME,
    cohort: 'Sesi 2026/2027',
    registrationDate: '2026-01-12',
    status: 'Aktif',
  },
  {
    matricNumber: 'DPF/2026/0055',
    fullName: 'AHMAD FAIZ BIN KHAIRUL',
    programme: 'Diploma Farmasi',
    institution: OFFICIAL_INSTITUTION_NAME,
    cohort: 'Sesi 2026/2027',
    registrationDate: '2026-01-15',
    status: 'Aktif',
  },
  {
    matricNumber: 'DPKP/2026/0078',
    fullName: 'WAN AISHAH BINTI WAN ZAKI',
    programme: 'Diploma Kesihatan Persekitaran',
    institution: OFFICIAL_INSTITUTION_NAME,
    cohort: 'Sesi 2026/2027',
    registrationDate: '2026-01-15',
    status: 'Aktif',
  },
];

export const normalizeMatric = (matric: string): string => {
  return matric.trim().toUpperCase().replace(/\s+/g, '');
};

// Dapatkan senarai pelatih berdaftar
export const getRegisteredTrainees = (): RegisteredTrainee[] => {
  try {
    const raw = localStorage.getItem(REGISTERED_TRAINEES_KEY);
    if (!raw) {
      localStorage.setItem(REGISTERED_TRAINEES_KEY, JSON.stringify(defaultRegisteredTrainees));
      return defaultRegisteredTrainees;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(REGISTERED_TRAINEES_KEY, JSON.stringify(defaultRegisteredTrainees));
      return defaultRegisteredTrainees;
    }
    return parsed;
  } catch (e) {
    console.error('Error fetching registered trainees', e);
    return defaultRegisteredTrainees;
  }
};

// Simpan senarai pelatih
export const saveRegisteredTrainees = (list: RegisteredTrainee[]): void => {
  localStorage.setItem(REGISTERED_TRAINEES_KEY, JSON.stringify(list));
};

// Dapatkan sesi matrik aktif
export const getMatricSession = (): MatricAuthSession => {
  try {
    const raw = localStorage.getItem(MATRIC_SESSION_KEY);
    if (!raw) {
      // Periksa jika profil sedia ada telah mempunyai matrik sah
      const profile = getStoredProfile();
      if (profile.matricNumber) {
        const norm = normalizeMatric(profile.matricNumber);
        const trainees = getRegisteredTrainees();
        const found = trainees.find((t) => normalizeMatric(t.matricNumber) === norm);
        if (found) {
          const autoSession: MatricAuthSession = {
            isVerified: true,
            matricNumber: found.matricNumber,
            studentName: found.fullName,
            programme: found.programme,
            verifiedAt: new Date().toISOString(),
          };
          localStorage.setItem(MATRIC_SESSION_KEY, JSON.stringify(autoSession));
          return autoSession;
        }
      }

      return {
        isVerified: false,
        matricNumber: null,
        studentName: null,
        programme: null,
        verifiedAt: null,
      };
    }
    return JSON.parse(raw);
  } catch (e) {
    return {
      isVerified: false,
      matricNumber: null,
      studentName: null,
      programme: null,
      verifiedAt: null,
    };
  }
};

// Semak dan log masuk menggunakan no matrik berdaftar
export const verifyAndLoginMatric = (
  matricInput: string
): { success: boolean; message: string; trainee?: RegisteredTrainee } => {
  const normalized = normalizeMatric(matricInput);
  if (!normalized) {
    return {
      success: false,
      message: 'Sila masukkan nombor matrik anda.',
    };
  }

  const trainees = getRegisteredTrainees();
  const matched = trainees.find((t) => normalizeMatric(t.matricNumber) === normalized);

  if (matched) {
    if (matched.status === 'Digantung') {
      return {
        success: false,
        message: 'Akaun pelatih ini telah digantung. Sila hubungi Penyelaras Kursus ILKKM Sungai Buloh.',
      };
    }

    const session: MatricAuthSession = {
      isVerified: true,
      matricNumber: matched.matricNumber,
      studentName: matched.fullName,
      programme: matched.programme,
      verifiedAt: new Date().toISOString(),
    };
    localStorage.setItem(MATRIC_SESSION_KEY, JSON.stringify(session));

    // Segerakkan profil pengguna
    saveProfile({
      name: matched.fullName,
      matricNumber: matched.matricNumber,
      institution: OFFICIAL_INSTITUTION_NAME,
      programme: matched.programme,
    });

    return {
      success: true,
      message: `Selamat datang, ${matched.fullName}! Akses soalan GCMT 2052 ILKKM Sungai Buloh telah dibuka.`,
      trainee: matched,
    };
  }

  // Jika nombor matrik tiada dalam pangkalan data berdaftar
  return {
    success: false,
    message: `Akses Ditolak: Nombor matrik "${matricInput}" tidak dijumpai dalam daftar pelatih ILKKM Sungai Buloh. Pelatih dari kolej vokasional, matrikulasi atau kolej lain tidak dibenarkan mengakses soalan ini.`,
  };
};

// ==========================================
// PENGURUSAN OLEH OWNER / PENGAJAR SAHAJA
// ==========================================

// Tambah pelatih tunggal oleh Owner
export const addTraineeByOwner = (params: {
  matricNumber: string;
  fullName: string;
  programme: string;
  cohort?: string;
}): { success: boolean; message: string; trainee?: RegisteredTrainee } => {
  const normalizedMatric = normalizeMatric(params.matricNumber);
  const normalizedName = params.fullName.trim().toUpperCase();

  if (!normalizedMatric || !normalizedName) {
    return {
      success: false,
      message: 'Sila lengkapkan nama penuh dan nombor matrik pelatih.',
    };
  }

  const trainees = getRegisteredTrainees();
  const exists = trainees.find((t) => normalizeMatric(t.matricNumber) === normalizedMatric);
  if (exists) {
    return {
      success: false,
      message: `Nombor matrik ${normalizedMatric} sudah wujud dalam senarai (Didaftarkan kepada: ${exists.fullName}).`,
    };
  }

  const newTrainee: RegisteredTrainee = {
    matricNumber: normalizedMatric,
    fullName: normalizedName,
    programme: params.programme || 'Diploma Farmasi',
    institution: OFFICIAL_INSTITUTION_NAME,
    cohort: params.cohort || 'Sesi 2026/2027',
    registrationDate: new Date().toISOString().split('T')[0],
    status: 'Aktif',
  };

  const updatedList = [newTrainee, ...trainees];
  saveRegisteredTrainees(updatedList);

  return {
    success: true,
    message: `Pelatih ${newTrainee.fullName} (${newTrainee.matricNumber}) berjaya didaftarkan oleh Owner ke dalam sistem ILKKM Sungai Buloh.`,
    trainee: newTrainee,
  };
};

// Import berkelompok (Batch Import) senarai No. Matrik oleh Owner
// Menerima input teks berbilang baris, contoh:
// ILKKMSB/2026/001 - AHMAD BIN ALI - Diploma Farmasi
// GCMT/2026/002, SITI AMINAH, Diploma Kejururawatan
// DPF/2026/003
export const batchImportTraineesByOwner = (
  rawText: string,
  defaultProgramme: string = 'Diploma Farmasi'
): {
  success: boolean;
  addedCount: number;
  duplicateCount: number;
  invalidCount: number;
  message: string;
} => {
  const lines = rawText.split(/\r?\n/).map((l) => l.trim()).filter((l) => l.length > 0);

  if (lines.length === 0) {
    return {
      success: false,
      addedCount: 0,
      duplicateCount: 0,
      invalidCount: 0,
      message: 'Tiada teks ditemui untuk diimport. Sila tampal senarai nombor matrik.',
    };
  }

  const trainees = getRegisteredTrainees();
  const existingSet = new Set(trainees.map((t) => normalizeMatric(t.matricNumber)));

  const newEntries: RegisteredTrainee[] = [];
  let duplicateCount = 0;
  let invalidCount = 0;

  for (const line of lines) {
    // Abaikan baris komen
    if (line.startsWith('#') || line.startsWith('//')) continue;

    // Pembahagian baris menggunakan koma (,), sempang (-), atau tab (\t)
    let parts: string[] = [];
    if (line.includes('\t')) {
      parts = line.split('\t');
    } else if (line.includes(',')) {
      parts = line.split(',');
    } else if (line.includes(' - ')) {
      parts = line.split(' - ');
    } else if (line.includes('-')) {
      parts = line.split('-');
    } else {
      parts = [line];
    }

    const rawMatric = parts[0]?.trim();
    const rawName = parts[1]?.trim();
    const rawProg = parts[2]?.trim();

    const normalizedMatric = normalizeMatric(rawMatric || '');
    if (!normalizedMatric || normalizedMatric.length < 3) {
      invalidCount++;
      continue;
    }

    if (existingSet.has(normalizedMatric)) {
      duplicateCount++;
      continue;
    }

    const fullName = rawName
      ? rawName.toUpperCase()
      : `PELATIH ILKKM (${normalizedMatric})`;
    const programme = rawProg || defaultProgramme;

    const trainee: RegisteredTrainee = {
      matricNumber: normalizedMatric,
      fullName,
      programme,
      institution: OFFICIAL_INSTITUTION_NAME,
      cohort: 'Sesi 2026/2027',
      registrationDate: new Date().toISOString().split('T')[0],
      status: 'Aktif',
    };

    newEntries.push(trainee);
    existingSet.add(normalizedMatric);
  }

  if (newEntries.length === 0) {
    return {
      success: false,
      addedCount: 0,
      duplicateCount,
      invalidCount,
      message: `Tiada nombor matrik baharu berjaya ditambah. (${duplicateCount} pendua, ${invalidCount} tidak sah).`,
    };
  }

  const updatedList = [...newEntries, ...trainees];
  saveRegisteredTrainees(updatedList);

  return {
    success: true,
    addedCount: newEntries.length,
    duplicateCount,
    invalidCount,
    message: `Berjaya memasukkan ${newEntries.length} nombor matrik pelatih baharu ke dalam senarai berdaftar ILKKM Sungai Buloh! (${duplicateCount} pendua diabaikan).`,
  };
};

// Padam pelatih daripada senarai oleh Owner
export const deleteTraineeByOwner = (matricNumber: string): { success: boolean; message: string } => {
  const norm = normalizeMatric(matricNumber);
  const trainees = getRegisteredTrainees();
  const filtered = trainees.filter((t) => normalizeMatric(t.matricNumber) !== norm);

  if (filtered.length === trainees.length) {
    return { success: false, message: 'Nombor matrik tidak dijumpai.' };
  }

  saveRegisteredTrainees(filtered);

  // Jika sesi semasa menggunakan matrik ini, batalkan sesi
  const session = getMatricSession();
  if (session.matricNumber && normalizeMatric(session.matricNumber) === norm) {
    logoutMatricSession();
  }

  return { success: true, message: `Nombor matrik ${matricNumber} telah dipadam daripada senarai berdaftar.` };
};

// Tukar status pelatih (Aktif / Digantung) oleh Owner
export const toggleTraineeStatusByOwner = (matricNumber: string): { success: boolean; newStatus?: string; message: string } => {
  const norm = normalizeMatric(matricNumber);
  const trainees = getRegisteredTrainees();
  const target = trainees.find((t) => normalizeMatric(t.matricNumber) === norm);

  if (!target) {
    return { success: false, message: 'Nombor matrik tidak dijumpai.' };
  }

  const newStatus = target.status === 'Aktif' ? 'Digantung' : 'Aktif';
  target.status = newStatus as 'Aktif' | 'Digantung';

  saveRegisteredTrainees([...trainees]);

  // Jika digantung dan sedang login, batalkan sesi
  if (newStatus === 'Digantung') {
    const session = getMatricSession();
    if (session.matricNumber && normalizeMatric(session.matricNumber) === norm) {
      logoutMatricSession();
    }
  }

  return { 
    success: true, 
    newStatus, 
    message: `Status pelatih ${target.fullName} ditukar kepada "${newStatus}".` 
  };
};

// Tetapkan semula ke senarai pelatih lalai ILKKM Sungai Buloh
export const resetRegisteredTraineesToDefault = (): void => {
  localStorage.setItem(REGISTERED_TRAINEES_KEY, JSON.stringify(defaultRegisteredTrainees));
};

// Log keluar sesi
export const logoutMatricSession = (): void => {
  localStorage.removeItem(MATRIC_SESSION_KEY);
};

// Semak adakah akses soalan dibenarkan
export const isMatricVerified = (): boolean => {
  const session = getMatricSession();
  return session.isVerified && !!session.matricNumber;
};
