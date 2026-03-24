import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { GameResult } from '@/types/game';

interface Task {
  id: number;
  title: string;
  theory: string;
  question: string;
  placeholder: string;
  check: (input: string) => { ok: boolean; result: string; explanation: string };
  hint: string;
  example: string;
}

const TASKS: Task[] = [
  {
    id: 1,
    title: 'Средний балл',
    theory: 'Среднее арифметическое = сумма всех значений ÷ количество значений.\nПример: оценки 4, 5, 3, 5 → среднее = (4+5+3+5)/4 = 17/4 = 4.25',
    question: 'Оценки студентов: 4, 5, 3, 5, 4, 2, 5, 4. Вычисли средний балл (округли до 2 знаков).',
    placeholder: 'Введи ответ, например: 4.00',
    hint: 'Сложи все оценки и раздели на их количество',
    example: '(4+5+3+5+4+2+5+4) / 8 = ?',
    check: (v) => {
      const n = parseFloat(v.replace(',', '.'));
      const correct = (4 + 5 + 3 + 5 + 4 + 2 + 5 + 4) / 8;
      const ok = Math.abs(n - correct) < 0.05;
      return { ok, result: correct.toFixed(2), explanation: `Сумма: 4+5+3+5+4+2+5+4 = 32. Количество: 8. Среднее: 32÷8 = 4.00` };
    },
  },
  {
    id: 2,
    title: 'Максимальный элемент',
    theory: 'Поиск максимума: перебираем все элементы, запоминаем наибольший.\nАлгоритм: max = arr[0]; for x in arr: if x > max: max = x',
    question: 'В массиве: 17, 42, 8, 99, 3, 56, 71, 23. Найди максимальный элемент.',
    placeholder: 'Введи максимальное число',
    hint: 'Просто найди самое большое число в списке',
    example: 'max(17, 42, 8, 99, 3, 56, 71, 23) = ?',
    check: (v) => {
      const n = parseInt(v.trim());
      const ok = n === 99;
      return { ok, result: '99', explanation: 'Перебираем: 17, 42(>17), 8, 99(>42), 3, 56, 71, 23. Максимум = 99' };
    },
  },
  {
    id: 3,
    title: 'Подсчёт элементов',
    theory: 'Подсчёт по условию: перебираем список, считаем элементы, удовлетворяющие условию.\ncounter = 0; for x in arr: if условие: counter += 1',
    question: 'Оценки класса: 3, 5, 4, 2, 5, 3, 4, 5, 2, 4, 5, 3. Сколько отличников (оценка 5)?',
    placeholder: 'Введи количество пятёрок',
    hint: 'Посчитай, сколько раз встречается цифра 5',
    example: 'Список: 3, 5, 4, 2, 5, 3, 4, 5, 2, 4, 5, 3',
    check: (v) => {
      const n = parseInt(v.trim());
      const arr = [3, 5, 4, 2, 5, 3, 4, 5, 2, 4, 5, 3];
      const cnt = arr.filter((x) => x === 5).length;
      const ok = n === cnt;
      return { ok, result: String(cnt), explanation: `Пятёрки: позиции 2, 5, 8, 11 (с 1). Итого: ${cnt} отличника` };
    },
  },
  {
    id: 4,
    title: 'Сумма чётных',
    theory: 'Чётное число делится на 2 без остатка. Признак: x % 2 == 0\nАлгоритм: total = 0; for x in arr: if x % 2 == 0: total += x',
    question: 'Числа: 1, 4, 7, 12, 9, 6, 15, 8, 3, 10. Найди сумму всех чётных чисел.',
    placeholder: 'Введи сумму чётных',
    hint: 'Чётные: делятся на 2 без остатка (4, 12, 6, 8, 10)',
    example: 'Чётные из [1,4,7,12,9,6,15,8,3,10] = ?',
    check: (v) => {
      const n = parseInt(v.trim());
      const arr = [1, 4, 7, 12, 9, 6, 15, 8, 3, 10];
      const sum = arr.filter((x) => x % 2 === 0).reduce((a, b) => a + b, 0);
      const ok = n === sum;
      return { ok, result: String(sum), explanation: `Чётные: 4, 12, 6, 8, 10. Сумма: 4+12+6+8+10 = ${sum}` };
    },
  },
  {
    id: 5,
    title: 'Медиана',
    theory: 'Медиана — центральный элемент отсортированного массива.\nЕсли элементов чётное количество — среднее двух центральных.',
    question: 'Найди медиану: 7, 2, 15, 4, 9, 1, 11. Отсортируй и определи центральный элемент.',
    placeholder: 'Введи медиану',
    hint: 'Сначала отсортируй по возрастанию, потом возьми средний элемент',
    example: 'Отсортировано: 1, 2, 4, 7, 9, 11, 15 → центр = ?',
    check: (v) => {
      const n = parseInt(v.trim());
      const ok = n === 7;
      return { ok, result: '7', explanation: 'Отсортировано: [1, 2, 4, 7, 9, 11, 15]. 7 элементов, центральный (4-й) = 7' };
    },
  },
  {
    id: 6,
    title: 'Минимум и его позиция',
    theory: 'Поиск минимума с позицией:\nmin_val = arr[0]; min_idx = 0\nfor i in range(len(arr)): if arr[i] < min_val: min_val=arr[i]; min_idx=i',
    question: 'Массив: 34, 12, 67, 5, 89, 23, 45. На какой позиции (с 1) стоит минимальный элемент?',
    placeholder: 'Введи номер позиции (с 1)',
    hint: 'Найди самый маленький элемент и запомни его место',
    example: '[34, 12, 67, 5, 89, 23, 45] → минимум = 5, позиция = ?',
    check: (v) => {
      const n = parseInt(v.trim());
      const ok = n === 4;
      return { ok, result: '4', explanation: '[34, 12, 67, 5, 89, 23, 45]: минимум = 5 находится на 4-й позиции (считая с 1)' };
    },
  },
  {
    id: 7,
    title: 'Уникальные элементы',
    theory: 'Множество (set) хранит только уникальные значения.\nКоличество уникальных: len(set(arr))',
    question: 'Список оценок: 4, 5, 3, 4, 5, 2, 3, 4, 5, 4. Сколько уникальных оценок?',
    placeholder: 'Введи количество уникальных оценок',
    hint: 'Запиши, какие разные оценки встречаются в списке',
    example: '{4, 5, 3, 4, 5, 2, 3, 4, 5, 4} → уникальных = ?',
    check: (v) => {
      const n = parseInt(v.trim());
      const arr = [4, 5, 3, 4, 5, 2, 3, 4, 5, 4];
      const uniq = new Set(arr).size;
      const ok = n === uniq;
      return { ok, result: String(uniq), explanation: `Уникальные оценки: 2, 3, 4, 5. Итого: ${uniq} различных значения` };
    },
  },
  {
    id: 8,
    title: 'Процентное соотношение',
    theory: 'Процент = (часть / целое) × 100\nПример: 15 из 60 = (15/60)×100 = 25%',
    question: 'В классе 30 учеников. 18 сдали экзамен успешно. Какой процент сдавших?',
    placeholder: 'Введи процент (число без %)',
    hint: 'Раздели число сдавших на общее число и умножь на 100',
    example: '18/30 × 100 = ?',
    check: (v) => {
      const n = parseFloat(v.replace(',', '.'));
      const ok = Math.abs(n - 60) < 0.5;
      return { ok, result: '60', explanation: '(18 / 30) × 100 = 0.6 × 100 = 60%' };
    },
  },
];

