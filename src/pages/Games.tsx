import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { GAMES } from '@/data/games';
import { useProgress } from '@/hooks/useProgress';
import { Difficulty } from '@/types/game';

const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  easy: 'Лёгкий',
  medium: 'Средний',
  hard: 'Сложный',
};

const DIFFICULTY_COLORS: Record<Difficulty, string> = {
  easy: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  medium: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  hard: 'bg-red-500/20 text-red-400 border-red-500/30',
};

type FilterDifficulty = Difficulty | 'all';

export default function Games() {
  const navigate = useNavigate();
  const { progress } = useProgress();
  const [filter, setFilter] = useState<FilterDifficulty>('all');

  const filtered = filter === 'all' ? GAMES : GAMES.filter((g) => g.difficulty === filter);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-black text-white mb-2">Мини-игры</h1>
        <p className="text-white/50">16 заданий ОГЭ по информатике — каждое в формате интерактивной игры</p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="card-glow rounded-2xl p-5 border border-purple-500/20">
          <div className="text-purple-400 text-xs font-medium mb-2">📝 КРАТКИЕ ОТВЕТЫ</div>
          <div className="text-white font-bold text-lg mb-1">Задания 1–12</div>
          <div className="text-white/50 text-sm">Выбор из вариантов, числовые ответы, логические задачи</div>
        </div>
        <div className="card-glow rounded-2xl p-5 border border-amber-500/20">
          <div className="text-amber-400 text-xs font-medium mb-2">🏆 РАЗВЁРНУТЫЕ ОТВЕТЫ</div>
          <div className="text-white font-bold text-lg mb-1">Задания 13–16</div>
          <div className="text-white/50 text-sm">Данные, алгоритмы, программирование, сложные задачи</div>
        </div>
      </div>

      <div className="flex items-center gap-3 mb-8 flex-wrap">
        {(['all', 'easy', 'medium', 'hard'] as FilterDifficulty[]).map((d) => (
          <button
            key={d}
            onClick={() => setFilter(d)}
            className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
              filter === d
                ? 'bg-purple-500/30 text-white border-purple-500/50'
                : 'bg-white/5 text-white/50 border-white/10 hover:border-white/20 hover:text-white/80'
            }`}
          >
            {d === 'all' ? 'Все' : DIFFICULTY_LABELS[d]}
          </button>
        ))}
        <div className="ml-auto text-white/30 text-sm">
          {progress.completedGames.length} / {GAMES.length} пройдено
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((game, idx) => {
          const bestScore = progress.bestScores[game.id] ?? 0;
          const isCompleted = progress.completedGames.includes(game.id);
          return (
            <button
              key={game.id}
              onClick={() => navigate(`/game/${game.id}`)}
              className="card-glow rounded-2xl p-5 text-left group flex flex-col animate-fade-in"
              style={{ animationDelay: `${idx * 0.05}s` }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="text-4xl">{game.icon}</div>
                {isCompleted && (
                  <div className="w-7 h-7 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center flex-shrink-0">
                    <Icon name="Check" size={14} className="text-emerald-400" />
                  </div>
                )}
              </div>

              <div className="text-xs text-white/40 mb-1">{game.subtitle}</div>
              <div className="text-white font-bold text-base mb-1">{game.title}</div>
              <div className="text-white/40 text-xs mb-3 line-clamp-1">{game.topic}</div>
              <div className="text-white/50 text-xs mb-4 line-clamp-2 flex-1">{game.description}</div>

              <div className="flex items-center justify-between mt-auto">
                <span className={`text-xs px-2 py-1 rounded-lg border ${DIFFICULTY_COLORS[game.difficulty]}`}>
                  {DIFFICULTY_LABELS[game.difficulty]}
                </span>
                {bestScore > 0 && (
                  <div className="flex items-center gap-1 text-amber-400 text-xs">
                    <Icon name="Star" size={12} />
                    {bestScore}
                  </div>
                )}
              </div>

              {bestScore > 0 && (
                <div className="mt-3">
                  <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${bestScore}%`,
                        background: `linear-gradient(90deg, ${game.glowColor.replace('0.4', '1')}, #06b6d4)`,
                      }}
                    />
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}