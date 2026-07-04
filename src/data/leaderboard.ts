/**
 * Shared game leaderboard config.
 *
 * Leave both values empty and high scores are stored per-visitor in their own
 * browser (localStorage). To turn on the global leaderboard shared by all
 * visitors, create a free Supabase project and paste its URL and anon public
 * key here — full steps in SITE.md ("Game leaderboard"). The anon key is
 * designed to be public; it only allows what the database policies permit.
 */
export const leaderboardConfig = {
  supabaseUrl: "", // e.g. "https://abcdefgh.supabase.co"
  supabaseAnonKey: "",
};
