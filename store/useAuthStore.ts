import { create } from 'zustand';
import { User, UserRole } from '@/types';
import { MOCK_USERS } from '@/lib/mockData';

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
      const googleUser: User = {
        id: `user-google-${Date.now()}`,
        name: name || 'Google User',
        email: cleanEmail,
        authProvider: 'google',
        role: role || 'student',
        avatar: avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
        verified: true,
        department: 'Computer Science',
        year: 'Semester 1',
        skills: ['Problem Solving', 'Communication'],
        status: 'active',
        createdAt: new Date().toISOString(),
      };
      set((state) => ({
        usersList: [...state.usersList, googleUser],
        currentUser: googleUser,
        isAuthenticated: true,
      }));
      return { success: true };
    }
  },

  logout: () => {
    set({ currentUser: null, isAuthenticated: false });
  },

  register: (userData: Partial<User>) => {
    const newUser: User = {
      id: `user-${Date.now()}`,
      name: userData.name || 'New User',
      email: (userData.email || 'user@campus.edu').toLowerCase().trim(),
      password: userData.password || 'password123',
      authProvider: 'credentials',
      role: userData.role || 'student',
      avatar: userData.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
      verified: userData.role === 'student',
      department: userData.department || 'Computer Science',
      year: userData.year || 'Semester 1',
      skills: userData.skills || ['Communication', 'Teamwork'],
      companyName: userData.companyName,
      companyLogo: userData.companyLogo || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80',
      status: 'active',
      createdAt: new Date().toISOString(),
    };

    set((state) => ({
      usersList: [...state.usersList, newUser],
      currentUser: newUser,
      isAuthenticated: true,
    }));
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
