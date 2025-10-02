import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { Plus, Trash2 } from 'lucide-react';

interface HeaderMapping {
  id: string;
  developer: string;
  source_header: string;
  target_field: string;
  created_at: string;
}

const TARGET_FIELDS = [
  { value: 'unit_code', label: 'Unit Code' },
  { value: 'beds', label: 'Bedrooms' },
  { value: 'size_sqft', label: 'Size (sqft)' },
  { value: 'price', label: 'Price' },
  { value: 'status', label: 'Status' },
  { value: 'floor', label: 'Floor' },
  { value: 'building', label: 'Building' },
  { value: 'aspect', label: 'Aspect' },
];

export function HeaderMappingManager({ developer }: { developer: string }) {
  const [sourceHeader, setSourceHeader] = useState('');
  const [targetField, setTargetField] = useState('');
  const queryClient = useQueryClient();

  const { data: mappings } = useQuery<HeaderMapping[]>({
    queryKey: ['header-mappings', developer],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('header_mappings')
        .select('*')
        .eq('developer', developer)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
  });

  const addMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('header_mappings')
        .insert({
          developer,
          source_header: sourceHeader,
          target_field: targetField,
        });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['header-mappings', developer] });
      toast.success('Header mapping saved');
      setSourceHeader('');
      setTargetField('');
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('header_mappings')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['header-mappings', developer] });
      toast.success('Mapping deleted');
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Header Mapping Memory</CardTitle>
        <CardDescription>
          Define how {developer}'s CSV columns map to our fields. Future uploads will use these automatically.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Developer's Column Name</Label>
            <Input
              placeholder="e.g., APT NO, Unit #"
              value={sourceHeader}
              onChange={(e) => setSourceHeader(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Maps To</Label>
            <Select value={targetField} onValueChange={setTargetField}>
              <SelectTrigger>
                <SelectValue placeholder="Select field" />
              </SelectTrigger>
              <SelectContent>
                {TARGET_FIELDS.map((field) => (
                  <SelectItem key={field.value} value={field.value}>
                    {field.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-end">
            <Button
              onClick={() => addMutation.mutate()}
              disabled={!sourceHeader || !targetField}
              className="w-full"
            >
              <Plus className="mr-2 h-4 w-4" /> Add Mapping
            </Button>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Their Column</TableHead>
              <TableHead>Our Field</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!mappings || mappings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-muted-foreground">
                  No mappings defined yet. Add one above.
                </TableCell>
              </TableRow>
            ) : (
              mappings.map((mapping) => (
                <TableRow key={mapping.id}>
                  <TableCell className="font-mono">{mapping.source_header}</TableCell>
                  <TableCell>
                    {TARGET_FIELDS.find((f) => f.value === mapping.target_field)?.label}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteMutation.mutate(mapping.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
