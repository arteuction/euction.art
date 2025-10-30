/**
 * ART EUction - Configuration
 * Environment variables and app configuration
 */

// For production: These values will be replaced during build by Netlify
// For development: Create a .env.local file and use a build script to inject these
export const config = {
  // Supabase Configuration
  supabase: {
    url: import.meta.env?.VITE_SUPABASE_URL ||
         window.ENV?.SUPABASE_URL ||
         process.env?.SUPABASE_URL ||
         '',
    anonKey: import.meta.env?.VITE_SUPABASE_ANON_KEY ||
             window.ENV?.SUPABASE_ANON_KEY ||
             process.env?.SUPABASE_ANON_KEY ||
             ''
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
