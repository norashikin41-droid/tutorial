import React, { useState } from 'react';
import { X, RotateCcw, Equal, Delete } from 'lucide-react';

interface ScratchpadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ScratchpadModal: React.FC<ScratchpadModalProps> = ({ isOpen, onClose }) => {
  const [calcInput, setCalcInput] = useState('');
  const [calcResult, setCalcResult] = useState('');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleBtnClick = (val: string) => {
    setCalcInput((prev) => prev + val);
  };

  const handleClear = () => {
    setCalcInput('');
    setCalcResult('');
  };

  const handleDelete = () => {
    setCalcInput((prev) => prev.slice(0, -1));
  };

  const handleCalculate = () => {
    try {
      // Safe math evaluation using Function
      let expr = calcInput
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/π/g, 'Math.PI')
        .replace(/√\(([^)]+)\)/g, 'Math.sqrt($1)')
        .replace(/\^/g, '**');

      // Basic sanitizer: allow digits, Math operations, basic operators, decimals, parentheses
      if (/^[0-9+\-*/().\sMathPIsqrt**]+$/.test(expr)) {
        // eslint-disable-next-line no-new-func
        const res = Function(`"use strict"; return (${expr})`)();
        if (typeof res === 'number' && !isNaN(res)) {
          setCalcResult(Number(res.toFixed(6)).toString());
        } else {
          setCalcResult('Ralat');
        }
      } else {
        setCalcResult('Format Tidak Sah');
      }
    } catch (e) {
      setCalcResult('Ralat Sintaks');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#4A4A40]/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-[32px] shadow-xl border border-[#E0E0D0] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4.5 border-b border-[#E0E0D0] flex items-center justify-between bg-[#FAF9F5]">
          <div>
            <h3 className="text-base font-bold text-[#4A4A40]">Kalkulator Ringkas & Kertas Draf</h3>
            <p className="text-xs text-[#7A7A6A]">Alat bantuan mengira cepat dan catat jalan kerja</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#8A8A7A] hover:text-[#4A4A40] hover:bg-[#F5F5F0] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 overflow-y-auto">
          {/* Calculator Section */}
          <div className="bg-[#4A4A40] p-4.5 rounded-[24px] text-white shadow-inner flex flex-col justify-between border border-[#3E3E36]">
            <div>
              <div className="text-right text-xs text-[#C8C8B8] font-mono min-h-[1.2rem] overflow-x-auto">
                {calcInput || '0'}
              </div>
              <div className="text-right text-2xl font-bold font-mono text-[#D8E2CD] min-h-[2rem] overflow-x-auto border-b border-[#5A5A50] pb-2 mb-3">
                {calcResult !== '' ? `= ${calcResult}` : ''}
              </div>
            </div>

            {/* Buttons Grid */}
            <div className="grid grid-cols-4 gap-2 text-xs font-semibold font-mono">
              <button onClick={handleClear} className="p-2.5 rounded-xl bg-[#D98C70] hover:bg-[#C7795C] text-white">AC</button>
              <button onClick={handleDelete} className="p-2.5 rounded-xl bg-[#5A5A50] hover:bg-[#68685C] text-white flex items-center justify-center"><Delete className="w-4 h-4" /></button>
              <button onClick={() => handleBtnClick('(')} className="p-2.5 rounded-xl bg-[#3E3E36] hover:bg-[#505046]">(</button>
              <button onClick={() => handleBtnClick(')')} className="p-2.5 rounded-xl bg-[#3E3E36] hover:bg-[#505046]">)</button>

              <button onClick={() => handleBtnClick('7')} className="p-2.5 rounded-xl bg-[#3E3E36] hover:bg-[#505046] text-sm">7</button>
              <button onClick={() => handleBtnClick('8')} className="p-2.5 rounded-xl bg-[#3E3E36] hover:bg-[#505046] text-sm">8</button>
              <button onClick={() => handleBtnClick('9')} className="p-2.5 rounded-xl bg-[#3E3E36] hover:bg-[#505046] text-sm">9</button>
              <button onClick={() => handleBtnClick('÷')} className="p-2.5 rounded-xl bg-[#A3AD94] hover:bg-[#8F9A7F] text-sm font-bold">÷</button>

              <button onClick={() => handleBtnClick('4')} className="p-2.5 rounded-xl bg-[#3E3E36] hover:bg-[#505046] text-sm">4</button>
              <button onClick={() => handleBtnClick('5')} className="p-2.5 rounded-xl bg-[#3E3E36] hover:bg-[#505046] text-sm">5</button>
              <button onClick={() => handleBtnClick('6')} className="p-2.5 rounded-xl bg-[#3E3E36] hover:bg-[#505046] text-sm">6</button>
              <button onClick={() => handleBtnClick('×')} className="p-2.5 rounded-xl bg-[#A3AD94] hover:bg-[#8F9A7F] text-sm font-bold">×</button>

              <button onClick={() => handleBtnClick('1')} className="p-2.5 rounded-xl bg-[#3E3E36] hover:bg-[#505046] text-sm">1</button>
              <button onClick={() => handleBtnClick('2')} className="p-2.5 rounded-xl bg-[#3E3E36] hover:bg-[#505046] text-sm">2</button>
              <button onClick={() => handleBtnClick('3')} className="p-2.5 rounded-xl bg-[#3E3E36] hover:bg-[#505046] text-sm">3</button>
              <button onClick={() => handleBtnClick('-')} className="p-2.5 rounded-xl bg-[#A3AD94] hover:bg-[#8F9A7F] text-sm font-bold">-</button>

              <button onClick={() => handleBtnClick('0')} className="p-2.5 rounded-xl bg-[#3E3E36] hover:bg-[#505046] text-sm">0</button>
              <button onClick={() => handleBtnClick('.')} className="p-2.5 rounded-xl bg-[#3E3E36] hover:bg-[#505046] text-sm">.</button>
              <button onClick={() => handleBtnClick('^2')} className="p-2.5 rounded-xl bg-[#5A5A50] hover:bg-[#68685C] text-xs">x²</button>
              <button onClick={() => handleBtnClick('+')} className="p-2.5 rounded-xl bg-[#A3AD94] hover:bg-[#8F9A7F] text-sm font-bold">+</button>

              <button onClick={() => handleBtnClick('3.142')} className="p-2 rounded-xl bg-[#5A5A50] hover:bg-[#68685C] text-[11px]">π (3.142)</button>
              <button onClick={() => handleBtnClick('22/7')} className="p-2 rounded-xl bg-[#5A5A50] hover:bg-[#68685C] text-[11px]">22/7</button>
              <button onClick={handleCalculate} className="col-span-2 p-2.5 rounded-xl bg-[#A3AD94] hover:bg-[#8F9A7F] text-white font-bold flex items-center justify-center gap-1 shadow-xs">
                <Equal className="w-4 h-4" /> Kira
              </button>
            </div>
          </div>

          {/* Scratchpad Note Area */}
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-[#5A5A50] uppercase tracking-wider">
                Kertas Catatan / Conteng
              </label>
              <button
                onClick={() => setNotes('')}
                className="text-xs text-[#8A8A7A] hover:text-[#8E472D] flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" /> Padam
              </button>
            </div>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Tulis langkah kerja, formula, atau nilai perpuluhan di sini..."
              className="flex-1 w-full p-4 rounded-2xl border border-[#E0E0D0] focus:outline-none focus:ring-2 focus:ring-[#A3AD94] font-mono text-xs sm:text-sm resize-none bg-[#FAF9F5] text-[#4A4A40]"
              rows={8}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
