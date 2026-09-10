import React from 'react';
import { 
  BookOpen, 
  Flame, 
  Clock, 
  BarChart3, 
  FileText, 
  Bell, 
  Bookmark, 
  CheckCircle2,
  GraduationCap,
  ShieldCheck,
  Lock,
  KeyRound
} from 'lucide-react';
import { UserProfile, MatricAuthSession } from '../types';

interface HeaderProps {
  activeTab: 'topics' | 'challenge' | 'dashboard' | 'formulas' | 'bookmarks';
  setActiveTab: (tab: 'topics' | 'challenge' | 'dashboard' | 'formulas' | 'bookmarks') => void;
  userProfile: UserProfile;
  matricSession: MatricAuthSession;
  onOpenReminderModal: () => void;
  onOpenCertificate: () => void;
  onOpenMatricModal: () => void;
  bookmarkedCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  userProfile,
  matricSession,
  onOpenReminderModal,
  onOpenCertificate,
  onOpenMatricModal,
  bookmarkedCount,
}) => {
  const masteryPercentage = Math.round(
    (userProfile.correctQuestions.length / 154) * 100
  );

  return (
    <header className="sticky top-0 z-30 bg-[#E8E8E0]/95 backdrop-blur-md border-b border-[#D9D9D0] shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & Course Info */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('topics')}>
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-[#A3AD94] flex items-center justify-center text-white font-bold text-xl shadow-xs">
              Σ
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#E8F0E8] text-[#495E3F] border border-[#D1D1C0]">
                  GCMT 2052
                </span>
                <span className="text-xs text-[#7A7A6A] hidden sm:inline-block">Institut Latihan Kementerian Kesihatan Malaysia Sungai Buloh</span>
              </div>
              <h1 className="text-base sm:text-lg font-extrabold text-[#5A5A50] leading-tight">
                Matematik GCMT 2052 <span className="text-[#A3AD94] font-semibold text-xs sm:text-sm">Revisi Pintar</span>
              </h1>
            </div>
          </div>

          {/* Quick Stats & Utilities */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {/* Matric Auth Status Button */}
            <button
              id="header-matric-auth-btn"
              onClick={onOpenMatricModal}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-2xl border text-xs sm:text-sm font-bold shadow-xs transition-colors cursor-pointer ${
                matricSession.isVerified && matricSession.matricNumber
                  ? 'bg-[#EBF0E6] border-[#C8D6C4] text-[#33422C] hover:bg-[#DCE7D6]'
                  : 'bg-[#FDF5F2] border-[#EBD0C6] text-[#8E472D] hover:bg-[#FBE8E1]'
              }`}
              title={
                matricSession.isVerified && matricSession.matricNumber
                  ? `Pelatih Disahkan: ${matricSession.matricNumber} (${matricSession.studentName})`
                  : 'Klik untuk sahkan Nombor Matrik ILKKM Sungai Buloh'
              }
            >
              {matricSession.isVerified && matricSession.matricNumber ? (
                <>
                  <ShieldCheck className="w-4 h-4 text-[#495E3F]" />
                  <span className="hidden sm:inline font-mono">{matricSession.matricNumber}</span>
                  <span className="sm:hidden font-mono">Disahkan</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 text-[#D98C70]" />
                  <span>Sahkan Matrik</span>
                </>
              )}
            </button>

            {/* Streak Counter */}
            <div 
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-2xl bg-[#FBF1EC] border border-[#EBD0C6] text-[#8E472D] text-xs sm:text-sm font-semibold shadow-xs"
              title="Hari Berturut-turut Latihan"
            >
              <Flame className="w-4 h-4 text-[#D98C70] fill-[#D98C70]" />
              <span>{userProfile.streakDays || 1} Hari</span>
            </div>

            {/* Total Mastery Badge */}
            <div 
              className="hidden md:flex items-center space-x-2 px-3.5 py-1.5 rounded-2xl bg-[#E8F0E8] border border-[#C8D6C4] text-[#495E3F] text-xs font-semibold"
              title="Soalan Selesai dengan Betul"
            >
              <CheckCircle2 className="w-4 h-4 text-[#6A8A6A]" />
              <span>{userProfile.correctQuestions.length}/154 Selesai ({masteryPercentage}%)</span>
            </div>

            {/* Certificate Button */}
            <button
              id="header-certificate-btn"
              onClick={onOpenCertificate}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-2xl bg-[#E8F0E8] border border-[#C8D6C4] text-[#3D4A35] text-xs sm:text-sm font-bold shadow-xs hover:bg-[#DCE7D6] transition-colors"
              title="Lihat & Muat Turun Sijil Pelatih"
            >
              <GraduationCap className="w-4 h-4 text-[#495E3F]" />
              <span className="hidden sm:inline">Sijil Pelatih</span>
            </button>

            {/* Daily Reminder Button */}
            <button
              id="header-reminder-btn"
              onClick={onOpenReminderModal}
              className="p-2.5 rounded-2xl text-[#6A6A5E] hover:text-[#4A4A40] hover:bg-[#D9D9D0]/70 transition-colors border border-[#D1D1C0] bg-white/70"
              title="Tetapan Peringatan Harian"
            >
              <Bell className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Primary Tab Navigation */}
        <nav className="flex space-x-1.5 sm:space-x-2 overflow-x-auto pb-2.5 scrollbar-none text-xs sm:text-sm font-medium">
          <button
            id="nav-tab-topics"
            onClick={() => setActiveTab('topics')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-2xl transition-all whitespace-nowrap ${
              activeTab === 'topics'
                ? 'bg-[#A3AD94] text-white shadow-xs font-semibold'
                : 'text-[#6A6A5E] hover:text-[#4A4A40] hover:bg-[#D9D9D0]/70'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Senarai Topik (1-10)</span>
          </button>

          <button
            id="nav-tab-challenge"
            onClick={() => setActiveTab('challenge')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-2xl transition-all whitespace-nowrap ${
              activeTab === 'challenge'
                ? 'bg-[#D98C70] text-white shadow-xs font-semibold'
                : 'text-[#6A6A5E] hover:text-[#4A4A40] hover:bg-[#D9D9D0]/70'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Ujian Pantas ⚡</span>
          </button>

          <button
            id="nav-tab-dashboard"
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-2xl transition-all whitespace-nowrap ${
              activeTab === 'dashboard'
                ? 'bg-[#5A5A50] text-white shadow-xs font-semibold'
                : 'text-[#6A6A5E] hover:text-[#4A4A40] hover:bg-[#D9D9D0]/70'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Analisis Prestasi</span>
          </button>

          <button
            id="nav-tab-formulas"
            onClick={() => setActiveTab('formulas')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-2xl transition-all whitespace-nowrap ${
              activeTab === 'formulas'
                ? 'bg-[#8F9A7F] text-white shadow-xs font-semibold'
                : 'text-[#6A6A5E] hover:text-[#4A4A40] hover:bg-[#D9D9D0]/70'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Buku Rumus Rasmi</span>
          </button>

          <button
            id="nav-tab-bookmarks"
            onClick={() => setActiveTab('bookmarks')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-2xl transition-all whitespace-nowrap ${
              activeTab === 'bookmarks'
                ? 'bg-[#C67B60] text-white shadow-xs font-semibold'
                : 'text-[#6A6A5E] hover:text-[#4A4A40] hover:bg-[#D9D9D0]/70'
            }`}
          >
            <Bookmark className="w-4 h-4" />
            <span>Soalan Ditanda ({bookmarkedCount})</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
