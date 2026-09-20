/* Job Search, Matching & Student Dashboard Renderer */

async function renderStudentDashboard(container) {
  try {
    const [profileRes, jobsRes, appsRes] = await Promise.all([
      fetch('/api/student/profile'),
      fetch('/api/jobs?limit=6'),
      fetch('/api/applications/student')
    ]);

    const profileData = await profileRes.json();
    const jobs = await jobsRes.json();
    const applications = await appsRes.json();

    const studentName = profileData.profile ? profileData.profile.fullName : 'Student';
    const completionPct = profileData.completionPercentage || 80;

    let jobCardsHtml = '';
    for (let job of jobs) {
      let matchBadge = '<span class="match-badge">92% Match</span>';
      if (state.currentUser) {
        try {
          const matchRes = await fetch(`/api/jobs/${job.id}/match`);
          if (matchRes.ok) {
            const matchData = await matchRes.json();
            if (matchData.hasTimetableConflict) {
              matchBadge = `<span class="conflict-badge">⚠ Schedule Conflict</span>`;
            } else {
              matchBadge = `<span class="match-badge">${matchData.overallScore}% Match</span>`;
            }
          }
        } catch (ignored) {}
      }

      jobCardsHtml += `
        <div class="card job-card">
          <div class="job-card-header">
            <div style="display: flex; gap: 12px; align-items: center;">
              <img src="${job.companyLogo || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150'}" class="company-logo-img" alt="Logo">
              <div>
                <h4 style="font-size: 15px; font-weight: 700;">${job.title}</h4>
                <div style="font-size: 12px; color: var(--text-muted); display: flex; align-items: center; gap: 4px;">
                  ${job.companyName} ${job.isVerified ? '<span class="verified-tag">✓ Verified</span>' : ''}
                </div>
              </div>
            </div>
            ${matchBadge}
          </div>

          <div style="font-size: 12px; color: var(--text-muted); display: grid; grid-template-columns: 1fr 1fr; gap: 6px;">
            <div>📍 ${job.location}</div>
            <div>💰 ₹${job.salaryAmount}/${job.salaryType ? job.salaryType.toLowerCase() : 'day'}</div>
            <div>⏰ ${job.startTime ? job.startTime.substring(0,5) : ''} - ${job.endTime ? job.endTime.substring(0,5) : ''}</div>
            <div>💼 ${job.workType}</div>
          </div>

          <div style="display: flex; gap: 8px; margin-top: 6px;">
            <button class="btn btn-primary" style="flex: 1; padding: 8px;" onclick="openJobDetailsModal(${job.id})">View Details & Apply</button>
          </div>
        </div>
      `;
    }

    container.innerHTML = `
      <!-- Greeting Banner -->
      <div style="background: var(--purple-gradient); border-radius: var(--radius-lg); padding: 28px; color: white; margin-bottom: 24px; box-shadow: var(--shadow-md);">
        <h2 style="font-size: 24px; font-weight: 800;">Hello, ${studentName}! 👋</h2>
        <p style="opacity: 0.9; margin-top: 4px; font-size: 14px;">Here are the verified part-time jobs tailored to your skills and lecture timetable today.</p>
      </div>

      <!-- Top Stats & Profile Completion -->
      <div class="grid-3" style="margin-bottom: 28px;">
        <div class="card" style="display: flex; align-items: center; justify-content: space-between;">
          <div>
            <div style="font-size: 12px; color: var(--text-muted); font-weight: 700;">PROFILE COMPLETION</div>
            <div style="font-size: 24px; font-weight: 800; color: var(--primary-purple);">${completionPct}%</div>
            <div style="font-size: 11px; color: var(--text-muted); margin-top: 2px;">Add missing skills to reach 100%</div>
          </div>
          <div style="width: 50px; height: 50px; border-radius: 50%; background: var(--light-purple); display: flex; align-items: center; justify-content: center; font-weight: 800; color: var(--primary-purple);">📈</div>
        </div>

        <div class="card">
          <div style="font-size: 12px; color: var(--text-muted); font-weight: 700;">APPLICATIONS SUBMITTED</div>
          <div style="font-size: 24px; font-weight: 800; color: var(--text-main); margin-top: 4px;">${applications.length}</div>
          <div style="font-size: 11px; color: var(--success-green); margin-top: 2px;">Active tracking enabled</div>
        </div>

        <div class="card">
          <div style="font-size: 12px; color: var(--text-muted); font-weight: 700;">ACCEPTED POSITIONS</div>
          <div style="font-size: 24px; font-weight: 800; color: var(--success-green); margin-top: 4px;">
            ${applications.filter(a => a.status === 'ACCEPTED').length}
          </div>
          <div style="font-size: 11px; color: var(--text-muted); margin-top: 2px;">Flexible earnings active</div>
        </div>
      </div>

      <!-- Recommended Jobs Section -->
      <div style="margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center;">
        <h3 style="font-size: 18px; font-weight: 800;">Recommended For You</h3>
        <a href="#" onclick="navigateTo('find-jobs')" style="color: var(--primary-purple); font-weight: 700; text-decoration: none; font-size: 13px;">View All Jobs →</a>
      </div>

      <div class="grid-3">
        ${jobCardsHtml}
      </div>
    `;
  } catch (err) {
    container.innerHTML = `<div class="card"><p style="color: var(--danger-red);">Error rendering student dashboard.</p></div>`;
  }
}

