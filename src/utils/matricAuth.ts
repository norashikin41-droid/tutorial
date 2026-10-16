import { RegisteredTrainee, MatricAuthSession } from '../types';
import { getStoredProfile, saveProfile } from './storage';

const REGISTERED_TRAINEES_KEY = 'gcmt2052_registered_trainees_v2';
const MATRIC_SESSION_KEY = 'gcmt2052_matric_session_v2';
const OWNER_PASSWORD_KEY = 'gcmt2052_owner_password_v2';

// Senarai kata laluan lalai yang diterima bagi Pengajar / Owner ILKKM Sungai Buloh
export const DEFAULT_OWNER_PASSWORDS = ['200810', 'OWNER2026', 'NORASHIKIN2026', 'PENSYARAH2026', 'ILKKMSB2026'];

export const OFFICIAL_INSTITUTION_NAME = 'Institut Latihan Kementerian Kesihatan Malaysia Sungai Buloh';

// Semak dan peroleh kata laluan Owner semasa
export const getOwnerPassword = (): string => {
  return localStorage.getItem(OWNER_PASSWORD_KEY) || '200810';
};

// Pengesahan kata laluan Owner
export const verifyOwnerPassword = (inputPass: string): boolean => {
  const cleanInput = inputPass.trim();
  if (cleanInput === '200810') return true;
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

// Normalisasi Nombor Kad Pengenalan (membuang sengkang, ruang dan hanya mengambil digit)
export const normalizeIcNumber = (ic: string): string => {
  return (ic || '').replace(/[^0-9]/g, '').trim();
};

// Format Nombor Kad Pengenalan kepada XXXXXX-XX-XXXX untuk paparan
export const formatIcNumber = (ic: string): string => {
  const clean = normalizeIcNumber(ic);
  if (clean.length === 12) {
    return `${clean.slice(0, 6)}-${clean.slice(6, 8)}-${clean.slice(8, 12)}`;
  }
  return ic.trim();
};

// Normalisasi Nama Penuh (huruf besar, hapus ruang berlebihan)
export const normalizeFullName = (name: string): string => {
  return (name || '')
    .trim()
    .toUpperCase()
    .replace(/\s+/g, ' ');
};

// Normalisasi No Matrik
export const normalizeMatric = (matric: string): string => {
  return (matric || '').trim().toUpperCase().replace(/\s+/g, '');
};

// Semak padanan nama (toleransi perbezaan kecil seperti 'BIN' / 'BINTI')
export const isNameMatching = (inputName: string, officialName: string): boolean => {
  const n1 = normalizeFullName(inputName);
  const n2 = normalizeFullName(officialName);

  if (n1 === n2) return true;

  // Normalisasi gantian 'BIN'/'BINTI'/'B.'/'BT.'
  const simplify = (str: string) =>
    str
      .replace(/\bBINTI\b/g, 'BT')
      .replace(/\bBIN\b/g, 'B')
      .replace(/\bANAK LELAKI\b/g, 'AL')
      .replace(/\bANAK PEREMPUAN\b/g, 'AP')
      .replace(/[^A-Z]/g, '');

  return simplify(n1) === simplify(n2);
};

// Senarai rasmi 42 orang pelatih ILKKM Sungai Buloh bagi kursus GCMT 2052
export const defaultRegisteredTrainees: RegisteredTrainee[] = [
  {
    icNumber: '050114-10-1023',
    fullName: 'MUHAMMAD AMIRUL AIMAN BIN ZULKIFLI',
    matricNumber: 'DPF/2026/001',
    programme: 'Diploma Farmasi',
    institution: OFFICIAL_INSTITUTION_NAME,
    cohort: 'Sesi 2026/2027',
    registrationDate: '2026-01-05',
    status: 'Aktif',
  },
  {
    icNumber: '050218-14-5210',
    fullName: 'NUR FARISHA BINTI MOHD FAIZAL',
    matricNumber: 'DPF/2026/002',
    programme: 'Diploma Farmasi',
    institution: OFFICIAL_INSTITUTION_NAME,
    cohort: 'Sesi 2026/2027',
    registrationDate: '2026-01-05',
    status: 'Aktif',
  },
  {
    icNumber: '050309-10-6421',
    fullName: 'MUHAMMAD DANIAL BIN MOHD ROSLI',
    matricNumber: 'DPF/2026/003',
    programme: 'Diploma Farmasi',
    institution: OFFICIAL_INSTITUTION_NAME,
    cohort: 'Sesi 2026/2027',
    registrationDate: '2026-01-05',
    status: 'Aktif',
  },
  {
    icNumber: '050412-08-3318',
    fullName: 'SITI NURHALIZA BINTI KAMARUDDIN',
    matricNumber: 'DPF/2026/004',
    programme: 'Diploma Farmasi',
    institution: OFFICIAL_INSTITUTION_NAME,
    cohort: 'Sesi 2026/2027',
    registrationDate: '2026-01-05',
    status: 'Aktif',
  },
  {
    icNumber: '050523-10-7791',
    fullName: 'AHMAD FAIZ BIN KHAIRUL AZMAN',
    matricNumber: 'DPF/2026/005',
    programme: 'Diploma Farmasi',
    institution: OFFICIAL_INSTITUTION_NAME,
    cohort: 'Sesi 2026/2027',
    registrationDate: '2026-01-05',
    status: 'Aktif',
  },
  {
    icNumber: '050604-01-2184',
    fullName: 'NUR AINA NATASHA BINTI AHMAD',
    matricNumber: 'DPF/2026/006',
    programme: 'Diploma Farmasi',
    institution: OFFICIAL_INSTITUTION_NAME,
    cohort: 'Sesi 2026/2027',
    registrationDate: '2026-01-05',
    status: 'Aktif',
  },
  {
    icNumber: '050719-14-4902',
    fullName: 'WAN AISHAH BINTI WAN ZAKI',
    matricNumber: 'DPF/2026/007',
    programme: 'Diploma Farmasi',
    institution: OFFICIAL_INSTITUTION_NAME,
    cohort: 'Sesi 2026/2027',
    registrationDate: '2026-01-05',
    status: 'Aktif',
  },
  {
    icNumber: '050808-10-1135',
    fullName: 'MOHAMAD FARHAN BIN ABDULLAH',
    matricNumber: 'DPF/2026/008',
    programme: 'Diploma Farmasi',
    institution: OFFICIAL_INSTITUTION_NAME,
    cohort: 'Sesi 2026/2027',
    registrationDate: '2026-01-05',
    status: 'Aktif',
  },
  {
    icNumber: '050915-08-6624',
    fullName: 'NURUL IZZAH BINTI ISMAIL',
    matricNumber: 'DPF/2026/009',
    programme: 'Diploma Farmasi',
    institution: OFFICIAL_INSTITUTION_NAME,
    cohort: 'Sesi 2026/2027',
    registrationDate: '2026-01-05',
    status: 'Aktif',
  },
  {
    icNumber: '051022-10-8913',
    fullName: 'MUHAMMAD HARITH BIN NORAZMAN',
    matricNumber: 'DPF/2026/010',
    programme: 'Diploma Farmasi',
    institution: OFFICIAL_INSTITUTION_NAME,
    cohort: 'Sesi 2026/2027',
    registrationDate: '2026-01-05',
    status: 'Aktif',
  },
  {
    icNumber: '051105-03-3450',
    fullName: 'NURUL SYAFIQAH BINTI ZAINAL',
    matricNumber: 'DPF/2026/011',
    programme: 'Diploma Farmasi',
    institution: OFFICIAL_INSTITUTION_NAME,
    cohort: 'Sesi 2026/2027',
    registrationDate: '2026-01-05',
    status: 'Aktif',
  },
  {
    icNumber: '051211-10-7649',
    fullName: 'KHAIRUL ANUAR BIN MD NOR',
    matricNumber: 'DPF/2026/012',
    programme: 'Diploma Farmasi',
    institution: OFFICIAL_INSTITUTION_NAME,
    cohort: 'Sesi 2026/2027',
    registrationDate: '2026-01-05',
    status: 'Aktif',
  },
  {
    icNumber: '050125-14-6012',
    fullName: 'NURUL HUDA BINTI ABDUL HALIM',
    matricNumber: 'DPF/2026/013',
    programme: 'Diploma Farmasi',
    institution: OFFICIAL_INSTITUTION_NAME,
    cohort: 'Sesi 2026/2027',
    registrationDate: '2026-01-05',
    status: 'Aktif',
  },
  {
    icNumber: '050203-08-8121',
    fullName: 'MUHAMMAD AFIQ BIN RUSLI',
    matricNumber: 'DPF/2026/014',
    programme: 'Diploma Farmasi',
    institution: OFFICIAL_INSTITUTION_NAME,
    cohort: 'Sesi 2026/2027',
    registrationDate: '2026-01-05',
    status: 'Aktif',
  },
  {
    icNumber: '050319-10-5340',
    fullName: 'FATIN NABILAH BINTI HASNOL',
    matricNumber: 'DPF/2026/015',
    programme: 'Diploma Farmasi',
    institution: OFFICIAL_INSTITUTION_NAME,
    cohort: 'Sesi 2026/2027',
    registrationDate: '2026-01-05',
    status: 'Aktif',
  },
  {
    icNumber: '050428-02-1277',
    fullName: 'AMIRAH HUSNA BINTI SHAMSUL',
    matricNumber: 'DPF/2026/016',
    programme: 'Diploma Farmasi',
    institution: OFFICIAL_INSTITUTION_NAME,
    cohort: 'Sesi 2026/2027',
    registrationDate: '2026-01-05',
    status: 'Aktif',
  },
  {
    icNumber: '050516-10-9083',
    fullName: 'MUHAMMAD LUQMAN HAKIM BIN RADZI',
    matricNumber: 'DPF/2026/017',
    programme: 'Diploma Farmasi',
    institution: OFFICIAL_INSTITUTION_NAME,
    cohort: 'Sesi 2026/2027',
    registrationDate: '2026-01-05',
    status: 'Aktif',
  },
  {
    icNumber: '050629-14-3516',
    fullName: 'ANIS SYAZWANI BINTI AZHAR',
    matricNumber: 'DPF/2026/018',
    programme: 'Diploma Farmasi',
    institution: OFFICIAL_INSTITUTION_NAME,
    cohort: 'Sesi 2026/2027',
    registrationDate: '2026-01-05',
    status: 'Aktif',
  },
  {
    icNumber: '050702-08-4425',
    fullName: 'DANISH IRFAN BIN ZAHARIN',
    matricNumber: 'DPF/2026/019',
    programme: 'Diploma Farmasi',
    institution: OFFICIAL_INSTITUTION_NAME,
    cohort: 'Sesi 2026/2027',
    registrationDate: '2026-01-05',
    status: 'Aktif',
  },
  {
    icNumber: '050824-10-7098',
    fullName: 'NUR ALYA MAISARAH BINTI YUSOF',
    matricNumber: 'DPF/2026/020',
    programme: 'Diploma Farmasi',
    institution: OFFICIAL_INSTITUTION_NAME,
    cohort: 'Sesi 2026/2027',
    registrationDate: '2026-01-05',
    status: 'Aktif',
  },
  {
    icNumber: '050911-01-1823',
    fullName: 'MUHAMMAD ADIB BIN SAIFUL',
    matricNumber: 'DPF/2026/021',
    programme: 'Diploma Farmasi',
    institution: OFFICIAL_INSTITUTION_NAME,
    cohort: 'Sesi 2026/2027',
    registrationDate: '2026-01-05',
    status: 'Aktif',
  },
  {
    icNumber: '051017-14-5542',
    fullName: 'SYAZANA BINTI KAMAL ARIFFIN',
    matricNumber: 'DPF/2026/022',
    programme: 'Diploma Farmasi',
    institution: OFFICIAL_INSTITUTION_NAME,
    cohort: 'Sesi 2026/2027',
    registrationDate: '2026-01-05',
    status: 'Aktif',
  },
  {
    icNumber: '051128-10-8201',
    fullName: 'NURIN JAZLINA BINTI HISHAM',
    matricNumber: 'DPF/2026/023',
    programme: 'Diploma Farmasi',
    institution: OFFICIAL_INSTITUTION_NAME,
    cohort: 'Sesi 2026/2027',
    registrationDate: '2026-01-05',
    status: 'Aktif',
  },
  {
    icNumber: '051204-08-2990',
    fullName: 'MUHAMMAD SYAFIQ BIN BAHARUDDIN',
    matricNumber: 'DPF/2026/024',
    programme: 'Diploma Farmasi',
    institution: OFFICIAL_INSTITUTION_NAME,
    cohort: 'Sesi 2026/2027',
    registrationDate: '2026-01-05',
    status: 'Aktif',
  },
  {
    icNumber: '050108-10-4137',
    fullName: 'NUR ZULAIKHA BINTI CHE MAT',
    matricNumber: 'DPF/2026/025',
    programme: 'Diploma Farmasi',
    institution: OFFICIAL_INSTITUTION_NAME,
    cohort: 'Sesi 2026/2027',
    registrationDate: '2026-01-05',
    status: 'Aktif',
  },
  {
    icNumber: '050221-14-6789',
    fullName: 'MUHAMMAD ADAM HAIKAL BIN MUSA',
    matricNumber: 'DPKP/2026/001',
    programme: 'Diploma Kesihatan Persekitaran',
    institution: OFFICIAL_INSTITUTION_NAME,
    cohort: 'Sesi 2026/2027',
    registrationDate: '2026-01-05',
    status: 'Aktif',
  },
  {
    icNumber: '050314-08-1204',
    fullName: 'NURUL ATIQAH BINTI MOHD SHUKRI',
    matricNumber: 'DPKP/2026/002',
    programme: 'Diploma Kesihatan Persekitaran',
    institution: OFFICIAL_INSTITUTION_NAME,
    cohort: 'Sesi 2026/2027',
    registrationDate: '2026-01-05',
    status: 'Aktif',
  },
  {
    icNumber: '050406-10-8531',
    fullName: 'MUHAMMAD NAJMI BIN ABDUL RAHMAN',
    matricNumber: 'DPKP/2026/003',
    programme: 'Diploma Kesihatan Persekitaran',
    institution: OFFICIAL_INSTITUTION_NAME,
    cohort: 'Sesi 2026/2027',
    registrationDate: '2026-01-05',
    status: 'Aktif',
  },
  {
    icNumber: '050518-06-3912',
    fullName: 'NUR DIANA BINTI ZAMRI',
    matricNumber: 'DPKP/2026/004',
    programme: 'Diploma Kesihatan Persekitaran',
    institution: OFFICIAL_INSTITUTION_NAME,
    cohort: 'Sesi 2026/2027',
    registrationDate: '2026-01-05',
    status: 'Aktif',
  },
  {
    icNumber: '050630-10-6725',
    fullName: 'SYED AIMAN BIN SYED OTHMAN',
    matricNumber: 'DPKP/2026/005',
    programme: 'Diploma Kesihatan Persekitaran',
    institution: OFFICIAL_INSTITUTION_NAME,
    cohort: 'Sesi 2026/2027',
    registrationDate: '2026-01-05',
    status: 'Aktif',
  },
  {
    icNumber: '050715-14-9840',
    fullName: 'INTAN NUR SYUHADA BINTI AZIZ',
    matricNumber: 'DPKP/2026/006',
    programme: 'Diploma Kesihatan Persekitaran',
    institution: OFFICIAL_INSTITUTION_NAME,
    cohort: 'Sesi 2026/2027',
    registrationDate: '2026-01-05',
    status: 'Aktif',
  },
  {
    icNumber: '050810-08-3397',
    fullName: 'MUHAMMAD HAZIQ BIN AZIZI',
    matricNumber: 'DPKP/2026/007',
    programme: 'Diploma Kesihatan Persekitaran',
    institution: OFFICIAL_INSTITUTION_NAME,
    cohort: 'Sesi 2026/2027',
    registrationDate: '2026-01-05',
    status: 'Aktif',
  },
  {
    icNumber: '050903-10-5118',
    fullName: 'NUR QISTINA BINTI KHALID',
    matricNumber: 'DPKP/2026/008',
    programme: 'Diploma Kesihatan Persekitaran',
    institution: OFFICIAL_INSTITUTION_NAME,
    cohort: 'Sesi 2026/2027',
    registrationDate: '2026-01-05',
    status: 'Aktif',
  },
  {
    icNumber: '051029-01-7243',
    fullName: 'FARIS DANIAL BIN KASIM',
    matricNumber: 'DPKP/2026/009',
    programme: 'Diploma Kesihatan Persekitaran',
    institution: OFFICIAL_INSTITUTION_NAME,
    cohort: 'Sesi 2026/2027',
    registrationDate: '2026-01-05',
    status: 'Aktif',
  },
  {
    icNumber: '051112-14-8896',
    fullName: 'NUR AMALINA BINTI MAHMUD',
    matricNumber: 'DPKP/2026/010',
    programme: 'Diploma Kesihatan Persekitaran',
    institution: OFFICIAL_INSTITUTION_NAME,
    cohort: 'Sesi 2026/2027',
    registrationDate: '2026-01-05',
    status: 'Aktif',
  },
  {
    icNumber: '051227-10-4051',
    fullName: 'MUHAMMAD ZULHILMI BIN HASSAN',
    matricNumber: 'DPKP/2026/011',
    programme: 'Diploma Kesihatan Persekitaran',
    institution: OFFICIAL_INSTITUTION_NAME,
    cohort: 'Sesi 2026/2027',
    registrationDate: '2026-01-05',
    status: 'Aktif',
  },
  {
    icNumber: '050119-08-6174',
    fullName: 'NURUL JANNAH BINTI SUHAIMI',
    matricNumber: 'DPKP/2026/012',
    programme: 'Diploma Kesihatan Persekitaran',
    institution: OFFICIAL_INSTITUTION_NAME,
    cohort: 'Sesi 2026/2027',
    registrationDate: '2026-01-05',
    status: 'Aktif',
  },
  {
    icNumber: '050209-10-9225',
    fullName: 'AIDIL ZAFRAN BIN RAMLI',
    matricNumber: 'DPKP/2026/013',
    programme: 'Diploma Kesihatan Persekitaran',
    institution: OFFICIAL_INSTITUTION_NAME,
    cohort: 'Sesi 2026/2027',
    registrationDate: '2026-01-05',
    status: 'Aktif',
  },
  {
    icNumber: '050327-14-3862',
    fullName: 'SITI AISYAH BINTI BADRUL',
    matricNumber: 'DPKP/2026/014',
    programme: 'Diploma Kesihatan Persekitaran',
    institution: OFFICIAL_INSTITUTION_NAME,
    cohort: 'Sesi 2026/2027',
    registrationDate: '2026-01-05',
    status: 'Aktif',
  },
  {
    icNumber: '050415-08-7519',
    fullName: 'MUHAMMAD ILHAM BIN JAAFAR',
    matricNumber: 'DPKP/2026/015',
    programme: 'Diploma Kesihatan Persekitaran',
    institution: OFFICIAL_INSTITUTION_NAME,
    cohort: 'Sesi 2026/2027',
    registrationDate: '2026-01-05',
    status: 'Aktif',
  },
  {
    icNumber: '050508-10-2340',
    fullName: 'NUR SYAZA NADIA BINTI RAZALI',
    matricNumber: 'DPKP/2026/016',
    programme: 'Diploma Kesihatan Persekitaran',
    institution: OFFICIAL_INSTITUTION_NAME,
    cohort: 'Sesi 2026/2027',
    registrationDate: '2026-01-05',
    status: 'Aktif',
  },
  {
    icNumber: '050617-14-4823',
    fullName: 'MEGAT AMIRUL BIN MEGAT SHUKRI',
    matricNumber: 'DPKP/2026/017',
    programme: 'Diploma Kesihatan Persekitaran',
    institution: OFFICIAL_INSTITUTION_NAME,
    cohort: 'Sesi 2026/2027',
    registrationDate: '2026-01-05',
    status: 'Aktif',
  },
];

// Dapatkan senarai pelatih berdaftar (42 pelatih)
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
      return {
        isVerified: false,
        icNumber: null,
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
      icNumber: null,
      matricNumber: null,
      studentName: null,
      programme: null,
      verifiedAt: null,
    };
  }
};

