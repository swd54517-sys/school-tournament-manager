import { Team, Match, Bracket, Event } from '../types';
import { generateId } from '../utils/id';

/**
 * 根據隊伍數計算需要的輪數和輪空隊伍
 */
function calculateRounds(teamCount: number): { rounds: number; byes: number; bracketSize: number } {
  if (teamCount <= 1) return { rounds: 0, byes: 0, bracketSize: teamCount };
  
  const bracketSize = Math.pow(2, Math.ceil(Math.log2(teamCount)));
  const byes = bracketSize - teamCount;
  const rounds = Math.ceil(Math.log2(bracketSize));
  
  return { rounds, byes, bracketSize };
}

/**
 * 產生淘汰賽架構
 */
export function generateBracket(
  eventId: string,
  teams: Team[],
  drawMethod: 'random' | 'order' | 'seed' | 'manual' = 'order'
): Bracket {
  const totalTeams = teams.length;
  const { rounds: totalRounds, byes, bracketSize } = calculateRounds(totalTeams);
  
  // 根據抽籤方法排序隊伍
  let sortedTeams = [...teams];
  if (drawMethod === 'random') {
    sortedTeams = sortedTeams.sort(() => Math.random() - 0.5);
  } else if (drawMethod === 'seed') {
    sortedTeams = sortedTeams.sort((a, b) => (a.seed || 999) - (b.seed || 999));
  } else if (drawMethod === 'order') {
    sortedTeams = sortedTeams.sort((a, b) => a.order - b.order);
  }
  // manual 保持原樣
  
  // 產生第一輪的比賽
  const matches: Match[] = [];
  let matchNumber = 0;
  
  const firstRoundMatches = bracketSize / 2;
  
  for (let i = 0; i < firstRoundMatches; i++) {
    matchNumber++;
    const teamAIndex = i * 2;
    const teamBIndex = i * 2 + 1;
    
    const teamA = teamAIndex < sortedTeams.length ? sortedTeams[teamAIndex] : null;
    const teamB = teamBIndex < sortedTeams.length ? sortedTeams[teamBIndex] : null;
    
    const isBye = !teamA || !teamB;
    
    const match: Match = {
      id: generateId(),
      eventId,
      round: 0,
      matchNumberInRound: i + 1,
      matchNumber,
      teamA,
      teamB,
      scoreA: null,
      scoreB: null,
      winner: null,
      date: '',
      time: '',
      venue: null,
      status: isBye ? 'bye' : 'pending',
      notes: '',
      referee: '',
    };
    
    matches.push(match);
  }
  
  // 產生後續輪次（先不填團隊，等前一輪完成再填）
  for (let round = 1; round < totalRounds; round++) {
    const matchesInThisRound = Math.pow(2, totalRounds - round - 1);
    
    for (let i = 0; i < matchesInThisRound; i++) {
      matchNumber++;
      const match: Match = {
        id: generateId(),
        eventId,
        round,
        matchNumberInRound: i + 1,
        matchNumber,
        teamA: null,
        teamB: null,
        scoreA: null,
        scoreB: null,
        winner: null,
        date: '',
        time: '',
        venue: null,
        status: 'pending',
        notes: '',
        referee: '',
      };
      
      matches.push(match);
    }
  }
  
  return {
    id: generateId(),
    eventId,
    totalTeams,
    totalRounds,
    byes,
    drawMethod,
    matches,
    teams: sortedTeams,
  };
}

/**
 * 根據前一輪的勝者自動安排下一輪
 */
export function advanceWinner(
  matches: Match[],
  completedMatchId: string,
  bracket: Bracket
): Match[] {
  const completedMatch = matches.find(m => m.id === completedMatchId);
  if (!completedMatch || !completedMatch.winner || completedMatch.status !== 'completed') {
    return matches;
  }
  
  const currentRound = completedMatch.round;
  const nextRound = currentRound + 1;
  
  // 計算在下一輪的位置
  // 第一輪第1、2場的勝者進入第二輪第1場
  // 第一輪第3、4場的勝者進入第二輪第2場
  const position = Math.floor((completedMatch.matchNumberInRound - 1) / 2);
  
  const nextRoundMatches = matches.filter(
    m => m.round === nextRound && m.matchNumberInRound === position + 1
  );
  
  if (nextRoundMatches.length === 0) return matches;
  
  const nextMatch = nextRoundMatches[0];
  const isTeamA = (completedMatch.matchNumberInRound - 1) % 2 === 0;
  
  const updatedMatches = matches.map(m => {
    if (m.id === nextMatch.id) {
      return {
        ...m,
        [isTeamA ? 'teamA' : 'teamB']: completedMatch.winner,
      };
    }
    return m;
  });
  
  return updatedMatches;
}

/**
 * 檢測輪空
 */
export function detectByes(bracket: Bracket): { matchId: string; teamName: string }[] {
  return bracket.matches
    .filter(m => m.status === 'bye')
    .map(m => ({
      matchId: m.id,
      teamName: (m.teamA?.name || m.teamB?.name || '輪空') + ' (輪空)',
    }));
}
