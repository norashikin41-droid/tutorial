import React, { useState } from 'react';
import { FileText, Search, Copy, Check, Sparkles } from 'lucide-react';
import { formulaReferenceList } from '../data/topics';

export const FormulaSheet: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedFormula, setCopiedFormula] = useState<string | null>(null);

  const handleCopy = (formulaText: string) => {
    navigator.clipboard.writeText(formulaText);
    setCopiedFormula(formulaText);
    setTimeout(() => setCopiedFormula(null), 2000);
  };

  const filteredList = formulaReferenceList.map((cat) => ({
    ...cat,
    formulas: cat.formulas.filter(
      (f) =>
        f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.formula.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cat.category.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  })).filter((cat) => cat.formulas.length > 0);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-300">
      
      {/* Title & Search Bar */}
      <div className="bg-white rounded-[32px] border border-[#E0E0D0] p-6 sm:p-8 shadow-xs mb-8">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center space-x-2 mb-1.5">
              <span className="text-xs font-bold uppercase tracking-wider px-3 py-0.5 rounded-full bg-[#E8F0E8] text-[#495E3F] border border-[#C8D6C4]">
                Buku Rujukan Rasmi
              </span>
              <span className="text-xs text-[#7A7A6A]">GCMT 2052</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#4A4A40]">
              Senarai Formula & Petua Matematik
            </h2>
          </div>

          <div className="w-full sm:w-72 relative">
            <Search className="w-4 h-4 text-[#8A8A7A] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari formula, topik, atau kata kunci..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[#E0E0D0] text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#A3AD94] bg-[#FAF9F5] text-[#4A4A40]"
            />
          </div>
        </div>

        <p className="text-xs sm:text-sm text-[#7A7A6A] leading-relaxed">
          Kompilasi rumus penting merangkumi hukum indeks, logaritma, persamaan kuadratik, geometri koordinat garis lurus, luas & isipadu pepejal, dan petua trigonometri untuk rujukan pantas sebelum & semasa ulangkaji.
        </p>
      </div>

      {/* Formula Categories */}
      <div className="space-y-6">
        {filteredList.map((category, idx) => (
          <div 
            key={idx}
            className="bg-white rounded-[24px] border border-[#E0E0D0] shadow-xs overflow-hidden"
          >
            <div className="px-6 py-4 bg-[#FAF9F5] border-b border-[#E0E0D0] flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#4A4A40] flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#A3AD94]" />
                {category.category}
              </h3>
              <span className="text-xs font-semibold text-[#7A7A6A]">
                {category.formulas.length} Formula
              </span>
            </div>

            <div className="divide-y divide-[#E8E8E0]">
              {category.formulas.map((item, fIdx) => {
                const isCopied = copiedFormula === item.formula;

                return (
                  <div 
                    key={fIdx}
                    className="p-4 sm:p-5 hover:bg-[#FAF9F5] transition-colors flex flex-wrap items-center justify-between gap-3"
                  >
                    <div>
                      <h4 className="text-xs font-bold text-[#5A5A50] mb-1.5">
                        {item.name}
                      </h4>
                      <div className="font-mono text-sm sm:text-base font-semibold text-[#34452C] bg-[#E8F0E8]/70 px-3.5 py-1.5 rounded-xl border border-[#C8D6C4] inline-block">
                        {item.formula}
                      </div>
                    </div>

                    <button
                      onClick={() => handleCopy(item.formula)}
                      className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                        isCopied 
                          ? 'bg-[#E8F0E8] border-[#C8D6C4] text-[#495E3F]' 
                          : 'bg-white border-[#E0E0D0] text-[#7A7A6A] hover:bg-[#FAF9F5]'
                      }`}
                      title="Salin formula ke clipboard"
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-[#495E3F]" />
                          <span>Disalin</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-[#8A8A7A]" />
                          <span>Salin</span>
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
