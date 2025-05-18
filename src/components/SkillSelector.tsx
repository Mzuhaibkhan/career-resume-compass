
import React, { useState } from 'react';
import { Skill } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { XIcon, PlusIcon } from 'lucide-react';

interface SkillSelectorProps {
  availableSkills: Skill[];
  selectedSkills: Skill[];
  onSkillsChange: (skills: Skill[]) => void;
  categories: string[];
}

const SkillSelector: React.FC<SkillSelectorProps> = ({
  availableSkills,
  selectedSkills,
  onSkillsChange,
  categories,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [customSkill, setCustomSkill] = useState<string>('');
  const [customCategory, setCustomCategory] = useState<string>('');
  const [skillWeight, setSkillWeight] = useState<number>(3);

  const filteredSkills = selectedCategory
    ? availableSkills.filter((skill) => skill.category === selectedCategory)
    : availableSkills;

  const isSkillSelected = (skillName: string) => {
    return selectedSkills.some((skill) => skill.name === skillName);
  };

  const handleSkillToggle = (skill: Skill) => {
    const exists = selectedSkills.some((s) => s.name === skill.name);
    
    if (exists) {
      onSkillsChange(selectedSkills.filter((s) => s.name !== skill.name));
    } else {
      onSkillsChange([...selectedSkills, { ...skill, weight: skillWeight }]);
    }
  };

  const handleSkillRemove = (skillName: string) => {
    onSkillsChange(selectedSkills.filter((skill) => skill.name !== skillName));
  };

  const handleWeightChange = (skillName: string, weight: number) => {
    onSkillsChange(
      selectedSkills.map((skill) =>
        skill.name === skillName ? { ...skill, weight } : skill
      )
    );
  };

  const handleAddCustomSkill = () => {
    if (customSkill.trim() && customCategory.trim()) {
      const newSkill: Skill = {
        name: customSkill.trim(),
        category: customCategory.trim(),
        weight: skillWeight,
      };
      onSkillsChange([...selectedSkills, newSkill]);
      setCustomSkill('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Selected Skills Section */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Selected Skills</h3>
        {selectedSkills.length === 0 ? (
          <p className="text-sm text-muted-foreground">No skills selected yet</p>
        ) : (
          <div className="space-y-4">
            {selectedSkills.map((skill) => (
              <div
                key={skill.name}
                className="flex flex-wrap gap-4 items-center p-3 bg-muted/30 rounded-md"
              >
                <div className="flex-grow">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium">{skill.name}</span>
                      <Badge variant="outline" className="ml-2">
                        {skill.category}
                      </Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleSkillRemove(skill.name)}
                    >
                      <XIcon className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="mt-2 space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Importance</span>
                      <span>{skill.weight}/5</span>
                    </div>
                    <Slider
                      value={[skill.weight]}
                      min={1}
                      max={5}
                      step={1}
                      onValueChange={(value) => handleWeightChange(skill.name, value[0])}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add From Available Skills */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Add Skills</h3>
        <div className="mb-4 space-y-2">
          <Label htmlFor="category">Filter by Category</Label>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger id="category">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="mb-4 space-y-2">
          <Label>Importance Weight</Label>
          <div className="flex items-center gap-4">
            <Slider
              className="flex-grow"
              value={[skillWeight]}
              min={1}
              max={5}
              step={1}
              onValueChange={(value) => setSkillWeight(value[0])}
            />
            <span className="w-8 text-center">{skillWeight}/5</span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-6">
          {filteredSkills.map((skill) => (
            <Button
              key={skill.name}
              variant={isSkillSelected(skill.name) ? "secondary" : "outline"}
              onClick={() => handleSkillToggle(skill)}
              className="justify-start"
            >
              {skill.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Add Custom Skill */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Add Custom Skill</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="custom-skill">Skill Name</Label>
              <Input
                id="custom-skill"
                value={customSkill}
                onChange={(e) => setCustomSkill(e.target.value)}
                placeholder="Enter skill name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="custom-category">Category</Label>
              <Input
                id="custom-category"
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                placeholder="Enter category"
                list="categories"
              />
              <datalist id="categories">
                {categories.map((category) => (
                  <option key={category} value={category} />
                ))}
              </datalist>
            </div>
          </div>
          <Button
            onClick={handleAddCustomSkill}
            disabled={!customSkill.trim() || !customCategory.trim()}
          >
            <PlusIcon className="mr-2 h-4 w-4" /> Add Custom Skill
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SkillSelector;
