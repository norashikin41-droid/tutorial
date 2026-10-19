import React, { useState, useRef } from 'react';
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
  LogOut,
  ArrowRight,
  UserPlus,
  FileText,
  Trash2,
  Copy,
  Settings,
  Upload,
  Download,
  CreditCard,
  User,
  GraduationCap,
  BarChart3,
  Eye,
  Award,
  Calendar,
  Clock,
  Printer,
  ChevronRight,
  Sparkles,
  Check
} from 'lucide-react';
import { 
  verifyAndLoginTrainee, 
  getRegisteredTrainees, 
  logoutMatricSession,
  getMatricSession,
  OFFICIAL_INSTITUTION_NAME,
  verifyOwnerPassword,
  updateOwnerPassword,
  addTraineeByOwner,
  importTraineesFromCsvData,
  batchImportTraineesByOwner,
  deleteTraineeByOwner,
  toggleTraineeStatusByOwner,
  resetRegisteredTraineesToDefault,
  clearAllRegisteredTrainees,
  exportTraineesToCsv,
  formatIcNumber,
  loginAsTraineeDirectly
} from '../utils/matricAuth';
import { 
  getAllTraineeAssessments, 
  resetSingleTraineeAssessment, 
  exportAssessmentReportToCsv 
} from '../utils/assessmentStorage';
import { MatricAuthSession, RegisteredTrainee, TraineeAssessmentSummary } from '../types';

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
  
  // Student verification states (No Kad Pengenalan & Nama Penuh)
  const [studentIc, setStudentIc] = useState('');
  const [studentName, setStudentName] = useState('');
  const [studentError, setStudentError] = useState<string | null>(null);
  const [studentSuccess, setStudentSuccess] = useState<string | null>(null);
  const [showQuickSelect, setShowQuickSelect] = useState(false);
  const [quickSearch, setQuickSearch] = useState('');

  // Owner authentication states
  const [isOwnerUnlocked, setIsOwnerUnlocked] = useState(false);
  const [ownerPasswordInput, setOwnerPasswordInput] = useState('');
  const [ownerAuthError, setOwnerAuthError] = useState<string | null>(null);

  // Owner panel sub-tabs (Default ke 'monitor' untuk memantau pelatih yang dinilai)
  const [ownerSubTab, setOwnerSubTab] = useState<'monitor' | 'list' | 'upload' | 'single' | 'settings'>('monitor');
  const [monitorFilter, setMonitorFilter] = useState<'all' | 'evaluated' | 'unevaluated' | 'gradeA'>('all');
  const [monitorSearch, setMonitorSearch] = useState('');
  const [selectedTraineeTranscript, setSelectedTraineeTranscript] = useState<TraineeAssessmentSummary | null>(null);
  const [switchFeedback, setSwitchFeedback] = useState<string | null>(null);

  // CSV file upload / text paste states
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [csvUploadReplace, setCsvUploadReplace] = useState(true);
  const [rawCsvText, setRawCsvText] = useState('');
  const [uploadFeedback, setUploadFeedback] = useState<{
    success: boolean;
    totalParsed: number;
    addedCount: number;
    duplicateCount: number;
    message: string;
  } | null>(null);

  // Owner single add states
  const [singleIc, setSingleIc] = useState('');
  const [singleFullName, setSingleFullName] = useState('');
  const [singleMatric, setSingleMatric] = useState('');
  const [singleProg, setSingleProg] = useState('Diploma Farmasi');
  const [singleCohort, setSingleCohort] = useState('Sesi 2026/2027');
  const [singleMsg, setSingleMsg] = useState<{ success: boolean; text: string } | null>(null);

  // Owner roster search state
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
  const traineeAssessments = getAllTraineeAssessments();

  if (!isOpen) return null;

  // Pelatih submit Nombor Kad Pengenalan & Nama Penuh
  const handleStudentLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setStudentError(null);
    setStudentSuccess(null);

    const res = verifyAndLoginTrainee(studentIc, studentName);
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
  const handleSelectQuickTrainee = (trainee: RegisteredTrainee) => {
    setStudentIc(trainee.icNumber);
    setStudentName(trainee.fullName);
    setStudentError(null);
    setShowQuickSelect(false);

    const res = verifyAndLoginTrainee(trainee.icNumber, trainee.fullName);
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

  // Pengajar bertukar / log masuk terus sebagai pelatih tertentu
  const handleSwitchToTrainee = (trainee: RegisteredTrainee) => {
    const session = loginAsTraineeDirectly(trainee);
    onAuthSuccess(session);
    setSwitchFeedback(`Berjaya bertukar ke sesi pelatih: ${trainee.fullName}.`);
    refreshData();
    setTimeout(() => {
      setSwitchFeedback(null);
      onClose();
    }, 900);
  };

  // Owner log masuk (Kata laluan 200810)
  const handleOwnerUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    setOwnerAuthError(null);

    if (verifyOwnerPassword(ownerPasswordInput)) {
      setIsOwnerUnlocked(true);
      setOwnerPasswordInput('');
    } else {
      setOwnerAuthError('Kata laluan Pengajar tidak tepat. Sila hubungi Puan Norashikin Bt M Noor Arzmi.');
    }
  };

  // Pengendali muat naik fail CSV fizikal (MAKLUMAT PELATIH.csv)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (!content) {
        setUploadFeedback({
          success: false,
          totalParsed: 0,
          addedCount: 0,
          duplicateCount: 0,
          message: 'Gagal membaca fail CSV atau fail kosong.',
        });
        return;
      }

      const result = importTraineesFromCsvData(content, csvUploadReplace);
      setUploadFeedback(result);
      refreshData();
      if (fileInputRef.current) fileInputRef.current.value = '';
    };

    reader.onerror = () => {
      setUploadFeedback({
        success: false,
        totalParsed: 0,
        addedCount: 0,
        duplicateCount: 0,
        message: 'Ralat teknikal semasa membaca fail CSV.',
      });
    };

    reader.readAsText(file, 'UTF-8');
  };

  // Pengendali tampal CSV teks
  const handlePasteCsvSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rawCsvText.trim()) return;

    const result = importTraineesFromCsvData(rawCsvText, csvUploadReplace);
    setUploadFeedback(result);
    if (result.success) {
      setRawCsvText('');
    }
    refreshData();
  };

  // Pengendali tambah individu
  const handleSingleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSingleMsg(null);

    const res = addTraineeByOwner({
      icNumber: singleIc,
      fullName: singleFullName,
      matricNumber: singleMatric || undefined,
      programme: singleProg,
      cohort: singleCohort,
    });

    setSingleMsg({ success: res.success, text: res.message });
    if (res.success) {
      setSingleIc('');
      setSingleFullName('');
      setSingleMatric('');
      refreshData();
    }
  };

  // Owner padam pelatih
  const handleDeleteTrainee = (icNumber: string, name: string) => {
    const confirmDelete = window.confirm(
      `Adakah anda pasti ingin memadam pelatih:\n${name} (No. K/P: ${icNumber})\ndaripada senarai berdaftar ILKKM Sungai Buloh?`
    );
    if (!confirmDelete) return;

    deleteTraineeByOwner(icNumber);
    refreshData();
  };

  // Owner tukar status aktif/gantung
  const handleToggleStatus = (icNumber: string) => {
    toggleTraineeStatusByOwner(icNumber);
    refreshData();
  };

  // Salin senarai ke clipboard
  const handleCopyAllTrainees = () => {
    const text = registeredList
      .map((t, i) => `${i + 1}. ${t.icNumber} - ${t.fullName} (${t.programme})`)
      .join('\n');
    navigator.clipboard.writeText(text);
    setCopyFeedback(true);
    setTimeout(() => setCopyFeedback(false), 2000);
  };

  // Muat turun fail CSV maklumat pelatih
  const handleDownloadCsv = () => {
    const csvData = exportTraineesToCsv();
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `MAKLUMAT_PELATIH_ILKKMSB_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Muat turun laporan markah penilaian
  const handleDownloadAssessmentCsv = () => {
    const csvData = exportAssessmentReportToCsv();
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `LAPORAN_PENILAIAN_GCMT2052_ILKKMSB_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Padam / Set semula markah penilaian seorang pelatih
  const handleResetTraineeScore = (icNumber: string, name: string) => {
    const confirmReset = window.confirm(`Set semula semua rekod dan markah penilaian bagi ${name}?`);
    if (!confirmReset) return;

    resetSingleTraineeAssessment(icNumber);
    refreshData();
    if (selectedTraineeTranscript && selectedTraineeTranscript.icNumber === icNumber) {
      setSelectedTraineeTranscript(null);
    }
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

  // Padam / kosongkan semua senarai pelatih dalam sistem
  const handleClearAllTrainees = () => {
    const confirmClear = window.confirm(
      "Adakah anda pasti ingin MEMADAM SEMUA senarai nama pelatih yang terdapat dalam sistem?\n\nTindakan ini akan mengosongkan senarai supaya Pengajar boleh memasukkan nama pelatih yang berdaftar sesi ini secara bersih."
    );
    if (!confirmClear) return;
    clearAllRegisteredTrainees();
    refreshData();
  };

  // Filter senarai pelatih
  const filteredRoster = registeredList.filter(
    (t) =>
      t.fullName.toLowerCase().includes(rosterSearch.toLowerCase()) ||
      t.icNumber.toLowerCase().includes(rosterSearch.toLowerCase()) ||
      (t.matricNumber && t.matricNumber.toLowerCase().includes(rosterSearch.toLowerCase())) ||
      t.programme.toLowerCase().includes(rosterSearch.toLowerCase())
  );

  const filteredQuickList = registeredList.filter(
    (t) =>
      t.fullName.toLowerCase().includes(quickSearch.toLowerCase()) ||
      t.icNumber.toLowerCase().includes(quickSearch.toLowerCase()) ||
      t.programme.toLowerCase().includes(quickSearch.toLowerCase())
  );

  // Penapisan pemantauan penilaian
  const filteredAssessments = traineeAssessments.filter((item) => {
    const matchesSearch = 
      item.fullName.toLowerCase().includes(monitorSearch.toLowerCase()) ||
      item.icNumber.toLowerCase().includes(monitorSearch.toLowerCase()) ||
      (item.matricNumber && item.matricNumber.toLowerCase().includes(monitorSearch.toLowerCase())) ||
      item.programme.toLowerCase().includes(monitorSearch.toLowerCase());

    if (!matchesSearch) return false;

    if (monitorFilter === 'evaluated') return item.isEvaluated;
    if (monitorFilter === 'unevaluated') return !item.isEvaluated;
    if (monitorFilter === 'gradeA') return item.grade === 'A';
    return true;
  });

  // Statistik pemantauan
  const evaluatedCount = traineeAssessments.filter((t) => t.isEvaluated).length;
  const evaluatedPercent = Math.round((evaluatedCount / (traineeAssessments.length || 1)) * 100);
  const evaluatedScores = traineeAssessments.filter((t) => t.isEvaluated).map((t) => t.averageScore);
  const overallAvgScore = evaluatedScores.length > 0 
    ? Math.round(evaluatedScores.reduce((a, b) => a + b, 0) / evaluatedScores.length) 
    : 0;
  const gradeACount = traineeAssessments.filter((t) => t.grade === 'A').length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-[#D0D0C0]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* MODAL HEADER */}
        <div className="p-5 sm:p-6 bg-[#33422C] text-white relative shrink-0">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-11 h-11 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6 text-[#A6BF9F]" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#A6BF9F] block">
                  ILKKM Sungai Buloh • GCMT 2052
                </span>
                <h3 className="text-lg sm:text-xl font-black">
                  Pengesahan & Pengurusan Pelatih
                </h3>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title="Tutup"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {requiredForAction && (
            <div className="mt-3 py-1.5 px-3 rounded-xl bg-[#D98C70]/30 border border-[#D98C70]/50 text-white text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-[#FFC4B0] shrink-0" />
              <span>Sila sahkan MyKad anda sebelum memulakan: <strong>{requiredForAction}</strong></span>
            </div>
          )}

          {/* MAIN TABS: PELATIH VS PENGAJAR */}
          <div className="grid grid-cols-2 gap-2 mt-4 p-1 rounded-2xl bg-black/20 border border-white/10 text-xs">
            <button
              onClick={() => setMainTab('student')}
              className={`py-2 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                mainTab === 'student'
                  ? 'bg-white text-[#33422C] shadow-sm'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>Pelatih ({currentSession.isVerified ? 'Aktif' : 'Log Masuk'})</span>
            </button>

            <button
              onClick={() => setMainTab('owner')}
              className={`py-2 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                mainTab === 'owner'
                  ? 'bg-[#D98C70] text-white shadow-sm'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <KeyRound className="w-4 h-4" />
              <span>Pengajar: Pn Norashikin</span>
            </button>
          </div>
        </div>

        {/* FEEDBACK POPUP JIKA TUKAR SESI */}
        {switchFeedback && (
          <div className="bg-[#EBF0E6] border-b border-[#C8D6C4] px-5 py-2.5 text-xs text-[#33422C] font-bold flex items-center justify-between animate-in slide-in-from-top">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#495E3F]" />
              <span>{switchFeedback}</span>
            </span>
            <span className="text-[11px] text-[#495E3F]">Menutup tingkap...</span>
          </div>
        )}

        {/* MODAL BODY */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
          {mainTab === 'student' ? (
            /* ========================================================= */
            /* TAB 1: LOG MASUK PELATIH (IC & NAMA PENUH)                */
            /* ========================================================= */
            <div className="space-y-5 animate-in fade-in">
              {/* STATUS SESI AKTIF PELATIH */}
              {currentSession.isVerified && currentSession.studentName ? (
                <div className="p-4 sm:p-5 rounded-2xl bg-[#EBF0E6] border-2 border-[#C8D6C4] space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-[#495E3F] text-white flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-6 h-6 text-[#D5E2D0]" />
                      </div>
                      <div>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-[#495E3F] block">
                          Sesi Pelatih Sah & Aktif
                        </span>
                        <h4 className="text-base font-black text-[#142611]">
                          {currentSession.studentName}
                        </h4>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-[#33422C] mt-0.5">
                          {currentSession.icNumber && (
                            <span className="font-mono font-bold bg-white px-2 py-0.5 rounded-md border border-[#C8D6C4]">
                              K/P: {currentSession.icNumber}
                            </span>
                          )}
                          {currentSession.programme && (
                            <span>• {currentSession.programme}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={handleStudentLogout}
                      className="px-3 py-2 rounded-xl bg-white border border-[#C8D6C4] text-[#A35C42] hover:bg-[#FDF5F2] hover:border-[#D98C70] text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                      title="Log Keluar untuk memilih pelatih lain"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Log Keluar</span>
                    </button>
                  </div>

                  <div className="pt-2 border-t border-[#C8D6C4]/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-[#495E3F]">
                    <span>Akses penuh ke semua 10 unit soalan dan sijil digital GCMT 2052 aktif.</span>
                    <button
                      type="button"
                      onClick={() => setShowQuickSelect(!showQuickSelect)}
                      className="font-bold underline text-[#33422C] hover:text-[#1F291B] text-left cursor-pointer"
                    >
                      Tukar ke Pelatih Lain?
                    </button>
                  </div>
                </div>
              ) : (
                /* BORANG LOG MASUK PELATIH */
                <div className="space-y-4">
{registeredList.length === 0 ? (
                    <div className="p-4 rounded-2xl bg-[#FFF9F2] border-2 border-[#F3D5B5] text-xs space-y-2.5">
                      <div className="flex items-start gap-2.5">
                        <AlertCircle className="w-5 h-5 text-[#C06014] shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold text-[#8C4307] text-sm">Senarai Pelatih Telah Dikosongkan</p>
                          <p className="text-[#8C4307]/90 mt-1 leading-relaxed">
                            Semua senarai nama lama dalam sistem telah dipadamkan mengikut arahan. Pengajar (Pn Norashikin) akan memasukkan senarai nama pelatih yang berdaftar sesi ini melalui <strong>Panel Pengajar</strong>.
                          </p>
                        </div>
                      </div>
                      <div className="pt-2 border-t border-[#F3D5B5]/60 flex justify-end">
                        <button
                          type="button"
                          onClick={() => setMainTab("owner")}
                          className="px-3.5 py-1.5 rounded-xl bg-[#8C4307] hover:bg-[#703404] text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                        >
                          <Lock className="w-3.5 h-3.5" />
                          <span>Buka Akses Pengajar (Daftar Pelatih)</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 rounded-2xl bg-[#FAF9F5] border border-[#E0E0D0] text-xs text-[#4A4A40] space-y-1.5">
                      <div className="flex items-start gap-2 font-bold text-[#33422C]">
                        <AlertCircle className="w-4 h-4 text-[#495E3F] shrink-0 mt-0.5" />
                        <span>Akses Rasmi Pelatih Berdaftar ILKKM Sungai Buloh</span>
                      </div>
                      <p className="leading-relaxed">
                        Sila masukkan <strong>Nombor Kad Pengenalan</strong> dan <strong>Nama Penuh</strong> anda seperti yang didaftarkan dalam senarai rasmi GCMT 2052. Anda juga boleh menggunakan pilihan pantas di bawah untuk memilih nama pelatih.
                      </p>
                    </div>
                  )}

                  {studentError && (
                    <div className="p-4 rounded-2xl bg-[#FDF5F2] border-2 border-[#EBD0C6] text-[#A35C42] text-xs flex items-start gap-3 animate-in shake">
                      <ShieldAlert className="w-5 h-5 text-[#D98C70] shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <strong className="block font-bold">Akses Tidak Dibenarkan</strong>
                        <p>{studentError}</p>
                      </div>
                    </div>
                  )}

                  {studentSuccess && (
                    <div className="p-4 rounded-2xl bg-[#EBF0E6] border-2 border-[#C8D6C4] text-[#33422C] text-xs flex items-center gap-2 font-bold animate-in fade-in">
                      <CheckCircle2 className="w-5 h-5 text-[#495E3F] shrink-0" />
                      <span>{studentSuccess}</span>
                    </div>
                  )}

                  <form onSubmit={handleStudentLogin} className="space-y-4">
                    {/* MEDAN 1: NOMBOR KAD PENGENALAN */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-[#33422C] uppercase tracking-wider flex items-center gap-1.5">
                        <CreditCard className="w-4 h-4 text-[#495E3F]" />
                        <span>Nombor Kad Pengenalan (MyKad)</span>
                      </label>
                      <input
                        type="text"
                        value={studentIc}
                        onChange={(e) => setStudentIc(e.target.value)}
                        placeholder="cth: 060413-06-0031 atau 060413060031"
                        className="w-full px-4 py-3 rounded-2xl border-2 border-[#D0D0C0] bg-white text-sm font-mono font-bold text-[#33422C] focus:outline-none focus:border-[#495E3F] focus:ring-2 focus:ring-[#A3AD94]/40 placeholder:text-gray-400"
                        required
                        autoFocus
                      />
                    </div>

                    {/* MEDAN 2: NAMA PENUH */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-[#33422C] uppercase tracking-wider flex items-center gap-1.5">
                        <User className="w-4 h-4 text-[#495E3F]" />
                        <span>Nama Penuh Pelatih</span>
                      </label>
                      <input
                        type="text"
                        value={studentName}
                        onChange={(e) => setStudentName(e.target.value)}
                        placeholder="cth: MUHAMMAD AFIQ IRFAN BIN AZMI"
                        className="w-full px-4 py-3 rounded-2xl border-2 border-[#D0D0C0] bg-white text-sm font-bold text-[#33422C] focus:outline-none focus:border-[#495E3F] focus:ring-2 focus:ring-[#A3AD94]/40 placeholder:text-gray-400 uppercase"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3.5 px-6 rounded-2xl bg-[#33422C] hover:bg-[#253220] text-white text-sm font-black flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                    >
                      <ShieldCheck className="w-5 h-5 text-[#A6BF9F]" />
                      <span>Sahkan Kad Pengenalan & Masuk</span>
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </button>
                  </form>
                </div>
              )}

              {/* QUICK SELECT TESTER HELPER (UNTUK MELIHAT PELATIH LAIN) */}
              <div className="pt-2 border-t border-[#E0E0D0]">
                <button
                  type="button"
                  onClick={() => setShowQuickSelect(!showQuickSelect)}
                  className="w-full py-2.5 px-3 rounded-2xl bg-[#FAF9F5] hover:bg-[#EBF0E6] text-[#495E3F] text-xs font-bold flex items-center justify-between border border-[#D0D0C0] transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-[#D98C70]" />
                    <span>Pilih Dari Senarai Pelatih Berdaftar (Tukar / Uji Pantas)</span>
                  </span>
                  <span className="text-[11px] font-mono bg-white px-2 py-0.5 rounded-full border border-[#D0D0C0]">
                    {showQuickSelect ? 'Tutup Senarai' : `Buka (${registeredList.length} Pelatih)`}
                  </span>
                </button>

                {showQuickSelect && (
                  <div className="mt-3 p-3 rounded-2xl bg-white border border-[#C8D6C4] shadow-md space-y-2 animate-in fade-in">
                    <div className="relative">
                      <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#7A7A6A]" />
                      <input
                        type="text"
                        value={quickSearch}
                        onChange={(e) => setQuickSearch(e.target.value)}
                        placeholder="Cari nama, IC atau program pelatih..."
                        className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-[#D0D0C0] bg-[#FAF9F5] focus:outline-none focus:border-[#495E3F]"
                        autoFocus
                      />
                    </div>

                    <div className="max-h-56 overflow-y-auto space-y-1.5 pr-1 divide-y divide-gray-100">
                      {filteredQuickList.map((t, idx) => (
                        <div
                          key={t.icNumber + idx}
                          className="pt-1.5 flex items-center justify-between text-xs hover:bg-[#F5F8F4] p-1.5 rounded-xl transition-colors"
                        >
                          <div className="pr-2 min-w-0 flex-1">
                            <span className="font-bold text-[#142611] block truncate">
                              {idx + 1}. {t.fullName}
                            </span>
                            <span className="text-[11px] font-mono text-[#55694D] block">
                              {t.icNumber} • {t.programme}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleSelectQuickTrainee(t)}
                            className="text-[10px] bg-[#33422C] hover:bg-[#23311E] text-white font-bold px-3 py-1.5 rounded-lg shrink-0 cursor-pointer shadow-2xs"
                          >
                            Pilih Pelatih
                          </button>
                        </div>
                      ))}
                      {filteredQuickList.length === 0 && (
                        <p className="text-center py-4 text-xs text-gray-500">
                          Tiada pelatih dijumpai.
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* ========================================================= */
            /* TAB 2: PANEL PENGAJAR / OWNER (PUAN NORASHIKIN)          */
            /* ========================================================= */
            <div className="space-y-5 animate-in fade-in">
              {!isOwnerUnlocked ? (
                /* KUNCI KATA LALUAN OWNER */
                <div className="text-center py-6 px-4 space-y-4 max-w-md mx-auto">
                  <div className="w-14 h-14 rounded-3xl bg-[#FDF5F2] border-2 border-[#EBD0C6] flex items-center justify-center mx-auto text-[#D98C70]">
                    <Lock className="w-7 h-7" />
                  </div>

                  <div className="space-y-1">
                    <h4 className="text-base font-black text-[#33422C]">
                      Akses Khas Pengajar (Puan Norashikin)
                    </h4>
                    <p className="text-xs text-[#68685C]">
                      Sila masukkan kata laluan pengajar untuk memantau penilaian pelatih, memuat naik fail CSV, atau menyunting data.
                    </p>
                  </div>

                  {ownerAuthError && (
                    <div className="p-3 rounded-xl bg-[#FDF5F2] border border-[#EBD0C6] text-[#A35C42] text-xs font-semibold">
                      {ownerAuthError}
                    </div>
                  )}

                  <form onSubmit={handleOwnerUnlock} className="space-y-3">
                    <input
                      type="password"
                      value={ownerPasswordInput}
                      onChange={(e) => setOwnerPasswordInput(e.target.value)}
                      placeholder="Masukkan Kata Laluan Pengajar"
                      className="w-full px-4 py-3 rounded-xl border-2 border-[#D0D0C0] bg-white text-sm text-center font-bold text-[#33422C] focus:outline-none focus:border-[#D98C70]"
                      autoFocus
                    />

                    <button
                      type="submit"
                      className="w-full py-3 px-4 rounded-xl bg-[#D98C70] hover:bg-[#C7795C] text-white text-xs font-black flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer"
                    >
                      <Unlock className="w-4 h-4" />
                      <span>Buka Akses Panel Pengajar</span>
                    </button>
                  </form>
                  <p className="text-[11px] text-[#8A8A7A]">
                    Akses selamat terhad kepada Pengajar Kursus Matematik sahaja.
                  </p>
                </div>
              ) : (
                /* PANEL OWNER BERJAYA DIBUKA */
                <div className="space-y-4">
                  {/* PENUNJUK SESI SEMASA & LOG KELUAR PANTAS */}
                  <div className="p-3 rounded-2xl bg-[#EBF0E6] border border-[#C8D6C4] flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <UserCheck className="w-4 h-4 text-[#495E3F]" />
                      <span>
                        Sesi Pelatih Aktif: <strong>{currentSession.isVerified ? currentSession.studentName : 'Tiada (Belum Log Masuk)'}</strong>
                      </span>
                    </div>

                    {currentSession.isVerified && (
                      <button
                        type="button"
                        onClick={handleStudentLogout}
                        className="px-2.5 py-1 rounded-xl bg-white hover:bg-[#FDF5F2] text-[#A35C42] border border-[#C8D6C4] text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                        title="Log Keluar Pelatih Semasa"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Log Keluar Pelatih</span>
                      </button>
                    )}
                  </div>

                  {/* SUB-TABS OWNER */}
                  <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-2xl bg-[#FAF9F5] border border-[#D0D0C0] text-xs">
                    <button
                      onClick={() => setOwnerSubTab('monitor')}
                      className={`flex-1 py-2 px-3 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                        ownerSubTab === 'monitor'
                          ? 'bg-[#33422C] text-white shadow-xs'
                          : 'text-[#4A4A40] hover:bg-[#EBF0E6]'
                      }`}
                    >
                      <BarChart3 className="w-3.5 h-3.5" />
                      <span>Pemantauan Penilaian ({evaluatedCount})</span>
                    </button>

                    <button
                      onClick={() => setOwnerSubTab('list')}
                      className={`py-2 px-3 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                        ownerSubTab === 'list'
                          ? 'bg-[#33422C] text-white shadow-xs'
                          : 'text-[#4A4A40] hover:bg-[#EBF0E6]'
                      }`}
                    >
                      <User className="w-3.5 h-3.5" />
                      <span>Senarai ({registeredList.length})</span>
                    </button>

                    <button
                      onClick={() => setOwnerSubTab('upload')}
                      className={`py-2 px-3 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                        ownerSubTab === 'upload'
                          ? 'bg-[#33422C] text-white shadow-xs'
                          : 'text-[#4A4A40] hover:bg-[#EBF0E6]'
                      }`}
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Muat Naik CSV</span>
                    </button>

                    <button
                      onClick={() => setOwnerSubTab('single')}
                      className={`py-2 px-2.5 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                        ownerSubTab === 'single'
                          ? 'bg-[#33422C] text-white shadow-xs'
                          : 'text-[#4A4A40] hover:bg-[#EBF0E6]'
                      }`}
                      title="Tambah Pelatih Individu"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Tambah</span>
                    </button>

                    <button
                      onClick={() => setOwnerSubTab('settings')}
                      className={`py-2 px-2.5 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                        ownerSubTab === 'settings'
                          ? 'bg-[#33422C] text-white shadow-xs'
                          : 'text-[#4A4A40] hover:bg-[#EBF0E6]'
                      }`}
                      title="Tetapan & Kata Laluan"
                    >
                      <Settings className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* ==================================================== */}
                  {/* SUB-PANEL 1: PEMANTAUAN PENILAIAN PELATIH            */}
                  {/* ==================================================== */}
                  {ownerSubTab === 'monitor' && (
                    <div className="space-y-4 animate-in fade-in">
                      {/* STATISTIK KAD RINGKASAN */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                        <div className="p-3 rounded-2xl bg-[#FAF9F5] border border-[#E0E0D0] space-y-0.5">
                          <span className="text-[11px] text-[#7A7A6A] block">Jumlah Pelatih</span>
                          <span className="text-lg font-black text-[#33422C]">{traineeAssessments.length}</span>
                          <span className="text-[10px] text-[#495E3F] block font-semibold">100% Berdaftar</span>
                        </div>

                        <div className="p-3 rounded-2xl bg-[#EBF0E6] border border-[#C8D6C4] space-y-0.5">
                          <span className="text-[11px] text-[#495E3F] block">Telah Dinilai</span>
                          <span className="text-lg font-black text-[#23311E]">{evaluatedCount}</span>
                          <span className="text-[10px] text-[#33422C] block font-semibold">{evaluatedPercent}% Mengambil Ujian</span>
                        </div>

                        <div className="p-3 rounded-2xl bg-[#FAF9F5] border border-[#E0E0D0] space-y-0.5">
                          <span className="text-[11px] text-[#7A7A6A] block">Belum Dinilai</span>
                          <span className="text-lg font-black text-[#7A7A6A]">{traineeAssessments.length - evaluatedCount}</span>
                          <span className="text-[10px] text-[#8A8A7A] block">Menunggu Giliran</span>
                        </div>

                        <div className="p-3 rounded-2xl bg-[#FDF5F2] border border-[#EBD0C6] space-y-0.5">
                          <span className="text-[11px] text-[#A35C42] block">Purata Skor / Gred A</span>
                          <span className="text-lg font-black text-[#8E472D]">{overallAvgScore}%</span>
                          <span className="text-[10px] text-[#D98C70] block font-semibold">{gradeACount} Gred A (≥80%)</span>
                        </div>
                      </div>

                      {/* PENAPIS & CARIAN */}
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-1 overflow-x-auto pb-1 text-xs">
                          <button
                            type="button"
                            onClick={() => setMonitorFilter('all')}
                            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-colors cursor-pointer ${
                              monitorFilter === 'all'
                                ? 'bg-[#33422C] text-white'
                                : 'bg-[#FAF9F5] text-[#5A5A50] hover:bg-[#EBF0E6]'
                            }`}
                          >
                            Semua ({traineeAssessments.length})
                          </button>
                          <button
                            type="button"
                            onClick={() => setMonitorFilter('evaluated')}
                            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-colors cursor-pointer ${
                              monitorFilter === 'evaluated'
                                ? 'bg-[#495E3F] text-white'
                                : 'bg-[#EBF0E6] text-[#33422C] hover:bg-[#D8E6D3]'
                            }`}
                          >
                            Telah Dinilai ({evaluatedCount})
                          </button>
                          <button
                            type="button"
                            onClick={() => setMonitorFilter('unevaluated')}
                            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-colors cursor-pointer ${
                              monitorFilter === 'unevaluated'
                                ? 'bg-[#7A7A6A] text-white'
                                : 'bg-[#FAF9F5] text-[#5A5A50] hover:bg-[#EBF0E6]'
                            }`}
                          >
                            Belum Dinilai ({traineeAssessments.length - evaluatedCount})
                          </button>
                          <button
                            type="button"
                            onClick={() => setMonitorFilter('gradeA')}
                            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-colors cursor-pointer ${
                              monitorFilter === 'gradeA'
                                ? 'bg-[#D98C70] text-white'
                                : 'bg-[#FDF5F2] text-[#8E472D] hover:bg-[#FBE8E1]'
                            }`}
                          >
                            Gred A ({gradeACount})
                          </button>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={handleDownloadAssessmentCsv}
                            className="px-3 py-1.5 rounded-xl bg-[#33422C] hover:bg-[#253220] text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                            title="Muat Turun Lembaran Markah Penilaian"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Eksport CSV</span>
                          </button>
                        </div>
                      </div>

                      {/* KOTAK CARIAN PELATIH */}
                      <div className="relative">
                        <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#7A7A6A]" />
                        <input
                          type="text"
                          value={monitorSearch}
                          onChange={(e) => setMonitorSearch(e.target.value)}
                          placeholder="Cari pelatih yang dinilai (Nama, MyKad, Program)..."
                          className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#D0D0C0] bg-white focus:outline-none focus:border-[#495E3F]"
                        />
                      </div>

                      {/* JADUAL SENARAI PELATIH & STATUS PENILAIAN */}
                      <div className="max-h-80 overflow-y-auto rounded-2xl border border-[#D0D0C0] divide-y divide-[#EAEAE0] bg-white text-xs">
                        {filteredAssessments.map((item, idx) => (
                          <div
                            key={item.icNumber + idx}
                            className="p-3 sm:p-3.5 hover:bg-[#FAF9F5] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                          >
                            {/* MAKLUMAT PELATIH */}
                            <div className="space-y-1 min-w-0 flex-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-bold text-[#142611]">
                                  {idx + 1}. {item.fullName}
                                </span>
                                {item.isEvaluated ? (
                                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#EBF0E6] text-[#2C4A22] border border-[#C8D6C4] flex items-center gap-1">
                                    <Check className="w-3 h-3" />
                                    Telah Dinilai
                                  </span>
                                ) : (
                                  <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#F2F2EC] text-[#7A7A6A]">
                                    Belum Dinilai
                                  </span>
                                )}
                              </div>

                              <div className="flex flex-wrap items-center gap-2 text-[11px] text-[#68685C]">
                                <span className="font-mono font-bold text-[#33422C]">
                                  No. K/P: {item.icNumber}
                                </span>
                                {item.matricNumber && (
                                  <span>• Matrik: {item.matricNumber}</span>
                                )}
                                <span>• {item.programme}</span>
                              </div>

                              {/* HASIL PENILAIAN RINGKAS */}
                              {item.isEvaluated ? (
                                <div className="flex flex-wrap items-center gap-3 pt-1 text-xs">
                                  <span className="font-bold text-[#2A3B25]">
                                    Purata Skor: <strong className="text-sm font-black text-[#33422C]">{item.averageScore}%</strong>
                                  </span>
                                  <span className="px-2 py-0.5 rounded-md font-bold text-[11px] bg-[#E8F0E8] text-[#33422C]">
                                    Gred: {item.grade}
                                  </span>
                                  <span className="text-[#6A6A5E] text-[11px]">
                                    {item.totalAttempts} Percubaan • {item.completedTopics.length} Unit Selesai
                                  </span>
                                </div>
                              ) : (
                                <div className="text-[11px] text-[#8A8A7A] italic">
                                  Tiada rekod kuiz atau ujian setakat ini.
                                </div>
                              )}
                            </div>

                            {/* BUTANG TINDAKAN PENGAJAR */}
                            <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                              {item.isEvaluated && (
                                <button
                                  type="button"
                                  onClick={() => setSelectedTraineeTranscript(item)}
                                  className="px-2.5 py-1.5 rounded-xl bg-[#FAF9F5] hover:bg-[#EBF0E6] text-[#33422C] border border-[#D0D0C0] text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                                  title="Lihat transkrip terperinci kuiz pelatih"
                                >
                                  <BarChart3 className="w-3.5 h-3.5 text-[#495E3F]" />
                                  <span>Transkrip</span>
                                </button>
                              )}

                              <button
                                type="button"
                                onClick={() => {
                                  const target = registeredList.find((t) => t.icNumber === item.icNumber);
                                  if (target) handleSwitchToTrainee(target);
                                }}
                                className="px-2.5 py-1.5 rounded-xl bg-[#33422C] hover:bg-[#23311E] text-white text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer shadow-2xs"
                                title="Lihat dan uji aplikasi sebagai pelatih ini"
                              >
                                <Eye className="w-3.5 h-3.5 text-[#A6BF9F]" />
                                <span>Lihat Sebagai Pelatih</span>
                              </button>

                              {item.isEvaluated && (
                                <button
                                  type="button"
                                  onClick={() => handleResetTraineeScore(item.icNumber, item.fullName)}
                                  className="p-1.5 rounded-xl text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                                  title="Set Semula Markah"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </div>
                        ))}

                        {filteredAssessments.length === 0 && (
                          traineeAssessments.length === 0 ? (
                            <div className="p-8 rounded-3xl bg-[#FAF9F5] border-2 border-dashed border-[#C8D6C4] text-center space-y-3">
                              <div className="w-14 h-14 rounded-2xl bg-[#EBF0E6] text-[#33422C] flex items-center justify-center mx-auto">
                                <GraduationCap className="w-8 h-8" />
                              </div>
                              <div>
                                <h4 className="text-base font-black text-[#33422C]">Semua Senarai Pelatih Telah Dikosongkan</h4>
                                <p className="text-xs text-[#55694D] max-w-md mx-auto mt-1 leading-relaxed">
                                  Sistem sedia untuk Pengajar memasukkan nama pelatih yang berdaftar. Anda boleh menambah secara individu atau memuat naik senarai pukal (fail CSV / Excel / teks salin & tampal).
                                </p>
                              </div>
                              <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                                <button
                                  type="button"
                                  onClick={() => setOwnerSubTab("upload")}
                                  className="px-4 py-2.5 rounded-xl bg-[#33422C] hover:bg-[#23311E] text-white text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-xs"
                                >
                                  <Upload className="w-4 h-4" />
                                  <span>Muat Naik / Tampal Senarai Pukal (CSV/Excel)</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setOwnerSubTab("single")}
                                  className="px-4 py-2.5 rounded-xl bg-white border border-[#D0D0C0] hover:bg-[#EBF0E6] text-[#33422C] text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-2xs"
                                >
                                  <UserPlus className="w-4 h-4" />
                                  <span>Tambah Pelatih Individu</span>
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="p-8 text-center text-[#7A7A6A] space-y-1">
                              <BarChart3 className="w-8 h-8 text-[#A1B09C] mx-auto mb-2" />
                              <p className="font-bold">Tiada pelatih ditemui</p>
                              <p className="text-xs">Sila ubah carian atau pilihan penapis anda.</p>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}

                  {/* ==================================================== */}
                  {/* SUB-PANEL 2: SENARAI REKOD PELATIH BERDAFTAR         */}
                  {/* ==================================================== */}
                  {ownerSubTab === 'list' && (
                    <div className="space-y-3 animate-in fade-in">
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
                        <div className="relative flex-1">
                          <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#7A7A6A]" />
                          <input
                            type="text"
                            value={rosterSearch}
                            onChange={(e) => setRosterSearch(e.target.value)}
                            placeholder="Cari dalam senarai..."
                            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#D0D0C0] bg-white focus:outline-none focus:border-[#495E3F]"
                          />
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={handleCopyAllTrainees}
                            className="px-3 py-2 rounded-xl bg-[#FAF9F5] border border-[#D0D0C0] hover:bg-[#EBF0E6] text-xs font-bold text-[#33422C] flex items-center gap-1.5 transition-colors cursor-pointer"
                            title="Salin Semua Rekod"
                          >
                            <Copy className="w-3.5 h-3.5" />
                            <span>{copyFeedback ? 'Disalin! ✓' : 'Salin'}</span>
                          </button>

                          <button
                            type="button"
                            onClick={handleDownloadCsv}
                            className="px-3 py-2 rounded-xl bg-[#33422C] hover:bg-[#263622] text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                            title="Eksport ke fail CSV"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Muat Turun CSV</span>
                          </button>

                          <button
                            type="button"
                            onClick={handleClearAllTrainees}
                            className="px-3 py-2 rounded-xl bg-[#FDF5F2] border border-[#EBD0C6] hover:bg-[#FBE8E1] text-xs font-bold text-[#A35C42] flex items-center gap-1.5 transition-colors cursor-pointer"
                            title="Padam Semua Senarai Pelatih"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Kosongkan Senarai</span>
                          </button>
                        </div>
                      </div>

                      <div className="text-xs text-[#55694D] font-semibold flex items-center justify-between">
                        <span>Jumlah Pelatih Berdaftar: <strong>{registeredList.length} Orang</strong></span>
                        <span>Paparan: {filteredRoster.length} rekod</span>
                      </div>

                      {/* SENARAI JADUAL */}
                      <div className="max-h-72 overflow-y-auto rounded-2xl border border-[#D0D0C0] divide-y divide-[#EAEAE0] bg-white text-xs">
                        {filteredRoster.map((t, idx) => (
                          <div
                            key={t.icNumber + idx}
                            className="p-3 flex items-center justify-between gap-3 hover:bg-[#FAF9F5] transition-colors"
                          >
                            <div className="space-y-0.5 flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-[#142611] truncate">
                                  {idx + 1}. {t.fullName}
                                </span>
                                <span
                                  className={`px-2 py-0.2 rounded-full text-[10px] font-bold ${
                                    t.status === 'Aktif'
                                      ? 'bg-[#EBF0E6] text-[#33422C]'
                                      : 'bg-[#FDF5F2] text-[#A35C42]'
                                  }`}
                                >
                                  {t.status}
                                </span>
                              </div>
                              <div className="flex flex-wrap items-center gap-2 text-[11px] text-[#68685C]">
                                <span className="font-mono font-bold text-[#33422C]">
                                  No. K/P: {t.icNumber}
                                </span>
                                {t.matricNumber && (
                                  <span>• Matrik: {t.matricNumber}</span>
                                )}
                                <span>• {t.programme}</span>
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5 shrink-0">
                              <button
                                type="button"
                                onClick={() => handleSwitchToTrainee(t)}
                                className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-[#EBF0E6] text-[#33422C] hover:bg-[#D8E6D3] transition-colors cursor-pointer flex items-center gap-1"
                                title="Log masuk sebagai pelatih ini"
                              >
                                <Eye className="w-3 h-3" />
                                <span>Pilih</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => handleToggleStatus(t.icNumber)}
                                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors cursor-pointer ${
                                  t.status === 'Aktif'
                                    ? 'bg-[#FDF5F2] text-[#A35C42] hover:bg-[#F5E2DA]'
                                    : 'bg-[#EBF0E6] text-[#33422C] hover:bg-[#D5E2D0]'
                                }`}
                                title={t.status === 'Aktif' ? 'Gantung Akaun' : 'Aktifkan Semula'}
                              >
                                {t.status === 'Aktif' ? 'Gantung' : 'Aktifkan'}
                              </button>

                              <button
                                type="button"
                                onClick={() => handleDeleteTrainee(t.icNumber, t.fullName)}
                                className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                                title="Padam Pelatih"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}

                        {filteredRoster.length === 0 && (
                          <div className="p-8 text-center text-[#7A7A6A]">
                            Tiada rekod pelatih dijumpai.
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* ==================================================== */}
                  {/* SUB-PANEL 3: MUAT NAIK FAIL CSV                      */}
                  {/* ==================================================== */}
                  {ownerSubTab === 'upload' && (
                    <div className="space-y-4 animate-in fade-in">
                      <div className="p-4 rounded-2xl bg-[#FAF9F5] border border-[#E0E0D0] space-y-2 text-xs">
                        <h5 className="font-bold text-[#33422C] flex items-center gap-2">
                          <Upload className="w-4 h-4 text-[#D98C70]" />
                          <span>Import Dokumen Fail MAKLUMAT PELATIH.csv</span>
                        </h5>
                        <p className="text-[#68685C] leading-relaxed">
                          Anda boleh memuat naik fail fizikal <code>MAKLUMAT PELATIH.csv</code> terus daripada komputer/peranti anda, atau menampal data CSV di bawah. Sistem akan mengekstrak <strong>Nombor Kad Pengenalan</strong> dan <strong>Nama Penuh</strong> secara automatik.
                        </p>

                        <div className="flex items-center gap-3 pt-2">
                          <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#33422C]">
                            <input
                              type="radio"
                              name="replaceMode"
                              checked={csvUploadReplace}
                              onChange={() => setCsvUploadReplace(true)}
                              className="accent-[#33422C]"
                            />
                            <span>Gantikan Sepenuhnya</span>
                          </label>

                          <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#33422C]">
                            <input
                              type="radio"
                              name="replaceMode"
                              checked={!csvUploadReplace}
                              onChange={() => setCsvUploadReplace(false)}
                              className="accent-[#33422C]"
                            />
                            <span>Tambah Ke Senarai Sedia Ada</span>
                          </label>
                        </div>
                      </div>

                      {/* ZON MUAT NAIK FAIL CSV */}
                      <div 
                        onClick={() => fileInputRef.current?.click()}
                        className="p-6 rounded-2xl border-2 border-dashed border-[#B8CEB1] bg-[#EFF5EC]/50 hover:bg-[#EFF5EC] text-center cursor-pointer transition-colors space-y-2 group"
                      >
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept=".csv,text/csv,text/plain"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                        <div className="w-12 h-12 rounded-2xl bg-white border border-[#C8D6C4] flex items-center justify-center mx-auto text-[#495E3F] group-hover:scale-105 transition-transform shadow-xs">
                          <Upload className="w-6 h-6" />
                        </div>
                        <h6 className="font-bold text-[#2A3B25] text-sm">
                          Klik Di Sini Untuk Memilih Fail <code>MAKLUMAT PELATIH.csv</code>
                        </h6>
                        <p className="text-xs text-[#55694D]">
                          Sokongan fail CSV dengan lajur No. Kad Pengenalan & Nama Penuh pelatih
                        </p>
                      </div>

                      {uploadFeedback && (
                        <div
                          className={`p-4 rounded-2xl text-xs flex items-start gap-3 animate-in fade-in ${
                            uploadFeedback.success
                              ? 'bg-[#EBF0E6] border-2 border-[#C8D6C4] text-[#33422C]'
                              : 'bg-[#FDF5F2] border-2 border-[#EBD0C6] text-[#A35C42]'
                          }`}
                        >
                          {uploadFeedback.success ? (
                            <CheckCircle2 className="w-5 h-5 text-[#495E3F] shrink-0 mt-0.5" />
                          ) : (
                            <AlertCircle className="w-5 h-5 text-[#D98C70] shrink-0 mt-0.5" />
                          )}
                          <div className="space-y-0.5">
                            <strong className="block font-bold">
                              {uploadFeedback.success ? 'Import Berjaya' : 'Ralat Import'}
                            </strong>
                            <p>{uploadFeedback.message}</p>
                          </div>
                        </div>
                      )}

                      {/* TAMPAL DATA CSV TEKS */}
                      <form onSubmit={handlePasteCsvSubmit} className="space-y-3 pt-2">
                        <label className="block text-xs font-bold text-[#33422C]">
                          Atau Tampal Teks CSV / Senarai Terus di Bawah:
                        </label>
                        <textarea
                          rows={4}
                          value={rawCsvText}
                          onChange={(e) => setRawCsvText(e.target.value)}
                          placeholder="No. Kad Pengenalan, Nama Penuh, Program&#10;060413-06-0031, MUHAMMAD AFIQ IRFAN BIN AZMI, Diploma Farmasi"
                          className="w-full p-3 rounded-xl border-2 border-[#D0D0C0] bg-white font-mono text-xs focus:outline-none focus:border-[#495E3F]"
                        />

                        <div className="flex items-center justify-between gap-3">
                          <button
                            type="button"
                            onClick={() => {
                              setRawCsvText(exportTraineesToCsv());
                            }}
                            className="px-3 py-1.5 rounded-xl bg-[#FAF9F5] border border-[#D0D0C0] text-xs font-bold text-[#4A4A40] hover:bg-[#EBF0E6] transition-colors cursor-pointer"
                          >
                            Muatkan Contoh Format CSV
                          </button>

                          <button
                            type="submit"
                            className="py-2 px-5 rounded-xl bg-[#33422C] hover:bg-[#253220] text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <FileText className="w-4 h-4" />
                            <span>Proses Teks CSV</span>
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  {/* ==================================================== */}
                  {/* SUB-PANEL 4: TAMBAH INDIVIDU                         */}
                  {/* ==================================================== */}
                  {ownerSubTab === 'single' && (
                    <form onSubmit={handleSingleAddSubmit} className="space-y-4 animate-in fade-in">
                      <div className="p-4 rounded-2xl bg-[#FAF9F5] border border-[#E0E0D0] text-xs text-[#55694D]">
                        Daftar pelatih baharu ke dalam sistem GCMT 2052 ILKKM Sungai Buloh.
                      </div>

                      {singleMsg && (
                        <div
                          className={`p-3 rounded-xl text-xs font-semibold ${
                            singleMsg.success
                              ? 'bg-[#EBF0E6] text-[#33422C] border border-[#C8D6C4]'
                              : 'bg-[#FDF5F2] text-[#A35C42] border border-[#EBD0C6]'
                          }`}
                        >
                          {singleMsg.text}
                        </div>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div className="space-y-1">
                          <label className="font-bold text-[#33422C]">No. Kad Pengenalan *</label>
                          <input
                            type="text"
                            value={singleIc}
                            onChange={(e) => setSingleIc(e.target.value)}
                            placeholder="cth: 050114-10-1023"
                            className="w-full p-2.5 rounded-xl border border-[#D0D0C0] font-mono"
                            required
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="font-bold text-[#33422C]">No. Matrik (Pilihan)</label>
                          <input
                            type="text"
                            value={singleMatric}
                            onChange={(e) => setSingleMatric(e.target.value)}
                            placeholder="cth: DPF/2026/043"
                            className="w-full p-2.5 rounded-xl border border-[#D0D0C0] font-mono"
                          />
                        </div>

                        <div className="sm:col-span-2 space-y-1">
                          <label className="font-bold text-[#33422C]">Nama Penuh Pelatih *</label>
                          <input
                            type="text"
                            value={singleFullName}
                            onChange={(e) => setSingleFullName(e.target.value)}
                            placeholder="cth: MUHAMMAD HAZIQ BIN KAMAL"
                            className="w-full p-2.5 rounded-xl border border-[#D0D0C0] uppercase font-bold"
                            required
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="font-bold text-[#33422C]">Program</label>
                          <select
                            value={singleProg}
                            onChange={(e) => setSingleProg(e.target.value)}
                            className="w-full p-2.5 rounded-xl border border-[#D0D0C0] bg-white"
                          >
                            <option value="Diploma Farmasi">Diploma Farmasi</option>
                            <option value="Diploma Kesihatan Persekitaran">Diploma Kesihatan Persekitaran</option>
                            <option value="Sains Kesihatan Bersekutu">Sains Kesihatan Bersekutu</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="font-bold text-[#33422C]">Kohort / Sesi</label>
                          <input
                            type="text"
                            value={singleCohort}
                            onChange={(e) => setSingleCohort(e.target.value)}
                            className="w-full p-2.5 rounded-xl border border-[#D0D0C0]"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3 rounded-xl bg-[#33422C] hover:bg-[#253220] text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                      >
                        <UserPlus className="w-4 h-4" />
                        <span>Daftar Pelatih Ini</span>
                      </button>
                    </form>
                  )}

                  {/* ==================================================== */}
                  {/* SUB-PANEL 5: TETAPAN & KATA LALUAN                   */}
                  {/* ==================================================== */}
                  {ownerSubTab === 'settings' && (
                    <div className="space-y-5 animate-in fade-in">
                      {/* TUKAR KATA LALUAN OWNER */}
                      <div className="p-4 rounded-2xl bg-[#FAF9F5] border border-[#E0E0D0] space-y-3 text-xs">
                        <div className="flex items-center gap-2 font-bold text-[#33422C]">
                          <KeyRound className="w-4 h-4 text-[#D98C70]" />
                          <span>Tukar Kata Laluan Pengajar (Owner)</span>
                        </div>

                        {passUpdateMsg && (
                          <div
                            className={`p-2.5 rounded-xl font-semibold ${
                              passUpdateMsg.success
                                ? 'bg-[#EBF0E6] text-[#33422C] border border-[#C8D6C4]'
                                : 'bg-[#FDF5F2] text-[#A35C42] border border-[#EBD0C6]'
                            }`}
                          >
                            {passUpdateMsg.text}
                          </div>
                        )}

                        <form onSubmit={handleUpdatePassword} className="space-y-2">
                          <input
                            type="password"
                            value={newOwnerPass}
                            onChange={(e) => setNewOwnerPass(e.target.value)}
                            placeholder="Kata laluan baharu..."
                            className="w-full p-2.5 rounded-xl border border-[#D0D0C0] bg-white text-xs font-bold"
                            required
                          />
                          <button
                            type="submit"
                            className="px-4 py-2 rounded-xl bg-[#33422C] hover:bg-[#253220] text-white font-bold transition-colors cursor-pointer"
                          >
                            Kemas Kini Kata Laluan
                          </button>
                        </form>
                      </div>

                      {/* KOSONGKAN SEMUA SENARAI PELATIH */}
                      <div className="p-4 rounded-2xl bg-[#FDF5F2] border border-[#EBD0C6] space-y-2 text-xs">
                        <h6 className="font-bold text-[#A35C42] flex items-center gap-1.5">
                          <Trash2 className="w-4 h-4" />
                          <span>Padam Semua Senarai Pelatih (Kosongkan Sistem)</span>
                        </h6>
                        <p className="text-[#68685C]">
                          Padam semua senarai nama pelatih yang terdapat dalam sistem supaya Pengajar boleh memasukkan nama pelatih yang berdaftar baharu secara bersih.
                        </p>
                        <button
                          type="button"
                          onClick={handleClearAllTrainees}
                          className="px-4 py-2.5 rounded-xl bg-[#8E472D] hover:bg-[#733621] text-white font-bold transition-colors cursor-pointer shadow-xs flex items-center gap-2"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Padam Semua Senarai Pelatih Sekarang</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* MODAL TRANSKRIP TERPERINCI PELATIH (JIKA DIPILIH OLEH PENGAJAR) */}
        {selectedTraineeTranscript && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs animate-in fade-in">
            <div 
              className="bg-white rounded-3xl max-w-2xl w-full max-h-[88vh] flex flex-col shadow-2xl overflow-hidden border border-[#D0D0C0]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 sm:p-5 bg-[#33422C] text-white flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-[#A6BF9F] uppercase tracking-wider block">
                    Transkrip Penilaian Pelatih
                  </span>
                  <h4 className="text-base sm:text-lg font-black">
                    {selectedTraineeTranscript.fullName}
                  </h4>
                  <p className="text-xs text-white/80 font-mono">
                    K/P: {selectedTraineeTranscript.icNumber} • {selectedTraineeTranscript.programme}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedTraineeTranscript(null)}
                  className="p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-5 overflow-y-auto space-y-4 text-xs">
                {/* RINGKASAN SKOR */}
                <div className="grid grid-cols-3 gap-2">
                  <div className="p-3 rounded-2xl bg-[#FAF9F5] border border-[#D0D0C0] text-center">
                    <span className="text-[11px] text-[#7A7A6A] block">Purata Skor</span>
                    <strong className="text-xl font-black text-[#33422C]">
                      {selectedTraineeTranscript.averageScore}%
                    </strong>
                  </div>
                  <div className="p-3 rounded-2xl bg-[#EBF0E6] border border-[#C8D6C4] text-center">
                    <span className="text-[11px] text-[#495E3F] block">Gred Keseluruhan</span>
                    <strong className="text-xl font-black text-[#23311E]">
                      {selectedTraineeTranscript.grade}
                    </strong>
                  </div>
                  <div className="p-3 rounded-2xl bg-[#FAF9F5] border border-[#D0D0C0] text-center">
                    <span className="text-[11px] text-[#7A7A6A] block">Skor Tertinggi</span>
                    <strong className="text-xl font-black text-[#D98C70]">
                      {selectedTraineeTranscript.highestScore}%
                    </strong>
                  </div>
                </div>

                {/* SENARAI PERCUBAAN KUIZ */}
                <div className="space-y-2">
                  <h5 className="font-bold text-[#33422C] flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-[#D98C70]" />
                    <span>Rekod Percubaan ({selectedTraineeTranscript.attempts.length})</span>
                  </h5>

                  <div className="divide-y divide-[#EAEAE0] rounded-2xl border border-[#D0D0C0] overflow-hidden bg-white">
                    {selectedTraineeTranscript.attempts.map((att, idx) => (
                      <div key={att.id || idx} className="p-3 flex items-center justify-between gap-2 hover:bg-[#FAF9F5]">
                        <div className="space-y-0.5">
                          <span className="font-bold text-[#142611] block">
                            {att.topicTitle}
                          </span>
                          <span className="text-[11px] text-[#6A6A5E] block">
                            Mod: {att.mode === 'timed' ? '⚡ Ujian Pantas' : 'Latihan Kendiri'} • Masa: {Math.round(att.timeSpentSeconds / 60)} min
                          </span>
                          <span className="text-[10px] text-[#8A8A7A]">
                            Tarikh: {new Date(att.date).toLocaleDateString('ms-MY', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </span>
                        </div>

                        <div className="text-right">
                          <span className={`text-sm font-black block ${att.score >= 80 ? 'text-[#33422C]' : 'text-[#8E472D]'}`}>
                            {att.score}%
                          </span>
                          <span className="text-[10px] text-[#6A6A5E]">
                            {att.correctCount}/{att.totalQuestions} Betul
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* BUTANG TINDAKAN MODAL TRANSKRIP */}
              <div className="p-4 bg-[#FAF9F5] border-t border-[#D0D0C0] flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const target = registeredList.find((t) => t.icNumber === selectedTraineeTranscript.icNumber);
                    if (target) {
                      setSelectedTraineeTranscript(null);
                      handleSwitchToTrainee(target);
                    }
                  }}
                  className="px-4 py-2 rounded-xl bg-[#33422C] hover:bg-[#23311E] text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Eye className="w-4 h-4 text-[#A6BF9F]" />
                  <span>Log Masuk Sebagai Pelatih Ini</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedTraineeTranscript(null)}
                  className="px-4 py-2 rounded-xl bg-white border border-[#D0D0C0] text-xs font-bold text-[#4A4A40] hover:bg-[#EBF0E6] transition-colors cursor-pointer"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
