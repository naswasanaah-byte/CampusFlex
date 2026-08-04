import { create } from 'zustand';
import { Application, ApplicationStatus } from '@/types';
import { MOCK_APPLICATIONS } from '@/lib/mockData';
import { useJobStore } from './useJobStore';
import { useNotificationStore } from './useNotificationStore';

interface ApplicationState {
  applications: Application[];
  applyForJob: (
    jobId: string,
    jobTitle: string,
    companyName: string,
    studentId: string,
    studentName: string,
    studentAvatar: string,
    studentEmail: string,
    studentDepartment: string,
    coverLetter: string,
    availability: string,
    matchPercentage: number,
    matchReasons: string[]
  ) => boolean;

  acceptApplication: (applicationId: string) => void;
  rejectApplication: (applicationId: string, reason?: string) => void;
  scheduleInterview: (applicationId: string, date: string, location: string) => void;
}

export const useApplicationStore = create<ApplicationState>((set, get) => ({
  applications: MOCK_APPLICATIONS,

  applyForJob: (
    jobId,
    jobTitle,
    companyName,
    studentId,
    studentName,
    studentAvatar,
    studentEmail,
    studentDepartment,
    coverLetter,
    availability,
    matchPercentage,
    matchReasons
  ) => {
    // Check if already applied
    const existing = get().applications.find(
      (a) => a.jobId === jobId && a.studentId === studentId
    );
    if (existing) return false;

    const newApp: Application = {
      id: `app-${Date.now()}`,
      jobId,
      studentId,
      studentName,
      studentAvatar,
      studentEmail,
      studentDepartment,
      jobTitle,
      companyName,
      status: 'PENDING',
      appliedAt: new Date().toISOString(),
      matchPercentage,
      matchReasons,
      coverLetter,
      availability,
    };

    set((state) => ({
      applications: [newApp, ...state.applications],
    }));

    // Notify Employer
    useNotificationStore.getState().addNotification({
      userId: 'user-employer-1',
      title: 'New Candidate Applied',
      message: `${studentName} applied for ${jobTitle} (${matchPercentage}% AI Match).`,
      type: 'application',
      link: '/employer/applicants',
    });

    return true;
  },

  acceptApplication: (applicationId: string) => {
    const targetApp = get().applications.find((a) => a.id === applicationId);
    if (!targetApp) return;

    // 1. Mark target application as ACCEPTED
    set((state) => ({
      applications: state.applications.map((app) =>
        app.id === applicationId ? { ...app, status: 'ACCEPTED' as ApplicationStatus } : app
      ),
    }));

    // 2. Notify Student of acceptance
    useNotificationStore.getState().addNotification({
      userId: targetApp.studentId,
      title: 'Congratulations! You are Hired! 🎉',
      message: `Your application for "${targetApp.jobTitle}" at ${targetApp.companyName} was ACCEPTED!`,
      type: 'application',
      link: '/student/applications',
    });

    // 3. Increment Selected Employees in Job Store & check if Filled
    const newStatus = useJobStore.getState().incrementSelectedSlot(targetApp.jobId);

    // 4. SMART JOB AUTO-CLOSE: If Job is now FILLED, auto-reject remaining applicants!
    if (newStatus === 'FILLED') {
      const remainingApps = get().applications.filter(
        (app) => app.jobId === targetApp.jobId && app.id !== applicationId && app.status !== 'ACCEPTED'
      );

      // Batch update remaining applications to REJECTED
      set((state) => ({
        applications: state.applications.map((app) => {
          if (app.jobId === targetApp.jobId && app.id !== applicationId && app.status !== 'ACCEPTED') {
            return {
              ...app,
              status: 'REJECTED' as ApplicationStatus,
              rejectionReason: 'This position has already been filled.',
            };
          }
          return app;
        }),
      }));

      // Notify each auto-rejected student
      remainingApps.forEach((rejectedApp) => {
        useNotificationStore.getState().addNotification({
          userId: rejectedApp.studentId,
          title: 'Position Filled',
          message: `The position "${rejectedApp.jobTitle}" at ${rejectedApp.companyName} has been filled. Thank you for applying.`,
          type: 'smart_close',
          link: '/student/applications',
        });
      });
    }
  },

  rejectApplication: (applicationId: string, reason?: string) => {
    const targetApp = get().applications.find((a) => a.id === applicationId);
    if (!targetApp) return;

    set((state) => ({
      applications: state.applications.map((app) =>
        app.id === applicationId
          ? {
              ...app,
              status: 'REJECTED' as ApplicationStatus,
              rejectionReason: reason || 'Application reviewed by employer.',
            }
          : app
      ),
    }));

    useNotificationStore.getState().addNotification({
      userId: targetApp.studentId,
      title: 'Application Update',
      message: `Your application status for "${targetApp.jobTitle}" at ${targetApp.companyName} has been updated.`,
      type: 'application',
      link: '/student/applications',
    });
  },

  scheduleInterview: (applicationId: string, date: string, location: string) => {
    const targetApp = get().applications.find((a) => a.id === applicationId);
    if (!targetApp) return;

    set((state) => ({
      applications: state.applications.map((app) =>
        app.id === applicationId
          ? {
              ...app,
              status: 'INTERVIEW_SCHEDULED' as ApplicationStatus,
              interviewDate: date,
              interviewLocation: location,
            }
          : app
      ),
    }));

    useNotificationStore.getState().addNotification({
      userId: targetApp.studentId,
      title: 'Interview Scheduled! 📅',
      message: `${targetApp.companyName} scheduled an interview for "${targetApp.jobTitle}" on ${date} (${location}).`,
      type: 'interview',
      link: '/student/applications',
    });
  },
}));
