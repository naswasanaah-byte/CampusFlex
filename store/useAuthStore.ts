import { create } from 'zustand';
import { User, UserRole, EmployerReport } from '@/types';
import { MOCK_USERS } from '@/lib/mockData';
import { useJobStore } from '@/store/useJobStore';
import { useNotificationStore } from '@/store/useNotificationStore';

export interface AuthLoginResponse {
  success: boolean;
  message?: string;
}

export const AUTHORIZED_ADMIN_EMAILS = ['avanislavanisl536', 'avanislavanisl536@gmail.com'];
export const AUTHORIZED_ADMIN_PASSWORD = 'kunjatta';

interface AuthState {
  currentUser: User | null;
  usersList: User[];
  isAuthenticated: boolean;
  switchRole: (role: UserRole) => void;
  login: (email: string, password?: string, role?: UserRole) => AuthLoginResponse;
  loginWithGoogle: (
    email: string,
    name: string,
    avatar?: string,
    role?: UserRole,
    credentialToken?: string
  ) => Promise<AuthLoginResponse>;
  logout: () => void;
  register: (user: Partial<User>) => void;
  updateProfile: (updatedData: Partial<User>) => void;
  verifyEmployer: (employerId: string, allow: boolean) => void;
  reportEmployer: (
    employerId: string,
    studentId: string,
    studentName: string,
    studentEmail: string,
    reason: string,
    details?: string,
    jobId?: string,
    jobTitle?: string
  ) => { success: boolean; banned: boolean; reportCount: number; message: string };
  toggleVerifyEmployer: (employerId: string) => void;
  toggleVerifyUser: (userId: string) => void;
  toggleUserStatus: (userId: string) => void;
  deleteUser: (userId: string) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  currentUser: null,
  usersList: MOCK_USERS,
  isAuthenticated: false,

  switchRole: (role: UserRole) => {
    if (role === 'admin') {
      const current = get().currentUser;
      const isAuthorizedAdmin =
        current &&
        current.role === 'admin' &&
        AUTHORIZED_ADMIN_EMAILS.includes(current.email.toLowerCase().trim());
      if (!isAuthorizedAdmin) {
        return; // Guard: Cannot switch to admin without authenticating with admin credentials
      }
    }
    const found = get().usersList.find((u) => u.role === role);
    if (found) {
      set({ currentUser: found, isAuthenticated: true });
    }
  },

  login: (email: string, password?: string, role?: UserRole): AuthLoginResponse => {
    const cleanEmail = email.trim().toLowerCase();
    const normalizedEmail = cleanEmail.includes('@') ? cleanEmail : `${cleanEmail}@gmail.com`;

    if (!cleanEmail) {
      return { success: false, message: 'Please enter your email address.' };
    }

    if (!password || password.length < 4) {
      return { success: false, message: 'Password must be at least 4 characters.' };
    }

    // Explicit Admin Restriction: Only authorized credentials can access admin
    if (role === 'admin') {
      const isEmailAuthorized =
        AUTHORIZED_ADMIN_EMAILS.includes(cleanEmail) ||
        AUTHORIZED_ADMIN_EMAILS.includes(normalizedEmail);
      if (!isEmailAuthorized || password !== AUTHORIZED_ADMIN_PASSWORD) {
        return {
          success: false,
          message: 'Invalid administrator credentials. Access denied.',
        };
      }
    }

    // Search for registered user account (supports both raw username and @gmail.com)
    const matchedUser = get().usersList.find(
      (u) => u.email.toLowerCase() === cleanEmail || u.email.toLowerCase() === normalizedEmail
    );

    // 1. Unregistered Email Error Mechanism
    if (!matchedUser) {
      return {
        success: false,
        message: 'No account found with this email ID. Please check your email or click "Register Now" to create your free account.'
      };
    }

    // 2. Extra Admin Verification
    if (matchedUser.role === 'admin') {
      const isEmailAuthorized =
        AUTHORIZED_ADMIN_EMAILS.includes(cleanEmail) ||
        AUTHORIZED_ADMIN_EMAILS.includes(normalizedEmail);
      if (!isEmailAuthorized || password !== AUTHORIZED_ADMIN_PASSWORD) {
        return {
          success: false,
          message: 'Access Denied: Invalid administrator credentials.'
        };
      }
    }

    // 3. Incorrect Password Error Mechanism
    if (matchedUser.password && matchedUser.password !== password) {
      return {
        success: false,
        message: 'Incorrect password entered for this account. Please verify your password or use "Forgot Password".'
      };
    }

    // 4. Account Role Mismatch Warning
    if (role && matchedUser.role !== role) {
      return {
        success: false,
        message: `Account "${matchedUser.name}" is registered as a ${matchedUser.role.toUpperCase()} account. Please select the ${matchedUser.role.toUpperCase()} tab.`
      };
    }

    // 5. Automatic Removal Barrier: Block employers with 3+ reports or suspended
    if (matchedUser.role === 'employer' && (matchedUser.status === 'suspended' || (matchedUser.reportCount && matchedUser.reportCount >= 3))) {
      return {
        success: false,
        message: 'Account Suspended: This employer account was automatically removed from CampusFlex due to reaching 3 student safety reports.',
      };
    }

    // Successful Authentication
    set({ currentUser: matchedUser, isAuthenticated: true });
    return { success: true };
  },

