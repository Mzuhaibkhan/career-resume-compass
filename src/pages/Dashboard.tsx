
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { fetchResumes, fetchJobRequirements } from '@/services/mockData';
import { Resume, JobRequirement } from '@/types';
import ResumeCard from '@/components/ResumeCard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [jobs, setJobs] = useState<JobRequirement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [resumesData, jobsData] = await Promise.all([
          fetchResumes(),
          fetchJobRequirements(),
        ]);
        setResumes(resumesData);
        setJobs(jobsData);
      } catch (error) {
        console.error('Error loading dashboard data', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const sortedResumes = [...resumes].sort((a, b) => {
    if (!a.score && !b.score) return 0;
    if (!a.score) return 1;
    if (!b.score) return -1;
    return b.score - a.score;
  });

  const topResumes = sortedResumes.slice(0, 3);

  // Prepare data for charts
  const chartData = sortedResumes.filter(r => r.score).map(resume => ({
    name: resume.name.split(' ')[0], // First name only for brevity
    score: resume.score
  }));

  // Calculate statistics
  const totalResumes = resumes.length;
  const averageScore = resumes.reduce((sum, resume) => sum + (resume.score || 0), 0) / 
    (resumes.filter(r => r.score).length || 1);
  
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of resume analysis and job matching statistics
          </p>
        </div>
        <div className="flex gap-4 mt-4 md:mt-0">
          <Button asChild>
            <Link to="/upload">Upload Resume</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/jobs">Manage Jobs</Link>
          </Button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="text-2xl font-bold">{totalResumes}</div>
                <p className="text-xs text-muted-foreground">Total Resumes</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-2xl font-bold">{jobs.length}</div>
                <p className="text-xs text-muted-foreground">Job Requirements</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-2xl font-bold">{averageScore.toFixed(1)}%</div>
                <p className="text-xs text-muted-foreground">Average Match Score</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-2xl font-bold">
                  {sortedResumes[0]?.score ? `${sortedResumes[0].score}%` : 'N/A'}
                </div>
                <p className="text-xs text-muted-foreground">Highest Match Score</p>
              </CardContent>
            </Card>
          </div>
          
          {/* Chart */}
          <Card className="p-4">
            <h2 className="text-lg font-semibold mb-4">Resume Match Scores</h2>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Bar dataKey="score" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
          
          {/* Top Resumes */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Top Matching Resumes</h2>
            {topResumes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {topResumes.map((resume) => (
                  <ResumeCard key={resume.id} resume={resume} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-6 text-center">
                  <p>No analyzed resumes yet</p>
                  <Button className="mt-4" asChild>
                    <Link to="/upload">Upload and Analyze Resumes</Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
          
          {/* Recent Jobs */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Recent Job Requirements</h2>
              <Button variant="outline" asChild size="sm">
                <Link to="/jobs">View All</Link>
              </Button>
            </div>
            {jobs.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="text-left border-b">
                      <th className="px-4 py-2">Title</th>
                      <th className="px-4 py-2">Required Skills</th>
                      <th className="px-4 py-2">Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {jobs.map((job) => (
                      <tr key={job.id} className="border-b hover:bg-muted/50">
                        <td className="px-4 py-3">{job.title}</td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-1">
                            {job.requiredSkills.slice(0, 3).map((skill) => (
                              <span key={skill.name} className="text-xs bg-accent px-2 py-1 rounded">
                                {skill.name}
                              </span>
                            ))}
                            {job.requiredSkills.length > 3 && (
                              <span className="text-xs text-muted-foreground">
                                +{job.requiredSkills.length - 3} more
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">
                          {new Date(job.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <Card>
                <CardContent className="p-6 text-center">
                  <p>No job requirements defined yet</p>
                  <Button className="mt-4" asChild>
                    <Link to="/jobs">Create Job Requirements</Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
