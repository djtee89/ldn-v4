import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, Plus, GraduationCap } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface School {
  name: string;
  walk_minutes: number;
  ofsted_rating: string;
}

interface SchoolsEditorProps {
  schools: School[];
  onChange: (schools: School[]) => void;
}

const ofstedRatings = [
  'Outstanding',
  'Good',
  'Requires Improvement',
  'Inadequate',
];

export function SchoolsEditor({ schools, onChange }: SchoolsEditorProps) {
  const [newSchool, setNewSchool] = useState<School>({ 
    name: '', 
    walk_minutes: 0,
    ofsted_rating: 'Good' 
  });

  const handleAdd = () => {
    if (!newSchool.name || newSchool.walk_minutes <= 0) return;
    onChange([...schools, newSchool]);
    setNewSchool({ name: '', walk_minutes: 0, ofsted_rating: 'Good' });
  };

  const handleRemove = (index: number) => {
    onChange(schools.filter((_, i) => i !== index));
  };

  const handleUpdate = (index: number, field: keyof School, value: string | number) => {
    const updated = [...schools];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GraduationCap className="h-5 w-5" />
          Nearby Schools
        </CardTitle>
        <CardDescription>Add schools with Ofsted ratings and walking times</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Existing schools */}
        <div className="space-y-2">
          {schools.map((school, index) => (
            <div key={index} className="flex items-center gap-2">
              <Input
                value={school.name}
                onChange={(e) => handleUpdate(index, 'name', e.target.value)}
                placeholder="School name"
                className="flex-1"
              />
              <Select
                value={school.ofsted_rating}
                onValueChange={(value) => handleUpdate(index, 'ofsted_rating', value)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ofstedRatings.map((rating) => (
                    <SelectItem key={rating} value={rating}>
                      {rating}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                type="number"
                value={school.walk_minutes}
                onChange={(e) => handleUpdate(index, 'walk_minutes', parseInt(e.target.value))}
                placeholder="Minutes"
                className="w-24"
              />
              <span className="text-sm text-muted-foreground">min</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleRemove(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

        {/* Add new school */}
        <div className="space-y-3 pt-4 border-t">
          <div className="space-y-2">
            <Label htmlFor="new-school-name">School Name</Label>
            <Input
              id="new-school-name"
              value={newSchool.name}
              onChange={(e) => setNewSchool({ ...newSchool, name: e.target.value })}
              placeholder="e.g., St Mary's Primary School"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-2">
              <Label htmlFor="new-school-ofsted">Ofsted Rating</Label>
              <Select
                value={newSchool.ofsted_rating}
                onValueChange={(value) => setNewSchool({ ...newSchool, ofsted_rating: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ofstedRatings.map((rating) => (
                    <SelectItem key={rating} value={rating}>
                      {rating}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-school-walk">Walk Time (minutes)</Label>
              <Input
                id="new-school-walk"
                type="number"
                value={newSchool.walk_minutes || ''}
                onChange={(e) => setNewSchool({ ...newSchool, walk_minutes: parseInt(e.target.value) || 0 })}
                placeholder="10"
              />
            </div>
          </div>
          <Button
            onClick={handleAdd}
            disabled={!newSchool.name || newSchool.walk_minutes <= 0}
            className="w-full gap-2"
          >
            <Plus className="h-4 w-4" />
            Add School
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
