
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { User, Education, Skill } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  User as UserIcon, 
  Briefcase,
  BookOpen, 
  Map,
  Award,
  Building,
  Github,
  Linkedin,
  Image,
  Upload,
  Plus,
  Edit
} from 'lucide-react';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const Profile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<User | null>(null);
  const [newSkill, setNewSkill] = useState('');
  const [newEducation, setNewEducation] = useState<Partial<Education>>({});
  const [showAddEducation, setShowAddEducation] = useState(false);
  const [showAddSkill, setShowAddSkill] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  
  const skillCategories = [
    "Programming Languages",
    "Frameworks & Libraries",
    "Databases",
    "DevOps & Tools",
    "Design & UI/UX",
    "Soft Skills"
  ];

  useEffect(() => {
    // In a real app, you would fetch the full user profile
    // For now, we'll use mock data extending the basic user info
    if (user) {
      setProfile({
        ...user,
        profilePhoto: user.profilePhoto || '/placeholder.svg',
        linkedin: user.linkedin || '',
        github: user.github || '',
        address: user.address || '',
        experienceLevel: user.experienceLevel || 'entry',
        skills: user.skills || [
          { name: 'React', category: 'Frameworks & Libraries', weight: 8 },
          { name: 'TypeScript', category: 'Programming Languages', weight: 7 },
          { name: 'Node.js', category: 'Frameworks & Libraries', weight: 6 },
          { name: 'SQL', category: 'Databases', weight: 6 }
        ],
        education: user.education || [
          {
            degree: 'Bachelor of Science',
            institution: 'Tech University',
            graduationYear: 2023,
            fieldOfStudy: 'Computer Science'
          }
        ],
        extraActivities: user.extraActivities || [
          'Open source contributor',
          'Hackathon participant',
          'Technical blog writer'
        ],
        employmentStatus: user.employmentStatus || 'student'
      });
    }
  }, [user]);

  const handleUpdateProfile = () => {
    // In a real app, you would send this update to your backend
    toast({
      title: "Profile Updated",
      description: "Your profile has been updated successfully."
    });
    setIsEditing(false);
  };

  const handleAddSkill = () => {
    if (!newSkill || !profile) return;
    
    const updatedSkills = [
      ...profile.skills || [],
      { name: newSkill, category: 'Other', weight: 5 }
    ];
    
    setProfile({
      ...profile,
      skills: updatedSkills
    });
    
    setNewSkill('');
    setShowAddSkill(false);
    
    toast({
      title: "Skill Added",
      description: `${newSkill} has been added to your profile.`
    });
  };

  const handleAddEducation = () => {
    if (!newEducation.degree || !newEducation.institution || !profile) return;
    
    const updatedEducation = [
      ...profile.education || [],
      {
        ...newEducation,
        graduationYear: Number(newEducation.graduationYear) || new Date().getFullYear(),
        fieldOfStudy: newEducation.fieldOfStudy || 'Not specified'
      } as Education
    ];
    
    setProfile({
      ...profile,
      education: updatedEducation
    });
    
    setNewEducation({});
    setShowAddEducation(false);
    
    toast({
      title: "Education Added",
      description: "Your education information has been updated."
    });
  };

  const handleProfilePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !profile) return;
    
    // In a real app, you would upload this file to your backend
    // For now, we'll just use a local URL
    const url = URL.createObjectURL(file);
    setProfilePhoto(url);
    setProfile({
      ...profile,
      profilePhoto: url
    });
    
    toast({
      title: "Photo Updated",
      description: "Your profile photo has been updated successfully."
    });
  };

  if (!profile) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
          <p className="text-muted-foreground">
            Manage your personal information and preferences
          </p>
        </div>
        
        <div className="flex gap-4 mt-4 md:mt-0">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
              <Button onClick={handleUpdateProfile}>Save Changes</Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
          )}
        </div>
      </div>
      
      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="personal">Personal Information</TabsTrigger>
          <TabsTrigger value="education">Education</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="activities">Activities & Achievements</TabsTrigger>
        </TabsList>
        
        <TabsContent value="personal">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle className="text-xl">Profile Photo</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-muted mb-4">
                  <img 
                    src={profile.profilePhoto || '/placeholder.svg'} 
                    alt={profile.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {isEditing && (
                  <div className="mt-4">
                    <Label htmlFor="profile-photo" className="cursor-pointer">
                      <div className="flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-muted">
                        <Upload size={16} />
                        <span>Change Photo</span>
                      </div>
                      <Input 
                        id="profile-photo" 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handleProfilePhotoUpload}
                      />
                    </Label>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="text-xl">Personal Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input 
                        id="name" 
                        value={profile.name} 
                        onChange={(e) => setProfile({...profile, name: e.target.value})}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        value={profile.email} 
                        disabled 
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Textarea 
                      id="address" 
                      value={profile.address} 
                      onChange={(e) => setProfile({...profile, address: e.target.value})}
                      disabled={!isEditing}
                      placeholder="Enter your address"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="experience">Experience Level</Label>
                      <Select 
                        disabled={!isEditing}
                        value={profile.experienceLevel} 
                        onValueChange={(value) => setProfile({...profile, experienceLevel: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select experience level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="entry">Entry Level</SelectItem>
                          <SelectItem value="mid">Mid Level</SelectItem>
                          <SelectItem value="senior">Senior Level</SelectItem>
                          <SelectItem value="lead">Lead/Manager</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="employment">Employment Status</Label>
                      <Select 
                        disabled={!isEditing}
                        value={profile.employmentStatus} 
                        onValueChange={(value) => setProfile({...profile, employmentStatus: value as 'employed' | 'unemployed' | 'student'})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="employed">Employed</SelectItem>
                          <SelectItem value="unemployed">Unemployed</SelectItem>
                          <SelectItem value="student">Student</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  {profile.employmentStatus === 'employed' && (
                    <div>
                      <Label htmlFor="employer">Current Employer</Label>
                      <Input 
                        id="employer" 
                        value={profile.currentEmployer || ''} 
                        onChange={(e) => setProfile({...profile, currentEmployer: e.target.value})}
                        disabled={!isEditing}
                        placeholder="Enter your current employer"
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card className="md:col-span-3">
              <CardHeader>
                <CardTitle className="text-xl">Online Profiles</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Linkedin className="h-5 w-5 text-blue-600" />
                      <Input 
                        placeholder="LinkedIn Profile URL" 
                        value={profile.linkedin} 
                        onChange={(e) => setProfile({...profile, linkedin: e.target.value})}
                        disabled={!isEditing}
                      />
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Github className="h-5 w-5" />
                      <Input 
                        placeholder="GitHub Profile URL" 
                        value={profile.github} 
                        onChange={(e) => setProfile({...profile, github: e.target.value})}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <h3 className="text-sm font-medium mb-2">Other Competitive Programming Profiles</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(profile.otherProfiles || {}).map(([platform, url]) => (
                        <div key={platform} className="flex items-center space-x-2">
                          <span className="text-sm font-medium min-w-[100px]">{platform}:</span>
                          <Input 
                            value={url} 
                            onChange={(e) => {
                              const updatedProfiles = {...profile.otherProfiles, [platform]: e.target.value};
                              setProfile({...profile, otherProfiles: updatedProfiles});
                            }}
                            disabled={!isEditing}
                          />
                        </div>
                      ))}
                      
                      {isEditing && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex items-center gap-1"
                          onClick={() => {
                            const platform = prompt("Enter platform name (e.g., LeetCode, HackerRank)");
                            if (platform) {
                              const updatedProfiles = {...profile.otherProfiles, [platform]: ''};
                              setProfile({...profile, otherProfiles: updatedProfiles});
                            }
                          }}
                        >
                          <Plus size={16} /> Add Platform
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="education">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-xl">Education</CardTitle>
                <CardDescription>Your academic background and qualifications</CardDescription>
              </div>
              
              {isEditing && (
                <Dialog open={showAddEducation} onOpenChange={setShowAddEducation}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                      <Plus size={16} /> Add Education
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Education</DialogTitle>
                      <DialogDescription>Add details about your educational background</DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-4 py-4">
                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <Label htmlFor="degree">Degree/Certificate</Label>
                          <Input 
                            id="degree" 
                            value={newEducation.degree || ''} 
                            onChange={(e) => setNewEducation({...newEducation, degree: e.target.value})}
                            placeholder="e.g., Bachelor of Science"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="institution">Institution</Label>
                          <Input 
                            id="institution" 
                            value={newEducation.institution || ''} 
                            onChange={(e) => setNewEducation({...newEducation, institution: e.target.value})}
                            placeholder="e.g., Stanford University"
                          />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="field">Field of Study</Label>
                            <Input 
                              id="field" 
                              value={newEducation.fieldOfStudy || ''} 
                              onChange={(e) => setNewEducation({...newEducation, fieldOfStudy: e.target.value})}
                              placeholder="e.g., Computer Science"
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="year">Graduation Year</Label>
                            <Input 
                              id="year" 
                              type="number" 
                              value={newEducation.graduationYear || ''} 
                              onChange={(e) => setNewEducation({...newEducation, graduationYear: parseInt(e.target.value)})}
                              placeholder="e.g., 2023"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <Label htmlFor="proof" className="block mb-2">Upload Proof (Optional)</Label>
                          <Input id="proof" type="file" />
                        </div>
                      </div>
                    </div>
                    
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setShowAddEducation(false)}>Cancel</Button>
                      <Button onClick={handleAddEducation}>Add Education</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
            </CardHeader>
            
            <CardContent>
              <div className="space-y-6">
                {profile.education?.map((edu, index) => (
                  <div key={index} className="border rounded-md p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium text-lg">{edu.degree}</h3>
                        <p className="text-sm text-muted-foreground">{edu.institution} • {edu.graduationYear}</p>
                        <p className="text-sm mt-1">{edu.fieldOfStudy}</p>
                      </div>
                      
                      {isEditing && (
                        <Button size="sm" variant="ghost">
                          <Edit size={16} />
                        </Button>
                      )}
                    </div>
                    
                    {edu.proofId && (
                      <div className="mt-3">
                        <Badge variant="outline" className="text-xs">
                          Verified <span className="ml-1 text-green-600">✓</span>
                        </Badge>
                      </div>
                    )}
                  </div>
                ))}
                
                {(!profile.education || profile.education.length === 0) && (
                  <div className="text-center py-8 text-muted-foreground">
                    No education information added yet
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="skills">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-xl">Skills</CardTitle>
                <CardDescription>Your technical and professional skills</CardDescription>
              </div>
              
              {isEditing && (
                <Dialog open={showAddSkill} onOpenChange={setShowAddSkill}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                      <Plus size={16} /> Add Skill
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Skill</DialogTitle>
                      <DialogDescription>Add a new skill to your profile</DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-4 py-4">
                      <div>
                        <Label htmlFor="skill-name">Skill Name</Label>
                        <Input 
                          id="skill-name" 
                          value={newSkill} 
                          onChange={(e) => setNewSkill(e.target.value)}
                          placeholder="e.g., Python, Project Management, etc."
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="skill-category">Category</Label>
                        <Select defaultValue="Programming Languages">
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {skillCategories.map(category => (
                              <SelectItem key={category} value={category}>{category}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setShowAddSkill(false)}>Cancel</Button>
                      <Button onClick={handleAddSkill}>Add Skill</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
            </CardHeader>
            
            <CardContent>
              <div className="space-y-6">
                {skillCategories.map(category => {
                  const categorySkills = profile.skills?.filter(skill => skill.category === category) || [];
                  if (categorySkills.length === 0) return null;
                  
                  return (
                    <div key={category} className="space-y-2">
                      <h3 className="font-medium">{category}</h3>
                      <div className="flex flex-wrap gap-2">
                        {categorySkills.map((skill, index) => (
                          <Badge key={index} variant="secondary">
                            {skill.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  );
                })}
                
                {/* Show other skills that don't fit into categories */}
                {profile.skills?.filter(skill => !skillCategories.includes(skill.category)).length > 0 && (
                  <div className="space-y-2">
                    <h3 className="font-medium">Other Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {profile.skills
                        ?.filter(skill => !skillCategories.includes(skill.category))
                        .map((skill, index) => (
                          <Badge key={index} variant="secondary">
                            {skill.name}
                          </Badge>
                        ))}
                    </div>
                  </div>
                )}
                
                {(!profile.skills || profile.skills.length === 0) && (
                  <div className="text-center py-8 text-muted-foreground">
                    No skills added yet
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="activities">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-xl">Activities & Achievements</CardTitle>
                <CardDescription>Extra-curricular activities and accomplishments</CardDescription>
              </div>
              
              {isEditing && (
                <Button variant="outline" size="sm" className="flex items-center gap-1"
                  onClick={() => {
                    const activity = prompt("Add a new activity or achievement");
                    if (activity && profile.extraActivities) {
                      setProfile({
                        ...profile,
                        extraActivities: [...profile.extraActivities, activity]
                      });
                    }
                  }}
                >
                  <Plus size={16} /> Add Activity
                </Button>
              )}
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                {profile.extraActivities?.map((activity, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 border-b last:border-0">
                    <Award className="h-5 w-5 text-orange-500 shrink-0" />
                    <span>{activity}</span>
                    {isEditing && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="ml-auto"
                        onClick={() => {
                          if (!profile.extraActivities) return;
                          const updated = [...profile.extraActivities];
                          updated.splice(index, 1);
                          setProfile({...profile, extraActivities: updated});
                        }}
                      >
                        &times;
                      </Button>
                    )}
                  </div>
                ))}
                
                {(!profile.extraActivities || profile.extraActivities.length === 0) && (
                  <div className="text-center py-8 text-muted-foreground">
                    No activities or achievements added yet
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;
