import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { GameResult } from '@/types/game';

interface FileTask {
  question: string;
  tree: { name: string; files: string[] }[];
  correctCount: number;
  extension: string;
  explanation: string;
}

const TASKS: FileTask[] = [
  {
    question: 'Сколько файлов с расширением .htm в папках Блок, Есенин, Некрасов?',
    extension: '.htm',
    tree: [
      { name: 'Блок', files: ['poem1.htm', 'poem2.txt', 'bio.htm', 'photo.jpg'] },
      { name: 'Есенин', files: ['verse.htm', 'note.txt', 'letter.doc'] },
      { name: 'Некрасов', files: ['story.htm', 'document.doc', 'songs.htm'] },
    ],
    correctCount: 5,
    explanation: 'Блок: 2 (.htm), Есенин: 1 (.htm), Некрасов: 2 (.htm). Итого: 5',
  },
  {
    question: 'Сколько файлов с расширением .doc в папках Архив, Отчёты, Черновики?',
    extension: '.doc',
    tree: [
      { name: 'Архив', files: ['report.doc', 'photo.jpg', 'data.xls'] },
      { name: 'Отчёты', files: ['jan.doc', 'feb.doc', 'mar.txt'] },
      { name: 'Черновики', files: ['draft.txt', 'plan.doc'] },
    ],
    correctCount: 4,
    explanation: 'Архив: 1, Отчёты: 2, Черновики: 1. Итого: 4 файла .doc',
  },
  {
    question: 'Сколько файлов с расширением .jpg в папках Природа, Город, Портреты?',
    extension: '.jpg',
    tree: [
      { name: 'Природа', files: ['forest.jpg', 'sea.jpg', 'mountain.jpg', 'river.txt'] },
      { name: 'Город', files: ['street.jpg', 'park.bmp', 'night.jpg'] },
      { name: 'Портреты', files: ['anna.jpg', 'ivan.png', 'masha.jpg'] },
    ],
    correctCount: 7,
    explanation: 'Природа: 3, Город: 2, Портреты: 2. Итого: 7 файлов .jpg',
  },
];

const THEORY_QUESTIONS = [
  { text: 'Что такое расширение файла?', options: ['Размер файла', 'Часть имени файла после точки, указывающая на тип', 'Полный путь к файлу', 'Папка с файлом'], correct: 1, explanation: 'Расширение = тип файла. Например: .txt, .doc, .jpg, .exe' },
  { text: 'Какое расширение имеют HTML-страницы?', options: ['.doc', '.exe', '.htm / .html', '.txt'], correct: 2, explanation: 'HTML-файлы имеют расширение .htm или .html (HyperText Markup Language)' },
  { text: 'Файл "document.doc" — тип файла?', options: ['Изображение', 'Текстовый документ Word', 'Программа', 'Таблица Excel'], correct: 1, explanation: '.doc — формат Microsoft Word, текстовый документ' },
  { text: 'Каталог (директория) — это...', options: ['Тип файла', 'Папка для хранения файлов и других папок', 'Расширение файла', 'Ярлык'], correct: 1, explanation: 'Каталог = папка. Содержит файлы и/или вложенные папки' },
  { text: 'Полный путь к файлу C:\\Users\\Docs\\report.txt — имя файла?', options: ['C:\\Users\\Docs', 'report', 'report.txt', 'txt'], correct: 2, explanation: 'Имя файла = "report.txt" (с расширением). Путь указывает расположение.' },
  { text: 'Маска *.jpg в поиске означает...', options: ['Файл с именем "звёздочка.jpg"', 'Все файлы с расширением .jpg', 'Один файл', 'Файлы без расширения'], correct: 1, explanation: '* — маска подстановки: любые символы. *.jpg = все файлы с расширением .jpg' },
  { text: 'Файл занимает 512 байт. Это меньше чем...', options: ['100 байт', '1 КБ', '256 байт', '0,5 КБ'], correct: 1, explanation: '1 КБ = 1024 байт. 512 < 1024, значит файл меньше 1 КБ' },
];

interface Props {
  onFinish: (result: Omit<GameResult, 'playedAt'>) => void;
}

