
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { JobRequirement } from '@/types';
import { format } from 'date-fns';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Briefcase, DollarSign, MapPin, Cloud, Calendar, Users, ChevronDown } from 'lucide-react';

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
  onStatusChange?: (status: 'applied' | 'reviewed' | 'rejected' | 'shortlisted' | 'hired') => void;
}

interface JobDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  job: JobRequirement;
  applicants: JobApplicant[];
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

const getStatusColor = (status: string) => {
  switch (status) {
    case 'applied': return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
    case 'reviewed': return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
    case 'rejected': return 'bg-red-100 text-red-800 hover:bg-red-200';
    case 'shortlisted': return 'bg-green-100 text-green-800 hover:bg-green-200';
    case 'hired': return 'bg-purple-100 text-purple-800 hover:bg-purple-200';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const JobDetailsDialog: React.FC<JobDetailsDialogProps> = ({ isOpen, onClose, job, applicants }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-xl">{job.title}</DialogTitle>
          <DialogDescription>
            Posted on {format(new Date(job.createdAt), 'MMMM d, yyyy')}
            {job.deadline && (
              <> · Deadline: {format(new Date(job.deadline), 'MMMM d, yyyy')}</>
            )}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <h3 className="font-medium">Job Details</h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span>Salary: {formatSalary(job.salary)}</span>
                </li>
                <li className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                  <span>Type: {job.employmentType || 'Not specified'}</span>
                </li>
                <li className="flex items-center gap-2">
                  {job.locationType === 'remote' ? (
                    <Cloud className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span>Location: {job.locationType} {job.location ? `(${job.location})` : ''}</span>
                </li>
                <li className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Experience: {job.experienceLevel || 'Not specified'}</span>
                </li>
                <li className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>Applicants: {applicants.length}</span>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium">Required Skills</h3>
              <div className="flex flex-wrap gap-1">
                {job.requiredSkills.map((skill, idx) => (
                  <Badge key={idx} variant="secondary">
                    {skill.name}
                  </Badge>
                ))}
              </div>
              
              <h3 className="font-medium mt-4">Description</h3>
              <p className="text-sm text-muted-foreground">{job.description}</p>
            </div>
          </div>
          
          <Separator />
          
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium text-lg">Applicants ({applicants.length})</h3>
            </div>
            
            {applicants.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Applied Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {applicants.map((applicant) => (
                    <TableRow key={applicant.id}>
                      <TableCell className="font-medium">{applicant.resume.name}</TableCell>
                      <TableCell>{applicant.resume.email}</TableCell>
                      <TableCell>{format(new Date(applicant.appliedDate), 'MMM d, yyyy')}</TableCell>
                      <TableCell>
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusColor(applicant.status)}`}>
                          {applicant.status.charAt(0).toUpperCase() + applicant.status.slice(1)}
                        </span>
                      </TableCell>
                      <TableCell>
                        {applicant.onStatusChange ? (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline" size="sm">
                                Update Status <ChevronDown className="ml-1 h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem onClick={() => applicant.onStatusChange!('reviewed')}>
                                Mark as Reviewed
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => applicant.onStatusChange!('shortlisted')}>
                                Shortlist Candidate
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => applicant.onStatusChange!('rejected')}>
                                Reject Application
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => applicant.onStatusChange!('hired')}>
                                Mark as Hired
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        ) : (
                          <Button variant="outline" size="sm">
                            View Resume
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No applicants for this job yet
              </div>
            )}
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Close</Button>
          <Button>Edit Job</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default JobDetailsDialog;
