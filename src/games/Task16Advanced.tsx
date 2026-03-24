import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { GameResult } from '@/types/game';

interface AdvTask {
  title: string;
  theory: string;
  problem: string;
  code?: string;
  steps: { label: string; answer: string; placeholder: string; hint: string }[];
  explanation: string;
}

const TASKS: AdvTask[] = [
  {
    title: 'Поиск простых чисел',
    theory: 'Простое число делится только на 1 и на себя.\nАлгоритм проверки: попробовать разделить на все числа от 2 до √n.\nЕсли ни одно не делит — число простое.',
    problem: 'Найди все простые числа от 1 до 20',
    steps: [
      { label: 'Сколько простых чисел от 1 до 20?', answer: '8', placeholder: 'Количество', hint: '2,3,5,7,11,13,17,19 — это все простые' },
      { label: 'Самое большое простое число ≤ 20?', answer: '19', placeholder: 'Число', hint: '20=4×5, 19 — делится только на 1 и 19' },
      { label: 'Сумма всех простых от 1 до 20?', answer: '77', placeholder: 'Сумма', hint: '2+3+5+7+11+13+17+19 = ?' },
    ],
    explanation: 'Простые 1-20: 2,3,5,7,11,13,17,19. Их 8 штук. Максимум=19. Сумма=2+3+5+7+11+13+17+19=77',
  },
  {
    title: 'Обработка строки',
    theory: 'Работа с символами строки:\n• Подсчёт: s.count("a")\n• Реверс: s[::-1]\n• Проверка палиндрома: s == s[::-1]\n• Замена: s.replace("a","b")',
    problem: 'Анализ строки: "ИНФОРМАТИКА"',
    steps: [
      { label: 'Сколько букв в слове ИНФОРМАТИКА?', answer: '11', placeholder: 'Количество букв', hint: 'И-Н-Ф-О-Р-М-А-Т-И-К-А' },
      { label: 'Сколько раз встречается буква "И"?', answer: '2', placeholder: 'Количество "И"', hint: "ИНФ(И)РМАТИК(А) → инИциальная И и ..., считай" },
      { label: 'Сколько гласных (А,Е,И,О,У,Э,Ю,Я) в слове ИНФОРМАТИКА?', answer: '5', placeholder: 'Количество гласных', hint: 'И-Н-Ф-О-Р-М-А-Т-И-К-А: выдели гласные' },
    ],
    explanation: 'ИНФОРМАТИКА: 11 букв. И встречается 2 раза (1-я и 9-я позиции). Гласные: И,О,А,И,А = 5',
  },
  {
    title: 'Двумерные массивы',
    theory: 'Двумерный массив — таблица из строк и столбцов.\nОбращение: arr[строка][столбец] (индексы с 0)\nПеребор: for i in rows: for j in cols: arr[i][j]',
    problem: 'Матрица 3×3:\n1 2 3\n4 5 6\n7 8 9',
    code: '[[1,2,3],[4,5,6],[7,8,9]]',
    steps: [
      { label: 'Чему равно arr[1][2]?', answer: '6', placeholder: 'Значение элемента', hint: 'Строка 1 (вторая) = [4,5,6]. Столбец 2 (третий) = ?' },
      { label: 'Сумма главной диагонали (arr[0][0]+arr[1][1]+arr[2][2])?', answer: '15', placeholder: 'Сумма', hint: '1+5+9 = ?' },
      { label: 'Сумма всех элементов матрицы?', answer: '45', placeholder: 'Сумма всех', hint: '1+2+3+4+5+6+7+8+9 = ?' },
    ],
    explanation: 'arr[1][2]=6. Диагональ: 1+5+9=15. Сумма: 45 (это 1+2+...+9=9×10/2=45)',
  },
  {
    title: 'Работа с файлами (логика)',
    theory: 'Чтение данных из файла:\nwith open("file.txt", "r") as f:\n    lines = f.readlines()\n\nКаждая строка — элемент списка lines.\nОбработка: for line in lines: ...',
    problem: 'Файл содержит оценки по одной на строке:\n5\n4\n3\n5\n5\n4\n3\n2',
    steps: [
      { label: 'Сколько строк в файле?', answer: '8', placeholder: 'Количество строк', hint: 'Посчитай оценки: 5,4,3,5,5,4,3,2' },
      { label: 'Какой средний балл? (округли до 1 знака)', answer: '3.9', placeholder: 'Среднее', hint: '(5+4+3+5+5+4+3+2) / 8 = ?' },
      { label: 'Сколько оценок выше среднего (>3.9)?', answer: '5', placeholder: 'Количество', hint: 'Оценки >3.9: это 4 и 5. Считай их' },
    ],
    explanation: '8 строк. Сумма: 31, среднее: 31/8=3.875≈3.9. Выше среднего (≥4): 5,4,5,5,4 = 5 оценок',
  },
  {
    title: 'Рекурсивная сумма',
    theory: 'Рекурсия для суммы цифр:\ndef digit_sum(n):\n    if n < 10: return n\n    return (n % 10) + digit_sum(n // 10)\n\nПример: digit_sum(123) = 3 + digit_sum(12) = 3+2+1 = 6',
    problem: 'Вычисли рекурсивно: digit_sum(98765)',
    code: 'digit_sum(n): если n<10 → n, иначе → (n%10) + digit_sum(n//10)',
    steps: [
      { label: 'digit_sum(98765) = ? (сумма цифр числа 98765)', answer: '35', placeholder: 'Сумма цифр', hint: '9+8+7+6+5 = ?' },
      { label: 'Сколько рекурсивных вызовов потребуется?', answer: '5', placeholder: 'Количество вызовов', hint: 'Каждый вызов "откусывает" одну цифру. Цифр = вызовов' },
    ],
    explanation: '9+8+7+6+5=35. Вызовы: digit_sum(98765)→digit_sum(9876)→...→digit_sum(9) — 5 вызовов',
  },
];

