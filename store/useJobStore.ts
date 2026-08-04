import { create } from 'zustand';
import { Job, JobStatus, WorkType } from '@/types';
import { MOCK_JOBS } from '@/lib/mockData';

interface JobFilters {
  searchQuery: string;
  department: string;
  workType: string;
  status: string;
  minSalary: number;
}

interface JobState {
  jobs: Job[];
  savedJobIds: string[];
  filters: JobFilters;
  searchHistory: string[];
  setSearchQuery: (query: string) => void;
  setFilter: (key: keyof JobFilters, value: any) => void;
  resetFilters: () => void;
  toggleSaveJob: (jobId: string) => void;
  addJob: (newJobData: Omit<Job, 'id' | 'postedAt' | 'selectedEmployees' | 'status' | 'applicationsCount' | 'viewsCount'>) => Job;
  updateJob: (jobId: string, updatedData: Partial<Job>) => void;
  deleteJob: (jobId: string) => void;
  incrementSelectedSlot: (jobId: string) => JobStatus; // Returns new status
  addSearchHistory: (query: string) => void;
  clearSearchHistory: () => void;
}

const initialFilters: JobFilters = {
  searchQuery: '',
  department: 'All Departments',
  workType: 'All Types',
  status: 'ALL',
  minSalary: 0,
};

export const useJobStore = create<JobState>((set, get) => ({
  jobs: MOCK_JOBS,
  savedJobIds: ['job-101'],
  filters: initialFilters,
  searchHistory: ['React developer', 'Catering', 'Remote Python'],

  setSearchQuery: (query: string) => {
    set((state) => ({
      filters: { ...state.filters, searchQuery: query },
    }));
  },

  setFilter: (key, value) => {
    set((state) => ({
      filters: { ...state.filters, [key]: value },
    }));
  },

  resetFilters: () => {
    set({ filters: initialFilters });
  },

  toggleSaveJob: (jobId: string) => {
    set((state) => {
      const exists = state.savedJobIds.includes(jobId);
      const newSaved = exists
        ? state.savedJobIds.filter((id) => id !== jobId)
        : [...state.savedJobIds, jobId];
      return { savedJobIds: newSaved };
    });
  },

  addJob: (jobData) => {
    const newJob: Job = {
      ...jobData,
      id: `job-${Date.now()}`,
      postedAt: new Date().toISOString(),
      selectedEmployees: 0,
      status: 'AVAILABLE',
      applicationsCount: 0,
      viewsCount: 1,
    };
    set((state) => ({
      jobs: [newJob, ...state.jobs],
    }));
    return newJob;
  },

  updateJob: (jobId: string, updatedData: Partial<Job>) => {
    set((state) => ({
      jobs: state.jobs.map((job) => (job.id === jobId ? { ...job, ...updatedData } : job)),
    }));
  },

  deleteJob: (jobId: string) => {
    set((state) => ({
      jobs: state.jobs.filter((job) => job.id !== jobId),
    }));
  },

  incrementSelectedSlot: (jobId: string): JobStatus => {
    let finalStatus: JobStatus = 'AVAILABLE';
    set((state) => {
      const updatedJobs = state.jobs.map((job) => {
        if (job.id === jobId) {
          const nextSelected = job.selectedEmployees + 1;
          const isFilled = nextSelected >= job.requiredEmployees;
          finalStatus = isFilled ? 'FILLED' : 'AVAILABLE';
          return {
            ...job,
            selectedEmployees: nextSelected,
            status: finalStatus,
          };
        }
        return job;
      });
      return { jobs: updatedJobs };
    });
    return finalStatus;
  },

  addSearchHistory: (query: string) => {
    if (!query.trim()) return;
    set((state) => {
      const filtered = state.searchHistory.filter((q) => q.toLowerCase() !== query.toLowerCase());
      return { searchHistory: [query, ...filtered].slice(0, 8) };
    });
  },

  clearSearchHistory: () => {
    set({ searchHistory: [] });
  },
}));
