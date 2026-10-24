// ==========================================
// ADMIN PORTAL INTERACTIVITY SCRIPT
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  console.log("Admin Engine Loaded.");
});

function approveTeacher(rowId) {
  const statusBadge = document.getElementById(`status-badge-${rowId}`);
  const paymentBadge = document.getElementById(`payment-badge-${rowId}`);

  if (statusBadge && paymentBadge) {
    statusBadge.textContent = "Approved - Pending Payment";
    statusBadge.className = "badge badge--pending";
    paymentBadge.textContent = "Awaiting $15 Fee";
    alert(`Applicant Approved! They can now log in and pay their $15 Listing Space Fee.`);
  }
}

function rejectTeacher(rowId) {
  const row = document.querySelector(`tr[data-user-row="${rowId}"]`);
  if (row && confirm("Are you sure you want to decline this application?")) {
    row.style.opacity = '0.3';
    alert("Application declined.");
  }
}