
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { fetchJobRequirements, fetchUserApplications } from '@/services/mockData';
import { JobRequirement } from '@/types';
import { Input } from '@/components/ui/input';
import JobFilters from '@/components/JobFilters';
import JobCard from '@/components/JobCard';
import { useAuth } from '@/context/AuthContext';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, Briefcase } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';

const UserDashboard = () => {
  const [jobs, setJobs] = useState<JobRequirement[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<JobRequirement[]>([]);
  const [userApplications, setUserApplications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    const loadData = async () => {
      try {
        const [jobsData, applicationsData] = await Promise.all([
          fetchJobRequirements(),
          fetchUserApplications(user?.id || '')
        ]);
        setJobs(jobsData);
        setFilteredJobs(jobsData);
        setUserApplications(applicationsData);
      } catch (error) {
        console.error('Error loading dashboard data', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [user?.id]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    
    if (!term) {
      setFilteredJobs(jobs);
      return;
    }
    
    const results = jobs.filter(job => 
      job.title.toLowerCase().includes(term) || 
      job.description.toLowerCase().includes(term) ||
      job.requiredSkills.some(skill => skill.name.toLowerCase().includes(term))
    );
    
    setFilteredJobs(results);
  };

  const handleFiltersChange = (filters: any) => {
    let results = [...jobs];
    
    // Apply salary filter
    if (filters.salary) {
      results = results.filter(job => {
        if (!job.salary) return false;
        return job.salary.min >= filters.salary.min && job.salary.max <= filters.salary.max;
      });
    }
    
    // Apply employment type filter
    if (filters.employmentType && filters.employmentType.length > 0) {
      results = results.filter(job => 
        job.employmentType && filters.employmentType.includes(job.employmentType)
      );
    }
    
    // Apply location type filter
    if (filters.locationType && filters.locationType.length > 0) {
      results = results.filter(job => 
        job.locationType && filters.locationType.includes(job.locationType)
      );
    }
    
    // Apply experience level filter
    if (filters.experienceLevel && filters.experienceLevel.length > 0) {
      results = results.filter(job => 
        job.experienceLevel && filters.experienceLevel.includes(job.experienceLevel)
      );
    }
    
    // Apply search term if exists
    if (searchTerm) {
      results = results.filter(job => 
        job.title.toLowerCase().includes(searchTerm) || 
        job.description.toLowerCase().includes(searchTerm) ||
        job.requiredSkills.some(skill => skill.name.toLowerCase().includes(searchTerm))
      );
    }
    
    setFilteredJobs(results);
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'applied':
        return <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-300">Applied</Badge>;
      case 'reviewed':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-800 border-yellow-300">Under Review</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-50 text-red-800 border-red-300">Not Selected</Badge>;
      case 'shortlisted':
        return <Badge variant="outline" className="bg-green-50 text-green-800 border-green-300">Shortlisted</Badge>;
      case 'hired':
        return <Badge variant="outline" className="bg-purple-50 text-purple-800 border-purple-300">Hired</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };
  
  return (
    <div>
      <ThemeToggle/>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Find and apply to jobs that match your skills
            </p>
          </div>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Button asChild>
              <Link to="/upload">Upload Resume</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/profile">My Profile</Link>
            </Button>
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <Tabs defaultValue="jobs" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="jobs">Available Jobs</TabsTrigger>
              <TabsTrigger value="applications">My Applications</TabsTrigger>
            </TabsList>
            
            <TabsContent value="jobs">
              <div className="mb-6">
                <Input
                  placeholder="Search jobs by title, description or skills..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="max-w-md"
                />
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-1">
                  <JobFilters onFiltersChange={handleFiltersChange} />
                </div>
                
                <div className="lg:col-span-3">
                  {filteredJobs.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {filteredJobs.map((job) => (
                        <JobCard key={job.id} job={job} />
                      ))}
                    </div>
                  ) : (
                    <Card>
                      <CardContent className="p-6 text-center">
                        <p className="text-lg mb-2">No jobs match your search criteria</p>
                        <p className="text-muted-foreground mb-4">Try adjusting your filters or search term</p>
                        <Button 
                          variant="outline" 
                          onClick={() => {
                            setSearchTerm('');
                            setFilteredJobs(jobs);
                            handleFiltersChange({});
                          }}
                        >
                          Reset Filters
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="applications">
              {userApplications.length > 0 ? (
                <div className="space-y-4">
                  {userApplications.map((application) => (
                    <Card key={application.id} className="overflow-hidden">
                      <CardContent className="p-0">
                        <div className="p-6">
                          <div className="flex flex-wrap justify-between items-start">
                            <div className="mb-4 md:mb-0">
                              <h3 className="text-xl font-medium mb-1">{application.job.title}</h3>
                              <div className="flex flex-wrap gap-2 mb-2">
                                <div className="flex items-center text-sm text-muted-foreground">
                                  <Briefcase className="h-4 w-4 mr-1" />
                                  <span>{application.job.employmentType || 'Not specified'}</span>
                                </div>
                                <div className="flex items-center text-sm text-muted-foreground">
                                  <MapPin className="h-4 w-4 mr-1" />
                                  <span>{application.job.locationType} {application.job.location ? `(${application.job.location})` : ''}</span>
                                </div>
                                <div className="flex items-center text-sm text-muted-foreground">
                                  <Clock className="h-4 w-4 mr-1" />
                                  <span>Applied on {new Date(application.appliedDate).toLocaleDateString()}</span>
                                </div>
                                {application.job.deadline && (
                                  <div className="flex items-center text-sm text-muted-foreground">
                                    <Calendar className="h-4 w-4 mr-1" />
                                    <span>Deadline: {new Date(application.job.deadline).toLocaleDateString()}</span>
                                  </div>
                                )}
                              </div>
                              <div className="mt-4">
                                {getStatusBadge(application.status)}
                              </div>
                            </div>
                            
                            <div className="flex flex-col gap-2">
                              <Button size="sm" variant="outline" asChild>
                                <Link to={`/job/${application.jobId}`}>View Job Details</Link>
                              </Button>
                              {application.status === 'shortlisted' && (
                                <Button size="sm" className="bg-green-600 hover:bg-green-700">
                                  Schedule Interview
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-6 text-center">
                    <p className="text-lg mb-4">You haven't applied to any jobs yet</p>
                    <Button asChild>
                      <Link to="/jobs">Browse Available Jobs</Link>
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
