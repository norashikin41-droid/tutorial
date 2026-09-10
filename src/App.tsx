import React, { useState, useEffect } from 'react';
import { 
  Header 
} from './components/Header';
import { TopicCard } from './components/TopicCard';
import { QuizSession } from './components/QuizSession';
import { QuizResults } from './components/QuizResults';
import { PerformanceDashboard } from './components/PerformanceDashboard';
import { FormulaSheet } from './components/FormulaSheet';
import { SpeedChallengeModal } from './components/SpeedChallengeModal';
import { ReminderModal } from './components/ReminderModal';
import { BookmarksView } from './components/BookmarksView';
import { CertificateModal } from './components/CertificateModal';
import { MatricAuthModal } from './components/MatricAuthModal';
import { MatricLockBanner } from './components/MatricLockBanner';

import { allTopics, topicQuestionMap, allQuestions } from './data/topics';
import { 
  getStoredProfile, 
  saveProfile, 
  getStoredAttempts, 
  saveQuizAttempt, 
  getBookmarkedQuestionIds, 
  toggleBookmarkQuestion, 
  getReminderSettings, 
  saveReminderSettings,
  resetAllProgress 
} from './utils/storage';
import { getMatricSession } from './utils/matricAuth';
import { checkAndTriggerDailyReminder } from './utils/notification';
import { Question, QuizAttempt, UserProfile, ReminderSettings, MatricAuthSession } from './types';
import { 
  Search, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  BookOpen, 
  BarChart3, 
  ArrowRight,
  Calculator,
  Lock
} from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState<'topics' | 'challenge' | 'dashboard' | 'formulas' | 'bookmarks'>('topics');
  const [userProfile, setUserProfile] = useState<UserProfile>(getStoredProfile());
  const [matricSession, setMatricSession] = useState<MatricAuthSession>(getMatricSession());
  const [isMatricAuthOpen, setIsMatricAuthOpen] = useState(false);
  const [authRequiredAction, setAuthRequiredAction] = useState<string | null>(null);

  const [attempts, setAttempts] = useState<QuizAttempt[]>(getStoredAttempts());
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(getBookmarkedQuestionIds());
  const [reminderSettings, setReminderSettings] = useState<ReminderSettings>(getReminderSettings());
  const [isReminderOpen, setIsReminderOpen] = useState(false);
  const [isCertificateOpen, setIsCertificateOpen] = useState(false);
  const [selectedCertUnitId, setSelectedCertUnitId] = useState<number>(1);

  // Active Quiz State
  const [activeQuiz, setActiveQuiz] = useState<{
    questions: Question[];
    topicTitle: string;
    topicId?: number;
    mode: 'practice' | 'timed';
    timeLimitMinutes?: number;
  } | null>(null);

  // Completed Quiz Results state
  const [latestAttempt, setLatestAttempt] = useState<QuizAttempt | null>(null);

  // Topic filter / search state
  const [topicSearch, setTopicSearch] = useState('');

  // Daily reminder background trigger
  useEffect(() => {
    checkAndTriggerDailyReminder();
  }, []);

  const isVerifiedStudent = matricSession.isVerified && !!matricSession.matricNumber;

  const handleStartTopicQuiz = (topicId: number, mode: 'practice' | 'timed') => {
    const topic = allTopics.find((t) => t.id === topicId);
    const questions = topicQuestionMap[topicId] || [];
    if (!topic || questions.length === 0) return;

    // Hadkan akses: Pastikan pelatih disahkan dengan no matrik ILKKM Sungai Buloh
    if (!isVerifiedStudent) {
      setAuthRequiredAction(`Akses Soalan Unit ${topic.id} (${topic.code}: ${topic.title})`);
      setIsMatricAuthOpen(true);
      return;
    }

    // Untuk mod ujian pantas (timed), masa dikira: bilangan soalan × 1.5 minit
    const timeLimit = Math.round(questions.length * 1.5 * 10) / 10;

    setActiveQuiz({
      questions,
      topicTitle: `${topic.code}: ${topic.title}`,
      topicId: topic.id,
      mode,
      timeLimitMinutes: timeLimit,
    });
    setLatestAttempt(null);
  };

  const handleStartCustomChallenge = (
    selectedQuestions: Question[], 
    title: string, 
    durationMinutes: number
  ) => {
    if (!isVerifiedStudent) {
      setAuthRequiredAction('Mod Ujian Pantas ⚡');
      setIsMatricAuthOpen(true);
      return;
    }

    setActiveQuiz({
      questions: selectedQuestions,
      topicTitle: title,
      mode: 'timed',
      timeLimitMinutes: durationMinutes,
    });
    setLatestAttempt(null);
  };

  const handleStartBookmarkQuiz = (questions: Question[]) => {
    if (!isVerifiedStudent) {
      setAuthRequiredAction('Latihan Soalan Ditanda');
      setIsMatricAuthOpen(true);
      return;
    }

    setActiveQuiz({
      questions,
      topicTitle: `Latihan Soalan Ditanda (${questions.length} Soalan)`,
      mode: 'practice',
    });
    setLatestAttempt(null);
  };

  const handleFinishQuiz = (attempt: QuizAttempt) => {
    saveQuizAttempt(attempt);
    setAttempts(getStoredAttempts());
    setUserProfile(getStoredProfile());
    setLatestAttempt(attempt);
    setActiveQuiz(null);
  };

  const handleToggleBookmark = (questionId: string) => {
    const updated = toggleBookmarkQuestion(questionId);
    setBookmarkedIds(updated);
  };

  const handleResetProgress = () => {
    resetAllProgress();
    setUserProfile(getStoredProfile());
    setAttempts([]);
    setBookmarkedIds([]);
  };

  // Filter topics
  const filteredTopics = allTopics.filter(
    (t) =>
      t.title.toLowerCase().includes(topicSearch.toLowerCase()) ||
      t.code.toLowerCase().includes(topicSearch.toLowerCase()) ||
      t.description.toLowerCase().includes(topicSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F5F5F0] text-[#4A4A40] flex flex-col font-sans selection:bg-[#A3AD94] selection:text-white">
      
      {/* Top Application Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setActiveQuiz(null);
          setLatestAttempt(null);
        }}
        userProfile={userProfile}
        matricSession={matricSession}
        onOpenReminderModal={() => setIsReminderOpen(true)}
        onOpenCertificate={() => {
          setSelectedCertUnitId(1);
          setIsCertificateOpen(true);
        }}
        onOpenMatricModal={() => {
          setAuthRequiredAction(null);
          setIsMatricAuthOpen(true);
        }}
        bookmarkedCount={bookmarkedIds.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        
        {/* VIEW 1: Active Quiz Session */}
        {activeQuiz && (
          <QuizSession
            questions={activeQuiz.questions}
            topicTitle={activeQuiz.topicTitle}
            topicId={activeQuiz.topicId}
            mode={activeQuiz.mode}
            timeLimitMinutes={activeQuiz.timeLimitMinutes}
            bookmarkedIds={bookmarkedIds}
            onToggleBookmark={handleToggleBookmark}
            onFinishQuiz={handleFinishQuiz}
            onExit={() => setActiveQuiz(null)}
          />
        )}

        {/* VIEW 2: Quiz Results Breakdown */}
        {!activeQuiz && latestAttempt && (
          <QuizResults
            attempt={latestAttempt}
            onRetry={() => {
              const prevTopicId = latestAttempt.topicId;
              if (prevTopicId && topicQuestionMap[prevTopicId]) {
                handleStartTopicQuiz(prevTopicId, latestAttempt.mode);
              } else {
                setActiveQuiz({
                  questions: latestAttempt.answers.map(
                    (a) => allQuestions.find((q) => q.id === a.questionId)!
                  ).filter(Boolean),
                  topicTitle: latestAttempt.topicTitle,
                  mode: latestAttempt.mode,
                  timeLimitMinutes: Math.ceil(latestAttempt.timeSpentSeconds / 60) || 15,
                });
              }
            }}
            onGoHome={() => {
              setLatestAttempt(null);
              setActiveTab('topics');
            }}
            bookmarkedIds={bookmarkedIds}
            onToggleBookmark={handleToggleBookmark}
            onOpenCertificate={(topicId) => {
              setSelectedCertUnitId(topicId);
              setIsCertificateOpen(true);
            }}
          />
        )}

        {/* VIEW 3: Main Topic Explorer (Default) */}
        {!activeQuiz && !latestAttempt && activeTab === 'topics' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-200">
            
            {/* Security Access Banner */}
            <MatricLockBanner 
              session={matricSession} 
              onOpenAuthModal={() => {
                setAuthRequiredAction(null);
                setIsMatricAuthOpen(true);
              }} 
            />

            {/* Hero Revision Banner */}
            <div className="bg-[#4A4A40] rounded-[32px] p-7 sm:p-10 text-[#FAF9F5] shadow-md mb-8 relative overflow-hidden border border-[#3E3E36]">
              <div className="relative z-10 max-w-3xl">
                <div className="flex items-center space-x-2 mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider px-3.5 py-1 rounded-full bg-[#A3AD94]/30 backdrop-blur-md text-[#D8E2CD] border border-[#A3AD94]/40">
                    Modul Revisi Interaktif GCMT 2052
                  </span>
                  <span className="text-xs text-[#C8C8B8] hidden sm:inline">154 Soalan Latihan & Penyelesaian Terperinci</span>
                </div>

                <h2 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight mb-3 tracking-tight">
                  Kuasai Matematik GCMT 2052 Secara Sistematik
                </h2>

                <p className="text-xs sm:text-sm text-[#D8D8CA] mb-6 leading-relaxed">
                  Latihan topikal interaktif, semakan jawapan pantas berserta rumus matematik dan aplikasi praktikal untuk pelatih Institut Latihan Kementerian Kesihatan Malaysia Sungai Buloh (ILKKM Sungai Buloh).
                </p>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => setActiveTab('challenge')}
                    className="flex items-center space-x-2 px-6 py-3.5 rounded-2xl bg-[#D98C70] hover:bg-[#C7795C] text-white font-bold text-xs sm:text-sm transition-all shadow-sm cursor-pointer"
                  >
                    <Clock className="w-4 h-4" />
                    <span>Mula Ujian Pantas ⚡ (1.5 Min/Soalan)</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('formulas')}
                    className="flex items-center space-x-2 px-6 py-3.5 rounded-2xl bg-[#5A5A50] hover:bg-[#68685C] text-white font-semibold text-xs sm:text-sm transition-all border border-[#707062] cursor-pointer"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>Lihat Formula Rasmi</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Topic Filter & Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-xl font-extrabold text-[#4A4A40]">
                  Senarai 10 Topik Pembelajaran
                </h3>
                <p className="text-xs text-[#7A7A6A]">
                  Pilih topik untuk memulakan semakan jawapan segera atau ujian kepantasan
                </p>
              </div>

              {/* Search Bar */}
              <div className="w-full sm:w-80 relative">
                <Search className="w-4 h-4 text-[#8A8A7A] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Cari topik, formula atau konsep..."
                  value={topicSearch}
                  onChange={(e) => setTopicSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-2xl border border-[#E0E0D0] bg-white text-xs sm:text-sm text-[#4A4A40] focus:outline-none focus:ring-2 focus:ring-[#A3AD94] shadow-xs"
                />
              </div>
            </div>

            {/* Topic Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTopics.map((topic) => (
                <TopicCard
                  key={topic.id}
                  topic={topic}
                  userProfile={userProfile}
                  onStartQuiz={handleStartTopicQuiz}
                  isVerified={isVerifiedStudent}
                />
              ))}
            </div>
          </div>
        )}

        {/* VIEW 4: Speed Challenge Mode */}
        {!activeQuiz && !latestAttempt && activeTab === 'challenge' && (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <MatricLockBanner 
              session={matricSession} 
              onOpenAuthModal={() => {
                setAuthRequiredAction('Mod Ujian Pantas ⚡');
                setIsMatricAuthOpen(true);
              }} 
            />
            <SpeedChallengeModal
              onStartChallenge={handleStartCustomChallenge}
              isVerified={isVerifiedStudent}
            />
          </div>
        )}

        {/* VIEW 5: Performance Dashboard */}
        {!activeQuiz && !latestAttempt && activeTab === 'dashboard' && (
          <PerformanceDashboard
            userProfile={userProfile}
            attempts={attempts}
            onStartTopicQuiz={handleStartTopicQuiz}
            onResetProgress={handleResetProgress}
            onOpenCertificate={(unitId) => {
              if (unitId) setSelectedCertUnitId(unitId);
              setIsCertificateOpen(true);
            }}
          />
        )}

        {/* VIEW 6: Official Formula Sheet */}
        {!activeQuiz && !latestAttempt && activeTab === 'formulas' && (
          <FormulaSheet />
        )}

        {/* VIEW 7: Bookmarks View */}
        {!activeQuiz && !latestAttempt && activeTab === 'bookmarks' && (
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <MatricLockBanner 
              session={matricSession} 
              onOpenAuthModal={() => {
                setAuthRequiredAction('Latihan Soalan Ditanda');
                setIsMatricAuthOpen(true);
              }} 
            />
            <BookmarksView
              bookmarkedIds={bookmarkedIds}
              onToggleBookmark={handleToggleBookmark}
              onStartBookmarkQuiz={handleStartBookmarkQuiz}
              isVerified={isVerifiedStudent}
            />
          </div>
        )}
      </main>

      {/* Trainee Certificate Modal */}
      <CertificateModal
        isOpen={isCertificateOpen}
        onClose={() => setIsCertificateOpen(false)}
        userProfile={userProfile}
        onUpdateProfile={(updated) => setUserProfile(updated)}
        attempts={attempts}
        initialUnitId={selectedCertUnitId}
      />

      {/* Daily Reminder Modal */}
      <ReminderModal
        isOpen={isReminderOpen}
        onClose={() => setIsReminderOpen(false)}
        settings={reminderSettings}
        userProfile={userProfile}
        onSaveSettings={(s) => {
          const updated = saveReminderSettings(s);
          setReminderSettings(updated);
        }}
        onSaveProfile={(p) => {
          const updated = saveProfile(p);
          setUserProfile(updated);
        }}
      />

      {/* Matric Authentication & Verification Modal */}
      <MatricAuthModal
        isOpen={isMatricAuthOpen}
        onClose={() => {
          setIsMatricAuthOpen(false);
          setAuthRequiredAction(null);
        }}
        onAuthSuccess={(session) => {
          setMatricSession(session);
          setUserProfile(getStoredProfile());
        }}
        requiredForAction={authRequiredAction}
      />
    </div>
  );
}

export default App;

