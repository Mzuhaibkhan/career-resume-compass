
import React from 'react';
import { JobRequirement } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface JobRequirementCardProps {
  job: JobRequirement;
  onSelect?: () => void;
  selected?: boolean;
}

const JobRequirementCard: React.FC<JobRequirementCardProps> = ({ 
  job, 
  onSelect,
  selected = false
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Card className={`resume-card h-full flex flex-col ${selected ? 'border-primary border-2' : ''}`}>
      <CardHeader>
        <CardTitle className="text-lg font-bold">{job.title}</CardTitle>
        <p className="text-sm text-muted-foreground">Created: {formatDate(job.createdAt)}</p>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="mb-4">
          <h4 className="text-sm font-medium mb-1">Description:</h4>
          <p className="text-sm text-gray-700">{job.description}</p>
        </div>
        
        <div>
          <h4 className="text-sm font-medium mb-2">Required Skills:</h4>
          <div className="flex flex-wrap gap-2">
            {job.requiredSkills.map((skill, index) => (
              <Badge 
                key={index} 
                variant="outline" 
                className="bg-accent text-accent-foreground"
              >
                {skill.name} ({skill.weight})
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
      
      {onSelect && (
        <CardFooter>
          <Button 
            onClick={onSelect} 
            variant={selected ? "secondary" : "default"}
            className="w-full"
          >
            {selected ? "Selected" : "Select Job"}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default JobRequirementCard;
