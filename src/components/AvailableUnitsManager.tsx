import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Package } from 'lucide-react';

interface AvailableUnitsManagerProps {
  devId: string;
}

export function AvailableUnitsManager({ devId }: AvailableUnitsManagerProps) {
  const { data: units, isLoading } = useQuery({
    queryKey: ['units', devId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('units')
        .select('*')
        .eq('dev_id', devId)
        .order('beds', { ascending: true })
        .order('price', { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Available':
        return 'default';
      case 'Under Negotiation':
        return 'secondary';
      case 'Sold':
        return 'outline';
      default:
        return 'outline';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Available Units
        </CardTitle>
        <CardDescription>
          View all units for this development
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">
            Loading units...
          </div>
        ) : !units || units.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No units found for this development
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Unit</TableHead>
                  <TableHead>Beds</TableHead>
                  <TableHead>Size (sqft)</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>£/sqft</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Building</TableHead>
                  <TableHead>Floor</TableHead>
                  <TableHead>Features</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {units.map((unit) => (
                  <TableRow key={unit.id}>
                    <TableCell className="font-medium">{unit.unit_number}</TableCell>
                    <TableCell>{unit.beds}</TableCell>
                    <TableCell>{unit.size_sqft?.toLocaleString()}</TableCell>
                    <TableCell className="font-semibold">
                      £{unit.price?.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      {unit.size_sqft && unit.price
                        ? `£${Math.round(unit.price / unit.size_sqft).toLocaleString()}`
                        : '-'}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(unit.status)}>
                        {unit.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{unit.building || '-'}</TableCell>
                    <TableCell>{unit.floor ?? '-'}</TableCell>
                    <TableCell>
                      <div className="flex gap-1 flex-wrap">
                        {unit.view_park && (
                          <Badge variant="outline" className="text-xs">
                            Park View
                          </Badge>
                        )}
                        {unit.view_river && (
                          <Badge variant="outline" className="text-xs">
                            River View
                          </Badge>
                        )}
                        {unit.has_balcony && (
                          <Badge variant="outline" className="text-xs">
                            Balcony
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
