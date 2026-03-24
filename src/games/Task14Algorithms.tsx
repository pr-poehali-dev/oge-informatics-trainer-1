import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { GameResult } from '@/types/game';

interface AlgoTask {
  title: string;
  theory: string;
  question: string;
  steps?: { label: string; value: string }[];
  placeholder: string;
  hint: string;
  check: (input: string) => { ok: boolean; result: string; explanation: string };
}

const TASKS: AlgoTask[] = [
  {
    title: 'Сортировка пузырьком — результат',
    theory: 'Сортировка пузырьком: сравниваем соседние элементы, меняем местами если левый > правого. Повторяем до конца.\nПроход 1: [3,1,4,1,5] → [1,3,1,4,5] → [1,1,3,4,5]',
    question: 'Примени сортировку пузырьком к массиву: [5, 3, 8, 1, 9, 2]. Что получится?',
    placeholder: 'Введи через запятую: 1,2,3...',
    hint: 'Пузырьковая сортировка упорядочивает по возрастанию',
    check: (v) => {
      const arr = v.split(',').map((s) => parseInt(s.trim()));
      const expected = [1, 2, 3, 5, 8, 9];
      const ok = arr.length === expected.length && arr.every((x, i) => x === expected[i]);
      return { ok, result: '1, 2, 3, 5, 8, 9', explanation: 'Исходный: [5,3,8,1,9,2]. После сортировки по возрастанию: [1,2,3,5,8,9]' };
    },
  },
  {
    title: 'Бинарный поиск — количество шагов',
    theory: 'Бинарный поиск: ищем в отсортированном массиве.\nШаг 1: берём средний элемент.\nЕсли он равен искомому — нашли!\nЕсли меньше — ищем в правой половине, иначе в левой.',
    question: 'Массив: [1, 3, 5, 7, 9, 11, 13, 15]. Ищем число 7. Сколько сравнений потребуется бинарному поиску?',
    placeholder: 'Введи количество сравнений',
    hint: 'Шаг 1: середина = 7 (индекс 3). 7 == 7? Да!',
    check: (v) => {
      const n = parseInt(v.trim());
      const ok = n === 1 || n === 2;
      return { ok, result: '1-2', explanation: 'Середина массива из 8 элементов — индекс 3 или 4. arr[3]=7. Одно сравнение — нашли!' };
    },
  },
  {
    title: 'Линейный поиск',
    theory: 'Линейный (последовательный) поиск: перебираем все элементы по порядку слева направо.\nВ худшем случае проверяем все N элементов.',
    question: 'Массив: [4, 7, 2, 9, 1, 6]. Линейный поиск числа 9. На каком шаге (сравнении) найдём?',
    placeholder: 'Введи номер шага',
    hint: 'Считаем с 1: шаг 1=4, шаг 2=7, шаг 3=2, шаг 4=?',
    check: (v) => {
      const n = parseInt(v.trim());
      const ok = n === 4;
      return { ok, result: '4', explanation: 'Шаг 1: arr[0]=4≠9, шаг 2: arr[1]=7≠9, шаг 3: arr[2]=2≠9, шаг 4: arr[3]=9=9 ✓' };
    },
  },
  {
    title: 'Факториал',
    theory: 'Факториал n! = 1 × 2 × 3 × ... × n\n0! = 1, 1! = 1, 2! = 2, 3! = 6, 4! = 24, 5! = 120\nВ программировании: result = 1; for i in range(1, n+1): result *= i',
    question: 'Вычисли 6! (факториал шести)',
    placeholder: 'Введи значение 6!',
    hint: '6! = 6 × 5 × 4 × 3 × 2 × 1',
    check: (v) => {
      const n = parseInt(v.trim());
      const ok = n === 720;
      return { ok, result: '720', explanation: '6! = 6×5×4×3×2×1 = 30×4×3×2×1 = 120×6 = 720' };
    },
  },
  {
    title: 'Число Фибоначчи',
    theory: 'Последовательность Фибоначчи: F(0)=0, F(1)=1, F(n)=F(n-1)+F(n-2)\n0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55...\nКаждое число = сумма двух предыдущих',
    question: 'Чему равно 10-е число Фибоначчи? (считая F(1)=1, F(2)=1)',
    placeholder: 'Введи 10-е число Фибоначчи',
    hint: 'F(7)=13, F(8)=21, F(9)=34, F(10)=?',
    check: (v) => {
      const n = parseInt(v.trim());
      const ok = n === 55;
      return { ok, result: '55', explanation: 'F: 1,1,2,3,5,8,13,21,34,55. F(10)=55' };
    },
  },
  {
    title: 'Алгоритм Евклида (НОД)',
    theory: 'НОД (наибольший общий делитель) — алгоритм Евклида:\nНОД(a, b) = НОД(b, a mod b), пока b ≠ 0\nПример: НОД(48, 18): НОД(18,12)→НОД(12,6)→НОД(6,0)=6',
    question: 'Найди НОД(36, 24) с помощью алгоритма Евклида',
    placeholder: 'Введи НОД',
    hint: 'НОД(36,24)→НОД(24,12)→НОД(12,0)=?',
    check: (v) => {
      const n = parseInt(v.trim());
      const ok = n === 12;
      return { ok, result: '12', explanation: 'НОД(36,24): 36 mod 24=12 → НОД(24,12): 24 mod 12=0 → НОД(12,0)=12' };
    },
  },
  {
    title: 'Сложность алгоритма',
    theory: 'Оценка сложности алгоритма:\n• O(1) — константное время (не зависит от N)\n• O(log N) — бинарный поиск\n• O(N) — линейный поиск\n• O(N²) — сортировка пузырьком\n• O(N log N) — быстрая сортировка',
    question: 'Массив из 1000 элементов. Сколько операций потребует линейный поиск в худшем случае?',
    placeholder: 'Введи количество операций',
    hint: 'Линейный поиск = O(N). N = 1000',
    check: (v) => {
      const n = parseInt(v.trim());
      const ok = n === 1000;
      return { ok, result: '1000', explanation: 'Линейный поиск O(N): в худшем случае (элемент последний или отсутствует) — N=1000 сравнений' };
    },
  },
  {
    title: 'Трассировка цикла',
    theory: 'Трассировка — пошаговое выполнение алгоритма вручную.\nЗаписываем значения переменных на каждом шаге цикла.\n\nПример: s=0; for i in 1..4: s = s + i\nШаг 1: s=1, шаг 2: s=3, шаг 3: s=6, шаг 4: s=10',
    question: 'Выполни трассировку: s=0; for i от 1 до 5: s = s + i*i. Чему равно s после цикла?',
    placeholder: 'Введи значение s',
    hint: 's = 1² + 2² + 3² + 4² + 5² = 1+4+9+16+25',
    check: (v) => {
      const n = parseInt(v.trim());
      const ok = n === 55;
      return { ok, result: '55', explanation: 's = 1²+2²+3²+4²+5² = 1+4+9+16+25 = 55' };
    },
  },
];

