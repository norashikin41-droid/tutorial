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

import { OFFICIAL_GCMT_FORMULAS } from './officialFormulas';

// Buku rumus rasmi GCMT 2052 - HANYA mengandungi 27 rumus yang telah dimuat naik
export const formulaReferenceList = [
  {
    category: 'Unit 2: Laju Purata',
    formulas: [
      { name: 'Rumus 3: Laju Purata', formula: 'Laju purata = Jumlah jarak ÷ Jumlah masa' },
    ],
  },
  {
    category: 'Unit 6: Indeks & Logaritma',
    formulas: [
      { name: 'Rumus 1: Hukum Indeks (Pendaraban)', formula: 'aᵐ × aⁿ = aᵐ⁺ⁿ' },
      { name: 'Rumus 2: Hukum Indeks (Kuasa)', formula: '(aᵐ)ⁿ = aᵐⁿ' },
      { name: 'Rumus 16: Hukum Indeks (Pembahagian)', formula: 'aᵐ ÷ aⁿ = aᵐ⁻ⁿ' },
      { name: 'Rumus 17: Hukum Indeks (Pecahan)', formula: 'aᵐ/ⁿ = (aᵐ)¹/ⁿ' },
      { name: 'Rumus 13: Hukum Logaritma (Pembahagian)', formula: 'logₐ (m ÷ n) = logₐ m - logₐ n' },
      { name: 'Rumus 14: Penukaran Asas Logaritma', formula: 'logₐ b = (log꜀ b) ÷ (log꜀ a)' },
      { name: 'Rumus 27: Hukum Logaritma (Pendaraban)', formula: 'logₐ mn = logₐ m + logₐ n' },
      { name: 'Rumus 28: Hukum Logaritma (Kuasa)', formula: 'logₐ mⁿ = n logₐ m' },
    ],
  },
  {
    category: 'Unit 7: Garis Lurus',
    formulas: [
      { name: 'Rumus 4: Kecerunan dari Pintasan', formula: 'm = - (Pintasan-y ÷ Pintasan-x)' },
      { name: 'Rumus 18: Kecerunan dari Dua Titik', formula: 'm = (y₂ - y₁) ÷ (x₂ - x₁)' },
    ],
  },
  {
    category: 'Unit 8: Persamaan Kuadratik',
    formulas: [
      { name: 'Rumus 12: Rumus Kuadratik', formula: 'x = [-b ± √(b² - 4ac)] ÷ 2a' },
    ],
  },
  {
    category: 'Unit 9: Geometri Pepejal & Sukatan',
    formulas: [
      { name: 'Rumus 5: Isi Padu Sfera', formula: 'Isi padu sfera = ⁴/₃ π j³' },
      { name: 'Rumus 7: Luas Bulatan', formula: 'Luas bulatan = π j²' },
      { name: 'Rumus 8: Luas Permukaan Silinder', formula: 'Luas permukaan silinder = 2π j² + 2π jt' },
      { name: 'Rumus 9: Luas Permukaan Sfera', formula: 'Luas permukaan sfera = 4π j²' },
      { name: 'Rumus 10: Isi Padu Silinder', formula: 'Isi padu silinder = π j² t' },
      { name: 'Rumus 19: Isi Padu Kon', formula: 'Isi padu kon = ¹/₃ π j² t' },
      { name: 'Rumus 20: Isi Padu Piramid', formula: 'Isi padu piramid = ¹/₃ × Luas tapak × Tinggi' },
      { name: 'Rumus 21: Lilitan Bulatan', formula: 'Lilitan bulatan = π d = 2π j' },
      { name: 'Rumus 22: Luas Trapezium', formula: 'Luas trapezium = ¹/₂ × (Hasil tambah 2 sisi selari) × Tinggi' },
      { name: 'Rumus 23: Luas Permukaan Kon', formula: 'Luas permukaan kon = π j² + π js' },
      { name: 'Rumus 24: Isi Padu Prisma', formula: 'Isi padu prisma = Luas keratan rentas × Tinggi' },
    ],
  },
  {
    category: 'Unit 10: Teorem & Trigonometri',
    formulas: [
      { name: 'Rumus 6: Teorem Pihagoras', formula: 'c² = a² + b²' },
      { name: 'Rumus 11: Petua Sinus', formula: 'a / sin A = b / sin B = c / sin C' },
      { name: 'Rumus 25: Petua Kosinus', formula: 'a² = b² + c² - 2bc cos A' },
      { name: 'Rumus 26: Luas Segitiga', formula: 'Luas segitiga = ¹/₂ ab sin C' },
    ],
  },
];

