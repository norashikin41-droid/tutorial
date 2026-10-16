# Integrasi Pengesahan Log Masuk Pelatih (No. Kad Pengenalan & Nama Penuh)

Sistem pengesahan akses soalan GCMT 2052 ILKKM Sungai Buloh dikemas kini dengan menguatkuasakan kawalan akses ketat di mana hanya 42 orang pelatih berdaftar rasmi dibenarkan log masuk menggunakan kombinasi Nombor Kad Pengenalan (MyKad) dan Nama Penuh mereka.

### User Review & Critical Decisions

> [!IMPORTANT]
> Berdasarkan maklum balas anda pada sesi semakan sebelum ini, keputusan reka bentuk dan fungsi berikut telah dimuktamadkan:

- **Kaedah Log Masuk Disahkan**: Pelatih perlu memasukkan kedua-dua **Nombor Kad Pengenalan** (dengan atau tanpa tanda sempang, cth: `040101-10-1234` atau `040101101234`) dan **Nama Penuh** yang sepadan dengan rekod rasmi ILKKM Sungai Buloh.
- **Penggantian Penuh Senarai Pelatih**: Senarai sampel sedia ada dibersihkan sepenuhnya dan digantikan dengan 42 orang pelatih rasmi daripada dokumen `MAKLUMAT PELATIH`. Pelatih luar daripada kolej atau institusi lain tidak dibenarkan mengakses soalan.
- **Paparan Markah Matematik SPM**: Seperti yang dipersetujui, markah Matematik SPM (Moden dan Tambahan) tidak akan dipaparkan pada profil pelatih bagi mengekalkan tumpuan kepada modul dan kuiz GCMT 2052.
- **Akses Kawalan Pengajar (Owner)**: Pengajar (`Puan Norashikin Bt M Noor Arzmi`) kekal mempunyai akses kata laluan khas untuk mengurus senarai, menyemak status aktif/gantung pelatih, dan mengemaskini maklumat.

---

### 1. Overview & Core Concept

- **Fungsi Utama**: Mengehadkan capaian kuiz, latihan kendiri, dan sijil digital GCMT 2052 hanya kepada 42 pelatih berdaftar rasmi ILKKM Sungai Buloh melalui pengesahan gabungan No. Kad Pengenalan dan Nama Penuh.
- **Kumpulan Sasaran**: 42 pelatih Kursus Matematik GCMT 2052 (Diploma Farmasi / Diploma Kesihatan Persekitaran) ILKKM Sungai Buloh Sesi 2026/2027.
- **Nilai Utama**: Memastikan privasi data pelatih, mencegah akses tidak sah oleh individu luar atau institusi lain, serta memastikan nama dan nombor pengenalan pada Sijil Pencapaian GCMT 2052 adalah 100% sah dan rasmi.

---

### 2. User Experience & Visual Design

- **Aliran Pengguna (User Flows)**:
  1. **Paparan Sekatan (Gated Screen)**: Apabila pelatih belum log masuk atau cuba memulakan kuiz, modal pengesahan rasmi ILKKM Sungai Buloh akan dipaparkan.
  2. **Borang Log Masuk Dwi-Input**:
     - Medan 1: **Nombor Kad Pengenalan** (format fleksibel: menerima 12 digit berturutan atau berformat `XXXXXX-XX-XXXX`).
     - Medan 2: **Nama Penuh** (pengecaman tidak sensitif huruf besar/kecil dan toleran terhadap ruang tambahan).
  3. **Pengesahan & Pengalihan**: 
     - Jika padanan sah: Paparan mesej alu-aluan mesra berserta animasi kejayaan pantas, sesi disimpan secara automatik, dan pelatih terus dibawa ke modul kuiz dengan nama profil mereka dikemaskini.
     - Jika tidak sepadan: Paparan amaran keselamatan terperinci dalam Bahasa Melayu yang memaklumkan hanya 42 pelatih berdaftar ILKKM Sungai Buloh dibenarkan masuk.
  4. **Papan Pemuka & Profil**: Nama rasmi dan No. Kad Pengenalan yang disahkan akan dipaparkan secara kemas pada kad status pengesahan di laman utama dan modal sijil.

- **Identiti Visual & Tema**:
  - *Gaya & Estetik*: Mengikut tema rasmi institusi berteraskan herba hijau (`#33422C`), terakota (`#B85D3B`), dan latar kanvas berkrim (`#FBFBF7`).
  - *Borang Pengesahan*: Input yang jelas, ikon penunjuk MyKad (`ShieldCheck` / `CreditCard`), bantuan format teks lembut (*placeholder guidance*), dan butang pengesahan utama dengan kontras tinggi.
  - *Responsif*: Sesuai untuk paparan skrin telefon pintar pelatih mahupun komputer riba/desktop tanpa limpahan atau kekaburan teks.

