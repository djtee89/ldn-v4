import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Upload, Plus, Image as ImageIcon, FileSpreadsheet, Trash2, Download } from "lucide-react";

type PriceList = {
  id: string;
  dev_id: string;
  file_path: string;
  source: string;
  received_at: string;
  parsed_ok: boolean;
  notes: string | null;
};

export default function AdminDevelopments() {
  const [selectedDev, setSelectedDev] = useState<string | null>(null);
  const [showDevDialog, setShowDevDialog] = useState(false);
  const queryClient = useQueryClient();

  // Fetch all developments
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

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Admin: Developments</h1>
          <p className="text-muted-foreground">Manage developments, price lists, and images</p>
        </div>
      </div>

      <Tabs defaultValue="developments" className="space-y-4">
        <TabsList>
          <TabsTrigger value="developments">Developments</TabsTrigger>
          <TabsTrigger value="images" disabled={!selectedDev}>Images</TabsTrigger>
          <TabsTrigger value="pricelists" disabled={!selectedDev}>Price Lists</TabsTrigger>
        </TabsList>

        <TabsContent value="developments">
          <DevelopmentsList 
            developments={developments || []} 
            onSelect={setSelectedDev}
            selectedDev={selectedDev}
          />
        </TabsContent>

        <TabsContent value="images">
          {selectedDev && <ImagesManager devId={selectedDev} />}
        </TabsContent>

        <TabsContent value="pricelists">
          {selectedDev && <PriceListsManager devId={selectedDev} />}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function DevelopmentsList({ 
  developments, 
  onSelect, 
  selectedDev 
}: { 
  developments: any[]; 
  onSelect: (id: string) => void;
  selectedDev: string | null;
}) {
  const [showDialog, setShowDialog] = useState(false);
  const [editingDev, setEditingDev] = useState<any>(null);

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Developments</CardTitle>
            <CardDescription>Manage your property developments</CardDescription>
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
              <TableHead>Last Updated</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {developments.map((dev) => (
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
                  {dev.updated_at ? new Date(dev.updated_at).toLocaleDateString() : '-'}
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
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
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
    borough: '',
    postcode: '',
    site_url: '',
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

      <div>
        <Label htmlFor="borough">Borough</Label>
        <Input
          id="borough"
          value={formData.borough}
          onChange={(e) => setFormData({ ...formData, borough: e.target.value })}
          placeholder="Hammersmith & Fulham"
        />
      </div>

      <div>
        <Label htmlFor="site_url">Site URL</Label>
        <Input
          id="site_url"
          type="url"
          value={formData.site_url}
          onChange={(e) => setFormData({ ...formData, site_url: e.target.value })}
          placeholder="https://..."
        />
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Images for {development?.name}</CardTitle>
        <CardDescription>Upload and manage gallery images</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
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
            {images.map((img: any, idx: number) => (
              <div key={idx} className="relative group">
                <img
                  src={img.sources[0]?.src}
                  alt={img.alt}
                  className="w-full h-48 object-cover rounded-lg"
                />
                <Button
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => handleDelete(idx)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function PriceListsManager({ devId }: { devId: string }) {
  const [uploading, setUploading] = useState(false);
  const [selectedPriceList, setSelectedPriceList] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: priceLists } = useQuery<PriceList[]>({
    queryKey: ['price-lists', devId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('price_lists' as any)
        .select('*')
        .eq('dev_id', devId)
        .order('received_at', { ascending: false });
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
      setSelectedPriceList(data.price_list_id);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setUploading(false);
    }
  };

  const downloadTemplate = () => {
    const csvContent = 'Unit,Beds,Size (sq ft),Price,Status,Building,Floor\nB2.3.2,1,439,790000,Available,The Pinnacle,3\nD3.2.10,3,1160,1955000,Available,The Halo,12';
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'price-list-template.csv';
    a.click();
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Price Lists</CardTitle>
            <CardDescription>Upload and manage price lists</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={downloadTemplate}>
            <Download className="mr-2 h-4 w-4" /> CSV Template
          </Button>
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
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {priceLists?.map((pl) => (
              <TableRow key={pl.id}>
                <TableCell>
                  {new Date(pl.received_at).toLocaleString()}
                </TableCell>
                <TableCell>{pl.source}</TableCell>
                <TableCell>
                  {pl.parsed_ok ? (
                    <span className="text-green-600">Parsed ✓</span>
                  ) : (
                    <span className="text-yellow-600">Pending</span>
                  )}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {pl.notes}
                </TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedPriceList(String(pl.id))}
                  >
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
