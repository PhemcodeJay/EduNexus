import { PageContainer } from "@/components/layout/PageContainer";
import { useCourses, useCreateCourse, useTeachers, useUsers } from "@/hooks/use-sms";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, BookOpen, Clock, User, Eye } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
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
import { insertCourseSchema } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const formSchema = insertCourseSchema.extend({
  teacherId: z.coerce.number(),
});

export default function Courses() {
  const { data: courses, isLoading } = useCourses();
  const { data: teachers } = useTeachers();
  const { data: users } = useUsers();
  const createCourse = useCreateCourse();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      schedule: "",
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    createCourse.mutate(data, {
      onSuccess: () => {
        setOpen(false);
        form.reset();
        toast({
          title: "Course Created",
          description: "New course has been added successfully.",
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

  const getTeacherName = (teacherId: number | null) => {
    if (!teacherId) return "Unassigned";
    const teacher = (teachers as any[])?.find((t: any) => t.id === teacherId);
    if (!teacher) return "Unknown";
    return teacher.fullName || "Unknown";
  };

  return (
    <PageContainer 
      title="Courses" 
      description="Available academic courses and schedules."
      action={
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 shadow-lg hover:shadow-primary/25">
              <Plus className="w-4 h-4" /> Create Course
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Course</DialogTitle>
              <DialogDescription>Add a new subject to the curriculum.</DialogDescription>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="courseCode">Course Code</Label>
                <Input id="courseCode" {...form.register("courseCode")} placeholder="e.g. PHYS101" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Course Name</Label>
                <Input id="name" {...form.register("name")} placeholder="e.g. Advanced Physics" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="teacherId">Assigned Teacher</Label>
                <Select onValueChange={(val) => form.setValue("teacherId", parseInt(val))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a teacher" />
                  </SelectTrigger>
                  <SelectContent>
                    {(teachers as any[])?.map((teacher: any) => (
                      <SelectItem key={teacher.id} value={teacher.id.toString()}>
                        {teacher.fullName} ({teacher.specialization})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="schedule">Schedule</Label>
                <Input id="schedule" {...form.register("schedule")} placeholder="e.g. Mon/Wed 10:00 AM" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" {...form.register("description")} placeholder="Course details..." />
              </div>
              <div className="flex justify-end pt-4">
                <Button type="submit" disabled={createCourse.isPending}>
                  {createCourse.isPending ? "Creating..." : "Create Course"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      }
    >
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          [1,2,3].map(i => <div key={i} className="h-64 bg-muted/20 animate-pulse rounded-xl" />)
        ) : (
          (courses as any[])?.map((course: any) => (
            <Card key={course.id} className="card-hover border-border/50 shadow-sm flex flex-col">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-3">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <Badge variant="secondary" className="font-mono">
                    {course.courseCode}
                  </Badge>
                </div>
                <CardTitle className="font-display text-xl">{course.name}</CardTitle>
                <CardDescription className="line-clamp-2 min-h-[40px]">
                  {course.description || "No description provided."}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 flex-1">
                <div className="flex items-center text-sm text-muted-foreground gap-2">
                  <User className="w-4 h-4" />
                  <span>{getTeacherName(course.teacherId)}</span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{course.schedule || "TBA"}</span>
                </div>
              </CardContent>
              <CardFooter className="pt-4 border-t border-border/50">
                <Button 
                  variant="outline" 
                  className="w-full gap-2"
                  onClick={() => window.location.href = `/courses/${course.id}`}
                >
                  <Eye className="w-4 h-4" />
                  View Course
                </Button>
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </PageContainer>
  );
}
