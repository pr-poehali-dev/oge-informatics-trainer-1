import { useNavigate } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { GAMES, getLevelInfo, getNextLevel } from '@/data/games';
import { useProgress } from '@/hooks/useProgress';

export default function Home() {
  const navigate = useNavigate();
  const { progress } = useProgress();
  const levelInfo = getLevelInfo(progress.totalXP);
  const nextLevel = getNextLevel(progress.totalXP);
  const xpInLevel = progress.totalXP - levelInfo.minXP;
  const xpNeeded = nextLevel ? nextLevel.minXP - levelInfo.minXP : 1;
  const xpPercent = Math.min(100, Math.round((xpInLevel / xpNeeded) * 100));

  const recentGames = GAMES.slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">
      <section className="relative rounded-3xl overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(https://cdn.poehali.dev/projects/bf5d476d-197e-4313-b386-a5d7aa7c3707/files/681732d9-b84b-4b9c-9c5a-3979a5bddc28.jpg)` }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/80 via-[#0d0e1a]/60 to-cyan-900/50" />
        <div className="relative z-10 px-8 py-16 md:py-24 flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white/80 text-sm mb-6 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Готовься к ОГЭ по информатике
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-4 leading-tight">
              Тренажёр{' '}
              <span className="gradient-text">ОГЭ</span>
              <br />
              по информатике
            </h1>
            <p className="text-white/60 text-lg mb-8 max-w-lg">
              16 интерактивных мини-игр по всем темам экзамена — от объёма памяти до программирования на Python. От новичка до эксперта!
            </p>
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <button onClick={() => navigate('/games')} className="btn-primary text-base px-8 py-4">
                Начать играть 🎮
              </button>
              <button onClick={() => navigate('/theory')} className="btn-cyan text-base px-8 py-4">
                Изучить теорию
              </button>
            </div>
          </div>

          <div className="flex-shrink-0">
            <div className="card-glow rounded-2xl p-6 w-72 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-white/50 text-xs mb-1">Твой уровень</div>
                  <div className="text-white font-bold text-xl">{levelInfo.title}</div>
                </div>
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-black"
                  style={{ background: `linear-gradient(135deg, ${levelInfo.color}40, ${levelInfo.color}20)`, border: `2px solid ${levelInfo.color}60` }}
                >
                  {levelInfo.level}
                </div>
              </div>
              <div className="mb-2 flex justify-between text-xs text-white/40">
                <span>{progress.totalXP} XP</span>
                {nextLevel && <span>до {nextLevel.title}: {nextLevel.minXP - progress.totalXP} XP</span>}
              </div>
              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                <div className="progress-bar h-full" style={{ width: `${xpPercent}%` }} />
              </div>
              <div className="mt-4 grid grid-cols-3 gap-3 text-center">
                <div className="bg-white/5 rounded-xl p-3">
                  <div className="text-white font-bold">{progress.completedGames.length}</div>
                  <div className="text-white/40 text-xs">игр</div>
                </div>
                <div className="bg-white/5 rounded-xl p-3">
                  <div className="text-white font-bold">{progress.streak}</div>
                  <div className="text-white/40 text-xs">серия</div>
                </div>
                <div className="bg-white/5 rounded-xl p-3">
                  <div className="text-white font-bold">{progress.totalXP}</div>
                  <div className="text-white/40 text-xs">опыт</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Статистика подготовки</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: 'Gamepad2', label: 'Мини-игр', value: '16', color: '#8b5cf6' },
            { icon: 'BookOpen', label: 'Тем ОГЭ', value: '16', color: '#06b6d4' },
            { icon: 'Trophy', label: 'Твой рекорд', value: `${Math.max(0, ...Object.values(progress.bestScores))}`, color: '#f59e0b' },
            { icon: 'Flame', label: 'Серия дней', value: `${progress.streak}`, color: '#ec4899' },
          ].map((stat) => (
            <div key={stat.label} className="card-glow rounded-2xl p-5 flex items-center gap-4">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: `${stat.color}20`, border: `1px solid ${stat.color}40` }}
              >
                <Icon name={stat.icon} size={22} style={{ color: stat.color }} />
              </div>
              <div>
                <div className="text-2xl font-black text-white">{stat.value}</div>
                <div className="text-white/40 text-xs">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Начни с этих игр</h2>
          <button onClick={() => navigate('/games')} className="text-purple-400 hover:text-purple-300 text-sm flex items-center gap-1 transition-colors">
            Все игры <Icon name="ArrowRight" size={14} />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recentGames.map((game) => (
            <button
              key={game.id}
              onClick={() => navigate(`/game/${game.id}`)}
              className="card-glow rounded-2xl p-6 text-left group transition-all"
            >
              <div className="text-4xl mb-4">{game.icon}</div>
              <div className="text-xs text-white/40 mb-1">{game.subtitle}</div>
              <div className="text-white font-bold text-lg mb-2">{game.title}</div>
              <div className="text-white/50 text-sm mb-4 line-clamp-2">{game.description}</div>
              <div className="flex items-center justify-between">
                <span className={`text-xs px-2 py-1 rounded-full ${
                  game.difficulty === 'easy' ? 'bg-emerald-500/20 text-emerald-400' :
                  game.difficulty === 'medium' ? 'bg-amber-500/20 text-amber-400' :
                  'bg-red-500/20 text-red-400'
                }`}>
                  {game.difficulty === 'easy' ? 'Лёгкий' : game.difficulty === 'medium' ? 'Средний' : 'Сложный'}
                </span>
                <Icon name="ArrowRight" size={18} className="text-white/30 group-hover:text-white/70 transition-colors" />
              </div>
            </button>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-white mb-6">Путь к пятёрке</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { step: '1', title: 'Изучи теорию', desc: 'Разбери каждую тему с объяснениями и примерами', icon: 'BookOpen', color: '#06b6d4' },
            { step: '2', title: 'Играй и практикуйся', desc: '12 мини-игр охватывают все задания экзамена', icon: 'Gamepad2', color: '#8b5cf6' },
            { step: '3', title: 'Следи за прогрессом', desc: 'Прокачивай уровень от Новичка до Эксперта', icon: 'TrendingUp', color: '#ec4899' },
          ].map((item) => (
            <div key={item.step} className="card-glow rounded-2xl p-6 flex gap-4">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-black flex-shrink-0 mt-1"
                style={{ background: `${item.color}20`, color: item.color, border: `1px solid ${item.color}40` }}
              >
                {item.step}
              </div>
              <div>
                <div className="text-white font-bold mb-1">{item.title}</div>
                <div className="text-white/50 text-sm">{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}