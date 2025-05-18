
import React, { useState, useEffect } from 'react';
import FileUpload from '@/components/FileUpload';
import ResumeCard from '@/components/ResumeCard';
import JobRequirementCard from '@/components/JobRequirementCard';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Resume, JobRequirement } from '@/types';
import { uploadResume, fetchJobRequirements, analyzeResumeWithJob } from '@/services/mockData';

const Upload: React.FC = () => {
  const [uploadedResume, setUploadedResume] = useState<Resume | null>(null);
  const [jobs, setJobs] = useState<JobRequirement[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showJobDialog, setShowJobDialog] = useState<boolean>(false);
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState<boolean>(false);
  const { toast } = useToast();

  useEffect(() => {
    const loadJobs = async () => {
      try {
        const jobsData = await fetchJobRequirements();
        setJobs(jobsData);
      } catch (error) {
        console.error('Error loading jobs:', error);
        toast({
          title: 'Error',
          description: 'Failed to load job requirements',
          variant: 'destructive',
        });
      }
    };

    loadJobs();
  }, [toast]);

  const handleFileUpload = async (file: File) => {
    setIsLoading(true);
    try {
      const resume = await uploadResume(file);
      setUploadedResume(resume);
      toast({
        title: 'Resume Uploaded',
        description: 'Resume has been successfully processed',
      });
    } catch (error) {
      console.error('Error uploading resume:', error);
      toast({
        title: 'Upload Error',
        description: 'Failed to process resume',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnalyzeResume = () => {
    setShowJobDialog(true);
  };

  const handleJobSelect = (jobId: string) => {
    setSelectedJob(jobId === selectedJob ? null : jobId);
  };

  const handleAnalyze = async () => {
    if (!uploadedResume || !selectedJob) return;
    
    setAnalyzing(true);
    try {
      const score = await analyzeResumeWithJob(uploadedResume.id, selectedJob);
      setUploadedResume({
        ...uploadedResume,
        score
      });
      setShowJobDialog(false);
      toast({
        title: 'Analysis Complete',
        description: `Resume scored ${score}% match for the selected job`,
      });
    } catch (error) {
      console.error('Error analyzing resume:', error);
      toast({
        title: 'Analysis Error',
        description: 'Failed to analyze resume',
        variant: 'destructive',
      });
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Upload Resume</h1>
        <p className="text-muted-foreground">
          Upload a resume to extract skills and analyze job compatibility
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-lg font-medium mb-4">Upload New Resume</h2>
          <FileUpload onFileUpload={handleFileUpload} />
          
          {isLoading && (
            <div className="flex justify-center mt-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          )}
        </div>
        
        <div>
          <h2 className="text-lg font-medium mb-4">Preview & Analysis</h2>
          {uploadedResume ? (
            <ResumeCard 
              resume={uploadedResume} 
              onAnalyze={handleAnalyzeResume}
            />
          ) : (
            <div className="border rounded-lg p-8 text-center">
              <p className="text-muted-foreground">
                Upload a resume to see the extracted skills and analysis
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Job Selection Dialog */}
      <Dialog open={showJobDialog} onOpenChange={setShowJobDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Select Job for Analysis</DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <p className="text-sm text-muted-foreground mb-4">
              Select a job requirement to analyze the resume against:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto p-1">
              {jobs.map((job) => (
                <JobRequirementCard
                  key={job.id}
                  job={job}
                  onSelect={() => handleJobSelect(job.id)}
                  selected={selectedJob === job.id}
                />
              ))}
              
              {jobs.length === 0 && (
                <div className="col-span-2 text-center p-8 border rounded">
                  <p className="text-muted-foreground">
                    No job requirements found. Please create a job requirement first.
                  </p>
                </div>
              )}
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowJobDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleAnalyze} 
              disabled={!selectedJob || analyzing}
            >
              {analyzing ? 'Analyzing...' : 'Analyze Resume'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Upload;
