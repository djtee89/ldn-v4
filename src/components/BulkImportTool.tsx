import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Download, Upload } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import Papa from "papaparse";
import { parsePrice } from "@/lib/priceParser";

export function BulkImportTool() {
  const [files, setFiles] = useState<File[]>([]);
  const [importing, setImporting] = useState(false);
  const [autoEnrich, setAutoEnrich] = useState(true);
  const [results, setResults] = useState<{
    success: number;
    errors: string[];
    warnings?: string[];
    enriched?: number;
    fileResults?: Array<{ filename: string; success: number; errors: number }>;
  } | null>(null);

  const downloadTemplate = () => {
    const template = [
      {
        id: "example-dev",
        name: "Example Development",
        developer: "Example Developer",
        postcode: "SW1A 1AA",
        lat: "51.5074",
        lng: "-0.1278",
        borough: "Westminster",
        zone: "1",
        tenure: "Leasehold",
        status: "Available",
        studio_from: "",
        "1_bed_from": "450000",
        "2_bed_from": "550000",
        "3_bed_from": "750000",
        "4_bed_from": "",
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
    if (files.length === 0) {
      toast.error("Please select at least one CSV file");
      return;
    }

    setImporting(true);
    setResults(null);

    const allErrors: string[] = [];
    const allWarnings: string[] = [];
    let totalSuccess = 0;
    const importedIds: string[] = [];
    const fileResults: Array<{ filename: string; success: number; errors: number }> = [];

    try {
      toast.info(`Processing ${files.length} file${files.length > 1 ? 's' : ''}...`);

      // Process each file
      for (const file of files) {
        try {
          const text = await file.text();
          const parsed = Papa.parse(text, { header: true, skipEmptyLines: true });
      
          if (!parsed.data || parsed.data.length === 0) {
            allErrors.push(`${file.name}: No data found in CSV`);
            fileResults.push({ filename: file.name, success: 0, errors: 1 });
            continue;
          }

          const requiredColumns = ["id", "name", "developer"];
          const firstRow = parsed.data[0] as any;
          const missingColumns = requiredColumns.filter(col => !(col in firstRow));
          
          if (missingColumns.length > 0) {
            allErrors.push(`${file.name}: Missing required columns: ${missingColumns.join(", ")}`);
            fileResults.push({ filename: file.name, success: 0, errors: 1 });
            continue;
          }

          let fileSuccessCount = 0;
          let fileErrorCount = 0;

          // Helper to find column value with flexible matching
          const findColumnValue = (row: any, ...columnNames: string[]) => {
            for (const name of columnNames) {
              const key = Object.keys(row).find(k => 
                k.toLowerCase().replace(/\s+/g, '') === name.toLowerCase().replace(/\s+/g, '')
              );
              if (key && row[key]) return row[key];
            }
            return null;
          };

          for (const [index, row] of (parsed.data as any[]).entries()) {
            try {
              // Build prices object from price columns
              const prices: any = {};
              if (row.studio_from) {
                const parsed = parsePrice(row.studio_from);
                if (parsed) prices.studio = parsed;
              }
              if (row["1_bed_from"]) {
                const parsed = parsePrice(row["1_bed_from"]);
                if (parsed) prices["1bed"] = parsed;
              }
              if (row["2_bed_from"]) {
                const parsed = parsePrice(row["2_bed_from"]);
                if (parsed) prices["2bed"] = parsed;
              }
              if (row["3_bed_from"]) {
                const parsed = parsePrice(row["3_bed_from"]);
                if (parsed) prices["3bed"] = parsed;
              }
              if (row["4_bed_from"]) {
                const parsed = parsePrice(row["4_bed_from"]);
                if (parsed) prices["4bed"] = parsed;
              }

              // Flexible lat/lng parsing
              const latValue = findColumnValue(row, 'lat', 'latitude');
              const lngValue = findColumnValue(row, 'lng', 'longitude', 'long', 'lon');
              
              let lat: number | null = null;
              let lng: number | null = null;
              
              if (latValue) {
                const parsed = parseFloat(latValue);
                if (!isNaN(parsed) && parsed >= -90 && parsed <= 90) {
                  lat = parsed;
                } else {
                  allWarnings.push(`${file.name} - Row ${index + 1} (${row.name}): Invalid latitude "${latValue}" - will use auto-geocoding`);
                }
              }
              
              if (lngValue) {
                const parsed = parseFloat(lngValue);
                if (!isNaN(parsed) && parsed >= -180 && parsed <= 180) {
                  lng = parsed;
                } else {
                  allWarnings.push(`${file.name} - Row ${index + 1} (${row.name}): Invalid longitude "${lngValue}" - will use auto-geocoding`);
                }
              }

              // Flexible field parsing
              const postcodeValue = findColumnValue(row, 'postcode', 'post code', 'postal code');
              const boroughValue = findColumnValue(row, 'borough');
              const zoneValue = findColumnValue(row, 'zone');

              const devData: any = {
                id: row.id?.trim(),
                name: row.name?.trim(),
                developer: row.developer?.trim(),
                location: row.location?.trim() || null,
                postcode: postcodeValue?.trim() || null,
                borough: boroughValue?.trim() || null,
                zone: zoneValue?.trim() || null,
                lat,
                lng,
                status: row.status?.trim() || 'Available',
                completion_date: row.completion_date?.trim() || null,
                tenure: row.tenure?.trim() || null,
                prices: Object.keys(prices).length > 0 ? prices : null,
              };

              if (!devData.id || !devData.name) {
                allErrors.push(`${file.name} - Row ${index + 1}: Missing required fields (id, name)`);
                fileErrorCount++;
                continue;
              }

              const { error } = await supabase
                .from('developments')
                .upsert(devData, { onConflict: 'id' });

              if (error) throw error;
              fileSuccessCount++;
              totalSuccess++;
              importedIds.push(devData.id);
            } catch (error: any) {
              allErrors.push(`${file.name} - Row ${index + 1} (${row.name || 'Unknown'}): ${error.message}`);
              fileErrorCount++;
            }
          }

          fileResults.push({ filename: file.name, success: fileSuccessCount, errors: fileErrorCount });
        } catch (error: any) {
          allErrors.push(`${file.name}: ${error.message}`);
          fileResults.push({ filename: file.name, success: 0, errors: 1 });
        }
      }

      // Auto-enrich if enabled
      let enrichedCount = 0;
      if (autoEnrich && importedIds.length > 0) {
        toast.info(`⚡ Enriching ${importedIds.length} developments with transport & amenities...`);
        
        for (const devId of importedIds) {
          try {
            await supabase.functions.invoke('enrich-development', {
              body: { dev_id: devId },
            });
            enrichedCount++;
          } catch (err) {
            console.error(`Failed to enrich ${devId}:`, err);
          }
        }
        
        if (enrichedCount > 0) {
          toast.success(`✨ Enriched ${enrichedCount} developments`);
        }
      }

      setResults({ 
        success: totalSuccess, 
        errors: allErrors, 
        enriched: enrichedCount, 
        warnings: allWarnings,
        fileResults 
      });

      if (totalSuccess > 0) {
        toast.success(`Successfully imported ${totalSuccess} development${totalSuccess > 1 ? 's' : ''} from ${files.length} file${files.length > 1 ? 's' : ''}`);
      }
      if (allWarnings.length > 0) {
        toast.info(`${allWarnings.length} warning${allWarnings.length > 1 ? 's' : ''} - check results below`);
      }
      if (allErrors.length > 0) {
        toast.error(`${allErrors.length} error${allErrors.length > 1 ? 's' : ''} occurred during import`);
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
            CSV template with basic info + optional starting prices. Auto-enrichment will add coordinates, transport, amenities & AI summaries.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={downloadTemplate} variant="outline" className="w-full">
            <Download className="mr-2 h-4 w-4" />
            Download CSV Template
          </Button>
          <p className="text-sm text-muted-foreground mt-2">
            Required: <span className="font-medium">id, name, developer, postcode</span>
            <br />
            Optional coordinates: <span className="font-medium">lat, lng</span> (or latitude/longitude - auto-geocoded if missing)
            <br />
            Optional prices: <span className="font-medium">studio_from, 1_bed_from, 2_bed_from, 3_bed_from, 4_bed_from</span>
          </p>
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
          <div className="flex items-center space-x-2 mb-4">
            <input
              type="checkbox"
              id="autoEnrich"
              checked={autoEnrich}
              onChange={(e) => setAutoEnrich(e.target.checked)}
              className="h-4 w-4 rounded border-input"
            />
            <label htmlFor="autoEnrich" className="text-sm font-medium">
              ✨ Auto-enrich with coordinates, transport, amenities & AI summaries (recommended)
            </label>
          </div>
          <div className="flex items-center gap-4">
            <input
              type="file"
              accept=".csv"
              multiple
              onChange={(e) => setFiles(Array.from(e.target.files || []))}
              className="flex-1"
            />
            <Button 
              onClick={handleImport} 
              disabled={files.length === 0 || importing}
            >
              <Upload className="mr-2 h-4 w-4" />
              {importing ? "Importing..." : "Import"}
            </Button>
          </div>
          {files.length > 0 && (
            <p className="text-sm text-muted-foreground">
              {files.length} file{files.length > 1 ? 's' : ''} selected: {files.map(f => f.name).join(', ')}
            </p>
          )}
        </CardContent>
      </Card>

      {results && (
        <Alert variant={results.errors.length > 0 ? "destructive" : "default"}>
          <AlertDescription>
            <div className="space-y-2">
              <p className="font-semibold">Import Results:</p>
              <p>✓ Successfully imported: {results.success}</p>
              {results.enriched !== undefined && results.enriched > 0 && (
                <p>✨ Auto-enriched: {results.enriched}</p>
              )}
              {results.fileResults && results.fileResults.length > 1 && (
                <div>
                  <p className="font-semibold mt-3">Per-file results:</p>
                  <ul className="list-disc list-inside space-y-1 mt-1">
                    {results.fileResults.map((fr, i) => (
                      <li key={i} className="text-sm">
                        <span className="font-medium">{fr.filename}</span>: {fr.success} success, {fr.errors} errors
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {results.warnings && results.warnings.length > 0 && (
                <div>
                  <p className="text-amber-600 font-semibold mt-2">⚠ Warnings ({results.warnings.length}):</p>
                  <ul className="list-disc list-inside space-y-1 mt-1">
                    {results.warnings.slice(0, 10).map((warning, i) => (
                      <li key={i} className="text-sm text-amber-600">{warning}</li>
                    ))}
                    {results.warnings.length > 10 && (
                      <li className="text-sm text-amber-600 italic">... and {results.warnings.length - 10} more warnings</li>
                    )}
                  </ul>
                </div>
              )}
              {results.errors.length > 0 && (
                <div>
                  <p className="text-destructive font-semibold mt-2">✗ Errors ({results.errors.length}):</p>
                  <ul className="list-disc list-inside space-y-1 mt-1">
                    {results.errors.slice(0, 10).map((error, i) => (
                      <li key={i} className="text-sm">{error}</li>
                    ))}
                    {results.errors.length > 10 && (
                      <li className="text-sm italic">... and {results.errors.length - 10} more errors</li>
                    )}
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
