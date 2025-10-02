import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { Upload, Download, CheckCircle2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function BulkImport() {
  const [file, setFile] = useState<File | null>(null);
  const [results, setResults] = useState<any>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const importMutation = useMutation({
    mutationFn: async (csvFile: File) => {
      const text = await csvFile.text();
      const lines = text.split('\n').filter(line => line.trim());
      const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
      
      const requiredFields = ['id', 'name'];
      const missing = requiredFields.filter(f => !headers.includes(f));
      
      if (missing.length > 0) {
        throw new Error(`Missing required columns: ${missing.join(', ')}`);
      }

      const developments = [];
      const errors = [];

      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim());
        const row: any = {};
        
        headers.forEach((header, index) => {
          row[header] = values[index] || null;
        });

        // Convert zone to number if present
        if (row.zone) row.zone = parseInt(row.zone);
        if (row.lat) row.lat = parseFloat(row.lat);
        if (row.lng) row.lng = parseFloat(row.lng);

        try {
          const { error } = await supabase
            .from('developments')
            .upsert(row);

          if (error) {
            errors.push({ row: i + 1, error: error.message });
          } else {
            developments.push(row.name);
          }
        } catch (err: any) {
          errors.push({ row: i + 1, error: err.message });
        }
      }

      return { developments, errors };
    },
    onSuccess: (data) => {
      setResults(data);
      queryClient.invalidateQueries({ queryKey: ['developments'] });
      
      if (data.errors.length === 0) {
        toast({
          title: 'Import Successful',
          description: `Imported ${data.developments.length} developments`,
        });
      } else {
        toast({
          title: 'Import Completed with Errors',
          description: `${data.developments.length} succeeded, ${data.errors.length} failed`,
          variant: 'destructive',
        });
      }
    },
    onError: (error: Error) => {
      toast({
        title: 'Import Failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const downloadTemplate = () => {
    const csv = 'id,name,developer,zone,postcode,lat,lng\nkrp,Kings Road Park,Berkeley,2,SW6,51.478,-0.193';
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'developments-template.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    if (!file) {
      toast({
        title: 'No file selected',
        description: 'Please select a CSV file to import',
        variant: 'destructive',
      });
      return;
    }

    importMutation.mutate(file);
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Bulk Import</h1>
            <p className="text-muted-foreground">Import multiple developments from a CSV file</p>
          </div>
          <Button variant="outline" onClick={() => navigate('/admin/developments')}>
            Back to Developments
          </Button>
        </div>

        <div className="space-y-6">
          {/* Template download */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5" />
                Download Template
              </CardTitle>
              <CardDescription>
                Start with our CSV template to ensure correct formatting
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={downloadTemplate} variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                Download CSV Template
              </Button>
              <p className="text-sm text-muted-foreground mt-3">
                Required columns: <code className="bg-muted px-2 py-1 rounded">id</code>, <code className="bg-muted px-2 py-1 rounded">name</code>
                <br />
                Optional columns: developer, zone, postcode, lat, lng
              </p>
            </CardContent>
          </Card>

          {/* File upload */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Upload CSV
              </CardTitle>
              <CardDescription>
                Select your CSV file with development data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                type="file"
                accept=".csv"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
              <Button
                onClick={handleImport}
                disabled={!file || importMutation.isPending}
                className="w-full gap-2"
              >
                <Upload className="h-4 w-4" />
                {importMutation.isPending ? 'Importing...' : 'Import Developments'}
              </Button>
            </CardContent>
          </Card>

          {/* Results */}
          {results && (
            <Alert variant={results.errors.length > 0 ? 'destructive' : 'default'}>
              {results.errors.length === 0 ? (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertTitle>Import Successful</AlertTitle>
                  <AlertDescription>
                    Successfully imported {results.developments.length} developments
                  </AlertDescription>
                </>
              ) : (
                <>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Import Completed with Errors</AlertTitle>
                  <AlertDescription>
                    <p className="mb-2">
                      {results.developments.length} succeeded, {results.errors.length} failed
                    </p>
                    <details className="text-sm">
                      <summary className="cursor-pointer">View errors</summary>
                      <ul className="mt-2 space-y-1">
                        {results.errors.map((err: any, idx: number) => (
                          <li key={idx}>
                            Row {err.row}: {err.error}
                          </li>
                        ))}
                      </ul>
                    </details>
                  </AlertDescription>
                </>
              )}
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
}
