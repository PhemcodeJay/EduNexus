import { PageContainer } from "@/components/layout/PageContainer";
import { useEvents, useCreateEvent } from "@/hooks/use-sms";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, MapPin, Calendar as CalendarIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { insertEventSchema } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

const formSchema = insertEventSchema;

export default function Events() {
  const { data: events, isLoading } = useEvents();
  const createEvent = useCreateEvent();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      location: "",
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    createEvent.mutate(data, {
      onSuccess: () => {
        setOpen(false);
        form.reset();
        toast({
          title: "Event Created",
          description: "Calendar has been updated.",
        });
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      },
    });
  };

  return (
    <PageContainer 
      title="School Events" 
      description="Upcoming activities and holidays."
      action={
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 shadow-lg hover:shadow-primary/25">
              <Plus className="w-4 h-4" /> Add Event
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Event</DialogTitle>
              <DialogDescription>
                Enter the details for the new school event below.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="title">Event Title</Label>
                <Input id="title" {...form.register("title")} placeholder="e.g. Science Fair" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input id="date" type="datetime-local" {...form.register("date", { valueAsDate: true })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" {...form.register("location")} placeholder="e.g. Main Auditorium" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" {...form.register("description")} />
              </div>
              <div className="flex justify-end pt-4">
                <Button type="submit" disabled={createEvent.isPending}>
                  {createEvent.isPending ? "Creating..." : "Create Event"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      }
    >
      <div className="space-y-4">
        {isLoading ? (
          <div>Loading events...</div>
        ) : (
          (events as any[])?.map((event: any) => (
            <Card key={event.id} className="border-l-4 border-l-primary card-hover">
              <CardContent className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                 <div className="space-y-2">
                   <h3 className="font-display font-bold text-xl">{event.title}</h3>
                   <p className="text-muted-foreground">{event.description}</p>
                   <div className="flex items-center gap-4 text-sm text-muted-foreground pt-2">
                     <span className="flex items-center gap-1">
                       <CalendarIcon className="w-4 h-4" /> 
                       {new Date(event.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                     </span>
                     {event.location && (
                       <span className="flex items-center gap-1">
                         <MapPin className="w-4 h-4" /> {event.location}
                       </span>
                     )}
                   </div>
                 </div>
                 <Button variant="outline">View Details</Button>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </PageContainer>
  );
}
