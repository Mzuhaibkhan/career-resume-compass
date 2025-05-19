import React, { useState } from 'react';
import { format } from 'date-fns';
import { JobRequirement } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Briefcase, DollarSign, MapPin, Cloud, User, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { applyForJob } from '@/services/mockData';
import { useAuth } from '@/context/AuthContext';

interface JobRequirementCardProps {
  job: JobRequirement;
  isAdmin?: boolean;
  onEdit?: (job: JobRequirement) => void;
  onSelect?: (job: JobRequirement) => void;
  isSelected?: boolean;
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

const JobRequirementCard: React.FC<JobRequirementCardProps> = ({ 
  job, 
  isAdmin = false, 
  onEdit, 
  onSelect,
  isSelected = false 
}) => {
  const [showApplyDialog, setShowApplyDialog] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleApply = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to apply for jobs",
        variant: "destructive",
      });
      return;
    }

    setIsApplying(true);
    try {
      const result = await applyForJob(job.id, user.email);
      
      if (result.success) {
        toast({
          title: "Application Submitted",
          description: result.message,
        });
        setShowApplyDialog(false);
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error applying for job:', error);
      toast({
        title: "Error",
        description: "Failed to submit application",
        variant: "destructive",
      });
    } finally {
      setIsApplying(false);
    }
  };

  const handleCardClick = () => {
    if (onSelect && !isAdmin) {
      onSelect(job);
    }
  };

  return (
    <>
      <Card 
        className={`h-full flex flex-col ${isSelected ? 'border-primary border-2' : ''}`} 
        onClick={onSelect && !isAdmin ? handleCardClick : undefined}
        style={onSelect && !isAdmin ? { cursor: 'pointer' } : {}}
      >
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl mb-1">{job.title}</CardTitle>
              <CardDescription>
                Posted on {format(new Date(job.createdAt), 'MMM d, yyyy')}
              </CardDescription>
            </div>
            {job.experienceLevel && (
              <Badge variant={
                job.experienceLevel === 'entry' ? 'outline' : 
                job.experienceLevel === 'mid' ? 'secondary' :
                job.experienceLevel === 'senior' ? 'default' : 'destructive'
              }>
                {job.experienceLevel.charAt(0).toUpperCase() + job.experienceLevel.slice(1)}
              </Badge>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="flex-grow">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2 text-sm">
              {job.salary && (
                <div className="flex items-center gap-1 text-muted-foreground">
                  <DollarSign className="h-4 w-4" />
                  <span>{formatSalary(job.salary)}</span>
                </div>
              )}
              
              {job.employmentType && (
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Briefcase className="h-4 w-4" />
                  <span>{job.employmentType.replace('-', ' ')}</span>
                </div>
              )}
              
              {job.locationType && (
                <div className="flex items-center gap-1 text-muted-foreground">
                  {job.locationType === 'remote' ? (
                    <Cloud className="h-4 w-4" />
                  ) : (
                    <MapPin className="h-4 w-4" />
                  )}
                  <span>{job.locationType.charAt(0).toUpperCase() + job.locationType.slice(1)}</span>
                </div>
              )}
              
              {job.location && (
                <div className="flex items-center gap-1 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{job.location}</span>
                </div>
              )}
            </div>
            
            <p className="text-sm line-clamp-3">{job.description}</p>
            
            {job.requiredSkills && job.requiredSkills.length > 0 && (
              <div>
                <p className="text-sm font-medium mb-1">Required Skills</p>
                <div className="flex flex-wrap gap-1">
                  {job.requiredSkills.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {skill.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
        
        <CardFooter>
          {isAdmin ? (
            <Button variant="outline" size="sm" className="w-full">
              View Applicants
            </Button>
          ) : (
            <Button className="w-full" onClick={() => setShowApplyDialog(true)}>
              <Send className="mr-2 h-4 w-4" />
              Apply Now
            </Button>
          )}
        </CardFooter>
      </Card>
      
      <Dialog open={showApplyDialog} onOpenChange={setShowApplyDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Apply for {job.title}</DialogTitle>
            <DialogDescription>
              Your resume and profile will be submitted for this position. 
              You can check the status of your application in your dashboard.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <h4 className="font-medium mb-2">Job Details</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-muted-foreground" />
                <span>{job.employmentType || 'Not specified'}</span>
              </li>
              <li className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span>{formatSalary(job.salary)}</span>
              </li>
              <li className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>{job.experienceLevel ? `${job.experienceLevel.charAt(0).toUpperCase() + job.experienceLevel.slice(1)} Level` : 'Not specified'}</span>
              </li>
              <li className="flex items-center gap-2">
                {job.locationType === 'remote' ? (
                  <Cloud className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                )}
                <span>{job.locationType ? `${job.locationType.charAt(0).toUpperCase() + job.locationType.slice(1)}` : 'Not specified'}</span>
              </li>
            </ul>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowApplyDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleApply} disabled={isApplying}>
              {isApplying ? (
                <>
                  <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Submit Application
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default JobRequirementCard;
