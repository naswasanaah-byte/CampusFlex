import { User, Job, Application, Notification, ChatMessage, EarningsRecord } from '@/types';

export const MOCK_USERS: User[] = [
  {
    id: 'user-student-1',
    name: 'Alex Rivera',
    email: 'alex.rivera@university.edu',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    verified: true,
    phone: '+1 (555) 234-5678',
    bio: 'Passionate Senior Computer Science student seeking flexible software engineering and web design part-time opportunities.',
    department: 'Computer Science',
    year: 'Senior (Year 4)',
    skills: ['React', 'JavaScript', 'TypeScript', 'Tailwind CSS', 'Python', 'Communication', 'UI Design'],
    gpa: 3.8,
    resumeUrl: 'alex_rivera_resume.pdf',
    location: 'Campus West / Hybrid',
    rating: 4.9,
    status: 'active',
    createdAt: '2026-01-15T08:00:00Z',
  },
  {
    id: 'user-student-2',
    name: 'Sarah Chen',
    email: 'sarah.chen@university.edu',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80',
    verified: true,
    phone: '+1 (555) 345-6789',
    bio: 'Business & Digital Marketing junior interested in social media, event coordination, and brand management.',
    department: 'Business Administration',
    year: 'Junior (Year 3)',
    skills: ['Social Media', 'Content Writing', 'Event Planning', 'Google Analytics', 'Communication'],
    gpa: 3.9,
    resumeUrl: 'sarah_chen_resume.pdf',
    location: 'Main Campus',
    rating: 5.0,
    status: 'active',
    createdAt: '2026-02-01T10:30:00Z',
  },
  {
    id: 'user-employer-1',
    name: 'TechCorp Innovation Hub',
    email: 'hiring@techcorp.com',
    role: 'employer',
    avatar: 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=300&auto=format&fit=crop&q=80',
    verified: true,
    companyName: 'TechCorp Innovations',
    companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80',
    companyDescription: 'Leading university incubator software firm providing flexible technical roles for top student talents.',
    location: 'Innovation Center, Room 402',
    phone: '+1 (555) 987-6543',
    rating: 4.8,
    status: 'active',
    createdAt: '2025-11-10T14:00:00Z',
  },
  {
    id: 'user-employer-2',
    name: 'Campus Dining Services',
    email: 'jobs@campusdining.edu',
    role: 'employer',
    avatar: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=300&auto=format&fit=crop&q=80',
    verified: true,
    companyName: 'University Dining & Events',
    companyLogo: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&auto=format&fit=crop&q=80',
    companyDescription: 'Official campus hospitality team organizing daily dining halls and high-profile university galas.',
    location: 'Student Union Hub',
    phone: '+1 (555) 876-5432',
    rating: 4.6,
    status: 'active',
    createdAt: '2025-10-05T09:15:00Z',
  },
  {
    id: 'user-admin-1',
    name: 'Campus Operations Admin',
    email: 'admin@campusflex.com',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&auto=format&fit=crop&q=80',
    verified: true,
    status: 'active',
    createdAt: '2025-01-01T00:00:00Z',
  }
];

