import { Resume, Skill, JobRequirement, JobFilters } from "../types";

export const mockSkills: Skill[] = [
  { name: "React", category: "Frontend", weight: 5 },
  { name: "TypeScript", category: "Frontend", weight: 4 },
  { name: "Python", category: "Backend", weight: 5 },
  { name: "Node.js", category: "Backend", weight: 4 },
  { name: "MongoDB", category: "Database", weight: 3 },
  { name: "PostgreSQL", category: "Database", weight: 4 },
  { name: "AWS", category: "Cloud", weight: 4 },
  { name: "Docker", category: "DevOps", weight: 3 },
  { name: "Kubernetes", category: "DevOps", weight: 4 },
  { name: "Git", category: "Tools", weight: 3 },
  { name: "CI/CD", category: "DevOps", weight: 3 },
  { name: "Redux", category: "Frontend", weight: 3 },
  { name: "REST API", category: "Backend", weight: 4 },
  { name: "GraphQL", category: "Backend", weight: 3 },
  { name: "Jest", category: "Testing", weight: 3 },
];

export const mockResumes: Resume[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@example.com",
    filename: "john_doe_resume.pdf",
    uploadDate: new Date(2023, 5, 15).toISOString(),
    skills: [
      { name: "React", category: "Frontend", weight: 5 },
      { name: "TypeScript", category: "Frontend", weight: 4 },
      { name: "Node.js", category: "Backend", weight: 4 },
      { name: "MongoDB", category: "Database", weight: 3 },
    ],
    score: 85,
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    filename: "jane_smith_resume.pdf",
    uploadDate: new Date(2023, 6, 2).toISOString(),
    skills: [
      { name: "Python", category: "Backend", weight: 5 },
      { name: "PostgreSQL", category: "Database", weight: 4 },
      { name: "AWS", category: "Cloud", weight: 4 },
      { name: "Docker", category: "DevOps", weight: 3 },
    ],
    score: 78,
  },
  {
    id: "3",
    name: "Alex Johnson",
    email: "alex.johnson@example.com",
    filename: "alex_johnson_resume.pdf",
    uploadDate: new Date(2023, 6, 10).toISOString(),
    skills: [
      { name: "React", category: "Frontend", weight: 5 },
      { name: "Redux", category: "Frontend", weight: 3 },
      { name: "JavaScript", category: "Frontend", weight: 5 },
      { name: "Git", category: "Tools", weight: 3 },
    ],
    score: 72,
  },
  {
    id: "4",
    name: "Sarah Williams",
    email: "sarah.williams@example.com",
    filename: "sarah_williams_resume.pdf",
    uploadDate: new Date(2023, 7, 5).toISOString(),
    skills: [
      { name: "Python", category: "Backend", weight: 5 },
      { name: "Django", category: "Backend", weight: 4 },
      { name: "PostgreSQL", category: "Database", weight: 4 },
      { name: "AWS", category: "Cloud", weight: 4 },
    ],
    score: 92,
  },
];

export const mockJobRequirements: JobRequirement[] = [
  {
    id: "1",
    title: "Frontend Developer",
    description: "We are looking for a skilled Frontend Developer with experience in React and TypeScript.",
    requiredSkills: [
      { name: "React", category: "Frontend", weight: 5 },
      { name: "TypeScript", category: "Frontend", weight: 4 },
      { name: "Redux", category: "Frontend", weight: 3 },
      { name: "Jest", category: "Testing", weight: 3 },
    ],
    createdAt: new Date(2023, 5, 10).toISOString(),
    salary: {
      min: 80000,
      max: 110000,
      currency: "USD"
    },
    employmentType: "full-time",
    locationType: "hybrid",
    experienceLevel: "mid",
    location: "New York, NY"
  },
  {
    id: "2",
    title: "Backend Developer",
    description: "Looking for a Backend Developer proficient in Python and database management.",
    requiredSkills: [
      { name: "Python", category: "Backend", weight: 5 },
      { name: "PostgreSQL", category: "Database", weight: 4 },
      { name: "REST API", category: "Backend", weight: 4 },
      { name: "Docker", category: "DevOps", weight: 3 },
    ],
    createdAt: new Date(2023, 6, 1).toISOString(),
    salary: {
      min: 90000,
      max: 130000,
      currency: "USD"
    },
    employmentType: "full-time",
    locationType: "remote",
    experienceLevel: "senior",
    location: "Remote (US)"
  },
  {
    id: "3",
    title: "Junior React Developer",
    description: "Great opportunity for junior developers to gain experience working with React.",
    requiredSkills: [
      { name: "React", category: "Frontend", weight: 3 },
      { name: "JavaScript", category: "Frontend", weight: 4 },
      { name: "HTML/CSS", category: "Frontend", weight: 3 },
    ],
    createdAt: new Date(2023, 7, 15).toISOString(),
    salary: {
      min: 60000,
      max: 75000,
      currency: "USD"
    },
    employmentType: "full-time",
    locationType: "on-site",
    experienceLevel: "entry",
    location: "Austin, TX"
  },
  {
    id: "4",
    title: "DevOps Engineer (Contract)",
    description: "6-month contract position for an experienced DevOps engineer.",
    requiredSkills: [
      { name: "Docker", category: "DevOps", weight: 4 },
      { name: "Kubernetes", category: "DevOps", weight: 5 },
      { name: "AWS", category: "Cloud", weight: 4 },
      { name: "CI/CD", category: "DevOps", weight: 4 },
    ],
    createdAt: new Date(2023, 8, 5).toISOString(),
    salary: {
      min: 100,
      max: 150,
      currency: "USD/hr"
    },
    employmentType: "contract",
    locationType: "remote",
    experienceLevel: "senior",
    location: "Remote (Global)"
  },
  {
    id: "5",
    title: "UX/UI Designer Intern",
    description: "Internship opportunity for aspiring UX/UI designers to work on real-world projects.",
    requiredSkills: [
      { name: "Figma", category: "Design", weight: 3 },
      { name: "UI Design", category: "Design", weight: 3 },
      { name: "Prototyping", category: "Design", weight: 2 },
    ],
    createdAt: new Date(2023, 9, 1).toISOString(),
    salary: {
      min: 25,
      max: 30,
      currency: "USD/hr"
    },
    employmentType: "internship",
    locationType: "hybrid",
    experienceLevel: "entry",
    location: "San Francisco, CA"
  }
];

