import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { fetchJobRequirements, updateApplicationStatus, fetchUserResumes } from '@/services/mockData';
import { JobRequirement } from '@/types';
import JobDetailsDialog from '@/components/JobDetailsDialog';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileUp, Search, Filter } from 'lucide-react';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';

interface JobApplicant {
  id: string;
  jobId: string;
  resumeId: string;
  status: 'applied' | 'reviewed' | 'rejected' | 'shortlisted' | 'hired';
  appliedDate: string;
  resume: {
    name: string;
    email: string;
    skills: { name: string; category: string }[];
    score?: number;
  };
}

const Admin = () => {
  const [jobs, setJobs] = useState<JobRequirement[]>([]);
  const [selectedJob, setSelectedJob] = useState<JobRequirement | null>(null);
  const [showJobDetails, setShowJobDetails] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  // Added state for resume uploads
  const [showResumeUpload, setShowResumeUpload] = useState(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [candidateName, setCandidateName] = useState('');
  const [candidateEmail, setCandidateEmail] = useState('');
  const [uploadingResume, setUploadingResume] = useState(false);
  const [selectedJobForUpload, setSelectedJobForUpload] = useState<string>('');
  const [matchedResumes, setMatchedResumes] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredResumes, setFilteredResumes] = useState<any[]>([]);

  // Mock applicants data
  const [applicants, setApplicants] = useState<JobApplicant[]>([]);
  
  // Mock interface for resume matching data
  interface JobApplicant {
    id: string;
    jobId: string;
    resumeId: string;
    status: 'applied' | 'reviewed' | 'rejected' | 'shortlisted' | 'hired';
    appliedDate: string;
    resume: {
      name: string;
      email: string;
      skills: { name: string; category: string }[];
      score?: number;
    };
  }

  useEffect(() => {
    const loadJobs = async () => {
      setLoading(true);
      try {
        const jobsData = await fetchJobRequirements();
        setJobs(jobsData);
        
        // Generate mock applicants for the jobs
        const mockApplicants: JobApplicant[] = [];
        const statuses: ('applied' | 'reviewed' | 'rejected' | 'shortlisted' | 'hired')[] = 
          ['applied', 'reviewed', 'applied', 'applied', 'reviewed'];
        
        jobsData.forEach((job, jobIndex) => {
          // Add 2-4 applicants per job
          const numApplicants = Math.floor(Math.random() * 3) + 2;
          
          for (let i = 0; i < numApplicants; i++) {
            mockApplicants.push({
              id: `app-${jobIndex}-${i}`,
              jobId: job.id,
              resumeId: `resume-${i}`,
              status: statuses[Math.floor(Math.random() * statuses.length)],
              appliedDate: new Date(Date.now() - Math.random() * 14 * 24 * 60 * 60 * 1000).toISOString(),
              resume: {
                name: `Applicant ${i + 1} for ${job.title}`,
                email: `applicant${i}@example.com`,
                skills: job.requiredSkills.slice(0, Math.floor(Math.random() * job.requiredSkills.length) + 1),
                score: Math.floor(Math.random() * 40) + 60
              }
            });
          }
        });
        
        setApplicants(mockApplicants);
        
        // Generate mock resume matches
        const mockResumes = [];
        for (let i = 0; i < 8; i++) {
          mockResumes.push({
            id: `resume-${i}`,
            name: `Candidate ${i + 1}`,
            email: `candidate${i}@example.com`,
            uploadDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
            score: Math.floor(Math.random() * 40) + 60,
            matchingSkills: Math.floor(Math.random() * 5) + 1,
            totalSkills: Math.floor(Math.random() * 5) + 7
          });
        }
        mockResumes.sort((a: any, b: any) => b.score - a.score);
        setMatchedResumes(mockResumes);
        setFilteredResumes(mockResumes);
        
      } catch (error) {
        console.error('Error loading jobs:', error);
        toast({
          title: 'Error',
          description: 'Failed to load job data',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    loadJobs();
  }, [toast]);

  const handleViewJobDetails = (job: JobRequirement) => {
    setSelectedJob(job);
    setShowJobDetails(true);
  };
  
  const handleUpdateStatus = async (applicationId: string, newStatus: 'applied' | 'reviewed' | 'rejected' | 'shortlisted' | 'hired') => {
    try {
      await updateApplicationStatus(applicationId, newStatus);
      
      // Update local state
      setApplicants(prevApplicants => 
        prevApplicants.map(app => 
          app.id === applicationId ? { ...app, status: newStatus } : app
        )
      );
      
      toast({
        title: 'Status Updated',
        description: `Applicant status changed to ${newStatus}`,
      });
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update applicant status',
        variant: 'destructive',
      });
    }
  };

  const getJobApplicants = (jobId: string) => {
    return applicants.filter(app => app.jobId === jobId);
  };
  
  const handleResumeUpload = async () => {
    if (!resumeFile || !selectedJobForUpload || !candidateName || !candidateEmail) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    setUploadingResume(true);
    
    // In a real application, you'd upload the file to your backend
    // and process it with the AI model
    setTimeout(() => {
      toast({
        title: "Resume Uploaded",
        description: `Resume for ${candidateName} has been processed successfully.`
      });
      
      // Add a new mock resume to the list with a random match score
      const newMatchScore = Math.floor(Math.random() * 30) + 70;
      const newResume = {
        id: `resume-new-${Date.now()}`,
        name: candidateName,
        email: candidateEmail,
        uploadDate: new Date().toISOString(),
        score: newMatchScore,
        matchingSkills: Math.floor(Math.random() * 5) + 3,
        totalSkills: Math.floor(Math.random() * 5) + 7
      };
      
      const updatedResumes = [newResume, ...matchedResumes];
      updatedResumes.sort((a, b) => b.score - a.score);
      
      setMatchedResumes(updatedResumes);
      setFilteredResumes(updatedResumes);
      setUploadingResume(false);
      setShowResumeUpload(false);
      setResumeFile(null);
      setCandidateName('');
      setCandidateEmail('');
    }, 2000);
  };
  
  const handleSearchResumes = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    
    if (!query.trim()) {
      setFilteredResumes(matchedResumes);
      return;
    }
    
    const filtered = matchedResumes.filter(
      resume => resume.name.toLowerCase().includes(query) || 
               resume.email.toLowerCase().includes(query)
    );
    
    setFilteredResumes(filtered);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Manage job postings and applicants
        </p>
      </div>

      <Tabs defaultValue="manage-jobs">
        <TabsList className="mb-4">
          <TabsTrigger value="manage-jobs">Manage Jobs</TabsTrigger>
          <TabsTrigger value="applicants">All Applicants</TabsTrigger>
          <TabsTrigger value="resume-matching">Resume Matching</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            <TabsContent value="manage-jobs" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {jobs.map((job) => {
                  const jobApplicants = getJobApplicants(job.id);
                  return (
                    <Card key={job.id}>
                      <CardContent className="p-6">
                        <h3 className="text-xl font-medium mb-2">{job.title}</h3>
                        <div className="mb-4 text-sm text-muted-foreground">
                          <p>{job.employmentType} · {job.locationType}</p>
                          {job.deadline && (
                            <p>Deadline: {new Date(job.deadline).toLocaleDateString()}</p>
                          )}
                        </div>
                        
                        <div className="space-y-4">
                          <div>
                            <p className="font-semibold">Applicants: {jobApplicants.length}</p>
                            <div className="mt-1 text-sm">
                              <p>
                                <span className="text-green-600 font-medium">{jobApplicants.filter(a => a.status === 'shortlisted').length}</span> shortlisted
                              </p>
                              <p>
                                <span className="text-yellow-600 font-medium">{jobApplicants.filter(a => a.status === 'applied' || a.status === 'reviewed').length}</span> pending review
                              </p>
                            </div>
                          </div>
                          
                          <Button className="w-full" onClick={() => handleViewJobDetails(job)}>
                            View Details & Manage
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>
            
            <TabsContent value="applicants" className="space-y-6">
              <div className="rounded-md border">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="p-3 text-left">Applicant</th>
                      <th className="p-3 text-left">Job Position</th>
                      <th className="p-3 text-left">Applied Date</th>
                      <th className="p-3 text-left">Status</th>
                      <th className="p-3 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applicants.map((applicant) => {
                      const job = jobs.find(j => j.id === applicant.jobId);
                      return (
                        <tr key={applicant.id} className="border-t">
                          <td className="p-3">
                            <div>
                              <p className="font-medium">{applicant.resume.name}</p>
                              <p className="text-xs text-muted-foreground">{applicant.resume.email}</p>
                              {applicant.resume.score && (
                                <Badge className="mt-1 bg-green-100 text-green-800 border-green-200">
                                  {applicant.resume.score}% Match
                                </Badge>
                              )}
                            </div>
                          </td>
                          <td className="p-3">{job?.title || 'Unknown Position'}</td>
                          <td className="p-3">{new Date(applicant.appliedDate).toLocaleDateString()}</td>
                          <td className="p-3">
                            <span className={`text-xs rounded-full px-2 py-1 font-medium ${
                              applicant.status === 'shortlisted' ? 'bg-green-100 text-green-800' :
                              applicant.status === 'rejected' ? 'bg-red-100 text-red-800' :
                              applicant.status === 'hired' ? 'bg-purple-100 text-purple-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {applicant.status.charAt(0).toUpperCase() + applicant.status.slice(1)}
                            </span>
                          </td>
                          <td className="p-3">
                            <div className="flex space-x-2">
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleViewJobDetails(job!)}
                              >
                                View
                              </Button>
                              {applicant.status !== 'shortlisted' && (
                                <Button 
                                  size="sm" 
                                  variant="default"
                                  className="bg-green-600 hover:bg-green-700"
                                  onClick={() => handleUpdateStatus(applicant.id, 'shortlisted')}
                                >
                                  Shortlist
                                </Button>
                              )}
                              {applicant.status !== 'rejected' && (
                                <Button 
                                  size="sm" 
                                  variant="destructive"
                                  onClick={() => handleUpdateStatus(applicant.id, 'rejected')}
                                >
                                  Reject
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </TabsContent>
            
            <TabsContent value="resume-matching" className="space-y-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div className="flex gap-2 w-full md:max-w-md">
                  <div className="relative flex-1">
                    <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search resumes..."
                      className="pl-8"
                      value={searchQuery}
                      onChange={handleSearchResumes}
                    />
                  </div>
                  <Button variant="outline" className="flex items-center gap-1">
                    <Filter className="h-4 w-4" />
                    <span>Filter</span>
                  </Button>
                </div>
                
                <Button onClick={() => setShowResumeUpload(true)} className="flex items-center gap-2">
                  <FileUp className="h-4 w-4" />
                  Upload Resume
                </Button>
              </div>
              
              <div className="rounded-md border">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="p-3 text-left">Candidate</th>
                      <th className="p-3 text-left">Upload Date</th>
                      <th className="p-3 text-left">Match Score</th>
                      <th className="p-3 text-left">Skills Match</th>
                      <th className="p-3 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredResumes.map((resume) => (
                      <tr key={resume.id} className="border-t">
                        <td className="p-3">
                          <div>
                            <p className="font-medium">{resume.name}</p>
                            <p className="text-xs text-muted-foreground">{resume.email}</p>
                          </div>
                        </td>
                        <td className="p-3">{new Date(resume.uploadDate).toLocaleDateString()}</td>
                        <td className="p-3">
                          <div className="flex items-center">
                            <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                              <div 
                                className={`h-2.5 rounded-full ${
                                  resume.score >= 80 ? 'bg-green-600' : 
                                  resume.score >= 70 ? 'bg-green-500' : 
                                  resume.score >= 60 ? 'bg-yellow-500' : 
                                  'bg-red-500'
                                }`}
                                style={{ width: `${resume.score}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium">{resume.score}%</span>
                          </div>
                        </td>
                        <td className="p-3">{resume.matchingSkills}/{resume.totalSkills} skills</td>
                        <td className="p-3">
                          <div className="flex space-x-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                            >
                              View Resume
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>
            
            <TabsContent value="settings">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-medium mb-4">Admin Settings</h2>
                  <p className="text-muted-foreground">
                    Configure system settings, notification preferences, and user permissions.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </>
        )}
      </Tabs>
      
      {/* Resume Upload Dialog */}
      <Dialog open={showResumeUpload} onOpenChange={setShowResumeUpload}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Upload Candidate Resume</DialogTitle>
            <DialogDescription>
              Upload a resume and match it against available job requirements
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="candidateName">Candidate Name</Label>
              <Input
                id="candidateName"
                placeholder="Enter candidate name"
                value={candidateName}
                onChange={(e) => setCandidateName(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="candidateEmail">Candidate Email</Label>
              <Input
                id="candidateEmail"
                type="email"
                placeholder="Enter candidate email"
                value={candidateEmail}
                onChange={(e) => setCandidateEmail(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="jobPosition">Job Position</Label>
              <Select value={selectedJobForUpload} onValueChange={setSelectedJobForUpload}>
                <SelectTrigger id="jobPosition">
                  <SelectValue placeholder="Select job position" />
                </SelectTrigger>
                <SelectContent>
                  {jobs.map((job) => (
                    <SelectItem key={job.id} value={job.id}>
                      {job.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="resumeFile">Resume File</Label>
              <div className="border rounded-md p-4 cursor-pointer hover:bg-muted/50">
                <Input
                  id="resumeFile"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                  className="hidden"
                />
                <Label htmlFor="resumeFile" className="flex flex-col items-center cursor-pointer">
                  <FileUp className="h-6 w-6 mb-2 text-muted-foreground" />
                  <span className="font-medium">Click to select file</span>
                  <span className="text-sm text-muted-foreground">PDF, DOC, or DOCX</span>
                </Label>
              </div>
              {resumeFile && (
                <p className="text-sm text-muted-foreground mt-2">
                  Selected: {resumeFile.name}
                </p>
              )}
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowResumeUpload(false)}>
              Cancel
            </Button>
            <Button onClick={handleResumeUpload} disabled={uploadingResume}>
              {uploadingResume ? (
                <>
                  <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Processing...
                </>
              ) : (
                'Upload & Analyze'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {selectedJob && (
        <JobDetailsDialog
          isOpen={showJobDetails}
          onClose={() => setShowJobDetails(false)}
          job={selectedJob}
          applicants={getJobApplicants(selectedJob.id).map(app => ({
            ...app,
            onStatusChange: (newStatus: 'applied' | 'reviewed' | 'rejected' | 'shortlisted' | 'hired') => 
              handleUpdateStatus(app.id, newStatus)
          }))}
        />
      )}
    </div>
  );
};

export default Admin;
