import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { Upload, RefreshCw, FileText } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BulkImportTool } from '@/components/BulkImportTool';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function DataPipeline() {
  const [selectedDevId, setSelectedDevId] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const [diffResult, setDiffResult] = useState<any>(null);
  const queryClient = useQueryClient();

  // Fetch developments for dropdown
  const { data: developments } = useQuery({
    queryKey: ['developments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('developments')
        .select('id, name, developer')
        .order('name');
      if (error) throw error;
      return data;
    },
  });

  // Fetch price list history
  const { data: priceLists, refetch: refetchPriceLists } = useQuery({
    queryKey: ['price-lists'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('price_lists')
        .select('*, developments(name)')
        .order('received_at', { ascending: false })
        .limit(20);
      if (error) throw error;
      return data;
    },
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedDevId) {
      toast({ title: 'Error', description: 'Please select a development and file', variant: 'destructive' });
      return;
    }

    setUploading(true);
    setDiffResult(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('dev_id', selectedDevId);

      const { data, error } = await supabase.functions.invoke('ingest', {
        body: formData,
      });

      if (error) throw error;

      setDiffResult(data);
      toast({ title: 'File uploaded successfully', description: `${data.rows_parsed} rows parsed` });
      refetchPriceLists();
    } catch (error: any) {
      toast({ title: 'Upload failed', description: error.message, variant: 'destructive' });
    } finally {
      setUploading(false);
    }
  };

  const handlePublish = async (priceListId: string) => {
    try {
      const { error } = await supabase.functions.invoke('publish', {
        body: { price_list_id: priceListId },
      });

      if (error) throw error;

      toast({ title: 'Published successfully', description: 'Units updated' });
      queryClient.invalidateQueries({ queryKey: ['developments'] });
      queryClient.invalidateQueries({ queryKey: ['units'] });
      refetchPriceLists();
      setDiffResult(null);
    } catch (error: any) {
      toast({ title: 'Publish failed', description: error.message, variant: 'destructive' });
    }
  };

  const handleRestore = async (priceListId: string) => {
    try {
      const { error } = await supabase.functions.invoke('publish', {
        body: { price_list_id: priceListId },
      });

      if (error) throw error;

      toast({ title: 'Restored successfully', description: 'Development reverted to this price list' });
      queryClient.invalidateQueries({ queryKey: ['developments'] });
      queryClient.invalidateQueries({ queryKey: ['units'] });
      refetchPriceLists();
    } catch (error: any) {
      toast({ title: 'Restore failed', description: error.message, variant: 'destructive' });
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Data Pipeline</h1>
        <p className="text-muted-foreground">Upload price lists, bulk import developments, and manage history</p>
      </div>

      <Tabs defaultValue="upload" className="space-y-6">
        <TabsList>
          <TabsTrigger value="upload">Upload Price List</TabsTrigger>
          <TabsTrigger value="bulk">Bulk Import</TabsTrigger>
          <TabsTrigger value="history">History & Rollback</TabsTrigger>
        </TabsList>

        {/* Upload to Existing Development */}
        <TabsContent value="upload" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Upload Price List</CardTitle>
              <CardDescription>Upload CSV, XLSX, or PDF for an existing development</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Select Development</label>
                <Select value={selectedDevId} onValueChange={setSelectedDevId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a development..." />
                  </SelectTrigger>
                  <SelectContent>
                    {developments?.map((dev) => (
                      <SelectItem key={dev.id} value={dev.id}>
                        {dev.name} - {dev.developer}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div
                className="border-2 border-dashed rounded-lg p-8 text-center hover:bg-muted/50 transition-colors cursor-pointer"
                onClick={() => {
                  if (!selectedDevId) {
                    toast({ title: 'Error', description: 'Please select a development first', variant: 'destructive' });
                    return;
                  }
                  document.getElementById('price-list-upload')?.click();
                }}
              >
                <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground mb-2">Click to upload price list</p>
                <p className="text-xs text-muted-foreground">CSV, XLSX, or PDF</p>
                <input
                  id="price-list-upload"
                  type="file"
                  accept=".csv,.xlsx,.pdf"
                  className="hidden"
                  onChange={handleFileUpload}
                  disabled={uploading || !selectedDevId}
                />
              </div>

              {uploading && <p className="text-sm text-center">Uploading and parsing...</p>}

              {diffResult && (
                <Card className="bg-muted/50">
                  <CardHeader>
                    <CardTitle className="text-lg">Review Changes</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-4 gap-4 text-center">
                      <div>
                        <p className="text-2xl font-bold text-green-600">{diffResult.diff?.added || 0}</p>
                        <p className="text-sm text-muted-foreground">Added</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-blue-600">{diffResult.diff?.updated || 0}</p>
                        <p className="text-sm text-muted-foreground">Updated</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-red-600">{diffResult.diff?.removed || 0}</p>
                        <p className="text-sm text-muted-foreground">Removed</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-yellow-600">{diffResult.diff?.errors || 0}</p>
                        <p className="text-sm text-muted-foreground">Errors</p>
                      </div>
                    </div>

                    <Button
                      className="w-full"
                      onClick={() => handlePublish(diffResult.price_list_id)}
                      disabled={!diffResult.price_list_id}
                    >
                      Publish Changes
                    </Button>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Bulk Import */}
        <TabsContent value="bulk">
          <BulkImportTool />
        </TabsContent>

        {/* History & Rollback */}
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Price List History</CardTitle>
              <CardDescription>Last 20 uploads with restore functionality</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px]">
                <div className="space-y-3">
                  {priceLists?.map((priceList: any) => (
                    <Card key={priceList.id} className="bg-muted/30">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4" />
                              <span className="font-medium">{priceList.developments?.name}</span>
                              {priceList.is_active && (
                                <span className="text-xs bg-green-500 text-white px-2 py-0.5 rounded">
                                  Active
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Uploaded: {new Date(priceList.received_at).toLocaleString()}
                            </p>
                            {priceList.published_at && (
                              <p className="text-sm text-muted-foreground">
                                Published: {new Date(priceList.published_at).toLocaleString()}
                              </p>
                            )}
                            {priceList.notes && (
                              <p className="text-sm text-muted-foreground">Notes: {priceList.notes}</p>
                            )}
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRestore(priceList.id)}
                            disabled={priceList.is_active}
                          >
                            <RefreshCw className="h-4 w-4 mr-1" />
                            Restore
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
