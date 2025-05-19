
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import JobRequirementCard from '@/components/JobRequirementCard';
import SkillSelector from '@/components/SkillSelector';
import JobFilters from '@/components/JobFilters';
import { fetchJobRequirements, createJobRequirement, getSkillCategories, mockSkills, filterJobs } from '@/services/mockData';
import { JobRequirement, Skill, JobFilters as JobFiltersType } from '@/types';
import { useAuth } from '@/context/AuthContext';

const Jobs: React.FC = () => {
  const [jobs, setJobs] = useState<JobRequirement[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<JobRequirement[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showNewJobDialog, setShowNewJobDialog] = useState<boolean>(false);
  const [jobTitle, setJobTitle] = useState<string>('');
  const [jobDescription, setJobDescription] = useState<string>('');
  const [selectedSkills, setSelectedSkills] = useState<Skill[]>([]);
  const [saving, setSaving] = useState<boolean>(false);
  const [skillCategories, setSkillCategories] = useState<string[]>([]);
  const [filters, setFilters] = useState<JobFiltersType>({});
  const { toast } = useToast();
  const { user } = useAuth();
  
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    const loadJobs = async () => {
      setLoading(true);
      try {
        const jobsData = await fetchJobRequirements();
        setJobs(jobsData);
        setFilteredJobs(jobsData);
        
        // Get unique skill categories
        const categories = getSkillCategories();
        setSkillCategories(categories);
      } catch (error) {
        console.error('Error loading jobs:', error);
        toast({
          title: 'Error',
          description: 'Failed to load job requirements',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    loadJobs();
  }, [toast]);

  const handleCreateJob = async () => {
    if (!jobTitle || !jobDescription || selectedSkills.length === 0) {
      toast({
        title: 'Validation Error',
        description: 'Please fill all required fields and select at least one skill',
        variant: 'destructive',
      });
      return;
    }

    setSaving(true);
    try {
      const newJob = await createJobRequirement({
        title: jobTitle,
        description: jobDescription,
        requiredSkills: selectedSkills,
      });
      
      const updatedJobs = [...jobs, newJob];
      setJobs(updatedJobs);
      setFilteredJobs(updatedJobs);
      setShowNewJobDialog(false);
      resetForm();
      
      toast({
        title: 'Job Created',
        description: 'Job requirement has been successfully created',
      });
    } catch (error) {
      console.error('Error creating job:', error);
      toast({
        title: 'Error',
        description: 'Failed to create job requirement',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setJobTitle('');
    setJobDescription('');
    setSelectedSkills([]);
  };

  const handleOpenNewJobDialog = () => {
    resetForm();
    setShowNewJobDialog(true);
  };
  
  const handleFiltersChange = (newFilters: JobFiltersType) => {
    setFilters(newFilters);
    
    if (Object.keys(newFilters).length === 0) {
      setFilteredJobs(jobs); // Reset to all jobs
    } else {
      const filtered = filterJobs(jobs, newFilters);
      setFilteredJobs(filtered);
    }
  };

  // Admin view for creating and managing jobs
  const renderAdminView = () => (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Job Requirements</h1>
          <p className="text-muted-foreground">
            Create and manage job requirements for resume matching
          </p>
        </div>
        <Button onClick={handleOpenNewJobDialog} className="mt-4 md:mt-0">
          Create New Job
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {jobs.map((job) => (
            <JobRequirementCard key={job.id} job={job} isAdmin={true} />
          ))}
          
          {jobs.length === 0 && (
            <Card className="col-span-3">
              <CardContent className="p-8 text-center">
                <p className="text-lg mb-4">No job requirements defined yet</p>
                <Button onClick={handleOpenNewJobDialog}>
                  Create Your First Job Requirement
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Create New Job Dialog */}
      <Dialog open={showNewJobDialog} onOpenChange={setShowNewJobDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Job Requirement</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="job-title">Job Title</Label>
              <Input
                id="job-title"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="e.g. Senior Frontend Developer"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="job-description">Job Description</Label>
              <Textarea
                id="job-description"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Enter detailed job description..."
                rows={4}
              />
            </div>
            
            <div>
              <Label className="mb-2 block">Required Skills</Label>
              <SkillSelector
                availableSkills={mockSkills}
                selectedSkills={selectedSkills}
                onSkillsChange={setSelectedSkills}
                categories={skillCategories}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewJobDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleCreateJob}
              disabled={saving || !jobTitle || !jobDescription || selectedSkills.length === 0}
            >
              {saving ? 'Creating...' : 'Create Job'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );

  // User view for browsing and filtering jobs
  const renderUserView = () => (
    <>
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Browse Jobs</h1>
        <p className="text-muted-foreground">
          Find your next career opportunity
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-6">
          <div className="lg:col-span-1">
            <JobFilters onFiltersChange={handleFiltersChange} />
          </div>
          
          <div className="lg:col-span-3">
            {filteredJobs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredJobs.map((job) => (
                  <JobRequirementCard key={job.id} job={job} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-lg">No jobs match your current filters</p>
                  <Button 
                    variant="outline" 
                    onClick={() => handleFiltersChange({})}
                    className="mt-4"
                  >
                    Reset Filters
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}
    </>
  );

  return (
    <div className="space-y-8">
      {isAdmin ? renderAdminView() : renderUserView()}
    </div>
  );
};

export default Jobs;
