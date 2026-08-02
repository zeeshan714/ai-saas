import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://yciemeabbakcmqsvenlo.supabase.co";

const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "sb_publishable_CmsNoBO9m0liJWCA0VJXoQ_JF7T-fTm";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);