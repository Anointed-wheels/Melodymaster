// ==========================================
// INSTRUCTOR PROFILE INTERACTION SCRIPT
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  console.log("Instructor Profile Page loaded successfully.");

  const playBtn = document.getElementById('profile-play-video-btn');
  if (playBtn) {
    playBtn.addEventListener('click', () => {
      alert("Demo video reel playback triggered. (Connect your video modal or embed source here!)");
    });
  }
});