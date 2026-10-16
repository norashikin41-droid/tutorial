import React, { useState, useRef, useEffect } from 'react';
import html2canvas from 'html2canvas';
import { 
  Award, 
  Download, 
  Printer, 
  X, 
  CheckCircle2, 
  Edit3, 
  Save, 
  Sparkles, 
  Calendar, 
  BookOpen, 
  User, 
  FileCheck,
  Share2,
  Check,
  Maximize2,
  Minimize2,
  ShieldCheck,
  Info
} from 'lucide-react';
import { UserProfile, QuizAttempt } from '../types';
import { allTopics, topicQuestionMap } from '../data/topics';
import { saveProfile } from '../utils/storage';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  onUpdateProfile: (updated: UserProfile) => void;
  attempts: QuizAttempt[];
  initialUnitId?: number | null;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  onUpdateProfile,
  attempts,
  initialUnitId,
}) => {
  const [selectedUnitId, setSelectedUnitId] = useState<number>(initialUnitId || 1);
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [tempName, setTempName] = useState(userProfile.name || 'PELATIH GCMT 2052');
  const [tempMatric, setTempMatric] = useState(userProfile.matricNumber || 'GCMT/2026/001');
  const [tempIc, setTempIc] = useState(userProfile.icNumber || '');
  const [tempInstitution, setTempInstitution] = useState(
    userProfile.institution || 'Institut Latihan Kementerian Kesihatan Malaysia Sungai Buloh'
  );
  const [isDownloading, setIsDownloading] = useState(false);
  const [copiedId, setCopiedId] = useState(false);
  const [viewMode, setViewMode] = useState<'fit' | 'full'>('fit');
  const [showSummary, setShowSummary] = useState(false);

  const certificateRef = useRef<HTMLDivElement>(null);

  // Sync state if userProfile updates
  useEffect(() => {
    if (userProfile.name) setTempName(userProfile.name);
    if (userProfile.matricNumber) setTempMatric(userProfile.matricNumber);
    if (userProfile.icNumber) setTempIc(userProfile.icNumber);
    if (userProfile.institution) setTempInstitution(userProfile.institution);
  }, [userProfile.name, userProfile.matricNumber, userProfile.icNumber, userProfile.institution]);

  if (!isOpen) return null;

  const currentTopic = allTopics.find((t) => t.id === selectedUnitId) || allTopics[0];
  const unitQuestions = topicQuestionMap[selectedUnitId] || [];

  // Find highest score for this unit
  const unitAttempts = attempts.filter((a) => a.topicId === selectedUnitId);
  const highestAttempt = unitAttempts.length > 0 
    ? [...unitAttempts].sort((a, b) => b.score - a.score)[0] 
    : null;

  // Question mastery for this unit
  const unitCorrectIds = unitQuestions.map((q) => q.id).filter((id) => 
    userProfile.correctQuestions.includes(id)
  );

  const calculatedScore = highestAttempt 
    ? highestAttempt.score 
    : unitQuestions.length > 0 
      ? Math.round((unitCorrectIds.length / unitQuestions.length) * 100) 
      : 80;

  const correctCount = highestAttempt 
    ? highestAttempt.correctCount 
    : unitCorrectIds.length > 0 
      ? unitCorrectIds.length 
      : Math.round((calculatedScore / 100) * unitQuestions.length);

  const totalQuestions = unitQuestions.length || 15;

  const getGradeText = (score: number) => {
    if (score >= 85) return { grade: 'CEMERLANG TINGGI (A+)', desc: 'Penguasaan Tajuk Sangat Cemerlang' };
    if (score >= 75) return { grade: 'CEMERLANG (A)', desc: 'Penguasaan Konsep Cemerlang' };
    if (score >= 65) return { grade: 'KEPUJIAN TINGGI (B+)', desc: 'Pemahaman Baik' };
    if (score >= 50) return { grade: 'LULUS (C)', desc: 'Telah Memenuhi Syarat Penguasaan Minimum' };
    return { grade: 'SIJIL PENYERTAAN', desc: 'Telah Menyelesaikan Modul Penilaian' };
  };

  const gradeInfo = getGradeText(calculatedScore);

  const issueDate = highestAttempt 
    ? new Date(highestAttempt.date).toLocaleDateString('ms-MY', { day: 'numeric', month: 'long', year: 'numeric' })
    : new Date().toLocaleDateString('ms-MY', { day: 'numeric', month: 'long', year: 'numeric' });

  const certSerialNumber = `GCMT-${selectedUnitId.toString().padStart(2, '0')}-${(userProfile.matricNumber || '000').replace(/[^a-zA-Z0-9]/g, '').slice(-4).toUpperCase() || '2026'}-${calculatedScore}`;

  const handleSaveInfo = () => {
    const updated = saveProfile({
      name: tempName.trim() || 'PELATIH GCMT 2052',
      matricNumber: tempMatric.trim() || 'GCMT/2026/001',
      icNumber: tempIc.trim(),
      institution: tempInstitution.trim() || 'Institut Latihan Kementerian Kesihatan Malaysia Sungai Buloh',
    });
    onUpdateProfile(updated);
    setIsEditingInfo(false);
  };

  const handleDownloadImage = async () => {
    if (!certificateRef.current) return;
    try {
      setIsDownloading(true);
      const canvas = await html2canvas(certificateRef.current, {
        scale: 3, // Ultra-sharp HD quality
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      });
      const image = canvas.toDataURL('image/png', 1.0);
      const link = document.createElement('a');
      const sanitizedName = (userProfile.name || 'Pelatih').replace(/\s+/g, '_');
      link.download = `Sijil_${currentTopic.code.replace(/\s+/g, '')}_${sanitizedName}.png`;
      link.href = image;
      link.click();
    } catch (err) {
      console.error('Error generating certificate image:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopyCertId = () => {
    navigator.clipboard.writeText(certSerialNumber);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/65 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 md:p-6 print:p-0 print:bg-white print:static animate-in fade-in duration-200">
      
      {/* Modal Box */}
      <div className="bg-[#FBFBF9] rounded-[28px] border border-[#D8D8C4] shadow-2xl max-w-5xl w-full max-h-[96vh] flex flex-col overflow-hidden print:border-none print:shadow-none print:max-w-none print:max-h-none">
        
        {/* Modal Top Bar (Hidden on Print) */}
        <div className="px-4 sm:px-6 py-3 border-b border-[#E0E0D0] bg-white flex items-center justify-between shrink-0 print:hidden">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#3D5236] flex items-center justify-center text-white font-bold shadow-xs">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-extrabold text-[#263622] leading-tight">
                Sijil Pencapaian Rasmi GCMT 2052
              </h3>
              <p className="text-[11px] text-[#55694D] font-medium">
                Institut Latihan Kementerian Kesihatan Malaysia Sungai Buloh
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-1.5 sm:space-x-2">
            {/* View Mode Toggle: Fit on Screen vs 100% */}
            <button
              onClick={() => setViewMode(viewMode === 'fit' ? 'full' : 'fit')}
              className="px-2.5 sm:px-3 py-1.5 rounded-xl border border-[#D0D0C0] bg-[#FAF9F5] hover:bg-[#EBF0E6] text-[#33422C] text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              title={viewMode === 'fit' ? 'Tukar ke Saiz Penuh 100%' : 'Tukar ke Muat Skrin (Fit)'}
            >
              {viewMode === 'fit' ? (
                <>
                  <Maximize2 className="w-3.5 h-3.5 text-[#3D5236]" />
                  <span className="hidden sm:inline">Saiz Penuh</span>
                </>
              ) : (
                <>
                  <Minimize2 className="w-3.5 h-3.5 text-[#3D5236]" />
                  <span className="hidden sm:inline">Muat Skrin</span>
                </>
              )}
            </button>

            {/* Quick Summary Toggle */}
            <button
              onClick={() => setShowSummary(!showSummary)}
              className={`px-2.5 sm:px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                showSummary
                  ? 'bg-[#3D5236] text-white border-[#3D5236]'
                  : 'bg-[#FAF9F5] hover:bg-[#F0F0E8] text-[#4A4A40] border-[#D0D0C0]'
              }`}
              title="Papar ringkasan teks maklumat sijil"
            >
              <Info className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Ringkasan</span>
            </button>

            {/* Edit Info Button */}
            <button
              onClick={() => setIsEditingInfo(!isEditingInfo)}
              className={`px-2.5 sm:px-3.5 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                isEditingInfo 
                  ? 'bg-[#D98C70] text-white border-[#D98C70]' 
                  : 'bg-[#FAF9F5] hover:bg-[#E8E8E0] text-[#5A5A50] border-[#D0D0C0]'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{isEditingInfo ? 'Tutup Suntingan' : 'Kemaskini Nama / No. Matrik'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-[#7A7A6A] hover:text-[#33422C] hover:bg-[#EBF0E6] transition-colors cursor-pointer"
              title="Tutup Modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick Information Banner (Prominently readable without zooming) */}
        {showSummary && (
          <div className="bg-[#EBF0E6] border-b border-[#C8D6C4] px-4 sm:px-6 py-2.5 text-xs text-[#2A3B25] flex flex-wrap items-center justify-between gap-2 shrink-0 animate-in fade-in">
            <div className="flex flex-wrap items-center gap-2 sm:gap-4 font-medium">
              <span>Pelatih: <strong className="text-[#142611] font-bold">{userProfile.name || 'PELATIH GCMT 2052'}</strong></span>
              <span>•</span>
              {userProfile.icNumber && (
                <>
                  <span>No. K/P: <strong className="font-mono text-[#142611] font-bold">{userProfile.icNumber}</strong></span>
                  <span>•</span>
                </>
              )}
              {userProfile.matricNumber && (
                <>
                  <span>Matrik: <strong className="font-mono text-[#142611] font-bold">{userProfile.matricNumber}</strong></span>
                  <span>•</span>
                </>
              )}
              <span>Markah: <strong className="text-[#142611] font-black">{calculatedScore}% ({gradeInfo.grade})</strong></span>
              <span>•</span>
              <span>Disahkan oleh: <strong className="text-[#142611] font-bold">Puan Norashikin Bt M Noor Arzmi</strong></span>
            </div>
            <span className="text-[11px] font-mono text-[#495E3F] font-bold">No. Siri: {certSerialNumber}</span>
          </div>
        )}

        {/* Unit Selector & Info Edit Bar (Hidden on Print) */}
        <div className="bg-[#FAF9F5] border-b border-[#E0E0D0] px-4 sm:px-6 py-2.5 shrink-0 print:hidden space-y-2.5">
          
          {/* Unit Tabs */}
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-xs font-bold text-[#4A4A40] whitespace-nowrap mr-1">Pilih Unit:</span>
            {allTopics.map((topic) => {
              const isSelected = topic.id === selectedUnitId;
              const hasAttempt = attempts.some((a) => a.topicId === topic.id);
              return (
                <button
                  key={topic.id}
                  onClick={() => setSelectedUnitId(topic.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                    isSelected
                      ? 'bg-[#3D5236] text-white shadow-xs'
                      : 'bg-white text-[#5A5A50] hover:text-[#263622] hover:bg-[#EBF0E6] border border-[#D0D0C0]'
                  }`}
                >
                  <span>{topic.code}</span>
                  {hasAttempt && <CheckCircle2 className="w-3.5 h-3.5 text-[#98B291]" />}
                </button>
              );
            })}
          </div>

          {/* Edit Form Drawer */}
          {isEditingInfo && (
            <div className="p-4 rounded-2xl bg-white border border-[#D0D0C0] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 animate-in fade-in duration-150">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#4A4A40] mb-1">
                  Nama Penuh Pelatih:
                </label>
                <input
                  type="text"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  placeholder="Contoh: AHMAD DANIAL BIN ROSLI"
                  className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-[#D0D0C0] bg-[#FAF9F5] focus:outline-none focus:ring-2 focus:ring-[#3D5236] uppercase"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#4A4A40] mb-1">
                  No. Kad Pengenalan:
                </label>
                <input
                  type="text"
                  value={tempIc}
                  onChange={(e) => setTempIc(e.target.value)}
                  placeholder="Contoh: 050114-10-1023"
                  className="w-full px-3 py-2 text-xs font-mono font-bold rounded-xl border border-[#D0D0C0] bg-[#FAF9F5] focus:outline-none focus:ring-2 focus:ring-[#3D5236]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#4A4A40] mb-1">
                  Nombor Matrik:
                </label>
                <input
                  type="text"
                  value={tempMatric}
                  onChange={(e) => setTempMatric(e.target.value)}
                  placeholder="Contoh: DPF/2026/001"
                  className="w-full px-3 py-2 text-xs font-mono font-bold rounded-xl border border-[#D0D0C0] bg-[#FAF9F5] focus:outline-none focus:ring-2 focus:ring-[#3D5236] uppercase"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#4A4A40] mb-1">
                  Institusi / Institut:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={tempInstitution}
                    onChange={(e) => setTempInstitution(e.target.value)}
                    placeholder="ILKKM Sungai Buloh"
                    className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-[#D0D0C0] bg-[#FAF9F5] focus:outline-none focus:ring-2 focus:ring-[#3D5236]"
                  />
                  <button
                    onClick={handleSaveInfo}
                    className="px-4 py-2 bg-[#3D5236] hover:bg-[#2F3F2A] text-white text-xs font-bold rounded-xl transition-colors shrink-0 flex items-center gap-1 shadow-xs cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Simpan</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Certificate Display Area (Optimized to fit and be readable without zoom) */}
        <div className={`p-3 sm:p-6 overflow-y-auto flex-1 flex justify-center items-center bg-[#E5E5DC] print:p-0 print:bg-white print:overflow-visible ${
          viewMode === 'fit' ? 'max-h-[calc(94vh-170px)]' : ''
        }`}>
          
          {/* Certificate Container (Rendered to PNG / Print) */}
          <div 
            ref={certificateRef}
            id="gcmt-official-certificate"
            className={`w-full max-w-[880px] bg-[#FCFCF9] text-[#1F2E1B] rounded-2xl border-[8px] sm:border-[10px] border-[#3D5236] p-5 sm:p-7 md:p-9 relative flex flex-col justify-between shadow-2xl print:shadow-none print:border-[8px] print:border-[#3D5236] print:m-0 print:w-full print:rounded-none select-none overflow-hidden transition-all ${
              viewMode === 'fit' ? 'my-auto' : 'my-2'
            }`}
          >
            
            {/* Inner Dual Decorative Borders */}
            <div className="absolute inset-1.5 sm:inset-2.5 border-2 border-[#BCD0B7] pointer-events-none rounded-lg" />
            <div className="absolute inset-2.5 sm:inset-4 border border-[#D8E6D4] pointer-events-none rounded-md" />

            {/* Corner Decorative Ornaments (Sharp & High Contrast) */}
            <div className="absolute top-3 left-3 text-[#3D5236] font-serif text-lg leading-none select-none">❖</div>
            <div className="absolute top-3 right-3 text-[#3D5236] font-serif text-lg leading-none select-none">❖</div>
            <div className="absolute bottom-3 left-3 text-[#3D5236] font-serif text-lg leading-none select-none">❖</div>
            <div className="absolute bottom-3 right-3 text-[#3D5236] font-serif text-lg leading-none select-none">❖</div>

            {/* HEADER: Institution & Certificate Title (High Contrast & Clear) */}
            <div className="text-center z-10 pt-0.5 sm:pt-1">
              <div className="flex items-center justify-center space-x-2 mb-0.5">
                <span className="text-[11px] sm:text-xs uppercase tracking-[0.2em] font-extrabold text-[#385130]">
                  KEMENTERIAN KESIHATAN MALAYSIA • ILKKM SUNGAI BULOH
                </span>
              </div>
              <div className="text-[10px] sm:text-[11px] uppercase tracking-[0.15em] font-bold text-[#55694D] mb-1">
                KURSUS MATEMATIK GCMT 2052
              </div>

              <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-black tracking-wider text-[#1A2E18] uppercase mb-0.5 drop-shadow-xs">
                SIJIL PENCAPAIAN
              </h1>
              <p className="text-[11px] sm:text-xs font-serif font-bold tracking-[0.15em] text-[#42593C] uppercase">
                CERTIFICATE OF MASTERY & ACHIEVEMENT
              </p>
              <div className="w-36 sm:w-56 h-0.5 bg-[#3D5236] mx-auto mt-2 mb-2" />
            </div>

            {/* BODY: Trainee Name & Details (Clearly Legible Without Zoom) */}
            <div className="text-center z-10 my-auto py-1 sm:py-2 space-y-2 sm:space-y-2.5">
              <p className="text-xs sm:text-sm font-serif italic font-bold text-[#3D4D3A]">
                Dengan ini diperakui bahawa pelatih di bawah:
              </p>

              {/* Trainee Full Name - Large, High Contrast */}
              <div className="my-0.5">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-black tracking-wide text-[#142611] uppercase border-b-2 border-[#3D5236] inline-block px-4 sm:px-8 pb-1 font-sans">
                  {userProfile.name || 'PELATIH GCMT 2052'}
                </h2>
              </div>

              {/* Matric Number, IC & Institution - Highly Legible Badges */}
              <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs sm:text-sm text-[#263622] font-semibold">
                {userProfile.icNumber && (
                  <span className="bg-[#E4ECE1] px-3.5 py-1 rounded-full border-2 border-[#A6BF9F] font-black text-[#142611] shadow-xs">
                    No. K/P: <strong className="font-mono tracking-wider">{userProfile.icNumber}</strong>
                  </span>
                )}
                {userProfile.matricNumber && (
                  <span className="bg-[#E4ECE1] px-3.5 py-1 rounded-full border-2 border-[#A6BF9F] font-black text-[#142611] shadow-xs">
                    No. Matrik: <strong className="font-mono tracking-wider">{userProfile.matricNumber}</strong>
                  </span>
                )}
                <span className="text-[#667760] hidden sm:inline">•</span>
                <span className="font-extrabold text-[#263622]">
                  {userProfile.institution || 'Institut Latihan Kementerian Kesihatan Malaysia Sungai Buloh'}
                </span>
              </div>

              <p className="text-xs sm:text-sm font-serif italic font-bold text-[#3D4D3A] pt-0.5">
                telah berjaya menyempurnakan modul penilaian dan menguasai kemahiran bagi:
              </p>

              {/* Unit Title Box */}
              <div className="bg-[#EFF5EC] border-2 border-[#B8CEB1] rounded-2xl py-2 px-4 sm:px-6 max-w-xl mx-auto shadow-xs">
                <span className="block text-xs font-black uppercase tracking-wider text-[#3D5434]">
                  {currentTopic.code}
                </span>
                <span className="text-sm sm:text-base md:text-lg font-black text-[#142611] leading-snug block mt-0.5">
                  {currentTopic.title}
                </span>
              </div>

              {/* Score & Grade Display */}
              <div className="flex items-center justify-center gap-4 sm:gap-8 pt-0.5">
                <div className="text-center">
                  <span className="block text-[11px] sm:text-xs uppercase tracking-wider text-[#4A5A46] font-bold">
                    Jumlah Markah
                  </span>
                  <span className="text-2xl sm:text-3xl font-black text-[#142611] font-sans">
                    {calculatedScore}%
                  </span>
                  <span className="block text-[11px] text-[#3D5236] font-bold">
                    ({correctCount}/{totalQuestions} Soalan Betul)
                  </span>
                </div>

                <div className="h-9 w-0.5 bg-[#BCD0B7]" />

                <div className="text-center">
                  <span className="block text-[11px] sm:text-xs uppercase tracking-wider text-[#4A5A46] font-bold">
                    Keputusan Gred
                  </span>
                  <span className="text-sm sm:text-base md:text-lg font-black text-[#142611] uppercase">
                    {gradeInfo.grade}
                  </span>
                  <span className="block text-[11px] text-[#3D5236] font-bold">
                    {gradeInfo.desc}
                  </span>
                </div>
              </div>
            </div>

            {/* FOOTER: Signatures, Seal & Serial Number (Completely Legible) */}
            <div className="z-10 pt-2 border-t-2 border-[#D8E6D4] flex items-end justify-between text-left gap-2 sm:gap-4">
              
              {/* Left: Issue Date & Verification Serial */}
              <div className="space-y-1 text-xs text-[#263622] min-w-[130px] sm:min-w-[160px]">
                <div>
                  <span className="text-[#4D5E4A] block text-[10px] sm:text-[11px] uppercase font-bold">
                    Tarikh Dikeluarkan:
                  </span>
                  <span className="font-bold text-[#142611] text-xs sm:text-sm">{issueDate}</span>
                </div>
                <div>
                  <span className="text-[#4D5E4A] block text-[10px] sm:text-[11px] uppercase font-bold">
                    No. Siri Sijil / Pengesahan:
                  </span>
                  <span className="font-mono font-black text-[#142611] text-xs sm:text-sm tracking-wider">
                    {certSerialNumber}
                  </span>
                </div>
              </div>

              {/* Middle: Official Gold Embossed Seal (Larger & Clear Text) */}
              <div className="flex flex-col items-center justify-center shrink-0">
                <div className="w-18 h-18 sm:w-22 sm:h-22 rounded-full border-4 border-[#C8B273] bg-gradient-to-br from-[#F5E6BD] via-[#CDB67A] to-[#998042] flex flex-col items-center justify-center text-center p-1 shadow-lg">
                  <Award className="w-6 h-6 sm:w-7 sm:h-7 text-[#40300A]" />
                  <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-tight text-[#302205] leading-tight mt-0.5">
                    GCMT 2052
                  </span>
                  <span className="text-[7px] sm:text-[8px] font-black text-[#382708] uppercase leading-none mt-0.5">
                    METERAI RASMI
                  </span>
                  <span className="text-[6px] sm:text-[7px] font-bold text-[#45330D] uppercase leading-none">
                    ILKKM SB
                  </span>
                </div>
              </div>

              {/* Right: Digital Signatures & Coordinator Verification */}
              <div className="text-right space-y-1 min-w-[170px] sm:min-w-[220px]">
                <span className="text-[11px] sm:text-xs text-[#2E4229] font-bold block uppercase tracking-wider">
                  Disahkan oleh :
                </span>
                <div className="w-44 sm:w-56 border-b-2 border-[#263622] pb-1 ml-auto">
                  <span className="font-serif italic text-xs sm:text-sm md:text-base text-[#142611] block font-black text-center">
                    Puan Norashikin Bt M Noor Arzmi
                  </span>
                </div>
                <div className="text-[10px] sm:text-[11px] text-[#3D5236] leading-tight font-medium">
                  <span className="font-black text-[#1F331A] block">Pengajar Kursus Matematik GCMT 2052</span>
                  <span className="font-bold text-[#3D5236]">ILKKM Sungai Buloh</span>
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* Modal Bottom Action Controls (Hidden on Print) */}
        <div className="p-3 sm:p-4 bg-white border-t border-[#E0E0D0] flex flex-wrap items-center justify-between gap-2.5 shrink-0 print:hidden">
          <div className="flex items-center space-x-2 text-xs text-[#4A5A46] font-medium">
            <ShieldCheck className="w-4 h-4 text-[#3D5236]" />
            <span>Semua maklumat sijil disahkan rasmi oleh Pengajar Kursus ILKKM Sungai Buloh.</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              id="btn-cert-copy-id"
              onClick={handleCopyCertId}
              className="px-3 py-2 rounded-xl bg-[#FAF9F5] hover:bg-[#F0EFE8] text-[#33422C] border border-[#D0D0C0] text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Salin No. Siri Sijil"
            >
              {copiedId ? <Check className="w-4 h-4 text-[#3D5236]" /> : <Share2 className="w-4 h-4" />}
              <span>{copiedId ? 'No. Siri Disalin!' : 'Salin No. Siri'}</span>
            </button>

            <button
              id="btn-cert-print"
              onClick={handlePrint}
              className="px-3.5 py-2 rounded-xl bg-[#F5F5F0] hover:bg-[#E8E8E0] text-[#263622] border border-[#D0D0C0] text-xs font-bold flex items-center gap-2 transition-colors shadow-xs cursor-pointer"
            >
              <Printer className="w-4 h-4 text-[#3D5236]" />
              <span>Cetak / PDF</span>
            </button>

            <button
              id="btn-cert-download-png"
              onClick={handleDownloadImage}
              disabled={isDownloading}
              className="px-5 py-2 rounded-xl bg-[#3D5236] hover:bg-[#2E3F28] disabled:opacity-50 text-white text-xs font-bold flex items-center gap-2 transition-all shadow-xs cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>{isDownloading ? 'Menjana Imej HD...' : 'Muat Turun Sijil (PNG HD)'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
