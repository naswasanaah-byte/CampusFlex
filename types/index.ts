export type UserRole = 'student' | 'employer' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  verified?: boolean;
  phone?: string;
  bio?: string;
  department?: string;
  year?: string;
  skills?: string[];
  gpa?: number;
  resumeUrl?: string;
  companyName?: string;
  companyLogo?: string;
  companyDescription?: string;
  location?: string;
  rating?: number;
  status?: 'active' | 'suspended';
  createdAt: string;
}

export type JobStatus = 'AVAILABLE' | 'FILLED';
export type WorkType = 'Part-Time' | 'Weekend' | 'Evening' | 'Remote' | 'Flexible' | 'On-Campus';

export interface Job {
  id: string;
  title: string;
  companyId: string;
  companyName: string;
  companyLogo: string;
  department: string;
  location: string;
  workType: WorkType;
  hourlyRate: number;
  description: string;
  requirements: string[];
  skillsRequired: string[];
  requiredEmployees: number;
  selectedEmployees: number;
  status: JobStatus;
  postedAt: string;
  deadline: string;
  featured?: boolean;
  viewsCount?: number;
  applicationsCount?: number;
}

export type ApplicationStatus = 'PENDING' | 'UNDER_REVIEW' | 'INTERVIEW_SCHEDULED' | 'ACCEPTED' | 'REJECTED';

export interface Application {
  id: string;
  jobId: string;
  studentId: string;
  studentName: string;
  studentAvatar: string;
  studentEmail: string;
  studentDepartment?: string;
  jobTitle: string;
  companyName: string;
  status: ApplicationStatus;
  appliedAt: string;
  matchPercentage: number;
  matchReasons: string[];
  coverLetter: string;
  availability: string;
  interviewDate?: string;
  interviewLocation?: string;
  rejectionReason?: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'application' | 'interview' | 'smart_close' | 'system' | 'message';
  read: boolean;
  createdAt: string;
  link?: string;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  receiverId: string;
  senderName: string;
  senderRole: UserRole;
  message: string;
  timestamp: string;
  read: boolean;
}

export interface EarningsRecord {
  id: string;
  studentId: string;
  jobTitle: string;
  companyName: string;
  hoursWorked: number;
  hourlyRate: number;
  totalAmount: number;
  date: string;
  status: 'PAID' | 'PROCESSING';
}
