import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { GameResult } from '@/types/game';

const QUESTIONS = [
  { text: 'Запрос: "кошка ИЛИ собака". Что найдёт поисковик?', options: ['Только страницы с обоими словами', 'Страницы хотя бы с одним словом', 'Только страницы с "кошка"', 'Ничего не найдёт'], correct: 1, explanation: 'ИЛИ (OR) — объединение: найдёт страницы, где есть хотя бы одно из слов' },
  { text: 'Запрос: "мороз И солнце". Что найдёт поисковик?', options: ['Только страницы с "мороз"', 'Страницы хотя бы с одним словом', 'Страницы с обоими словами', 'Страницы без этих слов'], correct: 2, explanation: 'И (AND) — пересечение: найдёт только страницы, где есть ОБА слова' },
  { text: 'Страниц с "лето" = 5000, с "море" = 4000, с "лето И море" = 2000. Сколько найдёт "лето ИЛИ море"?', options: ['9000', '7000', '2000', '11000'], correct: 1, explanation: 'ИЛИ = A + B − (A И B) = 5000 + 4000 − 2000 = 7000' },
  { text: 'Какой запрос найдёт БОЛЬШЕ страниц?', options: ['"яблоко И груша"', '"яблоко ИЛИ груша"', 'Одинаково', 'Зависит от поисковика'], correct: 1, explanation: 'ИЛИ всегда даёт ≥ результатов, чем И (пересечение ≤ объединения)' },
  { text: '"кот" = 8000 страниц, "рыба" = 6000, "кот И рыба" = 1500. Найдёт "кот ИЛИ рыба" ?', options: ['14000', '12500', '1500', '6500'], correct: 1, explanation: '8000 + 6000 − 1500 = 12500 страниц' },
  { text: 'Запрос "ШКОЛА И ИНФОРМАТИКА И ЕГЭ" — это запрос с...', options: ['Одним условием', 'Двумя условиями', 'Тремя условиями', 'Без условий'], correct: 2, explanation: 'Три слова, связанных И — три условия, все должны присутствовать на странице' },
  { text: 'Чему равно: (A И B) если A=Истина, B=Ложь?', options: ['Истина', 'Ложь', 'A', 'B'], correct: 1, explanation: 'А И Б: оба должны быть ИСТИНА. Истина И Ложь = Ложь' },
  { text: '"книга" = 10000, "журнал" = 8000, "книга ИЛИ журнал" = 15000. Найдёт "книга И журнал"?', options: ['18000', '3000', '15000', '5000'], correct: 1, explanation: 'А И Б = А + Б − (А ИЛИ Б) = 10000 + 8000 − 15000 = 3000' },
  { text: 'Для чего используется оператор НЕ в поиске?', options: ['Для объединения запросов', 'Для исключения слова из результатов', 'Для обязательного включения слова', 'Для поиска точной фразы'], correct: 1, explanation: 'НЕ (NOT) исключает страницы с данным словом. "кот НЕ рыба" — о кошках, но без рыбы' },
  { text: 'Какой запрос точнее найдёт рецепт борща?', options: ['"борщ ИЛИ суп ИЛИ рецепт"', '"борщ И рецепт"', '"борщ"', '"суп"'], correct: 1, explanation: '"борщ И рецепт" — найдёт страницы именно с рецептом борща, а не все страницы о борще' },
];

interface Props {
  onFinish: (result: Omit<GameResult, 'playedAt'>) => void;
}

export default function SearchQueries({ onFinish }: Props) {
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
      onFinish({ gameId: 'search-queries', score: Math.round((correct / QUESTIONS.length) * 100), maxScore: 100, correctAnswers: correct, totalQuestions: QUESTIONS.length, timeSpent: Math.round((Date.now() - startTime) / 1000), difficulty: 'medium' });
    } else { setQIndex((i) => i + 1); setSelected(null); setPhase('question'); }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="text-white/50 text-sm">Запрос {qIndex + 1} / {QUESTIONS.length}</div>
        <div className="text-white/50 text-sm">Счёт: <span className="text-white font-bold">{score}</span></div>
      </div>
      <div className="w-full h-1.5 bg-white/10 rounded-full"><div className="progress-bar h-full" style={{ width: `${(qIndex / QUESTIONS.length) * 100}%` }} /></div>
      <div className="card-glow rounded-2xl p-6">
        <div className="text-lime-400 text-xs mb-2 font-medium">🔎 ПОИСКОВЫЙ ЗАПРОС</div>
        <p className="text-white text-lg font-semibold">{q.text}</p>
      </div>
      <div className="grid grid-cols-1 gap-3">
        {q.options.map((opt, idx) => {
          let cls = 'card-glow rounded-xl p-4 text-left font-medium transition-all cursor-pointer border ';
          if (phase === 'feedback') {
            if (idx === q.correct) cls += 'game-correct border-emerald-500/80 text-emerald-300';
            else if (idx === selected) cls += 'game-wrong border-red-500/80 text-red-300';
            else cls += 'opacity-40 border-white/10 text-white';
          } else cls += 'border-white/10 hover:border-lime-500/50 hover:bg-lime-500/5 text-white';
          return <button key={idx} className={cls} onClick={() => handleAnswer(idx)}><span className="text-white/40 mr-2">{String.fromCharCode(65 + idx)})</span>{opt}</button>;
        })}
      </div>
      {phase === 'feedback' && (
        <div className={`rounded-xl p-4 text-sm flex items-start gap-3 ${selected === q.correct ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300' : 'bg-red-500/10 border border-red-500/30 text-red-300'}`}>
          <Icon name={selected === q.correct ? 'CheckCircle' : 'XCircle'} size={18} className="flex-shrink-0 mt-0.5" />
          <div><div className="font-semibold mb-1">{selected === q.correct ? 'Запрос успешен! 🔎' : `Нет. Верно: ${q.options[q.correct]}`}</div><div className="text-white/70">{q.explanation}</div></div>
        </div>
      )}
      {phase === 'feedback' && (
        <button onClick={next} className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-lime-600 to-green-600 hover:opacity-90 transition-all">
          {qIndex + 1 >= QUESTIONS.length ? 'Завершить' : 'Далее'} →
        </button>
      )}
    </div>
  );
}
