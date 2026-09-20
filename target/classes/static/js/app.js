/* CampusFlex SPA Core Router & Application State */

const state = {
  currentUser: null,
  currentRole: null,
  activeView: 'dashboard',
  unreadNotifications: 0
};

document.addEventListener('DOMContentLoaded', () => {
  initApp();
});

async function initApp() {
  try {
    const res = await fetch('/api/auth/me');
    const data = await res.json();
    
    if (data.authenticated) {
      state.currentUser = data.user;
      state.currentRole = data.role;
      renderAuthenticatedUI();
    } else {
      state.currentUser = null;
      state.currentRole = null;
      renderGuestUI();
    }
  } catch (err) {
    console.error("Failed to check auth state:", err);
    renderGuestUI();
  }
}

function renderAuthenticatedUI() {
  const sidebarNav = document.getElementById('sidebar-nav');
  const userArea = document.getElementById('user-nav-area');
  
  let navItems = '';
  if (state.currentRole === 'STUDENT') {
    navItems = `
      <li class="nav-item ${state.activeView === 'dashboard' ? 'active' : ''}"><a href="#" onclick="navigateTo('dashboard')">📊 Dashboard</a></li>
      <li class="nav-item ${state.activeView === 'profile' ? 'active' : ''}"><a href="#" onclick="navigateTo('profile')">👤 Profile & Skills</a></li>
      <li class="nav-item ${state.activeView === 'timetable' ? 'active' : ''}"><a href="#" onclick="navigateTo('timetable')">📅 Weekly Timetable</a></li>
      <li class="nav-item ${state.activeView === 'find-jobs' ? 'active' : ''}"><a href="#" onclick="navigateTo('find-jobs')">🔍 Find Jobs</a></li>
      <li class="nav-item ${state.activeView === 'applications' ? 'active' : ''}"><a href="#" onclick="navigateTo('applications')">📝 My Applications</a></li>
      <li class="nav-item ${state.activeView === 'saved-jobs' ? 'active' : ''}"><a href="#" onclick="navigateTo('saved-jobs')">🔖 Saved Jobs</a></li>
      <li class="nav-item ${state.activeView === 'messages' ? 'active' : ''}"><a href="#" onclick="navigateTo('messages')">💬 Messages</a></li>
      <li class="nav-item"><a href="#" onclick="handleLogout()">🚪 Logout</a></li>
    `;
  } else if (state.currentRole === 'EMPLOYER') {
    navItems = `
      <li class="nav-item ${state.activeView === 'dashboard' ? 'active' : ''}"><a href="#" onclick="navigateTo('dashboard')">📊 Employer Dashboard</a></li>
      <li class="nav-item ${state.activeView === 'post-job' ? 'active' : ''}"><a href="#" onclick="navigateTo('post-job')">➕ Post Vacancy</a></li>
      <li class="nav-item ${state.activeView === 'my-jobs' ? 'active' : ''}"><a href="#" onclick="navigateTo('my-jobs')">💼 My Jobs</a></li>
      <li class="nav-item ${state.activeView === 'applicants' ? 'active' : ''}"><a href="#" onclick="navigateTo('applicants')">👥 Candidates</a></li>
      <li class="nav-item ${state.activeView === 'messages' ? 'active' : ''}"><a href="#" onclick="navigateTo('messages')">💬 Messages</a></li>
      <li class="nav-item"><a href="#" onclick="handleLogout()">🚪 Logout</a></li>
    `;
  } else if (state.currentRole === 'ADMIN') {
    navItems = `
      <li class="nav-item ${state.activeView === 'dashboard' ? 'active' : ''}"><a href="#" onclick="navigateTo('dashboard')">📊 Admin Console</a></li>
      <li class="nav-item ${state.activeView === 'verifications' ? 'active' : ''}"><a href="#" onclick="navigateTo('verifications')">✓ Employer Verification</a></li>
      <li class="nav-item ${state.activeView === 'reports' ? 'active' : ''}"><a href="#" onclick="navigateTo('reports')">⚠ Moderation Reports</a></li>
      <li class="nav-item"><a href="#" onclick="handleLogout()">🚪 Logout</a></li>
    `;
  }

  sidebarNav.innerHTML = navItems;

  userArea.innerHTML = `
    <div class="user-profile-badge" onclick="navigateTo('profile')">
      <img src="${getProfilePhotoUrl()}" class="avatar-circle" alt="User">
      <div>
        <div style="font-weight: 700; font-size: 13px;">${getDisplayName()}</div>
        <div style="font-size: 11px; color: var(--text-muted);">${state.currentRole}</div>
      </div>
    </div>
  `;

  renderCurrentView();
}

