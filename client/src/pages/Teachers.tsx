import { PageContainer } from "@/components/layout/PageContainer";
import { useTeachers, useCreateTeacher, useUsers } from "@/hooks/use-sms";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Search, MoreHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { insertTeacherSchema } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

const formSchema = insertTeacherSchema.extend({
  userId: z.string(),
});

export default function Teachers() {
  const { data: teachers, isLoading } = useTeachers();
  const { data: users } = useUsers();
  const createTeacher = useCreateTeacher();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      age: 0,
      gender: "Male",
      specialization: "",
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    createTeacher.mutate(data, {
      onSuccess: () => {
        setOpen(false);
        form.reset();
        toast({
          title: "Teacher Added",
          description: "New teacher has been successfully registered.",
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

  const filteredTeachers = (teachers as any[])?.filter((teacher: any) => {
    const name = (teacher.fullName || "").toLowerCase();
    const spec = (teacher.specialization || "").toLowerCase();
    const search = searchTerm.toLowerCase();
    return name.includes(search) || spec.includes(search);
  });

  return (
    <PageContainer 
      title="Teachers" 
      description="Manage faculty and specializations."
      action={
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 shadow-lg hover:shadow-primary/25 bg-accent hover:bg-accent/90">
              <Plus className="w-4 h-4" /> Add Teacher
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Register New Teacher</DialogTitle>
              <DialogDescription>
                Enter the details for the new teacher.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="userId">User Account (ID)</Label>
                <Input 
                  id="userId" 
                  placeholder="Enter User ID" 
                  {...form.register("userId")} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input 
                  id="fullName" 
                  placeholder="Jane Smith" 
                  {...form.register("fullName")} 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input 
                    id="age" 
                    type="number"
                    {...form.register("age", { valueAsNumber: true })} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Input 
                    id="gender" 
                    placeholder="Male/Female" 
                    {...form.register("gender")} 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="specialization">Specialization</Label>
                <Input 
                  id="specialization" 
                  placeholder="e.g. Mathematics, Science" 
                  {...form.register("specialization")} 
                />
              </div>
              <div className="flex justify-end pt-4">
                <Button type="submit" disabled={createTeacher.isPending}>
                  {createTeacher.isPending ? "Creating..." : "Create Teacher"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      }
    >
      <Card className="border-none shadow-sm mb-6">
        <CardContent className="p-4 flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search by name or specialization..." 
              className="pl-10 bg-secondary/30 border-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="border-none shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-secondary/30">
              <TableRow>
                <TableHead className="w-[300px]">Teacher Name</TableHead>
                <TableHead>Age</TableHead>
                <TableHead>Gender</TableHead>
                <TableHead>Specialization</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                    Loading teachers...
                  </TableCell>
                </TableRow>
              ) : filteredTeachers?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                    No teachers found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredTeachers?.map((teacher: any) => (
                  <TableRow key={teacher.id} className="hover:bg-secondary/10 transition-colors">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-accent/10 flex items-center justify-center text-accent font-bold">
                          {(teacher.fullName || "T")[0]}
                        </div>
                        <div className="font-medium text-foreground">{teacher.fullName}</div>
                      </div>
                    </TableCell>
                    <TableCell>{teacher.age}</TableCell>
                    <TableCell>{teacher.gender}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-medium">
                        {teacher.specialization || "General"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" className="hover:bg-secondary">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </PageContainer>
  );
}