interface Props {
  onFinish: (result: Omit<GameResult, 'playedAt'>) => void;
}

export default function Task16Advanced({ onFinish }: Props) {
  const [taskIndex, setTaskIndex] = useState(0);
  const [stage, setStage] = useState<'theory' | 'steps' | 'feedback'>('theory');
  const [stepIndex, setStepIndex] = useState(0);
  const [inputs, setInputs] = useState<string[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [stepFeedback, setStepFeedback] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [startTime] = useState(Date.now());

  const task = TASKS[taskIndex];
  const currentStep = task.steps[stepIndex];

  function handleStepCheck() {
    if (!currentInput.trim()) return;
    const ok = currentInput.trim().replace(',', '.') === currentStep.answer;
    setStepFeedback(ok);
    if (ok) { setScore((s) => s + 6); setCorrectCount((c) => c + 1); }
    setTimeout(() => {
      setInputs((prev) => [...prev, currentInput]);
      if (stepIndex + 1 >= task.steps.length) {
        setStage('feedback');
      } else {
        setStepIndex((i) => i + 1);
        setCurrentInput('');
        setStepFeedback(null);
        setShowHint(false);
      }
    }, 1200);
  }

  function handleNext() {
    if (taskIndex + 1 >= TASKS.length) {
      onFinish({ gameId: 'task16-adv', score: Math.min(100, score), maxScore: 100, correctAnswers: correctCount, totalQuestions: TASKS.reduce((s, t) => s + t.steps.length, 0), timeSpent: Math.round((Date.now() - startTime) / 1000), difficulty: 'hard' });
    } else {
      setTaskIndex((i) => i + 1); setStage('theory'); setStepIndex(0); setInputs([]); setCurrentInput(''); setStepFeedback(null); setShowHint(false);
    }
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
            <div className="text-amber-400 text-xs font-medium mb-2">🏆 ЗАДАНИЕ 16 · {task.title}</div>
            <h3 className="text-white font-bold text-lg mb-3">Теория и задача</h3>
            <pre className="text-white/70 text-sm font-mono leading-relaxed whitespace-pre-wrap bg-white/5 rounded-xl p-4 mb-4">{task.theory}</pre>
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
              <div className="text-amber-300 text-xs font-medium mb-2">Условие задачи</div>
              <pre className="text-white/80 text-sm whitespace-pre-wrap">{task.problem}</pre>
              {task.code && <div className="mt-3 font-mono text-cyan-300 text-xs bg-white/5 rounded-lg p-2">{task.code}</div>}
            </div>
          </div>
          <button onClick={() => setStage('steps')} className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-amber-600 to-orange-600 hover:opacity-90 transition-all">
            Решать по шагам →
          </button>
        </div>
      )}

      {stage === 'steps' && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex gap-1 mb-2">
            {task.steps.map((_, i) => (
              <div key={i} className={`flex-1 h-1.5 rounded-full ${i < stepIndex ? 'bg-emerald-400' : i === stepIndex ? 'bg-amber-400' : 'bg-white/10'}`} />
            ))}
          </div>

          <div className="card-glow rounded-2xl p-6">
            <div className="text-amber-400 text-xs mb-2">Шаг {stepIndex + 1} из {task.steps.length}</div>
            <p className="text-white font-semibold text-lg">{currentStep.label}</p>
          </div>

          {showHint && (
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 text-amber-300 text-sm flex items-start gap-2">
              <Icon name="Lightbulb" size={16} className="flex-shrink-0 mt-0.5" />
              <div><div className="font-semibold mb-1">Подсказка</div>{currentStep.hint}</div>
            </div>
          )}

          {stepFeedback !== null && (
            <div className={`rounded-xl p-3 flex items-center gap-2 text-sm ${stepFeedback ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'}`}>
              <Icon name={stepFeedback ? 'Check' : 'X'} size={16} />
              {stepFeedback ? `Верно! +6 XP` : `Неверно. Правильный ответ: ${currentStep.answer}`}
            </div>
          )}

          <div className="flex gap-3">
            <input
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              placeholder={currentStep.placeholder}
              disabled={stepFeedback !== null}
              className="flex-1 bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white font-mono text-lg placeholder:text-white/30 focus:outline-none focus:border-amber-500/60 disabled:opacity-50"
              onKeyDown={(e) => e.key === 'Enter' && stepFeedback === null && handleStepCheck()}
            />
            <button onClick={handleStepCheck} disabled={!currentInput.trim() || stepFeedback !== null}
              className="bg-gradient-to-r from-amber-600 to-orange-600 text-white font-bold px-6 rounded-xl hover:opacity-90 transition-all disabled:opacity-40">ОК</button>
          </div>
          {!showHint && <button onClick={() => setShowHint(true)} className="text-amber-400/60 hover:text-amber-400 text-sm flex items-center gap-1 transition-colors"><Icon name="Lightbulb" size={14} /> Подсказка</button>}
        </div>
      )}

      {stage === 'feedback' && (
        <div className="space-y-4 animate-fade-in">
          <div className="card-glow rounded-2xl p-6 border border-amber-500/20">
            <div className="text-amber-400 text-xs font-medium mb-3">🏆 {task.title} — разбор</div>
            <div className="space-y-3">
              {task.steps.map((step, i) => (
                <div key={i} className="flex items-start gap-3 text-sm">
                  <div className={`w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center text-xs ${inputs[i]?.trim().replace(',', '.') === step.answer ? 'bg-emerald-500/30 text-emerald-300' : 'bg-red-500/30 text-red-300'}`}>
                    {inputs[i]?.trim().replace(',', '.') === step.answer ? '✓' : '✗'}
                  </div>
                  <div>
                    <div className="text-white/70">{step.label}</div>
                    <div className="text-white font-mono font-semibold">Ответ: {step.answer}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-white/10 text-white/60 text-xs">{task.explanation}</div>
          </div>
          <button onClick={handleNext} className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-amber-600 to-orange-600 hover:opacity-90 transition-all">
            {taskIndex + 1 >= TASKS.length ? 'Завершить игру' : 'Следующая задача'} →
          </button>
        </div>
      )}
    </div>
  );
}