export const MOCK_JOBS: Job[] = [
  {
    id: 'job-101',
    title: 'Frontend Web Developer Assistant',
    companyId: 'user-employer-1',
    companyName: 'TechCorp Innovations',
    companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80',
    department: 'Computer Science',
    location: 'Remote / Innovation Lab',
    workType: 'Part-Time',
    hourlyRate: 22.50,
    description: 'We are seeking an enthusiastic student frontend developer to assist in building modern React & Tailwind web apps for campus startup clients.',
    requirements: [
      'Experience with React, Next.js or HTML/CSS',
      'Available 10-15 hours per week',
      'Good team communication skills'
    ],
    skillsRequired: ['React', 'JavaScript', 'Tailwind CSS', 'TypeScript', 'UI Design'],
    requiredEmployees: 3,
    selectedEmployees: 1, // 1 selected, 2 slots left
    status: 'AVAILABLE',
    postedAt: '2026-07-28T10:00:00Z',
    deadline: '2026-08-20',
    featured: true,
    viewsCount: 245,
    applicationsCount: 8,
  },
  {
    id: 'job-102',
    title: 'Campus Social Media Coordinator',
    companyId: 'user-employer-1',
    companyName: 'TechCorp Innovations',
    companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80',
    department: 'Business Administration',
    location: 'Main Campus Building',
    workType: 'Flexible',
    hourlyRate: 18.00,
    description: 'Create engaging Instagram Reels, TikTok videos, and newsletter updates highlighting student startup success stories.',
    requirements: [
      'Proficiency with Canva or Adobe Suite',
      'Active social media presence',
      'Strong copywriting skills'
    ],
    skillsRequired: ['Social Media', 'Content Writing', 'Graphic Design', 'Communication'],
    requiredEmployees: 2,
    selectedEmployees: 2, // FILLED!
    status: 'FILLED',
    postedAt: '2026-07-20T14:30:00Z',
    deadline: '2026-08-10',
    featured: false,
    viewsCount: 310,
    applicationsCount: 12,
  },
  {
    id: 'job-103',
    title: 'Evening Event Catering Lead',
    companyId: 'user-employer-2',
    companyName: 'University Dining & Events',
    companyLogo: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&auto=format&fit=crop&q=80',
    department: 'Hospitality & Business',
    location: 'Grand Student Alumni Center',
    workType: 'Evening',
    hourlyRate: 19.50,
    description: 'Help manage evening banquet setup, guest reception, and dining service for campus events and speaker keynotes.',
    requirements: [
      'Evening availability on Thursdays & Fridays',
      'Punctual and customer-oriented attitude',
      'Ability to stand for 4-hour shifts'
    ],
    skillsRequired: ['Event Planning', 'Customer Service', 'Communication'],
    requiredEmployees: 5,
    selectedEmployees: 3, // 3 selected out of 5
    status: 'AVAILABLE',
    postedAt: '2026-08-01T09:00:00Z',
    deadline: '2026-08-25',
    featured: true,
    viewsCount: 180,
    applicationsCount: 6,
  },
  {
    id: 'job-104',
    title: 'AI Data Annotation Assistant',
    companyId: 'user-employer-1',
    companyName: 'TechCorp Innovations',
    companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80',
    department: 'Computer Science',
    location: 'Remote',
    workType: 'Remote',
    hourlyRate: 20.00,
    description: 'Review and tag datasets for machine learning research models. Work on your own flexible schedule.',
    requirements: [
      'Attention to detail',
      'Basic Python or data knowledge is a plus',
      'Must have own laptop'
    ],
    skillsRequired: ['Python', 'Attention to Detail', 'Data Entry'],
    requiredEmployees: 4,
    selectedEmployees: 0,
    status: 'AVAILABLE',
    postedAt: '2026-08-02T16:20:00Z',
    deadline: '2026-08-30',
    featured: false,
    viewsCount: 140,
    applicationsCount: 4,
  },
  {
    id: 'job-105',
    title: 'Weekend Library Operations Desk',
    companyId: 'user-employer-2',
    companyName: 'University Dining & Events',
    companyLogo: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&auto=format&fit=crop&q=80',
    department: 'General Studies',
    location: 'Central Library Hall',
    workType: 'Weekend',
    hourlyRate: 17.50,
    description: 'Assist library visitors with book checkouts, quiet study room reservations, and equipment rentals.',
    requirements: [
      'Saturday/Sunday shift availability',
      'Friendly interpersonal skills'
    ],
    skillsRequired: ['Communication', 'Customer Service', 'Organization'],
    requiredEmployees: 2,
    selectedEmployees: 0,
    status: 'AVAILABLE',
    postedAt: '2026-08-03T08:00:00Z',
    deadline: '2026-08-28',
    featured: false,
    viewsCount: 95,
    applicationsCount: 3,
  }
];

