import { PageContainer } from "@/components/layout/PageContainer";
import { StatCard } from "@/components/ui/StatCard";
import { Users, GraduationCap, BookOpen, DollarSign, TrendingUp, Calendar } from "lucide-react";
import { useUsers, useStudents, useTeachers, useCourses, useFees, useEvents } from "@/hooks/use-sms";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
  const { data: students, isLoading: loadingStudents } = useStudents();
  const { data: teachers, isLoading: loadingTeachers } = useTeachers();
  const { data: courses, isLoading: loadingCourses } = useCourses();
  const { data: fees, isLoading: loadingFees } = useFees();
  const { data: events, isLoading: loadingEvents } = useEvents();
  const { data: users } = useUsers();

  // Calculate mock stats
  const totalStudents = students?.length || 0;
  const totalTeachers = teachers?.length || 0;
  const totalCourses = courses?.length || 0;
  
  // Calculate revenue (mocked based on fees table structure if simpler)
  const totalRevenue = (fees as any[])?.reduce((acc: number, fee: any) => acc + (fee.paid ? fee.amount : 0), 0) || 0;
  const formattedRevenue = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(totalRevenue / 100);

  // Use actual events from database
  const upcomingEvents = (events as any[])?.slice(0, 3).map((event: any) => ({
    title: event.title,
    date: new Date(event.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }),
    type: event.location || "School"
  })) || [];

  // Mock chart data
  const chartData = [
    { name: 'Jan', students: 400 },
    { name: 'Feb', students: 420 },
    { name: 'Mar', students: 450 },
    { name: 'Apr', students: 480 },
    { name: 'May', students: 510 },
    { name: 'Jun', students: 505 },
  ];

  if (loadingStudents || loadingTeachers || loadingCourses || loadingEvents) {
    return (
      <PageContainer title="Dashboard" description="Welcome back, Administrator.">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer title="Dashboard" description="Overview of your institution's performance.">
      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard
          title="Total Students"
          value={totalStudents}
          icon={Users}
          description="Active enrollments"
          trend="up"
          trendValue="+12%"
          color="primary"
        />
        <StatCard
          title="Total Teachers"
          value={totalTeachers}
          icon={GraduationCap}
          description="Faculty members"
          trend="neutral"
          trendValue="+2"
          color="accent"
        />
        <StatCard
          title="Active Courses"
          value={totalCourses}
          icon={BookOpen}
          description="In progress"
          trend="up"
          trendValue="+4%"
          color="success"
        />
        <StatCard
          title="Total Revenue"
          value={formattedRevenue}
          icon={DollarSign}
          description="Collected fees"
          trend="up"
          trendValue="+8.2%"
          color="warning"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Main Chart */}
        <Card className="col-span-4 border-none shadow-md">
          <CardHeader>
            <CardTitle className="font-display">Enrollment Trends</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip 
                    cursor={{fill: 'transparent'}}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                  <Bar dataKey="students" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity / Side Panel */}
        <Card className="col-span-3 border-none shadow-md">
          <CardHeader>
            <CardTitle className="font-display">Upcoming Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {upcomingEvents.map((event, i) => (
                <div key={i} className="flex items-center">
                  <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center mr-4 shrink-0">
                    <Calendar className="w-6 h-6 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-medium leading-none">{event.title}</p>
                    <p className="text-sm text-muted-foreground">{event.date} • {event.type}</p>
                  </div>
                </div>
              ))}
              {upcomingEvents.length === 0 && (
                <p className="text-center text-muted-foreground py-8">No upcoming events</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
