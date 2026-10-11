import { supabase } from './supabase/client';
import type { ClientMeditationSession, MeditationType, PracticeLog, PranayamaTechnique } from './types';

export interface DBUser {
  id: string;
  username: string;
  emoji: string;
  created_at: string;
}

export interface DBPracticeLog {
  id: string;
  user_id: string;
  practice_date: string;
  priming: boolean;
  surya_namaskaraya: boolean;
  kapalabhati: boolean;
  bhastrika: boolean;
  nadi_shodhana: boolean;
  bhramari: boolean;
  created_at: string;
  updated_at: string;
}

export interface DBMeditationSession {
  id: string;
  user_id: string;
  practice_date: string;
  type: MeditationType;
  minutes: number;
  created_at: string;
}

// User operations
export async function getOrCreateUser(username: string, emoji: string): Promise<DBUser> {
  // Try to get existing user
  const { data: existingUser } = await supabase
    .from('users')
    .select('*')
    .eq('username', username)
    .single();

  if (existingUser) {
    return existingUser;
  }

  // Create new user
  const { data, error } = await supabase
    .from('users')
    .insert({ username, emoji })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateUser(userId: string, username: string, emoji: string): Promise<DBUser> {
  const { data, error } = await supabase
    .from('users')
    .update({ username, emoji })
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getAllUsers(): Promise<DBUser[]> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

// Practice log operations
export async function getPracticeLog(userId: string, date: string): Promise<DBPracticeLog | null> {
  const { data } = await supabase
    .from('practice_logs')
    .select('*')
    .eq('user_id', userId)
    .eq('practice_date', date)
    .single();

  return data;
}

export async function upsertPracticeLog(userId: string, date: string, log: Partial<PracticeLog>): Promise<DBPracticeLog> {
  const { data, error } = await supabase
    .from('practice_logs')
    .upsert({
      user_id: userId,
      practice_date: date,
      ...log,
    }, {
      onConflict: 'user_id,practice_date'
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getPracticeLogsInRange(userId: string, startDate: string, endDate: string): Promise<DBPracticeLog[]> {
  const { data, error } = await supabase
    .from('practice_logs')
    .select('*')
    .eq('user_id', userId)
    .gte('practice_date', startDate)
    .lte('practice_date', endDate)
    .order('practice_date', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function getAllPracticeLogsInRange(startDate: string, endDate: string): Promise<(DBPracticeLog & { users: DBUser })[]> {
  const { data, error } = await supabase
    .from('practice_logs')
    .select('*, users(*)')
    .gte('practice_date', startDate)
    .lte('practice_date', endDate)
    .order('practice_date', { ascending: false });

  if (error) throw error;
  return data || [];
}

// Meditation session operations
export async function getMeditationSessions(userId: string, date: string): Promise<ClientMeditationSession[]> {
  const { data, error } = await supabase
    .from('meditation_sessions')
    .select('*')
    .eq('user_id', userId)
    .eq('practice_date', date)
    .order('created_at', { ascending: true });

  if (error) throw error;

  return (data || []).map(session => ({
    id: session.id,
    type: session.type as MeditationType,
    minutes: session.minutes,
  }));
}

export async function addMeditationSession(
  userId: string,
  date: string,
  type: MeditationType,
  minutes: number
): Promise<DBMeditationSession> {
  const { data, error } = await supabase
    .from('meditation_sessions')
    .insert({
      user_id: userId,
      practice_date: date,
      type,
      minutes,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function removeMeditationSession(sessionId: string): Promise<void> {
  const { error } = await supabase
    .from('meditation_sessions')
    .delete()
    .eq('id', sessionId);

  if (error) throw error;
}

export async function getMeditationSessionsInRange(
  userId: string,
  startDate: string,
  endDate: string
): Promise<DBMeditationSession[]> {
  const { data, error } = await supabase
    .from('meditation_sessions')
    .select('*')
    .eq('user_id', userId)
    .gte('practice_date', startDate)
    .lte('practice_date', endDate)
    .order('practice_date', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function getAllMeditationSessionsInRange(
  startDate: string,
  endDate: string
): Promise<DBMeditationSession[]> {
  const { data, error } = await supabase
    .from('meditation_sessions')
    .select('*')
    .gte('practice_date', startDate)
    .lte('practice_date', endDate)
    .order('practice_date', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function togglePranayama(
  userId: string,
  date: string,
  technique: PranayamaTechnique,
  completed: boolean
): Promise<void> {
  await upsertPracticeLog(userId, date, { [technique]: completed });
}

export async function toggleActivity(
  userId: string,
  date: string,
  activity: 'priming' | 'surya_namaskaraya',
  completed: boolean
): Promise<void> {
  await upsertPracticeLog(userId, date, { [activity]: completed });
}
