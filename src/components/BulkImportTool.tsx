import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Download, Upload } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import Papa from "papaparse";

export function BulkImportTool() {
  const [file, setFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [results, setResults] = useState<{
    success: number;
    errors: string[];
  } | null>(null);

  const downloadTemplate = () => {
    const template = [
      {
        id: "example-dev",
        name: "Example Development",
        developer: "Example Developer",
        location: "London",
        postcode: "SW1A 1AA",
        zone: "1",
        lat: "51.5074",
        lng: "-0.1278",
        status: "Available",
        completion_date: "Q4 2024",
        tenure: "Leasehold",
      },
    ];

    const csv = Papa.unparse(template);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "developments_template.csv";
    link.click();
  };

  const handleImport = async () => {
    if (!file) {
      toast.error("Please select a CSV file");
      return;
    }

    setImporting(true);
    setResults(null);

    try {
      const text = await file.text();
      const parsed = Papa.parse(text, { header: true, skipEmptyLines: true });
      
      if (!parsed.data || parsed.data.length === 0) {
        throw new Error("No data found in CSV");
      }

      const requiredColumns = ["id", "name", "developer"];
      const firstRow = parsed.data[0] as any;
      const missingColumns = requiredColumns.filter(col => !(col in firstRow));
      
      if (missingColumns.length > 0) {
        throw new Error(`Missing required columns: ${missingColumns.join(", ")}`);
      }

      const errors: string[] = [];
      let successCount = 0;

      for (const [index, row] of (parsed.data as any[]).entries()) {
        try {
          const devData: any = {
            id: row.id?.trim(),
            name: row.name?.trim(),
            developer: row.developer?.trim(),
            location: row.location?.trim() || null,
            postcode: row.postcode?.trim() || null,
            zone: row.zone ? parseInt(row.zone) : null,
            lat: row.lat ? parseFloat(row.lat) : null,
            lng: row.lng ? parseFloat(row.lng) : null,
            status: row.status?.trim() || 'Available',
            completion_date: row.completion_date?.trim() || null,
            tenure: row.tenure?.trim() || null,
          };

          if (!devData.id || !devData.name) {
            errors.push(`Row ${index + 1}: Missing required fields (id, name)`);
            continue;
          }

          const { error } = await supabase
            .from('developments')
            .upsert(devData, { onConflict: 'id' });

          if (error) throw error;
          successCount++;
        } catch (error: any) {
          errors.push(`Row ${index + 1} (${row.name || 'Unknown'}): ${error.message}`);
        }
      }

      setResults({ success: successCount, errors });

      if (successCount > 0) {
        toast.success(`Successfully imported ${successCount} development${successCount > 1 ? 's' : ''}`);
      }
      if (errors.length > 0) {
        toast.error(`${errors.length} error${errors.length > 1 ? 's' : ''} occurred during import`);
      }
    } catch (error: any) {
      toast.error(`Import failed: ${error.message}`);
      setResults({ success: 0, errors: [error.message] });
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Download Template</CardTitle>
          <CardDescription>
            Get a CSV template with the correct format for bulk import
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={downloadTemplate} variant="outline" className="w-full">
            <Download className="mr-2 h-4 w-4" />
            Download CSV Template
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Upload CSV</CardTitle>
          <CardDescription>
            Select a CSV file with development data to import
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <input
              type="file"
              accept=".csv"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="flex-1"
            />
            <Button 
              onClick={handleImport} 
              disabled={!file || importing}
            >
              <Upload className="mr-2 h-4 w-4" />
              {importing ? "Importing..." : "Import"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {results && (
        <Alert variant={results.errors.length > 0 ? "destructive" : "default"}>
          <AlertDescription>
            <div className="space-y-2">
              <p className="font-semibold">Import Results:</p>
              <p>✓ Successfully imported: {results.success}</p>
              {results.errors.length > 0 && (
                <div>
                  <p className="text-destructive font-semibold mt-2">✗ Errors ({results.errors.length}):</p>
                  <ul className="list-disc list-inside space-y-1 mt-1">
                    {results.errors.map((error, i) => (
                      <li key={i} className="text-sm">{error}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
