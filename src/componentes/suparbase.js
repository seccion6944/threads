import { createClient } from '@supabase/supabase-js';

const supabase = createClient('https://njomxsohpzexxkvpfkzt.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5qb214c29ocHpleHhrdnBma3p0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3Nzk0OTAsImV4cCI6MjA2ODM1NTQ5MH0.rvWTrPOFPf_hlPEIWcAcmHVqVWEw_ACB_S-1nbtDr90'
);
export default supabase;