
export interface Resume {
  id: string;
  name: string;
  email: string;
  filename: string;
  uploadDate: string;
  skills: Skill[];
  score?: number;
}

export interface Skill {
  name: string;
  category: string;
  weight: number;
}

export interface JobRequirement {
  id: string;
  title: string;
  description: string;
  requiredSkills: Skill[];
  createdAt: string;
  salary?: {
    min: number;
    max: number;
    currency: string;
  };
  employmentType?: 'full-time' | 'part-time' | 'contract' | 'internship';
  locationType?: 'remote' | 'on-site' | 'hybrid';
  experienceLevel?: 'entry' | 'mid' | 'senior' | 'lead';
  location?: string;
  deadline?: string;
}

export type UserRole = 'admin' | 'user';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  profilePhoto?: string;
  linkedin?: string;
  github?: string;
  otherProfiles?: { [key: string]: string };
  address?: string;
  experienceLevel?: string;
  skills?: Skill[];
  education?: Education[];
  extraActivities?: string[];
  employmentStatus?: 'employed' | 'unemployed' | 'student';
  currentEmployer?: string;
}

export interface Education {
  degree: string;
  institution: string;
  graduationYear: number;
  fieldOfStudy: string;
  proofId?: string;
}

export interface JobFilters {
  salary?: {
    min: number;
    max: number;
  };
  employmentType?: string[];
  locationType?: string[];
  experienceLevel?: string[];
}

export interface JobApplication {
  id: string;
  jobId: string;
  userId: string;
  resumeId: string;
  appliedDate: string;
  status: 'applied' | 'reviewed' | 'rejected' | 'shortlisted' | 'hired';
  feedback?: string;
  interviewDate?: string;
}
