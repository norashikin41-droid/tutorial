import React, { useState, useRef } from 'react';
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
  Check
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
  const [tempInstitution, setTempInstitution] = useState(userProfile.institution || 'Institut Latihan Kementerian Kesihatan Malaysia Sungai Buloh');
  const [isDownloading, setIsDownloading] = useState(false);
  const [copiedId, setCopiedId] = useState(false);

  const certificateRef = useRef<HTMLDivElement>(null);

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
        scale: 2.5,
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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 print:p-0 print:bg-white print:static animate-in fade-in duration-200">
      
      {/* Modal Box */}
      <div className="bg-[#FBFBF9] rounded-[32px] border border-[#E0E0D0] shadow-2xl max-w-5xl w-full max-h-[92vh] flex flex-col overflow-hidden print:border-none print:shadow-none print:max-w-none print:max-h-none">
        
        {/* Modal Top Bar (Hidden on Print) */}
        <div className="px-6 py-4 border-b border-[#E0E0D0] bg-white flex items-center justify-between shrink-0 print:hidden">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-[#A3AD94] flex items-center justify-center text-white font-bold shadow-xs">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-extrabold text-[#4A4A40]">
                Sijil Pencapaian Unit Pelatih
              </h3>
              <p className="text-xs text-[#7A7A6A]">
                Jana, semak maklumat pelatih & muat turun sijil rasmi
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsEditingInfo(!isEditingInfo)}
              className={`px-3.5 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                isEditingInfo 
                  ? 'bg-[#A3AD94] text-white border-[#A3AD94]' 
                  : 'bg-[#F5F5F0] hover:bg-[#E8E8E0] text-[#5A5A50] border-[#E0E0D0]'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{isEditingInfo ? 'Tutup Suntingan' : 'Kemaskini Nama / No. Matrik'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-[#8A8A7A] hover:text-[#4A4A40] hover:bg-[#F0F0E8] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Unit Selector & Info Edit Bar (Hidden on Print) */}
        <div className="bg-[#FAF9F5] border-b border-[#E8E8E0] px-6 py-3 shrink-0 print:hidden space-y-3">
          
          {/* Unit Tabs */}
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-xs font-bold text-[#7A7A6A] whitespace-nowrap mr-2">Pilih Unit:</span>
            {allTopics.map((topic) => {
              const isSelected = topic.id === selectedUnitId;
              const hasAttempt = attempts.some((a) => a.topicId === topic.id);
              return (
                <button
                  key={topic.id}
                  onClick={() => setSelectedUnitId(topic.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-[#5A5A50] text-white shadow-xs'
                      : 'bg-white text-[#6A6A5E] hover:text-[#4A4A40] border border-[#E0E0D0]'
                  }`}
                >
                  <span>{topic.code}</span>
                  {hasAttempt && <CheckCircle2 className="w-3 h-3 text-[#A3AD94]" />}
                </button>
              );
            })}
          </div>

          {/* Edit Form Drawer */}
          {isEditingInfo && (
            <div className="p-4 rounded-2xl bg-white border border-[#D9D9C8] grid grid-cols-1 sm:grid-cols-3 gap-3 animate-in fade-in duration-150">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#7A7A6A] mb-1">
                  Nama Penuh Pelatih:
                </label>
                <input
                  type="text"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  placeholder="Contoh: AHMAD DANIAL BIN ROSLI"
                  className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-[#D0D0C0] bg-[#FAF9F5] focus:outline-none focus:ring-2 focus:ring-[#A3AD94]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#7A7A6A] mb-1">
                  Nombor Matrik:
                </label>
                <input
                  type="text"
                  value={tempMatric}
                  onChange={(e) => setTempMatric(e.target.value)}
                  placeholder="Contoh: GCMT/2026/041"
                  className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-[#D0D0C0] bg-[#FAF9F5] focus:outline-none focus:ring-2 focus:ring-[#A3AD94]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#7A7A6A] mb-1">
                  Institusi / Institut Latihan:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={tempInstitution}
                    onChange={(e) => setTempInstitution(e.target.value)}
                    placeholder="Institut Latihan Kementerian Kesihatan Malaysia Sungai Buloh"
                    className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-[#D0D0C0] bg-[#FAF9F5] focus:outline-none focus:ring-2 focus:ring-[#A3AD94]"
                  />
                  <button
                    onClick={handleSaveInfo}
                    className="px-4 py-2 bg-[#A3AD94] hover:bg-[#8F9A7F] text-white text-xs font-bold rounded-xl transition-colors shrink-0 flex items-center gap-1 shadow-xs"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Simpan</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Certificate Display Area */}
        <div className="p-4 sm:p-8 overflow-y-auto flex-1 flex justify-center items-center bg-[#ECECE5] print:p-0 print:bg-white print:overflow-visible">
          
          {/* Certificate Container (Rendered to PNG / Print) */}
          <div 
            ref={certificateRef}
            id="gcmt-official-certificate"
            className="w-full max-w-[840px] aspect-[1.414/1] bg-[#FCFCFA] text-[#33332A] rounded-2xl border-[10px] border-[#A3AD94] p-6 sm:p-10 relative flex flex-col justify-between shadow-xl print:shadow-none print:border-[8px] print:border-[#A3AD94] print:m-0 print:w-full print:rounded-none select-none overflow-hidden"
            style={{ minHeight: '520px' }}
          >
            
            {/* Inner Decorative Border */}
            <div className="absolute inset-2 sm:inset-3 border-2 border-[#D1DDC8] pointer-events-none rounded-lg" />
            <div className="absolute inset-3 sm:inset-4 border border-[#E5EDE0] pointer-events-none rounded-md" />

            {/* Corner Decorative Ornaments */}
            <div className="absolute top-4 left-4 text-[#A3AD94] font-serif text-lg leading-none select-none">❖</div>
            <div className="absolute top-4 right-4 text-[#A3AD94] font-serif text-lg leading-none select-none">❖</div>
            <div className="absolute bottom-4 left-4 text-[#A3AD94] font-serif text-lg leading-none select-none">❖</div>
            <div className="absolute bottom-4 right-4 text-[#A3AD94] font-serif text-lg leading-none select-none">❖</div>

            {/* Header: Institution & Certificate Title */}
            <div className="text-center z-10 pt-1 sm:pt-2">
              <div className="flex items-center justify-center space-x-2 mb-1">
                <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] font-extrabold text-[#7A8A6A]">
                  MODUL PEMBELAJARAN & PENILAIAN MATEMATIK GCMT 2052
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-black tracking-wider text-[#3D4A35] uppercase mb-1 drop-shadow-xs">
                SIJIL PENCAPAIAN
              </h1>
              <p className="text-[11px] sm:text-xs font-serif tracking-[0.15em] text-[#6A7A60] uppercase">
                CERTIFICATE OF ACHIEVEMENT & MASTERY
              </p>
              <div className="w-32 sm:w-48 h-0.5 bg-[#A3AD94] mx-auto mt-2 mb-3" />
            </div>

            {/* Body: Trainee Name & Details */}
            <div className="text-center z-10 my-auto py-2 sm:py-3 space-y-2 sm:space-y-3">
              <p className="text-xs sm:text-sm font-serif italic text-[#666655]">
                Dengan ini diperakui bahawa pelatih di bawah:
              </p>

              {/* Trainee Full Name */}
              <div className="my-1 sm:my-2">
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-wide text-[#2B3824] uppercase border-b-2 border-[#D1DDC8] inline-block px-6 sm:px-10 pb-1 font-sans">
                  {userProfile.name || 'PELATIH GCMT 2052'}
                </h2>
              </div>

              {/* Matric Number & Institution */}
              <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm text-[#555545] font-medium">
                <span className="bg-[#EBF0E6] px-3.5 py-1 rounded-full border border-[#D1DDC8] font-bold text-[#3D4A35]">
                  No. Matrik: <strong className="font-mono">{userProfile.matricNumber || 'GCMT/2026/001'}</strong>
                </span>
                <span className="text-[#777766] hidden sm:inline">•</span>
                <span className="text-[#555545]">
                  {userProfile.institution || 'Institut Latihan Kementerian Kesihatan Malaysia Sungai Buloh'}
                </span>
              </div>

              <p className="text-xs sm:text-sm font-serif italic text-[#666655] pt-1">
                telah berjaya menyempurnakan penilaian dan menguasai kemahiran bagi:
              </p>

              {/* Unit Title */}
              <div className="bg-[#F4F7F0] border border-[#D8E2D2] rounded-2xl py-2 px-4 sm:px-6 max-w-xl mx-auto">
                <span className="block text-[11px] font-bold uppercase tracking-wider text-[#6A7A60]">
                  {currentTopic.code}
                </span>
                <span className="text-sm sm:text-base lg:text-lg font-extrabold text-[#33422C]">
                  {currentTopic.title}
                </span>
              </div>

              {/* Score & Grade Display */}
              <div className="flex items-center justify-center gap-4 sm:gap-8 pt-1">
                <div className="text-center">
                  <span className="block text-[10px] sm:text-[11px] uppercase tracking-wider text-[#777766] font-bold">Jumlah Markah</span>
                  <span className="text-xl sm:text-2xl font-black text-[#3D4A35] font-sans">
                    {calculatedScore}%
                  </span>
                  <span className="block text-[10px] text-[#6A7A60] font-medium">({correctCount}/{totalQuestions} Betul)</span>
                </div>

                <div className="h-8 w-px bg-[#D0D8C8]" />

                <div className="text-center">
                  <span className="block text-[10px] sm:text-[11px] uppercase tracking-wider text-[#777766] font-bold">Keputusan Gred</span>
                  <span className="text-sm sm:text-base font-extrabold text-[#3D4A35] uppercase">
                    {gradeInfo.grade}
                  </span>
                  <span className="block text-[10px] text-[#6A7A60] font-medium">{gradeInfo.desc}</span>
                </div>
              </div>
            </div>

            {/* Footer: Signatures, Seal & Serial Number */}
            <div className="z-10 pt-2 border-t border-[#E5EDE0] flex items-end justify-between text-left">
              
              {/* Left: Issue Date & Verification Serial */}
              <div className="space-y-1 text-[10px] sm:text-xs text-[#666655]">
                <div>
                  <span className="text-[#888877] block text-[9px] uppercase font-bold">Tarikh Dikeluarkan:</span>
                  <span className="font-semibold text-[#444433]">{issueDate}</span>
                </div>
                <div>
                  <span className="text-[#888877] block text-[9px] uppercase font-bold">No. Siri Sijil / Pengesahan:</span>
                  <span className="font-mono font-bold text-[#3D4A35] tracking-wider">{certSerialNumber}</span>
                </div>
              </div>

              {/* Middle: Official Embossed Gold/Green Seal */}
              <div className="flex flex-col items-center justify-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 border-[#C8B273] bg-gradient-to-br from-[#EEDB9F] via-[#C8B273] to-[#998042] flex flex-col items-center justify-center text-center p-1 shadow-md">
                  <Award className="w-6 h-6 sm:w-7 sm:h-7 text-[#4A3C17]" />
                  <span className="text-[7px] sm:text-[8px] font-black uppercase tracking-tighter text-[#3D300F] leading-tight mt-0.5">
                    GCMT 2052
                  </span>
                  <span className="text-[6px] sm:text-[7px] font-bold text-[#4A3C17] uppercase leading-none">
                    METERAI RASMI
                  </span>
                </div>
              </div>

              {/* Right: Digital Signatures */}
              <div className="text-right space-y-1">
                <div className="w-28 sm:w-36 border-b border-[#777766] pb-1 ml-auto">
                  <span className="font-serif italic text-xs sm:text-sm text-[#444433] block font-bold text-center">
                    Zulkifli M.
                  </span>
                </div>
                <div className="text-[9px] sm:text-[10px] text-[#666655] leading-tight">
                  <span className="font-bold text-[#3D4A35] block">Penyelaras Kursus</span>
                  <span>Unit Matematik & Sains GCMT</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Modal Bottom Action Controls (Hidden on Print) */}
        <div className="p-4 sm:p-5 bg-white border-t border-[#E0E0D0] flex flex-wrap items-center justify-between gap-3 shrink-0 print:hidden">
          <div className="flex items-center space-x-2 text-xs text-[#7A7A6A]">
            <Sparkles className="w-4 h-4 text-[#A3AD94]" />
            <span>Sijil dijana automatik berdasarkan rekod penguasaan unit anda.</span>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              id="btn-cert-copy-id"
              onClick={handleCopyCertId}
              className="px-3.5 py-2.5 rounded-2xl bg-[#FAF9F5] hover:bg-[#F0EFE8] text-[#5A5A50] border border-[#D9D9C8] text-xs font-semibold flex items-center gap-1.5 transition-colors"
              title="Salin No. Siri Sijil"
            >
              {copiedId ? <Check className="w-4 h-4 text-[#495E3F]" /> : <Share2 className="w-4 h-4" />}
              <span>{copiedId ? 'No. Siri Disalin!' : 'Salin No. Siri'}</span>
            </button>

            <button
              id="btn-cert-print"
              onClick={handlePrint}
              className="px-4 py-2.5 rounded-2xl bg-[#F5F5F0] hover:bg-[#E8E8E0] text-[#4A4A40] border border-[#E0E0D0] text-xs font-bold flex items-center gap-2 transition-colors shadow-xs"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak / Simpan PDF</span>
            </button>

            <button
              id="btn-cert-download-png"
              onClick={handleDownloadImage}
              disabled={isDownloading}
              className="px-6 py-2.5 rounded-2xl bg-[#A3AD94] hover:bg-[#8F9A7F] disabled:opacity-50 text-white text-xs font-bold flex items-center gap-2 transition-all shadow-xs"
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
