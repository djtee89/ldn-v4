import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  label: string;
  icon: string;
  default_visible: boolean;
  display_order: number;
  radius_meters: number;
  overpass_query: string;
}

const AdminNearby = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('nearby_categories')
        .select('*')
        .order('display_order');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error loading categories:', error);
      toast({
        title: 'Error',
        description: 'Failed to load categories',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (category: Category) => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('nearby_categories')
        .update({
          label: category.label,
          icon: category.icon,
          default_visible: category.default_visible,
          display_order: category.display_order,
          radius_meters: category.radius_meters,
          overpass_query: category.overpass_query,
        })
        .eq('id', category.id);

      if (error) throw error;

      toast({
        title: 'Saved',
        description: 'Category updated successfully',
      });
      setEditingId(null);
      loadCategories();
    } catch (error) {
      console.error('Error saving category:', error);
      toast({
        title: 'Error',
        description: 'Failed to save category',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const updateCategory = (id: string, field: keyof Category, value: any) => {
    setCategories(prev =>
      prev.map(cat =>
        cat.id === id ? { ...cat, [field]: value } : cat
      )
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header 
          onAboutClick={() => navigate('/about')}
          onGuideClick={() => navigate('/guide')}
          onShortlistClick={() => navigate('/contact-options')}
          shortlistCount={0}
        />
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header 
        onAboutClick={() => navigate('/about')}
        onGuideClick={() => navigate('/guide')}
        onShortlistClick={() => navigate('/contact-options')}
        shortlistCount={0}
      />
      
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <Button
              variant="ghost"
              onClick={() => navigate('/admin')}
              className="mb-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Admin
            </Button>
            <h1 className="text-3xl font-bold text-foreground">Nearby Settings</h1>
            <p className="text-muted-foreground mt-2">
              Configure nearby amenities categories, search radii, and visibility
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Amenity Categories</CardTitle>
            <CardDescription>
              Manage which categories appear by default and adjust search parameters
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">Order</TableHead>
                    <TableHead className="w-16">Icon</TableHead>
                    <TableHead>Label</TableHead>
                    <TableHead className="w-24">Default</TableHead>
                    <TableHead className="w-32">Radius (m)</TableHead>
                    <TableHead className="w-24">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories.map((cat) => (
                    <React.Fragment key={cat.id}>
                      <TableRow>
                        <TableCell>
                          <Input
                            type="number"
                            value={cat.display_order}
                            onChange={(e) => updateCategory(cat.id, 'display_order', parseInt(e.target.value))}
                            className="w-16"
                            disabled={editingId !== cat.id}
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={cat.icon}
                            onChange={(e) => updateCategory(cat.id, 'icon', e.target.value)}
                            className="w-12 text-center"
                            disabled={editingId !== cat.id}
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={cat.label}
                            onChange={(e) => updateCategory(cat.id, 'label', e.target.value)}
                            disabled={editingId !== cat.id}
                          />
                        </TableCell>
                        <TableCell>
                          <Switch
                            checked={cat.default_visible}
                            onCheckedChange={(checked) => updateCategory(cat.id, 'default_visible', checked)}
                            disabled={editingId !== cat.id}
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={cat.radius_meters}
                            onChange={(e) => updateCategory(cat.id, 'radius_meters', parseInt(e.target.value))}
                            className="w-24"
                            disabled={editingId !== cat.id}
                          />
                        </TableCell>
                        <TableCell>
                          {editingId === cat.id ? (
                            <div className="flex gap-1">
                              <Button
                                size="sm"
                                onClick={() => handleSave(cat)}
                                disabled={saving}
                              >
                                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => {
                                  setEditingId(null);
                                  loadCategories();
                                }}
                              >
                                Cancel
                              </Button>
                            </div>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setEditingId(cat.id)}
                            >
                              Edit
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                      {editingId === cat.id && (
                        <TableRow>
                          <TableCell colSpan={6} className="bg-muted/50">
                            <div className="py-4">
                              <Label className="text-sm font-medium mb-2 block">
                                Overpass Query Template
                              </Label>
                              <Textarea
                                value={cat.overpass_query}
                                onChange={(e) => updateCategory(cat.id, 'overpass_query', e.target.value)}
                                className="font-mono text-xs"
                                rows={4}
                                placeholder="Use {radius}, {lat}, {lng} as placeholders"
                              />
                              <p className="text-xs text-muted-foreground mt-2">
                                Use placeholders: {'{radius}'}, {'{lat}'}, {'{lng}'}
                              </p>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminNearby;
