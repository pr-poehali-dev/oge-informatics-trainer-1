import { useState, useEffect, useCallback } from 'react';
import Icon from '@/components/ui/icon';
import { GameResult } from '@/types/game';

interface Question {
  text: string;
  options: string[];
  correct: number;
  explanation: string;
}

const QUESTIONS: Question[] = [
  { text: 'Сколько байт в 1 килобайте?', options: ['1000', '1024', '512', '2048'], correct: 1, explanation: '1 КБ = 2¹⁰ = 1024 байт' },
  { text: 'Сколько килобайт в 1 мегабайте?', options: ['1000', '512', '1024', '2048'], correct: 2, explanation: '1 МБ = 1024 КБ' },
  { text: 'Сколько мегабайт в 1 гигабайте?', options: ['1000', '1024', '256', '512'], correct: 1, explanation: '1 ГБ = 1024 МБ' },
  { text: 'Сколько байт занимает текст из 256 символов в кодировке ASCII (1 байт/символ)?', options: ['128', '512', '256', '1024'], correct: 2, explanation: '256 символов × 1 байт = 256 байт' },
  { text: 'Изображение имеет разрешение 800×600 пикселей, каждый пиксель — 3 байта. Размер файла?', options: ['1440 КБ', '1406,25 КБ', '1500 КБ', '1024 КБ'], correct: 1, explanation: '800×600×3 = 1 440 000 байт ÷ 1024 ≈ 1406,25 КБ' },
  { text: 'Сколько бит в 1 байте?', options: ['4', '16', '8', '2'], correct: 2, explanation: '1 байт = 8 бит — основа основ!' },
  { text: 'Текст 4 КБ = сколько байт?', options: ['4000', '4096', '4192', '2048'], correct: 1, explanation: '4 × 1024 = 4096 байт' },
  { text: '1 Гб = ? Мб', options: ['1000', '512', '2048', '1024'], correct: 3, explanation: '1 ГБ = 1024 МБ' },
  { text: 'Сколько бит в 1 килобайте?', options: ['1024', '8192', '4096', '2048'], correct: 1, explanation: '1 КБ = 1024 байт × 8 бит = 8192 бит' },
  { text: 'Файл занимает 2 МБ. Сколько это байт?', options: ['2 000 000', '2 048 576', '2 097 152', '2 000 024'], correct: 2, explanation: '2 × 1024 × 1024 = 2 097 152 байт' },
];

interface Props {
  onFinish: (result: Omit<GameResult, 'playedAt'>) => void;
}

export default function MemoryBytes({ onFinish }: Props) {
  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [phase, setPhase] = useState<'question' | 'feedback' | 'done'>('question');
  const [startTime] = useState(Date.now());

  const q = QUESTIONS[qIndex];

  const handleTimeout = useCallback(() => {
    if (phase !== 'question') return;
    setSelected(-1);
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

  function handleAnswer(idx: number) {
    if (phase !== 'question') return;
    setSelected(idx);
    setPhase('feedback');
    if (idx === q.correct) {
      setScore((s) => s + 10);
      setCorrect((c) => c + 1);
    }
  }

  function next() {
    if (qIndex + 1 >= QUESTIONS.length) {
      const finalScore = Math.round((correct / QUESTIONS.length) * 100);
      onFinish({
        gameId: 'memory-bytes',
        score: finalScore,
        maxScore: 100,
        correctAnswers: correct,
        totalQuestions: QUESTIONS.length,
        timeSpent: Math.round((Date.now() - startTime) / 1000),
        difficulty: 'easy',
      });
      setPhase('done');
    } else {
      setQIndex((i) => i + 1);
      setSelected(null);
      setPhase('question');
      setTimeLeft(30);
    }
  }

  if (phase === 'done') return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="text-white/50 text-sm">Вопрос {qIndex + 1} / {QUESTIONS.length}</div>
        <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-bold ${timeLeft <= 10 ? 'bg-red-500/20 text-red-400' : 'bg-white/10 text-white/70'}`}>
          <Icon name="Clock" size={14} />
          {timeLeft}с
        </div>
        <div className="text-white/50 text-sm">Счёт: <span className="text-white font-bold">{score}</span></div>
      </div>

      <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
        <div className="progress-bar h-full transition-all" style={{ width: `${((qIndex) / QUESTIONS.length) * 100}%` }} />
      </div>

      <div className="card-glow rounded-2xl p-6">
        <p className="text-white text-xl font-semibold leading-relaxed">{q.text}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {q.options.map((opt, idx) => {
          let cls = 'card-glow rounded-xl p-4 text-left text-white font-medium transition-all cursor-pointer border ';
          if (phase === 'feedback') {
            if (idx === q.correct) cls += 'game-correct border-emerald-500/80 bg-emerald-500/10';
            else if (idx === selected) cls += 'game-wrong border-red-500/80 bg-red-500/10';
            else cls += 'opacity-40 border-white/10';
          } else {
            cls += 'border-white/10 hover:border-purple-500/50 hover:bg-purple-500/5';
          }
          return (
            <button key={idx} className={cls} onClick={() => handleAnswer(idx)}>
              <span className="mr-2 text-white/40">{String.fromCharCode(65 + idx)})</span>
              {opt}
            </button>
          );
        })}
      </div>

      {phase === 'feedback' && (
        <div className={`rounded-xl p-4 text-sm flex items-start gap-3 ${selected === q.correct ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300' : 'bg-red-500/10 border border-red-500/30 text-red-300'}`}>
          <Icon name={selected === q.correct ? 'CheckCircle' : 'XCircle'} size={18} className="flex-shrink-0 mt-0.5" />
          <div>
            <div className="font-semibold mb-1">{selected === q.correct ? 'Правильно! 🎉' : `Неверно. Правильный ответ: ${q.options[q.correct]}`}</div>
            <div className="text-white/70">{q.explanation}</div>
          </div>
        </div>
      )}

      {phase === 'feedback' && (
        <button onClick={next} className="btn-primary w-full text-center">
          {qIndex + 1 >= QUESTIONS.length ? 'Завершить игру' : 'Следующий вопрос'} →
        </button>
      )}
    </div>
  );
}
