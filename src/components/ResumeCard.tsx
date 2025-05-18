
import React from 'react';
import { Resume } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';

interface ResumeCardProps {
  resume: Resume;
  onAnalyze?: () => void;
}

const ResumeCard: React.FC<ResumeCardProps> = ({ resume, onAnalyze }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getScoreColor = (score?: number) => {
    if (!score) return 'bg-gray-200';
    if (score >= 90) return 'bg-green-500';
    if (score >= 75) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <Card className="resume-card h-full flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg font-bold">{resume.name}</CardTitle>
            <p className="text-sm text-muted-foreground">{resume.email}</p>
          </div>
          {resume.score && (
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold">{resume.score}</span>
              <span className="text-xs text-muted-foreground">Score</span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="mb-4">
          <p className="text-sm text-muted-foreground mb-1">Uploaded: {formatDate(resume.uploadDate)}</p>
          <p className="text-sm text-muted-foreground mb-3">Filename: {resume.filename}</p>
          
          {resume.score && (
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span>Match Score</span>
                <span>{resume.score}%</span>
              </div>
              <Progress value={resume.score} className={getScoreColor(resume.score)} />
            </div>
          )}
        </div>
        
        <div>
          <h4 className="text-sm font-medium mb-2">Extracted Skills:</h4>
          <div className="flex flex-wrap gap-2">
            {resume.skills.map((skill, index) => (
              <Badge key={index} variant="outline" className="bg-accent text-accent-foreground">
                {skill.name}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
      
      {onAnalyze && (
        <CardFooter>
          <Button onClick={onAnalyze} className="w-full">
            Analyze for Job Fit
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default ResumeCard;
