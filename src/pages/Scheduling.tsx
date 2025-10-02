import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, Flame, Mail } from 'lucide-react';

interface ScheduledTask {
  id: string;
  task_name: string;
  enabled: boolean;
  schedule: string;
  last_run: string | null;
  next_run: string | null;
}

export default function Scheduling() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: tasks, isLoading } = useQuery({
    queryKey: ['scheduled-tasks'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('scheduled_tasks')
        .select('*')
        .order('task_name');

      if (error) throw error;
      return data as ScheduledTask[];
    },
  });

  const toggleMutation = useMutation({
    mutationFn: async ({ id, enabled }: { id: string; enabled: boolean }) => {
      const { error } = await supabase
        .from('scheduled_tasks')
        .update({ enabled })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scheduled-tasks'] });
      toast({
        title: 'Task updated',
        description: 'Scheduled task status changed',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const getTaskIcon = (taskName: string) => {
    if (taskName.includes('hottest')) return <Flame className="h-5 w-5 text-orange-500" />;
    if (taskName.includes('email')) return <Mail className="h-5 w-5 text-blue-500" />;
    return <Clock className="h-5 w-5" />;
  };

  const getTaskDescription = (taskName: string) => {
    switch (taskName) {
      case 'nightly_hottest_refresh':
        return 'Recalculate hottest units for all developments every night at 2 AM';
      case 'monday_summary_email':
        return 'Send weekly summary email to admins every Monday at 9 AM';
      default:
        return 'Automated task';
    }
  };

  const formatCron = (schedule: string) => {
    const parts = schedule.split(' ');
    if (parts.length !== 5) return schedule;
    
    const [minute, hour, day, month, weekday] = parts;
    
    if (weekday !== '*') {
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      return `Every ${days[parseInt(weekday)]} at ${hour}:${minute.padStart(2, '0')}`;
    }
    
    if (day === '*' && month === '*') {
      return `Daily at ${hour}:${minute.padStart(2, '0')}`;
    }
    
    return schedule;
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Scheduled Tasks</h1>
            <p className="text-muted-foreground">
              Configure automated tasks and schedules
            </p>
          </div>
          <Button variant="outline" onClick={() => navigate('/admin')}>
            Back to Admin
          </Button>
        </div>

        {isLoading ? (
          <Card>
            <CardContent className="p-12 text-center text-muted-foreground">
              Loading tasks...
            </CardContent>
          </Card>
        ) : !tasks || tasks.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center text-muted-foreground">
              No scheduled tasks configured
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {tasks.map((task) => (
              <Card key={task.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      {getTaskIcon(task.task_name)}
                      <div className="space-y-1">
                        <CardTitle className="flex items-center gap-2">
                          {task.task_name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          {task.enabled ? (
                            <Badge variant="default">Enabled</Badge>
                          ) : (
                            <Badge variant="outline">Disabled</Badge>
                          )}
                        </CardTitle>
                        <CardDescription>
                          {getTaskDescription(task.task_name)}
                        </CardDescription>
                      </div>
                    </div>
                    <Switch
                      checked={task.enabled}
                      onCheckedChange={(enabled) =>
                        toggleMutation.mutate({ id: task.id, enabled })
                      }
                      disabled={toggleMutation.isPending}
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Schedule:</span>
                      <p className="font-medium flex items-center gap-2 mt-1">
                        <Calendar className="h-4 w-4" />
                        {formatCron(task.schedule)}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Last Run:</span>
                      <p className="font-medium flex items-center gap-2 mt-1">
                        <Clock className="h-4 w-4" />
                        {task.last_run
                          ? new Date(task.last_run).toLocaleString()
                          : 'Never'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <Card className="mt-6 border-blue-200 bg-blue-50 dark:bg-blue-950">
          <CardHeader>
            <CardTitle className="text-blue-900 dark:text-blue-100">
              Note about Scheduled Tasks
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-blue-800 dark:text-blue-200">
            <p>
              Scheduled tasks require backend cron jobs to be set up. Toggling these
              switches updates the configuration, but the actual execution requires
              additional setup in your backend infrastructure.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
