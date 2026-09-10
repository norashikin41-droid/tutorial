import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Flame, 
  Calendar, 
  Award, 
  BookOpen, 
  RotateCcw, 
  ArrowRight,
  AlertTriangle,
  Sparkles,
  GraduationCap,
  Download,
  FileCheck
} from 'lucide-react';
import { QuizAttempt, UserProfile } from '../types';
import { allTopics, topicQuestionMap } from '../data/topics';

interface PerformanceDashboardProps {
  userProfile: UserProfile;
  attempts: QuizAttempt[];
  onStartTopicQuiz: (topicId: number, mode: 'practice' | 'timed') => void;
  onResetProgress: () => void;
  onOpenCertificate: (unitId?: number) => void;
}

export const PerformanceDashboard: React.FC<PerformanceDashboardProps> = ({
  userProfile,
  attempts,
  onStartTopicQuiz,
  onResetProgress,
  onOpenCertificate,
}) => {
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Compute topic stats
  const topicStats = allTopics.map((topic) => {
    const questions = topicQuestionMap[topic.id] || [];
    const questionIds = questions.map((q) => q.id);
    
    const correctCount = questionIds.filter((id) => 
      userProfile.correctQuestions.includes(id)
    ).length;

    const completedCount = questionIds.filter((id) => 
      userProfile.completedQuestions.includes(id)
    ).length;

    const wrongCount = questionIds.filter((id) => 
      userProfile.wrongQuestions.includes(id)
    ).length;

    const masteryPct = questions.length > 0 
      ? Math.round((correctCount / questions.length) * 100) 
      : 0;

    // Filter attempts for this topic
    const topicAttempts = attempts.filter((a) => a.topicId === topic.id);
    const avgScore = topicAttempts.length > 0
      ? Math.round(topicAttempts.reduce((sum, a) => sum + a.score, 0) / topicAttempts.length)
      : null;

    return {
      topic,
      total: questions.length,
      correctCount,
      completedCount,
      wrongCount,
      masteryPct,
      attemptsCount: topicAttempts.length,
      avgScore,
    };
  });

  // Calculate overall metrics
  const totalQuestions = 154;
  const overallMastery = Math.round((userProfile.correctQuestions.length / totalQuestions) * 100);
  const totalAttempted = userProfile.completedQuestions.length;
  
  // Identify weakest and strongest topics
  const attemptedTopicStats = topicStats.filter((t) => t.completedCount > 0);
  const weakestTopics = [...topicStats]
    .sort((a, b) => a.masteryPct - b.masteryPct)
    .slice(0, 3);
  const strongestTopics = [...attemptedTopicStats]
    .sort((a, b) => b.masteryPct - a.masteryPct)
    .slice(0, 3);

  const formatDate = (isoString: string) => {
    const d = new Date(isoString);
    return `${d.toLocaleDateString('ms-MY', { day: 'numeric', month: 'short' })}, ${d.toLocaleTimeString('ms-MY', { hour: '2-digit', minute: '2-digit' })}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-300">
      
      {/* Top Banner / Summary */}
      <div className="bg-[#4A4A40] text-[#FAF9F5] rounded-[32px] p-6 sm:p-10 shadow-md mb-8 relative overflow-hidden border border-[#3E3E36]">
        <div className="relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span className="text-xs font-bold uppercase tracking-wider px-3 py-0.5 rounded-full bg-[#A3AD94]/30 text-[#D8E2CD] border border-[#A3AD94]/40">
                  Laporan Kemajuan Peribadi
                </span>
                <span className="text-xs text-[#C8C8B8]">GCMT 2052</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-white/10 text-[#E0E0D0] border border-white/15">
                  ILKKM Sungai Buloh
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                Analisis Prestasi: {userProfile.name}
              </h2>
              <p className="text-xs text-[#C8C8B8] mt-1">
                No. Matrik: <span className="font-mono font-semibold text-white">{userProfile.matricNumber || 'Belum disahkan'}</span> • {userProfile.institution || 'Institut Latihan Kementerian Kesihatan Malaysia Sungai Buloh'}
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 px-4 py-2 rounded-2xl bg-[#5A5A50]/60 backdrop-blur-xs border border-white/10">
                <Flame className="w-5 h-5 text-[#D98C70] fill-[#D98C70]" />
                <div>
                  <span className="text-[10px] text-[#C8C8B8] block uppercase font-semibold">Streak</span>
                  <span className="text-sm font-bold text-white">{userProfile.streakDays || 1} Hari</span>
                </div>
              </div>

              <div className="flex items-center space-x-2 px-4 py-2 rounded-2xl bg-[#5A5A50]/60 backdrop-blur-xs border border-white/10">
                <Award className="w-5 h-5 text-[#A3AD94]" />
                <div>
                  <span className="text-[10px] text-[#C8C8B8] block uppercase font-semibold">Sasaran</span>
                  <span className="text-sm font-bold text-white">{userProfile.targetScore}% (Gred A)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 sm:p-5 rounded-2xl bg-[#5A5A50]/50 backdrop-blur-xs border border-white/10">
              <span className="text-xs text-[#D8E2CD] block mb-1">Penguasaan Keseluruhan</span>
              <span className="text-2xl sm:text-3xl font-extrabold text-white">
                {overallMastery}%
              </span>
              <span className="text-[11px] text-[#C8C8B8] block mt-1">
                {userProfile.correctQuestions.length} daripada 154 soalan
              </span>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-[#5A5A50]/50 backdrop-blur-xs border border-white/10">
              <span className="text-xs text-[#D8E2CD] block mb-1">Soalan Betul</span>
              <span className="text-2xl sm:text-3xl font-extrabold text-[#D8E2CD] flex items-center gap-1.5">
                <CheckCircle2 className="w-6 h-6 text-[#A3AD94]" />
                {userProfile.correctQuestions.length}
              </span>
              <span className="text-[11px] text-[#C8C8B8] block mt-1">
                Ketepatan: {totalAttempted > 0 ? Math.round((userProfile.correctQuestions.length / totalAttempted) * 100) : 0}%
              </span>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-[#5A5A50]/50 backdrop-blur-xs border border-white/10">
              <span className="text-xs text-[#F2C5B8] block mb-1">Perlu Pembaikan</span>
              <span className="text-2xl sm:text-3xl font-extrabold text-[#F2C5B8] flex items-center gap-1.5">
                <XCircle className="w-6 h-6 text-[#D98C70]" />
                {userProfile.wrongQuestions.length}
              </span>
              <span className="text-[11px] text-[#C8C8B8] block mt-1">Soalan pernah salah</span>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-[#5A5A50]/50 backdrop-blur-xs border border-white/10">
              <span className="text-xs text-[#E8D8B8] block mb-1">Jumlah Sesi Ujian</span>
              <span className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-1.5">
                <Clock className="w-6 h-6 text-[#D98C70]" />
                {attempts.length}
              </span>
              <span className="text-[11px] text-[#C8C8B8] block mt-1">Rekod sesi tersimpan</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations & Action Plan */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        
        {/* Focus Areas (Weakest Topics) */}
        <div className="bg-white rounded-[28px] border border-[#E0E0D0] p-6 sm:p-7 shadow-xs">
          <div className="flex items-center space-x-2 mb-3">
            <AlertTriangle className="w-5 h-5 text-[#D98C70]" />
            <h3 className="text-base font-bold text-[#4A4A40]">
              Fokus Utama Disyorkan (Topik Perlu Diperkukuh)
            </h3>
          </div>
          <p className="text-xs text-[#7A7A6A] mb-4">
            Topik dengan peratusan penguasaan paling rendah yang memerlukan ulangkaji segera sebelum peperiksaan:
          </p>

          <div className="space-y-3">
            {weakestTopics.map(({ topic, masteryPct, total, correctCount }) => (
              <div 
                key={topic.id}
                className="p-4 rounded-2xl border border-[#E0E0D0] bg-[#FAF9F5] hover:bg-[#F5F5F0] transition-colors flex items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-[#A3AD94] font-mono">{topic.code}</span>
                    <h4 className="text-sm font-bold text-[#4A4A40] line-clamp-1">{topic.title}</h4>
                  </div>
                  <span className="text-xs text-[#7A7A6A]">
                    Penguasaan: {correctCount}/{total} ({masteryPct}%)
                  </span>
                </div>

                <button
                  onClick={() => onStartTopicQuiz(topic.id, 'practice')}
                  className="px-3.5 py-2 rounded-xl bg-[#A3AD94] hover:bg-[#8F9A7F] text-white text-xs font-semibold shrink-0 transition-colors flex items-center gap-1 shadow-xs"
                >
                  <span>Ulangkaji</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Strongest Mastery Areas */}
        <div className="bg-white rounded-[28px] border border-[#E0E0D0] p-6 sm:p-7 shadow-xs">
          <div className="flex items-center space-x-2 mb-3">
            <Sparkles className="w-5 h-5 text-[#A3AD94]" />
            <h3 className="text-base font-bold text-[#4A4A40]">
              Kekuatan Penguasaan (Topik Cemerlang)
            </h3>
          </div>
          <p className="text-xs text-[#7A7A6A] mb-4">
            Topik yang telah anda kuasai dengan baik. Teruskan dengan Cabaran Masa untuk meningkatkan kepantasan!
          </p>

          <div className="space-y-3">
            {strongestTopics.length > 0 ? (
              strongestTopics.map(({ topic, masteryPct, total, correctCount }) => (
                <div 
                  key={topic.id}
                  className="p-4 rounded-2xl border border-[#C8D6C4] bg-[#E8F2E8]/40 flex items-center justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-[#495E3F] font-mono">{topic.code}</span>
                      <h4 className="text-sm font-bold text-[#4A4A40] line-clamp-1">{topic.title}</h4>
                    </div>
                    <span className="text-xs text-[#495E3F] font-medium">
                      Penguasaan: {correctCount}/{total} ({masteryPct}%)
                    </span>
                  </div>

                  <button
                    onClick={() => onStartTopicQuiz(topic.id, 'timed')}
                    className="px-3.5 py-2 rounded-xl bg-[#D98C70] hover:bg-[#C7795C] text-white text-xs font-semibold shrink-0 transition-colors flex items-center gap-1 shadow-xs"
                  >
                    <span>Uji Masa ⚡</span>
                  </button>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-xs text-[#7A7A6A] border border-dashed border-[#D9D9D0] rounded-2xl">
                Belum ada data latihan mencukupi. Mulakan latihan pada mana-mana topik untuk membina rekod penguasaan anda.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Topic-by-Topic Breakdown Table */}
      <div className="bg-white rounded-[28px] border border-[#E0E0D0] shadow-xs overflow-hidden mb-8">
        <div className="px-6 py-5 border-b border-[#E0E0D0] flex items-center justify-between bg-[#FAF9F5]">
          <div>
            <h3 className="text-base font-bold text-[#4A4A40]">
              Analisis Terperinci Mengikut Setiap Topik
            </h3>
            <p className="text-xs text-[#7A7A6A]">
              Perincian 10 topik sukatan matematik GCMT 2052
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-[#F5F5F0] text-[#5A5A50] font-semibold border-b border-[#E0E0D0]">
              <tr>
                <th className="py-3.5 px-5">Topik</th>
                <th className="py-3.5 px-4">Jumlah Soalan</th>
                <th className="py-3.5 px-4">Status Penguasaan</th>
                <th className="py-3.5 px-4">Purata Markah</th>
                <th className="py-3.5 px-5 text-right">Tindakan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E8E0]">
              {topicStats.map(({ topic, total, correctCount, masteryPct, avgScore }) => (
                <tr key={topic.id} className="hover:bg-[#FAF9F5] transition-colors">
                  <td className="py-4 px-5">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xs font-bold text-[#A3AD94]">{topic.code}</span>
                      <span className="font-semibold text-[#4A4A40]">{topic.title}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-[#7A7A6A] font-medium">
                    {total} Soalan
                  </td>
                  <td className="py-4 px-4">
                    <div className="w-36">
                      <div className="flex justify-between text-xs mb-1 font-semibold text-[#5A5A50]">
                        <span>{correctCount}/{total}</span>
                        <span>{masteryPct}%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-[#E0E0D0] overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${
                            masteryPct >= 80 ? 'bg-[#A3AD94]' : masteryPct >= 40 ? 'bg-[#C7795C]' : masteryPct > 0 ? 'bg-[#D98C70]' : 'bg-transparent'
                          }`}
                          style={{ width: `${masteryPct}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    {avgScore !== null ? (
                      <span className={`font-bold ${avgScore >= 80 ? 'text-[#495E3F]' : avgScore >= 50 ? 'text-[#5A5A50]' : 'text-[#8E472D]'}`}>
                        {avgScore}%
                      </span>
                    ) : (
                      <span className="text-[#9A9A8A] text-xs">Belum Dicuba</span>
                    )}
                  </td>
                  <td className="py-4 px-5 text-right">
                    <div className="inline-flex items-center gap-1.5">
                      <button
                        onClick={() => onOpenCertificate(topic.id)}
                        className="p-1.5 px-2.5 rounded-xl bg-[#E8F0E8] hover:bg-[#DCE7D6] text-[#3D4A35] font-bold text-xs transition-colors border border-[#C8D6C4] flex items-center gap-1 shadow-xs"
                        title="Jana Sijil Unit Ini"
                      >
                        <Award className="w-3.5 h-3.5 text-[#495E3F]" />
                        <span>Sijil</span>
                      </button>
                      <button
                        onClick={() => onStartTopicQuiz(topic.id, 'practice')}
                        className="p-1.5 px-3 rounded-xl bg-[#F5F5F0] hover:bg-[#E8E8E0] text-[#5A5A50] font-semibold text-xs transition-colors border border-[#E0E0D0]"
                      >
                        Latihan
                      </button>
                      <button
                        onClick={() => onStartTopicQuiz(topic.id, 'timed')}
                        className="p-1.5 px-3 rounded-xl bg-[#FBF1EC] hover:bg-[#F5E2DA] text-[#A35C42] font-semibold text-xs transition-colors border border-[#EBD0C6]"
                      >
                        ⚡ Masa
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Trainee Certificate Gallery Section */}
      <div className="bg-white rounded-[28px] border border-[#E0E0D0] shadow-xs p-6 sm:p-8 mb-8">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#E0E0D0] mb-6">
          <div>
            <div className="flex items-center space-x-2">
              <span className="p-1.5 rounded-xl bg-[#E8F0E8] text-[#495E3F]">
                <GraduationCap className="w-5 h-5" />
              </span>
              <h3 className="text-base sm:text-lg font-extrabold text-[#4A4A40]">
                Galeri Sijil Pencapaian Unit (Unit 1 - Unit 10)
              </h3>
            </div>
            <p className="text-xs text-[#7A7A6A] mt-1">
              Pelatih: <strong className="text-[#4A4A40]">{userProfile.name}</strong> • No. Matrik: <strong className="font-mono text-[#4A4A40]">{userProfile.matricNumber || 'GCMT/2026/001'}</strong>
            </p>
          </div>

          <button
            id="btn-open-any-certificate"
            onClick={() => onOpenCertificate(1)}
            className="px-5 py-2.5 rounded-2xl bg-[#495E3F] hover:bg-[#3D4F34] text-white text-xs font-bold flex items-center gap-2 shadow-xs transition-all"
          >
            <Award className="w-4 h-4" />
            <span>Buka Hab Sijil Penuh</span>
          </button>
        </div>

        {/* 10 Units Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {topicStats.map(({ topic, total, correctCount, masteryPct, avgScore }) => {
            const hasScore = avgScore !== null || correctCount > 0;
            const scoreToDisplay = avgScore !== null ? avgScore : masteryPct;
            return (
              <div 
                key={topic.id}
                className="p-5 rounded-2xl border border-[#E0E0D0] bg-[#FAF9F5] hover:bg-[#F5F5F0] transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-mono font-bold text-[#A3AD94] bg-white px-2.5 py-0.5 rounded-md border border-[#E0E0D0]">
                      {topic.code}
                    </span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      hasScore ? 'bg-[#E8F0E8] text-[#495E3F]' : 'bg-[#F5F5F0] text-[#8A8A7A]'
                    }`}>
                      {hasScore ? `Markah: ${scoreToDisplay}%` : 'Belum Dicuba'}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-[#4A4A40] mb-2 line-clamp-1">
                    {topic.title}
                  </h4>

                  <div className="text-xs text-[#7A7A6A] space-y-1 mb-4">
                    <div className="flex justify-between">
                      <span>Soalan Betul:</span>
                      <span className="font-semibold text-[#5A5A50]">{correctCount} / {total}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Status:</span>
                      <span className="font-semibold text-[#495E3F]">
                        {scoreToDisplay >= 50 ? 'Layak Sijil ✓' : 'Sijil Penyertaan'}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onOpenCertificate(topic.id)}
                  className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-[#FAF9F5] border border-[#D0D0C0] text-[#3D4A35] font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors"
                >
                  <Award className="w-4 h-4 text-[#A3AD94]" />
                  <span>Jana & Muat Turun Sijil</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Quiz Attempts Log */}
      <div className="bg-white rounded-[28px] border border-[#E0E0D0] shadow-xs p-6 sm:p-7 mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-[#4A4A40]">Rekod Sejarah Sesi Ujian</h3>
            <p className="text-xs text-[#7A7A6A]">Rekod percubaan dan keputusan latihan anda</p>
          </div>
          {attempts.length > 0 && (
            <span className="text-xs text-[#8A8A7A]">
              {attempts.length} rekod tersimpan
            </span>
          )}
        </div>

        {attempts.length > 0 ? (
          <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
            {attempts.slice(0, 15).map((att) => (
              <div 
                key={att.id}
                className="p-4 rounded-2xl border border-[#E0E0D0] bg-[#FAF9F5] flex flex-wrap items-center justify-between gap-3 hover:bg-[#F5F5F0] transition-colors"
              >
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                      att.mode === 'timed' ? 'bg-[#FBF1EC] text-[#8E472D] border border-[#EBD0C6]' : 'bg-[#E8F0E8] text-[#495E3F] border border-[#C8D6C4]'
                    }`}>
                      {att.mode === 'timed' ? '⚡ Cabaran Masa' : '📝 Latihan'}
                    </span>
                    <h4 className="text-sm font-bold text-[#4A4A40]">{att.topicTitle}</h4>
                  </div>
                  <span className="text-xs text-[#7A7A6A] flex items-center gap-2">
                    <span><Calendar className="w-3 h-3 inline mr-1 text-[#8A8A7A]" />{formatDate(att.date)}</span>
                    <span>•</span>
                    <span><Clock className="w-3 h-3 inline mr-1 text-[#8A8A7A]" />{Math.floor(att.timeSpentSeconds / 60)}m {att.timeSpentSeconds % 60}s</span>
                  </span>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <span className="text-xs text-[#7A7A6A] block">Betul: {att.correctCount}/{att.totalQuestions}</span>
                    <span className={`text-base font-extrabold ${att.score >= 80 ? 'text-[#495E3F]' : att.score >= 50 ? 'text-[#5A5A50]' : 'text-[#8E472D]'}`}>
                      {att.score}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-[#7A7A6A] text-xs border border-dashed border-[#D9D9D0] rounded-2xl">
            Belum ada rekod ujian. Selesaikan kuiz pertama anda untuk melihat sejarah di sini!
          </div>
        )}
      </div>

      {/* Reset Progress Section */}
      <div className="p-5 rounded-2xl bg-[#FBF1EC] border border-[#EBD0C6] flex flex-wrap items-center justify-between gap-3">
        <div>
          <h4 className="text-xs font-bold text-[#8E472D]">Tetapan Semula Rekod Kemajuan</h4>
          <p className="text-xs text-[#A35C42]">Padam semua rekod jawapan dan sejarah ujian untuk bermula dari awal.</p>
        </div>

        {showResetConfirm ? (
          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                onResetProgress();
                setShowResetConfirm(false);
              }}
              className="px-4 py-2 rounded-xl bg-[#D98C70] hover:bg-[#C7795C] text-white text-xs font-bold transition-colors shadow-xs"
            >
              Ya, Padam Semua
            </button>
            <button
              onClick={() => setShowResetConfirm(false)}
              className="px-4 py-2 rounded-xl bg-white hover:bg-[#FAF9F5] text-[#5A5A50] border border-[#E0E0D0] text-xs font-semibold transition-colors"
            >
              Batal
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowResetConfirm(true)}
            className="px-4 py-2.5 rounded-2xl bg-white hover:bg-[#FAF9F5] text-[#8E472D] border border-[#EBD0C6] text-xs font-semibold transition-colors shadow-xs"
          >
            Padam & Ulang Semula Rekod
          </button>
        )}
      </div>
    </div>
  );
};
