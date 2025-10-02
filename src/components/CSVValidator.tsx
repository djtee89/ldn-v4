import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AlertCircle, CheckCircle2, XCircle } from 'lucide-react';

interface ValidationError {
  row: number;
  field: string;
  message: string;
  severity: 'error' | 'warning';
}

interface CSVValidatorProps {
  errors: ValidationError[];
}

export function CSVValidator({ errors }: CSVValidatorProps) {
  if (errors.length === 0) {
    return (
      <Alert className="border-green-500 bg-green-50 dark:bg-green-950">
        <CheckCircle2 className="h-4 w-4 text-green-600" />
        <AlertTitle className="text-green-900 dark:text-green-100">
          Validation Passed
        </AlertTitle>
        <AlertDescription className="text-green-800 dark:text-green-200">
          No errors found. Ready to publish.
        </AlertDescription>
      </Alert>
    );
  }

  const errorCount = errors.filter((e) => e.severity === 'error').length;
  const warningCount = errors.filter((e) => e.severity === 'warning').length;

  return (
    <div className="space-y-4">
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Validation Failed</AlertTitle>
        <AlertDescription>
          Found {errorCount} error{errorCount !== 1 ? 's' : ''} and {warningCount} warning
          {warningCount !== 1 ? 's' : ''}. Fix all errors before publishing.
        </AlertDescription>
      </Alert>

      <ScrollArea className="h-[300px] rounded-md border p-4">
        <div className="space-y-3">
          {errors.map((error, index) => (
            <div
              key={index}
              className={`flex items-start gap-3 rounded-lg border p-3 ${
                error.severity === 'error'
                  ? 'border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950'
                  : 'border-yellow-200 bg-yellow-50 dark:border-yellow-900 dark:bg-yellow-950'
              }`}
            >
              {error.severity === 'error' ? (
                <XCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              )}
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge
                    variant="outline"
                    className={
                      error.severity === 'error'
                        ? 'border-red-300 text-red-900 dark:text-red-100'
                        : 'border-yellow-300 text-yellow-900 dark:text-yellow-100'
                    }
                  >
                    Row {error.row}
                  </Badge>
                  <Badge
                    variant="outline"
                    className={
                      error.severity === 'error'
                        ? 'border-red-300 text-red-900 dark:text-red-100'
                        : 'border-yellow-300 text-yellow-900 dark:text-yellow-100'
                    }
                  >
                    {error.field}
                  </Badge>
                </div>
                <p
                  className={`text-sm ${
                    error.severity === 'error'
                      ? 'text-red-900 dark:text-red-100'
                      : 'text-yellow-900 dark:text-yellow-100'
                  }`}
                >
                  {error.message}
                </p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
