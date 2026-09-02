// Event 比賽資訊
export interface Event {
  id: string;
  schoolName: string;
  eventName: string;
  sport: 'basketball' | 'tabletennis' | 'badminton' | 'football' | 'volleyball' | 'dodgeball' | 'other';
  sportOther?: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  venue: string;
  organizer: string;
  contact: string;
  contactPhone?: string;
  format: 'single_elimination';
  status: 'editing' | 'bracket_generated' | 'ongoing' | 'completed';
  matchDuration: number; // 分鐘
  breakBetweenMatches: number; // 分鐘
  midBreak?: {
    enabled: boolean;
    after: number; // 第幾輪後
    duration: number; // 分鐘
  };
  venues: Venue[];
  createdAt: string;
  updatedAt: string;
}

// Venue 場地
export interface Venue {
  id: string;
  name: string;
  capacity?: number;
}

// Team 隊伍
export interface Team {
  id: string;
  eventId: string;
  name: string;
  grade: string;
  className: string;
  seed?: number;
  group?: string;
  displayName?: string;
  order: number;
}

// Match 單場比賽
export interface Match {
  id: string;
  eventId: string;
  round: number;
  matchNumberInRound: number;
  matchNumber: number;
  teamA: Team | null;
  teamB: Team | null;
  scoreA: number | null;
  scoreB: number | null;
  winner: Team | null;
  winnerTeamId?: string;
  date: string;
  time: string;
  venue: Venue | null;
  venueId?: string;
  status: 'pending' | 'ongoing' | 'completed' | 'bye';
  notes?: string;
  referee?: string;
}

// Bracket 淘汰賽架構
export interface Bracket {
  id: string;
  eventId: string;
  totalTeams: number;
  totalRounds: number;
  byes: number;
  drawMethod: 'random' | 'order' | 'seed' | 'manual';
  matches: Match[];
  teams: Team[];
}

// Schedule 完整賽程
export interface Schedule {
  id: string;
  eventId: string;
  bracket: Bracket;
  matches: Match[];
  conflicts: ScheduleConflict[];
}

export interface ScheduleConflict {
  type: 'team_double_booking' | 'venue_double_booking';
  matchId1: string;
  matchId2: string;
  message: string;
}

// Result 最終排名
export interface Result {
  id: string;
  eventId: string;
  champion?: Team;
  runnerUp?: Team;
  thirdPlace?: Team;
  fourthPlace?: Team;
  finalRankings: {
    rank: number;
    team: Team;
    wins: number;
    losses: number;
  }[];
  awards: Award[];
}

// Award 獎項
export interface Award {
  id: string;
  eventId: string;
  category: 'best_player' | 'spirit' | 'fair_play' | 'custom';
  team?: Team;
  teamId?: string;
  player?: string;
  description?: string;
}

// Stored data structure
export interface StoredTournament {
  event: Event;
  teams: Team[];
  bracket?: Bracket;
  matches: Match[];
  schedule?: Schedule;
  results?: Result;
  metadata: {
    version: string;
    lastModified: string;
  };
}
