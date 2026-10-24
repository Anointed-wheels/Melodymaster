// ==========================================
// STUDENT DASHBOARD LIVE DATA SCRIPT
// ==========================================
document.addEventListener('DOMContentLoaded', async () => {
  const supabase = window.supabaseClient;
  if (!supabase) {
    console.error("Supabase client not found.");
    return;
  }

  try {
    // 1. Verify Active User Session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session) {
      // If not logged in, redirect to login page
      window.location.href = 'login.html';
      return;
    }

    const userId = session.user.id;

    // 2. Fetch User Profile from Supabase
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (profileError) throw profileError;

    // 3. Dynamically Insert User's Real Name into Welcome Banner
    const welcomeHeading = document.getElementById('welcome-heading');
    if (welcomeHeading && profile.full_name) {
      // Extract first name for a friendly greeting
      const firstName = profile.full_name.split(' ')[0];
      welcomeHeading.textContent = `Welcome back, ${firstName}! 🎸`;
    }

    console.log("Dashboard loaded live profile for:", profile.full_name);

  } catch (err) {
    console.error("Error loading student profile:", err.message);
  }

  // 4. Handle Log Out Action
  const logoutBtn = document.querySelector('.nav-auth-actions a');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      await supabase.auth.signOut();
      window.location.href = 'login.html';
    });
  }
});