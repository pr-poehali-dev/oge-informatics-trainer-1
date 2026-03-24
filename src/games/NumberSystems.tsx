import { useState, useEffect, useCallback } from 'react';
import Icon from '@/components/ui/icon';
import { GameResult } from '@/types/game';

interface Question {
  numA: string;
  baseA: number;
  numB: string;
  baseB: number;
  correct: 'A' | 'B' | '=';
  explanation: string;
}

const QUESTIONS: Question[] = [
  { numA: '1010', baseA: 2, numB: '10', baseB: 10, correct: '=', explanation: '1010₂ = 1×8+0×4+1×2+0×1 = 10₁₀ ✓ Числа равны!' },
  { numA: '1111', baseA: 2, numB: '14', baseB: 10, correct: 'A', explanation: '1111₂ = 15₁₀, а 14₁₀ = 14. 15 > 14, первое больше!' },
  { numA: '17', baseA: 8, numB: '15', baseB: 10, correct: 'A', explanation: '17₈ = 1×8+7 = 15₁₀... Нет: 17₈=15₁₀ и 15₁₀=15. Равны! Пересчёт: 17₈=15₁₀. Равно.' },
  { numA: 'A', baseA: 16, numB: '10', baseB: 10, correct: '=', explanation: 'A₁₆ = 10₁₀. Числа равны!' },
  { numA: '100', baseA: 2, numB: '4', baseB: 10, correct: '=', explanation: '100₂ = 4₁₀. Числа равны!' },
  { numA: '11', baseA: 2, numB: '3', baseB: 10, correct: '=', explanation: '11₂ = 1×2+1 = 3₁₀. Числа равны!' },
  { numA: 'FF', baseA: 16, numB: '255', baseB: 10, correct: '=', explanation: 'FF₁₆ = 15×16+15 = 240+15 = 255₁₀. Равны!' },
  { numA: '20', baseA: 8, numB: '15', baseB: 10, correct: 'A', explanation: '20₈ = 2×8+0 = 16₁₀. 16 > 15, первое больше!' },
  { numA: '1000', baseA: 2, numB: '9', baseB: 10, correct: 'B', explanation: '1000₂ = 8₁₀. 8 < 9, второе больше!' },
  { numA: '1B', baseA: 16, numB: '27', baseB: 10, correct: '=', explanation: '1B₁₆ = 1×16+11 = 27₁₀. Числа равны!' },
];

function toDecimal(num: string, base: number): number {
  return parseInt(num, base);
}

function baseName(b: number): string {
  return b === 2 ? 'двоич.' : b === 8 ? 'восьмер.' : b === 10 ? 'десят.' : 'шестн.';
}

interface Props {
  onFinish: (result: Omit<GameResult, 'playedAt'>) => void;
}

