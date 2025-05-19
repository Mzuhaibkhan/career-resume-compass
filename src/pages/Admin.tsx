
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { fetchJobRequirements, updateApplicationStatus } from '@/services/mockData';
import { JobRequirement } from '@/types';
import JobDetailsDialog from '@/components/JobDetailsDialog';

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

  // Mock applicants data
  const [applicants, setApplicants] = useState<JobApplicant[]>([]);

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
