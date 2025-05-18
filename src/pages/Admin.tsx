
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { fetchResumes } from '@/services/mockData';
import { Resume } from '@/types';
import { PlusIcon, TrashIcon } from 'lucide-react';

const Admin: React.FC = () => {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { toast } = useToast();
  
  // API settings
  const [apiEnabled, setApiEnabled] = useState<boolean>(true);
  const [apiKey, setApiKey] = useState<string>('sk_live_example123456789');
  
  // Custom categories
  const [categories, setCategories] = useState<string[]>(['Technical', 'Soft Skills', 'Languages', 'Tools']);
  const [newCategory, setNewCategory] = useState<string>('');

  // Skills settings
  const [skillWeights, setSkillWeights] = useState<{[key: string]: number}>({
    'Technical': 5,
    'Soft Skills': 3,
    'Languages': 4,
    'Tools': 3
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const resumesData = await fetchResumes();
        setResumes(resumesData);
      } catch (error) {
        console.error('Error loading resumes:', error);
        toast({
          title: 'Error',
          description: 'Failed to load resumes',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [toast]);

  const handleGenerateNewApiKey = () => {
    // In a real app, this would call an API to generate a new key
    const newKey = 'sk_live_' + Math.random().toString(36).substring(2, 15);
    setApiKey(newKey);
    toast({
      title: 'Success',
      description: 'New API key has been generated',
    });
  };

  const handleAddCategory = () => {
    if (newCategory && !categories.includes(newCategory)) {
      setCategories([...categories, newCategory]);
      setSkillWeights({
        ...skillWeights,
        [newCategory]: 3 // Default weight
      });
      setNewCategory('');
      toast({
        title: 'Category Added',
        description: `Category "${newCategory}" has been added`,
      });
    }
  };

  const handleDeleteCategory = (category: string) => {
    setCategories(categories.filter(c => c !== category));
    const newWeights = { ...skillWeights };
    delete newWeights[category];
    setSkillWeights(newWeights);
    toast({
      title: 'Category Deleted',
      description: `Category "${category}" has been removed`,
    });
  };

  const handleWeightChange = (category: string, weight: string) => {
    const numWeight = parseInt(weight);
    if (!isNaN(numWeight) && numWeight >= 1 && numWeight <= 5) {
      setSkillWeights({
        ...skillWeights,
        [category]: numWeight
      });
    }
  };

  const handleSaveSettings = () => {
    toast({
      title: 'Settings Saved',
      description: 'Your settings have been successfully saved',
    });
  };

  const handleDeleteResume = (id: string) => {
    setResumes(resumes.filter(r => r.id !== id));
    toast({
      title: 'Resume Deleted',
      description: 'Resume has been removed from the system',
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Manage the resume skills extractor system
        </p>
      </div>
      
      <Tabs defaultValue="settings">
        <TabsList className="w-full md:w-auto">
          <TabsTrigger value="settings">System Settings</TabsTrigger>
          <TabsTrigger value="resumes">Manage Resumes</TabsTrigger>
          <TabsTrigger value="api">API Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="settings" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Skill Categories & Weights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                {categories.map((category) => (
                  <div key={category} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="mr-4">{category}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Label htmlFor={`weight-${category}`}>Weight:</Label>
                        <Input
                          id={`weight-${category}`}
                          type="number"
                          min="1"
                          max="5"
                          className="w-16"
                          value={skillWeights[category] || 3}
                          onChange={(e) => handleWeightChange(category, e.target.value)}
                        />
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleDeleteCategory(category)}
                      >
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              
              <Separator />
              
              <div className="flex gap-2">
                <Input
                  placeholder="New category name"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="flex-grow"
                />
                <Button onClick={handleAddCategory} disabled={!newCategory.trim()}>
                  <PlusIcon className="h-4 w-4 mr-2" /> Add Category
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Analysis Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="auto-analyze">Auto-analyze on upload</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically analyze resumes against all job requirements when uploaded
                  </p>
                </div>
                <Switch id="auto-analyze" />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="notify-email">Email notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Send email notifications for new resume uploads
                  </p>
                </div>
                <Switch id="notify-email" />
              </div>
            </CardContent>
          </Card>
          
          <div className="flex justify-end">
            <Button onClick={handleSaveSettings}>Save Settings</Button>
          </div>
        </TabsContent>
        
        <TabsContent value="resumes" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Stored Resumes</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="text-left border-b">
                        <th className="px-4 py-2">Name</th>
                        <th className="px-4 py-2">Email</th>
                        <th className="px-4 py-2">Skills</th>
                        <th className="px-4 py-2">Score</th>
                        <th className="px-4 py-2">Uploaded</th>
                        <th className="px-4 py-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {resumes.map((resume) => (
                        <tr key={resume.id} className="border-b hover:bg-muted/50">
                          <td className="px-4 py-3">{resume.name}</td>
                          <td className="px-4 py-3">{resume.email}</td>
                          <td className="px-4 py-3">
                            <div className="flex flex-wrap gap-1">
                              {resume.skills.slice(0, 2).map((skill) => (
                                <Badge key={skill.name} variant="outline" className="text-xs">
                                  {skill.name}
                                </Badge>
                              ))}
                              {resume.skills.length > 2 && (
                                <span className="text-xs text-muted-foreground">
                                  +{resume.skills.length - 2} more
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            {resume.score ? `${resume.score}%` : 'Not analyzed'}
                          </td>
                          <td className="px-4 py-3 text-sm text-muted-foreground">
                            {new Date(resume.uploadDate).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteResume(resume.id)}
                            >
                              <TrashIcon className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}

                      {resumes.length === 0 && (
                        <tr>
                          <td colSpan={6} className="px-4 py-8 text-center">
                            No resumes have been uploaded yet
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="api" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>API Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="api-enabled">API Access</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable or disable API access for external applications
                  </p>
                </div>
                <Switch 
                  id="api-enabled" 
                  checked={apiEnabled}
                  onCheckedChange={setApiEnabled}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="api-key">API Key</Label>
                <div className="flex gap-2">
                  <Input
                    id="api-key"
                    type="text"
                    readOnly
                    value={apiKey}
                    className="font-mono flex-grow"
                  />
                  <Button onClick={handleGenerateNewApiKey}>
                    Regenerate
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  This key provides full access to the Resume API. Keep it secure.
                </p>
              </div>
              
              <div className="pt-4">
                <h3 className="text-lg font-semibold mb-2">API Documentation</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium">Upload Resume</h4>
                    <pre className="bg-muted p-4 rounded-md text-sm mt-2 overflow-x-auto">
                      POST /api/resumes<br />
                      Content-Type: multipart/form-data<br />
                      Authorization: Bearer {'{your-api-key}'}
                    </pre>
                  </div>
                  
                  <div>
                    <h4 className="font-medium">Analyze Resume</h4>
                    <pre className="bg-muted p-4 rounded-md text-sm mt-2 overflow-x-auto">
                      POST /api/resumes/{'{resume-id}'}/analyze<br />
                      Content-Type: application/json<br />
                      Authorization: Bearer {'{your-api-key}'}<br /><br />
                      {JSON.stringify({ jobId: "job-id-here" }, null, 2)}
                    </pre>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;
