import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { GameResult } from '@/types/game';

const QUESTIONS = [
  { text: 'Возраст > 18 И город = "Москва". Верно ли для: возраст=20, город="Москва"?', options: ['Истина', 'Ложь', 'Невозможно определить', 'Зависит от условия'], correct: 0, explanation: '20 > 18 = ИСТИНА, "Москва" = "Москва" = ИСТИНА. ИСТИНА И ИСТИНА = ИСТИНА' },
  { text: 'x > 5 ИЛИ x < 2. Верно ли для x = 3?', options: ['Истина', 'Ложь', 'Возможно', 'Не определено'], correct: 1, explanation: '3 > 5 = ЛОЖЬ, 3 < 2 = ЛОЖЬ. ЛОЖЬ ИЛИ ЛОЖЬ = ЛОЖЬ' },
  { text: 'НЕ (x = 5). Результат при x = 7?', options: ['Ложь', 'Истина', '7', '5'], correct: 1, explanation: 'x = 5 → 7=5 = ЛОЖЬ. НЕ ЛОЖЬ = ИСТИНА' },
  { text: 'Условие: a > 0 И b > 0. При a=3, b=-1 результат?', options: ['Истина', 'Ложь', 'Ошибка', 'Не определено'], correct: 1, explanation: '3 > 0 = ИСТИНА, -1 > 0 = ЛОЖЬ. ИСТИНА И ЛОЖЬ = ЛОЖЬ' },
  { text: 'Сколько значений может принимать логическая переменная?', options: ['Бесконечно много', '10', '2', '256'], correct: 2, explanation: 'Логическая переменная: только ИСТИНА (true) или ЛОЖЬ (false)' },
  { text: 'Таблица истинности И: ЛОЖЬ И ИСТИНА = ?', options: ['Истина', 'Ложь', 'Зависит', 'Ошибка'], correct: 1, explanation: 'Операция И (AND): результат ИСТИНА только если ОБА операнда = ИСТИНА' },
  { text: 'Таблица истинности ИЛИ: ЛОЖЬ ИЛИ ИСТИНА = ?', options: ['Ложь', 'Истина', 'Зависит', 'Ошибка'], correct: 1, explanation: 'Операция ИЛИ (OR): результат ИСТИНА если хотя бы ОДИН операнд = ИСТИНА' },
  { text: 'НЕ ИСТИНА = ?', options: ['Истина', 'Ложь', '0', 'Ошибка'], correct: 1, explanation: 'НЕ (NOT) инвертирует: НЕ ИСТИНА = ЛОЖЬ, НЕ ЛОЖЬ = ИСТИНА' },
  { text: 'if x > 10: вывод "большое" else: вывод "малое". x=10, что выведется?', options: ['"большое"', '"малое"', 'Ошибка', 'Ничего'], correct: 1, explanation: '10 > 10 = ЛОЖЬ → выполняется else: "малое"' },
  { text: 'Условие: (a > 5) И (b < 10) ИЛИ (c = 0). При a=3, b=8, c=0 результат?', options: ['Ложь', 'Истина', 'Ошибка', 'Не определено'], correct: 1, explanation: '(3>5)=Л, (8<10)=И → (Л И И)=Л; c=0 → (0=0)=И; Л ИЛИ И = ИСТИНА' },
];

interface Props {
  onFinish: (result: Omit<GameResult, 'playedAt'>) => void;
}

export default function LogicDetective({ onFinish }: Props) {
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
      onFinish({ gameId: 'logic-detective', score: Math.round((correct / QUESTIONS.length) * 100), maxScore: 100, correctAnswers: correct, totalQuestions: QUESTIONS.length, timeSpent: Math.round((Date.now() - startTime) / 1000), difficulty: 'medium' });
    } else { setQIndex((i) => i + 1); setSelected(null); setPhase('question'); }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="text-white/50 text-sm">Дело {qIndex + 1} / {QUESTIONS.length}</div>
        <div className="text-white/50 text-sm">Счёт: <span className="text-white font-bold">{score}</span></div>
      </div>
      <div className="w-full h-1.5 bg-white/10 rounded-full"><div className="progress-bar h-full" style={{ width: `${(qIndex / QUESTIONS.length) * 100}%` }} /></div>
      <div className="card-glow rounded-2xl p-6">
        <div className="text-violet-400 text-xs mb-2 font-medium">🕵️ ЛОГИЧЕСКАЯ ЗАДАЧА</div>
        <p className="text-white text-lg font-semibold font-mono">{q.text}</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {q.options.map((opt, idx) => {
          let cls = 'card-glow rounded-xl p-4 text-center font-bold text-lg transition-all cursor-pointer border ';
          if (phase === 'feedback') {
            if (idx === q.correct) cls += 'game-correct border-emerald-500/80 text-emerald-300';
            else if (idx === selected) cls += 'game-wrong border-red-500/80 text-red-300';
            else cls += 'opacity-40 border-white/10 text-white';
          } else cls += 'border-white/10 hover:border-violet-500/50 hover:bg-violet-500/5 text-white';
          return <button key={idx} className={cls} onClick={() => handleAnswer(idx)}>{opt}</button>;
        })}
      </div>
      {phase === 'feedback' && (
        <div className={`rounded-xl p-4 text-sm flex items-start gap-3 ${selected === q.correct ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300' : 'bg-red-500/10 border border-red-500/30 text-red-300'}`}>
          <Icon name={selected === q.correct ? 'CheckCircle' : 'XCircle'} size={18} className="flex-shrink-0 mt-0.5" />
          <div><div className="font-semibold mb-1">{selected === q.correct ? 'Дело раскрыто! 🕵️' : `Не то. Правильно: ${q.options[q.correct]}`}</div><div className="text-white/70">{q.explanation}</div></div>
        </div>
      )}
      {phase === 'feedback' && (
        <button onClick={next} className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-violet-600 to-purple-700 hover:opacity-90 transition-all">
          {qIndex + 1 >= QUESTIONS.length ? 'Завершить' : 'Следующее дело'} →
        </button>
      )}
    </div>
  );
}
