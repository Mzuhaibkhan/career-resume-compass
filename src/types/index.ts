export interface JobRequirement {
    id: string;
    title: string;
    description: string;
    company: string;
    locationType: 'remote' | 'on-site' | 'hybrid';
    location?: string;
    employmentType: 'full-time' | 'part-time' | 'contract' | 'temporary' | 'volunteer' | 'internship';
    experienceLevel: 'entry' | 'mid' | 'senior' | 'expert';
    requiredSkills: { name: string }[];
    salary?: {
        min: number;
        max: number;
        currency: string;
    };
    deadline?: string;
    createdAt: string;
}

export interface Resume {
    id: string;
    name: string;
    jobTitle: string;
    experienceYears: number;
    skills: string[];
    education: string;
    score?: number;
    createdAt: string;
    updatedAt: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  profilePhoto?: string;
  linkedin?: string;
  github?: string;
  address?: string;
  experienceLevel?: string;
  skills?: string[];
  education?: Education[];
  extraActivities?: string[];
  employmentStatus?: 'employed' | 'unemployed';
}

export interface Education {
  degree: string;
  institution: string;
  year: string;
}

export interface JobApplication {
    id: string;
    jobId: string;
    userId: string;
    resumeId: string;
    appliedDate: string;
    status: 'applied' | 'reviewed' | 'rejected' | 'shortlisted' | 'hired';
    coverLetter?: string;
}
