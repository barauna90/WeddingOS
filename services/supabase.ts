
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://fjzadklhmglmoxymqlyv.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZqemFka2xobWdsbW94eW1xbHl2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA3MzAzMTMsImV4cCI6MjA4NjMwNjMxM30.kPtcr0cvhkPGXw-aOdgMgTAgfXM1589H1kYFSEy_KeI';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
