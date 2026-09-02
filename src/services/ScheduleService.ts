import { Match, Venue, Event } from '../types';

export interface TimeSlot {
  time: string;
  venue: Venue;
  matchId?: string;
  teamIds: string[];
}

/**
 * 自動排期
 */
export function generateSchedule(
  matches: Match[],
  event: Event,
  venues: Venue[]
): { scheduledMatches: Match[]; conflicts: string[] } {
  const conflicts: string[] = [];
  const scheduledMatches = [...matches];
  const timeSlots: TimeSlot[] = [];
  
  // 解析開始時間
  const [startHour, startMinute] = event.startTime.split(':').map(Number);
  let currentTime = new Date();
  currentTime.setHours(startHour, startMinute, 0, 0);
  
  let currentVenueIndex = 0;
  let matchesInCurrentRound = 0;
  let currentRound = -1;
  
  for (const match of scheduledMatches) {
    if (match.status === 'bye') continue;
    
    // 新輪次
    if (match.round !== currentRound) {
      currentRound = match.round;
      matchesInCurrentRound = 0;
      currentVenueIndex = 0;
      
      // 檢查是否需要中場休息
      if (
        currentRound > 0 &&
        event.midBreak?.enabled &&
        currentRound - 1 === event.midBreak.after
      ) {
        currentTime = new Date(currentTime.getTime() + event.midBreak.duration * 60000);
      }
    }
    
    // 如果場地用完，回到第一個場地並增加時間
    if (currentVenueIndex >= venues.length) {
      currentVenueIndex = 0;
      currentTime = new Date(
        currentTime.getTime() +
          event.matchDuration * 60000 +
          event.breakBetweenMatches * 60000
      );
    }
    
    const venue = venues[currentVenueIndex];
    const timeString = `${String(currentTime.getHours()).padStart(2, '0')}:${String(
      currentTime.getMinutes()
    ).padStart(2, '0')}`;
    
    // 檢查隊伍是否在同時間的其他場地有比賽
    const teamIds = [match.teamA?.id, match.teamB?.id].filter(Boolean) as string[];
    const conflict = timeSlots.find(
      ts =>
        ts.time === timeString &&
        ts.matchId !== match.id &&
        ts.teamIds.some(tid => teamIds.includes(tid))
    );
    
    if (conflict) {
      conflicts.push(`時間衝突: 場次 ${match.matchNumber} 和其他場次在 ${timeString} 進行`);
    }
    
    // 更新比賽資訊
    const matchIndex = scheduledMatches.findIndex(m => m.id === match.id);
    if (matchIndex >= 0) {
      scheduledMatches[matchIndex] = {
        ...match,
        time: timeString,
        date: event.date,
        venue,
        venueId: venue.id,
      };
    }
    
    timeSlots.push({
      time: timeString,
      venue,
      matchId: match.id,
      teamIds,
    });
    
    currentVenueIndex++;
    matchesInCurrentRound++;
  }
  
  return { scheduledMatches, conflicts };
}

/**
 * 手動調整比賽時間和場地
 */
export function updateMatchSchedule(
  matches: Match[],
  matchId: string,
  date: string,
  time: string,
  venue: Venue
): Match[] {
  return matches.map(m => {
    if (m.id === matchId) {
      return { ...m, date, time, venue, venueId: venue.id };
    }
    return m;
  });
}
