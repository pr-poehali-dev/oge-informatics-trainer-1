import { useNavigate } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { useProgress } from '@/hooks/useProgress';
import { GAMES } from '@/data/games';

export default function Results() {
  const { progress } = useProgress();
  const navigate = useNavigate();

  const totalGames = progress.gameResults.length;
  const avgScore = totalGames > 0
    ? Math.round(progress.gameResults.reduce((s, r) => s + r.score, 0) / totalGames)
    : 0;

  const gamesWithResults = GAMES.map((g) => ({
    ...g,
    best: progress.bestScores[g.id] ?? 0,
    played: progress.gameResults.filter((r) => r.gameId === g.id).length,
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white mb-2">Результаты</h1>
        <p className="text-white/50">Твоя статистика подготовки к ОГЭ</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Игр сыграно', value: totalGames, icon: 'Gamepad2', color: '#8b5cf6' },
          { label: 'Средний балл', value: `${avgScore}%`, icon: 'TrendingUp', color: '#06b6d4' },
          { label: 'Пройдено игр', value: `${progress.completedGames.length}/12`, icon: 'CheckCircle', color: '#10b981' },
          { label: 'Серия дней', value: progress.streak, icon: 'Flame', color: '#ec4899' },
        ].map((s) => (
          <div key={s.label} className="card-glow rounded-2xl p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${s.color}20`, border: `1px solid ${s.color}40` }}>
              <Icon name={s.icon} size={22} style={{ color: s.color }} />
            </div>
            <div>
              <div className="text-2xl font-black text-white">{s.value}</div>
              <div className="text-white/40 text-xs">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-bold text-white mb-4">Результаты по играм</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {gamesWithResults.map((g) => (
            <div key={g.id} className="card-glow rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="text-3xl">{g.icon}</div>
                <div>
                  <div className="text-white font-bold text-sm">{g.title}</div>
                  <div className="text-white/40 text-xs">{g.subtitle}</div>
                </div>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-white/50 text-xs">Лучший результат</span>
                <span className="text-white font-bold">{g.best > 0 ? `${g.best}%` : '—'}</span>
              </div>
              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden mb-3">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${g.best}%`,
                    background: g.best >= 80 ? 'linear-gradient(90deg,#10b981,#06b6d4)' : g.best >= 50 ? 'linear-gradient(90deg,#f59e0b,#ec4899)' : 'linear-gradient(90deg,#ef4444,#f59e0b)',
                  }}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/30 text-xs">Попыток: {g.played}</span>
                {g.best === 0 ? (
                  <button onClick={() => navigate(`/game/${g.id}`)} className="text-xs text-purple-400 hover:text-purple-300">Играть →</button>
                ) : g.best < 80 ? (
                  <button onClick={() => navigate(`/game/${g.id}`)} className="text-xs text-amber-400 hover:text-amber-300">Улучшить →</button>
                ) : (
                  <span className="text-xs text-emerald-400">✓ Освоено</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {progress.gameResults.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-white mb-4">История игр</h2>
          <div className="card-glow rounded-2xl overflow-hidden">
            <div className="divide-y divide-white/5">
              {progress.gameResults.slice(0, 15).map((r, i) => {
                const game = GAMES.find((g) => g.id === r.gameId);
                return (
                  <div key={i} className="px-5 py-4 flex items-center gap-4">
                    <div className="text-2xl">{game?.icon}</div>
                    <div className="flex-1">
                      <div className="text-white text-sm font-medium">{game?.title}</div>
                      <div className="text-white/30 text-xs">{new Date(r.playedAt).toLocaleDateString('ru-RU')}</div>
                    </div>
                    <div className={`text-lg font-black ${r.score >= 80 ? 'text-emerald-400' : r.score >= 50 ? 'text-amber-400' : 'text-red-400'}`}>
                      {r.score}%
                    </div>
                    <div className="text-white/30 text-sm">{r.correctAnswers}/{r.totalQuestions}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {progress.gameResults.length === 0 && (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🎮</div>
          <div className="text-white/50 text-lg mb-4">Ещё нет результатов</div>
          <button onClick={() => navigate('/games')} className="btn-primary">Начать играть</button>
        </div>
      )}
    </div>
  );
}
