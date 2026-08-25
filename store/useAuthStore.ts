import { create } from 'zustand';
import { User, UserRole } from '@/types';
import { MOCK_USERS } from '@/lib/mockData';

export interface AuthLoginResponse {
  success: boolean;
  message?: string;
}

interface AuthState {
  currentUser: User | null;
  usersList: User[];
  isAuthenticated: boolean;
  switchRole: (role: UserRole) => void;
  login: (email: string, password?: string, role?: UserRole) => AuthLoginResponse;
  logout: () => void;
  register: (user: Partial<User>) => void;
  updateProfile: (updatedData: Partial<User>) => void;
  toggleVerifyEmployer: (employerId: string) => void;
  toggleUserStatus: (userId: string) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  currentUser: null,
  usersList: MOCK_USERS,
  isAuthenticated: false,

  switchRole: (role: UserRole) => {
    const found = get().usersList.find((u) => u.role === role);
    if (found) {
      set({ currentUser: found, isAuthenticated: true });
    }
  },

  login: (email: string, password?: string, role?: UserRole): AuthLoginResponse => {
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      return { success: false, message: 'Please enter your email address.' };
    }

    if (!password || password.length < 4) {
      return { success: false, message: 'Password must be at least 4 characters.' };
    }

    // Search for registered user account
    const matchedUser = get().usersList.find(
      (u) => u.email.toLowerCase() === cleanEmail
    );

    // 1. Unregistered Email Error Mechanism
    if (!matchedUser) {
      return {
        success: false,
        message: 'No account found with this email ID. Please check your email or click "Register Now" to create your free account.'
      };
    }

    // 2. Incorrect Password Error Mechanism
    if (matchedUser.password && matchedUser.password !== password) {
      return {
        success: false,
        message: 'Incorrect password entered for this account. Please verify your password or use "Forgot Password".'
      };
    }

    // 3. Account Role Mismatch Warning
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

  logout: () => {
    set({ currentUser: null, isAuthenticated: false });
  },

  register: (userData: Partial<User>) => {
    const newUser: User = {
      id: `user-${Date.now()}`,
      name: userData.name || 'New User',
      email: (userData.email || 'user@campus.edu').toLowerCase().trim(),
      password: userData.password || 'password123',
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
}));