export const MOCK_APPLICATIONS: Application[] = [
  {
    id: 'app-001',
    jobId: 'job-101',
    studentId: 'user-student-1',
    studentName: 'Alex Rivera',
    studentAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    studentEmail: 'alex.rivera@university.edu',
    studentDepartment: 'Computer Science',
    jobTitle: 'Frontend Web Developer Assistant',
    companyName: 'TechCorp Innovations',
    status: 'INTERVIEW_SCHEDULED',
    appliedAt: '2026-07-29T11:20:00Z',
    matchPercentage: 96,
    matchReasons: [
      'Matches JavaScript & React required skills',
      'Matches Computer Science department criteria',
      'Matches Remote/Hybrid availability'
    ],
    coverLetter: 'I have built multiple Next.js & Tailwind CSS projects during my senior CS coursework. I am available 12 hours a week and excited to contribute!',
    availability: 'Mondays & Wednesdays (2 PM - 6 PM), Fridays (All Day)',
    interviewDate: '2026-08-06 at 2:00 PM',
    interviewLocation: 'Innovation Lab Room 204 (or Zoom link)'
  },
  {
    id: 'app-002',
    jobId: 'job-103',
    studentId: 'user-student-1',
    studentName: 'Alex Rivera',
    studentAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    studentEmail: 'alex.rivera@university.edu',
    studentDepartment: 'Computer Science',
    jobTitle: 'Evening Event Catering Lead',
    companyName: 'University Dining & Events',
    status: 'UNDER_REVIEW',
    appliedAt: '2026-08-01T15:00:00Z',
    matchPercentage: 78,
    matchReasons: [
      'Matches Evening Shift availability preference',
      'Strong campus communication history'
    ],
    coverLetter: 'Looking to earn extra part-time income during evening hours while helping host campus banquets.',
    availability: 'Thursdays & Fridays (5 PM - 10 PM)'
  },
  {
    id: 'app-003',
    jobId: 'job-102',
    studentId: 'user-student-2',
    studentName: 'Sarah Chen',
    studentAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80',
    studentEmail: 'sarah.chen@university.edu',
    studentDepartment: 'Business Administration',
    jobTitle: 'Campus Social Media Coordinator',
    companyName: 'TechCorp Innovations',
    status: 'ACCEPTED',
    appliedAt: '2026-07-21T09:30:00Z',
    matchPercentage: 98,
    matchReasons: [
      'Matches Social Media & Copywriting expertise',
      'Matches Business Administration department',
      'Exceptional candidate rating'
    ],
    coverLetter: 'I currently run our college business club Instagram page with over 5,000 active student followers!',
    availability: 'Flexible daytime hours'
  }
];

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif-1',
    userId: 'user-student-1',
    title: 'Interview Scheduled! 🎉',
    message: 'TechCorp Innovations scheduled an interview for Frontend Web Developer Assistant on Aug 6 at 2:00 PM.',
    type: 'interview',
    read: false,
    createdAt: '2026-08-02T14:00:00Z',
    link: '/student/applications'
  },
  {
    id: 'notif-2',
    userId: 'user-student-1',
    title: 'AI Smart Recommendation',
    message: 'New job "AI Data Annotation Assistant" matches 92% of your skill profile!',
    type: 'system',
    read: true,
    createdAt: '2026-08-02T16:30:00Z',
    link: '/jobs/job-104'
  },
  {
    id: 'notif-3',
    userId: 'user-employer-1',
    title: 'New Applicant Received',
    message: 'Alex Rivera applied for Frontend Web Developer Assistant with a 96% AI match score.',
    type: 'application',
    read: false,
    createdAt: '2026-07-29T11:20:00Z',
    link: '/employer/applicants'
  }
];

export const MOCK_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-1',
    conversationId: 'conv-alex-techcorp',
    senderId: 'user-employer-1',
    receiverId: 'user-student-1',
    senderName: 'TechCorp Innovations',
    senderRole: 'employer',
    message: 'Hi Alex! We reviewed your frontend application and portfolio. We were very impressed!',
    timestamp: '2026-08-02T13:45:00Z',
    read: true
  },
  {
    id: 'msg-2',
    conversationId: 'conv-alex-techcorp',
    senderId: 'user-student-1',
    receiverId: 'user-employer-1',
    senderName: 'Alex Rivera',
    senderRole: 'student',
    message: 'Thank you so much! I look forward to our interview on Thursday.',
    timestamp: '2026-08-02T13:50:00Z',
    read: true
  },
  {
    id: 'msg-3',
    conversationId: 'conv-alex-techcorp',
    senderId: 'user-employer-1',
    receiverId: 'user-student-1',
    senderName: 'TechCorp Innovations',
    senderRole: 'employer',
    message: 'Great! Please bring your campus ID card or digital work ID QR code.',
    timestamp: '2026-08-02T14:02:00Z',
    read: false
  }
];

export const MOCK_EARNINGS: EarningsRecord[] = [
  {
    id: 'earn-1',
    studentId: 'user-student-1',
    jobTitle: 'UI Design Specialist (Summer)',
    companyName: 'TechCorp Innovations',
    hoursWorked: 32,
    hourlyRate: 22.50,
    totalAmount: 720.00,
    date: '2026-07-30',
    status: 'PAID'
  },
  {
    id: 'earn-2',
    studentId: 'user-student-1',
    jobTitle: 'Campus Hackathon Assistant',
    companyName: 'University Dining & Events',
    hoursWorked: 15,
    hourlyRate: 19.50,
    totalAmount: 292.50,
    date: '2026-07-15',
    status: 'PAID'
  },
  {
    id: 'earn-3',
    studentId: 'user-student-1',
    jobTitle: 'Frontend Lab Shift',
    companyName: 'TechCorp Innovations',
    hoursWorked: 12,
    hourlyRate: 22.50,
    totalAmount: 270.00,
    date: '2026-08-02',
    status: 'PROCESSING'
  }
];