function renderGuestUI() {
  document.getElementById('sidebar-nav').innerHTML = `
    <li class="nav-item active"><a href="#" onclick="navigateTo('find-jobs')">🔍 Explore Jobs</a></li>
    <li class="nav-item"><a href="#" onclick="showAuthModal('login')">🔑 Log In</a></li>
  `;
  document.getElementById('user-nav-area').innerHTML = `
    <button class="btn btn-primary" onclick="showAuthModal('login')">Log In / Register</button>
  `;
  navigateTo('find-jobs');
}

function navigateTo(view) {
  state.activeView = view;
  if (state.currentUser) renderAuthenticatedUI();
  renderCurrentView();
}

function renderCurrentView() {
  const container = document.getElementById('main-view-container');
  const pageTitle = document.getElementById('page-title');

  if (state.activeView === 'dashboard') {
    pageTitle.textContent = state.currentRole === 'EMPLOYER' ? "Employer Dashboard" : (state.currentRole === 'ADMIN' ? "Admin Console" : "Student Dashboard");
    if (state.currentRole === 'EMPLOYER') renderEmployerDashboard(container);
    else if (state.currentRole === 'ADMIN') renderAdminDashboard(container);
    else renderStudentDashboard(container);
  } else if (state.activeView === 'find-jobs') {
    pageTitle.textContent = "Find Part-Time Jobs";
    renderFindJobsView(container);
  } else if (state.activeView === 'timetable') {
    pageTitle.textContent = "My College Lecture Timetable";
    renderTimetableGrid(container);
  } else if (state.activeView === 'profile') {
    pageTitle.textContent = "My Profile & Skills";
    renderProfileView(container);
  } else if (state.activeView === 'applications') {
    pageTitle.textContent = "My Job Applications";
    renderStudentApplications(container);
  } else if (state.activeView === 'saved-jobs') {
    pageTitle.textContent = "Saved / Bookmarked Jobs";
    renderSavedJobsView(container);
  } else if (state.activeView === 'post-job') {
    pageTitle.textContent = "Post a Job Vacancy";
    renderPostJobForm(container);
  } else if (state.activeView === 'applicants' || state.activeView === 'my-jobs') {
    pageTitle.textContent = "Manage Job Applicants";
    renderEmployerApplicantsView(container);
  } else if (state.activeView === 'verifications') {
    pageTitle.textContent = "Employer Verifications";
    renderAdminVerifications(container);
  } else if (state.activeView === 'reports') {
    pageTitle.textContent = "Moderation Reports";
    renderAdminReports(container);
  } else if (state.activeView === 'messages') {
    pageTitle.textContent = "In-App Messages";
    renderChatView(container);
  }
}

function getDisplayName() {
  if (!state.currentUser) return "Guest";
  if (state.currentUser.profile) {
    if (state.currentUser.profile.fullName) return state.currentUser.profile.fullName;
    if (state.currentUser.profile.companyName) return state.currentUser.profile.companyName;
  }
  return state.currentUser.email;
}

function getProfilePhotoUrl() {
  if (state.currentUser && state.currentUser.profile && state.currentUser.profile.profilePhoto) {
    return state.currentUser.profile.profilePhoto;
  }
  return 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150';
}

function showModal(id) {
  document.getElementById(id).classList.add('active');
}

function closeModal(id) {
  document.getElementById(id).classList.remove('active');
}

function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span>${type === 'error' ? '❌' : '✓'}</span> <span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 4000);
}
