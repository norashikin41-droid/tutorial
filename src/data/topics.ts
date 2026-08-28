import { Question, TopicInfo } from '../types';
import { topic1Questions } from './topic1';
import { topic2Questions } from './topic2';
import { topic3Questions } from './topic3';
import { topic4Questions } from './topic4';
import { topic5Questions } from './topic5';
import { topic6Questions } from './topic6';
import { topic7Questions } from './topic7';
import { topic8Questions } from './topic8';
import { topic9Questions } from './topic9';
import { topic10Questions } from './topic10';

export const allTopics: TopicInfo[] = [
  {
    id: 1,
    code: 'Unit 1',
    title: 'Basic Mathematics Skills',
    subtopics: [
      '1.1 Interprete concepts of rounding numbers, decimals and significant numbers',
      '1.2 Interprete concepts of fractions and percentages',
      '1.3 Convert imperial units to metric units and vice versa',
    ],
    description: 'Rounding numbers, significant figures, fractions, percentages, dosage conversion (mcg/mg/g), and infusion flow rates.',
    iconName: 'Calculator',
    totalQuestions: topic1Questions.length,
    color: 'from-blue-600 to-indigo-600',
  },
  {
    id: 2,
    code: 'Unit 2',
    title: 'Ratio, Proportion & Rates',
    subtopics: [
      '2.1 Interprete concept of ratios',
      '2.2 Interprete concepts of proportions and rates',
    ],
    description: 'Pharmaceutical ratios, IV drip rates, fluid flow rates, linear map scales & area scales.',
    iconName: 'Scale',
    totalQuestions: topic2Questions.length,
    color: 'from-emerald-600 to-teal-600',
  },
  {
    id: 3,
    code: 'Unit 3',
    title: 'Algebra',
    subtopics: [
      '3.1 Interprete concept of factorisation and expansion in algebraic expressions',
      '3.2 Solve addition, subtraction, multiplication and division on algebraic expressions',
      '3.3 Apply algebraic formulae concept in problem solving',
    ],
    description: 'Expansion of algebraic terms, factorisation, algebraic fractions, and formula subject substitution.',
    iconName: 'Variable',
    totalQuestions: topic3Questions.length,
    color: 'from-amber-600 to-orange-600',
  },
  {
    id: 4,
    code: 'Unit 4',
    title: 'Linear Inequalities',
    subtopics: [
      '4.1 Solve inequalities in one unknown',
      '4.2 Solve simultaneous linear inequalities in one unknown',
      '4.3 Solve linear inequalities using number line',
    ],
    description: 'Inequalities in one unknown, simultaneous linear inequalities, number line representations, and therapeutic windows.',
    iconName: 'SlidersHorizontal',
    totalQuestions: topic4Questions.length,
    color: 'from-rose-600 to-pink-600',
  },
  {
    id: 5,
    code: 'Unit 5',
    title: 'Simultaneous Equation',
    subtopics: [
      '5.1 Solve simultaneous equation of two unknowns',
      '5.2 Solve one linear equation and one non-linear equation',
      '5.3 Solve the simultaneous equations using elimination and substitution method',
    ],
    description: 'Substitution method, elimination method, intersections of graphs, and multi-variable applications.',
    iconName: 'Layers',
    totalQuestions: topic5Questions.length,
    color: 'from-purple-600 to-violet-600',
  },
  {
    id: 6,
    code: 'Unit 6',
    title: 'Indices & Logarithms',
    subtopics: [
      '6.1 Apply laws of indices in problem solving',
      '6.2 Apply logarithms and laws of logarithms in problem solving',
      '6.3 Solve equations involving indices and logarithms',
    ],
    description: 'Product/quotient/power rules for indices, logarithmic laws, base changes, and pH / drug elimination models.',
    iconName: 'Binary',
    totalQuestions: topic6Questions.length,
    color: 'from-cyan-600 to-blue-600',
  },
  {
    id: 7,
    code: 'Unit 7',
    title: 'Straight Line',
    subtopics: [
      '7.1 Calculate the gradient of parallel and perpendicular line',
      '7.2 Apply the concept of y intercepts and x intercepts',
      '7.3 Sketch the straight line graph',
    ],
    description: 'Gradient calculations, parallel and perpendicular slopes, coordinate intercepts, and linear standard forms.',
    iconName: 'TrendingUp',
    totalQuestions: topic7Questions.length,
    color: 'from-sky-600 to-indigo-700',
  },
  {
    id: 8,
    code: 'Unit 8',
    title: 'Quadratic Equation & Function',
    subtopics: [
      '8.1 Solve quadratic equations using factorisation, quadratic formulae & completing square',
      '8.2 Generate quadratic equations using sum of root (SOR) and product of root (POR)',
      '8.3 Sketch graphs of quadratic functions',
    ],
    description: 'Factorisation, quadratic formula x=[-b±√(b²-4ac)]/2a, completing the square, SOR/POR, and parabola sketching.',
    iconName: 'Activity',
    totalQuestions: topic8Questions.length,
    color: 'from-red-600 to-orange-600',
  },
  {
    id: 9,
    code: 'Unit 9',
    title: 'Solid Geometry',
    subtopics: [
      '9.1 Calculate perimeter, area, total surface area and volume of solids',
      '9.2 Apply perimeter, area, total surface area and volume of solids in problem solving',
    ],
    description: 'Volumes and surface areas for cylinders, cones, pyramids, spheres, solid hemispheres, cuboids, and prisms.',
    iconName: 'Box',
    totalQuestions: topic9Questions.length,
    color: 'from-amber-600 to-yellow-600',
  },
  {
    id: 10,
    code: 'Unit 10',
    title: 'Trigonometry',
    subtopics: [
      '10.1 Solve perpendicular triangle using sin, cos, tan, sec, csc, cot',
      '10.2 Solve non perpendicular triangle using sine and cosine rule',
      '10.3 Calculate the area of non perpendicular triangle',
    ],
    description: 'Trigonometric ratios, reciprocal functions, Sine Rule, Cosine Rule, triangular area (1/2 ab sin C), and angles of elevation/depression.',
    iconName: 'Triangle',
    totalQuestions: topic10Questions.length,
    color: 'from-teal-600 to-emerald-700',
  },
];

