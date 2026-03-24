import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { GAMES } from '@/data/games';
import { useProgress } from '@/hooks/useProgress';
import { GameResult, GameId } from '@/types/game';
import Icon from '@/components/ui/icon';
import { getLevelInfo } from '@/data/games';

import MemoryBytes from '@/games/MemoryBytes';
import Coder from '@/games/Coder';
import NumberDetective from '@/games/NumberDetective';
import RoadArchitect from '@/games/RoadArchitect';
import AlgoConstructor from '@/games/AlgoConstructor';
import LogicDetective from '@/games/LogicDetective';
import UrlBuilder from '@/games/UrlBuilder';
import SearchQueries from '@/games/SearchQueries';
import CityRoutes from '@/games/CityRoutes';
import NumberSystems from '@/games/NumberSystems';
import FileDetective from '@/games/FileDetective';
import TextSearch from '@/games/TextSearch';
import Task13DataWork from '@/games/Task13DataWork';
import Task14Algorithms from '@/games/Task14Algorithms';
import Task15Programming from '@/games/Task15Programming';
import Task16Advanced from '@/games/Task16Advanced';

function GameComponent({ gameId, onFinish }: { gameId: GameId; onFinish: (r: Omit<GameResult, 'playedAt'>) => void }) {
  switch (gameId) {
    case 'memory-bytes': return <MemoryBytes onFinish={onFinish} />;
    case 'coder': return <Coder onFinish={onFinish} />;
    case 'number-detective': return <NumberDetective onFinish={onFinish} />;
    case 'road-architect': return <RoadArchitect onFinish={onFinish} />;
    case 'algo-constructor': return <AlgoConstructor onFinish={onFinish} />;
    case 'logic-detective': return <LogicDetective onFinish={onFinish} />;
    case 'url-builder': return <UrlBuilder onFinish={onFinish} />;
    case 'search-queries': return <SearchQueries onFinish={onFinish} />;
    case 'city-routes': return <CityRoutes onFinish={onFinish} />;
    case 'number-systems': return <NumberSystems onFinish={onFinish} />;
    case 'file-detective': return <FileDetective onFinish={onFinish} />;
    case 'text-search': return <TextSearch onFinish={onFinish} />;
    case 'task13-data': return <Task13DataWork onFinish={onFinish} />;
    case 'task14-algo': return <Task14Algorithms onFinish={onFinish} />;
    case 'task15-prog': return <Task15Programming onFinish={onFinish} />;
    case 'task16-adv': return <Task16Advanced onFinish={onFinish} />;
    default: return <div className="text-white">Игра не найдена</div>;
  }
}

