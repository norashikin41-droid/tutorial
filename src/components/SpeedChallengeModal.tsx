import React, { useState } from 'react';
import { Clock, Zap, Target, BookOpen, Play, CheckCircle2, Calculator, Sparkles, Lock } from 'lucide-react';
import { allTopics, allQuestions, topicQuestionMap } from '../data/topics';
import { Question } from '../types';

interface SpeedChallengeModalProps {
  onStartChallenge: (selectedQuestions: Question[], title: string, durationMinutes: number) => void;
  isVerified?: boolean;
}

export const SpeedChallengeModal: React.FC<SpeedChallengeModalProps> = ({ 
  onStartChallenge,
  isVerified = true 
}) => {
  const [selectedTopicIds, setSelectedTopicIds] = useState<number[]>([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  const [questionCount, setQuestionCount] = useState<number>(15);
  const [isCustomCount, setIsCustomCount] = useState<boolean>(false);
  const [customInputCount, setCustomInputCount] = useState<string>('15');

  // Kiraan masa: bilangan soalan darab 1.5 minit
  const calculatedDurationMinutes = questionCount * 1.5;
  const totalSeconds = Math.round(calculatedDurationMinutes * 60);
  const displayMins = Math.floor(totalSeconds / 60);
  const displaySecs = totalSeconds % 60;

  const toggleTopic = (id: number) => {
    if (selectedTopicIds.includes(id)) {
      if (selectedTopicIds.length > 1) {
        setSelectedTopicIds(selectedTopicIds.filter((t) => t !== id));
      }
    } else {
      setSelectedTopicIds([...selectedTopicIds, id]);
    }
  };

  const selectAllTopics = () => {
    setSelectedTopicIds([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  };

  const handleSelectCount = (count: number) => {
    setIsCustomCount(false);
    setQuestionCount(count);
  };

  const handleCustomCountChange = (val: string) => {
    setCustomInputCount(val);
    const num = parseInt(val, 10);
    if (!isNaN(num) && num > 0) {
      setQuestionCount(Math.min(num, 154));
    }
  };

  const handleStart = () => {
    // Gather candidate questions from chosen topics
    let pool: Question[] = [];
    selectedTopicIds.forEach((tId) => {
      const qList = topicQuestionMap[tId] || [];
      pool = [...pool, ...qList];
    });

    // Shuffle pool
    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    const finalCount = Math.min(questionCount, shuffled.length);
    const selected = shuffled.slice(0, finalCount);

    const title = selectedTopicIds.length === 10 
      ? 'Ujian Pantas Menyeluruh (Semua Unit)'
      : `Ujian Pantas (${selectedTopicIds.length} Unit Dipilih)`;

    // Duration based strictly on count * 1.5 minutes
    const finalDurationMinutes = finalCount * 1.5;

    onStartChallenge(selected, title, finalDurationMinutes);
  };

  const presetCounts = [
    { count: 10, label: '15 Minit' },
    { count: 15, label: '22.5 Minit' },
    { count: 20, label: '30 Minit' },
    { count: 25, label: '37.5 Minit' },
    { count: 30, label: '45 Minit' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-300">
      <div className="bg-white rounded-[32px] border border-[#E0E0D0] shadow-xs p-6 sm:p-10">
        
        {/* Banner Header */}
        <div className="flex items-center space-x-3.5 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-[#D98C70] text-white flex items-center justify-center shadow-xs">
            <Zap className="w-6 h-6 fill-white" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#A35C42] font-mono">
              Simulasi Ujian Pantas • 1.5 Minit / Soalan
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#4A4A40]">
              Ujian Pantas GCMT 2052 ⚡
            </h2>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-[#7A7A6A] mb-8 leading-relaxed">
          Masa menjawab dikira secara automatik mengikut formula rasmi: <strong>Bilangan Soalan × 1.5 Minit</strong> (90 saat bagi setiap 1 soalan).
        </p>

        {/* Step 1: Number of Questions & Auto Calculated Time */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <label className="text-xs font-bold text-[#5A5A50] uppercase tracking-wider flex items-center gap-1.5">
              <Target className="w-4 h-4 text-[#A3AD94]" />
              <span>1. Pilih Bilangan Soalan:</span>
            </label>
            <span className="text-xs text-[#7A7A6A] font-semibold">
              Kadar: 1.5 minit setiap soalan
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-4">
            {presetCounts.map(({ count, label }) => {
              const isSelected = !isCustomCount && questionCount === count;
              const mins = count * 1.5;
              return (
                <button
                  key={count}
                  onClick={() => handleSelectCount(count)}
                  className={`p-4 rounded-2xl border text-center transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#D98C70] border-[#D98C70] text-white font-bold shadow-xs'
                      : 'bg-[#FAF9F5] border-[#E0E0D0] text-[#5A5A50] hover:bg-[#F5F5F0] font-medium'
                  }`}
                >
                  <span className="text-lg font-bold block">{count} Soalan</span>
                  <span className={`text-xs block mt-0.5 ${isSelected ? 'text-white/90 font-semibold' : 'text-[#7A7A6A]'}`}>
                    ⏱️ {mins} Min ({count} × 1.5m)
                  </span>
                </button>
              );
            })}
          </div>

          {/* Custom Count Option */}
          <div className="flex flex-wrap items-center gap-3 p-3.5 rounded-2xl bg-[#FAF9F5] border border-[#E8E8E0]">
            <span className="text-xs font-bold text-[#5A5A50]">Atau tetapkan bilangan soalan tersuai:</span>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                max="154"
                value={isCustomCount ? customInputCount : questionCount}
                onFocus={() => setIsCustomCount(true)}
                onChange={(e) => {
                  setIsCustomCount(true);
                  handleCustomCountChange(e.target.value);
                }}
                className="w-20 px-3 py-1.5 rounded-xl border border-[#D0D0C0] bg-white text-xs font-bold text-center focus:outline-none focus:ring-2 focus:ring-[#D98C70]"
              />
              <span className="text-xs text-[#7A7A6A] font-medium">soalan</span>
            </div>
          </div>
        </div>

        {/* Live Calculation Banner */}
        <div className="mb-8 p-4 sm:p-5 rounded-2xl bg-[#FBF1EC] border-2 border-[#EBD0C6] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#D98C70] text-white flex items-center justify-center shrink-0 shadow-xs">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#A35C42] block">
                Kiraan Masa Menjawab Ditetapkan:
              </span>
              <div className="text-base sm:text-lg font-extrabold text-[#5A2C1D] font-mono">
                {questionCount} Soalan × 1.5 Minit = {calculatedDurationMinutes} Minit
                {displaySecs > 0 ? ` (${displayMins} min ${displaySecs} saat)` : ` (${displayMins} minit)`}
              </div>
            </div>
          </div>

          <div className="text-xs font-medium text-[#8E472D] bg-white/70 px-3.5 py-2 rounded-xl border border-[#EBD0C6] shrink-0">
            ⚡ <strong>90 saat</strong> bagi setiap soalan
          </div>
        </div>

        {/* Step 2: Topics Selection */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <label className="text-xs font-bold text-[#5A5A50] uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-[#A3AD94]" />
              <span>2. Pilih Unit Soalan ({selectedTopicIds.length}/10 Dipilih):</span>
            </label>
            <button
              onClick={selectAllTopics}
              className="text-xs font-semibold text-[#A3AD94] hover:text-[#8F9A7F] hover:underline cursor-pointer"
            >
              Pilih Semua 10 Unit
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-64 overflow-y-auto pr-1">
            {allTopics.map((topic) => {
              const isSelected = selectedTopicIds.includes(topic.id);

              return (
                <button
                  key={topic.id}
                  onClick={() => toggleTopic(topic.id)}
                  className={`p-3.5 rounded-2xl border text-left flex items-center justify-between gap-2 transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#E8F0E8] border-[#C8D6C4] text-[#34452C] font-semibold'
                      : 'bg-[#FAF9F5] border-[#E0E0D0] text-[#5A5A50] hover:bg-[#F5F5F0]'
                  }`}
                >
                  <div className="flex items-center space-x-2.5 truncate">
                    <span className="text-xs font-mono font-bold text-[#A3AD94] shrink-0">
                      {topic.code}
                    </span>
                    <span className="text-xs sm:text-sm truncate">{topic.title}</span>
                  </div>
                  <CheckCircle2
                    className={`w-4 h-4 shrink-0 ${isSelected ? 'text-[#495E3F]' : 'text-[#C8C8B8]'}`}
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* Launch Button */}
        <div className="pt-5 border-t border-[#E0E0D0] flex flex-wrap items-center justify-between gap-4">
          <div className="text-xs text-[#7A7A6A]">
            Jumlah Masa: <strong>{calculatedDurationMinutes} minit</strong> untuk <strong>{questionCount} soalan</strong>
          </div>

          <button
            id="btn-start-speed-challenge"
            onClick={handleStart}
            className={`flex items-center space-x-2 px-8 py-3.5 rounded-2xl text-white font-bold text-sm sm:text-base transition-all shadow-xs cursor-pointer ${
              isVerified
                ? 'bg-[#D98C70] hover:bg-[#C7795C]'
                : 'bg-[#5A5A50] hover:bg-[#4A4A40]'
            }`}
          >
            {isVerified ? <Play className="w-5 h-5 fill-white" /> : <Lock className="w-5 h-5" />}
            <span>
              {isVerified
                ? `Mula Ujian Pantas (${calculatedDurationMinutes} Min)`
                : `Buka Ujian Pantas (Perlu No. Matrik)`}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