const getQuestionsWithTitle = (questions: Question[], title: string) =>
  questions.map((q) => ({ ...q, topicTitle: title }));

export const topicQuestionMap: Record<number, Question[]> = {
  1: getQuestionsWithTitle(topic1Questions, 'Unit 1: Basic Mathematics Skills'),
  2: getQuestionsWithTitle(topic2Questions, 'Unit 2: Ratio, Proportion & Rates'),
  3: getQuestionsWithTitle(topic3Questions, 'Unit 3: Algebra'),
  4: getQuestionsWithTitle(topic4Questions, 'Unit 4: Linear Inequalities'),
  5: getQuestionsWithTitle(topic5Questions, 'Unit 5: Simultaneous Equation'),
  6: getQuestionsWithTitle(topic6Questions, 'Unit 6: Indices & Logarithms'),
  7: getQuestionsWithTitle(topic7Questions, 'Unit 7: Straight Line'),
  8: getQuestionsWithTitle(topic8Questions, 'Unit 8: Quadratic Equation & Function'),
  9: getQuestionsWithTitle(topic9Questions, 'Unit 9: Solid Geometry'),
  10: getQuestionsWithTitle(topic10Questions, 'Unit 10: Trigonometry'),
};

export const allQuestions: Question[] = [
  ...topicQuestionMap[1],
  ...topicQuestionMap[2],
  ...topicQuestionMap[3],
  ...topicQuestionMap[4],
  ...topicQuestionMap[5],
  ...topicQuestionMap[6],
  ...topicQuestionMap[7],
  ...topicQuestionMap[8],
  ...topicQuestionMap[9],
  ...topicQuestionMap[10],
];

