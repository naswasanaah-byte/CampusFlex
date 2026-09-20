/* Authentication & User Session Handler */

function showAuthModal(type = 'login') {
  const container = document.getElementById('auth-form-container');
  showModal('auth-modal');

  if (type === 'login') {
    container.innerHTML = `
      <form onsubmit="handleLoginSubmit(event)">
        <div style="margin-bottom: 16px;">
          <label style="font-size: 13px; font-weight: 700;">Email Address</label>
          <input type="email" id="login-email" required placeholder="student@campusflex.com" style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid var(--border-color); margin-top: 4px;">
        </div>
        <div style="margin-bottom: 20px;">
          <label style="font-size: 13px; font-weight: 700;">Password</label>
          <input type="password" id="login-password" required placeholder="••••••••" style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid var(--border-color); margin-top: 4px;">
        </div>
        <button type="submit" class="btn btn-primary" style="width: 100%; padding: 12px;">Sign In</button>
      </form>
      <div style="margin-top: 16px; text-align: center; font-size: 13px; color: var(--text-muted);">
        Don't have an account? 
        <a href="#" onclick="showAuthModal('register-student')" style="color: var(--primary-purple); font-weight: 700;">Register as Student</a> | 
        <a href="#" onclick="showAuthModal('register-employer')" style="color: var(--primary-purple); font-weight: 700;">Register as Employer</a>
      </div>
    `;
  } else if (type === 'register-student') {
    container.innerHTML = `
      <form onsubmit="handleRegisterStudentSubmit(event)">
        <div style="margin-bottom: 12px;">
          <label style="font-size: 12px; font-weight: 700;">Full Name</label>
          <input type="text" id="reg-name" required placeholder="e.g. Ananya Verma" style="width: 100%; padding: 8px; border-radius: 6px; border: 1px solid var(--border-color);">
        </div>
        <div style="margin-bottom: 12px;">
          <label style="font-size: 12px; font-weight: 700;">Email Address</label>
          <input type="email" id="reg-email" required placeholder="ananya@nitc.ac.in" style="width: 100%; padding: 8px; border-radius: 6px; border: 1px solid var(--border-color);">
        </div>
        <div style="margin-bottom: 12px;">
          <label style="font-size: 12px; font-weight: 700;">Phone Number</label>
          <input type="text" id="reg-phone" required placeholder="+91 9876543210" style="width: 100%; padding: 8px; border-radius: 6px; border: 1px solid var(--border-color);">
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 12px;">
          <div>
            <label style="font-size: 12px; font-weight: 700;">College</label>
            <input type="text" id="reg-college" required placeholder="NIT Calicut" style="width: 100%; padding: 8px; border-radius: 6px; border: 1px solid var(--border-color);">
          </div>
          <div>
            <label style="font-size: 12px; font-weight: 700;">Department</label>
            <input type="text" id="reg-dept" required placeholder="Computer Science" style="width: 100%; padding: 8px; border-radius: 6px; border: 1px solid var(--border-color);">
          </div>
        </div>
        <div style="margin-bottom: 16px;">
          <label style="font-size: 12px; font-weight: 700;">Password</label>
          <input type="password" id="reg-password" required placeholder="••••••••" style="width: 100%; padding: 8px; border-radius: 6px; border: 1px solid var(--border-color);">
        </div>
        <button type="submit" class="btn btn-primary" style="width: 100%; padding: 10px;">Create Student Account</button>
      </form>
      <div style="margin-top: 12px; text-align: center; font-size: 12px;">
        Already registered? <a href="#" onclick="showAuthModal('login')" style="color: var(--primary-purple); font-weight: 700;">Sign In</a>
      </div>
    `;
  } else if (type === 'register-employer') {
    container.innerHTML = `
      <form onsubmit="handleRegisterEmployerSubmit(event)">
        <div style="margin-bottom: 12px;">
          <label style="font-size: 12px; font-weight: 700;">Company / Organization Name</label>
          <input type="text" id="reg-company" required placeholder="Bright Academy Calicut" style="width: 100%; padding: 8px; border-radius: 6px; border: 1px solid var(--border-color);">
        </div>
        <div style="margin-bottom: 12px;">
          <label style="font-size: 12px; font-weight: 700;">Business Email</label>
          <input type="email" id="reg-emp-email" required placeholder="contact@brightacademy.in" style="width: 100%; padding: 8px; border-radius: 6px; border: 1px solid var(--border-color);">
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 12px;">
          <div>
            <label style="font-size: 12px; font-weight: 700;">Location</label>
            <input type="text" id="reg-emp-location" required placeholder="Calicut" style="width: 100%; padding: 8px; border-radius: 6px; border: 1px solid var(--border-color);">
          </div>
          <div>
            <label style="font-size: 12px; font-weight: 700;">Industry</label>
            <input type="text" id="reg-emp-industry" required placeholder="Education" style="width: 100%; padding: 8px; border-radius: 6px; border: 1px solid var(--border-color);">
          </div>
        </div>
        <div style="margin-bottom: 16px;">
          <label style="font-size: 12px; font-weight: 700;">Password</label>
          <input type="password" id="reg-emp-password" required placeholder="••••••••" style="width: 100%; padding: 8px; border-radius: 6px; border: 1px solid var(--border-color);">
        </div>
        <button type="submit" class="btn btn-primary" style="width: 100%; padding: 10px;">Register Employer Account</button>
      </form>
    `;
  }
}

