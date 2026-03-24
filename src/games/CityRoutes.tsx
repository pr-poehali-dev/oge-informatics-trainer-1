import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { GameResult } from '@/types/game';

const QUESTIONS = [
  {
    text: 'Граф: А→Б, А→В, Б→Г, В→Г. Сколько путей из А в Г?',
    diagram: 'А ──→ Б ──→ Г\n│         ↑\n└──→ В ──┘',
    options: ['1', '2', '3', '4'],
    correct: 1,
    explanation: 'Путь 1: А→Б→Г. Путь 2: А→В→Г. Итого 2 пути.',
  },
  {
    text: 'Граф: А→Б, А→В, Б→В, Б→Г, В→Г. Путей из А в Г?',
    diagram: 'А→Б→Г\nА→В→Г\nА→Б→В→Г',
    options: ['2', '3', '4', '1'],
    correct: 1,
    explanation: '1: А→Б→Г, 2: А→В→Г, 3: А→Б→В→Г. Итого 3 пути.',
  },
  {
    text: 'Сколько путей из 1 в 4 в графе: 1→2, 1→3, 2→4, 3→4, 2→3?',
    diagram: '1→2→4\n1→3→4\n1→2→3→4',
    options: ['2', '3', '4', '1'],
    correct: 1,
    explanation: '1→2→4, 1→3→4, 1→2→3→4 — всего 3 пути.',
  },
  {
    text: 'Ориентированный граф: А→Б→В→Г. Сколько путей из А в Г?',
    diagram: 'А → Б → В → Г',
    options: ['1', '2', '3', '4'],
    correct: 0,
    explanation: 'Единственный путь: А→Б→В→Г. Только 1 путь.',
  },
  {
    text: 'Граф: А→Б, А→В, А→Г, Б→Д, В→Д, Г→Д. Путей из А в Д?',
    diagram: 'А→Б→Д\nА→В→Д\nА→Г→Д',
    options: ['2', '3', '4', '6'],
    correct: 1,
    explanation: '3 пути: через Б, через В, через Г.',
  },
  {
    text: 'Что такое путь в графе?',
    options: ['Любое ребро', 'Последовательность вершин, где каждые две соединены ребром', 'Одна вершина', 'Цикл'],
    correct: 1,
    explanation: 'Путь — последовательность вершин v1, v2, ..., vk, где каждая пара соседних соединена ребром',
  },
  {
    text: 'Граф: P→Q, P→S, Q→T, S→Q, S→T. Путей из P в T?',
    diagram: 'P→Q→T\nP→S→T\nP→S→Q→T',
    options: ['2', '3', '4', '1'],
    correct: 1,
    explanation: '3 пути: P→Q→T, P→S→T, P→S→Q→T',
  },
  {
    text: 'Если в ориентированном графе N вершин-городов расположены в цепочку (A→B→C→...→N), сколько путей из первого в последний?',
    options: ['N', '1', 'N-1', '2^N'],
    correct: 1,
    explanation: 'В цепочке ровно 1 путь — нет ветвлений, всегда только один маршрут',
  },
  {
    text: 'Граф: М→Н, М→О, Н→П, О→Н, О→П. Путей из М в П?',
    diagram: 'М→Н→П\nМ→О→П\nМ→О→Н→П',
    options: ['2', '3', '4', '1'],
    correct: 1,
    explanation: '3 пути: М→Н→П, М→О→П, М→О→Н→П',
  },
  {
    text: 'Алгоритм подсчёта путей: "число путей в вершину = сумма путей во все предыдущие вершины" — это...',
    options: ['Жадный алгоритм', 'Динамическое программирование', 'Рекурсия', 'Метод перебора'],
    correct: 1,
    explanation: 'Это классическая задача динамического программирования на DAG (направленном графе без циклов)',
  },
];

interface Props {
  onFinish: (result: Omit<GameResult, 'playedAt'>) => void;
}

export default function CityRoutes({ onFinish }: Props) {
  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [phase, setPhase] = useState<'question' | 'feedback'>('question');
  const [startTime] = useState(Date.now());

  const q = QUESTIONS[qIndex];

  function handleAnswer(idx: number) {
    if (phase !== 'question') return;
    setSelected(idx); setPhase('feedback');
    if (idx === q.correct) { setScore((s) => s + 10); setCorrect((c) => c + 1); }
  }

  function next() {
    if (qIndex + 1 >= QUESTIONS.length) {
      onFinish({ gameId: 'city-routes', score: Math.round((correct / QUESTIONS.length) * 100), maxScore: 100, correctAnswers: correct, totalQuestions: QUESTIONS.length, timeSpent: Math.round((Date.now() - startTime) / 1000), difficulty: 'medium' });
    } else { setQIndex((i) => i + 1); setSelected(null); setPhase('question'); }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="text-white/50 text-sm">Маршрут {qIndex + 1} / {QUESTIONS.length}</div>
        <div className="text-white/50 text-sm">Счёт: <span className="text-white font-bold">{score}</span></div>
      </div>
      <div className="w-full h-1.5 bg-white/10 rounded-full"><div className="progress-bar h-full" style={{ width: `${(qIndex / QUESTIONS.length) * 100}%` }} /></div>
      <div className="card-glow rounded-2xl p-6">
        <p className="text-white text-lg font-semibold mb-3">{q.text}</p>
        {'diagram' in q && (
          <pre className="text-cyan-300 font-mono text-sm bg-cyan-500/10 border border-cyan-500/20 rounded-xl p-4 whitespace-pre-wrap">{q.diagram}</pre>
        )}
      </div>
      <div className="grid grid-cols-2 gap-3">
        {q.options.map((opt, idx) => {
          let cls = 'card-glow rounded-xl p-5 text-center font-bold text-2xl transition-all cursor-pointer border ';
          if (phase === 'feedback') {
            if (idx === q.correct) cls += 'game-correct border-emerald-500/80 text-emerald-300';
            else if (idx === selected) cls += 'game-wrong border-red-500/80 text-red-300';
            else cls += 'opacity-40 border-white/10 text-white';
          } else cls += 'border-white/10 hover:border-blue-500/50 hover:bg-blue-500/5 text-white';
          return <button key={idx} className={cls} onClick={() => handleAnswer(idx)}>{opt}</button>;
        })}
      </div>
      {phase === 'feedback' && (
        <div className={`rounded-xl p-4 text-sm flex items-start gap-3 ${selected === q.correct ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300' : 'bg-red-500/10 border border-red-500/30 text-red-300'}`}>
          <Icon name={selected === q.correct ? 'CheckCircle' : 'XCircle'} size={18} className="flex-shrink-0 mt-0.5" />
          <div><div className="font-semibold mb-1">{selected === q.correct ? 'Маршрут проложен! 🏙️' : `Нет. Правильно: ${q.options[q.correct]}`}</div><div className="text-white/70">{q.explanation}</div></div>
        </div>
      )}
      {phase === 'feedback' && (
        <button onClick={next} className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90 transition-all">
          {qIndex + 1 >= QUESTIONS.length ? 'Завершить' : 'Далее'} →
        </button>
      )}
    </div>
  );
}
