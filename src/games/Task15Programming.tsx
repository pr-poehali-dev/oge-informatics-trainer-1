import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { GameResult } from '@/types/game';

interface CodeTask {
  title: string;
  theory: string;
  description: string;
  codeTemplate: string;
  question: string;
  placeholder: string;
  hint: string;
  check: (input: string) => { ok: boolean; result: string; explanation: string };
}

const TASKS: CodeTask[] = [
  {
    title: 'Чётные числа',
    theory: 'Остаток от деления: x % 2 == 0 → число чётное\nЦикл for: for i in range(start, end+1)\nВывод: print(i)',
    description: 'Нужно вывести все чётные числа от 1 до 20',
    codeTemplate: `for i in range(1, 21):
    if i % 2 == 0:
        print(i)`,
    question: 'Какое последнее число выведет эта программа?',
    placeholder: 'Введи последнее чётное число',
    hint: 'Чётные от 1 до 20: 2, 4, 6, ... последнее = ?',
    check: (v) => {
      const n = parseInt(v.trim());
      const ok = n === 20;
      return { ok, result: '20', explanation: 'Чётные от 1 до 20: 2,4,6,8,10,12,14,16,18,20. Последнее = 20' };
    },
  },
  {
    title: 'Цикл while',
    theory: 'Цикл while выполняется ПОКА условие истинно:\nwhile условие:\n    тело цикла\n    изменение переменной',
    description: 'Подсчёт суммы цифр числа',
    codeTemplate: `n = 12345
s = 0
while n > 0:
    s = s + (n % 10)
    n = n // 10
print(s)`,
    question: 'Что выведет программа? (Сумма цифр числа 12345)',
    placeholder: 'Введи сумму цифр',
    hint: '1+2+3+4+5 = ?',
    check: (v) => {
      const n = parseInt(v.trim());
      const ok = n === 15;
      return { ok, result: '15', explanation: 'Цифры: 1,2,3,4,5. Сумма = 1+2+3+4+5 = 15' };
    },
  },
  {
    title: 'Вложенные циклы',
    theory: 'Вложенный цикл — цикл внутри цикла.\nВнешний выполняется M раз, внутренний — N раз.\nИтого операций: M × N',
    description: 'Таблица умножения фрагмент',
    codeTemplate: `count = 0
for i in range(1, 4):
    for j in range(1, 4):
        count += 1
print(count)`,
    question: 'Сколько раз выполнится тело внутреннего цикла? (чему равно count)',
    placeholder: 'Введи count',
    hint: 'Внешний: 3 итерации, внутренний: 3 итерации → 3×3 = ?',
    check: (v) => {
      const n = parseInt(v.trim());
      const ok = n === 9;
      return { ok, result: '9', explanation: 'i: 1,2,3 (3 раза) × j: 1,2,3 (3 раза) = 9 итераций. count=9' };
    },
  },
  {
    title: 'Функции',
    theory: 'Функция — именованный блок кода:\ndef имя_функции(параметры):\n    тело\n    return результат\n\nВызов: результат = имя_функции(аргументы)',
    description: 'Функция вычисления степени',
    codeTemplate: `def power(base, exp):
    result = 1
    for i in range(exp):
        result *= base
    return result

print(power(2, 10))`,
    question: 'Что выведет программа? (2 в степени 10)',
    placeholder: 'Введи результат',
    hint: '2¹⁰ = 2×2×2×2×2×2×2×2×2×2',
    check: (v) => {
      const n = parseInt(v.trim());
      const ok = n === 1024;
      return { ok, result: '1024', explanation: '2¹⁰ = 1024. Функция умножает base на себя exp раз.' };
    },
  },
  {
    title: 'Списки и срезы',
    theory: 'Срез списка: arr[start:end] — элементы с индекса start по end-1\narr[::2] — каждый второй элемент\narr[::-1] — список в обратном порядке',
    description: 'Работа со срезами',
    codeTemplate: `arr = [10, 20, 30, 40, 50, 60, 70]
print(arr[2:5])`,
    question: 'Что выведет print(arr[2:5])? Введи через запятую',
    placeholder: 'Например: 30, 40, 50',
    hint: 'Индексы: 0→10, 1→20, 2→30, 3→40, 4→50, 5→60. Срез [2:5] = ?',
    check: (v) => {
      const parts = v.split(',').map((s) => parseInt(s.trim()));
      const expected = [30, 40, 50];
      const ok = parts.length === 3 && parts.every((x, i) => x === expected[i]);
      return { ok, result: '30, 40, 50', explanation: 'arr[2:5]: индексы 2,3,4 → arr[2]=30, arr[3]=40, arr[4]=50' };
    },
  },
  {
    title: 'Словари',
    theory: 'Словарь (dict) — пары ключ: значение\nd = {"имя": "Иван", "возраст": 16}\nДоступ: d["ключ"]\nИзменение: d["ключ"] = новое_значение',
    description: 'Работа со словарём',
    codeTemplate: `student = {"name": "Anna", "grade": 8}
student["grade"] += 2
print(student["grade"])`,
    question: 'Что выведет программа?',
    placeholder: 'Введи результат',
    hint: 'grade начальное = 8, потом += 2',
    check: (v) => {
      const n = parseInt(v.trim());
      const ok = n === 10;
      return { ok, result: '10', explanation: 'student["grade"] = 8. После += 2: 8+2 = 10' };
    },
  },
  {
    title: 'Рекурсия',
    theory: 'Рекурсия — функция вызывает сама себя.\nОбязателен базовый случай (условие выхода)!\n\ndef factorial(n):\n    if n == 0: return 1\n    return n * factorial(n-1)',
    description: 'Рекурсивное вычисление',
    codeTemplate: `def f(n):
    if n <= 1:
        return 1
    return f(n-1) + f(n-2)

print(f(7))`,
    question: 'Что вычисляет эта функция? Чему равно f(7)?',
    placeholder: 'Введи f(7)',
    hint: 'Это числа Фибоначчи: f(1)=1, f(2)=1, f(3)=2...',
    check: (v) => {
      const n = parseInt(v.trim());
      const ok = n === 13;
      return { ok, result: '13', explanation: 'Это Фибоначчи: f(5)=5, f(6)=8, f(7)=f(6)+f(5)=8+5=13' };
    },
  },
  {
    title: 'Строки и методы',
    theory: 'Методы строк в Python:\n.upper() — в верхний регистр\n.lower() — в нижний регистр\n.count(c) — количество вхождений\n.replace(old,new) — замена\nlen(s) — длина строки',
    description: 'Работа со строками',
    codeTemplate: `s = "Hello, World!"
print(s.count("l"))`,
    question: 'Сколько букв "l" в строке "Hello, World!"?',
    placeholder: 'Введи количество',
    hint: 'Считай все строчные "l": He-l-l-o, Wor-l-d',
    check: (v) => {
      const n = parseInt(v.trim());
      const ok = n === 3;
      return { ok, result: '3', explanation: '"Hello, World!": He(l)(l)o, Wor(l)d — три буквы l' };
    },
  },
];

