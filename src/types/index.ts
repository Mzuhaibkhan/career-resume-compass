
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
}

export type UserRole = 'admin' | 'user';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}
