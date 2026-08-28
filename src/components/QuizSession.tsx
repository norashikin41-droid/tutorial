import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Bookmark, 
  HelpCircle, 
  ArrowRight, 
  ArrowLeft, 
  Calculator, 
  RotateCcw,
  Sparkles,
  BookOpen,
  Info,
  ChevronRight
} from 'lucide-react';
import { Question, UserAnswerRecord, QuizAttempt } from '../types';
import { ScratchpadModal } from './ScratchpadModal';

interface QuizSessionProps {
  questions: Question[];
  topicTitle: string;
  topicId?: number;
  mode: 'practice' | 'timed';
  timeLimitMinutes?: number;
  bookmarkedIds: string[];
  onToggleBookmark: (questionId: string) => void;
  onFinishQuiz: (attempt: QuizAttempt) => void;
  onExit: () => void;
}

export const QuizSession: React.FC<QuizSessionProps> = ({
  questions,
  topicTitle,
  topicId,
  mode,
  timeLimitMinutes = 15,
  bookmarkedIds,
  onToggleBookmark,
  onFinishQuiz,
  onExit,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [checkedAnswers, setCheckedAnswers] = useState<Record<string, boolean>>({});
  const [instantFeedbackMode, setInstantFeedbackMode] = useState(mode === 'practice');
  const [isScratchpadOpen, setIsScratchpadOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState(timeLimitMinutes * 60);
  const [startTime] = useState(Date.now());
  const [timePerQuestion, setTimePerQuestion] = useState<Record<string, number>>({});
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());

  const currentQ = questions[currentIndex];

  // Track time spent per question
  useEffect(() => {
    setQuestionStartTime(Date.now());
  }, [currentIndex]);

  // Countdown timer for Timed Challenge Mode
  useEffect(() => {
    if (mode !== 'timed') return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleCompleteQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [mode]);

  const handleSelectOption = (optionId: string) => {
    if (checkedAnswers[currentQ.id] && instantFeedbackMode) return; // Prevent changing after checked

    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQ.id]: optionId,
    }));

    // Record time spent on current question
    const timeSpent = Math.round((Date.now() - questionStartTime) / 1000);
    setTimePerQuestion((prev) => ({
      ...prev,
      [currentQ.id]: (prev[currentQ.id] || 0) + timeSpent,
    }));

    // If in instant feedback mode, automatically check or let user click check
    if (instantFeedbackMode) {
      setCheckedAnswers((prev) => ({
        ...prev,
        [currentQ.id]: true,
      }));
    }
  };

  const handleCheckAnswer = () => {
    if (!selectedAnswers[currentQ.id]) return;
    setCheckedAnswers((prev) => ({
      ...prev,
      [currentQ.id]: true,
    }));
  };

  const handleCompleteQuiz = () => {
    const totalTimeSeconds = Math.round((Date.now() - startTime) / 1000);
    
    let correctCount = 0;
    const answerRecords: UserAnswerRecord[] = questions.map((q) => {
      const selected = selectedAnswers[q.id] || '';
      const isCorrect = selected === q.correctAnswer;
      if (isCorrect) correctCount++;

      return {
        questionId: q.id,
        selectedOptionId: selected,
        isCorrect,
        timeSpentSeconds: timePerQuestion[q.id] || 15,
      };
    });

    const score = questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0;

    const attempt: QuizAttempt = {
      id: `attempt_${Date.now()}`,
      topicId: topicId || 0,
      topicTitle,
      mode,
      totalQuestions: questions.length,
      correctCount,
      score,
      timeSpentSeconds: totalTimeSeconds,
      date: new Date().toISOString(),
      answers: answerRecords,
    };

    onFinishQuiz(attempt);
  };

  const isBookmarked = bookmarkedIds.includes(currentQ?.id);
  const selectedOption = selectedAnswers[currentQ?.id];
  const isChecked = checkedAnswers[currentQ?.id];
  const isCorrect = isChecked && selectedOption === currentQ?.correctAnswer;

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const answeredCount = Object.keys(selectedAnswers).length;
  const progressPct = Math.round(((currentIndex + 1) / questions.length) * 100);

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-6 py-6 animate-in fade-in duration-200">
      {/* Top Session Bar */}
      <div className="bg-white rounded-[28px] p-5 border border-[#E0E0D0] shadow-xs mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#E8F0E8] text-[#495E3F] border border-[#D1D1C0]">
              {topicId ? `Topik ${topicId}` : 'Kompilasi'}
            </span>
            <span className="text-xs font-semibold text-[#7A7A6A]">
              {mode === 'timed' ? '⚡ Cabaran Masa' : '📝 Latihan Interaktif'}
            </span>
          </div>
          <h2 className="text-base sm:text-lg font-extrabold text-[#4A4A40] line-clamp-1">
            {topicTitle}
          </h2>
        </div>

        {/* Action badges / Timer */}
        <div className="flex items-center space-x-3">
          {mode === 'timed' && (
            <div 
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-2xl font-mono text-sm font-bold border transition-colors ${
                timeLeft < 60 
                  ? 'bg-[#FCEEEA] border-[#D98C70] text-[#8C3A20] animate-pulse' 
                  : 'bg-[#FBF1EC] border-[#EBD0C6] text-[#8E472D]'
              }`}
            >
              <Clock className="w-4 h-4 text-[#D98C70]" />
              <span>{formatTimer(timeLeft)}</span>
            </div>
          )}

          <button
            id="btn-open-scratchpad"
            onClick={() => setIsScratchpadOpen(true)}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-2xl bg-[#F5F5F0] hover:bg-[#E8E8E0] text-[#5A5A50] text-xs font-semibold transition-colors border border-[#E0E0D0]"
            title="Buka Kalkulator & Draf"
          >
            <Calculator className="w-4 h-4 text-[#A3AD94]" />
            <span className="hidden sm:inline">Kalkulator / Draf</span>
          </button>

          <button
            id="btn-exit-quiz"
            onClick={onExit}
            className="px-3.5 py-2 rounded-2xl text-xs font-semibold text-[#7A7A6A] hover:text-[#4A4A40] hover:bg-[#E8E8E0] transition-colors"
          >
            Keluar
          </button>
        </div>
      </div>

      {/* Progress & Navigator Indicator */}
      <div className="mb-6">
        <div className="flex justify-between items-center text-xs font-semibold text-[#7A7A6A] mb-2">
          <span>Soalan {currentIndex + 1} daripada {questions.length}</span>
          <span>Dijawab: {answeredCount}/{questions.length}</span>
        </div>
        <div className="w-full h-2.5 rounded-full bg-[#E0E0D0] overflow-hidden">
          <div 
            className="h-full bg-[#A3AD94] transition-all duration-300 rounded-full"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-[32px] border border-[#E0E0D0] shadow-xs overflow-hidden mb-6">
        {/* Question Header & Meta */}
        <div className="px-6 sm:px-8 py-4 bg-[#FAF9F5] border-b border-[#E0E0D0] flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <span className="w-8 h-8 rounded-xl bg-[#A3AD94] text-white font-bold text-xs flex items-center justify-center shadow-xs">
              {currentQ.questionNumber}
            </span>
            <span className="text-xs font-mono font-bold text-[#7A7A6A]">
              Kod Subtopik: {currentQ.subtopicCode}
            </span>
            {currentQ.difficulty && (
              <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                currentQ.difficulty === 'Mudah' ? 'bg-[#E8F0E8] text-[#495E3F]' :
                currentQ.difficulty === 'Sederhana' ? 'bg-[#F5F0E8] text-[#7A6A5A]' : 'bg-[#FBF1EC] text-[#8E472D]'
              }`}>
                {currentQ.difficulty}
              </span>
            )}
          </div>

          <button
            id={`btn-bookmark-${currentQ.id}`}
            onClick={() => onToggleBookmark(currentQ.id)}
            className={`p-2 sm:px-3 rounded-2xl border transition-colors flex items-center gap-1.5 text-xs font-semibold ${
              isBookmarked 
                ? 'bg-[#FBF1EC] border-[#EBD0C6] text-[#8E472D]' 
                : 'bg-white border-[#E0E0D0] text-[#8A8A7A] hover:text-[#5A5A50]'
            }`}
            title="Tanda soalan untuk semakan kemudian"
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-[#D98C70] text-[#D98C70]' : ''}`} />
            <span className="hidden sm:inline">{isBookmarked ? 'Ditanda' : 'Tanda'}</span>
          </button>
        </div>

        {/* Question Text */}
        <div className="p-6 sm:p-8">
          {currentQ.realLifeContext && (
            <div className="mb-4 inline-flex items-center gap-1.5 px-3.5 py-1 rounded-xl bg-[#E8F0E8] border border-[#C8D6C4] text-[#495E3F] text-xs font-medium">
              <Sparkles className="w-3.5 h-3.5 text-[#A3AD94]" />
              <span>Aplikasi: {currentQ.realLifeContext}</span>
            </div>
          )}

          <div className="text-base sm:text-lg font-semibold text-[#4A4A40] leading-relaxed mb-6">
            {currentQ.questionText}
          </div>

          {/* Multiple Choice Options */}
          <div className="space-y-3">
            {currentQ.options.map((option) => {
              const isSelected = selectedOption === option.id;
              const isOptionCorrect = isChecked && option.id === currentQ.correctAnswer;
              const isOptionWrong = isChecked && isSelected && option.id !== currentQ.correctAnswer;

              let optionStyle = 'bg-[#FAF9F5] hover:bg-white border-[#E0E0D0] text-[#4A4A40]';

              if (isChecked) {
                if (isOptionCorrect) {
                  optionStyle = 'bg-[#E8F2E8] border-[#7EA47E] text-[#285228] font-semibold ring-2 ring-[#7EA47E]/20';
                } else if (isOptionWrong) {
                  optionStyle = 'bg-[#FCEEEA] border-[#D98C70] text-[#8C3A20] ring-2 ring-[#D98C70]/20';
                } else if (isSelected) {
                  optionStyle = 'bg-[#E8E8E0] border-[#D9D9D0] text-[#5A5A50]';
                }
              } else if (isSelected) {
                optionStyle = 'bg-[#F0F4EC] border-[#A3AD94] text-[#34452C] font-semibold ring-2 ring-[#A3AD94]/20 shadow-xs';
              }

              return (
                <button
                  key={option.id}
                  id={`option-${currentQ.id}-${option.id}`}
                  onClick={() => handleSelectOption(option.id)}
                  disabled={isChecked && instantFeedbackMode}
                  className={`w-full p-4 rounded-2xl border text-left transition-all duration-200 flex items-start space-x-3.5 group cursor-pointer ${optionStyle}`}
                >
                  <span className={`w-7 h-7 rounded-xl text-xs font-bold flex items-center justify-center shrink-0 transition-colors ${
                    isOptionCorrect ? 'bg-[#6A8A6A] text-white' :
                    isOptionWrong ? 'bg-[#D98C70] text-white' :
                    isSelected ? 'bg-[#A3AD94] text-white' : 'bg-[#E8E8E0] text-[#6A6A5E] group-hover:bg-[#D9D9D0]'
                  }`}>
                    {option.label}
                  </span>
                  <span className="text-sm sm:text-base flex-1 pt-0.5 leading-relaxed">
                    {option.text}
                  </span>

                  {isChecked && isOptionCorrect && (
                    <CheckCircle2 className="w-5 h-5 text-[#6A8A6A] shrink-0 mt-0.5" />
                  )}
                  {isChecked && isOptionWrong && (
                    <XCircle className="w-5 h-5 text-[#D98C70] shrink-0 mt-0.5" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Instant Step-by-Step Mathematical Explanation */}
          {isChecked && (
            <div className={`mt-6 p-5 sm:p-6 rounded-2xl border animate-in fade-in slide-in-from-top-2 duration-300 ${
              isCorrect ? 'bg-[#E8F2E8]/70 border-[#C8D6C4]' : 'bg-[#F5F7F2] border-[#D6DFD0]'
            }`}>
              <div className="flex items-center space-x-2 mb-2.5">
                {isCorrect ? (
                  <div className="flex items-center space-x-1.5 text-[#3E5C38] font-bold text-sm">
                    <CheckCircle2 className="w-4 h-4 text-[#6A8A6A]" />
                    <span>Tahniah! Jawapan Tepat</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-1.5 text-[#8E472D] font-bold text-sm">
                    <XCircle className="w-4 h-4 text-[#D98C70]" />
                    <span>Jawapan Kurang Tepat. Jawapan Sebenar ialah Pilihan {currentQ.correctAnswer}</span>
                  </div>
                )}
              </div>

              <div className="text-xs sm:text-sm text-[#4A4A40] space-y-2">
                <div>
                  <span className="font-bold text-[#3A3A32]">Langkah Penyelesaian: </span>
                  <span className="leading-relaxed font-sans">{currentQ.explanation}</span>
                </div>
                {currentQ.formulaUsed && (
                  <div className="pt-2 border-t border-[#D9D9D0] flex items-center gap-1.5 text-[#495E3F] font-mono text-xs">
                    <BookOpen className="w-3.5 h-3.5 text-[#A3AD94]" />
                    <span><strong>Rumus Digunakan:</strong> {currentQ.formulaUsed}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Navigation & Submission Controls Footer */}
        <div className="px-6 sm:px-8 py-4 bg-[#FAF9F5] border-t border-[#E0E0D0] flex items-center justify-between gap-3">
          <button
            id="btn-prev-question"
            onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
            disabled={currentIndex === 0}
            className="flex items-center space-x-1.5 px-4 py-2.5 rounded-2xl border border-[#E0E0D0] bg-white hover:bg-[#F5F5F0] disabled:opacity-40 disabled:cursor-not-allowed text-xs sm:text-sm font-semibold text-[#5A5A50] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Sebelumnya</span>
          </button>

          <div className="flex items-center space-x-2">
            {!isChecked && selectedOption && !instantFeedbackMode && (
              <button
                id="btn-check-manual"
                onClick={handleCheckAnswer}
                className="px-5 py-2.5 rounded-2xl bg-[#5A5A50] hover:bg-[#4A4A40] text-white text-xs sm:text-sm font-semibold transition-colors"
              >
                Semak Jawapan
              </button>
            )}

            {currentIndex < questions.length - 1 ? (
              <button
                id="btn-next-question"
                onClick={() => setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))}
                className="flex items-center space-x-1.5 px-6 py-2.5 rounded-2xl bg-[#A3AD94] hover:bg-[#8F9A7F] text-white text-xs sm:text-sm font-semibold transition-colors shadow-xs"
              >
                <span>Seterusnya</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                id="btn-finish-quiz"
                onClick={handleCompleteQuiz}
                className="flex items-center space-x-1.5 px-6 py-2.5 rounded-2xl bg-[#5A5A50] hover:bg-[#45453B] text-white text-xs sm:text-sm font-bold transition-colors shadow-sm"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Hantar & Lihat Keputusan</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Interactive Question Grid Palette */}
      <div className="bg-white rounded-[28px] p-5 sm:p-6 border border-[#E0E0D0] shadow-xs">
        <div className="flex items-center justify-between mb-3.5">
          <h4 className="text-xs font-bold text-[#5A5A50] uppercase tracking-wider">
            Palet Navigasi Soalan
          </h4>
          <div className="flex items-center space-x-3 text-[11px] text-[#7A7A6A] font-medium">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#A3AD94] inline-block" /> Semasa
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#E8F0E8] border border-[#C8D6C4] inline-block" /> Dijawab
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#D98C70] inline-block" /> Ditanda
            </span>
          </div>
        </div>

        <div className="grid grid-cols-5 sm:grid-cols-10 md:grid-cols-15 gap-2">
          {questions.map((q, idx) => {
            const isCurrent = idx === currentIndex;
            const isAns = !!selectedAnswers[q.id];
            const isBkm = bookmarkedIds.includes(q.id);

            let bgStyle = 'bg-[#F5F5F0] text-[#7A7A6A] hover:bg-[#E8E8E0]';
            if (isCurrent) {
              bgStyle = 'bg-[#A3AD94] text-white ring-2 ring-[#A3AD94]/40 font-bold';
            } else if (isAns) {
              bgStyle = 'bg-[#E8F0E8] text-[#495E3F] font-semibold border border-[#C8D6C4]';
            }

            return (
              <button
                key={q.id}
                id={`palette-q-${idx + 1}`}
                onClick={() => setCurrentIndex(idx)}
                className={`h-9 rounded-xl text-xs font-mono relative transition-all flex items-center justify-center ${bgStyle}`}
              >
                <span>{idx + 1}</span>
                {isBkm && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#D98C70] ring-1 ring-white" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Scratchpad Modal */}
      <ScratchpadModal
        isOpen={isScratchpadOpen}
        onClose={() => setIsScratchpadOpen(false)}
      />
    </div>
  );
};
