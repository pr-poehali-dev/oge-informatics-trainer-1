import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { GameResult } from '@/types/game';

interface TextTask {
  title: string;
  text: string;
  question: string;
  answer: string;
  hint: string;
  explanation: string;
}

const TASKS: TextTask[] = [
  {
    title: 'Произведение',
    text: 'Варвара Петровна имела единственного сына, которого звали Алексей Дмитриевич. Алексей был умным и прилежным юношей. Его мать, Варвара Петровна, гордилась им. Алексей мечтал стать учителем.',
    question: 'Как зовут сына Варвары Петровны?',
    answer: 'алексей',
    hint: 'Ищи имя рядом со словом "сына"',
    explanation: 'В тексте: "единственного сына, которого звали Алексей Дмитриевич"',
  },
  {
    title: 'Рассказ о технологиях',
    text: 'Компьютер был изобретён в XX веке. Первые компьютеры занимали целые комнаты. Сейчас компьютер помещается в кармане. Смартфон — это тоже компьютер. Компьютер изменил мир навсегда.',
    question: 'Сколько раз слово "компьютер" встречается в тексте?',
    answer: '5',
    hint: 'Считай каждое вхождение слова "компьютер"',
    explanation: 'Компьютер (1), компьютеры (2), компьютер (3), компьютер (4), Компьютер (5) — 5 раз',
  },
  {
    title: 'Задание на поиск',
    text: 'В файле хранится информация о школьниках. Иванов Пётр, 9А. Петров Иван, 9Б. Сидоров Алексей, 9А. Козлов Дмитрий, 9В. Всего в классе 9А учатся Иванов и Сидоров.',
    question: 'Сколько учеников в классе 9А?',
    answer: '2',
    hint: 'Ищи учеников с пометкой "9А"',
    explanation: 'В тексте 9А: Иванов Пётр и Сидоров Алексей — 2 ученика',
  },
];

const QUESTIONS = [
  { text: 'Функция "Найти" (Ctrl+F) в текстовом редакторе служит для...', options: ['Форматирования текста', 'Поиска слова или фразы в документе', 'Сохранения файла', 'Создания нового документа'], correct: 1, explanation: 'Ctrl+F открывает строку поиска для нахождения нужного текста в документе' },
  { text: '"Найти и заменить" (Ctrl+H) позволяет...', options: ['Только найти слово', 'Найти слово и заменить его другим', 'Удалить все слова', 'Скопировать текст'], correct: 1, explanation: 'Ctrl+H — поиск с заменой: находит все вхождения слова и заменяет их новым' },
  { text: 'Поиск с учётом регистра — это значит...', options: ['Поиск только заглавных букв', 'Различие "А" и "а" при поиске', 'Поиск цифр', 'Поиск в определённой папке'], correct: 1, explanation: 'Регистр = размер букв. "Кот" ≠ "кот" ≠ "КОТ" при поиске с учётом регистра' },
  { text: 'Что такое "маска файла" при поиске в ОС?', options: ['Цвет иконки файла', 'Шаблон имени файла с символами подстановки', 'Тип шифрования', 'Размер файла'], correct: 1, explanation: 'Маска = шаблон: *.txt — все .txt файлы; photo?.jpg — фото с одним символом после "photo"' },
  { text: 'Символ "?" в маске поиска файлов означает...', options: ['Любое количество символов', 'Ровно один любой символ', 'Точку', 'Конец имени файла'], correct: 1, explanation: '"?" заменяет ровно один символ. "file?.txt" найдёт file1.txt, fileA.txt, но не file12.txt' },
  { text: 'Символ "*" в маске поиска означает...', options: ['Один символ', 'Любое количество любых символов', 'Только цифры', 'Только буквы'], correct: 1, explanation: '"*" заменяет любое количество символов: "*.doc" = все .doc файлы; "rep*" = все файлы с именем начинающимся на "rep"' },
  { text: 'Чтобы найти все файлы с расширением .jpg в папке, нужно использовать маску...', options: ['jpg.*', '.jpg', '*.jpg', '?jpg'], correct: 2, explanation: '*.jpg — звёздочка означает "любое имя", .jpg — расширение. Найдёт photo.jpg, image.jpg и т.д.' },
];

interface Props {
  onFinish: (result: Omit<GameResult, 'playedAt'>) => void;
}

