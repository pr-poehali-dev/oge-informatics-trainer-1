import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { GameResult } from '@/types/game';

const QUESTIONS = [
  { text: 'Какая часть URL http://example.com/page.html является именем файла?', options: ['http', 'example.com', 'page.html', '/page.html'], correct: 2, explanation: 'Имя файла — последняя часть пути после последнего /: page.html' },
  { text: 'URL: https://school.ru/math/task1.pdf — протокол?', options: ['school.ru', 'https', 'math', 'pdf'], correct: 1, explanation: 'Протокол = часть до ://, в данном случае https' },
  { text: 'Что такое домен в URL https://mail.google.com?', options: ['https', 'google.com', 'mail.google.com', 'com'], correct: 2, explanation: 'Полный домен = mail.google.com (включает поддомен mail)' },
  { text: 'URL: ftp://files.server.net/docs/report.doc — папка (путь)?', options: ['ftp', 'docs', '/docs/', 'server.net'], correct: 2, explanation: 'Путь к файлу (без имени файла) = /docs/' },
  { text: 'Расширение файла в URL http://site.ru/img/photo.jpg?', options: ['http', 'jpg', 'photo', 'img'], correct: 1, explanation: 'Расширение = часть после точки в имени файла: .jpg' },
  { text: 'Что обозначает "www" в URL www.yandex.ru?', options: ['Имя файла', 'Тип протокола', 'Поддомен (имя хоста)', 'Расширение'], correct: 2, explanation: 'www — поддомен (третий уровень домена), часть DNS-имени сервера' },
  { text: 'Какой протокол используется для безопасной передачи данных?', options: ['http', 'ftp', 'https', 'smtp'], correct: 2, explanation: 'HTTPS = HTTP + SSL/TLS шифрование. Замок в браузере = https' },
  { text: 'URL-адрес: http://lib.ru/LITER/book.htm — тип файла?', options: ['LITER', 'book', 'ru', 'htm'], correct: 3, explanation: 'Тип (расширение) файла = htm (HTML-страница)' },
  { text: 'Из чего состоит полный URL? (верный порядок)', options: ['домен://протокол/путь', 'протокол://домен/путь/файл', 'файл/домен://путь', 'путь://файл/домен'], correct: 1, explanation: 'Структура URL: протокол://домен/путь/имя_файла.расширение' },
  { text: 'http://school13.mos.ru/news/index.html — имя сервера?', options: ['index.html', 'news', 'mos.ru', 'school13.mos.ru'], correct: 3, explanation: 'Имя сервера (домен) = school13.mos.ru (всё между // и следующим /)' },
];

interface Props {
  onFinish: (result: Omit<GameResult, 'playedAt'>) => void;
}

export default function UrlBuilder({ onFinish }: Props) {
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
      onFinish({ gameId: 'url-builder', score: Math.round((correct / QUESTIONS.length) * 100), maxScore: 100, correctAnswers: correct, totalQuestions: QUESTIONS.length, timeSpent: Math.round((Date.now() - startTime) / 1000), difficulty: 'easy' });
    } else { setQIndex((i) => i + 1); setSelected(null); setPhase('question'); }
  }

  const urlParts = QUESTIONS[qIndex].text.match(/https?:\/\/[^\s]+|ftp:\/\/[^\s]+/);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="text-white/50 text-sm">Адрес {qIndex + 1} / {QUESTIONS.length}</div>
        <div className="text-white/50 text-sm">Счёт: <span className="text-white font-bold">{score}</span></div>
      </div>
      <div className="w-full h-1.5 bg-white/10 rounded-full"><div className="progress-bar h-full" style={{ width: `${(qIndex / QUESTIONS.length) * 100}%` }} /></div>

      {urlParts && (
        <div className="bg-sky-500/10 border border-sky-500/30 rounded-xl p-3 font-mono text-sky-300 text-sm break-all">
          🌐 {urlParts[0]}
        </div>
      )}

      <div className="card-glow rounded-2xl p-6">
        <p className="text-white text-lg font-semibold">{q.text}</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {q.options.map((opt, idx) => {
          let cls = 'card-glow rounded-xl p-4 text-center font-mono font-medium transition-all cursor-pointer border ';
          if (phase === 'feedback') {
            if (idx === q.correct) cls += 'game-correct border-emerald-500/80 text-emerald-300';
            else if (idx === selected) cls += 'game-wrong border-red-500/80 text-red-300';
            else cls += 'opacity-40 border-white/10 text-white';
          } else cls += 'border-white/10 hover:border-sky-500/50 hover:bg-sky-500/5 text-white';
          return <button key={idx} className={cls} onClick={() => handleAnswer(idx)}>{opt}</button>;
        })}
      </div>
      {phase === 'feedback' && (
        <div className={`rounded-xl p-4 text-sm flex items-start gap-3 ${selected === q.correct ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300' : 'bg-red-500/10 border border-red-500/30 text-red-300'}`}>
          <Icon name={selected === q.correct ? 'CheckCircle' : 'XCircle'} size={18} className="flex-shrink-0 mt-0.5" />
          <div><div className="font-semibold mb-1">{selected === q.correct ? 'Адрес найден! 🌐' : `Неверно. Правильно: ${q.options[q.correct]}`}</div><div className="text-white/70">{q.explanation}</div></div>
        </div>
      )}
      {phase === 'feedback' && (
        <button onClick={next} className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-sky-600 to-cyan-600 hover:opacity-90 transition-all">
          {qIndex + 1 >= QUESTIONS.length ? 'Завершить' : 'Далее'} →
        </button>
      )}
    </div>
  );
}
