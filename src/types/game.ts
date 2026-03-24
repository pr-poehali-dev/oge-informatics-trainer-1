export type Difficulty = 'easy' | 'medium' | 'hard';

export type GameId =
  | 'memory-bytes'
  | 'coder'
  | 'number-detective'
  | 'road-architect'
  | 'algo-constructor'
  | 'logic-detective'
  | 'url-builder'
  | 'search-queries'
  | 'city-routes'
  | 'number-systems'
  | 'file-detective'
  | 'text-search'
  | 'task13-data'
  | 'task14-algo'
  | 'task15-prog'
  | 'task16-adv';

export interface GameMeta {
  id: GameId;
  title: string;
  subtitle: string;
  taskNumber: number;
  topic: string;
  icon: string;
  color: string;
  glowColor: string;
  difficulty: Difficulty;
  maxScore: number;
  description: string;
}

export interface GameResult {
  gameId: GameId;
  score: number;
  maxScore: number;
  correctAnswers: number;
  totalQuestions: number;
  timeSpent: number;
  playedAt: string;
  difficulty: Difficulty;
}

export interface UserProgress {
  totalXP: number;
  level: number;
  gameResults: GameResult[];
  bestScores: Record<GameId, number>;
  completedGames: GameId[];
  streak: number;
  lastPlayedAt: string | null;
}

export interface LevelInfo {
  level: number;
  title: string;
  minXP: number;
  maxXP: number;
  color: string;
}