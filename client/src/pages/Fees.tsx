import { PageContainer } from "@/components/layout/PageContainer";
import { useFees, useCreateFee, useStudents, useUsers } from "@/hooks/use-sms";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, DollarSign, CheckCircle2, XCircle } from "lucide-react";
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
  DialogHeader,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { insertFeeSchema } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

const formSchema = insertFeeSchema.extend({
  studentId: z.coerce.number(),
  amount: z.coerce.number(),
});

export default function Fees() {
  const { data: fees, isLoading } = useFees();
  const { data: students } = useStudents();
  const { data: users } = useUsers();
  const createFee = useCreateFee();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: 0,
      description: "",
      paid: false,
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    createFee.mutate(data, {
      onSuccess: () => {
        setOpen(false);
        form.reset();
        toast({
          title: "Fee Record Created",
          description: "Payment request has been generated.",
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

  const getStudentName = (studentId: number) => {
    const student = (students as any[])?.find((s: any) => s.id === studentId);
    if (!student) return "Unknown";
    const user = (users as any[])?.find((u: any) => u.id === student.userId);
    return user?.firstName || "Unknown";
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount / 100);
  };

  return (
    <PageContainer 
      title="Financial Records" 
      description="Track student fees and payments."
      action={
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 shadow-lg hover:shadow-primary/25 bg-green-600 hover:bg-green-700">
              <Plus className="w-4 h-4" /> Record Fee
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Fee Record</DialogTitle>
              <DialogDescription>
                Generate a new payment request for a student.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="studentId">Student ID</Label>
                <Input id="studentId" {...form.register("studentId")} placeholder="Student ID" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">Amount (Cents)</Label>
                <Input id="amount" type="number" {...form.register("amount")} placeholder="e.g. 50000 for $500.00" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input id="description" {...form.register("description")} placeholder="e.g. Tuition Term 1" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dueDate">Due Date</Label>
                <Input id="dueDate" type="date" {...form.register("dueDate")} />
              </div>
              <div className="flex justify-end pt-4">
                <Button type="submit" disabled={createFee.isPending}>
                  {createFee.isPending ? "Processing..." : "Create Record"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      }
    >
      <div className="grid gap-6 md:grid-cols-3 mb-8">
         <Card className="bg-gradient-to-br from-primary/80 to-primary text-primary-foreground border-none shadow-lg">
           <CardContent className="p-6">
             <div className="flex items-center justify-between mb-4">
               <span className="text-primary-foreground/80 font-medium">Total Collections</span>
               <DollarSign className="w-5 h-5 opacity-80" />
             </div>
             <div className="text-3xl font-bold font-display">$45,200.00</div>
             <div className="mt-2 text-sm text-primary-foreground/70">+12% from last month</div>
           </CardContent>
         </Card>
         <Card className="bg-card border-none shadow-md">
           <CardContent className="p-6">
             <div className="flex items-center justify-between mb-4">
               <span className="text-muted-foreground font-medium">Pending Payments</span>
               <ClockIcon className="w-5 h-5 text-orange-500" />
             </div>
             <div className="text-3xl font-bold font-display text-foreground">$12,450.00</div>
             <div className="mt-2 text-sm text-muted-foreground">34 students pending</div>
           </CardContent>
         </Card>
      </div>

      <Card className="border-none shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-secondary/30">
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={6} className="text-center h-24">Loading records...</TableCell></TableRow>
              ) : (
                (fees as any[])?.map((fee: any) => (
                  <TableRow key={fee.id}>
                    <TableCell className="font-medium">{getStudentName(fee.studentId)}</TableCell>
                    <TableCell>{fee.description}</TableCell>
                    <TableCell>{formatCurrency(fee.amount)}</TableCell>
                    <TableCell>{fee.dueDate || "N/A"}</TableCell>
                    <TableCell>
                      {fee.paid ? (
                         <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-200 flex w-fit items-center gap-1">
                           <CheckCircle2 className="w-3 h-3" /> Paid
                         </Badge>
                      ) : (
                         <Badge variant="outline" className="bg-red-500/10 text-red-600 border-red-200 flex w-fit items-center gap-1">
                           <XCircle className="w-3 h-3" /> Pending
                         </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">Details</Button>
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

function ClockIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}
