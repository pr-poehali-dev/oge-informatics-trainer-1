import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { GameResult } from '@/types/game';

interface Puzzle {
  conditions: string[];
  options: number[];
  correct: number;
  explanation: string;
}

const PUZZLES: Puzzle[] = [
  { conditions: ['Число > 10', 'Число чётное', 'Число < 20', 'Число делится на 4'], options: [12, 14, 16, 18], correct: 2, explanation: '16 > 10, чётное, < 20, делится на 4 ✓' },
  { conditions: ['Число нечётное', 'Число > 20', 'Число < 30', 'Число простое'], options: [21, 23, 25, 27], correct: 1, explanation: '23 — простое нечётное число между 20 и 30' },
  { conditions: ['Число делится на 3', 'Число > 15', 'Число < 25', 'Число нечётное'], options: [18, 21, 24, 15], correct: 1, explanation: '21: делится на 3, > 15, < 25, нечётное ✓' },
  { conditions: ['x > 5', 'x < 10', 'x делится на 2', 'x не делится на 4'], options: [6, 8, 4, 10], correct: 0, explanation: '6: > 5, < 10, чётное, не делится на 4 ✓' },
  { conditions: ['Число двузначное', 'Сумма цифр = 9', 'Число чётное'], options: [36, 45, 54, 72], correct: 0, explanation: '36: 3+6=9, чётное, двузначное ✓' },
  { conditions: ['Число > 30', 'Число < 40', 'Делится на 5', 'Нечётное'], options: [30, 35, 40, 25], correct: 1, explanation: '35: >30, <40, делится на 5, нечётное ✓' },
  { conditions: ['x mod 2 = 0', 'x mod 3 = 0', 'x > 10', 'x < 20'], options: [12, 15, 18, 6], correct: 0, explanation: '12: делится на 2 и на 3, между 10 и 20 ✓' },
  { conditions: ['Число — квадрат натурального числа', 'Число > 20', 'Число < 50'], options: [25, 36, 49, 16], correct: 0, explanation: '25 = 5², между 20 и 50. Но 36 и 49 тоже подходят — выбираем наименьшее' },
  { conditions: ['Число > 40', 'Делится на 6', 'Меньше 60'], options: [42, 48, 54, 60], correct: 1, explanation: '48: >40, делится на 6 (48÷6=8), < 60 ✓' },
  { conditions: ['Число двузначное', 'Цифры одинаковые', 'Число нечётное'], options: [11, 33, 55, 77], correct: 1, explanation: '33: двузначное, цифры одинаковые (3 и 3), нечётное ✓' },
];

interface Props {
  onFinish: (result: Omit<GameResult, 'playedAt'>) => void;
}

export default function NumberDetective({ onFinish }: Props) {
  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [phase, setPhase] = useState<'question' | 'feedback'>('question');
  const [startTime] = useState(Date.now());

  const p = PUZZLES[qIndex];

  function handleAnswer(idx: number) {
    if (phase !== 'question') return;
    setSelected(idx);
    setPhase('feedback');
    if (idx === p.correct) {
      setScore((s) => s + 10);
      setCorrect((c) => c + 1);
    }
  }

  function next() {
    if (qIndex + 1 >= PUZZLES.length) {
      onFinish({
        gameId: 'number-detective',
        score: Math.round((correct / PUZZLES.length) * 100),
        maxScore: 100,
        correctAnswers: correct,
        totalQuestions: PUZZLES.length,
        timeSpent: Math.round((Date.now() - startTime) / 1000),
        difficulty: 'easy',
      });
    } else {
      setQIndex((i) => i + 1);
      setSelected(null);
      setPhase('question');
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="text-white/50 text-sm">Загадка {qIndex + 1} / {PUZZLES.length}</div>
        <div className="text-white/50 text-sm">Счёт: <span className="text-white font-bold">{score}</span></div>
      </div>

      <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
        <div className="progress-bar h-full" style={{ width: `${(qIndex / PUZZLES.length) * 100}%` }} />
      </div>

      <div className="card-glow rounded-2xl p-6">
        <div className="text-white/50 text-sm mb-3">Определи число по условиям:</div>
        <div className="space-y-2">
          {p.conditions.map((cond, i) => (
            <div key={i} className="flex items-center gap-3 text-white">
              <div className="w-6 h-6 rounded-lg bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-xs text-purple-400 flex-shrink-0 font-bold">{i + 1}</div>
              <span className="font-mono text-emerald-300">{cond}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {p.options.map((opt, idx) => {
          let cls = 'card-glow rounded-xl p-6 text-center text-3xl font-black transition-all cursor-pointer border ';
          if (phase === 'feedback') {
            if (idx === p.correct) cls += 'game-correct border-emerald-500/80 text-emerald-300';
            else if (idx === selected) cls += 'game-wrong border-red-500/80 text-red-300';
            else cls += 'opacity-40 border-white/10 text-white';
          } else {
            cls += 'border-white/10 hover:border-emerald-500/50 hover:bg-emerald-500/5 text-white';
          }
          return <button key={idx} className={cls} onClick={() => handleAnswer(idx)}>{opt}</button>;
        })}
      </div>

      {phase === 'feedback' && (
        <div className={`rounded-xl p-4 text-sm flex items-start gap-3 ${selected === p.correct ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300' : 'bg-red-500/10 border border-red-500/30 text-red-300'}`}>
          <Icon name={selected === p.correct ? 'CheckCircle' : 'XCircle'} size={18} className="flex-shrink-0 mt-0.5" />
          <div>
            <div className="font-semibold mb-1">{selected === p.correct ? 'Детективная работа! 🔍' : `Неверно. Ответ: ${p.options[p.correct]}`}</div>
            <div className="text-white/70">{p.explanation}</div>
          </div>
        </div>
      )}

      {phase === 'feedback' && (
        <button onClick={next} className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-90 transition-all">
          {qIndex + 1 >= PUZZLES.length ? 'Завершить' : 'Следующая загадка'} →
        </button>
      )}
    </div>
  );
}
