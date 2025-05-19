
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { JobFilters as JobFiltersType } from '@/types';

const EMPLOYMENT_TYPES = [
  { id: 'full-time', label: 'Full-Time' },
  { id: 'part-time', label: 'Part-Time' },
  { id: 'contract', label: 'Contract' },
  { id: 'internship', label: 'Internship' }
];

const LOCATION_TYPES = [
  { id: 'remote', label: 'Remote' },
  { id: 'on-site', label: 'On-Site' },
  { id: 'hybrid', label: 'Hybrid' }
];

const EXPERIENCE_LEVELS = [
  { id: 'entry', label: 'Entry Level' },
  { id: 'mid', label: 'Mid Level' },
  { id: 'senior', label: 'Senior Level' },
  { id: 'lead', label: 'Lead/Manager' }
];

interface JobFiltersProps {
  onFiltersChange: (filters: JobFiltersType) => void;
}

const JobFilters: React.FC<JobFiltersProps> = ({ onFiltersChange }) => {
  const [salaryRange, setSalaryRange] = useState([40000, 150000]);
  const [employmentTypes, setEmploymentTypes] = useState<string[]>([]);
  const [locationTypes, setLocationTypes] = useState<string[]>([]);
  const [experienceLevels, setExperienceLevels] = useState<string[]>([]);
  
  const handleSalaryChange = (values: number[]) => {
    setSalaryRange(values);
  };
  
  const handleEmploymentTypeChange = (typeId: string, checked: boolean) => {
    setEmploymentTypes(prev => 
      checked 
        ? [...prev, typeId] 
        : prev.filter(type => type !== typeId)
    );
  };
  
  const handleLocationTypeChange = (typeId: string, checked: boolean) => {
    setLocationTypes(prev => 
      checked 
        ? [...prev, typeId] 
        : prev.filter(type => type !== typeId)
    );
  };
  
  const handleExperienceLevelChange = (levelId: string, checked: boolean) => {
    setExperienceLevels(prev => 
      checked 
        ? [...prev, levelId] 
        : prev.filter(level => level !== levelId)
    );
  };
  
  const handleApplyFilters = () => {
    onFiltersChange({
      salary: {
        min: salaryRange[0],
        max: salaryRange[1]
      },
      employmentType: employmentTypes.length > 0 ? employmentTypes : undefined,
      locationType: locationTypes.length > 0 ? locationTypes : undefined,
      experienceLevel: experienceLevels.length > 0 ? experienceLevels : undefined
    });
  };
  
  const handleResetFilters = () => {
    setSalaryRange([40000, 150000]);
    setEmploymentTypes([]);
    setLocationTypes([]);
    setExperienceLevels([]);
    
    onFiltersChange({});
  };

  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        <div>
          <Label className="font-medium mb-2 block">Salary Range</Label>
          <div className="pt-4 px-2">
            <Slider 
              defaultValue={salaryRange} 
              min={0}
              max={200000}
              step={5000}
              onValueChange={handleSalaryChange}
            />
            <div className="flex justify-between mt-2 text-sm text-muted-foreground">
              <span>${salaryRange[0].toLocaleString()}</span>
              <span>${salaryRange[1].toLocaleString()}</span>
            </div>
          </div>
        </div>
        
        <div>
          <Label className="font-medium mb-2 block">Employment Type</Label>
          <div className="grid grid-cols-2 gap-2">
            {EMPLOYMENT_TYPES.map((type) => (
              <div key={type.id} className="flex items-center space-x-2">
                <Checkbox 
                  id={`employment-${type.id}`} 
                  checked={employmentTypes.includes(type.id)}
                  onCheckedChange={(checked) => 
                    handleEmploymentTypeChange(type.id, checked as boolean)
                  }
                />
                <Label 
                  htmlFor={`employment-${type.id}`}
                  className="text-sm font-normal"
                >
                  {type.label}
                </Label>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <Label className="font-medium mb-2 block">Location Type</Label>
          <div className="grid grid-cols-2 gap-2">
            {LOCATION_TYPES.map((type) => (
              <div key={type.id} className="flex items-center space-x-2">
                <Checkbox 
                  id={`location-${type.id}`} 
                  checked={locationTypes.includes(type.id)}
                  onCheckedChange={(checked) => 
                    handleLocationTypeChange(type.id, checked as boolean)
                  }
                />
                <Label 
                  htmlFor={`location-${type.id}`}
                  className="text-sm font-normal"
                >
                  {type.label}
                </Label>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <Label className="font-medium mb-2 block">Experience Level</Label>
          <div className="grid grid-cols-2 gap-2">
            {EXPERIENCE_LEVELS.map((level) => (
              <div key={level.id} className="flex items-center space-x-2">
                <Checkbox 
                  id={`level-${level.id}`} 
                  checked={experienceLevels.includes(level.id)}
                  onCheckedChange={(checked) => 
                    handleExperienceLevelChange(level.id, checked as boolean)
                  }
                />
                <Label 
                  htmlFor={`level-${level.id}`}
                  className="text-sm font-normal"
                >
                  {level.label}
                </Label>
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex flex-col gap-2 pt-2">
          <Button 
            onClick={handleApplyFilters} 
            className="w-full"
          >
            Apply Filters
          </Button>
          <Button 
            variant="outline" 
            onClick={handleResetFilters}
            className="w-full"
          >
            Reset Filters
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default JobFilters;