interface Props {
  onFinish: (result: Omit<GameResult, 'playedAt'>) => void;
}

export default function Task14Algorithms({ onFinish }: Props) {
  const [taskIndex, setTaskIndex] = useState(0);
  const [stage, setStage] = useState<'theory' | 'task' | 'feedback'>('theory');
  const [input, setInput] = useState('');
  const [feedback, setFeedback] = useState<{ ok: boolean; result: string; explanation: string } | null>(null);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [startTime] = useState(Date.now());

  const task = TASKS[taskIndex];

  function handleCheck() {
    if (!input.trim()) return;
    const fb = task.check(input);
    setFeedback(fb);
    setStage('feedback');
    if (fb.ok) { setScore((s) => s + 12); setCorrectCount((c) => c + 1); }
  }

  function handleNext() {
    if (taskIndex + 1 >= TASKS.length) {
      onFinish({ gameId: 'task14-algo', score: Math.min(100, score), maxScore: 100, correctAnswers: correctCount, totalQuestions: TASKS.length, timeSpent: Math.round((Date.now() - startTime) / 1000), difficulty: 'hard' });
    } else {
      setTaskIndex((i) => i + 1); setStage('theory'); setInput(''); setFeedback(null); setShowHint(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="text-white/50 text-sm">Задача {taskIndex + 1} / {TASKS.length}</div>
        <div className="text-white/50 text-sm">Счёт: <span className="text-white font-bold">{score}</span></div>
      </div>
      <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
        <div className="progress-bar h-full" style={{ width: `${(taskIndex / TASKS.length) * 100}%` }} />
      </div>

      {stage === 'theory' && (
        <div className="space-y-4 animate-fade-in">
          <div className="card-glow rounded-2xl p-6">
            <div className="text-orange-400 text-xs font-medium mb-2">⚙️ ЗАДАНИЕ 14 · {task.title}</div>
            <h3 className="text-white font-bold text-lg mb-4">Алгоритм</h3>
            <pre className="text-white/70 text-sm font-mono leading-relaxed whitespace-pre-wrap bg-white/5 rounded-xl p-4">{task.theory}</pre>
          </div>
          <button onClick={() => setStage('task')} className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-orange-600 to-amber-600 hover:opacity-90 transition-all">
            К практике →
          </button>
        </div>
      )}

      {stage === 'task' && (
        <div className="space-y-4 animate-fade-in">
          <div className="card-glow rounded-2xl p-6">
            <div className="text-orange-400 text-xs font-medium mb-2">⚙️ ЗАДАНИЕ 14 · {task.title}</div>
            <p className="text-white font-semibold text-lg leading-relaxed">{task.question}</p>
          </div>
          {showHint && (
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 text-amber-300 text-sm flex items-start gap-2">
              <Icon name="Lightbulb" size={16} className="flex-shrink-0 mt-0.5" />
              <div><div className="font-semibold mb-1">Подсказка</div>{task.hint}</div>
            </div>
          )}
          <div className="flex gap-3">
            <input value={input} onChange={(e) => setInput(e.target.value)} placeholder={task.placeholder}
              className="flex-1 bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white font-mono text-lg placeholder:text-white/30 focus:outline-none focus:border-orange-500/60"
              onKeyDown={(e) => e.key === 'Enter' && handleCheck()} />
            <button onClick={handleCheck} disabled={!input.trim()} className="bg-gradient-to-r from-orange-600 to-amber-600 text-white font-bold px-6 rounded-xl hover:opacity-90 transition-all">ОК</button>
          </div>
          {!showHint && <button onClick={() => setShowHint(true)} className="text-amber-400/60 hover:text-amber-400 text-sm flex items-center gap-1 transition-colors"><Icon name="Lightbulb" size={14} /> Подсказка</button>}
        </div>
      )}

      {stage === 'feedback' && feedback && (
        <div className="space-y-4 animate-fade-in">
          <div className={`rounded-2xl p-6 border ${feedback.ok ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
            <div className="flex items-center gap-3 mb-3">
              <Icon name={feedback.ok ? 'CheckCircle' : 'XCircle'} size={24} className={feedback.ok ? 'text-emerald-400' : 'text-red-400'} />
              <div className={`text-xl font-black ${feedback.ok ? 'text-emerald-300' : 'text-red-300'}`}>
                {feedback.ok ? 'Алгоритм верный! ⚙️' : `Нет. Правильный ответ: ${feedback.result}`}
              </div>
            </div>
            <div className="text-white/70 text-sm font-mono bg-white/5 rounded-xl p-3">{feedback.explanation}</div>
          </div>
          <button onClick={handleNext} className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-orange-600 to-amber-600 hover:opacity-90 transition-all">
            {taskIndex + 1 >= TASKS.length ? 'Завершить игру' : 'Далее'} →
          </button>
        </div>
      )}
    </div>
  );
}
