// ==========================================
// ADMIN DASHBOARD MANAGEMENT SCRIPT
// ==========================================
document.addEventListener('DOMContentLoaded', async () => {
  console.log("Admin Dashboard Active.");
  const supabase = window.supabaseClient;

  if (!supabase) {
    console.error("Supabase client missing in admin-dashboard.js");
    return;
  }

  const tableBody = document.getElementById('teachers-table-body');

  async function loadTeachers() {
    try {
      // 1. Fetch all teacher records
      const { data: teachers, error: teacherError } = await supabase
        .from('teacher_details')
        .select('*');

      if (teacherError) throw teacherError;

      if (!teachers || teachers.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:3rem; color:#6B7280;">No instructors registered yet.</td></tr>`;
        return;
      }

      // 2. Fetch all profiles to match emails & names
      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('id, full_name, email');

      if (profileError) throw profileError;

      // Map profiles by user ID for quick lookup
      const profileMap = {};
      if (profiles) {
        profiles.forEach(p => {
          profileMap[p.id] = p;
        });
      }

      tableBody.innerHTML = ''; // Clear table

      teachers.forEach(teacher => {
        const profile = profileMap[teacher.user_id] || {};
        const email = profile.email || 'N/A';
        const name = profile.full_name || 'Instructor';
        const status = teacher.approval_status || 'pending';
        const feePaid = teacher.space_fee_paid;

        const row = document.createElement('tr');
        row.innerHTML = `
          <td>
            <strong>${escapeHtml(name)}</strong><br>
            <span style="font-size: 0.85rem; color: #6B7280;">${escapeHtml(email)}</span>
          </td>
          <td style="text-transform: capitalize;">${escapeHtml(teacher.instrument || 'Guitar')}</td>
          <td>
            <span class="status-badge ${status === 'approved' ? 'badge-approved' : 'badge-pending'}">
              ${status.toUpperCase()}
            </span>
          </td>
          <td>
            <span class="status-badge ${feePaid ? 'badge-paid' : 'badge-unpaid'}">
              ${feePaid ? 'PAID' : 'UNPAID'}
            </span>
          </td>
          <td>
            <div style="display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap;">
              ${status === 'pending' ? `
                <button class="action-btn btn-approve" data-id="${teacher.user_id}">Approve</button>
              ` : ''}
              ${!feePaid ? `
                <button class="action-btn btn-payment" data-pay-id="${teacher.user_id}">Mark Paid</button>
              ` : ''}
              ${status === 'approved' && feePaid ? `
                <span style="color:#059669; font-weight:600; font-size:0.85rem;">Active / Unlocked</span>
              ` : ''}
            </div>
          </td>
        `;

        tableBody.appendChild(row);
      });

      attachEventListeners();

    } catch (err) {
      console.error("Admin Load Error:", err.message);
      tableBody.innerHTML = `<tr><td colspan="5" style="text-align:center; color:red; padding:3rem;">Error loading data: ${escapeHtml(err.message)}</td></tr>`;
    }
  }

  function attachEventListeners() {
    // Approve Teacher
    document.querySelectorAll('.btn-approve').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const userId = e.target.getAttribute('data-id');
        e.target.disabled = true;
        e.target.textContent = "Approving...";

        const { error } = await supabase
          .from('teacher_details')
          .update({ approval_status: 'approved' })
          .eq('user_id', userId);

        if (error) {
          alert("Error approving teacher: " + error.message);
          e.target.disabled = false;
          e.target.textContent = "Approve";
        } else {
          alert("Teacher approved successfully!");
          loadTeachers();
        }
      });
    });

    // Mark Fee Paid
    document.querySelectorAll('.btn-payment').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const userId = e.target.getAttribute('data-pay-id');
        e.target.disabled = true;
        e.target.textContent = "Updating...";

        const { error } = await supabase
          .from('teacher_details')
          .update({ space_fee_paid: true })
          .eq('user_id', userId);

        if (error) {
          alert("Error updating payment: " + error.message);
          e.target.disabled = false;
          e.target.textContent = "Mark Paid";
        } else {
          alert("Space fee marked as paid!");
          loadTeachers();
        }
      });
    });
  }

  // Logout Handler
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      await supabase.auth.signOut();
      window.location.href = 'login.html';
    });
  }

  function escapeHtml(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  loadTeachers();
});