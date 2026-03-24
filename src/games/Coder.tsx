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
  { text: 'Какой ASCII-код у буквы "A"?', options: ['65', '97', '64', '66'], correct: 0, explanation: 'Заглавная A = 65 в ASCII. Строчная a = 97.' },
  { text: 'Зашифруй "КОТ" шифром Цезаря со сдвигом +3 (кириллица)', options: ['НРШ', 'ЙМС', 'НРЧ', 'МРШ'], correct: 0, explanation: 'К→Н, О→Р, Т→Ш (сдвиг +3 по алфавиту)' },
  { text: 'Декодируй ASCII: 72 101 108 108 111', options: ['Hello', 'World', 'HeLLo', 'Helo'], correct: 0, explanation: 'H=72, e=101, l=108, l=108, o=111 → Hello' },
  { text: 'Буква "B" в ASCII = 66. Какой код у "E"?', options: ['69', '70', '68', '71'], correct: 0, explanation: 'B=66, C=67, D=68, E=69 (последовательно)' },
  { text: 'Шифр Цезаря: "ДВЕРЬ" со сдвигом +1', options: ['ЕГЛЕЯ', 'ВДЕРЬ', 'ГЁЖСЭ', 'ДГЕСЮ'], correct: 0, explanation: 'Д→Е, В→Г, Е→Ж, Р→С, Ь→Э' },
  { text: 'В кодировке Unicode символ занимает 2 байта. Сколько бит?', options: ['8', '4', '16', '32'], correct: 2, explanation: '2 байта × 8 бит = 16 бит' },
  { text: 'ASCII-код пробела?', options: ['0', '32', '64', '31'], correct: 1, explanation: 'Пробел (Space) = 32 в ASCII' },
  { text: 'Декодируй шифр Цезаря сдвиг -1: "НПФЕТ"', options: ['МОСДС', 'МОСДС', 'МПУДТ', 'НОТЕС'], correct: 1, explanation: 'Н→М, П→О, Ф→С, Е→Д, Т→С → МОСДС' },
  { text: '"a" в ASCII = 97. Какой символ у кода 122?', options: ['x', 'y', 'z', 'w'], correct: 2, explanation: '122 - 97 = 25, 25-я буква алфавита = z' },
  { text: 'Сколько символов можно закодировать 1 байтом?', options: ['128', '512', '256', '64'], correct: 2, explanation: '2⁸ = 256 различных значений (0–255)' },
];

interface Props {
  onFinish: (result: Omit<GameResult, 'playedAt'>) => void;
}

export default function Coder({ onFinish }: Props) {
  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [phase, setPhase] = useState<'question' | 'feedback'>('question');
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
      onFinish({
        gameId: 'coder',
        score: Math.round((correct / QUESTIONS.length) * 100),
        maxScore: 100,
        correctAnswers: correct,
        totalQuestions: QUESTIONS.length,
        timeSpent: Math.round((Date.now() - startTime) / 1000),
        difficulty: 'easy',
      });
    } else {
      setQIndex((i) => i + 1);
      setSelected(null);
      setPhase('question');
      setTimeLeft(30);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="text-white/50 text-sm">Вопрос {qIndex + 1} / {QUESTIONS.length}</div>
        <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-bold ${timeLeft <= 10 ? 'bg-red-500/20 text-red-400' : 'bg-white/10 text-white/70'}`}>
          <Icon name="Clock" size={14} />{timeLeft}с
        </div>
        <div className="text-white/50 text-sm">Счёт: <span className="text-white font-bold">{score}</span></div>
      </div>

      <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
        <div className="progress-bar h-full" style={{ width: `${(qIndex / QUESTIONS.length) * 100}%` }} />
      </div>

      <div className="card-glow rounded-2xl p-6 font-mono">
        <p className="text-white text-xl font-semibold leading-relaxed">{q.text}</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {q.options.map((opt, idx) => {
          let cls = 'card-glow rounded-xl p-4 text-left text-white font-medium transition-all cursor-pointer border font-mono ';
          if (phase === 'feedback') {
            if (idx === q.correct) cls += 'game-correct border-emerald-500/80';
            else if (idx === selected) cls += 'game-wrong border-red-500/80';
            else cls += 'opacity-40 border-white/10';
          } else {
            cls += 'border-white/10 hover:border-cyan-500/50 hover:bg-cyan-500/5';
          }
          return <button key={idx} className={cls} onClick={() => handleAnswer(idx)}><span className="text-white/40 mr-2">{String.fromCharCode(65 + idx)})</span>{opt}</button>;
        })}
      </div>

      {phase === 'feedback' && (
        <div className={`rounded-xl p-4 text-sm flex items-start gap-3 ${selected === q.correct ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300' : 'bg-red-500/10 border border-red-500/30 text-red-300'}`}>
          <Icon name={selected === q.correct ? 'CheckCircle' : 'XCircle'} size={18} className="flex-shrink-0 mt-0.5" />
          <div>
            <div className="font-semibold mb-1">{selected === q.correct ? 'Правильно! 🔐' : `Неверно. Правильный ответ: ${q.options[q.correct]}`}</div>
            <div className="text-white/70">{q.explanation}</div>
          </div>
        </div>
      )}

      {phase === 'feedback' && (
        <button onClick={next} className="btn-cyan w-full text-center">
          {qIndex + 1 >= QUESTIONS.length ? 'Завершить игру' : 'Следующий вопрос'} →
        </button>
      )}
    </div>
  );
}
