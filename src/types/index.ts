
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
  deadline?: string; // Added deadline field
}

export type UserRole = 'admin' | 'user';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
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