async function handleLoginSubmit(e) {
  e.preventDefault();
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (res.ok) {
      state.currentUser = data.user;
      state.currentRole = data.role;
      closeModal('auth-modal');
      showToast(`Welcome back, ${getDisplayName()}! 🎉`, 'success');
      renderAuthenticatedUI();
    } else {
      showToast(data.message || 'Login failed', 'error');
    }
  } catch (err) {
    showToast('Connection error during login', 'error');
  }
}

async function demoLogin(email, password) {
  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (res.ok) {
      state.currentUser = data.user;
      state.currentRole = data.role;
      closeModal('auth-modal');
      showToast(`Logged in as ${getDisplayName()}`, 'success');
      renderAuthenticatedUI();
    } else {
      showToast(data.message || 'Demo login failed', 'error');
    }
  } catch (err) {
    showToast('Demo login error', 'error');
  }
}

async function handleRegisterStudentSubmit(e) {
  e.preventDefault();
  const payload = {
    fullName: document.getElementById('reg-name').value,
    email: document.getElementById('reg-email').value,
    phone: document.getElementById('reg-phone').value,
    college: document.getElementById('reg-college').value,
    department: document.getElementById('reg-dept').value,
    password: document.getElementById('reg-password').value
  };

  try {
    const res = await fetch('/api/auth/register/student', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (res.ok) {
      state.currentUser = data.user;
      state.currentRole = data.role;
      closeModal('auth-modal');
      showToast('Registration successful! Welcome to CampusFlex.', 'success');
      renderAuthenticatedUI();
    } else {
      showToast(data.message || 'Registration failed', 'error');
    }
  } catch (err) {
    showToast('Registration error', 'error');
  }
}

async function handleRegisterEmployerSubmit(e) {
  e.preventDefault();
  const payload = {
    companyName: document.getElementById('reg-company').value,
    email: document.getElementById('reg-emp-email').value,
    phone: "+91 9876543210",
    location: document.getElementById('reg-emp-location').value,
    industry: document.getElementById('reg-emp-industry').value,
    password: document.getElementById('reg-emp-password').value
  };

  try {
    const res = await fetch('/api/auth/register/employer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (res.ok) {
      state.currentUser = data.user;
      state.currentRole = data.role;
      closeModal('auth-modal');
      showToast('Employer registered successfully!', 'success');
      renderAuthenticatedUI();
    } else {
      showToast(data.message || 'Employer registration failed', 'error');
    }
  } catch (err) {
    showToast('Registration error', 'error');
  }
}

async function handleLogout() {
  await fetch('/api/auth/logout', { method: 'POST' });
  state.currentUser = null;
  state.currentRole = null;
  showToast('Logged out', 'info');
  renderGuestUI();
}