async function renderFindJobsView(container) {
  try {
    const jobsRes = await fetch('/api/jobs?limit=20');
    const jobs = await jobsRes.json();

    let jobCardsHtml = '';
    for (let job of jobs) {
      let matchBadge = '';
      if (state.currentUser) {
        try {
          const matchRes = await fetch(`/api/jobs/${job.id}/match`);
          if (matchRes.ok) {
            const matchData = await matchRes.json();
            if (matchData.hasTimetableConflict) {
              matchBadge = `<span class="conflict-badge">⚠ Schedule Conflict</span>`;
            } else {
              matchBadge = `<span class="match-badge">${matchData.overallScore}% Match</span>`;
            }
          }
        } catch (ignored) {}
      }

      jobCardsHtml += `
        <div class="card job-card">
          <div class="job-card-header">
            <div style="display: flex; gap: 12px; align-items: center;">
              <img src="${job.companyLogo || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150'}" class="company-logo-img" alt="Logo">
              <div>
                <h4 style="font-size: 15px; font-weight: 700;">${job.title}</h4>
                <div style="font-size: 12px; color: var(--text-muted); display: flex; align-items: center; gap: 4px;">
                  ${job.companyName} ${job.isVerified ? '<span class="verified-tag">✓ Verified</span>' : ''}
                </div>
              </div>
            </div>
            ${matchBadge}
          </div>

          <p style="font-size: 12px; color: var(--text-muted); line-height: 1.4;">${job.description ? job.description.substring(0, 90) + '...' : ''}</p>

          <div style="font-size: 12px; color: var(--text-muted); display: grid; grid-template-columns: 1fr 1fr; gap: 6px;">
            <div>📍 ${job.location}</div>
            <div>💰 ₹${job.salaryAmount}/${job.salaryType ? job.salaryType.toLowerCase() : 'day'}</div>
            <div>⏰ ${job.startTime ? job.startTime.substring(0,5) : ''} - ${job.endTime ? job.endTime.substring(0,5) : ''}</div>
            <div>💼 ${job.workType}</div>
          </div>

          <div style="display: flex; gap: 8px; margin-top: 6px;">
            <button class="btn btn-primary" style="flex: 1; padding: 8px;" onclick="openJobDetailsModal(${job.id})">View Details</button>
          </div>
        </div>
      `;
    }

    container.innerHTML = `
      <!-- Search & Filters Header -->
      <div class="card" style="margin-bottom: 24px; padding: 20px;">
        <div style="display: grid; grid-template-columns: 1fr; gap: 12px;">
          <input type="text" id="search-keyword" placeholder="Search by job title, skills, or company..." style="padding: 12px; border-radius: 8px; border: 1px solid var(--border-color); width: 100%;">
          
          <div style="display: flex; gap: 10px; flex-wrap: wrap;">
            <select id="filter-work-type" style="padding: 8px 12px; border-radius: 6px; border: 1px solid var(--border-color); font-size: 13px;">
              <option value="">All Work Modes</option>
              <option value="REMOTE">Remote</option>
              <option value="ON_SITE">On-Site</option>
              <option value="HYBRID">Hybrid</option>
            </select>

            <select id="filter-location" style="padding: 8px 12px; border-radius: 6px; border: 1px solid var(--border-color); font-size: 13px;">
              <option value="">All Locations</option>
              <option value="Calicut">Calicut / Kozhikode</option>
              <option value="Kochi">Kochi</option>
              <option value="Kannur">Kannur</option>
            </select>

            <button class="btn btn-primary" onclick="handleSearchFilter()">Search Jobs</button>
          </div>
        </div>
      </div>

      <div class="grid-3" id="jobs-grid-container">
        ${jobCardsHtml}
      </div>
    `;
  } catch (err) {
    container.innerHTML = `<div class="card"><p style="color: var(--danger-red);">Failed to load jobs list.</p></div>`;
  }
}

