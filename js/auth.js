// ==========================================
// SUPABASE AUTHENTICATION & REGISTRATION SCRIPT
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  console.log("Auth Engine Active.");

  const supabase = window.supabaseClient;

  if (!supabase) {
    console.error("Supabase client failed to load in auth.js");
    return;
  }

  // 1. Role Toggle Logic on Signup Page (Student vs. Teacher)
  const studentBtn = document.getElementById('role-btn-student');
  const teacherBtn = document.getElementById('role-btn-teacher');
  const roleInput = document.getElementById('signup-role-input');
  const teacherField = document.getElementById('teacher-instrument-field');
  const headerTitle = document.getElementById('signup-header-title');
  const headerSubtitle = document.getElementById('signup-header-subtitle');

  if (studentBtn && teacherBtn) {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('role') === 'teacher') {
      switchToTeacher();
    }

    studentBtn.addEventListener('click', switchToStudent);
    teacherBtn.addEventListener('click', switchToTeacher);

    function switchToStudent() {
      studentBtn.classList.add('active');
      teacherBtn.classList.remove('active');
      roleInput.value = 'student';
      if (teacherField) teacherField.style.display = 'none';
      if (headerTitle) headerTitle.textContent = "Create an Account";
      if (headerSubtitle) headerSubtitle.textContent = "Join MelodyMaster and start learning today";
    }

    function switchToTeacher() {
      teacherBtn.classList.add('active');
      studentBtn.classList.remove('active');
      roleInput.value = 'teacher';
      if (teacherField) teacherField.style.display = 'flex';
      if (headerTitle) headerTitle.textContent = "Apply as an Instructor";
      if (headerSubtitle) headerSubtitle.textContent = "Share your expertise and earn from live 1-on-1 sessions";
    }
  }

  // 2. Handle Live Sign-Up Form Submission with Supabase
  const signupForm = document.getElementById('auth-signup-form');
  if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const fullName = document.getElementById('signup-fullname-input').value.trim();
      const email = document.getElementById('signup-email-input').value.trim();
      const password = document.getElementById('signup-password-input').value;
      const role = document.getElementById('signup-role-input').value;
      const instrumentSelect = document.getElementById('signup-instrument-select');
      const instrument = instrumentSelect ? instrumentSelect.value : 'guitar';

      const submitBtn = document.getElementById('signup-submit-btn');
      if (submitBtn) {
        submitBtn.textContent = "Creating Account...";
        submitBtn.disabled = true;
      }

      try {
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: email,
          password: password,
        });

        if (authError) throw authError;

        alert("Account created! We've sent a 6-digit confirmation code to your email.");
        const params = new URLSearchParams({
          email: email,
          fullName: fullName,
          role: role,
          instrument: instrument
        });
        window.location.href = `verify.html?${params.toString()}`;

      } catch (err) {
        console.error("Signup Error:", err.message);
        alert("Error during sign-up: " + err.message);
        if (submitBtn) {
          submitBtn.textContent = "Create Account";
          submitBtn.disabled = false;
        }
      }
    });
  }

  // 3. Handle Live Log-In Form Submission with Supabase
  const loginForm = document.getElementById('auth-login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const email = document.getElementById('login-email-input').value.trim();
      const password = document.getElementById('login-password-input').value;

      const submitBtn = document.getElementById('login-submit-btn');
      if (submitBtn) {
        submitBtn.textContent = "Logging In...";
        submitBtn.disabled = true;
      }

      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email,
          password: password,
        });

        if (error) throw error;

        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .single();

        if (profileError) throw profileError;

        if (profileData.role === 'admin') {
          window.location.href = 'admin-dashboard.html';
        } else if (profileData.role === 'teacher') {
          window.location.href = 'teacher-dashboard.html';
        } else {
          window.location.href = 'student-dashboard.html';
        }

      } catch (err) {
        console.error("Login Error:", err.message);
        alert("Invalid login credentials: " + err.message);
        if (submitBtn) {
          submitBtn.textContent = "Log In";
          submitBtn.disabled = false;
        }
      }
    });
  }
});