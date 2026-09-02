import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Event, Team, Bracket, Match, Schedule, Result } from '../types';
import {
  saveTournament,
  loadTournament,
  deleteTournament,
  listTournaments,
} from '../services/StorageService';
import { generateId } from '../utils/id';

interface TournamentContextType {
  // Data
  event: Event | null;
  teams: Team[];
  bracket: Bracket | null;
  matches: Match[];
  schedule: Schedule | null;
  results: Result | null;

  // Actions
  createEvent: (event: Event) => void;
  updateEvent: (event: Event) => void;
  addTeam: (team: Team) => void;
  updateTeam: (team: Team) => void;
  deleteTeam: (teamId: string) => void;
  setBracket: (bracket: Bracket) => void;
  setMatches: (matches: Match[]) => void;
  setSchedule: (schedule: Schedule) => void;
  setResults: (results: Result) => void;
  saveTournamentData: () => void;
  loadTournamentData: (eventId: string) => boolean;
  resetTournament: () => void;
  getTournamentList: () => any[];
  deleteTournamentData: (eventId: string) => void;
}

const TournamentContext = createContext<TournamentContextType | undefined>(undefined);

export const TournamentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [event, setEvent] = useState<Event | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [bracket, setBracket] = useState<Bracket | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [schedule, setSchedule] = useState<Schedule | null>(null);
  const [results, setResults] = useState<Result | null>(null);

  const createEvent = useCallback((newEvent: Event) => {
    setEvent(newEvent);
  }, []);

  const updateEvent = useCallback((updatedEvent: Event) => {
    setEvent(updatedEvent);
  }, []);

  const addTeam = useCallback((team: Team) => {
    setTeams(prev => [...prev, team]);
  }, []);

  const updateTeam = useCallback((updatedTeam: Team) => {
    setTeams(prev => prev.map(t => (t.id === updatedTeam.id ? updatedTeam : t)));
  }, []);

  const deleteTeam = useCallback((teamId: string) => {
    setTeams(prev => prev.filter(t => t.id !== teamId));
  }, []);

  const saveTournamentData = useCallback(() => {
    if (!event) return;
    saveTournament(event, teams, bracket || undefined, matches, schedule || undefined, results || undefined);
  }, [event, teams, bracket, matches, schedule, results]);

  const loadTournamentData = useCallback((eventId: string) => {
    const data = loadTournament(eventId);
    if (!data) return false;

    setEvent(data.event);
    setTeams(data.teams);
    setBracket(data.bracket || null);
    setMatches(data.matches);
    setSchedule(data.schedule || null);
    setResults(data.results || null);
    return true;
  }, []);

  const resetTournament = useCallback(() => {
    setEvent(null);
    setTeams([]);
    setBracket(null);
    setMatches([]);
    setSchedule(null);
    setResults(null);
  }, []);

  const getTournamentList = useCallback(() => {
    return listTournaments();
  }, []);

  const deleteTournamentData = useCallback((eventId: string) => {
    deleteTournament(eventId);
  }, []);

  const value: TournamentContextType = {
    event,
    teams,
    bracket,
    matches,
    schedule,
    results,
    createEvent,
    updateEvent,
    addTeam,
    updateTeam,
    deleteTeam,
    setBracket,
    setMatches,
    setSchedule,
    setResults,
    saveTournamentData,
    loadTournamentData,
    resetTournament,
    getTournamentList,
    deleteTournamentData,
  };

  return <TournamentContext.Provider value={value}>{children}</TournamentContext.Provider>;
};

export const useTournament = () => {
  const context = useContext(TournamentContext);
  if (context === undefined) {
    throw new Error('useTournament must be used within TournamentProvider');
  }
  return context;
};