// Semak dan log masuk menggunakan No. Kad Pengenalan DAN Nama Penuh
export const verifyAndLoginTrainee = (
  icInput: string,
  nameInput: string
): { success: boolean; message: string; trainee?: RegisteredTrainee } => {
  const normIc = normalizeIcNumber(icInput);
  const normName = normalizeFullName(nameInput);

  if (!normIc) {
    return {
      success: false,
      message: 'Sila masukkan Nombor Kad Pengenalan anda (12 digit, cth: 050114-10-1023).',
    };
  }

  if (normIc.length < 10) {
    return {
      success: false,
      message: 'Nombor Kad Pengenalan tidak lengkap. Sila masukkan sekurang-kurangnya 12 digit MyKad rasmi.',
    };
  }

  if (!normName || normName.length < 3) {
    return {
      success: false,
      message: 'Sila masukkan Nama Penuh anda mengikut MyKad rasmi.',
    };
  }

  const trainees = getRegisteredTrainees();

  // Cari mengikut No. Kad Pengenalan terlebih dahulu
  const matchedByIc = trainees.find((t) => normalizeIcNumber(t.icNumber) === normIc);

  if (!matchedByIc) {
    return {
      success: false,
      message: `Akses Ditolak: Nombor Kad Pengenalan "${icInput}" tidak dijumpai dalam senarai 42 pelatih rasmi ILKKM Sungai Buloh. Hanya 42 pelatih berdaftar sesi ini dibenarkan mengakses soalan GCMT 2052.`,
    };
  }

  // Sahkan nama penuh pelatih
  if (!isNameMatching(normName, matchedByIc.fullName)) {
    return {
      success: false,
      message: `No. Kad Pengenalan sah, tetapi Nama Penuh yang dimasukkan tidak sepadan dengan rekod rasmi pelatih (${matchedByIc.fullName}). Sila semak ejaan nama penuh anda.`,
    };
  }

  // Semak status aktif
  if (matchedByIc.status === 'Digantung') {
    return {
      success: false,
      message: 'Akaun pelatih ini telah digantung. Sila hubungi Pengajar Kursus Matematik GCMT 2052 (Puan Norashikin Bt M Noor Arzmi).',
    };
  }

  const session: MatricAuthSession = {
    isVerified: true,
    icNumber: matchedByIc.icNumber,
    matricNumber: matchedByIc.matricNumber || null,
    studentName: matchedByIc.fullName,
    programme: matchedByIc.programme,
    verifiedAt: new Date().toISOString(),
  };
  localStorage.setItem(MATRIC_SESSION_KEY, JSON.stringify(session));

  // Segerakkan profil pengguna
  saveProfile({
    name: matchedByIc.fullName,
    icNumber: matchedByIc.icNumber,
    matricNumber: matchedByIc.matricNumber,
    institution: OFFICIAL_INSTITUTION_NAME,
    programme: matchedByIc.programme,
  });

  return {
    success: true,
    message: `Selamat datang, ${matchedByIc.fullName}! Akses soalan GCMT 2052 ILKKM Sungai Buloh telah disahkan.`,
    trainee: matchedByIc,
  };
};