interface Props {
  onFinish: (result: Omit<GameResult, 'playedAt'>) => void;
}

export default function Task15Programming({ onFinish }: Props) {
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
    setFeedback(fb); setStage('feedback');
    if (fb.ok) { setScore((s) => s + 12); setCorrectCount((c) => c + 1); }
  }

  function handleNext() {
    if (taskIndex + 1 >= TASKS.length) {
      onFinish({ gameId: 'task15-prog', score: Math.min(100, score), maxScore: 100, correctAnswers: correctCount, totalQuestions: TASKS.length, timeSpent: Math.round((Date.now() - startTime) / 1000), difficulty: 'hard' });
    } else { setTaskIndex((i) => i + 1); setStage('theory'); setInput(''); setFeedback(null); setShowHint(false); }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="text-white/50 text-sm">Задача {taskIndex + 1} / {TASKS.length}</div>
        <div className="text-white/50 text-sm">Счёт: <span className="text-white font-bold">{score}</span></div>
      </div>
      <div className="w-full h-1.5 bg-white/10 rounded-full">
        <div className="progress-bar h-full" style={{ width: `${(taskIndex / TASKS.length) * 100}%` }} />
      </div>

      {stage === 'theory' && (
        <div className="space-y-4 animate-fade-in">
          <div className="card-glow rounded-2xl p-6">
            <div className="text-pink-400 text-xs font-medium mb-2">💻 ЗАДАНИЕ 15 · {task.title}</div>
            <h3 className="text-white font-bold text-lg mb-4">Теория</h3>
            <pre className="text-white/70 text-sm font-mono leading-relaxed whitespace-pre-wrap bg-white/5 rounded-xl p-4">{task.theory}</pre>
          </div>
          <div className="bg-pink-500/10 border border-pink-500/20 rounded-xl p-4">
            <div className="text-pink-300 text-xs font-medium mb-2">Код задания</div>
            <pre className="text-emerald-300 text-sm font-mono leading-relaxed whitespace-pre-wrap">{task.codeTemplate}</pre>
          </div>
          <button onClick={() => setStage('task')} className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-pink-600 to-rose-600 hover:opacity-90 transition-all">
            Проанализировать код →
          </button>
        </div>
      )}

      {stage === 'task' && (
        <div className="space-y-4 animate-fade-in">
          <div className="bg-[#1a1b2e] border border-white/10 rounded-2xl p-5">
            <div className="text-white/30 text-xs mb-3 flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500/60" />
              <span className="w-3 h-3 rounded-full bg-amber-500/60" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/60" />
              <span className="ml-2">Python 3</span>
            </div>
            <pre className="text-emerald-300 text-sm font-mono leading-relaxed whitespace-pre-wrap">{task.codeTemplate}</pre>
          </div>
          <div className="card-glow rounded-2xl p-5">
            <p className="text-white font-semibold">{task.question}</p>
          </div>
          {showHint && (
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 text-amber-300 text-sm flex items-start gap-2">
              <Icon name="Lightbulb" size={16} className="flex-shrink-0 mt-0.5" />
              <div><div className="font-semibold mb-1">Подсказка</div>{task.hint}</div>
            </div>
          )}
          <div className="flex gap-3">
            <input value={input} onChange={(e) => setInput(e.target.value)} placeholder={task.placeholder}
              className="flex-1 bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white font-mono text-lg placeholder:text-white/30 focus:outline-none focus:border-pink-500/60"
              onKeyDown={(e) => e.key === 'Enter' && handleCheck()} />
            <button onClick={handleCheck} disabled={!input.trim()} className="bg-gradient-to-r from-pink-600 to-rose-600 text-white font-bold px-6 rounded-xl hover:opacity-90 transition-all">ОК</button>
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
                {feedback.ok ? 'Код работает правильно! 💻' : `Не то. Правильный ответ: ${feedback.result}`}
              </div>
            </div>
            <div className="text-white/70 text-sm font-mono bg-white/5 rounded-xl p-3">{feedback.explanation}</div>
          </div>
          <button onClick={handleNext} className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-pink-600 to-rose-600 hover:opacity-90 transition-all">
            {taskIndex + 1 >= TASKS.length ? 'Завершить игру' : 'Далее'} →
          </button>
        </div>
      )}
    </div>
  );
}
