import React, { useState } from 'react';
import { 
  FileText, 
  Search, 
  Copy, 
  Check, 
  Printer, 
  Grid, 
  Table as TableIcon, 
  Info,
  Sparkles,
  BookOpen,
  ArrowRight,
  X
} from 'lucide-react';
import { 
  OFFICIAL_GCMT_FORMULAS, 
  OFFICIAL_SHEET_HEADER, 
  OfficialFormulaItem 
} from '../data/officialFormulas';

interface FormulaSheetProps {
  isModal?: boolean;
  onClose?: () => void;
}

export const FormulaSheet: React.FC<FormulaSheetProps> = ({ isModal = false, onClose }) => {
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copiedNum, setCopiedNum] = useState<number | null>(null);

  const handleCopy = (formulaItem: OfficialFormulaItem) => {
    navigator.clipboard.writeText(formulaItem.formula);
    setCopiedNum(formulaItem.num);
    setTimeout(() => setCopiedNum(null), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  // Lajur 1: 1 hingga 14
  const col1Items = OFFICIAL_GCMT_FORMULAS.filter((f) => f.column === 1);
  // Lajur 2: 16 hingga 28
  const col2Items = OFFICIAL_GCMT_FORMULAS.filter((f) => f.column === 2);

  // Kategori unik bagi penapisan
  const categories = ['all', ...Array.from(new Set(OFFICIAL_GCMT_FORMULAS.map((f) => f.category)))];

  // Penapisan untuk mod kad
  const filteredFormulas = OFFICIAL_GCMT_FORMULAS.filter((item) => {
    const matchesSearch = 
      item.num.toString().includes(searchQuery) ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.formula.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Komponen pemapar formula matematik berkualiti tinggi
  const renderMathFormula = (item: OfficialFormulaItem, isLarge = false) => {
    if (item.displayType === 'fraction' && item.numerator && item.denominator) {
      return (
        <div className={`inline-flex items-center gap-2 font-serif text-[#1F291B] ${isLarge ? 'text-base sm:text-lg' : 'text-sm sm:text-base'}`}>
          {item.prefix && <span className="font-semibold">{item.prefix}</span>}
          <div className="inline-flex flex-col items-center justify-center leading-none px-1">
            <span className="border-b border-[#2D3B27] pb-1 px-1 font-semibold text-center w-full">
              {item.numerator}
            </span>
            <span className="pt-1 px-1 font-semibold text-center w-full">
              {item.denominator}
            </span>
          </div>
          {item.suffix && <span className="font-semibold">{item.suffix}</span>}
        </div>
      );
    }

    if (item.num === 11) {
      // Petua Sinus format pecahan berterusan
      return (
        <div className={`inline-flex items-center gap-1.5 font-serif text-[#1F291B] font-semibold ${isLarge ? 'text-base sm:text-lg' : 'text-sm sm:text-base'}`}>
          <div className="inline-flex flex-col items-center leading-none px-0.5">
            <span className="border-b border-[#2D3B27] pb-0.5 px-1">a</span>
            <span className="pt-0.5 px-1">sin A</span>
          </div>
          <span>=</span>
          <div className="inline-flex flex-col items-center leading-none px-0.5">
            <span className="border-b border-[#2D3B27] pb-0.5 px-1">b</span>
            <span className="pt-0.5 px-1">sin B</span>
          </div>
          <span>=</span>
          <div className="inline-flex flex-col items-center leading-none px-0.5">
            <span className="border-b border-[#2D3B27] pb-0.5 px-1">c</span>
            <span className="pt-0.5 px-1">sin C</span>
          </div>
        </div>
      );
    }

    if (item.num === 6) {
      // Teorem Pihagoras
      return (
        <div className="text-left font-serif text-[#1F291B]">
          <div className="text-xs italic font-semibold text-[#4A5D44]">Teorem Pihagoras</div>
          <div className={`font-bold mt-0.5 ${isLarge ? 'text-base sm:text-lg' : 'text-sm sm:text-base'}`}>
            c² = a² + b²
          </div>
        </div>
      );
    }

    return (
      <div className={`font-serif text-[#1F291B] font-bold tracking-wide ${isLarge ? 'text-base sm:text-lg' : 'text-sm sm:text-base'}`}>
        {item.formula}
      </div>
    );
  };

  const sheetContent = (
    <div className={`max-w-6xl mx-auto ${isModal ? 'p-2 sm:p-3' : 'px-4 sm:px-6 lg:px-8 py-8'} animate-in fade-in duration-300`}>
      
      {/* HEADER DOKUMEN RASMI */}
      <div className="bg-white rounded-[28px] border-2 border-[#D8DFD5] p-6 sm:p-8 shadow-sm mb-6 print:shadow-none print:border-none print:p-0">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[#E5EAE2]">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full bg-[#EBF3E8] border border-[#C5D8C0] text-[#2C4824] text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-[#3D6632]" />
                Buku Rumus Rasmi Peperiksaan
              </span>
              <span className="text-xs font-bold text-[#6D7867]">
                GCMT 2052
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-[#222E1F] tracking-tight">
              {OFFICIAL_SHEET_HEADER.title}
            </h2>
            <p className="text-xs sm:text-sm text-[#5B6856] mt-1.5 font-medium leading-relaxed max-w-3xl">
              {OFFICIAL_SHEET_HEADER.instructions}
            </p>
          </div>

          {/* Tools & View Switcher */}
          <div className="flex flex-wrap items-center gap-2 print:hidden">
            <button
              onClick={() => setViewMode('table')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-[#33422C] text-white shadow-xs'
                  : 'bg-[#F4F6F2] text-[#4F5B4B] hover:bg-[#EAEFE8] border border-[#D5DFD2]'
              }`}
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span>Jadual Peperiksaan (2 Lajur)</span>
            </button>

            <button
              onClick={() => setViewMode('cards')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                viewMode === 'cards'
                  ? 'bg-[#33422C] text-white shadow-xs'
                  : 'bg-[#F4F6F2] text-[#4F5B4B] hover:bg-[#EAEFE8] border border-[#D5DFD2]'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>Mod Kad & Carian</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-[#FAF9F5] hover:bg-[#EFEFE6] text-[#4F5B4B] border border-[#D5DFD2] flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              title="Cetak lembaran rumus rasmi"
            >
              <Printer className="w-3.5 h-3.5 text-[#556750]" />
              <span className="hidden sm:inline">Cetak / PDF</span>
            </button>
          </div>
        </div>

        {/* Makluman Dokumen Upload */}
        <div className="mt-4 flex items-center justify-between text-xs text-[#5D6B57] bg-[#F7FAF5] px-4 py-2.5 rounded-xl border border-[#DDE7DA]">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-[#496B3E] shrink-0" />
            <span>
              Hanya mengandungi <strong>27 rumus rasmi</strong> tepat mengikut dokumen edaran peperiksaan Matematik GCMT 2052 ILKKM Sungai Buloh yang telah dimuat naik.
            </span>
          </div>
          <span className="hidden md:inline font-bold text-[#3B5433]">
            {OFFICIAL_SHEET_HEADER.totalFormulas} Rumus Rasmi (1-14 & 16-28)
          </span>
        </div>
      </div>

      {/* ======================================================================= */}
      {/* MOD 1: FORMAT JADUAL LEMBARAN PEPERIKSAAN RASMI (DUA LAJUR SEPERTI ASAL) */}
      {/* ======================================================================= */}
      {viewMode === 'table' && (
        <div className="bg-white rounded-2xl border-2 border-[#1E281A] shadow-md overflow-hidden print:border-black print:rounded-none">
          
          {/* Header Bar Peperiksaan */}
          <div className="bg-[#FAFBF9] border-b-2 border-[#1E281A] p-4 text-center">
            <h3 className="font-serif font-black text-sm sm:text-base uppercase tracking-wider text-[#141B12]">
              FORMULA BAGI SUBJEK MATHEMATICS (GCMT 2052)
            </h3>
            <p className="font-serif italic text-xs text-[#3D4C38] mt-0.5">
              Rumus-rumus berikut boleh membantu anda untuk menjawab soalan. Simbol-simbol yang diberi adalah biasa digunakan.
            </p>
          </div>

          {/* Grid Dua Lajur Tepat Seperti Dokumen */}
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x-2 divide-[#1E281A]">
            
            {/* LAJUR KIRI: 1 HINGGA 14 */}
            <div className="divide-y divide-[#1E281A]">
              {col1Items.map((item) => {
                const isCopied = copiedNum === item.num;
                return (
                  <div 
                    key={item.num}
                    className="flex items-center min-h-[56px] hover:bg-[#F9FAF7] transition-colors group relative"
                  >
                    {/* Nombor Rumus */}
                    <div className="w-12 sm:w-14 self-stretch flex items-center justify-center font-bold text-xs sm:text-sm text-[#141B12] border-r border-[#1E281A] bg-[#FAFBF9] shrink-0">
                      {item.num}
                    </div>

                    {/* Formula Body */}
                    <div className="flex-1 px-4 py-2.5 flex items-center justify-between gap-3">
                      <div className="overflow-x-auto py-1">
                        {renderMathFormula(item)}
                      </div>

                      {/* Salin Button */}
                      <button
                        onClick={() => handleCopy(item)}
                        className={`opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg text-xs print:hidden ${
                          isCopied 
                            ? 'bg-[#EBF3E8] text-[#2C4824] opacity-100' 
                            : 'bg-white border border-[#CCD8C8] text-[#556750] hover:bg-[#EAEFE8]'
                        }`}
                        title="Salin teks rumus"
                      >
                        {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* LAJUR KANAN: 16 HINGGA 28 */}
            <div className="divide-y divide-[#1E281A]">
              {col2Items.map((item) => {
                const isCopied = copiedNum === item.num;
                return (
                  <div 
                    key={item.num}
                    className="flex items-center min-h-[56px] hover:bg-[#F9FAF7] transition-colors group relative"
                  >
                    {/* Nombor Rumus */}
                    <div className="w-12 sm:w-14 self-stretch flex items-center justify-center font-bold text-xs sm:text-sm text-[#141B12] border-r border-[#1E281A] bg-[#FAFBF9] shrink-0">
                      {item.num}
                    </div>

                    {/* Formula Body */}
                    <div className="flex-1 px-4 py-2.5 flex items-center justify-between gap-3">
                      <div className="overflow-x-auto py-1">
                        {renderMathFormula(item)}
                      </div>

                      {/* Salin Button */}
                      <button
                        onClick={() => handleCopy(item)}
                        className={`opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg text-xs print:hidden ${
                          isCopied 
                            ? 'bg-[#EBF3E8] text-[#2C4824] opacity-100' 
                            : 'bg-white border border-[#CCD8C8] text-[#556750] hover:bg-[#EAEFE8]'
                        }`}
                        title="Salin teks rumus"
                      >
                        {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                );
              })}

              {/* Slot Baris Kosong untuk Menyamakan Ketinggian Lajur (seperti lembaran asal) */}
              <div className="hidden md:flex items-center min-h-[56px] bg-[#FAFBF9]/50">
                <div className="w-12 sm:w-14 self-stretch border-r border-[#1E281A]"></div>
                <div className="p-3 text-xs italic text-[#8A9684]">
                  (Tamat Lembaran Formula Rasmi GCMT 2052)
                </div>
              </div>
            </div>

          </div>

          {/* Footer Dokumen */}
          <div className="p-3 bg-[#FAFBF9] border-t-2 border-[#1E281A] flex flex-wrap items-center justify-between text-xs text-[#52634D]">
            <span>Dokumen Rasmi Kursus Matematik GCMT 2052 • ILKKM Sungai Buloh</span>
            <span>Pengajar: Puan Norashikin Bt M Noor Arzmi</span>
          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* MOD 2: MOD KAD & CARIAN INTERAKTIF DENGAN PENERANGAN SIMBOL             */}
      {/* ======================================================================= */}
      {viewMode === 'cards' && (
        <div className="space-y-6">
          
          {/* Bar Carian & Penapis Kategori */}
          <div className="bg-white p-4 sm:p-6 rounded-2xl border border-[#D8DFD5] shadow-xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex-1 min-w-[240px] relative">
                <Search className="w-4 h-4 text-[#7A8875] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Cari nombor rumus (cth: 12), kata kunci (sfera, kecerunan, log, sinus)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[#CCD8C8] text-xs sm:text-sm bg-[#FAFBF9] focus:outline-none focus:ring-2 focus:ring-[#8F9E89] text-[#222E1F]"
                />
              </div>

              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-xs font-bold text-[#6D7867] hover:text-[#222E1F] cursor-pointer"
                >
                  Padam carian
                </button>
              )}
            </div>

            {/* Kategori Tags */}
            <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-[#EDF2EB]">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-[#33422C] text-white shadow-xs'
                      : 'bg-[#F4F6F2] text-[#4F5B4B] hover:bg-[#EAEFE8] border border-[#D5DFD2]'
                  }`}
                >
                  {cat === 'all' ? `Semua (27 Rumus)` : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Grid Kad Rumus */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredFormulas.map((item) => {
              const isCopied = copiedNum === item.num;
              return (
                <div
                  key={item.num}
                  className="bg-white rounded-2xl border border-[#D8DFD5] p-5 shadow-xs hover:border-[#8F9E89] hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  <div>
                    {/* Header Kad */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-lg bg-[#33422C] text-white font-mono font-black text-xs flex items-center justify-center shadow-xs">
                          {item.num}
                        </span>
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#EBF3E8] text-[#2C4824] border border-[#C5D8C0]">
                          {item.category}
                        </span>
                      </div>

                      <button
                        onClick={() => handleCopy(item)}
                        className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                          isCopied
                            ? 'bg-[#EBF3E8] text-[#2C4824]'
                            : 'bg-[#F4F6F2] hover:bg-[#EAEFE8] text-[#556750] border border-[#CCD8C8]'
                        }`}
                        title="Salin formula"
                      >
                        {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>

                    {/* Tajuk Deskriptif */}
                    <h4 className="text-xs font-bold text-[#556750] mb-3">
                      {item.title}
                    </h4>

                    {/* Paparan Formula Matematik */}
                    <div className="p-4 rounded-xl bg-[#FAFBF9] border border-[#E0E8DC] text-center min-h-[70px] flex items-center justify-center mb-3">
                      {renderMathFormula(item, true)}
                    </div>
                  </div>

                  {/* Panduan Simbol & Nota */}
                  {item.symbolGuide && (
                    <div className="pt-2 border-t border-[#EDF2EB] text-[11px] text-[#697A63] italic">
                      {item.symbolGuide}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {filteredFormulas.length === 0 && (
            <div className="text-center py-12 bg-white rounded-2xl border border-[#D8DFD5] p-6">
              <Search className="w-8 h-8 text-[#A1B09C] mx-auto mb-2" />
              <p className="text-sm font-bold text-[#3B4836]">
                Tiada rumus ditemui bagi carian &ldquo;{searchQuery}&rdquo;
              </p>
              <p className="text-xs text-[#6B7965] mt-1">
                Sila cuba nombor rumus (1-14 atau 16-28) atau istilah lain.
              </p>
            </div>
          )}
        </div>
      )}

    </div>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
        <div className="bg-[#FAFBF9] rounded-[28px] border-2 border-[#D8DFD5] w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
          <div className="p-3 sm:p-4 bg-white border-b border-[#E0E8DC] flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-xl bg-[#33422C] text-white flex items-center justify-center font-bold text-sm shadow-xs">
                Σ
              </span>
              <div>
                <h3 className="font-extrabold text-xs sm:text-sm text-[#222E1F]">
                  Buku Rumus Rasmi Peperiksaan GCMT 2052
                </h3>
                <p className="text-[11px] text-[#697A63]">
                  Hanya 27 Rumus Yang Telah Dimuat Naik (1-14 & 16-28)
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-[#6B7965] hover:text-[#222E1F] hover:bg-[#EAEFE8] transition-colors cursor-pointer"
              title="Tutup lembaran rumus"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-2 sm:p-4">
            {sheetContent}
          </div>
        </div>
      </div>
    );
  }

  return sheetContent;
};
