/**
 * Admin Authentication Module
 * Handles admin-specific authentication and authorization
 */

import { supabase } from './auth.js';
import { showNotification } from './utils.js';

// Admin email list (in production, this should be in database)
// For now, we'll check user metadata for admin role
const ADMIN_EMAILS = [
  // Add your admin emails here
  // 'admin@euction.art',
  // 'team@euction.art'
];

/**
 * Check if current user is admin
 */
export async function isAdmin() {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      return false;
    }

    // Check if user email is in admin list
    if (ADMIN_EMAILS.includes(user.email)) {
      return true;
    }

    // Check if user has admin role in metadata
    if (user.user_metadata?.role === 'admin' || user.app_metadata?.role === 'admin') {
      return true;
    }

    return false;
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
}

/**
 * Get current admin user
 */
export async function getAdminUser() {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      return null;
    }

    const adminStatus = await isAdmin();
    if (!adminStatus) {
      return null;
    }

    return user;
  } catch (error) {
    console.error('Error getting admin user:', error);
    return null;
  }
}

/**
 * Require admin access - redirect if not admin
 */
export async function requireAdmin() {
  const adminStatus = await isAdmin();

  if (!adminStatus) {
    showNotification('Access denied. Admin privileges required.', 'error');

    // Redirect to login after short delay
    setTimeout(() => {
      window.location.href = '/login.html?redirect=' + encodeURIComponent(window.location.pathname);
    }, 2000);

    return false;
  }

  return true;
}

/**
 * Initialize admin page
 * Call this on every admin page to ensure user is authorized
 */
export async function initAdminPage() {
  // Show loading state
  document.body.style.opacity = '0.5';

  const adminStatus = await isAdmin();

  if (!adminStatus) {
    // Not authorized
    document.body.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: center; min-height: 100vh; flex-direction: column; gap: 2rem;">
        <div style="text-align: center;">
          <h1 style="font-size: 3rem; margin-bottom: 1rem;">🔒</h1>
          <h2 style="font-size: 2rem; margin-bottom: 0.5rem;">Access Denied</h2>
          <p style="color: var(--gray-800); margin-bottom: 2rem;">You need admin privileges to access this page.</p>
          <a href="/login.html" class="btn btn-primary">Go to Login</a>
        </div>
      </div>
    `;
    return false;
  }

  // Authorized - show page
  document.body.style.opacity = '1';
  return true;
}

/**
 * Get admin info for display
 */
export async function getAdminInfo() {
  const user = await getAdminUser();

  if (!user) {
    return null;
  }

  return {
    id: user.id,
    email: user.email,
    name: user.user_metadata?.full_name || user.email.split('@')[0],
    avatar: user.user_metadata?.avatar_url || null,
    role: 'Admin'
  };
}

/**
 * Admin logout
 */
export async function adminLogout() {
  try {
    await supabase.auth.signOut();
    showNotification('Logged out successfully', 'success');
    setTimeout(() => {
      window.location.href = '/login.html';
    }, 1000);
  } catch (error) {
    console.error('Error logging out:', error);
    showNotification('Error logging out', 'error');
  }
}

/**
 * Set user as admin (development only)
 * In production, this should be done through Supabase Dashboard
 */
export async function setUserAsAdmin(email) {
  // This is a placeholder - in production, you would:
  // 1. Use Supabase Management API
  // 2. Or manually update user_metadata in Supabase Dashboard
  // 3. Or create an admin_users table

  console.log('To set a user as admin:');
  console.log('1. Go to Supabase Dashboard → Authentication → Users');
  console.log('2. Find the user by email:', email);
  console.log('3. Edit user → User Metadata → Add: {"role": "admin"}');
  console.log('4. Or add their email to ADMIN_EMAILS array in admin-auth.js');

  return false;
}

export default {
  isAdmin,
  getAdminUser,
  requireAdmin,
  initAdminPage,
  getAdminInfo,
  adminLogout,
  setUserAsAdmin
};
