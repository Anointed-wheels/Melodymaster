// ==========================================
// OTP VERIFICATION SCRIPT
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  console.log("OTP Verification Engine Active.");
  const supabase = window.supabaseClient;

  if (!supabase) {
    console.error("Supabase client failed to initialize.");
    return;
  }

  // Parse URL query parameters (email + user signup payload)
  const urlParams = new URLSearchParams(window.location.search);
  const userEmail = urlParams.get('email');
  const emailInput = document.getElementById('verify-email-input');

  if (userEmail && emailInput) {
    emailInput.value = userEmail;
  }

  // Handle OTP form submission
  const verifyForm = document.getElementById('auth-verify-form');
  if (verifyForm) {
    verifyForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const email = emailInput.value.trim();
      const token = document.getElementById('verify-otp-input').value.trim();
      const submitBtn = document.getElementById('verify-submit-btn');

      if (submitBtn) {
        submitBtn.textContent = "Verifying Code...";
        submitBtn.disabled = true;
      }

      try {
        // Step 1: Verify OTP code with Supabase
        const { data, error } = await supabase.auth.verifyOtp({
          email: email,
          token: token,
          type: 'signup'
        });

        if (error) throw error;

        // Step 2: Retrieve verified user ID and signup details from URL
        const userId = data.user.id;
        const fullName = urlParams.get('fullName') || 'User';
        const role = urlParams.get('role') || 'student';
        const instrument = urlParams.get('instrument') || 'guitar';

        // Step 3: Safely insert record into public 'profiles' table now that user is verified
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([{ id: userId, full_name: fullName, email: email, role: role }]);

        if (profileError) throw profileError;

        // Step 4: If registering as a teacher, insert into 'teacher_details'
        if (role === 'teacher') {
          const { error: teacherError } = await supabase
            .from('teacher_details')
            .insert([{ 
              user_id: userId, 
              instrument: instrument, 
              approval_status: 'pending', 
              space_fee_paid: false 
            }]);

          if (teacherError) throw teacherError;
        }

        // Step 5: Success alert and dynamic role-based redirection
        alert("Email verified successfully! Welcome to MelodyMaster.");

        if (role === 'teacher') {
          window.location.href = 'teacher-dashboard.html';
        } else {
          window.location.href = 'student-dashboard.html';
        }

      } catch (err) {
        console.error("Verification Error:", err.message);
        alert("Invalid or expired code: " + err.message);
        if (submitBtn) {
          submitBtn.textContent = "Verify Account";
          submitBtn.disabled = false;
        }
      }
    });
  }

  // Handle Resend Code Link
  const resendLink = document.getElementById('resend-otp-link');
  if (resendLink) {
    resendLink.addEventListener('click', async (e) => {
      e.preventDefault();
      const email = emailInput.value.trim();
      if (!email) {
        alert("Email address missing.");
        return;
      }

      try {
        const { error } = await supabase.auth.resend({
          type: 'signup',
          email: email,
        });
        if (error) throw error;
        alert("A new confirmation code has been sent to your email.");
      } catch (err) {
        alert("Error resending code: " + err.message);
      }
    });
  }
});