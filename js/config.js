/**
 * ART EUction - Configuration
 * Environment variables and app configuration
 */

// TODO: Add your Supabase anon key here
// Get it from: Supabase Dashboard → Settings → API
export const config = {
  // Supabase Configuration
  supabase: {
    url: 'https://niwonrhyekgllofdwzoi.supabase.co',
    anonKey: 'YOUR_SUPABASE_ANON_KEY_HERE' // Replace this with your actual anon key
  },

  // App Configuration
  app: {
    name: 'ART EUction',
    version: '1.0.0',
    environment: import.meta.env?.MODE || process.env?.NODE_ENV || 'production'
  },

  // Feature Flags
  features: {
    googleAuth: true,
    facebookAuth: false, // Can be enabled later
    emailVerification: true
  }
};

// Helper function to check if config is valid
export function isConfigValid() {
  return !!(config.supabase.url && config.supabase.anonKey);
}

// Helper function to get config value
export function getConfig(path) {
  const parts = path.split('.');
  let value = config;

  for (const part of parts) {
    value = value?.[part];
    if (value === undefined) return null;
  }

  return value;
}

export default config;