// Mock API functions
export const fetchResumes = (): Promise<Resume[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockResumes);
    }, 800);
  });
};

export const fetchJobRequirements = (): Promise<JobRequirement[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockJobRequirements);
    }, 800);
  });
};

export const uploadResume = (file: File): Promise<Resume> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulate processing and skill extraction
      const newResume: Resume = {
        id: Math.random().toString(36).substring(2, 11),
        name: "New Candidate",
        email: "candidate@example.com",
        filename: file.name,
        uploadDate: new Date().toISOString(),
        skills: [
          mockSkills[Math.floor(Math.random() * mockSkills.length)],
          mockSkills[Math.floor(Math.random() * mockSkills.length)],
          mockSkills[Math.floor(Math.random() * mockSkills.length)],
        ],
        score: Math.floor(Math.random() * 30) + 70, // Random score between 70-100
      };
      mockResumes.push(newResume);
      resolve(newResume);
    }, 1500);
  });
};

export const createJobRequirement = (jobReq: Omit<JobRequirement, "id" | "createdAt">): Promise<JobRequirement> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newJobReq: JobRequirement = {
        ...jobReq,
        id: Math.random().toString(36).substring(2, 11),
        createdAt: new Date().toISOString(),
      };
      mockJobRequirements.push(newJobReq);
      resolve(newJobReq);
    }, 800);
  });
};

export const analyzeResumeWithJob = (resumeId: string, jobId: string): Promise<number> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const score = Math.floor(Math.random() * 30) + 70; // Random score between 70-100
      const resumeIndex = mockResumes.findIndex(r => r.id === resumeId);
      if (resumeIndex !== -1) {
        mockResumes[resumeIndex].score = score;
      }
      resolve(score);
    }, 1000);
  });
};

// New API function to simulate applying for a job
export const applyForJob = (jobId: string, userId: string): Promise<{ success: boolean; message: string }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Just simulate success for now
      resolve({ 
        success: true, 
        message: "Application submitted successfully!"
      });
    }, 1000);
  });
};

// Filter jobs based on criteria
export const filterJobs = (jobs: JobRequirement[], filters: JobFilters): JobRequirement[] => {
  return jobs.filter(job => {
    // Filter by salary if range is provided
    if (filters.salary && job.salary) {
      if (job.salary.min < filters.salary.min || job.salary.max > filters.salary.max) {
        return false;
      }
    }
    
    // Filter by employment type
    if (filters.employmentType && filters.employmentType.length > 0 && job.employmentType) {
      if (!filters.employmentType.includes(job.employmentType)) {
        return false;
      }
    }
    
    // Filter by location type
    if (filters.locationType && filters.locationType.length > 0 && job.locationType) {
      if (!filters.locationType.includes(job.locationType)) {
        return false;
      }
    }
    
    // Filter by experience level
    if (filters.experienceLevel && filters.experienceLevel.length > 0 && job.experienceLevel) {
      if (!filters.experienceLevel.includes(job.experienceLevel)) {
        return false;
      }
    }
    
    return true;
  });
};

export const getSkillCategories = (): string[] => {
  const categories = new Set<string>();
  mockSkills.forEach(skill => categories.add(skill.category));
  return Array.from(categories);
};

export const getSkillsByCategory = (category: string): Skill[] => {
  return mockSkills.filter(skill => skill.category === category);
};