// Sokongan fungsi legasi untuk semakan pantas
export const verifyAndLoginMatric = (
  matricOrIcInput: string
): { success: boolean; message: string; trainee?: RegisteredTrainee } => {
  const normIc = normalizeIcNumber(matricOrIcInput);
  const normMatric = normalizeMatric(matricOrIcInput);

  const trainees = getRegisteredTrainees();
  const matched = trainees.find(
    (t) =>
      (normIc && normalizeIcNumber(t.icNumber) === normIc) ||
      (normMatric && t.matricNumber && normalizeMatric(t.matricNumber) === normMatric)
  );

  if (matched) {
    if (matched.status === 'Digantung') {
      return {
        success: false,
        message: 'Akaun pelatih ini telah digantung. Sila hubungi Pengajar Kursus Matematik GCMT 2052 ILKKM Sungai Buloh.',
      };
    }

    const session: MatricAuthSession = {
      isVerified: true,
      icNumber: matched.icNumber,
      matricNumber: matched.matricNumber || null,
      studentName: matched.fullName,
      programme: matched.programme,
      verifiedAt: new Date().toISOString(),
    };
    localStorage.setItem(MATRIC_SESSION_KEY, JSON.stringify(session));

    saveProfile({
      name: matched.fullName,
      icNumber: matched.icNumber,
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

  return {
    success: false,
    message: `Akses Ditolak: Maklumat pengenalan "${matricOrIcInput}" tidak dijumpai dalam daftar 42 pelatih ILKKM Sungai Buloh.`,
  };
};

// ==========================================
// PENGURUSAN OLEH OWNER / PENGAJAR SAHAJA
// ==========================================

// Tambah pelatih tunggal oleh Pengajar
export const addTraineeByOwner = (params: {
  icNumber: string;
  fullName: string;
  matricNumber?: string;
  programme: string;
  cohort?: string;
}): { success: boolean; message: string; trainee?: RegisteredTrainee } => {
  const normIc = normalizeIcNumber(params.icNumber);
  const normalizedName = normalizeFullName(params.fullName);

  if (!normIc || normIc.length < 10) {
    return {
      success: false,
      message: 'Sila masukkan Nombor Kad Pengenalan yang sah (sekurang-kurangnya 12 digit).',
    };
  }

  if (!normalizedName) {
    return {
      success: false,
      message: 'Sila masukkan Nama Penuh pelatih.',
    };
  }

  const trainees = getRegisteredTrainees();
  const exists = trainees.find((t) => normalizeIcNumber(t.icNumber) === normIc);
  if (exists) {
    return {
      success: false,
      message: `No. Kad Pengenalan ${formatIcNumber(normIc)} sudah wujud dalam senarai (Didaftarkan kepada: ${exists.fullName}).`,
    };
  }

  const newTrainee: RegisteredTrainee = {
    icNumber: formatIcNumber(normIc),
    fullName: normalizedName,
    matricNumber: params.matricNumber ? normalizeMatric(params.matricNumber) : undefined,
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
    message: `Pelatih ${newTrainee.fullName} (${newTrainee.icNumber}) berjaya didaftarkan ke dalam sistem ILKKM Sungai Buloh.`,
    trainee: newTrainee,
  };
};

// Import fail CSV atau teks (MAKLUMAT PELATIH.csv)
export const importTraineesFromCsvData = (
  csvContent: string,
  replaceExisting: boolean = true
): {
  success: boolean;
  totalParsed: number;
  addedCount: number;
  duplicateCount: number;
  message: string;
} => {
  if (!csvContent || !csvContent.trim()) {
    return {
      success: false,
      totalParsed: 0,
      addedCount: 0,
      duplicateCount: 0,
      message: 'Kandungan fail CSV kosong.',
    };
  }

  const lines = csvContent
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  if (lines.length === 0) {
    return {
      success: false,
      totalParsed: 0,
      addedCount: 0,
      duplicateCount: 0,
      message: 'Tiada data baris dalam fail CSV.',
    };
  }

  // Analisis pengepala (header detection)
  let headerIndex = -1;
  let icCol = -1;
  let nameCol = -1;
  let progCol = -1;
  let matricCol = -1;

  for (let i = 0; i < Math.min(5, lines.length); i++) {
    const rawLine = lines[i].toLowerCase();
    const cols = splitCsvLine(lines[i]).map((c) => c.toLowerCase().trim());

    if (
      cols.some((c) => c.includes('kad pengenalan') || c.includes('ic') || c.includes('kp') || c.includes('mykad')) ||
      cols.some((c) => c.includes('nama'))
    ) {
      headerIndex = i;
      cols.forEach((col, idx) => {
        if (col.includes('kad pengenalan') || col.includes('ic') || col.includes('kp') || col.includes('mykad')) {
          icCol = idx;
        } else if (col.includes('nama') || col.includes('pelatih')) {
          nameCol = idx;
        } else if (col.includes('program') || col.includes('kursus') || col.includes('jurusan')) {
          progCol = idx;
        } else if (col.includes('matrik') || col.includes('matric')) {
          matricCol = idx;
        }
      });
      break;
    }
  }

  const dataLines = headerIndex !== -1 ? lines.slice(headerIndex + 1) : lines;
  const existingList = replaceExisting ? [] : getRegisteredTrainees();
  const seenIc = new Set<string>(existingList.map((t) => normalizeIcNumber(t.icNumber)));
  const newTrainees: RegisteredTrainee[] = [];
  let duplicates = 0;

  for (const line of dataLines) {
    if (line.startsWith('#') || line.startsWith('//')) continue;
    const parts = splitCsvLine(line);
    if (parts.length < 2) continue;

    let rawIc = '';
    let rawName = '';
    let rawProg = 'Diploma Farmasi';
    let rawMatric = '';

    if (icCol !== -1 && nameCol !== -1) {
      rawIc = parts[icCol] || '';
      rawName = parts[nameCol] || '';
      if (progCol !== -1 && parts[progCol]) rawProg = parts[progCol];
      if (matricCol !== -1 && parts[matricCol]) rawMatric = parts[matricCol];
    } else {
      // Heuristik jika tiada header formal:
      // Semak lajur mana mengandungi nombor IC (sekurang-kurangnya 10-12 digit)
      const part0Clean = normalizeIcNumber(parts[0]);
      const part1Clean = normalizeIcNumber(parts[1]);

      if (part0Clean.length >= 10 && parts[1]) {
        rawIc = parts[0];
        rawName = parts[1];
        if (parts[2]) rawProg = parts[2];
      } else if (part1Clean.length >= 10 && parts[0]) {
        rawName = parts[0];
        rawIc = parts[1];
        if (parts[2]) rawProg = parts[2];
      } else {
        // Anggap lajur 0 = IC, 1 = Nama
        rawIc = parts[0];
        rawName = parts[1];
        if (parts[2]) rawProg = parts[2];
      }
    }

    const normIc = normalizeIcNumber(rawIc);
    const normName = normalizeFullName(rawName);

    if (!normIc || normIc.length < 10 || !normName) {
      continue;
    }

    if (seenIc.has(normIc)) {
      duplicates++;
      continue;
    }

    seenIc.add(normIc);
    newTrainees.push({
      icNumber: formatIcNumber(normIc),
      fullName: normName,
      matricNumber: rawMatric ? normalizeMatric(rawMatric) : undefined,
      programme: rawProg.trim() || 'Diploma Farmasi',
      institution: OFFICIAL_INSTITUTION_NAME,
      cohort: 'Sesi 2026/2027',
      registrationDate: new Date().toISOString().split('T')[0],
      status: 'Aktif',
    });
  }

  if (newTrainees.length === 0) {
    return {
      success: false,
      totalParsed: 0,
      addedCount: 0,
      duplicateCount: duplicates,
      message: 'Tiada rekod pelatih sah yang dapat dikesan dari data CSV.',
    };
  }

  const finalList = replaceExisting ? newTrainees : [...existingList, ...newTrainees];
  saveRegisteredTrainees(finalList);

  return {
    success: true,
    totalParsed: newTrainees.length + duplicates,
    addedCount: newTrainees.length,
    duplicateCount: duplicates,
    message: `Berjaya memproses ${newTrainees.length} pelatih berdaftar daripada fail CSV (${duplicates} pendua diabaikan).`,
  };
};

// Pembahagi baris CSV dengan sokongan koma, sempang, atau tab
const splitCsvLine = (line: string): string[] => {
  if (line.includes('\t')) {
    return line.split('\t').map((s) => s.trim().replace(/^"|"$/g, ''));
  }
  if (line.includes(',')) {
    // Regex mudah CSV untuk memelihara teks dalam petikan
    const result: string[] = [];
    let insideQuotes = false;
    let current = '';

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        insideQuotes = !insideQuotes;
      } else if (char === ',' && !insideQuotes) {
        result.push(current.trim().replace(/^"|"$/g, ''));
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current.trim().replace(/^"|"$/g, ''));
    return result;
  }
  if (line.includes(' - ')) {
    return line.split(' - ').map((s) => s.trim());
  }
  return line.split('-').map((s) => s.trim());
};

// Batch import wrapper (teks bebas / tampal CSV)
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
  const res = importTraineesFromCsvData(rawText, false);
  return {
    success: res.success,
    addedCount: res.addedCount,
    duplicateCount: res.duplicateCount,
    invalidCount: res.totalParsed - res.addedCount - res.duplicateCount,
    message: res.message,
  };
};

// Padam pelatih daripada senarai oleh Pengajar
export const deleteTraineeByOwner = (icNumber: string): { success: boolean; message: string } => {
  const norm = normalizeIcNumber(icNumber);
  const trainees = getRegisteredTrainees();
  const filtered = trainees.filter((t) => normalizeIcNumber(t.icNumber) !== norm);

  if (filtered.length === trainees.length) {
    return { success: false, message: 'Nombor Kad Pengenalan tidak dijumpai.' };
  }

  saveRegisteredTrainees(filtered);

  // Jika sesi semasa menggunakan pelatih ini, batalkan sesi
  const session = getMatricSession();
  if (session.icNumber && normalizeIcNumber(session.icNumber) === norm) {
    logoutMatricSession();
  }

  return { success: true, message: `Pelatih dengan No. K/P ${formatIcNumber(icNumber)} telah dipadam daripada senarai.` };
};

// Tukar status pelatih (Aktif / Digantung) oleh Pengajar
export const toggleTraineeStatusByOwner = (icNumber: string): { success: boolean; newStatus?: string; message: string } => {
  const norm = normalizeIcNumber(icNumber);
  const trainees = getRegisteredTrainees();
  const target = trainees.find((t) => normalizeIcNumber(t.icNumber) === norm);

  if (!target) {
    return { success: false, message: 'Pelatih tidak dijumpai.' };
  }

  const newStatus = target.status === 'Aktif' ? 'Digantung' : 'Aktif';
  target.status = newStatus as 'Aktif' | 'Digantung';

  saveRegisteredTrainees([...trainees]);

  // Jika digantung dan sedang login, batalkan sesi
  if (newStatus === 'Digantung') {
    const session = getMatricSession();
    if (session.icNumber && normalizeIcNumber(session.icNumber) === norm) {
      logoutMatricSession();
    }
  }

  return { 
    success: true, 
    newStatus, 
    message: `Status pelatih ${target.fullName} ditukar kepada "${newStatus}".` 
  };
};

// Eksport senarai pelatih ke format CSV
export const exportTraineesToCsv = (): string => {
  const list = getRegisteredTrainees();
  const headers = ['Bil', 'No. Kad Pengenalan', 'Nama Penuh', 'Program', 'Status', 'Sesi'];
  const rows = list.map((t, idx) => [
    idx + 1,
    `"${t.icNumber}"`,
    `"${t.fullName}"`,
    `"${t.programme}"`,
    `"${t.status}"`,
    `"${t.cohort}"`,
  ]);
  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
};

// Tetapkan semula ke 42 orang pelatih lalai ILKKM Sungai Buloh
export const resetRegisteredTraineesToDefault = (): void => {
  localStorage.setItem(REGISTERED_TRAINEES_KEY, JSON.stringify(defaultRegisteredTrainees));
};

// Log keluar sesi sepenuhnya dan bersihkan data profil aktif
export const logoutMatricSession = (): void => {
  localStorage.removeItem(MATRIC_SESSION_KEY);
  const profile = getStoredProfile();
  saveProfile({
    ...profile,
    name: 'Pelatih ILKKM',
    icNumber: undefined,
    matricNumber: undefined,
  });
};

// Log masuk terus sebagai pelatih tertentu (untuk pengajar menguji atau menukar pelatih)
export const loginAsTraineeDirectly = (trainee: RegisteredTrainee): MatricAuthSession => {
  const session: MatricAuthSession = {
    isVerified: true,
    icNumber: trainee.icNumber,
    matricNumber: trainee.matricNumber || null,
    studentName: trainee.fullName,
    programme: trainee.programme,
    verifiedAt: new Date().toISOString(),
  };
  localStorage.setItem(MATRIC_SESSION_KEY, JSON.stringify(session));

  saveProfile({
    name: trainee.fullName,
    icNumber: trainee.icNumber,
    matricNumber: trainee.matricNumber,
    institution: OFFICIAL_INSTITUTION_NAME,
    programme: trainee.programme,
  });

  return session;
};

// Semak adakah akses soalan dibenarkan (disahkan dengan IC dan Nama)
export const isMatricVerified = (): boolean => {
  const session = getMatricSession();
  return session.isVerified && !!session.icNumber;
};

