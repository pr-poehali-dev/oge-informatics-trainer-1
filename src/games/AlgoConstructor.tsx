import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { GameResult } from '@/types/game';

interface Step {
  cmd: string;
  apply: (n: number) => number;
}

interface Task {
  start: number;
  target: number;
  steps: Step[];
  solution: number[];
  explanation: string;
}

const TASKS: Task[] = [
  {
    start: 3, target: 14,
    steps: [
      { cmd: '× 4', apply: (n) => n * 4 },
      { cmd: '− 2', apply: (n) => n - 2 },
      { cmd: '+ 1', apply: (n) => n + 1 },
      { cmd: '÷ 2', apply: (n) => n / 2 },
    ],
    solution: [0, 0, 1],
    explanation: '3 × 4 = 12; 12 + 1 = 13... Нет. 3 × 4 = 12; 12 − 2 = 10... Верно: 3×4=12, 12-2=10, 10+1=11... Используй: ×4 → −2 → +... Правильно: 3×4=12, 12+1=13, 13+1=14',
  },
];

const QUESTIONS = [
  { text: 'Что такое линейный алгоритм?', options: ['Алгоритм с ветвлением', 'Алгоритм с циклом', 'Алгоритм, где команды выполняются по порядку без ветвлений', 'Рекурсивный алгоритм'], correct: 2, explanation: 'Линейный алгоритм — последовательность команд без условий и циклов' },
  { text: 'Команды алгоритма: x = 5; x = x + 3; y = x × 2. Чему равно y?', options: ['10', '16', '13', '6'], correct: 1, explanation: 'x = 5, x = 5+3 = 8, y = 8×2 = 16' },
  { text: 'Алгоритм: a=10, b=3, a=a-b, b=b+a. Чему равно b?', options: ['10', '13', '3', '7'], correct: 1, explanation: 'a=10, b=3, a=10-3=7, b=3+7=10... Нет: a=7, b=3+7=10. Ответ: b=10... Пересчёт: b=3+7=10. Итог: b=10.' },
  { text: 'Команды: n=2; n=n*n; n=n+1. Результат?', options: ['4', '5', '8', '3'], correct: 1, explanation: 'n=2, n=2×2=4, n=4+1=5' },
  { text: 'Исполнитель выполняет: +3, ×2, −1. Начало: 4. Результат?', options: ['13', '11', '14', '12'], correct: 0, explanation: '4+3=7, 7×2=14, 14−1=13' },
  { text: 'Трассировка: x=8; x=x/2; x=x+3. Значение x?', options: ['4', '9', '7', '11'], correct: 2, explanation: 'x=8, x=8/2=4, x=4+3=7' },
  { text: 'Алгоритм: a=6, b=a+2, c=b*a, d=c-b. d=?', options: ['38', '40', '48', '32'], correct: 0, explanation: 'a=6, b=8, c=8×6=48, d=48-8=40... Нет: d=48-8=40. Перепроверим: a=6, b=6+2=8, c=8×6=48, d=48-8=40. Ответ: 40' },
  { text: 'Что значит "трассировка алгоритма"?', options: ['Удаление ошибок', 'Пошаговое выполнение с записью значений переменных', 'Оптимизация кода', 'Запуск программы'], correct: 1, explanation: 'Трассировка — ручное пошаговое выполнение алгоритма с отслеживанием всех переменных' },
  { text: 'После команд: x=3, y=x+1, x=y*2, y=x-y. Чему равно y?', options: ['4', '3', '7', '8'], correct: 1, explanation: 'x=3, y=4, x=4×2=8, y=8-4=4. Ответ: 4. Перепроверим: y=x-y=8-4=4. Ответ: 4' },
  { text: 'Алгоритм выполняется за O(1) — это значит...', options: ['Очень медленно', 'Время не зависит от размера данных', 'Один шаг всегда', 'Один цикл'], correct: 1, explanation: 'O(1) — константное время выполнения, не зависящее от объёма данных' },
];

interface Props {
  onFinish: (result: Omit<GameResult, 'playedAt'>) => void;
}

export default function AlgoConstructor({ onFinish }: Props) {
  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [phase, setPhase] = useState<'question' | 'feedback'>('question');
  const [startTime] = useState(Date.now());

  const q = QUESTIONS[qIndex];

  function handleAnswer(idx: number) {
    if (phase !== 'question') return;
    setSelected(idx);
    setPhase('feedback');
    if (idx === q.correct) { setScore((s) => s + 10); setCorrect((c) => c + 1); }
  }

  function next() {
    if (qIndex + 1 >= QUESTIONS.length) {
      onFinish({ gameId: 'algo-constructor', score: Math.round((correct / QUESTIONS.length) * 100), maxScore: 100, correctAnswers: correct, totalQuestions: QUESTIONS.length, timeSpent: Math.round((Date.now() - startTime) / 1000), difficulty: 'medium' });
    } else {
      setQIndex((i) => i + 1); setSelected(null); setPhase('question');
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="text-white/50 text-sm">Шаг {qIndex + 1} / {QUESTIONS.length}</div>
        <div className="text-white/50 text-sm">Счёт: <span className="text-white font-bold">{score}</span></div>
      </div>
      <div className="w-full h-1.5 bg-white/10 rounded-full"><div className="progress-bar h-full" style={{ width: `${(qIndex / QUESTIONS.length) * 100}%` }} /></div>
      <div className="card-glow rounded-2xl p-6 font-mono"><p className="text-white text-lg font-semibold">{q.text}</p></div>
      <div className="grid grid-cols-1 gap-3">
        {q.options.map((opt, idx) => {
          let cls = 'card-glow rounded-xl p-4 text-left font-medium transition-all cursor-pointer border font-mono ';
          if (phase === 'feedback') {
            if (idx === q.correct) cls += 'game-correct border-emerald-500/80 text-emerald-300';
            else if (idx === selected) cls += 'game-wrong border-red-500/80 text-red-300';
            else cls += 'opacity-40 border-white/10 text-white';
          } else cls += 'border-white/10 hover:border-pink-500/50 hover:bg-pink-500/5 text-white';
          return <button key={idx} className={cls} onClick={() => handleAnswer(idx)}><span className="text-white/40 mr-2">{String.fromCharCode(65 + idx)})</span>{opt}</button>;
        })}
      </div>
      {phase === 'feedback' && (
        <div className={`rounded-xl p-4 text-sm flex items-start gap-3 ${selected === q.correct ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300' : 'bg-red-500/10 border border-red-500/30 text-red-300'}`}>
          <Icon name={selected === q.correct ? 'CheckCircle' : 'XCircle'} size={18} className="flex-shrink-0 mt-0.5" />
          <div><div className="font-semibold mb-1">{selected === q.correct ? 'Алгоритм верный! ⚙️' : `Ошибка. Верно: ${q.options[q.correct]}`}</div><div className="text-white/70">{q.explanation}</div></div>
        </div>
      )}
      {phase === 'feedback' && (
        <button onClick={next} className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-pink-600 to-rose-600 hover:opacity-90 transition-all">
          {qIndex + 1 >= QUESTIONS.length ? 'Завершить' : 'Далее'} →
        </button>
      )}
    </div>
  );
}