export const formulaReferenceList = [
  {
    category: 'Unit 1: Basic Mathematics Skills',
    formulas: [
      { name: 'Penukaran Jisim', formula: '1 g = 1,000 mg = 1,000,000 mcg' },
      { name: 'Penukaran Isipadu', formula: '1 L = 1,000 mL = 1,000 cm³' },
      { name: 'Kadar Aliran Pam Infusi', formula: 'Kadar (mL/jam) = Isipadu (mL) ÷ Masa (jam)' },
      { name: 'Kadar Titisan (Drip Rate)', formula: 'Titis/min = [Isipadu (mL) × Faktor Titisan] ÷ [Masa (jam) × 60]' },
      { name: 'Kepekatan Peratusan (w/v)', formula: 'X% (w/v) = X gram bahan aktif dalam 100 mL larutan' },
    ],
  },
  {
    category: 'Unit 2: Ratio, Proportion & Rates',
    formulas: [
      { name: 'Nisbah Kepekatan', formula: 'Ratio Strength 1 : N = 1 g / N mL' },
      { name: 'Skala Linear Peta', formula: 'Jarak Sebenar = Jarak Peta × Skala Linear (n)' },
      { name: 'Skala Luas Peta', formula: 'Luas Sebenar = Luas Peta × (Skala Linear)²' },
    ],
  },
  {
    category: 'Unit 3: Algebra',
    formulas: [
      { name: 'Kuasa Dua Sempurna', formula: '(a + b)² = a² + 2ab + b² ; (a - b)² = a² - 2ab + b²' },
      { name: 'Beza Dua Kuasa Dua', formula: 'a² - b² = (a - b)(a + b)' },
    ],
  },
  {
    category: 'Unit 4: Linear Inequalities',
    formulas: [
      { name: 'Penyongsangan Tanda Ketaksamaan', formula: 'Apabila mendarab / membahagi dengan nombor negatif, tukar tanda: a < b <=> -a > -b' },
      { name: 'Ketaksamaan Serentak', formula: 'a < x ≤ b (Persilangan kawasan garis nombor)' },
    ],
  },
  {
    category: 'Unit 5: Simultaneous Equation',
    formulas: [
      { name: 'Kaedah Penggantian', formula: 'Ungkapkan y = f(x) dan ganti ke dalam persamaan kedua' },
      { name: 'Kaedah Penghapusan', formula: 'Samakan pekali bagi satu pemboleh ubah lalu tambah atau tolak kedua-dua persamaan' },
    ],
  },
  {
    category: 'Unit 6: Indices & Logarithms',
    formulas: [
      { name: 'Hukum Hasil Darab/Bahagi Indeks', formula: 'aᵐ × aⁿ = aᵐ⁺ⁿ ; aᵐ ÷ aⁿ = aᵐ⁻ⁿ ; (aᵐ)ⁿ = aᵐⁿ' },
      { name: 'Indeks Negatif & Sifar', formula: 'a⁻ⁿ = 1 / aⁿ ; a⁰ = 1' },
      { name: 'Hubungan Bentuk Indeks & Log', formula: 'logₐ y = x <=> y = aˣ' },
      { name: 'Hukum Asas Logaritma', formula: 'logₐ (xy) = logₐ x + logₐ y ; logₐ (x/y) = logₐ x - logₐ y ; logₐ (xⁿ) = n logₐ x' },
      { name: 'Penukaran Asas Logaritma', formula: 'logₐ b = log꜀ b / log꜀ a' },
      { name: 'Formula pH', formula: 'pH = -log₁₀ [H⁺]' },
    ],
  },
  {
    category: 'Unit 7: Straight Line',
    formulas: [
      { name: 'Kecerunan Dua Titik', formula: 'm = (y₂ - y₁) / (x₂ - x₁)' },
      { name: 'Kecerunan dari Pintasan', formula: 'm = - (pintasan-y / pintasan-x)' },
      { name: 'Bentuk Kecerunan-Pintasan', formula: 'y = mx + c (c = pintasan-y)' },
      { name: 'Bentuk Pintasan', formula: 'x/a + y/b = 1 (a = pintasan-x, b = pintasan-y)' },
      { name: 'Garis Selari & Berserenjang', formula: 'Selari: m₁ = m₂ ; Berserenjang: m₁ × m₂ = -1' },
    ],
  },
  {
    category: 'Unit 8: Quadratic Equation & Function',
    formulas: [
      { name: 'Rumus Kuadratik', formula: 'x = [-b ± √(b² - 4ac)] / (2a)' },
      { name: 'Hasil Tambah Punca (HTP / SOR)', formula: 'HTP (α + β) = -b / a' },
      { name: 'Hasil Darab Punca (HDP / POR)', formula: 'HDP (αβ) = c / a' },
      { name: 'Bentukkan Persamaan Kuadratik', formula: 'x² - (HTP)x + (HDP) = 0' },
      { name: 'Bentuk Verteks', formula: 'f(x) = a(x - h)² + k => Titik Pusingan (h, k)' },
      { name: 'Paksi Simetri', formula: 'x = -b / (2a)' },
    ],
  },
  {
    category: 'Unit 9: Solid Geometry',
    formulas: [
      { name: 'Silinder', formula: 'Isipadu = πr²h ; Luas Melengkung = 2πrh ; Luas Tertutup = 2πr(r + h)' },
      { name: 'Kon', formula: 'Isipadu = 1/3 πr²h ; Luas Permukaan = πr² + πrs (s = √(r² + h²))' },
      { name: 'Sfera & Hemisfera', formula: 'Isipadu Sfera = 4/3 πr³ ; Isipadu Hemisfera = 2/3 πr³ ; Luas Hemisfera Pepejal = 3πr²' },
      { name: 'Piramid & Prisma', formula: 'Isipadu Piramid = 1/3 × Luas Tapak × h ; Isipadu Prisma = Luas Keratan Rentas × Panjang' },
      { name: 'Kubus & Kuboid', formula: 'Isipadu Kubus = s³ (Luas = 6s²) ; Isipadu Kuboid = p × l × t' },
    ],
  },
  {
    category: 'Unit 10: Trigonometry',
    formulas: [
      { name: 'Nisbah Resiprokal', formula: 'sek θ = 1 / kos θ ; kosek θ = 1 / sin θ ; kot θ = 1 / tan θ' },
      { name: 'Petua Sinus', formula: 'a / sin A = b / sin B = c / sin C' },
      { name: 'Petua Kosinus (Mencari Sisi)', formula: 'a² = b² + c² - 2bc kos A' },
      { name: 'Petua Kosinus (Mencari Sudut)', formula: 'kos A = (b² + c² - a²) / (2bc)' },
      { name: 'Luas Segi Tiga Bukan Bersudut Tegak', formula: 'Luas = 1/2 ab sin C = 1/2 bc sin A = 1/2 ac sin B' },
    ],
  },
];
