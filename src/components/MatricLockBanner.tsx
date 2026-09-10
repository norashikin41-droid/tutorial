import React from 'react';
import { ShieldCheck, ShieldAlert, KeyRound, UserCheck, Lock, ChevronRight } from 'lucide-react';
import { MatricAuthSession } from '../types';

interface MatricLockBannerProps {
  session: MatricAuthSession;
  onOpenAuthModal: () => void;
}

export const MatricLockBanner: React.FC<MatricLockBannerProps> = ({
  session,
  onOpenAuthModal,
}) => {
  if (session.isVerified && session.matricNumber) {
    return (
      <div className="mb-6 p-4 rounded-2xl bg-[#EBF0E6] border border-[#C8D6C4] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs shadow-xs">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-[#495E3F] text-white flex items-center justify-center shrink-0 shadow-xs">
            <ShieldCheck className="w-5 h-5 text-[#D5E2D0]" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-[#33422C]">Akses Penuh Dibenarkan</span>
              <span className="px-2 py-0.5 rounded-full bg-[#33422C] text-white text-[10px] font-mono font-bold">
                {session.matricNumber}
              </span>
            </div>
            <p className="text-[11px] text-[#55694D] mt-0.5">
              Pelatih: <strong>{session.studentName}</strong> • {session.programme || 'ILKKM Sungai Buloh'}
            </p>
          </div>
        </div>

        <button
          onClick={onOpenAuthModal}
          className="self-end sm:self-auto px-3.5 py-1.5 rounded-xl bg-white border border-[#C8D6C4] hover:bg-[#FAF9F5] text-[#33422C] font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <UserCheck className="w-3.5 h-3.5 text-[#495E3F]" />
          <span>Status Matrik</span>
        </button>
      </div>
    );
  }

  return (
    <div className="mb-6 p-4 sm:p-5 rounded-2xl bg-[#FDF5F2] border-2 border-[#EBD0C6] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs shadow-xs animate-in fade-in">
      <div className="flex items-start sm:items-center space-x-3.5">
        <div className="w-10 h-10 rounded-2xl bg-[#D98C70] text-white flex items-center justify-center shrink-0 shadow-xs">
          <Lock className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <span className="font-bold text-[#8E472D] text-sm">Akses Soalan Dihadkan</span>
            <span className="px-2 py-0.5 rounded-full bg-[#EBD0C6] text-[#8E472D] text-[10px] font-bold">
              Pelatih ILKKM Sungai Buloh Sahaja
            </span>
          </div>
          <p className="text-xs text-[#7A554A] mt-1 leading-relaxed">
            Bank soalan dan ujian pantas GCMT 2052 dikunci untuk mengelakkan penggunaan luar. Senarai nombor matrik dikawal selia dan dimasukkan terus oleh Pensyarah/Owner kursus. Sila sahkan nombor matrik anda untuk membuka akses soalan.
          </p>
        </div>
      </div>

      <button
        onClick={onOpenAuthModal}
        className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#D98C70] hover:bg-[#C7795C] text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-xs shrink-0 cursor-pointer"
      >
        <KeyRound className="w-4 h-4" />
        <span>Sahkan No. Matrik</span>
        <ChevronRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
