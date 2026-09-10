import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Lock, 
  Unlock, 
  UserCheck, 
  AlertCircle, 
  CheckCircle2, 
  Search, 
  X, 
  KeyRound, 
  Building2, 
  LogOut,
  ArrowRight,
  UserPlus,
  FileText,
  Trash2,
  Copy,
  RefreshCw,
  Settings,
  ListPlus
} from 'lucide-react';
import { 
  verifyAndLoginMatric, 
  getRegisteredTrainees, 
  logoutMatricSession,
  getMatricSession,
  OFFICIAL_INSTITUTION_NAME,
  verifyOwnerPassword,
  updateOwnerPassword,
  addTraineeByOwner,
  batchImportTraineesByOwner,
  deleteTraineeByOwner,
  toggleTraineeStatusByOwner,
  resetRegisteredTraineesToDefault
} from '../utils/matricAuth';
import { MatricAuthSession, RegisteredTrainee } from '../types';

interface MatricAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (session: MatricAuthSession) => void;
  requiredForAction?: string | null;
}

export const MatricAuthModal: React.FC<MatricAuthModalProps> = ({
  isOpen,
  onClose,
  onAuthSuccess,
  requiredForAction,
}) => {
  const [mainTab, setMainTab] = useState<'student' | 'owner'>('student');
  
  // Student verification states
  const [studentMatric, setStudentMatric] = useState('');
  const [studentError, setStudentError] = useState<string | null>(null);
  const [studentSuccess, setStudentSuccess] = useState<string | null>(null);

  // Owner authentication states
  const [isOwnerUnlocked, setIsOwnerUnlocked] = useState(false);
  const [ownerPasswordInput, setOwnerPasswordInput] = useState('');
  const [ownerAuthError, setOwnerAuthError] = useState<string | null>(null);

  // Owner panel sub-tabs
  const [ownerSubTab, setOwnerSubTab] = useState<'batch' | 'single' | 'list' | 'settings'>('batch');

  // Owner batch import states
  const [batchText, setBatchText] = useState('');
  const [batchDefaultProgramme, setBatchDefaultProgramme] = useState('Diploma Farmasi');
  const [batchResult, setBatchResult] = useState<{
    success: boolean;
    addedCount: number;
    duplicateCount: number;
    invalidCount: number;
    message: string;
  } | null>(null);

  // Owner single add states
  const [singleMatric, setSingleMatric] = useState('');
  const [singleName, setSingleName] = useState('');
  const [singleProg, setSingleProg] = useState('Diploma Farmasi');
  const [singleCohort, setSingleCohort] = useState('Sesi 2026/2027');
  const [singleMsg, setSingleMsg] = useState<{ success: boolean; text: string } | null>(null);

  // Owner list search state
  const [rosterSearch, setRosterSearch] = useState('');
  const [copyFeedback, setCopyFeedback] = useState(false);

  // Owner password update states
  const [newOwnerPass, setNewOwnerPass] = useState('');
  const [passUpdateMsg, setPassUpdateMsg] = useState<{ success: boolean; text: string } | null>(null);

  // Force re-render on data modifications
  const [, setRefreshKey] = useState(0);
  const refreshData = () => setRefreshKey((k) => k + 1);

  const currentSession = getMatricSession();
  const registeredList = getRegisteredTrainees();

  if (!isOpen) return null;

  // Pelatih submit no matrik
  const handleStudentLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setStudentError(null);
    setStudentSuccess(null);

    const res = verifyAndLoginMatric(studentMatric);
    if (res.success && res.trainee) {
      setStudentSuccess(res.message);
      setTimeout(() => {
        const updated = getMatricSession();
        onAuthSuccess(updated);
        onClose();
      }, 700);
    } else {
      setStudentError(res.message);
    }
  };

  // Ujian pantas pelatih daripada senarai
  const handleQuickSelectTrainee = (matric: string) => {
    setStudentMatric(matric);
    setStudentError(null);
    const res = verifyAndLoginMatric(matric);
    if (res.success && res.trainee) {
      setStudentSuccess(res.message);
      setTimeout(() => {
        const updated = getMatricSession();
        onAuthSuccess(updated);
        onClose();
      }, 600);
    }
  };

  // Pelatih log keluar
  const handleStudentLogout = () => {
    logoutMatricSession();
    const newSession = getMatricSession();
    onAuthSuccess(newSession);
    setStudentSuccess(null);
    setStudentError(null);
    refreshData();
  };

  // Owner log masuk
  const handleOwnerUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    setOwnerAuthError(null);

    if (verifyOwnerPassword(ownerPasswordInput)) {
      setIsOwnerUnlocked(true);
      setOwnerPasswordInput('');
    } else {
      setOwnerAuthError('Kata laluan Owner tidak tepat. Sila hubungi pentadbir ILKKM Sungai Buloh.');
    }
  };

  // Owner import pukal
  const handleBatchImportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setBatchResult(null);

    const res = batchImportTraineesByOwner(batchText, batchDefaultProgramme);
    setBatchResult(res);
    if (res.success) {
      setBatchText('');
      refreshData();
    }
  };

  // Owner tambah pelatih tunggal
  const handleSingleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSingleMsg(null);

    const res = addTraineeByOwner({
      matricNumber: singleMatric,
      fullName: singleName,
      programme: singleProg,
      cohort: singleCohort,
    });

    setSingleMsg({ success: res.success, text: res.message });
    if (res.success) {
      setSingleMatric('');
      setSingleName('');
      refreshData();
    }
  };

  // Owner padam pelatih
  const handleDeleteTrainee = (matricNumber: string, name: string) => {
    const confirmDelete = window.confirm(
      `Adakah anda pasti ingin memadam pelatih:\n${name} (${matricNumber}) daripada senarai berdaftar ILKKM Sungai Buloh?`
    );
    if (!confirmDelete) return;

    deleteTraineeByOwner(matricNumber);
    refreshData();
  };

  // Owner tukar status aktif/gantung
  const handleToggleStatus = (matricNumber: string) => {
    toggleTraineeStatusByOwner(matricNumber);
    refreshData();
  };

  // Salin senarai matrik ke clipboard
  const handleCopyAllMatrics = () => {
    const text = registeredList
      .map((t) => `${t.matricNumber} - ${t.fullName} (${t.programme})`)
      .join('\n');
    navigator.clipboard.writeText(text);
    setCopyFeedback(true);
    setTimeout(() => setCopyFeedback(false), 2000);
  };

  // Tukar kata laluan owner
  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPassUpdateMsg(null);
    const res = updateOwnerPassword(newOwnerPass);
    setPassUpdateMsg({ success: res.success, text: res.message });
    if (res.success) {
      setNewOwnerPass('');
    }
  };

  // Reset ke asal
  const handleResetToDefault = () => {
    const confirmReset = window.confirm(
      'Kembalikan ke senarai asal pelatih ILKKM Sungai Buloh? Perubahan yang telah ditambah akan digantikan dengan senarai lalai.'
    );
    if (!confirmReset) return;
    resetRegisteredTraineesToDefault();
    refreshData();
  };

  const filteredRoster = registeredList.filter(
    (t) =>
      t.fullName.toLowerCase().includes(rosterSearch.toLowerCase()) ||
      t.matricNumber.toLowerCase().includes(rosterSearch.toLowerCase()) ||
      t.programme.toLowerCase().includes(rosterSearch.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-[28px] border border-[#D0D0C0] shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Institutional Identity */}
        <div className="p-6 bg-[#33422C] text-white relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-xl text-[#C8D6C4] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="Tutup"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-3 mb-2">
            <div className="w-11 h-11 rounded-2xl bg-[#495E3F] border border-[#6A8A60] flex items-center justify-center text-white shrink-0 shadow-xs">
              <ShieldCheck className="w-6 h-6 text-[#D5E2D0]" />
            </div>
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#A3C096] font-bold block">
                Kawalan Capaian Institusi • Kod GCMT 2052
              </span>
              <h3 className="text-lg sm:text-xl font-extrabold text-white leading-tight">
                Pengesahan Pelatih ILKKM Sungai Buloh
              </h3>
            </div>
          </div>

          <p className="text-xs text-[#C8D6C4] leading-relaxed">
            {OFFICIAL_INSTITUTION_NAME}
          </p>

          {requiredForAction && (
            <div className="mt-3 py-1.5 px-3 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-200 text-xs flex items-center gap-2">
              <Lock className="w-3.5 h-3.5 text-amber-300 shrink-0" />
              <span>Sahkan No. Matrik untuk: <strong>{requiredForAction}</strong></span>
            </div>
          )}
        </div>

        {/* Verified Session Status Bar (if student logged in) */}
        {currentSession.isVerified && currentSession.matricNumber && (
          <div className="p-4 bg-[#EBF0E6] border-b border-[#C8D6C4] flex items-center justify-between gap-3 text-left">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-full bg-[#495E3F] text-white flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#33422C]">
                  Sesi Pelatih Aktif: {currentSession.studentName}
                </p>
                <p className="text-[11px] text-[#55694D]">
                  No. Matrik: <strong className="font-mono">{currentSession.matricNumber}</strong> • {currentSession.programme}
                </p>
              </div>
            </div>

            <button
              onClick={handleStudentLogout}
              className="px-3 py-1.5 rounded-xl bg-white border border-[#C8D6C4] hover:bg-[#F5F5F0] text-[#7A3B2E] text-xs font-bold flex items-center gap-1 shrink-0 transition-colors cursor-pointer"
              title="Kunci semula dan log keluar"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Keluar</span>
            </button>
          </div>
        )}

        {/* Main Tab Bar */}
        <div className="flex border-b border-[#E0E0D0] bg-[#FAF9F5] px-6 pt-3 gap-3 text-xs font-bold">
          <button
            onClick={() => setMainTab('student')}
            className={`pb-3 px-3.5 border-b-2 flex items-center gap-2 transition-all cursor-pointer ${
              mainTab === 'student'
                ? 'border-[#495E3F] text-[#33422C]'
                : 'border-transparent text-[#7A7A6A] hover:text-[#4A4A40]'
            }`}
          >
            <KeyRound className="w-4 h-4" />
            <span>Semakan No. Matrik Pelatih</span>
          </button>

          <button
            onClick={() => setMainTab('owner')}
            className={`pb-3 px-3.5 border-b-2 flex items-center gap-2 transition-all cursor-pointer ${
              mainTab === 'owner'
                ? 'border-[#D98C70] text-[#8E472D]'
                : 'border-transparent text-[#7A7A6A] hover:text-[#4A4A40]'
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>Panel Pensyarah / Owner</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#EBD0C6] text-[#8E472D]">
              Khas Owner
            </span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto flex-1">
          
          {/* ======================================================== */}
          {/* TAB 1: STUDENT MATRIC VERIFICATION                        */}
          {/* ======================================================== */}
          {mainTab === 'student' && (
            <div className="space-y-5">
              
              {/* Notice Box: Only owner can enter matric numbers */}
              <div className="p-4 rounded-2xl bg-[#F4F6F2] border border-[#D5E0D0] text-xs text-[#4A5944] leading-relaxed">
                <div className="flex items-start gap-2 font-bold text-[#33422C] mb-1">
                  <Building2 className="w-4 h-4 text-[#495E3F] shrink-0 mt-0.5" />
                  <span>Khas untuk Pelatih Berdaftar ILKKM Sungai Buloh Sahaja</span>
                </div>
                Soalan ulangkaji dan ujian pantas GCMT 2052 dikawal rapi. Senarai nombor matrik dimasukkan dan disahkan sepenuhnya oleh <strong>Pensyarah / Owner kursus</strong>. Pelatih luar (Kolej Vokasional/Matrikulasi/Kolej lain) tidak dibenarkan mengakses soalan ini.
              </div>

              {/* Error Message if matric not found */}
              {studentError && (
                <div className="p-4 rounded-2xl bg-[#FDF2F0] border-2 border-[#EBD0C6] text-[#8E3220] text-xs space-y-2 animate-in shake">
                  <div className="flex items-center gap-2 font-bold text-sm">
                    <ShieldAlert className="w-5 h-5 text-[#C74B32] shrink-0" />
                    <span>Akses Ditolak</span>
                  </div>
                  <p className="leading-relaxed">{studentError}</p>
                  <div className="pt-2 border-t border-[#EBD0C6]/60 text-[11px] text-[#A24430]">
                    *Hanya pensyarah kursus boleh mendaftarkan nombor matrik anda. Sila maklumkan kepada Pensyarah Matematik GCMT 2052 ILKKM Sungai Buloh anda jika nombor matrik belum dimasukkan.
                  </div>
                </div>
              )}

              {/* Success Message */}
              {studentSuccess && (
                <div className="p-4 rounded-2xl bg-[#EBF0E6] border-2 border-[#C8D6C4] text-[#33422C] text-xs flex items-center gap-2 font-bold animate-in fade-in">
                  <CheckCircle2 className="w-5 h-5 text-[#495E3F] shrink-0" />
                  <span>{studentSuccess}</span>
                </div>
              )}

              {/* Verification Form */}
              <form onSubmit={handleStudentLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#5A5A50] uppercase tracking-wider mb-1.5">
                    Masukkan Nombor Matrik Anda:
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={studentMatric}
                      onChange={(e) => setStudentMatric(e.target.value)}
                      placeholder="Contoh: GCMT/2026/0482 atau ILKKMSB/2026/0041"
                      className="w-full px-4 py-3.5 rounded-2xl border-2 border-[#D0D0C0] bg-white text-sm font-mono font-bold text-[#33422C] focus:outline-none focus:border-[#495E3F] focus:ring-2 focus:ring-[#A3AD94]/40 uppercase placeholder:text-gray-400"
                    />
                  </div>
                  <span className="text-[11px] text-[#7A7A6A] mt-1 block">
                    Format matrik contoh: <span className="font-mono">GCMT/2026/XXXX</span> atau <span className="font-mono">ILKKMSB/2026/XXXX</span>
                  </span>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 px-5 rounded-2xl bg-[#495E3F] hover:bg-[#3D4F34] text-white font-bold text-sm shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Unlock className="w-4 h-4" />
                  <span>Sahkan Nombor Matrik & Buka Soalan</span>
                </button>
              </form>

              {/* Quick test buttons for lecturer / evaluation */}
              <div className="pt-4 border-t border-[#E8E8E0]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#7A7A6A]">
                    Contoh No. Matrik Sah yang Didaftarkan Owner ({registeredList.length} Dalam Senarai):
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {registeredList.slice(0, 4).map((t) => (
                    <button
                      key={t.matricNumber}
                      type="button"
                      onClick={() => handleQuickSelectTrainee(t.matricNumber)}
                      className="p-2.5 rounded-xl border border-[#D0D0C0] bg-[#FAF9F5] hover:bg-[#EBF0E6] text-left transition-colors flex items-center justify-between text-xs cursor-pointer"
                    >
                      <div className="truncate pr-2">
                        <span className="font-mono font-bold text-[#33422C] block">
                          {t.matricNumber}
                        </span>
                        <span className="text-[11px] text-[#7A7A6A] truncate block">
                          {t.fullName}
                        </span>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-[#495E3F] shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 2: OWNER / PENSYARAH PANEL (LOCKED)                   */}
          {/* ======================================================== */}
          {mainTab === 'owner' && (
            <div>
              {!isOwnerUnlocked ? (
                /* Owner Lock Screen */
                <form onSubmit={handleOwnerUnlock} className="space-y-4 py-2">
                  <div className="p-4 rounded-2xl bg-[#FFF9F6] border border-[#EBD0C6] text-xs text-[#7A554A] leading-relaxed">
                    <div className="flex items-center gap-2 text-[#8E472D] font-bold text-sm mb-1">
                      <Lock className="w-4 h-4 text-[#D98C70]" />
                      <span>Panel Pengurusan Senarai No. Matrik (Owner Sahaja)</span>
                    </div>
                    Hanya Pensyarah / Owner kursus dibenarkan memasukkan atau mengubah senarai nombor matrik pelatih berdaftar. Pelatih tidak mempunyai kata laluan ini.
                  </div>

                  {ownerAuthError && (
                    <div className="p-3.5 rounded-xl bg-[#FDF2F0] border border-[#EBD0C6] text-[#8E3220] text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-[#C74B32] shrink-0" />
                      <span>{ownerAuthError}</span>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-[#5A5A50] uppercase tracking-wider mb-1.5">
                      Masukkan Kata Laluan Pensyarah / Owner:
                    </label>
                    <input
                      type="password"
                      required
                      value={ownerPasswordInput}
                      onChange={(e) => setOwnerPasswordInput(e.target.value)}
                      placeholder="Masukkan kata laluan owner..."
                      className="w-full px-4 py-3 rounded-xl border-2 border-[#D0D0C0] bg-white text-sm font-mono font-bold focus:outline-none focus:border-[#D98C70] focus:ring-2 focus:ring-[#D98C70]/30"
                    />
                    <p className="text-[11px] text-[#7A7A6A] mt-1.5">
                      *Kata laluan lalai pensyarah: <code className="font-mono font-bold text-[#D98C70]">OWNER2026</code> atau <code className="font-mono font-bold text-[#D98C70]">ILKKMSB2026</code>
                    </p>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 px-5 rounded-2xl bg-[#D98C70] hover:bg-[#C7795C] text-white font-bold text-sm shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Unlock className="w-4 h-4" />
                    <span>Buka Panel Pengurusan Owner</span>
                  </button>
                </form>
              ) : (
                /* Owner Unlocked Management Dashboard */
                <div className="space-y-5">
                  {/* Owner Status Header */}
                  <div className="p-3.5 rounded-2xl bg-[#EBF0E6] border border-[#C8D6C4] flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#495E3F] animate-pulse" />
                      <span className="font-bold text-[#33422C]">
                        Mod Owner Aktif • {registeredList.length} Pelatih Berdaftar
                      </span>
                    </div>

                    <button
                      onClick={() => setIsOwnerUnlocked(false)}
                      className="px-3 py-1 rounded-xl bg-white border border-[#C8D6C4] hover:bg-[#FAF9F5] text-[#7A3B2E] font-bold text-[11px] flex items-center gap-1 cursor-pointer"
                    >
                      <Lock className="w-3 h-3" />
                      <span>Kunci Panel</span>
                    </button>
                  </div>

                  {/* Owner Sub Navigation */}
                  <div className="flex flex-wrap gap-1.5 p-1.5 rounded-2xl bg-[#FAF9F5] border border-[#E0E0D0] text-xs font-semibold">
                    <button
                      onClick={() => setOwnerSubTab('batch')}
                      className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                        ownerSubTab === 'batch'
                          ? 'bg-[#D98C70] text-white shadow-xs'
                          : 'text-[#5A5A50] hover:bg-white'
                      }`}
                    >
                      <ListPlus className="w-3.5 h-3.5" />
                      <span>Tampal Pukal (Batch)</span>
                    </button>

                    <button
                      onClick={() => setOwnerSubTab('single')}
                      className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                        ownerSubTab === 'single'
                          ? 'bg-[#D98C70] text-white shadow-xs'
                          : 'text-[#5A5A50] hover:bg-white'
                      }`}
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>Tambah Individu</span>
                    </button>

                    <button
                      onClick={() => setOwnerSubTab('list')}
                      className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                        ownerSubTab === 'list'
                          ? 'bg-[#D98C70] text-white shadow-xs'
                          : 'text-[#5A5A50] hover:bg-white'
                      }`}
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>Senarai ({registeredList.length})</span>
                    </button>

                    <button
                      onClick={() => setOwnerSubTab('settings')}
                      className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                        ownerSubTab === 'settings'
                          ? 'bg-[#D98C70] text-white shadow-xs'
                          : 'text-[#5A5A50] hover:bg-white'
                      }`}
                    >
                      <Settings className="w-3.5 h-3.5" />
                      <span>Tetapan Owner</span>
                    </button>
                  </div>

                  {/* SUB-TAB 1: BATCH IMPORT */}
                  {ownerSubTab === 'batch' && (
                    <form onSubmit={handleBatchImportSubmit} className="space-y-4">
                      <div className="p-3.5 rounded-2xl bg-[#FAF9F5] border border-[#E0E0D0] text-xs text-[#5A5A50] leading-relaxed">
                        <p className="font-bold text-[#4A4A40] mb-1">
                          📋 Panduan Memasukkan Senarai No. Matrik Pukal (Batch):
                        </p>
                        Salin terus dari senarai kelas, Excel, atau WhatsApp dan tampal di bawah. Format yang diterima:
                        <ul className="list-disc list-inside mt-1 font-mono text-[11px] text-[#6A6A5E] space-y-0.5">
                          <li><code>DPF/2026/001 - AHMAD FAIZ</code> (No Matrik - Nama)</li>
                          <li><code>DPKP/2026/002, NURUL IZZAH, Diploma Kesihatan Persekitaran</code></li>
                          <li><code>ILKKMSB/2026/003</code> (No Matrik sahaja, satu baris setiap pelatih)</li>
                        </ul>
                      </div>

                      {batchResult && (
                        <div
                          className={`p-3.5 rounded-2xl border text-xs flex items-start gap-2 ${
                            batchResult.success
                              ? 'bg-[#EBF0E6] border-[#C8D6C4] text-[#33422C]'
                              : 'bg-[#FDF2F0] border-[#EBD0C6] text-[#8E3220]'
                          }`}
                        >
                          {batchResult.success ? (
                            <CheckCircle2 className="w-4 h-4 text-[#495E3F] shrink-0 mt-0.5" />
                          ) : (
                            <AlertCircle className="w-4 h-4 text-[#C74B32] shrink-0 mt-0.5" />
                          )}
                          <div>
                            <p className="font-bold">{batchResult.message}</p>
                          </div>
                        </div>
                      )}

                      <div>
                        <label className="block text-xs font-bold text-[#5A5A50] uppercase tracking-wider mb-1.5">
                          Program Pengajian Lalai (untuk entri tanpa program):
                        </label>
                        <select
                          value={batchDefaultProgramme}
                          onChange={(e) => setBatchDefaultProgramme(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-[#D0D0C0] text-xs font-semibold bg-white"
                        >
                          <option value="Diploma Farmasi">Diploma Farmasi</option>
                          <option value="Diploma Kesihatan Persekitaran">Diploma Kesihatan Persekitaran</option>
                          <option value="Diploma Sains Kejururawatan">Diploma Sains Kejururawatan</option>
                          <option value="Diploma Pembantu Pegawai Perubatan">Diploma Pembantu Pegawai Perubatan</option>
                          <option value="Diploma Fisioterapi / Radiografi">Diploma Fisioterapi / Radiografi</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#5A5A50] uppercase tracking-wider mb-1.5">
                          Tampal Senarai No. Matrik (Satu setiap baris):
                        </label>
                        <textarea
                          rows={6}
                          required
                          value={batchText}
                          onChange={(e) => setBatchText(e.target.value)}
                          placeholder={`Contoh:\nILKKMSB/2026/0120 - MUHAMMAD AIMAN\nILKKMSB/2026/0121 - SITI NUR AISYAH\nDPF/2026/0122`}
                          className="w-full p-3.5 rounded-2xl border-2 border-[#D0D0C0] bg-white text-xs font-mono focus:outline-none focus:border-[#D98C70] focus:ring-2 focus:ring-[#D98C70]/30 placeholder:text-gray-400"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3.5 px-5 rounded-2xl bg-[#D98C70] hover:bg-[#C7795C] text-white font-bold text-sm shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <ListPlus className="w-4 h-4" />
                        <span>Masukkan & Simpan Senarai Pelatih</span>
                      </button>
                    </form>
                  )}

                  {/* SUB-TAB 2: SINGLE ADD */}
                  {ownerSubTab === 'single' && (
                    <form onSubmit={handleSingleAddSubmit} className="space-y-4">
                      <div className="p-3 rounded-xl bg-[#FAF9F5] border border-[#E0E0D0] text-xs text-[#5A5A50]">
                        Daftarkan seorang pelatih baharu terus ke dalam pangkalan data ILKKM Sungai Buloh.
                      </div>

                      {singleMsg && (
                        <div
                          className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
                            singleMsg.success
                              ? 'bg-[#EBF0E6] border-[#C8D6C4] text-[#33422C]'
                              : 'bg-[#FDF2F0] border-[#EBD0C6] text-[#8E3220]'
                          }`}
                        >
                          {singleMsg.success ? (
                            <CheckCircle2 className="w-4 h-4 text-[#495E3F] shrink-0" />
                          ) : (
                            <AlertCircle className="w-4 h-4 text-[#C74B32] shrink-0" />
                          )}
                          <span>{singleMsg.text}</span>
                        </div>
                      )}

                      <div>
                        <label className="block text-xs font-bold text-[#5A5A50] uppercase tracking-wider mb-1">
                          Nombor Matrik Pelatih:
                        </label>
                        <input
                          type="text"
                          required
                          value={singleMatric}
                          onChange={(e) => setSingleMatric(e.target.value)}
                          placeholder="Contoh: GCMT/2026/0550 atau ILKKMSB/2026/0150"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[#D0D0C0] text-xs font-mono font-bold uppercase focus:outline-none focus:ring-2 focus:ring-[#D98C70]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#5A5A50] uppercase tracking-wider mb-1">
                          Nama Penuh Pelatih:
                        </label>
                        <input
                          type="text"
                          required
                          value={singleName}
                          onChange={(e) => setSingleName(e.target.value)}
                          placeholder="Contoh: MOHAMAD SYAFIQ BIN ZAINAL"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[#D0D0C0] text-xs font-semibold uppercase focus:outline-none focus:ring-2 focus:ring-[#D98C70]"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-[#5A5A50] uppercase tracking-wider mb-1">
                            Program:
                          </label>
                          <select
                            value={singleProg}
                            onChange={(e) => setSingleProg(e.target.value)}
                            className="w-full px-3 py-2.5 rounded-xl border border-[#D0D0C0] text-xs font-semibold bg-white focus:outline-none focus:ring-2 focus:ring-[#D98C70]"
                          >
                            <option value="Diploma Farmasi">Diploma Farmasi</option>
                            <option value="Diploma Kesihatan Persekitaran">Diploma Kesihatan Persekitaran</option>
                            <option value="Diploma Sains Kejururawatan">Diploma Sains Kejururawatan</option>
                            <option value="Diploma Pembantu Pegawai Perubatan">Diploma Pembantu Pegawai Perubatan</option>
                            <option value="Diploma Fisioterapi / Radiografi">Diploma Fisioterapi / Radiografi</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-[#5A5A50] uppercase tracking-wider mb-1">
                            Kohort / Sesi:
                          </label>
                          <input
                            type="text"
                            value={singleCohort}
                            onChange={(e) => setSingleCohort(e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-[#D0D0C0] text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#D98C70]"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3.5 px-5 rounded-2xl bg-[#D98C70] hover:bg-[#C7795C] text-white font-bold text-sm shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <UserPlus className="w-4 h-4" />
                        <span>Daftarkan Pelatih Ini</span>
                      </button>
                    </form>
                  )}

                  {/* SUB-TAB 3: MANAGE ROSTER */}
                  {ownerSubTab === 'list' && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-[#5A5A50]">
                          Senarai Pelatih Berdaftar ({registeredList.length} Orang)
                        </span>

                        <button
                          onClick={handleCopyAllMatrics}
                          className="px-3 py-1.5 rounded-xl border border-[#D0D0C0] bg-white hover:bg-[#FAF9F5] text-xs font-bold text-[#4A4A40] flex items-center gap-1.5 cursor-pointer"
                          title="Salin semua senarai ke clipboard"
                        >
                          <Copy className="w-3.5 h-3.5 text-[#D98C70]" />
                          <span>{copyFeedback ? 'Disalin! ✓' : 'Salin Semua'}</span>
                        </button>
                      </div>

                      <div className="relative">
                        <Search className="w-4 h-4 text-[#8A8A7A] absolute left-3.5 top-3" />
                        <input
                          type="text"
                          value={rosterSearch}
                          onChange={(e) => setRosterSearch(e.target.value)}
                          placeholder="Cari nombor matrik atau nama pelatih..."
                          className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl border border-[#D0D0C0] focus:outline-none focus:ring-2 focus:ring-[#D98C70]"
                        />
                      </div>

                      <div className="divide-y divide-[#E0E0D0] border border-[#E0E0D0] rounded-2xl overflow-hidden max-h-72 overflow-y-auto">
                        {filteredRoster.map((t) => (
                          <div 
                            key={t.matricNumber} 
                            className="p-3 bg-white hover:bg-[#FAF9F5] flex items-center justify-between gap-2 text-xs"
                          >
                            <div className="truncate pr-2">
                              <div className="flex items-center gap-2">
                                <span className="font-mono font-bold text-[#33422C]">
                                  {t.matricNumber}
                                </span>
                                <span
                                  className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                                    t.status === 'Aktif'
                                      ? 'bg-[#EBF0E6] text-[#495E3F]'
                                      : 'bg-[#FDF2F0] text-[#8E3220]'
                                  }`}
                                >
                                  {t.status}
                                </span>
                              </div>
                              <p className="font-semibold text-[#4A4A40] text-xs truncate mt-0.5">
                                {t.fullName}
                              </p>
                              <p className="text-[11px] text-[#7A7A6A] truncate">
                                {t.programme} • {t.cohort}
                              </p>
                            </div>

                            <div className="flex items-center space-x-1 shrink-0">
                              <button
                                onClick={() => handleToggleStatus(t.matricNumber)}
                                className="px-2.5 py-1.5 rounded-lg border border-[#D0D0C0] text-[11px] font-bold text-[#5A5A50] hover:bg-[#F5F5F0] cursor-pointer"
                                title="Tukar status pelatih"
                              >
                                {t.status === 'Aktif' ? 'Gantung' : 'Aktifkan'}
                              </button>

                              <button
                                onClick={() => handleDeleteTrainee(t.matricNumber, t.fullName)}
                                className="p-1.5 rounded-lg text-[#C74B32] hover:bg-[#FDF2F0] cursor-pointer"
                                title="Padam daripada senarai"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* SUB-TAB 4: SETTINGS */}
                  {ownerSubTab === 'settings' && (
                    <div className="space-y-5">
                      {/* Change Owner Password */}
                      <form onSubmit={handleUpdatePassword} className="p-4 rounded-2xl border border-[#D0D0C0] bg-[#FAF9F5] space-y-3">
                        <div className="flex items-center gap-2 font-bold text-xs text-[#4A4A40]">
                          <KeyRound className="w-4 h-4 text-[#D98C70]" />
                          <span>Tukar Kata Laluan Owner / Pensyarah</span>
                        </div>

                        {passUpdateMsg && (
                          <div
                            className={`p-2.5 rounded-xl border text-xs flex items-center gap-2 ${
                              passUpdateMsg.success
                                ? 'bg-[#EBF0E6] border-[#C8D6C4] text-[#33422C]'
                                : 'bg-[#FDF2F0] border-[#EBD0C6] text-[#8E3220]'
                            }`}
                          >
                            <span>{passUpdateMsg.text}</span>
                          </div>
                        )}

                        <div className="flex gap-2">
                          <input
                            type="password"
                            required
                            value={newOwnerPass}
                            onChange={(e) => setNewOwnerPass(e.target.value)}
                            placeholder="Kata laluan baharu..."
                            className="flex-1 px-3 py-2 rounded-xl border border-[#D0D0C0] text-xs font-mono font-bold bg-white"
                          />
                          <button
                            type="submit"
                            className="px-4 py-2 rounded-xl bg-[#D98C70] hover:bg-[#C7795C] text-white text-xs font-bold cursor-pointer"
                          >
                            Simpan
                          </button>
                        </div>
                      </form>

                      {/* Reset to Default */}
                      <div className="p-4 rounded-2xl border border-[#EBD0C6] bg-[#FFF9F6] flex items-center justify-between gap-3">
                        <div>
                          <p className="text-xs font-bold text-[#8E472D]">
                            Tetapkan Semula ke Senarai Asal Kolej
                          </p>
                          <p className="text-[11px] text-[#7A554A]">
                            Mengembalikan senarai pelatih kepada rekod asal ILKKM Sungai Buloh.
                          </p>
                        </div>

                        <button
                          onClick={handleResetToDefault}
                          className="px-3 py-2 rounded-xl bg-white border border-[#EBD0C6] hover:bg-[#FBE8E1] text-[#8E472D] text-xs font-bold flex items-center gap-1.5 cursor-pointer shrink-0"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          <span>Reset</span>
                        </button>
                      </div>
                    </div>
                  )}

                </div>
              )}
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-[#FAF9F5] border-t border-[#E0E0D0] flex items-center justify-between text-xs text-[#7A7A6A]">
          <span>Modul Terhad: Pelatih Berdaftar ILKKM Sungai Buloh Sahaja</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white border border-[#D0D0C0] hover:bg-[#F5F5F0] text-[#5A5A50] font-bold text-xs cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
