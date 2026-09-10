import React, { useState } from 'react';
import { Bookmark, Play, CheckCircle2, XCircle, Trash2, ArrowRight, Lock } from 'lucide-react';
import { Question } from '../types';
import { allQuestions } from '../data/topics';

interface BookmarksViewProps {
  bookmarkedIds: string[];
  onToggleBookmark: (questionId: string) => void;
  onStartBookmarkQuiz: (questions: Question[]) => void;
  isVerified?: boolean;
}

export const BookmarksView: React.FC<BookmarksViewProps> = ({
  bookmarkedIds,
  onToggleBookmark,
  onStartBookmarkQuiz,
  isVerified = true,
}) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const bookmarkedQuestions = allQuestions.filter((q) => bookmarkedIds.includes(q.id));

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="bg-white rounded-[32px] border border-[#E0E0D0] p-6 sm:p-8 shadow-xs mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 mb-1.5">
            <span className="text-xs font-bold uppercase tracking-wider px-3 py-0.5 rounded-full bg-[#FBF1EC] text-[#8E472D] border border-[#EBD0C6]">
              Koleksi Soalan Ditanda
            </span>
            <span className="text-xs text-[#7A7A6A]">Ulangkaji Sasaran</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#4A4A40]">
            Soalan Ditanda ({bookmarkedQuestions.length})
          </h2>
          <p className="text-xs sm:text-sm text-[#7A7A6A] mt-1">
            Simpanan soalan-soalan sukar atau penting untuk disemak berulang kali sebelum peperiksaan.
          </p>
        </div>

        {bookmarkedQuestions.length > 0 && (
          <button
            onClick={() => onStartBookmarkQuiz(bookmarkedQuestions)}
            className={`flex items-center space-x-2 px-6 py-3 rounded-2xl text-white font-bold text-sm transition-all shadow-xs cursor-pointer ${
              isVerified ? 'bg-[#D98C70] hover:bg-[#C7795C]' : 'bg-[#5A5A50] hover:bg-[#4A4A40]'
            }`}
          >
            {isVerified ? <Play className="w-4 h-4 fill-white" /> : <Lock className="w-4 h-4" />}
            <span>{isVerified ? 'Mula Latihan Soalan Ditanda' : 'Buka Latihan (Perlu No. Matrik)'}</span>
          </button>
        )}
      </div>

      {/* List */}
      {bookmarkedQuestions.length > 0 ? (
        <div className="space-y-4">
          {bookmarkedQuestions.map((q, idx) => {
            const isExpanded = expandedId === q.id;

            return (
              <div 
                key={q.id}
                className="bg-white rounded-[24px] border border-[#E0E0D0] shadow-xs overflow-hidden"
              >
                <div 
                  className="p-5 flex items-start justify-between gap-4 cursor-pointer select-none"
                  onClick={() => setExpandedId(isExpanded ? null : q.id)}
                >
                  <div className="flex items-start space-x-3">
                    <span className="w-7 h-7 rounded-xl bg-[#FBF1EC] text-[#8E472D] text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 border border-[#EBD0C6]">
                      {idx + 1}
                    </span>
                    <div>
                      <div className="flex items-center space-x-2 mb-1.5">
                        <span className="text-xs font-bold text-[#A3AD94] font-mono">
                          {q.topicTitle}
                        </span>
                        <span className="text-[11px] font-mono text-[#7A7A6A]">
                          Kod: {q.subtopicCode}
                        </span>
                        {q.difficulty && (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#F5F5F0] text-[#5A5A50] border border-[#E0E0D0]">
                            {q.difficulty}
                          </span>
                        )}
                      </div>
                      <p className="text-sm font-semibold text-[#4A4A40] leading-relaxed">
                        {q.questionText}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleBookmark(q.id);
                    }}
                    className="p-2 rounded-xl text-[#8E472D] hover:bg-[#FBF1EC] border border-[#EBD0C6] transition-colors shrink-0"
                    title="Buang dari tandaan"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {isExpanded && (
                  <div className="p-5 pt-0 border-t border-[#E8E8E0] text-xs sm:text-sm text-[#4A4A40] space-y-3">
                    {/* Options list */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
                      {q.options.map((opt) => {
                        const isCorrect = opt.id === q.correctAnswer;
                        return (
                          <div 
                            key={opt.id}
                            className={`p-3 rounded-xl border flex items-start space-x-2 ${
                              isCorrect 
                                ? 'bg-[#E8F0E8] border-[#C8D6C4] text-[#34452C] font-semibold' 
                                : 'bg-[#FAF9F5] border-[#E0E0D0] text-[#5A5A50]'
                            }`}
                          >
                            <span className={`w-5 h-5 rounded-md text-[11px] font-bold flex items-center justify-center shrink-0 ${
                              isCorrect ? 'bg-[#495E3F] text-white' : 'bg-[#E0E0D0] text-[#5A5A50]'
                            }`}>
                              {opt.label}
                            </span>
                            <span className="leading-snug">{opt.text}</span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Step-by-step Solution */}
                    <div className="p-4 rounded-xl bg-[#F5F7F2] border border-[#D6DFD0]">
                      <span className="font-bold text-[#3E4A38] block mb-1">Penyelesaian:</span>
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
      ) : (
        <div className="bg-white rounded-[32px] border border-[#E0E0D0] p-12 text-center shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-[#F5F5F0] text-[#8A8A7A] flex items-center justify-center mx-auto mb-3 border border-[#E0E0D0]">
            <Bookmark className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-[#4A4A40] mb-1">Tiada Soalan Ditanda Setakat Ini</h3>
          <p className="text-xs text-[#7A7A6A] max-w-sm mx-auto mb-6">
            Semasa membuat latihan kuiz atau cabaran masa, klik ikon bendera/bookmark pada mana-mana soalan yang anda ingin simpan di sini.
          </p>
        </div>
      )}
    </div>
  );
};
