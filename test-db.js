import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  console.log('Testing Supabase connection...');
  console.log('URL:', supabaseUrl);
  
  // Test users table
  const { data: users, error: usersError } = await supabase
    .from('users')
    .select('*')
    .limit(5);
  
  console.log('\nUsers table:');
  console.log('Error:', usersError);
  console.log('Data:', users);
  
  // Test practice_logs table
  const { data: logs, error: logsError } = await supabase
    .from('practice_logs')
    .select('*')
    .limit(5);
  
  console.log('\nPractice logs table:');
  console.log('Error:', logsError);
  console.log('Data:', logs);
  
  // Test meditation_sessions table
  const { data: sessions, error: sessionsError } = await supabase
    .from('meditation_sessions')
    .select('*')
    .limit(5);
  
  console.log('\nMeditation sessions table:');
  console.log('Error:', sessionsError);
  console.log('Data:', sessions);
}

testConnection();