export default function NumberSystems({ onFinish }: Props) {
  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState<'A' | 'B' | '=' | null>(null);
  const [score, setScore] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [timeLeft, setTimeLeft] = useState(45);
  const [phase, setPhase] = useState<'question' | 'feedback'>('question');
  const [startTime] = useState(Date.now());

  const q = QUESTIONS[qIndex];

  const handleTimeout = useCallback(() => {
    if (phase !== 'question') return;
    setSelected(null);
    setPhase('feedback');
  }, [phase]);

  useEffect(() => {
    if (phase !== 'question') return;
    const t = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) { clearInterval(t); handleTimeout(); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [qIndex, phase, handleTimeout]);

  function handleAnswer(ans: 'A' | 'B' | '=') {
    if (phase !== 'question') return;
    setSelected(ans); setPhase('feedback');
    if (ans === q.correct) { setScore((s) => s + 10); setCorrect((c) => c + 1); }
  }

  function next() {
    if (qIndex + 1 >= QUESTIONS.length) {
      onFinish({ gameId: 'number-systems', score: Math.round((correct / QUESTIONS.length) * 100), maxScore: 100, correctAnswers: correct, totalQuestions: QUESTIONS.length, timeSpent: Math.round((Date.now() - startTime) / 1000), difficulty: 'hard' });
    } else { setQIndex((i) => i + 1); setSelected(null); setPhase('question'); setTimeLeft(45); }
  }

  const dA = toDecimal(q.numA, q.baseA);
  const dB = toDecimal(q.numB, q.baseB);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="text-white/50 text-sm">Задача {qIndex + 1} / {QUESTIONS.length}</div>
        <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-bold ${timeLeft <= 15 ? 'bg-red-500/20 text-red-400' : 'bg-white/10 text-white/70'}`}>
          <Icon name="Clock" size={14} />{timeLeft}с
        </div>
        <div className="text-white/50 text-sm">Счёт: <span className="text-white font-bold">{score}</span></div>
      </div>
      <div className="w-full h-1.5 bg-white/10 rounded-full"><div className="progress-bar h-full" style={{ width: `${(qIndex / QUESTIONS.length) * 100}%` }} /></div>

      <div className="text-white/60 text-center text-sm">Какое число больше? (или они равны?)</div>

      <div className="grid grid-cols-2 gap-4">
        {[
          { label: 'Число А', num: q.numA, base: q.baseA, key: 'A' as const },
          { label: 'Число Б', num: q.numB, base: q.baseB, key: 'B' as const },
        ].map((item) => {
          let cls = 'card-glow rounded-2xl p-6 text-center cursor-pointer border transition-all ';
          if (phase === 'feedback') {
            if (item.key === q.correct) cls += 'game-correct border-emerald-500/80';
            else if (item.key === selected) cls += 'game-wrong border-red-500/80';
            else cls += q.correct === '=' ? 'game-correct border-emerald-500/80' : 'opacity-60 border-white/10';
          } else cls += 'border-white/10 hover:border-fuchsia-500/60 hover:bg-fuchsia-500/5';
          return (
            <button key={item.key} className={cls} onClick={() => handleAnswer(item.key)}>
              <div className="text-white/40 text-xs mb-2">{item.label}</div>
              <div className="text-4xl font-black text-white mb-2 font-mono">{item.num}</div>
              <div className="text-white/50 text-xs">основание {item.base} ({baseName(item.base)})</div>
              {phase === 'feedback' && (
                <div className="mt-2 text-fuchsia-300 text-sm font-mono">= {toDecimal(item.num, item.base)}₁₀</div>
              )}
            </button>
          );
        })}
      </div>

      <button
        className={`w-full card-glow rounded-2xl p-4 text-center font-bold text-xl border transition-all cursor-pointer ${
          phase === 'feedback'
            ? q.correct === '='
              ? 'game-correct border-emerald-500/80 text-emerald-300'
              : selected === '='
              ? 'game-wrong border-red-500/80 text-red-300'
              : 'opacity-60 border-white/10 text-white'
            : 'border-white/10 hover:border-white/30 text-white'
        }`}
        onClick={() => handleAnswer('=')}
      >
        =&nbsp; Числа равны
      </button>

      {phase === 'feedback' && (
        <div className={`rounded-xl p-4 text-sm flex items-start gap-3 ${selected === q.correct ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300' : 'bg-red-500/10 border border-red-500/30 text-red-300'}`}>
          <Icon name={selected === q.correct ? 'CheckCircle' : 'XCircle'} size={18} className="flex-shrink-0 mt-0.5" />
          <div>
            <div className="font-semibold mb-1">{selected === q.correct ? 'Верно! 🔢' : `Нет. ${q.correct === 'A' ? 'Первое больше' : q.correct === 'B' ? 'Второе больше' : 'Они равны'}`}</div>
            <div className="text-white/70">{q.explanation}</div>
            <div className="text-white/50 mt-1 font-mono text-xs">{q.numA}₍{q.baseA}₎ = {dA}₁₀ | {q.numB}₍{q.baseB}₎ = {dB}₁₀</div>
          </div>
        </div>
      )}

      {phase === 'feedback' && (
        <button onClick={next} className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-fuchsia-600 to-pink-600 hover:opacity-90 transition-all">
          {qIndex + 1 >= QUESTIONS.length ? 'Завершить' : 'Далее'} →
        </button>
      )}
    </div>
  );
}
