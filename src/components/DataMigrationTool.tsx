import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { AlertCircle, CheckCircle, Database, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { developments as localDevelopments } from '@/data/newDevelopments';

export const DataMigrationTool = () => {
  const [migrating, setMigrating] = useState(false);
  const [report, setReport] = useState<any>(null);
  const { toast } = useToast();

  const handleMigrate = async () => {
    setMigrating(true);
    setReport(null);

    try {
      const { data, error } = await supabase.functions.invoke('migrate-developments', {
        body: { localData: localDevelopments }
      });

      if (error) throw error;

      setReport(data.report);
      
      toast({
        title: 'Migration Complete',
        description: `Updated ${data.report.updated} of ${data.report.processed} developments`,
      });

      // Invalidate developments cache
      window.location.reload();
    } catch (error: any) {
      console.error('Migration error:', error);
      toast({
        title: 'Migration Failed',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setMigrating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Data Migration Tool
        </CardTitle>
        <CardDescription>
          Migrate rich development data from local file to database. This will fill in missing fields without overwriting existing data.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            This tool will migrate {localDevelopments.length} developments from the local file. 
            Existing database values will NOT be overwritten. Only missing fields will be populated.
          </AlertDescription>
        </Alert>

        <Button 
          onClick={handleMigrate} 
          disabled={migrating}
          className="w-full"
        >
          {migrating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Migrating...
            </>
          ) : (
            <>
              <Database className="mr-2 h-4 w-4" />
              Start Migration
            </>
          )}
        </Button>

        {report && (
          <div className="space-y-3">
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Processed {report.processed} developments, updated {report.updated}
              </AlertDescription>
            </Alert>

            {report.errors.length > 0 && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {report.errors.length} errors occurred:
                  <ul className="mt-2 list-disc list-inside text-xs">
                    {report.errors.slice(0, 5).map((err: string, i: number) => (
                      <li key={i}>{err}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            {report.details.length > 0 && (
              <div className="text-sm space-y-1">
                <p className="font-medium">Updated developments:</p>
                <ul className="text-xs text-muted-foreground space-y-1">
                  {report.details.slice(0, 10).map((detail: any, i: number) => (
                    <li key={i}>
                      {detail.name}: {detail.fieldsUpdated.join(', ')}
                    </li>
                  ))}
                  {report.details.length > 10 && (
                    <li>...and {report.details.length - 10} more</li>
                  )}
                </ul>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
