import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { GameResult } from '@/types/game';

interface Task {
  question: string;
  cities: string[];
  roads: { from: string; to: string; dist: number }[];
  goal: string;
  correctEdges: string[];
  totalDist: number;
  explanation: string;
}

const TASKS: Task[] = [
  {
    question: 'Найди минимальный путь из А в D',
    cities: ['А', 'Б', 'В', 'D'],
    roads: [
      { from: 'А', to: 'Б', dist: 5 },
      { from: 'А', to: 'В', dist: 3 },
      { from: 'Б', to: 'D', dist: 4 },
      { from: 'В', to: 'D', dist: 6 },
      { from: 'В', to: 'Б', dist: 1 },
    ],
    goal: 'Выбери маршрут с минимальной суммарной длиной',
    correctEdges: ['А-В', 'В-Б', 'Б-D'],
    totalDist: 8,
    explanation: 'А→В(3)→Б(1)→D(4) = 8 км — оптимальный путь!',
  },
  {
    question: 'Минимальная дорога из П в Р',
    cities: ['П', 'Е', 'К', 'Р'],
    roads: [
      { from: 'П', to: 'Е', dist: 7 },
      { from: 'П', to: 'К', dist: 2 },
      { from: 'К', to: 'Е', dist: 3 },
      { from: 'Е', to: 'Р', dist: 5 },
      { from: 'К', to: 'Р', dist: 8 },
    ],
    goal: 'Найди путь с наименьшим расстоянием',
    correctEdges: ['П-К', 'К-Е', 'Е-Р'],
    totalDist: 10,
    explanation: 'П→К(2)→Е(3)→Р(5) = 10 км. Прямой П→Е→Р = 12 км.',
  },
];

const QUESTIONS = [
  { text: 'Граф — это...', options: ['Вид диаграммы', 'Набор вершин и рёбер', 'Таблица данных', 'Математическая функция'], correct: 1, explanation: 'Граф = вершины (города) + рёбра (дороги между ними)' },
  { text: 'Что называется взвешенным графом?', options: ['Граф с числовыми весами рёбер', 'Граф без вершин', 'Граф с одной вершиной', 'Граф с петлями'], correct: 0, explanation: 'Взвешенный граф — каждому ребру присвоено числовое значение (расстояние, время)' },
  { text: 'Смежные вершины — это...', options: ['Вершины одного уровня', 'Вершины, соединённые ребром', 'Начальная и конечная вершина', 'Изолированные вершины'], correct: 1, explanation: 'Смежные вершины соединены ребром напрямую' },
  { text: 'В задаче "кратчайший путь" нужно найти маршрут с...', options: ['Максимальной суммой весов', 'Минимальной суммой весов', 'Наибольшим числом вершин', 'Чётным числом рёбер'], correct: 1, explanation: 'Кратчайший путь — маршрут с минимальной суммарной стоимостью (расстоянием)' },
  { text: 'Степень вершины — это...', options: ['Её порядковый номер', 'Количество рёбер, ведущих из неё', 'Расстояние до другой вершины', 'Уровень в иерархии'], correct: 1, explanation: 'Степень = количество рёбер, которые входят/выходят из вершины' },
  { text: 'Если граф содержит N вершин и каждая соединена с каждой — это...', options: ['Пустой граф', 'Путь', 'Полный граф', 'Дерево'], correct: 2, explanation: 'Полный граф Kn: каждая пара вершин соединена ребром. Кол-во рёбер = N(N-1)/2' },
  { text: 'Дерево в теории графов — это...', options: ['Связный граф без циклов', 'Граф с максимальным числом рёбер', 'Ориентированный граф', 'Граф с одной вершиной'], correct: 0, explanation: 'Дерево = связный граф без циклов. N вершин → N-1 рёбер' },
  { text: 'В ориентированном графе рёбра называются...', options: ['Ветвями', 'Дугами', 'Связями', 'Путями'], correct: 1, explanation: 'В ориентированном (направленном) графе рёбра с направлением = дуги' },
];

interface Props {
  onFinish: (result: Omit<GameResult, 'playedAt'>) => void;
}

export default function RoadArchitect({ onFinish }: Props) {
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
    if (idx === q.correct) {
      setScore((s) => s + 10);
      setCorrect((c) => c + 1);
    }
  }

  function next() {
    if (qIndex + 1 >= QUESTIONS.length) {
      onFinish({
        gameId: 'road-architect',
        score: Math.round((correct / QUESTIONS.length) * 100),
        maxScore: 100,
        correctAnswers: correct,
        totalQuestions: QUESTIONS.length,
        timeSpent: Math.round((Date.now() - startTime) / 1000),
        difficulty: 'medium',
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
        <div className="text-white/50 text-sm">Вопрос {qIndex + 1} / {QUESTIONS.length}</div>
        <div className="text-white/50 text-sm">Счёт: <span className="text-white font-bold">{score}</span></div>
      </div>
      <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
        <div className="progress-bar h-full" style={{ width: `${(qIndex / QUESTIONS.length) * 100}%` }} />
      </div>
      <div className="card-glow rounded-2xl p-6">
        <p className="text-white text-xl font-semibold">{q.text}</p>
      </div>
      <div className="grid grid-cols-1 gap-3">
        {q.options.map((opt, idx) => {
          let cls = 'card-glow rounded-xl p-4 text-left text-white font-medium transition-all cursor-pointer border ';
          if (phase === 'feedback') {
            if (idx === q.correct) cls += 'game-correct border-emerald-500/80';
            else if (idx === selected) cls += 'game-wrong border-red-500/80';
            else cls += 'opacity-40 border-white/10';
          } else {
            cls += 'border-white/10 hover:border-orange-500/50 hover:bg-orange-500/5';
          }
          return <button key={idx} className={cls} onClick={() => handleAnswer(idx)}><span className="text-white/40 mr-2">{String.fromCharCode(65 + idx)})</span>{opt}</button>;
        })}
      </div>
      {phase === 'feedback' && (
        <div className={`rounded-xl p-4 text-sm flex items-start gap-3 ${selected === q.correct ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300' : 'bg-red-500/10 border border-red-500/30 text-red-300'}`}>
          <Icon name={selected === q.correct ? 'CheckCircle' : 'XCircle'} size={18} className="flex-shrink-0 mt-0.5" />
          <div>
            <div className="font-semibold mb-1">{selected === q.correct ? 'Верно! 🗺️' : `Неверно. Ответ: ${q.options[q.correct]}`}</div>
            <div className="text-white/70">{q.explanation}</div>
          </div>
        </div>
      )}
      {phase === 'feedback' && (
        <button onClick={next} className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-orange-600 to-amber-600 hover:opacity-90 transition-all">
          {qIndex + 1 >= QUESTIONS.length ? 'Завершить' : 'Далее'} →
        </button>
      )}
    </div>
  );
}
