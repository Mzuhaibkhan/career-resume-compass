
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { JobRequirement } from '@/types';
import { Calendar, MapPin, Briefcase, Clock } from 'lucide-react';

interface JobCardProps {
  job: JobRequirement;
}

const JobCard: React.FC<JobCardProps> = ({ job }) => {
  const isDeadlineSoon = () => {
    if (!job.deadline) return false;
    const deadlineDate = new Date(job.deadline);
    const today = new Date();
    const differenceInDays = Math.ceil((deadlineDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return differenceInDays <= 3 && differenceInDays >= 0;
  };

  const formatSalary = (salary?: { min: number; max: number; currency: string }) => {
    if (!salary) return 'Not specified';
    
    const { min, max, currency } = salary;
    
    if (currency === 'USD/hr') {
      return `$${min}-$${max}/hr`;
    } else {
      return `$${min.toLocaleString()}-$${max.toLocaleString()}`;
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="p-6">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-medium">{job.title}</h3>
            {job.deadline && isDeadlineSoon() && (
              <Badge variant="destructive" className="shrink-0">
                Closing soon
              </Badge>
            )}
          </div>
          
          <div className="mt-2 space-y-2">
            <div className="flex items-center text-sm text-muted-foreground">
              <Briefcase className="h-4 w-4 mr-1" />
              <span>{job.employmentType || 'Not specified'}</span>
            </div>
            
            <div className="flex items-center text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 mr-1" />
              <span>{job.locationType} {job.location ? `(${job.location})` : ''}</span>
            </div>
            
            {job.deadline && (
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="h-4 w-4 mr-1" />
                <span>Deadline: {new Date(job.deadline).toLocaleDateString()}</span>
              </div>
            )}
            
            <div className="flex items-center text-sm font-medium">
              <Clock className="h-4 w-4 mr-1" />
              <span>Salary: {formatSalary(job.salary)}</span>
            </div>
          </div>
          
          <div className="mt-4 flex flex-wrap gap-1">
            {job.requiredSkills.slice(0, 3).map((skill, index) => (
              <Badge key={index} variant="outline">
                {skill.name}
              </Badge>
            ))}
            {job.requiredSkills.length > 3 && (
              <Badge variant="outline">+{job.requiredSkills.length - 3}</Badge>
            )}
          </div>
          
          <div className="mt-4 flex justify-end">
            <Button asChild>
              <Link to={`/job/${job.id}`}>Apply Now</Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default JobCard;
