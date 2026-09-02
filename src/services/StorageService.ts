import { Event, Team, Match, Bracket, Schedule, Result, StoredTournament } from '../types';
import { STORAGE_PREFIX, STORAGE_LIST_KEY } from '../utils/constants';

interface TournamentListItem {
  id: string;
  schoolName: string;
  eventName: string;
  date: string;
  status: string;
}

/**
 * 獲取儲存金鑰
 */
function getStorageKey(eventId: string): string {
  return `${STORAGE_PREFIX}:${eventId}`;
}

/**
 * 儲存完整的賽事資料
 */
export function saveTournament(
  event: Event,
  teams: Team[],
  bracket: Bracket | undefined,
  matches: Match[],
  schedule: Schedule | undefined,
  results: Result | undefined
): void {
  const data: StoredTournament = {
    event,
    teams,
    bracket,
    matches,
    schedule,
    results,
    metadata: {
      version: '1.0.0',
      lastModified: new Date().toISOString(),
    },
  };

  localStorage.setItem(getStorageKey(event.id), JSON.stringify(data));
  updateTournamentList();
}

/**
 * 載入賽事資料
 */
export function loadTournament(eventId: string): StoredTournament | null {
  const data = localStorage.getItem(getStorageKey(eventId));
  if (!data) return null;

  try {
    return JSON.parse(data);
  } catch (error) {
    console.error('Failed to load tournament:', error);
    return null;
  }
}

/**
 * 刪除賽事
 */
export function deleteTournament(eventId: string): void {
  localStorage.removeItem(getStorageKey(eventId));
  updateTournamentList();
}

/**
 * 列出所有賽事
 */
export function listTournaments(): TournamentListItem[] {
  const listData = localStorage.getItem(STORAGE_LIST_KEY);
  if (!listData) return [];

  try {
    return JSON.parse(listData);
  } catch (error) {
    console.error('Failed to load tournament list:', error);
    return [];
  }
}

/**
 * 更新賽事列表
 */
function updateTournamentList(): void {
  const keys = Object.keys(localStorage);
  const tournaments: TournamentListItem[] = [];

  keys.forEach(key => {
    if (key.startsWith(`${STORAGE_PREFIX}:`)) {
      const data = localStorage.getItem(key);
      if (data) {
        try {
          const tournament = JSON.parse(data) as StoredTournament;
          tournaments.push({
            id: tournament.event.id,
            schoolName: tournament.event.schoolName,
            eventName: tournament.event.eventName,
            date: tournament.event.date,
            status: tournament.event.status,
          });
        } catch (error) {
          console.error('Error parsing tournament:', error);
        }
      }
    }
  });

  // 按日期排序（最新的在前）
  tournaments.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  localStorage.setItem(STORAGE_LIST_KEY, JSON.stringify(tournaments));
}

/**
 * 匯出為 JSON
 */
export function exportAsJSON(tournament: StoredTournament): string {
  return JSON.stringify(tournament, null, 2);
}

/**
 * 從 JSON 匯入
 */
export function importFromJSON(jsonString: string): StoredTournament | null {
  try {
    const data = JSON.parse(jsonString);
    // 基本驗證
    if (!data.event || !data.teams) {
      throw new Error('Invalid tournament data format');
    }
    return data as StoredTournament;
  } catch (error) {
    console.error('Failed to import tournament:', error);
    return null;
  }
}
