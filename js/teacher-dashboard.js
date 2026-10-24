// ==========================================
// TEACHER DASHBOARD WORKFLOW SCRIPT
// ==========================================
document.addEventListener('DOMContentLoaded', async () => {
  console.log("Teacher Dashboard Gateway Active.");
  const supabase = window.supabaseClient;

  if (!supabase) {
    console.error("Supabase client failed to initialize.");
    return;
  }

  // 1. Get current logged-in session
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  if (sessionError || !session) {
    window.location.href = 'login.html';
    return;
  }

  const userId = session.user.id;

  // 2. Fetch live teacher details from database
  const { data: teacherData, error: teacherError } = await supabase
    .from('teacher_details')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (teacherError || !teacherData) {
    console.error("Error fetching teacher details:", teacherError);
    return;
  }

  // UI Elements container checks
  const pendingNotice = document.getElementById('teacher-pending-notice');
  const paymentSection = document.getElementById('teacher-payment-section');
  const profileSettingsForm = document.getElementById('teacher-profile-update-form');

  // 3. Dynamic Flow Control based on Admin Approval & Payment Status
  const approvalStatus = teacherData.approval_status; // 'pending' or 'approved' (or 'rejected')
  const spaceFeePaid = teacherData.space_fee_paid;   // boolean: true / false

  if (approvalStatus === 'pending') {
    // STAGE 1: Waiting for Admin Approval
    if (pendingNotice) pendingNotice.style.display = 'block';
    if (paymentSection) paymentSection.style.display = 'none';
    if (profileSettingsForm) profileSettingsForm.style.display = 'none';

  } else if (approvalStatus === 'approved' && !spaceFeePaid) {
    // STAGE 2: Approved by Admin, but Space Fee is Unpaid -> Show Payment Prompt
    if (pendingNotice) pendingNotice.style.display = 'none';
    if (paymentSection) paymentSection.style.display = 'block';
    if (profileSettingsForm) profileSettingsForm.style.display = 'none';

  } else if (approvalStatus === 'approved' && spaceFeePaid) {
    // STAGE 3: Approved AND Paid -> Fully Unlocked for Profile Editing & Public Visibility!
    if (pendingNotice) pendingNotice.style.display = 'none';
    if (paymentSection) paymentSection.style.display = 'none';
    if (profileSettingsForm) profileSettingsForm.style.display = 'block';
  }

  // 4. Handle Space Listing Payment Submission
  const paymentForm = document.getElementById('teacher-space-payment-form');
  if (paymentForm) {
    paymentForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const provider = document.getElementById('payment-provider-select').value;
      alert(`Initializing $15 Space Listing Payment via ${provider.toUpperCase()}...`);

      // Update payment status in database
      const { error: updateError } = await supabase
        .from('teacher_details')
        .update({ space_fee_paid: true })
        .eq('user_id', userId);

      if (updateError) {
        alert("Error updating payment status: " + updateError.message);
        return;
      }

      alert("Payment successful! Your profile settings are now unlocked.");
      window.location.reload(); // Refresh to instantly trigger Stage 3 unlock
    });
  }

  // 5. Handle Saving Profile & Making Public for Students
  if (profileSettingsForm) {
    profileSettingsForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const bio = document.getElementById('teacher-bio-input').value.trim();
      const hourlyRate = parseFloat(document.getElementById('teacher-rate-input').value);
      const isPublic = document.getElementById('teacher-public-toggle').checked;

      const submitBtn = document.getElementById('save-profile-btn');
      if (submitBtn) {
        submitBtn.textContent = "Saving Profile...";
        submitBtn.disabled = true;
      }

      try {
        const { error: saveError } = await supabase
          .from('teacher_details')
          .update({
            bio: bio,
            hourly_rate: hourlyRate,
            is_public: isPublic // Ensures students can browse and view the profile
          })
          .eq('user_id', userId);

        if (saveError) throw saveError;

        alert("Instructor profile saved and updated successfully!");
      } catch (err) {
        console.error("Profile Save Error:", err.message);
        alert("Error saving profile: " + err.message);
      } finally {
        if (submitBtn) {
          submitBtn.textContent = "Save Profile Settings";
          submitBtn.disabled = false;
        }
      }
    });
  }

  // Handle Logout action
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      await supabase.auth.signOut();
      window.location.href = 'login.html';
    });
  }
});