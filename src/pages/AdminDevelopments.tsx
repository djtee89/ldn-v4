import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Upload, Plus, FileSpreadsheet, Trash2, Download, GripVertical, Star, EyeOff, Eye } from "lucide-react";
import { SearchFiltersBar, FilterState } from "@/components/SearchFiltersBar";
import { RollbackDialog } from "@/components/RollbackDialog";
import { HottestUnitManager } from "@/components/HottestUnitManager";
import { MandatoryFieldsGate } from "@/components/MandatoryFieldsGate";
import { BulkImportTool } from "@/components/BulkImportTool";
import { useNavigate } from "react-router-dom";

type PriceList = {
  id: string;
  dev_id: string;
  file_path: string;
  source: string;
  uploaded_at: string;
  parsed_ok: boolean;
  notes: string | null;
};

export default function AdminDevelopments() {
  const [selectedDev, setSelectedDev] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<FilterState>({
    noImages: false,
    noPriceList: false,
    missingStations: false,
    missingSchools: false,
  });
  const navigate = useNavigate();

  const { data: developments } = useQuery({
    queryKey: ['developments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('developments')
        .select('*')
        .order('name');
      if (error) throw error;
      return data;
    },
  });

  const filteredDevelopments = useMemo(() => {
    if (!developments) return [];

    let filtered = developments;

    // Apply search
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(dev =>
        dev.name?.toLowerCase().includes(search) ||
        (dev.location as string)?.toLowerCase().includes(search) ||
        dev.developer?.toLowerCase().includes(search)
      );
    }

    // Apply filters
    if (filters.noImages) {
      filtered = filtered.filter(dev => !dev.images || (Array.isArray(dev.images) && dev.images.length === 0));
    }
    if (filters.noPriceList) {
      filtered = filtered.filter(dev => !dev.prices || (typeof dev.prices === 'object' && Object.keys(dev.prices as any).length === 0));
    }
    if (filters.missingStations) {
      filtered = filtered.filter(dev => !dev.stations || (Array.isArray(dev.stations) && dev.stations.length === 0));
    }
    if (filters.missingSchools) {
      filtered = filtered.filter(dev => !dev.schools || (Array.isArray(dev.schools) && dev.schools.length === 0));
    }

    return filtered;
  }, [developments, searchTerm, filters]);

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Developments Admin</h1>
          <p className="text-muted-foreground">Manage developments, images, price lists, and metadata</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate('/admin')}>
            Back to Dashboard
          </Button>
        </div>
      </div>

      <Tabs defaultValue="developments" className="space-y-4">
        <TabsList>
          <TabsTrigger value="developments">Developments</TabsTrigger>
          <TabsTrigger value="bulk-import">Bulk Import</TabsTrigger>
          <TabsTrigger value="images" disabled={!selectedDev}>Images</TabsTrigger>
          <TabsTrigger value="pricelists" disabled={!selectedDev}>Price Lists</TabsTrigger>
          <TabsTrigger value="hottest" disabled={!selectedDev}>Hottest Unit</TabsTrigger>
          <TabsTrigger value="quality" disabled={!selectedDev}>Quality Check</TabsTrigger>
        </TabsList>

        <TabsContent value="developments">
          <DevelopmentsList 
            developments={filteredDevelopments || []} 
            onSelect={setSelectedDev}
            selectedDev={selectedDev}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            filters={filters}
            onFiltersChange={setFilters}
          />
        </TabsContent>

        <TabsContent value="bulk-import">
          <BulkImportTool />
        </TabsContent>

        <TabsContent value="images">
          {selectedDev && <ImagesManager devId={selectedDev} />}
        </TabsContent>

        <TabsContent value="pricelists">
          {selectedDev && <PriceListsManager devId={selectedDev} />}
        </TabsContent>

        <TabsContent value="hottest">
          {selectedDev && <HottestUnitManager devId={selectedDev} />}
        </TabsContent>

        <TabsContent value="quality" className="space-y-6">
          {selectedDev && (
            <MandatoryFieldsGate devId={selectedDev} />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function DevelopmentsList({ 
  developments, 
  onSelect, 
  selectedDev,
  searchTerm,
  onSearchChange,
  filters,
  onFiltersChange,
}: { 
  developments: any[]; 
  onSelect: (id: string) => void;
  selectedDev: string | null;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
}) {
  const queryClient = useQueryClient();
  const [showDialog, setShowDialog] = useState(false);
  const [editingDev, setEditingDev] = useState<any>(null);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; dev: any | null }>({ open: false, dev: null });

  const deleteMutation = useMutation({
    mutationFn: async (devId: string) => {
      const { error } = await supabase
        .from('developments')
        .delete()
        .eq('id', devId);
      if (error) throw error;
    },
    onSuccess: (_, devId) => {
      queryClient.invalidateQueries({ queryKey: ['developments'] });
      if (selectedDev === devId) {
        onSelect('');
      }
      toast.success('Development deleted');
      setDeleteDialog({ open: false, dev: null });
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete: ${error.message}`);
    },
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center mb-4">
          <div>
            <CardTitle>Developments</CardTitle>
            <CardDescription>Search, filter, and manage property developments</CardDescription>
          </div>
          <Dialog open={showDialog} onOpenChange={setShowDialog}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditingDev(null)}>
                <Plus className="mr-2 h-4 w-4" /> Add Development
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editingDev ? 'Edit' : 'Add'} Development</DialogTitle>
                <DialogDescription>
                  {editingDev ? 'Update' : 'Create a new'} development entry
                </DialogDescription>
              </DialogHeader>
              <DevelopmentForm 
                development={editingDev} 
                onClose={() => {
                  setShowDialog(false);
                  setEditingDev(null);
                }} 
              />
            </DialogContent>
          </Dialog>
        </div>
        <SearchFiltersBar
          searchValue={searchTerm}
          onSearchChange={onSearchChange}
          activeFilters={filters}
          onFiltersChange={onFiltersChange}
        />
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Developer</TableHead>
              <TableHead>Zone</TableHead>
              <TableHead>Postcode</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {developments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground">
                  No developments found
                </TableCell>
              </TableRow>
            ) : (
              developments.map((dev) => (
                <TableRow 
                  key={dev.id}
                  className={selectedDev === dev.id ? 'bg-muted' : ''}
                >
                  <TableCell className="font-mono">{dev.id}</TableCell>
                  <TableCell className="font-medium">{dev.name}</TableCell>
                  <TableCell>{dev.developer}</TableCell>
                  <TableCell>{dev.zone}</TableCell>
                  <TableCell>{dev.postcode}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {(!dev.images || dev.images.length === 0) && (
                        <Badge variant="outline" className="text-xs">No images</Badge>
                      )}
                      {(!dev.stations || dev.stations.length === 0) && (
                        <Badge variant="outline" className="text-xs">No stations</Badge>
                      )}
                      {!dev.area_overview && (
                        <Badge variant="outline" className="text-xs text-yellow-600">No overview</Badge>
                      )}
                      {!dev.postcode && (
                        <Badge variant="outline" className="text-xs text-yellow-600">No postcode</Badge>
                      )}
                      {!dev.tenure && (
                        <Badge variant="outline" className="text-xs text-yellow-600">No tenure</Badge>
                      )}
                      {(!dev.amenities || dev.amenities.length === 0) && (
                        <Badge variant="outline" className="text-xs text-yellow-600">No amenities</Badge>
                      )}
                      {(!dev.schools || dev.schools.length === 0) && (
                        <Badge variant="outline" className="text-xs text-yellow-600">No schools</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant={selectedDev === dev.id ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => onSelect(dev.id)}
                      >
                        Select
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditingDev(dev);
                          setShowDialog(true);
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleteDialog({ open: true, dev })}
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>

      <AlertDialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open, dev: null })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Development</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>{deleteDialog.dev?.name}</strong>? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteMutation.isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteDialog.dev && deleteMutation.mutate(deleteDialog.dev.id)}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}

function DevelopmentForm({ development, onClose }: { development: any; onClose: () => void }) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState(development || {
    id: '',
    name: '',
    developer: '',
    zone: 2,
    postcode: '',
    lat: null,
    lng: null,
  });

  const saveMutation = useMutation({
    mutationFn: async (data: any) => {
      const { error } = await supabase
        .from('developments')
        .upsert(data);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['developments'] });
      toast.success(development ? 'Development updated' : 'Development created');
      onClose();
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  return (
    <form 
      onSubmit={(e) => {
        e.preventDefault();
        saveMutation.mutate(formData);
      }}
      className="space-y-4"
    >
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="id">ID (slug)</Label>
          <Input
            id="id"
            value={formData.id}
            onChange={(e) => setFormData({ ...formData, id: e.target.value })}
            placeholder="krp"
            disabled={!!development}
            required
          />
        </div>
        <div>
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="King's Road Park"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="developer">Developer</Label>
          <Input
            id="developer"
            value={formData.developer}
            onChange={(e) => setFormData({ ...formData, developer: e.target.value })}
            placeholder="Berkeley"
          />
        </div>
        <div>
          <Label htmlFor="zone">Zone</Label>
          <Input
            id="zone"
            type="number"
            value={formData.zone}
            onChange={(e) => setFormData({ ...formData, zone: parseInt(e.target.value) })}
          />
        </div>
        <div>
          <Label htmlFor="postcode">Postcode</Label>
          <Input
            id="postcode"
            value={formData.postcode}
            onChange={(e) => setFormData({ ...formData, postcode: e.target.value })}
            placeholder="SW6"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="lat">Latitude</Label>
          <Input
            id="lat"
            type="number"
            step="any"
            value={formData.lat || ''}
            onChange={(e) => setFormData({ ...formData, lat: e.target.value ? parseFloat(e.target.value) : null })}
          />
        </div>
        <div>
          <Label htmlFor="lng">Longitude</Label>
          <Input
            id="lng"
            type="number"
            step="any"
            value={formData.lng || ''}
            onChange={(e) => setFormData({ ...formData, lng: e.target.value ? parseFloat(e.target.value) : null })}
          />
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={saveMutation.isPending}>
          {saveMutation.isPending ? 'Saving...' : 'Save'}
        </Button>
      </div>
    </form>
  );
}

function ImagesManager({ devId }: { devId: string }) {
  const queryClient = useQueryClient();
  const [uploading, setUploading] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const { data: development } = useQuery({
    queryKey: ['development', devId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('developments')
        .select('*')
        .eq('id', devId)
        .single();
      if (error) throw error;
      return data;
    },
  });

  const images = development?.images || [];
  const coverIndex = development?.cover_image_index || 0;
  const hiddenImages = development?.hidden_images || [];

  const handleUpload = async (files: FileList) => {
    setUploading(true);
    try {
      const newImages = [];
      
      for (const file of Array.from(files)) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${devId}/${crypto.randomUUID()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('dev-images')
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('dev-images')
          .getPublicUrl(fileName);

        newImages.push({
          alt: file.name.replace(/\.[^/.]+$/, ''),
          sources: [{ src: publicUrl, width: 1280 }]
        });
      }

      const { error: updateError } = await supabase
        .from('developments')
        .update({ 
          images: [...images, ...newImages],
          updated_at: new Date().toISOString()
        })
        .eq('id', devId);

      if (updateError) throw updateError;

      queryClient.invalidateQueries({ queryKey: ['development', devId] });
      toast.success(`Uploaded ${newImages.length} image(s)`);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (index: number) => {
    const newImages = images.filter((_: any, i: number) => i !== index);
    const { error } = await supabase
      .from('developments')
      .update({ images: newImages })
      .eq('id', devId);

    if (error) {
      toast.error(error.message);
    } else {
      queryClient.invalidateQueries({ queryKey: ['development', devId] });
      toast.success('Image removed');
    }
  };

  const handleSetCover = async (index: number) => {
    const { error } = await supabase
      .from('developments')
      .update({ cover_image_index: index })
      .eq('id', devId);

    if (error) {
      toast.error(error.message);
    } else {
      queryClient.invalidateQueries({ queryKey: ['development', devId] });
      toast.success('Cover image updated');
    }
  };

  const handleToggleHidden = async (index: number) => {
    const isHidden = hiddenImages.includes(index);
    const newHidden = isHidden
      ? hiddenImages.filter((i: number) => i !== index)
      : [...hiddenImages, index];

    const { error } = await supabase
      .from('developments')
      .update({ hidden_images: newHidden })
      .eq('id', devId);

    if (error) {
      toast.error(error.message);
    } else {
      queryClient.invalidateQueries({ queryKey: ['development', devId] });
      toast.success(isHidden ? 'Image shown' : 'Image hidden');
    }
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newImages = [...images];
    const draggedItem = newImages[draggedIndex];
    newImages.splice(draggedIndex, 1);
    newImages.splice(index, 0, draggedItem);

    // Update immediately in database
    supabase
      .from('developments')
      .update({ images: newImages })
      .eq('id', devId)
      .then(() => {
        queryClient.invalidateQueries({ queryKey: ['development', devId] });
      });

    setDraggedIndex(index);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Images for {development?.name}</CardTitle>
        <CardDescription>Upload, reorder, set cover, and manage gallery images</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div
          className="border-2 border-dashed rounded-lg p-8 text-center hover:bg-muted/50 transition-colors cursor-pointer"
          onClick={() => document.getElementById('file-upload')?.click()}
        >
          <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-sm text-muted-foreground mb-2">
            Click to upload or drag and drop
          </p>
          <p className="text-xs text-muted-foreground">
            PNG, JPG, WEBP up to 10MB
          </p>
          <input
            id="file-upload"
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={(e) => e.target.files && handleUpload(e.target.files)}
            disabled={uploading}
          />
        </div>

        {uploading && <p className="text-sm text-center">Uploading...</p>}

        <div className="grid grid-cols-3 gap-4">
          {images.map((img: any, idx: number) => {
            const isHidden = hiddenImages.includes(idx);
            const isCover = idx === coverIndex;

            return (
              <div
                key={idx}
                draggable
                onDragStart={() => handleDragStart(idx)}
                onDragOver={(e) => handleDragOver(e, idx)}
                className={`relative group cursor-move ${isHidden ? 'opacity-40' : ''}`}
              >
                <div className="absolute top-2 left-2 z-10">
                  <GripVertical className="h-5 w-5 text-white drop-shadow-lg" />
                </div>
                {isCover && (
                  <Badge className="absolute top-2 right-2 z-10 bg-yellow-500">
                    <Star className="h-3 w-3 mr-1" />
                    Cover
                  </Badge>
                )}
                <img
                  src={img.sources[0]?.src}
                  alt={img.alt}
                  className="w-full h-48 object-cover rounded-lg"
                />
                <div className="absolute bottom-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleSetCover(idx)}
                    title="Set as cover"
                  >
                    <Star className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleToggleHidden(idx)}
                    title={isHidden ? 'Show' : 'Hide'}
                  >
                    {isHidden ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(idx)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

function PriceListsManager({ devId }: { devId: string }) {
  const [uploading, setUploading] = useState(false);
  const queryClient = useQueryClient();

  const { data: priceLists } = useQuery<PriceList[]>({
    queryKey: ['price-lists', devId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('price_lists' as any)
        .select('*')
        .eq('dev_id', devId)
        .order('uploaded_at', { ascending: false });
      if (error) throw error;
      return (data || []) as unknown as PriceList[];
    },
  });

  const handleUpload = async (file: File) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('dev_id', devId);
      formData.append('file', file);

      const { data, error } = await supabase.functions.invoke('ingest', {
        body: formData,
      });

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['price-lists', devId] });
      toast.success('Price list uploaded and parsed');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setUploading(false);
    }
  };

  const downloadTemplate = () => {
    const csvContent = 'unit_code,beds,size_sqft,price,status\nA101,1,450,450000,Available\nA102,2,750,650000,Under Offer';
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'price-list-template.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Price Lists</CardTitle>
            <CardDescription>Upload and manage price lists with rollback support</CardDescription>
          </div>
          <div className="flex gap-2">
            <RollbackDialog 
              devId={devId} 
              onRollbackComplete={() => queryClient.invalidateQueries({ queryKey: ['price-lists', devId] })} 
            />
            <Button variant="outline" size="sm" onClick={downloadTemplate}>
              <Download className="mr-2 h-4 w-4" /> CSV Template
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div
          className="border-2 border-dashed rounded-lg p-8 text-center hover:bg-muted/50 transition-colors cursor-pointer"
          onClick={() => document.getElementById('csv-upload')?.click()}
        >
          <FileSpreadsheet className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-sm text-muted-foreground mb-2">
            Click to upload a price list
          </p>
          <p className="text-xs text-muted-foreground">
            CSV or XLSX up to 50MB
          </p>
          <input
            id="csv-upload"
            type="file"
            accept=".csv,.xlsx,.xls"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
            disabled={uploading}
          />
        </div>

        {uploading && <p className="text-sm text-center">Uploading and parsing...</p>}

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Uploaded</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Notes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!priceLists || priceLists.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground">
                  No price lists uploaded yet
                </TableCell>
              </TableRow>
            ) : (
              priceLists.map((pl) => (
                <TableRow key={pl.id}>
                  <TableCell>
                    {new Date(pl.uploaded_at).toLocaleString()}
                  </TableCell>
                  <TableCell>{pl.source}</TableCell>
                  <TableCell>
                    {pl.parsed_ok ? (
                      <Badge variant="default">Parsed ✓</Badge>
                    ) : (
                      <Badge variant="outline">Pending</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {pl.notes}
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

