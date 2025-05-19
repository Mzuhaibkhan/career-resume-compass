
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Github, Linkedin, MapPin, GraduationCap, Award, Briefcase } from 'lucide-react';
import { Education, User } from '@/types';

const Profile = () => {
  const { user: authUser, login } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  
  // Form state
  const [profilePhoto, setProfilePhoto] = useState<string>('');
  const [linkedin, setLinkedin] = useState<string>('');
  const [github, setGithub] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [experienceLevel, setExperienceLevel] = useState<string>('');
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState<string>('');
  const [education, setEducation] = useState<Education[]>([]);
  const [newDegree, setNewDegree] = useState<string>('');
  const [newInstitution, setNewInstitution] = useState<string>('');
  const [newYear, setNewYear] = useState<string>('');
  const [extraActivities, setExtraActivities] = useState<string[]>([]);
  const [newActivity, setNewActivity] = useState<string>('');
  const [employmentStatus, setEmploymentStatus] = useState<'employed' | 'unemployed'>('unemployed');

  useEffect(() => {
    if (authUser) {
      setUser(authUser);
      // Load existing data
      setProfilePhoto(authUser.profilePhoto || '');
      setLinkedin(authUser.linkedin || '');
      setGithub(authUser.github || '');
      setAddress(authUser.address || '');
      setExperienceLevel(authUser.experienceLevel || '');
      setSkills(authUser.skills || []);
      setEducation(authUser.education || []);
      setExtraActivities(authUser.extraActivities || []);
      setEmploymentStatus(authUser.employmentStatus || 'unemployed');
    }
  }, [authUser]);

  const handleSaveProfile = () => {
    if (!user) return;

    const updatedUser = {
      ...user,
      profilePhoto,
      linkedin,
      github,
      address,
      experienceLevel,
      skills,
      education,
      extraActivities,
      employmentStatus
    };
    
    // In a real app, you would save this to your backend
    login(updatedUser); // Update the user in context
    
    setUser(updatedUser);
    setIsEditing(false);
    
    toast({
      title: "Profile Updated",
      description: "Your profile has been successfully updated!",
    });
  };

  const addSkill = () => {
    if (newSkill && !skills.includes(newSkill)) {
      setSkills([...skills, newSkill]);
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  const addEducation = () => {
    if (newDegree && newInstitution && newYear) {
      setEducation([...education, { degree: newDegree, institution: newInstitution, year: newYear }]);
      setNewDegree('');
      setNewInstitution('');
      setNewYear('');
    }
  };

  const removeEducation = (index: number) => {
    setEducation(education.filter((_, i) => i !== index));
  };

  const addActivity = () => {
    if (newActivity && !extraActivities.includes(newActivity)) {
      setExtraActivities([...extraActivities, newActivity]);
      setNewActivity('');
    }
  };

  const removeActivity = (activityToRemove: string) => {
    setExtraActivities(extraActivities.filter(activity => activity !== activityToRemove));
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
        {isEditing ? (
          <div className="space-x-2">
            <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
            <Button onClick={handleSaveProfile}>Save Profile</Button>
          </div>
        ) : (
          <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="w-32 h-32">
                <AvatarImage src={profilePhoto} />
                <AvatarFallback className="text-4xl">{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              {isEditing && (
                <div className="space-y-2 w-full">
                  <Label htmlFor="profilePhoto">Profile Photo URL</Label>
                  <Input
                    id="profilePhoto"
                    value={profilePhoto}
                    onChange={(e) => setProfilePhoto(e.target.value)}
                    placeholder="https://example.com/photo.jpg"
                  />
                </div>
              )}
            </div>
            
            <div className="flex-1 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" value={user.name} disabled />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={user.email} disabled />
                </div>
                <div>
                  <Label htmlFor="employment">Employment Status</Label>
                  {isEditing ? (
                    <Select value={employmentStatus} onValueChange={(value: 'employed' | 'unemployed') => setEmploymentStatus(value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select employment status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="employed">Employed</SelectItem>
                        <SelectItem value="unemployed">Unemployed</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="flex items-center mt-2">
                      <Briefcase className="h-4 w-4 mr-2" />
                      <Badge variant={employmentStatus === 'employed' ? 'default' : 'outline'}>
                        {employmentStatus === 'employed' ? 'Employed' : 'Unemployed'}
                      </Badge>
                    </div>
                  )}
                </div>
                <div>
                  <Label htmlFor="experienceLevel">Experience Level</Label>
                  {isEditing ? (
                    <Select value={experienceLevel} onValueChange={setExperienceLevel}>
                      <SelectTrigger id="experienceLevel">
                        <SelectValue placeholder="Select experience level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="entry">Entry Level</SelectItem>
                        <SelectItem value="mid">Mid Level</SelectItem>
                        <SelectItem value="senior">Senior Level</SelectItem>
                        <SelectItem value="expert">Expert</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input id="experienceLevel" value={experienceLevel || 'Not specified'} disabled />
                  )}
                </div>
              </div>
              
              <div>
                <Label htmlFor="address">Address</Label>
                {isEditing ? (
                  <Input
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Your address"
                  />
                ) : (
                  <div className="flex items-center mt-2">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>{address || 'Not specified'}</span>
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="linkedin">LinkedIn Profile</Label>
                  {isEditing ? (
                    <Input
                      id="linkedin"
                      value={linkedin}
                      onChange={(e) => setLinkedin(e.target.value)}
                      placeholder="https://linkedin.com/in/username"
                    />
                  ) : (
                    <div className="flex items-center mt-2">
                      <Linkedin className="h-4 w-4 mr-2" />
                      {linkedin ? (
                        <a href={linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                          {linkedin.replace('https://linkedin.com/in/', '')}
                        </a>
                      ) : (
                        <span>Not specified</span>
                      )}
                    </div>
                  )}
                </div>
                <div>
                  <Label htmlFor="github">GitHub Profile</Label>
                  {isEditing ? (
                    <Input
                      id="github"
                      value={github}
                      onChange={(e) => setGithub(e.target.value)}
                      placeholder="https://github.com/username"
                    />
                  ) : (
                    <div className="flex items-center mt-2">
                      <Github className="h-4 w-4 mr-2" />
                      {github ? (
                        <a href={github} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                          {github.replace('https://github.com/', '')}
                        </a>
                      ) : (
                        <span>Not specified</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Skills</CardTitle>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <div className="space-y-4">
              <div className="flex space-x-2">
                <Input
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="Add a skill"
                  className="flex-1"
                />
                <Button onClick={addSkill}>Add</Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                  <Badge key={index} variant="secondary" className="px-3 py-1">
                    {skill}
                    <button 
                      onClick={() => removeSkill(skill)}
                      className="ml-2 text-muted-foreground hover:text-foreground"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {skills.length > 0 ? (
                skills.map((skill, index) => (
                  <Badge key={index} variant="secondary">
                    {skill}
                  </Badge>
                ))
              ) : (
                <p className="text-muted-foreground">No skills specified</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Education</CardTitle>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  value={newDegree}
                  onChange={(e) => setNewDegree(e.target.value)}
                  placeholder="Degree/Certification"
                />
                <Input
                  value={newInstitution}
                  onChange={(e) => setNewInstitution(e.target.value)}
                  placeholder="Institution"
                />
                <div className="flex space-x-2">
                  <Input
                    value={newYear}
                    onChange={(e) => setNewYear(e.target.value)}
                    placeholder="Year"
                    className="flex-1"
                  />
                  <Button onClick={addEducation}>Add</Button>
                </div>
              </div>
              <div className="space-y-2">
                {education.map((edu, index) => (
                  <div key={index} className="flex justify-between items-center border p-3 rounded-md">
                    <div>
                      <strong>{edu.degree}</strong>
                      <p className="text-sm text-muted-foreground">
                        {edu.institution}, {edu.year}
                      </p>
                    </div>
                    <Button variant="ghost" onClick={() => removeEducation(index)} size="sm">
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {education.length > 0 ? (
                education.map((edu, index) => (
                  <div key={index} className="flex items-start">
                    <GraduationCap className="h-5 w-5 mr-3 mt-1" />
                    <div>
                      <h3 className="font-medium">{edu.degree}</h3>
                      <p className="text-sm text-muted-foreground">
                        {edu.institution}, {edu.year}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground">No education history specified</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Extra-Curricular Activities</CardTitle>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <div className="space-y-4">
              <div className="flex space-x-2">
                <Input
                  value={newActivity}
                  onChange={(e) => setNewActivity(e.target.value)}
                  placeholder="Add an activity"
                  className="flex-1"
                />
                <Button onClick={addActivity}>Add</Button>
              </div>
              <div className="space-y-2">
                {extraActivities.map((activity, index) => (
                  <div key={index} className="flex justify-between items-center border p-3 rounded-md">
                    <div>{activity}</div>
                    <Button variant="ghost" onClick={() => removeActivity(activity)} size="sm">
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {extraActivities.length > 0 ? (
                extraActivities.map((activity, index) => (
                  <div key={index} className="flex items-start">
                    <Award className="h-5 w-5 mr-3 mt-0.5" />
                    <div>{activity}</div>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground">No extra-curricular activities specified</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
