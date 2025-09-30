import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL as string;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  // Do not throw during import to avoid crashing on build; log instead
  console.warn("Supabase environment variables are not fully set.");
}

export const supabase = createClient(supabaseUrl ?? "", supabaseAnonKey ?? "");
