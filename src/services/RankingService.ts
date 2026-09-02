import { Team, Match, Result, Award } from '../types';

/**
 * 根據淘汰賽結果計算排名
 */
export function calculateRankings(matches: Match[], teams: Team[]): Result {
  const results: Result = {
    id: `result-${Date.now()}`,
    eventId: matches[0]?.eventId || '',
    finalRankings: [],
    awards: [],
  };

  // 找出決賽
  const finals = matches.filter(m => m.round === Math.max(...matches.map(mm => mm.round)));
  if (finals.length > 0) {
    const final = finals[0];
    if (final.winner) {
      results.champion = final.winner;
    }
    // 亞軍是決賽的敗者
    if (final.teamA && final.winner?.id === final.teamA.id) {
      results.runnerUp = final.teamB || undefined;
    } else if (final.teamB) {
      results.runnerUp = final.teamA || undefined;
    }
  }

  // 找三四名賽
  const semifinals = matches.filter(
    m => m.round === Math.max(...matches.map(mm => mm.round)) - 1
  );
  if (semifinals.length >= 2) {
    // 兩個半決賽的敗者進行三四名賽
    const losers: Team[] = [];
    for (const semi of semifinals) {
      if (semi.winner) {
        if (semi.teamA && semi.winner.id === semi.teamA.id && semi.teamB) {
          losers.push(semi.teamB);
        } else if (semi.teamB && semi.winner.id === semi.teamB.id && semi.teamA) {
          losers.push(semi.teamA);
        }
      }
    }
    
    // 應該有三四名賽的比賽結果
    const thirdFourthMatch = matches.find(
      m => m.matchNumber > Math.max(...finals.map(f => f.matchNumber))
    );
    if (thirdFourthMatch && thirdFourthMatch.winner) {
      results.thirdPlace = thirdFourthMatch.winner;
      if (thirdFourthMatch.teamA && thirdFourthMatch.winner.id === thirdFourthMatch.teamA.id) {
        results.fourthPlace = thirdFourthMatch.teamB || undefined;
      } else if (thirdFourthMatch.teamB) {
        results.fourthPlace = thirdFourthMatch.teamA || undefined;
      }
    }
  }

  // 建立完整排名
  const rankings = buildCompletRankings(matches, teams);
  results.finalRankings = rankings;

  return results;
}

/**
 * 建立完整排名列表
 */
function buildCompletRankings(
  matches: Match[],
  teams: Team[]
): Array<{ rank: number; team: Team; wins: number; losses: number }> {
  const teamStats: Record<string, { wins: number; losses: number }> = {};

  // 初始化所有隊伍
  teams.forEach(team => {
    teamStats[team.id] = { wins: 0, losses: 0 };
  });

  // 計算勝負
  matches.forEach(match => {
    if (match.status === 'completed' && match.winner) {
      if (match.teamA?.id) {
        if (match.winner.id === match.teamA.id) {
          teamStats[match.teamA.id].wins++;
          if (match.teamB?.id) teamStats[match.teamB.id].losses++;
        } else if (match.teamB?.id) {
          teamStats[match.teamB.id].wins++;
          teamStats[match.teamA.id].losses++;
        }
      }
    } else if (match.status === 'bye' && match.teamA) {
      // 輪空隊伍算贏一場
      teamStats[match.teamA.id].wins++;
    } else if (match.status === 'bye' && match.teamB) {
      teamStats[match.teamB.id].wins++;
    }
  });

  // 排序
  const sortedTeams = teams
    .map((team, index) => ({
      rank: index + 1,
      team,
      wins: teamStats[team.id]?.wins || 0,
      losses: teamStats[team.id]?.losses || 0,
    }))
    .sort((a, b) => b.wins - a.wins);

  // 重新編號排名
  return sortedTeams.map((item, index) => ({ ...item, rank: index + 1 }));
}