export default function TextSearch({ onFinish }: Props) {
  const [stage, setStage] = useState<'tasks' | 'theory'>('tasks');
  const [taskIndex, setTaskIndex] = useState(0);
  const [input, setInput] = useState('');
  const [taskScore, setTaskScore] = useState(0);
  const [taskCorrect, setTaskCorrect] = useState(0);
  const [phase, setPhase] = useState<'input' | 'feedback'>('input');
  const [isCorrect, setIsCorrect] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [theoryScore, setTheoryScore] = useState(0);
  const [theoryCorrect, setTheoryCorrect] = useState(0);
  const [theoryPhase, setTheoryPhase] = useState<'question' | 'feedback'>('question');
  const [startTime] = useState(Date.now());

  const task = TASKS[taskIndex];
  const tq = THEORY_QUESTIONS[qIndex];

  function checkAnswer() {
    const ok = input.trim().toLowerCase() === task.answer.toLowerCase();
    setIsCorrect(ok);
    setPhase('feedback');
    if (ok) { setTaskScore((s) => s + 15); setTaskCorrect((c) => c + 1); }
  }

  function nextTask() {
    if (taskIndex + 1 >= TASKS.length) { setStage('theory'); }
    else { setTaskIndex((i) => i + 1); setInput(''); setPhase('input'); setShowHint(false); }
  }

  function handleTheory(idx: number) {
    if (theoryPhase !== 'question') return;
    setSelected(idx); setTheoryPhase('feedback');
    if (idx === tq.correct) { setTheoryScore((s) => s + 10); setTheoryCorrect((c) => c + 1); }
  }

  function nextTheory() {
    if (qIndex + 1 >= QUESTIONS.length) {
      const total = taskScore + theoryScore;
      onFinish({ gameId: 'text-search', score: Math.min(100, total), maxScore: 100, correctAnswers: taskCorrect + theoryCorrect, totalQuestions: TASKS.length + QUESTIONS.length, timeSpent: Math.round((Date.now() - startTime) / 1000), difficulty: 'hard' });
    } else { setQIndex((i) => i + 1); setSelected(null); setTheoryPhase('question'); }
  }

  if (stage === 'theory') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="text-white/50 text-sm">Вопрос {qIndex + 1} / {QUESTIONS.length}</div>
          <div className="text-white/50 text-sm">Счёт: <span className="text-white font-bold">{taskScore + theoryScore}</span></div>
        </div>
        <div className="w-full h-1.5 bg-white/10 rounded-full"><div className="progress-bar h-full" style={{ width: `${(qIndex / QUESTIONS.length) * 100}%` }} /></div>
        <div className="card-glow rounded-2xl p-6"><p className="text-white text-lg font-semibold">{tq.text}</p></div>
        <div className="grid grid-cols-1 gap-3">
          {tq.options.map((opt, idx) => {
            let cls = 'card-glow rounded-xl p-4 text-left font-medium transition-all cursor-pointer border ';
            if (theoryPhase === 'feedback') {
              if (idx === tq.correct) cls += 'game-correct border-emerald-500/80 text-emerald-300';
              else if (idx === selected) cls += 'game-wrong border-red-500/80 text-red-300';
              else cls += 'opacity-40 border-white/10 text-white';
            } else cls += 'border-white/10 hover:border-rose-500/50 hover:bg-rose-500/5 text-white';
            return <button key={idx} className={cls} onClick={() => handleTheory(idx)}><span className="text-white/40 mr-2">{String.fromCharCode(65 + idx)})</span>{opt}</button>;
          })}
        </div>
        {theoryPhase === 'feedback' && (
          <div className={`rounded-xl p-4 text-sm flex items-start gap-3 ${selected === tq.correct ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300' : 'bg-red-500/10 border border-red-500/30 text-red-300'}`}>
            <Icon name={selected === tq.correct ? 'CheckCircle' : 'XCircle'} size={18} className="flex-shrink-0 mt-0.5" />
            <div><div className="font-semibold mb-1">{selected === tq.correct ? 'Найдено! 📝' : `Нет. Верно: ${tq.options[tq.correct]}`}</div><div className="text-white/70">{tq.explanation}</div></div>
          </div>
        )}
        {theoryPhase === 'feedback' && (
          <button onClick={nextTheory} className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-rose-600 to-red-600 hover:opacity-90 transition-all">
            {qIndex + 1 >= QUESTIONS.length ? 'Завершить игру' : 'Далее'} →
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="text-white/50 text-sm">Текст {taskIndex + 1} / {TASKS.length}</div>
        <div className="text-white/50 text-sm">Счёт: <span className="text-white font-bold">{taskScore}</span></div>
      </div>
      <div className="card-glow rounded-2xl p-6">
        <div className="text-rose-400 text-xs mb-2">📝 ТЕКСТ: {task.title}</div>
        <p className="text-white/80 text-sm leading-relaxed bg-white/5 rounded-xl p-4 font-serif">{task.text}</p>
        <div className="mt-4 text-white font-semibold">{task.question}</div>
      </div>

      {showHint && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 text-amber-300 text-sm flex items-center gap-2">
          <Icon name="Lightbulb" size={16} />
          {task.hint}
        </div>
      )}

      {phase === 'input' ? (
        <div className="space-y-3">
          <div className="flex gap-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Введи ответ..."
              className="flex-1 bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-rose-500/60"
              onKeyDown={(e) => e.key === 'Enter' && input && checkAnswer()}
            />
            <button onClick={checkAnswer} disabled={!input} className="btn-primary px-6">OK</button>
          </div>
          <button onClick={() => setShowHint(true)} className="text-amber-400/70 hover:text-amber-400 text-sm flex items-center gap-1 transition-colors">
            <Icon name="Lightbulb" size={14} /> Показать подсказку
          </button>
        </div>
      ) : (
        <>
          <div className={`rounded-xl p-4 text-sm flex items-start gap-3 ${isCorrect ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300' : 'bg-red-500/10 border border-red-500/30 text-red-300'}`}>
            <Icon name={isCorrect ? 'CheckCircle' : 'XCircle'} size={18} className="flex-shrink-0 mt-0.5" />
            <div><div className="font-semibold mb-1">{isCorrect ? 'Текст изучен! 📝' : `Нет. Правильный ответ: "${task.answer}"`}</div><div className="text-white/70">{task.explanation}</div></div>
          </div>
          <button onClick={nextTask} className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-rose-600 to-red-600 hover:opacity-90 transition-all">
            {taskIndex + 1 >= TASKS.length ? 'К теоретическим вопросам →' : 'Следующий текст →'}
          </button>
        </>
      )}
    </div>
  );
}

const THEORY_QUESTIONS = QUESTIONS;
