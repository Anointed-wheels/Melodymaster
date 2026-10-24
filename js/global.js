// ==========================================
// SUPABASE CLIENT & GLOBAL APP INITIALIZATION
// ==========================================

const SUPABASE_URL = 'https://vswrjydrlcvjwguukvsf.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_eOq07ldLjpK4b-xY5iERuA_7IJF5k0w';

// Attach client globally to window
if (window.supabase && typeof window.supabase.createClient === 'function') {
  window.supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  console.log("Supabase Client Successfully Initialized!");
} else {
  console.error("Window.supabase CDN is missing.");
}

// Global Session Check on page load
document.addEventListener('DOMContentLoaded', async () => {
  const client = window.supabaseClient;
  if (!client) return;

  const { data: { session } } = await client.auth.getSession();
  
  if (session) {
    console.log("Active user logged in:", session.user.email);
    const loginBtn = document.getElementById('nav-login-btn');
    if (loginBtn) {
      loginBtn.textContent = 'Dashboard';
      loginBtn.href = 'student-dashboard.html';
    }
  }

  // Mobile Sidebar Toggle Logic
  if (!document.getElementById('mobile-sidebar-overlay')) {
    const mobileNavHTML = `
      <div id="mobile-sidebar-overlay" class="mobile-nav-backdrop"></div>
      <aside id="mobile-sidebar-menu" class="mobile-nav-sidebar">
        <div class="mobile-sidebar-header">
          <span style="font-weight: 800; font-size: 1.1rem;">Melody<span style="color: var(--accent-primary);">Master</span></span>
          <button id="mobile-sidebar-close-btn" class="mobile-sidebar-close">&times;</button>
        </div>
        <ul class="mobile-menu-links">
          <li><a href="index.html">Home</a></li>
          <li><a href="instructors.html">Browse Teachers</a></li>
          <li><a href="about.html">How It Works</a></li>
        </ul>
        <div class="mobile-auth-actions">
          <a href="login.html" class="music-btn music-btn--primary" style="width: 100%; text-align: center;">Log In</a>
        </div>
      </aside>
    `;
    document.body.insertAdjacentHTML('beforeend', mobileNavHTML);
  }

  const toggleBtn = document.getElementById('nav-mobile-toggle-btn');
  const closeBtn = document.getElementById('mobile-sidebar-close-btn');
  const backdrop = document.getElementById('mobile-sidebar-overlay');
  const sidebar = document.getElementById('mobile-sidebar-menu');

  function openMobileNav() {
    if (sidebar && backdrop) {
      sidebar.classList.add('active');
      backdrop.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeMobileNav() {
    if (sidebar && backdrop) {
      sidebar.classList.remove('active');
      backdrop.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  if (toggleBtn) toggleBtn.addEventListener('click', openMobileNav);
  if (closeBtn) closeBtn.addEventListener('click', closeMobileNav);
  if (backdrop) backdrop.addEventListener('click', closeMobileNav);
});