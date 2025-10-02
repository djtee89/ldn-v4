import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Upload, RefreshCw, Flame, CheckCircle, AlertCircle } from 'lucide-react';

export default function DataPipeline() {
  const [selectedDev, setSelectedDev] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [newDevFile, setNewDevFile] = useState<File | null>(null);
  const queryClient = useQueryClient();

  // Fetch developments
  const { data: developments } = useQuery({
    queryKey: ['developments-admin'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('developments')
        .select('id, name')
        .order('name');
      if (error) throw error;
      return data;
    },
  });

  // Ingest mutation
  const ingestMutation = useMutation({
    mutationFn: async ({ devId, file }: { devId: string; file: File }) => {
      const formData = new FormData();
      formData.append('dev_id', devId);
      formData.append('file', file);

      const { data, error } = await supabase.functions.invoke('ingest', {
        body: formData,
      });

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      toast.success(
        data.diff.auto_publish
          ? 'Price list ingested and published automatically'
          : `Price list ingested. ${data.diff.updated_units} updates pending approval.`
      );
      queryClient.invalidateQueries({ queryKey: ['price-lists'] });
    },
    onError: (error: Error) => {
      toast.error(`Ingest failed: ${error.message}`);
    },
  });

  // Images refresh mutation
  const refreshImagesMutation = useMutation({
    mutationFn: async (devId: string) => {
      const { data, error } = await supabase.functions.invoke('images-refresh', {
        body: { dev_id: devId },
      });
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      toast.success(`Found ${data.images_found} images`);
      queryClient.invalidateQueries({ queryKey: ['developments'] });
    },
    onError: (error: Error) => {
      toast.error(`Image refresh failed: ${error.message}`);
    },
  });

  // Hot auto mutation
  const hotAutoMutation = useMutation({
    mutationFn: async (devId: string) => {
      const { data, error } = await supabase.functions.invoke('hot-auto', {
        body: { dev_id: devId },
      });
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      toast.success(
        `Hottest unit: ${data.hottest_unit.unit_number} (score: ${data.hottest_unit.score})`
      );
    },
    onError: (error: Error) => {
      toast.error(`Hot calculation failed: ${error.message}`);
    },
  });

  // Create development mutation
  const createDevMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);

      const { data, error } = await supabase.functions.invoke('create-development', {
        body: formData,
      });

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      toast.success(
        `Development "${data.development_name}" created successfully with ID: ${data.dev_id}`
      );
      queryClient.invalidateQueries({ queryKey: ['developments-admin'] });
      setNewDevFile(null);
    },
    onError: (error: Error) => {
      toast.error(`Development creation failed: ${error.message}`);
    },
  });

  const handleIngest = () => {
    if (!selectedDev || !selectedFile) {
      toast.error('Please select a development and file');
      return;
    }
    ingestMutation.mutate({ devId: selectedDev, file: selectedFile });
  };

  const handleCreateDev = () => {
    if (!newDevFile) {
      toast.error('Please select a file');
      return;
    }
    createDevMutation.mutate(newDevFile);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-5xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-ink">Data Pipeline</h1>
          <p className="mt-1 text-sm text-ink-muted">
            Upload price lists, refresh images, and manage hottest units
          </p>
        </div>

        {/* Development selector */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Select Development
            </CardTitle>
          </CardHeader>
          <CardContent>
            <select
              className="w-full rounded-lg border border-line bg-white px-3 py-2 text-sm"
              value={selectedDev}
              onChange={(e) => setSelectedDev(e.target.value)}
            >
              <option value="">Choose a development...</option>
              {developments?.map((dev) => (
                <option key={dev.id} value={dev.id}>
                  {dev.name}
                </option>
              ))}
            </select>
          </CardContent>
        </Card>

        {/* Create New Development */}
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5 text-primary" />
              Create New Development
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-ink-muted">
              Upload a CSV or Excel file with development information to create a new entry.
              The file should include: name, developer, location, amenities, price ranges, etc.
            </p>
            <Input
              type="file"
              accept=".csv,.xlsx"
              onChange={(e) => setNewDevFile(e.target.files?.[0] || null)}
            />
            <Button
              onClick={handleCreateDev}
              disabled={!newDevFile || createDevMutation.isPending}
              className="w-full"
              variant="default"
            >
              {createDevMutation.isPending ? 'Creating Development...' : 'Create Development'}
            </Button>
          </CardContent>
        </Card>

        {/* Ingest price list */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Upload Price List
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              type="file"
              accept=".csv,.xlsx,.pdf"
              onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
            />
            <p className="text-xs text-muted-foreground mt-2">
              Supported formats: CSV, Excel (.xlsx), PDF (tables will be extracted - may require review)
            </p>
            <Button
              onClick={handleIngest}
              disabled={!selectedDev || !selectedFile || ingestMutation.isPending}
              className="w-full"
            >
              {ingestMutation.isPending ? 'Uploading...' : 'Upload & Process'}
            </Button>
          </CardContent>
        </Card>

        {/* Quick actions */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RefreshCw className="h-5 w-5" />
                Refresh Images
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-sm text-ink-muted">
                Crawl the development website and update gallery images
              </p>
              <Button
                onClick={() => selectedDev && refreshImagesMutation.mutate(selectedDev)}
                disabled={!selectedDev || refreshImagesMutation.isPending}
                variant="outline"
                className="w-full"
              >
                {refreshImagesMutation.isPending ? 'Refreshing...' : 'Refresh Images'}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Flame className="h-5 w-5" />
                Recalculate Hottest
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-sm text-ink-muted">
                Automatically pick the best-value unit based on scoring
              </p>
              <Button
                onClick={() => selectedDev && hotAutoMutation.mutate(selectedDev)}
                disabled={!selectedDev || hotAutoMutation.isPending}
                variant="outline"
                className="w-full"
              >
                {hotAutoMutation.isPending ? 'Calculating...' : 'Calculate Hottest'}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Status indicators */}
        {ingestMutation.isSuccess && (
          <Card className="border-green-200 bg-green-50">
            <CardContent className="flex items-center gap-3 py-4">
              {ingestMutation.data.diff.auto_publish ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <AlertCircle className="h-5 w-5 text-amber-600" />
              )}
              <div>
                <p className="font-medium text-green-900">
                  {ingestMutation.data.diff.auto_publish
                    ? 'Published automatically'
                    : 'Review required'}
                </p>
                <p className="text-sm text-green-700">
                  {ingestMutation.data.rows_parsed} rows parsed, {ingestMutation.data.diff.new_units}{' '}
                  new, {ingestMutation.data.diff.updated_units} updated
                </p>
              </div>
            </CardContent>
          </Card>
        )}
        
        {createDevMutation.isSuccess && (
          <Card className="border-green-200 bg-green-50">
            <CardContent className="flex items-center gap-3 py-4">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-medium text-green-900">
                  Development created successfully
                </p>
                <p className="text-sm text-green-700">
                  {createDevMutation.data.development_name} (ID: {createDevMutation.data.dev_id})
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
