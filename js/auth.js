/**
 * ART EUction - Authentication Module
 * Handles user authentication with Supabase (Email/Password + Google OAuth)
 */

import { showNotification } from './utils.js';
import { config } from './config.js';

// Supabase configuration
const SUPABASE_URL = config.supabase.url;
const SUPABASE_ANON_KEY = config.supabase.anonKey;

// Initialize Supabase client
let supabase = null;

/**
 * Initialize Supabase client
 */
async function initSupabase() {
  if (supabase) return supabase;

  // Load Supabase from CDN
  if (!window.supabase) {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
    document.head.appendChild(script);

    await new Promise((resolve, reject) => {
      script.onload = resolve;
      script.onerror = reject;
    });
  }

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.error('Supabase credentials not found. Please set SUPABASE_URL and SUPABASE_ANON_KEY.');
    return null;
  }

  supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  return supabase;
}

/**
 * Register new user with email and password
 */
export async function registerWithEmail(email, password, fullName) {
  try {
    const client = await initSupabase();
    if (!client) {
      throw new Error('Supabase client not initialized');
    }

    const { data, error } = await client.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
        emailRedirectTo: `${window.location.origin}/index.html`
      }
    });

    if (error) throw error;

    if (data?.user?.identities?.length === 0) {
      throw new Error('Този имейл вече е регистриран');
    }

    return { success: true, user: data.user, needsEmailConfirmation: !data.session };
  } catch (error) {
    console.error('Registration error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Login with email and password
 */
export async function loginWithEmail(email, password) {
  try {
    const client = await initSupabase();
    if (!client) {
      throw new Error('Supabase client not initialized');
    }

    const { data, error } = await client.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;

    return { success: true, user: data.user, session: data.session };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Login with Google OAuth
 */
export async function loginWithGoogle() {
  try {
    const client = await initSupabase();
    if (!client) {
      throw new Error('Supabase client not initialized');
    }

    const { data, error } = await client.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        }
      }
    });

    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error('Google login error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Logout current user
 */
export async function logout() {
  try {
    const client = await initSupabase();
    if (!client) {
      throw new Error('Supabase client not initialized');
    }

    const { error } = await client.auth.signOut();
    if (error) throw error;

    // Clear any local storage
    localStorage.removeItem('userProfile');

    return { success: true };
  } catch (error) {
    console.error('Logout error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Get current user session
 */
export async function getCurrentUser() {
  try {
    const client = await initSupabase();
    if (!client) return null;

    const { data: { session }, error } = await client.auth.getSession();
    if (error) throw error;

    return session?.user || null;
  } catch (error) {
    console.error('Get current user error:', error);
    return null;
  }
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated() {
  const user = await getCurrentUser();
  return !!user;
}

/**
 * Send password reset email
 */
export async function resetPassword(email) {
  try {
    const client = await initSupabase();
    if (!client) {
      throw new Error('Supabase client not initialized');
    }

    const { error } = await client.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password.html`
    });

    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error('Password reset error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Update user password
 */
export async function updatePassword(newPassword) {
  try {
    const client = await initSupabase();
    if (!client) {
      throw new Error('Supabase client not initialized');
    }

    const { error } = await client.auth.updateUser({
      password: newPassword
    });

    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error('Update password error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Setup authentication state observer
 */
export async function onAuthStateChange(callback) {
  const client = await initSupabase();
  if (!client) return;

  const { data: { subscription } } = client.auth.onAuthStateChange((event, session) => {
    callback(event, session);
  });

  return subscription;
}

/**
 * Initialize auth UI updates
 */
export async function initAuthUI() {
  const user = await getCurrentUser();
  updateNavigationUI(user);

  // Setup auth state observer
  onAuthStateChange((event, session) => {
    updateNavigationUI(session?.user);
  });
}

/**
 * Update navigation UI based on auth state
 */
function updateNavigationUI(user) {
  const authButtons = document.querySelector('.auth-buttons');
  const userMenu = document.querySelector('.user-menu');

  if (!authButtons) return;

  if (user) {
    // User is logged in
    authButtons.innerHTML = `
      <div class="user-menu">
        <button class="user-menu-toggle" aria-label="User menu">
          <span class="user-avatar">${getInitials(user.user_metadata?.full_name || user.email)}</span>
          <span class="user-name">${user.user_metadata?.full_name || user.email}</span>
        </button>
        <div class="user-dropdown">
          <a href="profile.html" class="dropdown-item">
            <span>👤</span> Профил
          </a>
          <a href="my-bids.html" class="dropdown-item">
            <span>🎨</span> Моите оферти
          </a>
          <a href="settings.html" class="dropdown-item">
            <span>⚙️</span> Настройки
          </a>
          <button id="logout-btn" class="dropdown-item" style="width: 100%; text-align: left; background: none; border: none; cursor: pointer; padding: 0.75rem 1rem;">
            <span>🚪</span> Изход
          </button>
        </div>
      </div>
    `;

    // Setup user menu toggle
    const menuToggle = document.querySelector('.user-menu-toggle');
    const dropdown = document.querySelector('.user-dropdown');

    if (menuToggle && dropdown) {
      menuToggle.addEventListener('click', () => {
        dropdown.classList.toggle('active');
      });

      // Close dropdown when clicking outside
      document.addEventListener('click', (e) => {
        if (!e.target.closest('.user-menu')) {
          dropdown.classList.remove('active');
        }
      });
    }

    // Setup logout button
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', handleLogout);
    }
  } else {
    // User is not logged in
    authButtons.innerHTML = `
      <a href="login.html" class="btn btn-outline btn-sm">Вход</a>
      <a href="register.html" class="btn btn-primary btn-sm">Регистрация</a>
    `;
  }
}

/**
 * Handle logout
 */
async function handleLogout() {
  const result = await logout();

  if (result.success) {
    showNotification('Успешно излязохте от системата', 'success');
    window.location.href = 'index.html';
  } else {
    showNotification('Грешка при излизане: ' + result.error, 'error');
  }
}

/**
 * Get user initials from name
 */
function getInitials(name) {
  if (!name) return '?';

  const parts = name.split(' ');
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
}

/**
 * Redirect if not authenticated
 */
export async function requireAuth() {
  const authenticated = await isAuthenticated();

  if (!authenticated) {
    const currentPath = window.location.pathname;
    window.location.href = `login.html?redirect=${encodeURIComponent(currentPath)}`;
  }
}

/**
 * Redirect if authenticated (for login/register pages)
 */
export async function redirectIfAuthenticated() {
  const authenticated = await isAuthenticated();

  if (authenticated) {
    const urlParams = new URLSearchParams(window.location.search);
    const redirect = urlParams.get('redirect') || 'index.html';
    window.location.href = redirect;
  }
}

// Auto-initialize auth UI on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAuthUI);
} else {
  initAuthUI();
}
