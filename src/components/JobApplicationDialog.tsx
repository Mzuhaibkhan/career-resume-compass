
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { JobRequirement, Resume } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { applyForJob, fetchUserResumes } from '@/services/mockData';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Briefcase, DollarSign, MapPin, Cloud, Calendar, Clock, FileText, Upload } from 'lucide-react';

interface JobApplicationDialogProps {
  job: JobRequirement;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const formatSalary = (salary?: { min: number; max: number; currency: string }) => {
  if (!salary) return 'Not specified';
  
  const { min, max, currency } = salary;
  
  if (currency === 'USD/hr') {
    return `$${min}-$${max}/hr`;
  } else {
    return `$${min.toLocaleString()}-$${max.toLocaleString()}`;
  }
};

const JobApplicationDialog: React.FC<JobApplicationDialogProps> = ({ job, open, onOpenChange }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedResume, setSelectedResume] = useState<string>('');
  const [coverLetter, setCoverLetter] = useState<string>('');
  const [userResumes, setUserResumes] = useState<Resume[]>([]);
  
  // Fetch user's resumes
  React.useEffect(() => {
    const loadResumes = async () => {
      if (user?.id) {
        try {
          const resumes = await fetchUserResumes(user.id);
          setUserResumes(resumes);
          if (resumes.length > 0) {
            setSelectedResume(resumes[0].id);
          }
        } catch (error) {
          console.error("Failed to load resumes", error);
        }
      }
    };
    
    if (open) {
      loadResumes();
    }
  }, [user?.id, open]);

  const handleSubmitApplication = async () => {
    if (!selectedResume) {
      toast({
        title: "Error",
        description: "Please select a resume to continue",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const result = await applyForJob(job.id, user?.id || '', {
        resumeId: selectedResume,
        coverLetter: coverLetter
      });
      
      if (result.success) {
        toast({
          title: "Application Submitted",
          description: "Your job application has been successfully submitted!",
        });
        onOpenChange(false);
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to submit application",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error submitting application:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Apply for {job.title}</DialogTitle>
          <DialogDescription>
            Submit your application for this position at {job.location || 'Remote'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="bg-muted/30 rounded-md p-4">
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <h3 className="font-medium text-lg">{job.title}</h3>
                {job.deadline && (
                  <div className="flex items-center text-sm text-amber-600">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>Deadline: {new Date(job.deadline).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center">
                  <Briefcase className="h-4 w-4 mr-1 text-muted-foreground" />
                  <span>{job.employmentType || 'Not specified'}</span>
                </div>
                <div className="flex items-center">
                  <DollarSign className="h-4 w-4 mr-1 text-muted-foreground" />
                  <span>{formatSalary(job.salary)}</span>
                </div>
                <div className="flex items-center">
                  {job.locationType === 'remote' ? (
                    <Cloud className="h-4 w-4 mr-1 text-muted-foreground" />
                  ) : (
                    <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
                  )}
                  <span>
                    {job.locationType} {job.location ? `(${job.location})` : ''}
                  </span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                  <span>{job.experienceLevel ? job.experienceLevel.charAt(0).toUpperCase() + job.experienceLevel.slice(1) : 'Any'} level</span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-1 mt-2">
                {job.requiredSkills.map((skill, idx) => (
                  <Badge key={idx} variant="secondary" className="text-xs">
                    {skill.name}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="resume" className="block mb-2">
                Select Resume
              </Label>
              
              {userResumes.length > 0 ? (
                <Select value={selectedResume} onValueChange={setSelectedResume}>
                  <SelectTrigger id="resume">
                    <SelectValue placeholder="Select a resume" />
                  </SelectTrigger>
                  <SelectContent>
                    {userResumes.map((resume) => (
                      <SelectItem key={resume.id} value={resume.id}>
                        <div className="flex items-center">
                          <FileText className="h-4 w-4 mr-2" />
                          {resume.name} 
                          {resume.score ? (
                            <Badge className="ml-2 bg-green-100 text-green-800 border-0">
                              {resume.score}% Match
                            </Badge>
                          ) : null}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <div className="text-center p-4 border border-dashed rounded-md">
                  <p className="text-muted-foreground mb-2">No resumes found</p>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Upload className="h-4 w-4" />
                    Upload Resume
                  </Button>
                </div>
              )}
            </div>
            
            <div>
              <Label htmlFor="cover-letter" className="block mb-2">
                Cover Letter (Optional)
              </Label>
              <Textarea
                id="cover-letter"
                placeholder="Explain why you're a good fit for this position..."
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                className="min-h-[150px]"
              />
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmitApplication} disabled={!selectedResume || isSubmitting}>
            {isSubmitting ? (
              <>
                <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                Submitting...
              </>
            ) : (
              'Submit Application'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default JobApplicationDialog;