async function handleSearchFilter() {
  const kw = document.getElementById('search-keyword').value;
  const wt = document.getElementById('filter-work-type').value;
  const loc = document.getElementById('filter-location').value;

  const url = `/api/jobs?keyword=${encodeURIComponent(kw)}&workType=${encodeURIComponent(wt)}&location=${encodeURIComponent(loc)}`;
  const res = await fetch(url);
  const jobs = await res.json();

  const container = document.getElementById('jobs-grid-container');
  let jobCardsHtml = '';
  for (let job of jobs) {
    jobCardsHtml += `
      <div class="card job-card">
        <div class="job-card-header">
          <div style="display: flex; gap: 12px; align-items: center;">
            <img src="${job.companyLogo || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150'}" class="company-logo-img" alt="Logo">
            <div>
              <h4 style="font-size: 15px; font-weight: 700;">${job.title}</h4>
              <div style="font-size: 12px; color: var(--text-muted);">${job.companyName}</div>
            </div>
          </div>
        </div>
        <div style="font-size: 12px; color: var(--text-muted);">📍 ${job.location} | 💰 ₹${job.salaryAmount}</div>
        <button class="btn btn-primary" style="padding: 8px;" onclick="openJobDetailsModal(${job.id})">View Details</button>
      </div>
    `;
  }
  container.innerHTML = jobCardsHtml || `<div class="card" style="grid-column: 1/-1;"><p style="text-align: center; color: var(--text-muted);">No matching part-time jobs found.</p></div>`;
}