interface Props {
  onFinish: (result: Omit<GameResult, 'playedAt'>) => void;
}

export default function Task13DataWork({ onFinish }: Props) {
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
      onFinish({
        gameId: 'task13-data',
        score: Math.min(100, score),
        maxScore: 100,
        correctAnswers: correctCount,
        totalQuestions: TASKS.length,
        timeSpent: Math.round((Date.now() - startTime) / 1000),
        difficulty: 'medium',
      });
    } else {
      setTaskIndex((i) => i + 1);
      setStage('theory');
      setInput('');
      setFeedback(null);
      setShowHint(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="text-white/50 text-sm">Задача {taskIndex + 1} / {TASKS.length}</div>
        <div className="flex gap-2">
          {['theory', 'task', 'feedback'].map((s, i) => (
            <div key={s} className={`w-2 h-2 rounded-full ${stage === s ? 'bg-purple-400' : i < ['theory', 'task', 'feedback'].indexOf(stage) ? 'bg-emerald-400' : 'bg-white/20'}`} />
          ))}
        </div>
        <div className="text-white/50 text-sm">Счёт: <span className="text-white font-bold">{score}</span></div>
      </div>

      <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
        <div className="progress-bar h-full" style={{ width: `${(taskIndex / TASKS.length) * 100}%` }} />
      </div>

      {stage === 'theory' && (
        <div className="space-y-4 animate-fade-in">
          <div className="card-glow rounded-2xl p-6">
            <div className="text-purple-400 text-xs font-medium mb-2">📊 ЗАДАНИЕ 13 · {task.title}</div>
            <h3 className="text-white font-bold text-lg mb-4">Теория</h3>
            <pre className="text-white/70 text-sm font-mono leading-relaxed whitespace-pre-wrap bg-white/5 rounded-xl p-4">{task.theory}</pre>
          </div>
          <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-xl p-4">
            <div className="text-cyan-300 text-xs font-medium mb-1">Пример</div>
            <div className="text-white/70 text-sm font-mono">{task.example}</div>
          </div>
          <button onClick={() => setStage('task')} className="btn-primary w-full py-3">
            Перейти к заданию →
          </button>
        </div>
      )}

      {stage === 'task' && (
        <div className="space-y-4 animate-fade-in">
          <div className="card-glow rounded-2xl p-6">
            <div className="text-purple-400 text-xs font-medium mb-2">📊 ЗАДАНИЕ 13 · {task.title}</div>
            <p className="text-white font-semibold text-lg leading-relaxed">{task.question}</p>
          </div>

          {showHint && (
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 text-amber-300 text-sm flex items-start gap-2">
              <Icon name="Lightbulb" size={16} className="flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold mb-1">Подсказка</div>
                <div>{task.hint}</div>
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={task.placeholder}
              className="flex-1 bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white font-mono text-lg placeholder:text-white/30 focus:outline-none focus:border-purple-500/60"
              onKeyDown={(e) => e.key === 'Enter' && handleCheck()}
            />
            <button onClick={handleCheck} disabled={!input.trim()} className="btn-primary px-6">ОК</button>
          </div>

          {!showHint && (
            <button onClick={() => setShowHint(true)} className="text-amber-400/60 hover:text-amber-400 text-sm flex items-center gap-1 transition-colors">
              <Icon name="Lightbulb" size={14} /> Показать подсказку
            </button>
          )}
        </div>
      )}

      {stage === 'feedback' && feedback && (
        <div className="space-y-4 animate-fade-in">
          <div className={`rounded-2xl p-6 border ${feedback.ok ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
            <div className="flex items-center gap-3 mb-3">
              <Icon name={feedback.ok ? 'CheckCircle' : 'XCircle'} size={24} className={feedback.ok ? 'text-emerald-400' : 'text-red-400'} />
              <div className={`text-xl font-black ${feedback.ok ? 'text-emerald-300' : 'text-red-300'}`}>
                {feedback.ok ? 'Правильно! 📊' : `Неверно. Ответ: ${feedback.result}`}
              </div>
            </div>
            <div className="text-white/70 text-sm font-mono bg-white/5 rounded-xl p-3">{feedback.explanation}</div>
          </div>
          <button onClick={handleNext} className="btn-primary w-full py-3">
            {taskIndex + 1 >= TASKS.length ? 'Завершить игру' : 'Следующая задача'} →
          </button>
        </div>
      )}
    </div>
  );
}