  loginWithGoogle: async (
    email: string,
    name: string,
    avatar?: string,
    role?: UserRole,
    credentialToken?: string
  ): Promise<AuthLoginResponse> => {
    // If admin role is selected, verify Google email matches authorized admin
    if (role === 'admin') {
      const clean = email.trim().toLowerCase();
      const normalized = clean.includes('@') ? clean : `${clean}@gmail.com`;
      if (!AUTHORIZED_ADMIN_EMAILS.includes(clean) && !AUTHORIZED_ADMIN_EMAILS.includes(normalized)) {
        return {
          success: false,
          message: 'Access Denied: This Google account is not authorized for administrator access.',
        };
      }
    }

    try {
      const response = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          credential: credentialToken,
          email,
          name,
          avatar,
          role: role || 'student',
        }),
      });

      const data = await response.json();
      if (data.success && data.user) {
        set((state) => {
          const exists = state.usersList.some((u) => u.id === data.user.id);
          const updatedList = exists
            ? state.usersList.map((u) => (u.id === data.user.id ? data.user : u))
            : [...state.usersList, data.user];
          return {
            usersList: updatedList,
            currentUser: data.user,
            isAuthenticated: true,
          };
        });
        return { success: true, message: data.message };
      }
      return { success: false, message: data.error || 'Google authentication failed.' };
    } catch (err: any) {
      console.warn('Fallback to local state provision for Google login:', err);
      const cleanEmail = email.trim().toLowerCase();
      const existing = get().usersList.find((u) => u.email.toLowerCase() === cleanEmail);
      if (existing) {
        set({ currentUser: existing, isAuthenticated: true });
        return { success: true };
      }
      const isEmployer = role === 'employer';
      const googleUser: User = {
        id: isEmployer ? `user-employer-${Date.now()}` : `user-google-${Date.now()}`,
        name: name || (isEmployer ? 'Employer Partner' : 'Google User'),
        email: cleanEmail,
        authProvider: 'google',
        role: role || 'student',
        avatar: avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
        verified: !isEmployer, // Gatekeeper: employers must be approved by Super Admin
        department: 'Computer Science',
        year: 'Semester 1',
        skills: ['Problem Solving', 'Communication'],
        companyName: isEmployer ? (name || 'Registered Employer') : undefined,
        status: isEmployer ? 'pending' : 'active',
        reportCount: 0,
        reports: [],
        createdAt: new Date().toISOString(),
      };

      set((state) => ({
        usersList: [...state.usersList, googleUser],
        currentUser: googleUser,
        isAuthenticated: true,
      }));

      // When an employer signs up with Google, notify Super Admin immediately
      if (isEmployer) {
        useNotificationStore.getState().addNotification({
          userId: 'user-admin-1',
          title: `🏢 New Employer Registered: ${googleUser.companyName || googleUser.name}`,
          message: `${googleUser.name} registered via Google (${googleUser.email}). Super Admin verification is required before allowing them into the app to recruit students.`,
          type: 'system',
          link: `/admin/users?tab=pending&review=${googleUser.id}`,
        });

        fetch('/api/admin/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'register_employer',
            userId: googleUser.id,
            name: googleUser.name,
            email: googleUser.email,
            companyName: googleUser.companyName,
          }),
        }).catch(() => {});
      }

      return { success: true };
    }
  },

  logout: () => {
    set({ currentUser: null, isAuthenticated: false });
  },

  register: (userData: Partial<User>) => {
    const isEmployer = userData.role === 'employer';
    const newUser: User = {
      id: isEmployer ? `user-employer-${Date.now()}` : `user-${Date.now()}`,
      name: userData.name || (isEmployer ? 'Employer Partner' : 'New User'),
      email: (userData.email || 'user@campus.edu').toLowerCase().trim(),
      password: userData.password || 'password123',
      authProvider: 'credentials',
      role: userData.role || 'student',
      avatar: userData.avatar || (isEmployer
        ? 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=300&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80'),
      verified: !isEmployer, // Gatekeeper: employers require Super Admin verification
      department: userData.department || 'Computer Science',
      year: userData.year || 'Semester 1',
      skills: userData.skills || ['Communication', 'Teamwork'],
      companyName: userData.companyName || (isEmployer ? userData.name : undefined),
      companyLogo: userData.companyLogo || (isEmployer ? 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80' : undefined),
      companyDescription: userData.companyDescription || (isEmployer ? 'Campus recruitment partner seeking university student talent.' : undefined),
      businessRegistrationNumber: userData.businessRegistrationNumber || (isEmployer ? `REG-2026-${Math.floor(1000 + Math.random() * 9000)}` : undefined),
      taxId: userData.taxId,
      location: userData.location || 'Campus / Local Partner',
      phone: userData.phone || '+91 98765 00000',
      status: isEmployer ? 'pending' : 'active',
      reportCount: 0,
      reports: [],
      createdAt: new Date().toISOString(),
    };

    set((state) => ({
      usersList: [...state.usersList, newUser],
      currentUser: newUser,
      isAuthenticated: true,
    }));

    // If an employer registered, dispatch alert message to Super Admin
    if (isEmployer) {
      useNotificationStore.getState().addNotification({
        userId: 'user-admin-1',
        title: `🏢 New Employer Registered: ${newUser.companyName || newUser.name}`,
        message: `${newUser.name} (${newUser.companyName || 'New Company'}) has registered with email ${newUser.email}. Verification required before allowing them to enter the app and recruit students.`,
        type: 'system',
        link: `/admin/users?tab=pending&review=${newUser.id}`,
      });

      // Synchronize with Java Backend JDBC
      fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'register_employer',
          userId: newUser.id,
          name: newUser.name,
          email: newUser.email,
          companyName: newUser.companyName,
          regNumber: newUser.businessRegistrationNumber,
        }),
      }).catch(() => {});
    }
  },

  updateProfile: (updatedData: Partial<User>) => {
    set((state) => {
      if (!state.currentUser) return state;
      const updatedUser = { ...state.currentUser, ...updatedData };
      const updatedList = state.usersList.map((u) => (u.id === updatedUser.id ? updatedUser : u));
      return {
        currentUser: updatedUser,
        usersList: updatedList,
      };
    });
  },

  verifyEmployer: (employerId: string, allow: boolean) => {
    set((state) => {
      const updatedList = state.usersList.map((u) => {
        if (u.id === employerId) {
          return {
            ...u,
            verified: allow,
            status: allow ? ('active' as const) : ('suspended' as const),
          };
        }
        return u;
      });
      const currentUser = state.currentUser?.id === employerId
        ? {
            ...state.currentUser,
            verified: allow,
            status: allow ? ('active' as const) : ('suspended' as const),
          }
        : state.currentUser;

      return { usersList: updatedList, currentUser };
    });

    // Notify Employer of the Verification Decision
    const target = get().usersList.find((u) => u.id === employerId);
    useNotificationStore.getState().addNotification({
      userId: employerId,
      title: allow ? '🎉 Employer Account Verified!' : '⚠️ Employer Account Notice',
      message: allow
        ? `Super Admin Avani SL has verified ${target?.companyName || 'your company'}. You are now allowed to enter the app, post job positions, and hire university students.`
        : 'Your employer portal access has been revoked by the Super Admin.',
      type: 'system',
    });

    // Synchronize verification with Java Backend JDBC
    fetch('/api/admin/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: allow ? 'verify' : 'unverify',
        userId: employerId,
      }),
    }).catch(() => {});
  },

  reportEmployer: (
    employerId: string,
    studentId: string,
    studentName: string,
    studentEmail: string,
    reason: string,
    details?: string,
    jobId?: string,
    jobTitle?: string
  ) => {
    let isBanned = false;
    let finalCount = 0;
    let reportMessage = '';

    set((state) => {
      const targetEmployer = state.usersList.find((u) => u.id === employerId);
      if (!targetEmployer) return state;

      const existingReports = targetEmployer.reports || [];
      const alreadyReported = existingReports.some((r) => r.studentId === studentId);
      if (alreadyReported) {
        reportMessage = 'You have already submitted a report for this employer.';
        finalCount = targetEmployer.reportCount || existingReports.length;
        return state;
      }

      const newReport: EmployerReport = {
        id: `rep-${Date.now()}`,
        employerId,
        employerName: targetEmployer.companyName || targetEmployer.name,
        studentId,
        studentName,
        studentEmail,
        reason,
        details,
        jobId,
        jobTitle,
        createdAt: new Date().toISOString(),
      };

      const updatedReports = [...existingReports, newReport];
      finalCount = updatedReports.length;
      isBanned = finalCount >= 3;

      const updatedList = state.usersList.map((u) => {
        if (u.id === employerId) {
          return {
            ...u,
            reportCount: finalCount,
            reports: updatedReports,
            status: isBanned ? ('suspended' as const) : u.status,
            verified: isBanned ? false : u.verified,
          };
        }
        return u;
      });

      const currentUser = state.currentUser?.id === employerId
        ? {
            ...state.currentUser,
            reportCount: finalCount,
            reports: updatedReports,
            status: isBanned ? ('suspended' as const) : state.currentUser.status,
            verified: isBanned ? false : state.currentUser.verified,
          }
        : state.currentUser;

      // If employer reaches 3 reports, automatically suspend all their jobs!
      if (isBanned) {
        try {
          useJobStore.getState().suspendJobsByEmployer(employerId);
        } catch (e) {}
        reportMessage = `AUTOMATIC REMOVAL ENFORCED: Employer reached 3 student reports and has been automatically removed from CampusFlex.`;
      } else {
        reportMessage = `Report submitted successfully (${finalCount}/3). CampusFlex prioritizes student workplace safety.`;
      }

      return { usersList: updatedList, currentUser };
    });

    return {
      success: true,
      banned: isBanned,
      reportCount: finalCount,
      message: reportMessage || 'Report recorded.',
    };
  },

  toggleVerifyEmployer: (employerId: string) => {
    set((state) => {
      const updatedList = state.usersList.map((u) => {
        if (u.id === employerId) {
          return { ...u, verified: !u.verified };
        }
        return u;
      });
      const currentUser = state.currentUser?.id === employerId
        ? { ...state.currentUser, verified: !state.currentUser.verified }
        : state.currentUser;

      return { usersList: updatedList, currentUser };
    });
  },

  toggleVerifyUser: (userId: string) => {
    set((state) => {
      const updatedList = state.usersList.map((u) => {
        if (u.id === userId) {
          return { ...u, verified: !u.verified };
        }
        return u;
      });
      const currentUser = state.currentUser?.id === userId
        ? { ...state.currentUser, verified: !state.currentUser.verified }
        : state.currentUser;

      return { usersList: updatedList, currentUser };
    });
  },

  toggleUserStatus: (userId: string) => {
    set((state) => {
      const updatedList: User[] = state.usersList.map((u) => {
        if (u.id === userId) {
          const nextStatus: 'active' | 'suspended' = u.status === 'suspended' ? 'active' : 'suspended';
          return { ...u, status: nextStatus };
        }
        return u;
      });
      return { usersList: updatedList };
    });
  },

  deleteUser: (userId: string) => {
    set((state) => ({
      usersList: state.usersList.filter((u) => u.id !== userId)
    }));
  },
}));