export default function GamePlay() {
  const { gameId } = useParams<{ gameId: string }>();
  const navigate = useNavigate();
  const { progress, saveResult } = useProgress();
  const [phase, setPhase] = useState<'intro' | 'playing' | 'result'>('intro');
  const [result, setResult] = useState<GameResult | null>(null);

  const game = GAMES.find((g) => g.id === gameId);
  if (!game) return (
    <div className="min-h-screen flex items-center justify-center text-white">
      <div className="text-center">
        <div className="text-6xl mb-4">😅</div>
        <div className="text-xl mb-4">Игра не найдена</div>
        <button onClick={() => navigate('/games')} className="btn-primary">Вернуться к играм</button>
      </div>
    </div>
  );

  const prevBest = progress.bestScores[game.id] ?? 0;

  function handleFinish(r: Omit<GameResult, 'playedAt'>) {
    const full: GameResult = { ...r, playedAt: new Date().toISOString() };
    saveResult(full);
    setResult(full);
    setPhase('result');
  }

  if (phase === 'intro') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <button onClick={() => navigate('/games')} className="flex items-center gap-2 text-white/50 hover:text-white mb-8 transition-colors text-sm">
          <Icon name="ArrowLeft" size={16} /> Назад к играм
        </button>
        <div className="card-glow rounded-3xl p-8 text-center">
          <div className="text-7xl mb-6">{game.icon}</div>
          <div className="text-white/40 text-sm mb-2">{game.subtitle} · {game.topic}</div>
          <h1 className="text-3xl font-black text-white mb-4">{game.title}</h1>
          <p className="text-white/60 text-base mb-8 leading-relaxed">{game.description}</p>

          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-white/5 rounded-xl p-4">
              <div className="text-white font-bold text-lg">10</div>
              <div className="text-white/40 text-xs">вопросов</div>
            </div>
            <div className="bg-white/5 rounded-xl p-4">
              <div className={`font-bold text-lg ${game.difficulty === 'easy' ? 'text-emerald-400' : game.difficulty === 'medium' ? 'text-amber-400' : 'text-red-400'}`}>
                {game.difficulty === 'easy' ? 'Лёгкий' : game.difficulty === 'medium' ? 'Средний' : 'Сложный'}
              </div>
              <div className="text-white/40 text-xs">сложность</div>
            </div>
            <div className="bg-white/5 rounded-xl p-4">
              <div className="text-amber-400 font-bold text-lg">{prevBest > 0 ? `${prevBest}%` : '—'}</div>
              <div className="text-white/40 text-xs">рекорд</div>
            </div>
          </div>

          <button
            onClick={() => setPhase('playing')}
            className={`w-full py-4 rounded-2xl text-white font-bold text-lg bg-gradient-to-r ${game.color} hover:opacity-90 transition-all shadow-lg`}
            style={{ boxShadow: `0 8px 32px ${game.glowColor}` }}
          >
            Начать игру 🚀
          </button>
        </div>
      </div>
    );
  }

  if (phase === 'playing') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${game.color} flex items-center justify-center text-xl`}>{game.icon}</div>
          <div>
            <div className="text-white font-bold">{game.title}</div>
            <div className="text-white/40 text-xs">{game.subtitle}</div>
          </div>
        </div>
        <GameComponent gameId={game.id} onFinish={handleFinish} />
      </div>
    );
  }

  if (phase === 'result' && result) {
    const pct = result.score;
    const xpGained = Math.round((pct / 100) * 50);
    const isNewRecord = pct > prevBest;
    const newLevel = getLevelInfo(progress.totalXP);

    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="card-glow rounded-3xl p-8 text-center">
          <div className="text-7xl mb-4">
            {pct >= 90 ? '🏆' : pct >= 70 ? '🎉' : pct >= 50 ? '👍' : '😅'}
          </div>
          <h2 className="text-3xl font-black text-white mb-2">
            {pct >= 90 ? 'Блестяще!' : pct >= 70 ? 'Отлично!' : pct >= 50 ? 'Неплохо!' : 'Попробуй ещё!'}
          </h2>
          <p className="text-white/50 mb-8">{game.title} завершена</p>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-white/5 rounded-2xl p-5">
              <div className="text-5xl font-black gradient-text mb-1">{pct}%</div>
              <div className="text-white/40 text-sm">результат</div>
              {isNewRecord && <div className="text-amber-400 text-xs mt-1">🏆 Новый рекорд!</div>}
            </div>
            <div className="bg-white/5 rounded-2xl p-5">
              <div className="text-5xl font-black text-emerald-400 mb-1">{result.correctAnswers}/{result.totalQuestions}</div>
              <div className="text-white/40 text-sm">правильных ответов</div>
            </div>
            <div className="bg-white/5 rounded-2xl p-5">
              <div className="text-3xl font-black text-purple-400 mb-1">+{xpGained} XP</div>
              <div className="text-white/40 text-sm">получено опыта</div>
            </div>
            <div className="bg-white/5 rounded-2xl p-5">
              <div className="text-3xl font-black text-cyan-400 mb-1">{result.timeSpent}с</div>
              <div className="text-white/40 text-sm">время</div>
            </div>
          </div>

          <div className="bg-white/5 rounded-2xl p-4 mb-6 text-left">
            <div className="text-white/50 text-xs mb-2">Твой уровень</div>
            <div className="flex items-center gap-3">
              <div className="text-2xl font-black text-white">{newLevel.title}</div>
              <div className="text-white/30 text-sm">{progress.totalXP} XP</div>
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={() => setPhase('intro')} className="flex-1 py-3 rounded-xl border border-white/20 text-white hover:bg-white/5 transition-all font-medium">
              Играть снова
            </button>
            <button onClick={() => navigate('/games')} className="flex-1 btn-primary py-3">
              К играм →
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}