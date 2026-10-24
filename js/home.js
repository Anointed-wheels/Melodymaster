// ==========================================
// HOME PAGE INTERACTION SCRIPT
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  console.log("Landing Page (index.html) successfully loaded and ready.");
  
  // Optional animation effect or tracking clicks on instrument cards can be added here
  const instrumentCards = document.querySelectorAll('.instrument-card');
  instrumentCards.forEach(card => {
    card.addEventListener('click', (e) => {
      // You can capture analytics or selection preference before redirecting
      console.log(`Selected instrument filter: ${card.querySelector('h3').textContent}`);
    });
  });
});