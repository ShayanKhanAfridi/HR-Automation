import { supabase } from '../lib/supabase';

export const testSupabaseConnection = async () => {
  try {
    // Test 1: Check if Supabase client is initialized
    console.log('🔍 Testing Supabase connection...');
    console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
    
    // Test 2: Try to get session (auth check)
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) {
      console.error('❌ Auth session error:', sessionError);
      return { success: false, error: sessionError };
    }
    console.log('✅ Auth connection successful');
    console.log('Current user:', sessionData.session?.user?.email || 'Not logged in');
    
    // Test 3: Try to query a table (database check)
    const { data: jobsData, error: jobsError } = await supabase
      .from('jobs')
      .select('id')
      .limit(1);
    
    if (jobsError) {
      console.error('❌ Database query error:', jobsError.message);
      if (jobsError.message.includes('relation') || jobsError.message.includes('does not exist')) {
        console.warn('⚠️ Tables not found. Run the migration in Supabase SQL Editor.');
      }
      return { success: false, error: jobsError, tablesExist: false };
    }
    
    console.log('✅ Database connection successful');
    console.log('Tables exist and are accessible');
    
    return { 
      success: true, 
      tablesExist: true,
      user: sessionData.session?.user || null 
    };
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
    return { success: false, error };
  }
};
