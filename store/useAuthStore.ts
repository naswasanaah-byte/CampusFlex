import { create } from 'zustand';
import { User, UserRole } from '@/types';
import { MOCK_USERS } from '@/lib/mockData';

interface AuthState {
  currentUser: User | null;
  usersList: User[];
  isAuthenticated: boolean;
  switchRole: (role: UserRole) => void;
  login: (email: string, role?: UserRole) => boolean;
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

  login: (email: string, role?: UserRole) => {
    const matched = get().usersList.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() || (role && u.role === role)
    );
    if (matched) {
      set({ currentUser: matched, isAuthenticated: true });
      return true;
    }
    // Create quick fallback user
    const newUser: User = {
      id: `user-${Date.now()}`,
      name: email.split('@')[0],
      email: email,
      role: role || 'student',
      verified: role === 'student',
      status: 'active',
      createdAt: new Date().toISOString(),
    };
    set((state) => ({
      usersList: [...state.usersList, newUser],
      currentUser: newUser,
      isAuthenticated: true,
    }));
    return true;
  },

  logout: () => {
    set({ currentUser: null, isAuthenticated: false });
  },

  register: (userData: Partial<User>) => {
    const newUser: User = {
      id: `user-${Date.now()}`,
      name: userData.name || 'New User',
      email: userData.email || 'user@campus.edu',
      role: userData.role || 'student',
      avatar: userData.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
      verified: userData.role === 'student',
      department: userData.department || 'General Studies',
      skills: userData.skills || ['Communication'],
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
