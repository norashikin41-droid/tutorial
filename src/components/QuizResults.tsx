import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  Trophy, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  BookOpen, 
  Bookmark, 
  ChevronDown, 
  ChevronUp,
  Award,
  ArrowRight
} from 'lucide-react';
import { QuizAttempt, Question } from '../types';
import { allQuestions } from '../data/topics';

interface QuizResultsProps {
  attempt: QuizAttempt;
  onRetry: () => void;
  onGoHome: () => void;
  bookmarkedIds: string[];
  onToggleBookmark: (questionId: string) => void;
  onOpenCertificate?: (topicId: number) => void;
}

export const QuizResults: React.FC<QuizResultsProps> = ({
  attempt,
  onRetry,
  onGoHome,
  bookmarkedIds,
  onToggleBookmark,
  onOpenCertificate,
}) => {
  const [filter, setFilter] = useState<'all' | 'correct' | 'wrong'>('all');
  const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>(null);

  const questionMap = new Map<string, Question>();
  allQuestions.forEach((q) => questionMap.set(q.id, q));

  useEffect(() => {
    if (attempt.score >= 70) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  }, [attempt.score]);

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}m ${s}s`;
  };

  const filteredAnswers = attempt.answers.filter((ans) => {
    if (filter === 'correct') return ans.isCorrect;
    if (filter === 'wrong') return !ans.isCorrect;
    return true;
  });

  const getGradeInfo = (score: number) => {
    if (score >= 85) return { grade: 'A / Cemerlang Tinggi', color: 'text-[#3E5C38]', bg: 'bg-[#E8F2E8] border-[#C8D6C4]', desc: 'Penguasaan konsep dan kepantasan cemerlang!' };
    if (score >= 75) return { grade: 'A- / Cemerlang', color: 'text-[#495E3F]', bg: 'bg-[#EBF0E6] border-[#D1DDC8]', desc: 'Pemahaman yang sangat baik, teruskan kecemerlangan!' };
    if (score >= 60) return { grade: 'B / Kepujian', color: 'text-[#5A5A50]', bg: 'bg-[#F5F5F0] border-[#E0E0D0]', desc: 'Kefahaman memuaskan. Semak soalan yang salah untuk pemantapan.' };
    if (score >= 50) return { grade: 'C / Lulus', color: 'text-[#8E472D]', bg: 'bg-[#FBF1EC] border-[#EBD0C6]', desc: 'Perlu latihan ulangkaji berfokus pada topik ini.' };
    return { grade: 'Belum Menguasai', color: 'text-[#A35C42]', bg: 'bg-[#FCEEEA] border-[#D98C70]', desc: 'Sila rujuk nota dan cuba semula latihan topikal.' };
  };

  const grade = getGradeInfo(attempt.score);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 animate-in fade-in duration-300">
      
      {/* Top Results Card */}
      <div className="bg-white rounded-[36px] border border-[#E0E0D0] shadow-xs p-6 sm:p-10 mb-8 text-center relative overflow-hidden">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#A3AD94] text-white mb-4 shadow-xs">
          <Trophy className="w-8 h-8" />
        </div>

        <div>
          <span className="inline-block text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-[#F5F5F0] text-[#5A5A50] border border-[#E0E0D0] mb-2">
            {attempt.topicTitle} • {attempt.mode === 'timed' ? 'Cabaran Masa' : 'Latihan Topikal'}
          </span>
        </div>

        <h2 className="text-4xl sm:text-5xl font-extrabold text-[#4A4A40] mb-2 tracking-tight">
          {attempt.score}%
        </h2>

        <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-2xl border ${grade.bg} ${grade.color} font-bold text-sm mb-4`}>
          <Award className="w-4 h-4" />
          <span>{grade.grade}</span>
        </div>

        <p className="text-sm text-[#7A7A6A] max-w-md mx-auto mb-6 leading-relaxed">
          {grade.desc}
        </p>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3 max-w-lg mx-auto mb-6">
          <div className="p-3.5 rounded-2xl bg-[#F5F5F0] border border-[#E8E8E0]">
            <span className="block text-[11px] font-bold text-[#8A8A7A] uppercase tracking-wider mb-1">Betul</span>
            <span className="text-lg sm:text-xl font-bold text-[#495E3F] flex items-center justify-center gap-1">
              <CheckCircle2 className="w-4 h-4 text-[#6A8A6A]" />
              {attempt.correctCount}/{attempt.totalQuestions}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#F5F5F0] border border-[#E8E8E0]">
            <span className="block text-[11px] font-bold text-[#8A8A7A] uppercase tracking-wider mb-1">Salah</span>
            <span className="text-lg sm:text-xl font-bold text-[#8E472D] flex items-center justify-center gap-1">
              <XCircle className="w-4 h-4 text-[#D98C70]" />
              {attempt.totalQuestions - attempt.correctCount}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#F5F5F0] border border-[#E8E8E0]">
            <span className="block text-[11px] font-bold text-[#8A8A7A] uppercase tracking-wider mb-1">Masa Digunakan</span>
            <span className="text-lg sm:text-xl font-bold text-[#4A4A40] flex items-center justify-center gap-1">
              <Clock className="w-4 h-4 text-[#7A7A6A]" />
              {formatSeconds(attempt.timeSpentSeconds)}
            </span>
          </div>
        </div>

        {/* Certificate Banner & Action */}
        <div className="bg-[#EBF0E6] border-2 border-[#C8D6C4] rounded-2xl p-4 sm:p-5 mb-6 max-w-lg mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs text-left">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-2xl bg-[#A3AD94] flex items-center justify-center text-white shrink-0 shadow-xs">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#33422C]">
                Sijil Pencapaian Unit Anda Sedia Dijana!
              </h4>
              <p className="text-xs text-[#5A6E50]">
                Mengandungi nama penuh, no. matrik & skor {attempt.score}%
              </p>
            </div>
          </div>

          {onOpenCertificate && (
            <button
              id="btn-view-certificate"
              onClick={() => onOpenCertificate(attempt.topicId)}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#495E3F] hover:bg-[#3D4F34] text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shrink-0 shadow-xs"
            >
              <Award className="w-4 h-4" />
              <span>Lihat & Muat Turun Sijil</span>
            </button>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            id="btn-results-retry"
            onClick={onRetry}
            className="flex items-center space-x-2 px-6 py-3 rounded-2xl bg-[#A3AD94] hover:bg-[#8F9A7F] text-white font-semibold text-sm transition-all shadow-xs"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Ulang Ujian Ini</span>
          </button>

          <button
            id="btn-results-home"
            onClick={onGoHome}
            className="flex items-center space-x-2 px-6 py-3 rounded-2xl bg-[#F5F5F0] hover:bg-[#E8E8E0] text-[#5A5A50] font-semibold text-sm transition-all border border-[#E0E0D0]"
          >
            <span>Kembali ke Senarai Topik</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Review Section */}
      <div className="bg-white rounded-[28px] border border-[#E0E0D0] shadow-xs p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#E0E0D0] mb-6">
          <div>
            <h3 className="text-lg font-bold text-[#4A4A40]">Semakan Jawapan Terperinci</h3>
            <p className="text-xs text-[#7A7A6A]">Klik soalan untuk melihat langkah penyelesaian penuh & rumus</p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center space-x-1.5 bg-[#F5F5F0] p-1 rounded-2xl border border-[#E8E8E0]">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
                filter === 'all' ? 'bg-[#5A5A50] text-white shadow-xs' : 'text-[#7A7A6A] hover:text-[#4A4A40]'
              }`}
            >
              Semua ({attempt.answers.length})
            </button>
            <button
              onClick={() => setFilter('correct')}
              className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
                filter === 'correct' ? 'bg-[#A3AD94] text-white shadow-xs' : 'text-[#495E3F] hover:bg-[#E8F0E8]'
              }`}
            >
              Betul ({attempt.correctCount})
            </button>
            <button
              onClick={() => setFilter('wrong')}
              className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
                filter === 'wrong' ? 'bg-[#D98C70] text-white shadow-xs' : 'text-[#8E472D] hover:bg-[#FBF1EC]'
              }`}
            >
              Salah ({attempt.totalQuestions - attempt.correctCount})
            </button>
          </div>
        </div>

        {/* Answers List */}
        <div className="space-y-4">
          {filteredAnswers.map((ans, idx) => {
            const q = questionMap.get(ans.questionId);
            if (!q) return null;

            const isExpanded = expandedQuestionId === q.id;
            const isBkm = bookmarkedIds.includes(q.id);

            return (
              <div
                key={ans.questionId}
                className={`rounded-2xl border transition-all ${
                  ans.isCorrect ? 'border-[#C8D6C4] bg-[#E8F2E8]/30' : 'border-[#EBD0C6] bg-[#FBF1EC]/30'
                }`}
              >
                {/* Header Row */}
                <div 
                  className="p-4 sm:p-5 flex items-start justify-between gap-3 cursor-pointer select-none"
                  onClick={() => setExpandedQuestionId(isExpanded ? null : q.id)}
                >
                  <div className="flex items-start space-x-3">
                    <span className={`w-7 h-7 rounded-xl text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 ${
                      ans.isCorrect ? 'bg-[#6A8A6A] text-white' : 'bg-[#D98C70] text-white'
                    }`}>
                      {idx + 1}
                    </span>
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-[11px] font-mono font-bold text-[#7A7A6A]">
                          {q.subtopicCode}
                        </span>
                        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                          ans.isCorrect ? 'bg-[#E8F0E8] text-[#495E3F]' : 'bg-[#FBF1EC] text-[#8E472D]'
                        }`}>
                          {ans.isCorrect ? 'Betul' : 'Salah'}
                        </span>
                        <span className="text-[11px] text-[#8A8A7A]">
                          Masa: {ans.timeSpentSeconds}s
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-[#4A4A40] line-clamp-2">
                        {q.questionText}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleBookmark(q.id);
                      }}
                      className={`p-2 rounded-xl border text-xs ${
                        isBkm ? 'bg-[#FBF1EC] border-[#EBD0C6] text-[#8E472D]' : 'border-[#E0E0D0] text-[#8A8A7A] hover:text-[#5A5A50] bg-white'
                      }`}
                      title="Tanda soalan"
                    >
                      <Bookmark className={`w-4 h-4 ${isBkm ? 'fill-[#D98C70]' : ''}`} />
                    </button>
                    {isExpanded ? <ChevronUp className="w-5 h-5 text-[#8A8A7A]" /> : <ChevronDown className="w-5 h-5 text-[#8A8A7A]" />}
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="p-5 pt-0 border-t border-[#E8E8E0] text-xs sm:text-sm text-[#4A4A40] space-y-3">
                    {/* Selected and Correct Answer */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-3">
                      <div className="p-3.5 rounded-xl bg-[#FAF9F5] border border-[#E0E0D0]">
                        <span className="text-[11px] font-bold text-[#7A7A6A] uppercase block">Jawapan Anda</span>
                        <span className="font-semibold text-[#4A4A40]">
                          Pilihan {ans.selectedOptionId || 'Tiada'}
                        </span>
                      </div>
                      <div className="p-3.5 rounded-xl bg-[#E8F0E8]/70 border border-[#C8D6C4]">
                        <span className="text-[11px] font-bold text-[#495E3F] uppercase block">Jawapan Betul</span>
                        <span className="font-semibold text-[#34452C]">
                          Pilihan {q.correctAnswer} - {q.options.find((o) => o.id === q.correctAnswer)?.text}
                        </span>
                      </div>
                    </div>

                    {/* Step-by-Step Explanation */}
                    <div className="p-4 rounded-xl bg-[#F5F7F2] border border-[#D6DFD0] text-[#4A4A40]">
                      <span className="font-bold text-[#3E4A38] block mb-1">Langkah Penyelesaian:</span>
                      <p className="leading-relaxed">{q.explanation}</p>
                      {q.formulaUsed && (
                        <div className="mt-2 pt-2 border-t border-[#D6DFD0] font-mono text-xs text-[#495E3F]">
                          <strong>Rumus:</strong> {q.formulaUsed}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
