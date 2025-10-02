import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { PlayCircle, CheckCircle, XCircle, Download, Loader2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function Discovery() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [reviewNotes, setReviewNotes] = useState("");

  // Fetch developers
  const { data: developers } = useQuery({
    queryKey: ["developer-registry"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("developer_registry")
        .select("*")
        .eq("active", true)
        .order("name");
      if (error) throw error;
      return data;
    },
  });

  // Fetch discovery queue
  const { data: queueItems, isLoading: queueLoading } = useQuery({
    queryKey: ["discovery-queue"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("discovery_queue")
        .select("*, developer_registry(name)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  // Fetch scrape jobs
  const { data: scrapeJobs } = useQuery({
    queryKey: ["scrape-jobs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("scrape_jobs")
        .select("*, developer_registry(name)")
        .order("created_at", { ascending: false })
        .limit(20);
      if (error) throw error;
      return data;
    },
  });

  // Start discovery scrape
  const startDiscovery = useMutation({
    mutationFn: async (developerId: string) => {
      const { data, error } = await supabase.functions.invoke("discover-developments", {
        body: { developer_id: developerId },
      });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({ title: "Discovery started", description: "Scraping developer websites..." });
      queryClient.invalidateQueries({ queryKey: ["scrape-jobs"] });
      queryClient.invalidateQueries({ queryKey: ["discovery-queue"] });
    },
    onError: (error: Error) => {
      toast({ title: "Discovery failed", description: error.message, variant: "destructive" });
    },
  });

  // Review actions
  const reviewAction = useMutation({
    mutationFn: async ({ id, action }: { id: string; action: "approve" | "reject" | "import" }) => {
      const updates: any = {
        status: action === "import" ? "imported" : action === "approve" ? "approved" : "rejected",
        reviewed_at: new Date().toISOString(),
        notes: reviewNotes,
      };

      if (action === "import") {
        updates.imported_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from("discovery_queue")
        .update(updates)
        .eq("id", id);

      if (error) throw error;

      // If importing, trigger the import function
      if (action === "import") {
        const { error: importError } = await supabase.functions.invoke("import-discovered-development", {
          body: { queue_id: id },
        });
        if (importError) throw importError;
      }
    },
    onSuccess: (_, variables) => {
      toast({
        title: `Development ${variables.action}ed`,
        description: variables.action === "import" ? "Development imported successfully" : undefined,
      });
      queryClient.invalidateQueries({ queryKey: ["discovery-queue"] });
      setSelectedItem(null);
      setReviewNotes("");
    },
    onError: (error: Error) => {
      toast({ title: "Action failed", description: error.message, variant: "destructive" });
    },
  });

  const londonPending = queueItems?.filter((item) => item.is_london && item.status === "pending") || [];
  const otherPending = queueItems?.filter((item) => !item.is_london && item.status === "pending") || [];
  const reviewed = queueItems?.filter((item) => item.status !== "pending") || [];

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Development Discovery</h1>
        <p className="text-muted-foreground">
          Discover, scrape, review, and import developments from registered developers
        </p>
      </div>

      {/* Developer List - Start Discovery */}
      <Card className="p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Start Discovery</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {developers?.map((dev) => (
            <Card key={dev.id} className="p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">{dev.name}</h3>
                <Badge variant="secondary">{(dev.index_urls as string[]).length} URLs</Badge>
              </div>
              <Button
                size="sm"
                onClick={() => startDiscovery.mutate(dev.id)}
                disabled={startDiscovery.isPending}
                className="w-full"
              >
                {startDiscovery.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <PlayCircle className="h-4 w-4 mr-2" />
                )}
                Discover
              </Button>
            </Card>
          ))}
        </div>
      </Card>

      {/* Recent Scrape Jobs */}
      {scrapeJobs && scrapeJobs.length > 0 && (
        <Card className="p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Recent Scrape Jobs</h2>
          <div className="space-y-2">
            {scrapeJobs.slice(0, 5).map((job) => (
              <div key={job.id} className="flex items-center justify-between p-3 border rounded">
                <div>
                  <span className="font-medium">{job.developer_registry?.name}</span>
                  <span className="text-sm text-muted-foreground ml-2">
                    {job.discovered_count} discovered
                  </span>
                </div>
                <Badge
                  variant={
                    job.status === "completed"
                      ? "default"
                      : job.status === "failed"
                      ? "destructive"
                      : "secondary"
                  }
                >
                  {job.status}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Discovery Queue */}
      <Tabs defaultValue="london" className="space-y-4">
        <TabsList>
          <TabsTrigger value="london">
            London ({londonPending.length})
          </TabsTrigger>
          <TabsTrigger value="other">
            Other Locations ({otherPending.length})
          </TabsTrigger>
          <TabsTrigger value="reviewed">
            Reviewed ({reviewed.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="london" className="space-y-4">
          {queueLoading ? (
            <div className="text-center py-8">
              <Loader2 className="h-8 w-8 animate-spin mx-auto" />
            </div>
          ) : londonPending.length === 0 ? (
            <Card className="p-8 text-center text-muted-foreground">
              No London developments pending review
            </Card>
          ) : (
            londonPending.map((item) => (
              <QueueItemCard
                key={item.id}
                item={item}
                onReview={() => setSelectedItem(item)}
              />
            ))
          )}
        </TabsContent>

        <TabsContent value="other" className="space-y-4">
          {otherPending.length === 0 ? (
            <Card className="p-8 text-center text-muted-foreground">
              No other developments pending review
            </Card>
          ) : (
            otherPending.map((item) => (
              <QueueItemCard
                key={item.id}
                item={item}
                onReview={() => setSelectedItem(item)}
              />
            ))
          )}
        </TabsContent>

        <TabsContent value="reviewed" className="space-y-4">
          {reviewed.length === 0 ? (
            <Card className="p-8 text-center text-muted-foreground">
              No reviewed developments
            </Card>
          ) : (
            reviewed.map((item) => (
              <QueueItemCard
                key={item.id}
                item={item}
                reviewed
              />
            ))
          )}
        </TabsContent>
      </Tabs>

      {/* Review Dialog */}
      <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedItem?.name}</DialogTitle>
          </DialogHeader>
          
          {selectedItem && (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Developer</p>
                <p className="font-medium">{selectedItem.developer_registry?.name}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1">Location</p>
                <p>{selectedItem.location || "Not specified"}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1">Source URL</p>
                <a
                  href={selectedItem.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline text-sm"
                >
                  {selectedItem.url}
                </a>
              </div>

              {selectedItem.images && (selectedItem.images as string[]).length > 0 && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Images ({(selectedItem.images as string[]).length})
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {(selectedItem.images as string[]).slice(0, 6).map((img: string, idx: number) => (
                      <img
                        key={idx}
                        src={img}
                        alt={`Preview ${idx + 1}`}
                        className="w-full h-32 object-cover rounded"
                      />
                    ))}
                  </div>
                </div>
              )}

              <div>
                <p className="text-sm text-muted-foreground mb-2">Scraped Data</p>
                <pre className="bg-muted p-3 rounded text-xs overflow-auto max-h-40">
                  {JSON.stringify(selectedItem.scraped_data, null, 2)}
                </pre>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Review Notes</label>
                <Textarea
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  placeholder="Add notes about this development..."
                  rows={3}
                />
              </div>

              <div className="flex gap-2 justify-end">
                <Button
                  variant="destructive"
                  onClick={() => reviewAction.mutate({ id: selectedItem.id, action: "reject" })}
                  disabled={reviewAction.isPending}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => reviewAction.mutate({ id: selectedItem.id, action: "approve" })}
                  disabled={reviewAction.isPending}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve
                </Button>
                <Button
                  onClick={() => reviewAction.mutate({ id: selectedItem.id, action: "import" })}
                  disabled={reviewAction.isPending}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Import to Database
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function QueueItemCard({
  item,
  onReview,
  reviewed = false,
}: {
  item: any;
  onReview?: () => void;
  reviewed?: boolean;
}) {
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-semibold">{item.name}</h3>
            {item.is_london && <Badge>London</Badge>}
            {reviewed && (
              <Badge
                variant={
                  item.status === "imported"
                    ? "default"
                    : item.status === "approved"
                    ? "secondary"
                    : "destructive"
                }
              >
                {item.status}
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground mb-1">
            {item.developer_registry?.name} • {item.location || "Location not specified"}
          </p>
          <p className="text-xs text-muted-foreground">
            {(item.images as string[])?.length || 0} images • Scraped{" "}
            {new Date(item.created_at).toLocaleDateString()}
          </p>
          {item.notes && (
            <p className="text-sm mt-2 p-2 bg-muted rounded">{item.notes}</p>
          )}
        </div>
        {!reviewed && onReview && (
          <Button onClick={onReview} size="sm">
            Review
          </Button>
        )}
      </div>
    </Card>
  );
}