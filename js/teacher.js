// ==========================================
// INSTRUCTOR ONBOARDING & SETTINGS SCRIPT
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  console.log("Teacher Portal Script Loaded.");

  // Handle Space Listing Payment Form
  const paymentForm = document.getElementById('teacher-space-payment-form');
  if (paymentForm) {
    paymentForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const provider = document.getElementById('payment-provider-select').value;
      alert(`Initializing $15 Space Listing Payment via ${provider.toUpperCase()}...`);
      // Simulating successful webhook payment response -> redirect to setup
      window.location.href = 'teacher-settings.html';
    });
  }

  // Handle Settings Update
  const settingsForm = document.getElementById('teacher-profile-update-form');
  if (settingsForm) {
    settingsForm.addEventListener('submit', (e) => {
      e.preventDefault();
      alert("Instructor profile settings saved successfully!");
    });
  }
});