async function openJobDetailsModal(jobId) {
  try {
    const res = await fetch(`/api/jobs/${jobId}`);
    const job = await res.json();
    showModal('job-modal');

    let matchReasonsHtml = '';
    if (state.currentUser) {
      const matchRes = await fetch(`/api/jobs/${jobId}/match`);
      if (matchRes.ok) {
        const matchData = await matchRes.json();
        matchReasonsHtml = `
          <div style="background: var(--light-purple); padding: 14px; border-radius: 8px; margin: 16px 0;">
            <div style="font-weight: 800; color: var(--primary-purple); margin-bottom: 6px;">
              ${matchData.hasTimetableConflict ? '⚠ Schedule Conflict Warning' : '🎯 Smart Compatibility Score: ' + matchData.overallScore + '%'}
            </div>
            <ul style="list-style: none; font-size: 12px; display: flex; flex-direction: column; gap: 4px;">
              ${matchData.matchReasons.map(r => `<li style="color: var(--success-green); font-weight: 600;">${r}</li>`).join('')}
              ${matchData.conflicts.map(c => `<li style="color: var(--danger-red); font-weight: 600;">${c}</li>`).join('')}
            </ul>
          </div>
        `;
      }
    }

    document.getElementById('job-modal-body').innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px;">
        <div>
          <h3 style="font-size: 20px; font-weight: 800;">${job.title}</h3>
          <div style="font-size: 13px; color: var(--text-muted); display: flex; align-items: center; gap: 6px; margin-top: 2px;">
            ${job.companyName} ${job.isVerified ? '<span class="verified-tag">✓ Verified Employer</span>' : ''}
          </div>
        </div>
        <button onclick="closeModal('job-modal')" style="background: none; border: none; font-size: 20px; cursor: pointer;">✕</button>
      </div>

      ${matchReasonsHtml}

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; background: #F8F9FC; padding: 14px; border-radius: 8px; margin-bottom: 16px; font-size: 13px;">
        <div>💰 <strong>Salary:</strong> ₹${job.salaryAmount} / ${job.salaryType}</div>
        <div>📍 <strong>Location:</strong> ${job.location} (${job.workType})</div>
        <div>⏰ <strong>Hours:</strong> ${job.startTime ? job.startTime.substring(0,5) : ''} - ${job.endTime ? job.endTime.substring(0,5) : ''}</div>
        <div>📅 <strong>Days:</strong> ${job.workingDays}</div>
        <div>👥 <strong>Openings:</strong> ${job.vacancies} student position(s)</div>
        <div>⏳ <strong>Deadline:</strong> ${job.deadline}</div>
      </div>

      <div style="margin-bottom: 16px;">
        <h4 style="font-size: 14px; font-weight: 700; margin-bottom: 4px;">Job Description</h4>
        <p style="font-size: 13px; color: var(--text-muted); line-height: 1.5;">${job.description || 'No detailed description provided.'}</p>
      </div>

      <div style="margin-bottom: 20px;">
        <h4 style="font-size: 14px; font-weight: 700; margin-bottom: 4px;">Requirements & Skills</h4>
        <p style="font-size: 13px; color: var(--text-muted);">${job.requirements || 'Standard student requirements.'}</p>
      </div>

      <div style="display: flex; gap: 12px;">
        <button class="btn btn-primary" style="flex: 2;" onclick="submitJobApplication(${job.id})">Apply Now</button>
        <button class="btn btn-secondary" style="flex: 1;" onclick="saveJobBookmark(${job.id})">Bookmark</button>
      </div>
    `;
  } catch (err) {
    showToast('Failed to load job details', 'error');
  }
}

async function submitJobApplication(jobId) {
  if (!state.currentUser) {
    showToast('Please log in as a student to apply.', 'error');
    showAuthModal('login');
    return;
  }

  try {
    const res = await fetch('/api/applications/apply', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jobId, coverNote: 'Interested in this flexible part-time role.' })
    });
    if (res.ok) {
      closeModal('job-modal');
      showToast('Application submitted successfully! 🎉', 'success');
      navigateTo('applications');
    } else {
      const err = await res.json();
      showToast(err.message || 'Failed to submit application', 'error');
    }
  } catch (err) {
    showToast('Application error', 'error');
  }
}

async function saveJobBookmark(jobId) {
  if (!state.currentUser) {
    showAuthModal('login');
    return;
  }
  const res = await fetch(`/api/student/saved-jobs/${jobId}`, { method: 'POST' });
  if (res.ok) {
    showToast('Job saved to your bookmarks!', 'success');
  }
}

async function renderStudentApplications(container) {
  try {
    const res = await fetch('/api/applications/student');
    const apps = await res.json();

    let cardsHtml = '';
    if (apps.length === 0) {
      cardsHtml = `<div class="card"><p style="text-align: center; color: var(--text-muted);">You haven't applied to any jobs yet.</p></div>`;
    } else {
      apps.forEach(app => {
        let statusBadge = `<span style="background: var(--warning-bg); color: var(--warning-amber); padding: 4px 10px; border-radius: 12px; font-weight: 700; font-size: 11px;">PENDING</span>`;
        if (app.status === 'ACCEPTED') {
          statusBadge = `<span style="background: var(--success-bg); color: var(--success-green); padding: 4px 10px; border-radius: 12px; font-weight: 700; font-size: 11px;">ACCEPTED 🎉</span>`;
        } else if (app.status === 'REJECTED') {
          statusBadge = `<span style="background: var(--danger-bg); color: var(--danger-red); padding: 4px 10px; border-radius: 12px; font-weight: 700; font-size: 11px;">REJECTED</span>`;
        }

        cardsHtml += `
          <div class="card" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
            <div>
              <h4 style="font-size: 15px; font-weight: 700;">${app.jobTitle}</h4>
              <div style="font-size: 12px; color: var(--text-muted);">${app.companyName} • Applied ${app.appliedAt ? app.appliedAt.substring(0,10) : ''}</div>
            </div>
            <div>${statusBadge}</div>
          </div>
        `;
      });
    }

    container.innerHTML = `
      <div style="margin-bottom: 20px;">
        <h3 style="font-size: 18px; font-weight: 800;">My Job Applications</h3>
      </div>
      <div>${cardsHtml}</div>
    `;
  } catch (err) {
    container.innerHTML = `<div class="card"><p style="color: var(--danger-red);">Failed to load applications.</p></div>`;
  }
}
