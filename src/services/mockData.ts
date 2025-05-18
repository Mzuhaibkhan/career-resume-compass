
import { Resume, Skill, JobRequirement } from "../types";

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
  },
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

export const getSkillCategories = (): string[] => {
  const categories = new Set<string>();
  mockSkills.forEach(skill => categories.add(skill.category));
  return Array.from(categories);
};

export const getSkillsByCategory = (category: string): Skill[] => {
  return mockSkills.filter(skill => skill.category === category);
};
