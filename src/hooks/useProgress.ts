import { useState, useCallback } from 'react';
import { UserProgress, GameResult, GameId } from '@/types/game';
import { getLevelInfo } from '@/data/games';

const STORAGE_KEY = 'oge_trainer_progress';

const defaultProgress: UserProgress = {
  totalXP: 0,
  level: 1,
  gameResults: [],
  bestScores: {} as Record<GameId, number>,
  completedGames: [],
  streak: 0,
  lastPlayedAt: null,
};

function loadProgress(): UserProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultProgress;
    return { ...defaultProgress, ...JSON.parse(raw) };
  } catch {
    return defaultProgress;
  }
}

function saveProgress(progress: UserProgress) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export function useProgress() {
  const [progress, setProgress] = useState<UserProgress>(loadProgress);

  const saveResult = useCallback((result: GameResult) => {
    setProgress((prev) => {
      const xpGained = Math.round((result.score / result.maxScore) * 50);
      const newXP = prev.totalXP + xpGained;
      const levelInfo = getLevelInfo(newXP);

      const prevBest = prev.bestScores[result.gameId] ?? 0;
      const newBestScores = {
        ...prev.bestScores,
        [result.gameId]: Math.max(prevBest, result.score),
      };

      const newCompleted = prev.completedGames.includes(result.gameId)
        ? prev.completedGames
        : [...prev.completedGames, result.gameId];

      const today = new Date().toDateString();
      const lastDay = prev.lastPlayedAt ? new Date(prev.lastPlayedAt).toDateString() : null;
      const newStreak = lastDay === today ? prev.streak : prev.streak + 1;

      const updated: UserProgress = {
        totalXP: newXP,
        level: levelInfo.level,
        gameResults: [result, ...prev.gameResults].slice(0, 50),
        bestScores: newBestScores,
        completedGames: newCompleted,
        streak: newStreak,
        lastPlayedAt: new Date().toISOString(),
      };

      saveProgress(updated);
      return updated;
    });
  }, []);

  const resetProgress = useCallback(() => {
    saveProgress(defaultProgress);
    setProgress(defaultProgress);
  }, []);

  return { progress, saveResult, resetProgress };
}