export default function FileDetective({ onFinish }: Props) {
  const [stage, setStage] = useState<'count' | 'theory'>('count');
  const [taskIndex, setTaskIndex] = useState(0);
  const [input, setInput] = useState('');
  const [countScore, setCountScore] = useState(0);
  const [countCorrect, setCountCorrect] = useState(0);
  const [phase, setPhase] = useState<'input' | 'feedback'>('input');
  const [isCorrect, setIsCorrect] = useState(false);

  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [theoryScore, setTheoryScore] = useState(0);
  const [theoryCorrect, setTheoryCorrect] = useState(0);
  const [theoryPhase, setTheoryPhase] = useState<'question' | 'feedback'>('question');

  const [startTime] = useState(Date.now());

  const task = TASKS[taskIndex];
  const tq = THEORY_QUESTIONS[qIndex];

  function checkCount() {
    const val = parseInt(input);
    const ok = val === task.correctCount;
    setIsCorrect(ok);
    setPhase('feedback');
    if (ok) { setCountScore((s) => s + 15); setCountCorrect((c) => c + 1); }
  }

  function nextTask() {
    if (taskIndex + 1 >= TASKS.length) {
      setStage('theory');
    } else {
      setTaskIndex((i) => i + 1);
      setInput('');
      setPhase('input');
    }
  }

  function handleTheory(idx: number) {
    if (theoryPhase !== 'question') return;
    setSelected(idx); setTheoryPhase('feedback');
    if (idx === tq.correct) { setTheoryScore((s) => s + 10); setTheoryCorrect((c) => c + 1); }
  }

  function nextTheory() {
    if (qIndex + 1 >= THEORY_QUESTIONS.length) {
      const total = countScore + theoryScore;
      onFinish({ gameId: 'file-detective', score: Math.min(100, total), maxScore: 100, correctAnswers: countCorrect + theoryCorrect, totalQuestions: TASKS.length + THEORY_QUESTIONS.length, timeSpent: Math.round((Date.now() - startTime) / 1000), difficulty: 'easy' });
    } else { setQIndex((i) => i + 1); setSelected(null); setTheoryPhase('question'); }
  }

  if (stage === 'theory') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="text-white/50 text-sm">Теория {qIndex + 1} / {THEORY_QUESTIONS.length}</div>
          <div className="text-white/50 text-sm">Счёт: <span className="text-white font-bold">{countScore + theoryScore}</span></div>
        </div>
        <div className="w-full h-1.5 bg-white/10 rounded-full"><div className="progress-bar h-full" style={{ width: `${(qIndex / THEORY_QUESTIONS.length) * 100}%` }} /></div>
        <div className="card-glow rounded-2xl p-6"><p className="text-white text-lg font-semibold">{tq.text}</p></div>
        <div className="grid grid-cols-1 gap-3">
          {tq.options.map((opt, idx) => {
            let cls = 'card-glow rounded-xl p-4 text-left font-medium transition-all cursor-pointer border ';
            if (theoryPhase === 'feedback') {
              if (idx === tq.correct) cls += 'game-correct border-emerald-500/80 text-emerald-300';
              else if (idx === selected) cls += 'game-wrong border-red-500/80 text-red-300';
              else cls += 'opacity-40 border-white/10 text-white';
            } else cls += 'border-white/10 hover:border-teal-500/50 hover:bg-teal-500/5 text-white';
            return <button key={idx} className={cls} onClick={() => handleTheory(idx)}><span className="text-white/40 mr-2">{String.fromCharCode(65 + idx)})</span>{opt}</button>;
          })}
        </div>
        {theoryPhase === 'feedback' && (
          <div className={`rounded-xl p-4 text-sm flex items-start gap-3 ${selected === tq.correct ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300' : 'bg-red-500/10 border border-red-500/30 text-red-300'}`}>
            <Icon name={selected === tq.correct ? 'CheckCircle' : 'XCircle'} size={18} className="flex-shrink-0 mt-0.5" />
            <div><div className="font-semibold mb-1">{selected === tq.correct ? 'Верно! 📁' : `Нет. Правильно: ${tq.options[tq.correct]}`}</div><div className="text-white/70">{tq.explanation}</div></div>
          </div>
        )}
        {theoryPhase === 'feedback' && (
          <button onClick={nextTheory} className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-teal-600 to-emerald-600 hover:opacity-90 transition-all">
            {qIndex + 1 >= THEORY_QUESTIONS.length ? 'Завершить игру' : 'Далее'} →
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="text-white/50 text-sm">Задача {taskIndex + 1} / {TASKS.length}</div>
        <div className="text-teal-400 text-sm">Счёт: <span className="text-white font-bold">{countScore}</span></div>
      </div>
      <div className="card-glow rounded-2xl p-6">
        <div className="text-teal-400 text-xs mb-2">📁 ФАЙЛОВЫЙ ДЕТЕКТИВ</div>
        <p className="text-white font-semibold mb-4">{task.question}</p>
        <div className="space-y-2">
          {task.tree.map((folder) => (
            <div key={folder.name} className="bg-white/5 rounded-xl p-3">
              <div className="flex items-center gap-2 text-teal-300 text-sm font-medium mb-2">
                <Icon name="Folder" size={16} /> {folder.name}/
              </div>
              <div className="pl-6 space-y-1">
                {folder.files.map((file) => {
                  const isTarget = file.endsWith(task.extension);
                  return (
                    <div key={file} className={`text-xs font-mono flex items-center gap-2 ${isTarget && phase === 'feedback' ? 'text-emerald-400' : 'text-white/50'}`}>
                      <Icon name="File" size={12} />
                      {file}
                      {isTarget && phase === 'feedback' && <span className="text-emerald-400">✓</span>}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {phase === 'input' ? (
        <div className="flex gap-3">
          <input
            type="number"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Введи количество файлов..."
            className="flex-1 bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white text-lg font-mono placeholder:text-white/30 focus:outline-none focus:border-teal-500/60"
            onKeyDown={(e) => e.key === 'Enter' && input && checkCount()}
          />
          <button onClick={checkCount} disabled={!input} className="btn-cyan px-6">Проверить</button>
        </div>
      ) : (
        <>
          <div className={`rounded-xl p-4 text-sm flex items-start gap-3 ${isCorrect ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300' : 'bg-red-500/10 border border-red-500/30 text-red-300'}`}>
            <Icon name={isCorrect ? 'CheckCircle' : 'XCircle'} size={18} className="flex-shrink-0 mt-0.5" />
            <div><div className="font-semibold mb-1">{isCorrect ? 'Детектив нашёл! 📁' : `Нет, правильный ответ: ${task.correctCount}`}</div><div className="text-white/70">{task.explanation}</div></div>
          </div>
          <button onClick={nextTask} className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-teal-600 to-emerald-600 hover:opacity-90 transition-all">
            {taskIndex + 1 >= TASKS.length ? 'К теоретическим вопросам →' : 'Следующая задача →'}
          </button>
        </>
      )}
    </div>
  );
}
