import React from 'react';
import { 
  Play, 
  Clock, 
  CheckCircle, 
  BookOpen, 
  Sparkles,
  ChevronRight,
  Calculator,
  Scale,
  Variable,
  SlidersHorizontal,
  Layers,
  Binary,
  TrendingUp,
  Activity,
  Box,
  Triangle,
  Lock
} from 'lucide-react';
import { TopicInfo, UserProfile } from '../types';
import { topicQuestionMap } from '../data/topics';

interface TopicCardProps {
  topic: TopicInfo;
  userProfile: UserProfile;
  onStartQuiz: (topicId: number, mode: 'practice' | 'timed') => void;
  isVerified?: boolean;
}

const iconComponents: Record<string, React.ReactNode> = {
  Calculator: <Calculator className="w-5 h-5" />,
  Scale: <Scale className="w-5 h-5" />,
  Variable: <Variable className="w-5 h-5" />,
  SlidersHorizontal: <SlidersHorizontal className="w-5 h-5" />,
  Layers: <Layers className="w-5 h-5" />,
  Binary: <Binary className="w-5 h-5" />,
  TrendingUp: <TrendingUp className="w-5 h-5" />,
  Activity: <Activity className="w-5 h-5" />,
  Box: <Box className="w-5 h-5" />,
  Triangle: <Triangle className="w-5 h-5" />,
};

export const TopicCard: React.FC<TopicCardProps> = ({
  topic,
  userProfile,
  onStartQuiz,
  isVerified = true,
}) => {
  const questions = topicQuestionMap[topic.id] || [];
  const topicQuestionIds = questions.map((q) => q.id);
  
  const correctCount = topicQuestionIds.filter((id) => 
    userProfile.correctQuestions.includes(id)
  ).length;

  const attemptedCount = topicQuestionIds.filter((id) => 
    userProfile.completedQuestions.includes(id)
  ).length;

  const percentage = questions.length > 0 
    ? Math.round((correctCount / questions.length) * 100) 
    : 0;

  return (
    <div 
      id={`topic-card-${topic.id}`}
      className="bg-white rounded-[28px] border border-[#E0E0D0] shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between overflow-hidden group hover:border-[#D1D1C0]"
    >
      <div className="p-6 sm:p-7">
        {/* Header with Topic Badge and Icon */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-2xl bg-[#F5F5F0] border border-[#E0E0D0] text-[#5A5A50] flex items-center justify-center shadow-xs group-hover:bg-[#EBF0E6] group-hover:text-[#495E3F] transition-colors">
              {iconComponents[topic.iconName] || <BookOpen className="w-5 h-5" />}
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#8A8A7A] font-mono">
                {topic.code}
              </span>
              <h3 className="text-base sm:text-lg font-bold text-[#4A4A40] leading-snug group-hover:text-[#5A6B4F] transition-colors">
                {topic.title}
              </h3>
            </div>
          </div>
          {isVerified ? (
            <span className="shrink-0 text-xs font-semibold px-3 py-1 rounded-full bg-[#F5F5F0] text-[#5A5A50] border border-[#E0E0D0]">
              {topic.totalQuestions} Soalan
            </span>
          ) : (
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FDF5F2] text-[#8E472D] border border-[#EBD0C6] flex items-center gap-1">
                <Lock className="w-2.5 h-2.5" /> Akses Terhad
              </span>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#F5F5F0] text-[#5A5A50] border border-[#E0E0D0]">
                {topic.totalQuestions} Soalan
              </span>
            </div>
          )}
        </div>

        {/* Short Topic Description */}
        <p className="text-xs sm:text-sm text-[#7A7A6A] mb-4 line-clamp-2 leading-relaxed">
          {topic.description}
        </p>

        {/* Subtopic Chips */}
        <div className="mb-5">
          <div className="text-[11px] font-semibold text-[#8A8A7A] uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#D98C70]" />
            <span>Kandungan Sukatan:</span>
          </div>
          <ul className="space-y-1 text-xs text-[#6A6A5E]">
            {topic.subtopics.slice(0, 3).map((sub, idx) => (
              <li key={idx} className="flex items-start gap-2 line-clamp-1">
                <span className="text-[#A3AD94] font-bold">•</span>
                <span className="truncate">{sub}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Progress Bar & Mastery Stats */}
        <div className="bg-[#F5F5F0] rounded-2xl p-3.5 border border-[#E8E8E0] mb-2">
          <div className="flex items-center justify-between text-xs font-semibold text-[#5A5A50] mb-2">
            <span className="flex items-center gap-1.5">
              <CheckCircle className={`w-3.5 h-3.5 ${percentage >= 80 ? 'text-[#6A8A6A]' : 'text-[#A0A090]'}`} />
              Penguasaan Topik
            </span>
            <span className="font-mono text-[#4A4A40] font-bold">
              {correctCount}/{topic.totalQuestions} ({percentage}%)
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-[#E0E0D0] overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${
                percentage >= 80 ? 'bg-[#A3AD94]' : percentage >= 40 ? 'bg-[#C7795C]' : percentage > 0 ? 'bg-[#D98C70]' : 'bg-transparent'
              }`}
              style={{ width: `${percentage}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] text-[#7A7A6A] mt-2 font-medium">
            <span>Pernah cuba: {attemptedCount} soalan</span>
            <span>Baki: {topic.totalQuestions - correctCount} soalan</span>
          </div>
        </div>
      </div>

      {/* Action Buttons Footer */}
      <div className="p-4 sm:p-5 bg-[#FAF9F5] border-t border-[#E8E8E0] flex items-center gap-2.5">
        <button
          id={`btn-practice-topic-${topic.id}`}
          onClick={() => onStartQuiz(topic.id, 'practice')}
          className={`flex-1 inline-flex items-center justify-center gap-1.5 py-3 px-4 rounded-2xl text-xs sm:text-sm font-semibold transition-colors shadow-xs ${
            isVerified
              ? 'bg-[#A3AD94] hover:bg-[#8F9A7F] text-white'
              : 'bg-[#5A5A50] hover:bg-[#4A4A40] text-white'
          }`}
        >
          {isVerified ? <Play className="w-4 h-4 fill-white" /> : <Lock className="w-4 h-4" />}
          <span>{isVerified ? 'Ulangkaji & Semak' : 'Buka Soalan (No. Matrik)'}</span>
        </button>

        <button
          id={`btn-timed-topic-${topic.id}`}
          onClick={() => onStartQuiz(topic.id, 'timed')}
          className="inline-flex items-center justify-center gap-1.5 py-3 px-4 rounded-2xl bg-[#FBF1EC] hover:bg-[#F5E2DA] text-[#A35C42] text-xs sm:text-sm font-semibold transition-colors border border-[#EBD0C6]"
          title="Ujian Pantas untuk topik ini"
        >
          <Clock className="w-4 h-4 text-[#D98C70]" />
          <span className="hidden sm:inline">Ujian Pantas</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
