import { useNavigate } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { useProgress } from '@/hooks/useProgress';
import { GAMES, LEVELS, getLevelInfo, getNextLevel } from '@/data/games';

export default function Profile() {
  const { progress, resetProgress } = useProgress();
  const navigate = useNavigate();

  const levelInfo = getLevelInfo(progress.totalXP);
  const nextLevel = getNextLevel(progress.totalXP);
  const xpInLevel = progress.totalXP - levelInfo.minXP;
  const xpNeeded = nextLevel ? nextLevel.minXP - levelInfo.minXP : 1;
  const xpPercent = Math.min(100, Math.round((xpInLevel / xpNeeded) * 100));

  function handleReset() {
    if (window.confirm('Сбросить весь прогресс? Это действие нельзя отменить.')) {
      resetProgress();
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      <div className="mb-2">
        <h1 className="text-3xl font-black text-white mb-2">Профиль</h1>
        <p className="text-white/50">Твой прогресс подготовки к ОГЭ</p>
      </div>

      <div className="card-glow rounded-3xl p-8">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <div
            className="w-24 h-24 rounded-3xl flex items-center justify-center text-5xl font-black flex-shrink-0"
            style={{
              background: `linear-gradient(135deg, ${levelInfo.color}30, ${levelInfo.color}10)`,
              border: `2px solid ${levelInfo.color}60`,
            }}
          >
            {levelInfo.level}
          </div>
          <div className="flex-1 text-center md:text-left">
            <div className="text-white/40 text-sm mb-1">Уровень {levelInfo.level}</div>
            <div className="text-3xl font-black text-white mb-4" style={{ color: levelInfo.color }}>{levelInfo.title}</div>
            <div className="flex items-center justify-between text-xs text-white/40 mb-2">
              <span>{progress.totalXP} XP</span>
              {nextLevel && <span>До «{nextLevel.title}»: {nextLevel.minXP - progress.totalXP} XP</span>}
            </div>
            <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
              <div className="progress-bar h-full" style={{ width: `${xpPercent}%` }} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Опыт', value: `${progress.totalXP} XP`, icon: 'Star', color: '#f59e0b' },
          { label: 'Игр пройдено', value: `${progress.completedGames.length}/12`, icon: 'Trophy', color: '#8b5cf6' },
          { label: 'Серия дней', value: `${progress.streak}`, icon: 'Flame', color: '#ec4899' },
          { label: 'Всего попыток', value: `${progress.gameResults.length}`, icon: 'Gamepad2', color: '#06b6d4' },
        ].map((s) => (
          <div key={s.label} className="card-glow rounded-2xl p-5 text-center">
            <div className="w-10 h-10 rounded-xl mx-auto mb-3 flex items-center justify-center" style={{ background: `${s.color}20`, border: `1px solid ${s.color}40` }}>
              <Icon name={s.icon} size={20} style={{ color: s.color }} />
            </div>
            <div className="text-2xl font-black text-white mb-1">{s.value}</div>
            <div className="text-white/40 text-xs">{s.label}</div>
          </div>
        ))}
      </div>

      <div>
        <h2 className="text-xl font-bold text-white mb-4">Путь уровней</h2>
        <div className="space-y-3">
          {LEVELS.map((lvl) => {
            const isCurrentOrPast = progress.totalXP >= lvl.minXP;
            const isCurrent = lvl.level === levelInfo.level;
            return (
              <div
                key={lvl.level}
                className={`card-glow rounded-2xl p-4 flex items-center gap-4 transition-all ${isCurrent ? 'border border-opacity-50' : ''}`}
                style={isCurrent ? { borderColor: lvl.color } : {}}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-black flex-shrink-0"
                  style={{
                    background: isCurrentOrPast ? `${lvl.color}30` : 'rgba(255,255,255,0.05)',
                    border: `2px solid ${isCurrentOrPast ? lvl.color : 'rgba(255,255,255,0.1)'}`,
                    color: isCurrentOrPast ? lvl.color : 'rgba(255,255,255,0.2)',
                  }}
                >
                  {lvl.level}
                </div>
                <div className="flex-1">
                  <div className={`font-bold ${isCurrentOrPast ? 'text-white' : 'text-white/30'}`}>{lvl.title}</div>
                  <div className={`text-xs ${isCurrentOrPast ? 'text-white/50' : 'text-white/20'}`}>
                    {lvl.minXP} — {lvl.maxXP === Infinity ? '∞' : lvl.maxXP} XP
                  </div>
                </div>
                {isCurrentOrPast && (
                  <Icon name={isCurrent ? 'Zap' : 'Check'} size={18} style={{ color: lvl.color }} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold text-white mb-4">Прогресс по темам</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {GAMES.map((game) => {
            const best = progress.bestScores[game.id] ?? 0;
            return (
              <button
                key={game.id}
                onClick={() => navigate(`/game/${game.id}`)}
                className="card-glow rounded-xl p-4 text-left flex items-center gap-3 group"
              >
                <div className="text-2xl">{game.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-white text-sm font-medium truncate">{game.title}</div>
                  <div className="w-full h-1.5 bg-white/10 rounded-full mt-1 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${best}%`,
                        background: best >= 80 ? '#10b981' : best >= 50 ? '#f59e0b' : best > 0 ? '#ef4444' : 'transparent',
                      }}
                    />
                  </div>
                </div>
                <div className={`text-sm font-bold flex-shrink-0 ${best >= 80 ? 'text-emerald-400' : best >= 50 ? 'text-amber-400' : best > 0 ? 'text-red-400' : 'text-white/20'}`}>
                  {best > 0 ? `${best}%` : '—'}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="card-glow rounded-2xl p-6 border border-red-500/10">
        <h3 className="text-white font-bold mb-2">Сбросить прогресс</h3>
        <p className="text-white/40 text-sm mb-4">Удалит все результаты, очки и достижения. Действие нельзя отменить.</p>
        <button onClick={handleReset} className="px-6 py-2 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-all text-sm font-medium">
          Сбросить всё
        </button>
      </div>
    </div>
  );
}