---

### 3. Key Product Decisions & Trade-Offs

- **Keputusan 1: Kaedah Pemadanan No. Kad Pengenalan & Nama**
  - *Pendekatan Dipilih*: Normalisasi input No. Kad Pengenalan (membuang semua aksara bukan digit seperti sempang dan ruang) dan normalisasi Nama Penuh (menukar ke huruf besar serta merapikan jarak antara perkataan).
  - *Rasional*: Mengelakkan kegagalan log masuk yang berpunca daripada perbezaan kecil tanda sempang atau huruf besar/kecil pelatih semasa menaip.
  - *Pilihan Lain Ditolak*: Pengesahan sensitif huruf sepenuhnya ditolak kerana berisiko menyebabkan pelatih gagal masuk akibat papan kekunci mudah alih.

- **Keputusan 2: Penggantian Pangkalan Data Tempatan (LocalStorage Migration)**
  - *Pendekatan Dipilih*: Mengemas kini struktur `RegisteredTrainee` untuk memuatkan `icNumber` dan menggantikan senarai asas (default roster) dengan 42 pelatih rasmi. Menetapkan mekanisma muat semula data automatik (*versioned cache key*) supaya pelatih yang pernah melawat aplikasi menerima senarai 42 pelatih baharu serta-merta tanpa perlu membersihkan data pelayar secara manual.
  - *Rasional*: Memastikan semua pelatih sedia ada mendapat senarai 42 nama terkini dengan serta-merta.

- **Keputusan 3: Penyesuaian Panel Pemilik / Pensyarah (Owner Portal)**
  - *Pendekatan Dipilih*: Memperluaskan borang tambah/import pukal di panel Owner untuk turut menyokong medan Nombor Kad Pengenalan, di samping carian nama dan carian IC.
  - *Rasional*: Memberi kemudahan berterusan kepada Puan Norashikin untuk menyemak senarai 42 pelatih, menapis status, atau membuat carian segera.

---

### 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────┐
│                   Antaramuka Pengguna                  │
│  ┌────────────────────────┐  ┌───────────────────────┐ │
│  │   MatricAuthModal      │  │   MatricLockBanner    │ │
│  │ (No. Kad Pengenalan &  │  │ (Status Pengesahan &  │ │
│  │       Nama Penuh)      │  │     Log Keluar)       │ │
│  └───────────┬────────────┘  └───────────┬───────────┘ │
└──────────────┼───────────────────────────┼─────────────┘
               │                           │
               ▼                           ▼
┌────────────────────────────────────────────────────────┐
│             Modul Pengesahan (matricAuth.ts)           │
│  - normalizeIcNumber(input: string): string            │
│  - normalizeFullName(input: string): string            │
│  - verifyAndLoginTrainee(ic: string, name: string)     │
│  - Senarai 42 Pelatih Rasmi ILKKM Sungai Buloh         │
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│              Penyimpanan Tempatan (Storage)            │
│  - gcmt2052_registered_trainees_v2 (42 Rekod)          │
│  - gcmt2052_matric_session_v2 (Sesi Aktif Pelatih)     │
│  - gcmt2052_user_profile (Segerak Nama & Maklumat)     │
└────────────────────────────────────────────────────────┘
```

- **Model Data & Entiti**:
  ```ts
  export interface RegisteredTrainee {
    matricNumber: string;
    icNumber: string;        // Nombor Kad Pengenalan (12 digit)
    fullName: string;        // Nama Penuh rasmi
    programme: string;       // Diploma Farmasi / Diploma Kesihatan Persekitaran
    institution: string;     // ILKKM Sungai Buloh
    cohort: string;          // Sesi 2026/2027
    registrationDate: string;
    status: 'Aktif' | 'Digantung';
  }

  export interface MatricAuthSession {
    isVerified: boolean;
    matricNumber: string | null;
    icNumber: string | null;
    studentName: string | null;
    programme: string | null;
    verifiedAt: string | null;
  }
  ```

- **Pencegahan Ralat & Pengendalian Kes Khas**:
  - Pelatih memasukkan IC dengan sempang (`050214-10-1234`) atau tanpa sempang (`050214101234`) kedua-duanya diterima.
  - Nama penuh diperiksa dengan toleransi perbezaan kecil (cth: "BIN" vs "B.", atau huruf kecil/besar).
  - Peringatan jelas disediakan sekiranya pelatih tersilap memasukkan nombor IC atau ejaan nama.
