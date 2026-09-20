/* Employer & Admin Dashboard Controllers */

async function renderEmployerDashboard(container) {
  try {
    const [jobsRes, appsRes] = await Promise.all([
      fetch(`/api/jobs/employer/${state.currentUser.id}`),
      fetch('/api/applications/employer')
    ]);

    const jobs = await jobsRes.json();
    const apps = await appsRes.json();

    let applicantRowsHtml = '';
    if (apps.length === 0) {
      applicantRowsHtml = `<tr><td colspan="5" style="text-align: center; padding: 16px; color: var(--text-muted);">No student candidates have applied yet.</td></tr>`;
    } else {
      apps.forEach(app => {
        let actionBtn = '';
        if (app.status === 'PENDING') {
          actionBtn = `
            <button class="btn btn-success" style="padding: 4px 10px; font-size: 11px;" onclick="acceptApplicantAction(${app.id})">Accept ✓</button>
            <button class="btn btn-danger" style="padding: 4px 10px; font-size: 11px;" onclick="rejectApplicantAction(${app.id})">Reject</button>
          `;
        } else {
          actionBtn = `<span style="font-weight: 700; font-size: 11px;">${app.status}</span>`;
        }

        applicantRowsHtml += `
          <tr style="border-bottom: 1px solid var(--border-color); font-size: 13px;">
            <td style="padding: 12px;">
              <div style="font-weight: 700;">${app.studentName}</div>
              <div style="font-size: 11px; color: var(--text-muted);">${app.studentCollege} (${app.studentDepartment})</div>
            </td>
            <td style="padding: 12px;">${app.jobTitle}</td>
            <td style="padding: 12px;"><span class="match-badge">94% Fit</span></td>
            <td style="padding: 12px;">${app.status}</td>
            <td style="padding: 12px;">${actionBtn}</td>
          </tr>
        `;
      });
    }

    container.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
        <div>
          <h2 style="font-size: 22px; font-weight: 800;">Welcome, ${getDisplayName()}</h2>
          <p style="font-size: 13px; color: var(--text-muted);">Manage your part-time vacancies and candidate student matches.</p>
        </div>
        <button class="btn btn-primary" onclick="navigateTo('post-job')">+ Post New Job</button>
      </div>

      <div class="grid-3" style="margin-bottom: 24px;">
        <div class="card">
          <div style="font-size: 12px; color: var(--text-muted); font-weight: 700;">ACTIVE JOBS</div>
          <div style="font-size: 24px; font-weight: 800; color: var(--primary-purple); margin-top: 4px;">${jobs.length}</div>
        </div>
        <div class="card">
          <div style="font-size: 12px; color: var(--text-muted); font-weight: 700;">TOTAL APPLICANTS</div>
          <div style="font-size: 24px; font-weight: 800; color: var(--text-main); margin-top: 4px;">${apps.length}</div>
        </div>
        <div class="card">
          <div style="font-size: 12px; color: var(--text-muted); font-weight: 700;">HIRED STUDENTS</div>
          <div style="font-size: 24px; font-weight: 800; color: var(--success-green); margin-top: 4px;">${apps.filter(a => a.status === 'ACCEPTED').length}</div>
        </div>
      </div>

      <div class="card">
        <h3 style="font-size: 16px; font-weight: 800; margin-bottom: 16px;">Recent Student Applicants</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="text-align: left; font-size: 12px; color: var(--text-muted); border-bottom: 1px solid var(--border-color);">
              <th style="padding: 8px 12px;">Candidate</th>
              <th style="padding: 8px 12px;">Position</th>
              <th style="padding: 8px 12px;">Smart Fit</th>
              <th style="padding: 8px 12px;">Status</th>
              <th style="padding: 8px 12px;">Actions</th>
            </tr>
          </thead>
          <tbody>
            ${applicantRowsHtml}
          </tbody>
        </table>
      </div>
    `;
  } catch (err) {
    container.innerHTML = `<div class="card"><p style="color: var(--danger-red);">Error loading employer dashboard.</p></div>`;
  }
}

async function renderPostJobForm(container) {
  container.innerHTML = `
    <div class="card" style="max-width: 680px; margin: 0 auto; padding: 28px;">
      <h3 style="font-size: 20px; font-weight: 800; margin-bottom: 20px;">Post a New Part-Time Vacancy</h3>
      
      <form onsubmit="handlePostJobSubmit(event)">
        <div style="margin-bottom: 14px;">
          <label style="font-size: 12px; font-weight: 700;">Job Title</label>
          <input type="text" id="pj-title" required placeholder="e.g. Online Math Tutor / Java TA" style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid var(--border-color);">
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 14px;">
          <div>
            <label style="font-size: 12px; font-weight: 700;">Category</label>
            <select id="pj-category" required style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid var(--border-color);">
              <option value="1">Tutoring & Education</option>
              <option value="2">Software & IT</option>
              <option value="3">Media & Design</option>
              <option value="4">Office & Administration</option>
              <option value="5">Marketing & Sales</option>
            </select>
          </div>
          <div>
            <label style="font-size: 12px; font-weight: 700;">Work Mode</label>
            <select id="pj-worktype" required style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid var(--border-color);">
              <option value="REMOTE">Remote</option>
              <option value="ON_SITE">On-Site</option>
              <option value="HYBRID">Hybrid</option>
            </select>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 14px;">
          <div>
            <label style="font-size: 12px; font-weight: 700;">Daily Salary Amount (₹)</label>
            <input type="number" id="pj-salary" required placeholder="600" style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid var(--border-color);">
          </div>
          <div>
            <label style="font-size: 12px; font-weight: 700;">Location City</label>
            <input type="text" id="pj-location" required placeholder="Calicut / Kochi" style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid var(--border-color);">
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; margin-bottom: 14px;">
          <div>
            <label style="font-size: 12px; font-weight: 700;">Start Time</label>
            <input type="time" id="pj-start" required style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid var(--border-color);">
          </div>
          <div>
            <label style="font-size: 12px; font-weight: 700;">End Time</label>
            <input type="time" id="pj-end" required style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid var(--border-color);">
          </div>
          <div>
            <label style="font-size: 12px; font-weight: 700;">Vacancies</label>
            <input type="number" id="pj-vacancies" required value="2" min="1" style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid var(--border-color);">
          </div>
        </div>

        <div style="margin-bottom: 14px;">
          <label style="font-size: 12px; font-weight: 700;">Working Days (comma separated)</label>
          <input type="text" id="pj-days" required placeholder="MONDAY,WEDNESDAY,FRIDAY" style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid var(--border-color);">
        </div>

        <div style="margin-bottom: 14px;">
          <label style="font-size: 12px; font-weight: 700;">Description</label>
          <textarea id="pj-description" required rows="3" placeholder="Describe the job duties..." style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid var(--border-color);"></textarea>
        </div>

        <button type="submit" class="btn btn-primary" style="width: 100%; padding: 12px;">Publish Job Vacancy</button>
      </form>
    </div>
  `;
}

async function handlePostJobSubmit(e) {
  e.preventDefault();
  const payload = {
    title: document.getElementById('pj-title').value,
    categoryId: document.getElementById('pj-category').value,
    workType: document.getElementById('pj-worktype').value,
    salaryAmount: document.getElementById('pj-salary').value,
    salaryType: 'DAILY',
    location: document.getElementById('pj-location').value,
    startTime: document.getElementById('pj-start').value,
    endTime: document.getElementById('pj-end').value,
    vacancies: document.getElementById('pj-vacancies').value,
    workingDays: document.getElementById('pj-days').value,
    description: document.getElementById('pj-description').value,
    requirements: 'Standard skills required'
  };

  try {
    const res = await fetch('/api/jobs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      showToast('Vacancy published successfully!', 'success');
      navigateTo('dashboard');
    } else {
      const err = await res.json();
      showToast(err.message || 'Failed to post job', 'error');
    }
  } catch (err) {
    showToast('Error publishing vacancy', 'error');
  }
}

async function acceptApplicantAction(appId) {
  try {
    const res = await fetch(`/api/applications/${appId}/accept`, { method: 'PUT' });
    if (res.ok) {
      showToast('Candidate accepted! Vacancy decremented.', 'success');
      renderEmployerDashboard(document.getElementById('main-view-container'));
    } else {
      const err = await res.json();
      showToast(err.message || 'Error accepting candidate', 'error');
    }
  } catch (err) {
    showToast('Error', 'error');
  }
}

async function rejectApplicantAction(appId) {
  const res = await fetch(`/api/applications/${appId}/reject`, { method: 'PUT' });
  if (res.ok) {
    showToast('Candidate rejected', 'info');
    renderEmployerDashboard(document.getElementById('main-view-container'));
  }
}

async function renderAdminDashboard(container) {
  try {
    const res = await fetch('/api/admin/stats');
    const stats = await res.json();

    container.innerHTML = `
      <div style="margin-bottom: 24px;">
        <h2 style="font-size: 22px; font-weight: 800;">CampusFlex Platform Admin</h2>
        <p style="font-size: 13px; color: var(--text-muted);">Overview of registered users, employer verifications, and safety moderation.</p>
      </div>

      <div class="grid-3">
        <div class="card">
          <div style="font-size: 12px; color: var(--text-muted); font-weight: 700;">TOTAL USERS</div>
          <div style="font-size: 24px; font-weight: 800; color: var(--primary-purple);">${stats.totalUsers || 0}</div>
        </div>
        <div class="card">
          <div style="font-size: 12px; color: var(--text-muted); font-weight: 700;">ACTIVE JOBS</div>
          <div style="font-size: 24px; font-weight: 800; color: var(--text-main);">${stats.totalJobs || 0}</div>
        </div>
        <div class="card">
          <div style="font-size: 12px; color: var(--text-muted); font-weight: 700;">PENDING VERIFICATIONS</div>
          <div style="font-size: 24px; font-weight: 800; color: var(--warning-amber);">${stats.pendingVerifications || 0}</div>
        </div>
      </div>
    `;
  } catch (err) {
    container.innerHTML = `<div class="card"><p style="color: var(--danger-red);">Admin access error.</p></div>`;
  }
}
