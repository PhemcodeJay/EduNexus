import { PageContainer } from "@/components/layout/PageContainer";
import { useCourse } from "@/hooks/use-sms";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Clock, User, ArrowLeft } from "lucide-react";
import { useRoute } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export default function CourseDetail() {
  const [, navigate] = useRoute("/courses/:id");
  const [, params] = useRoute("/courses/:id");
  const id = params?.id ? parseInt(params.id) : 0;
  const { data: course, isLoading } = useCourse(id);

  const formatContent = (content: string | null) => {
    if (!content) return null;
    
    // Split content into sections based on chapter markers or double newlines
    const sections = content.split(/\n\n+/);
    
    return sections.map((section, index) => {
      // Check if it's a chapter header
      if (section.match(/^(CHAPTER|PREFACE|ACKNOWLEDGEMENT|INTRODUCTION|SUMMARY)/i)) {
        return (
          <div key={index} className="mb-8">
            <h2 className="text-2xl font-bold font-display text-primary mb-4 pb-2 border-b border-border">
              {section}
            </h2>
          </div>
        );
      }
      
      // Check if it's a main title
      if (section.match(/^CRYPTO MADE SIMPLE|^THE ESSENTIAL TRADING GUIDE/i)) {
        return (
          <div key={index} className="mb-6 text-center">
            <h1 className="text-3xl font-bold font-display text-primary mb-2">
              {section.split('\n')[0]}
            </h1>
            {section.split('\n')[1] && (
              <p className="text-lg text-muted-foreground italic">
                {section.split('\n')[1]}
              </p>
            )}
          </div>
        );
      }
      
      // Regular paragraph
      return (
        <p key={index} className="mb-4 text-foreground leading-relaxed">
          {section}
        </p>
      );
    });
  };

  const getTeacherName = (teacherId: number | null) => {
    // This is a simplified version - in a real app you'd fetch the teacher name
    return teacherId ? `Teacher ID: ${teacherId}` : "Unassigned";
  };

  return (
    <PageContainer 
      title="Course Details" 
      description="View course materials and content"
    >
        <Button 
          variant="ghost" 
          className="mb-4"
          onClick={() => window.location.href = "/courses"}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Courses
        </Button>

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-64 w-full" />
        </div>
      ) : course ? (
        <div className="space-y-6">
          {/* Course Header */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start mb-2">
                <Badge variant="secondary" className="font-mono">
                  {course.courseCode}
                </Badge>
                {course.contentType === "pdf" && (
                  <Badge variant="outline">PDF Course</Badge>
                )}
              </div>
              <CardTitle className="font-display text-3xl mb-2">
                {course.name}
              </CardTitle>
              <CardDescription className="text-base">
                {course.description || "No description provided."}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center text-sm text-muted-foreground gap-2">
                <User className="w-4 h-4" />
                <span>{getTeacherName(course.teacherId)}</span>
              </div>
              <div className="flex items-center text-sm text-muted-foreground gap-2">
                <Clock className="w-4 h-4" />
                <span>{course.schedule || "TBA"}</span>
              </div>
              <div className="flex items-center text-sm text-muted-foreground gap-2">
                <BookOpen className="w-4 h-4" />
                <span>{course.contentType === "pdf" ? "PDF Material" : "Standard Course"}</span>
              </div>
            </CardContent>
          </Card>

          {/* Course Content */}
          {course.content && (
            <Card>
              <CardHeader>
                <CardTitle className="font-display text-2xl">Course Content</CardTitle>
                <CardDescription>
                  {course.contentType === "pdf" ? "Digital course material" : "Course materials"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="prose prose-slate max-w-none dark:prose-invert">
                  <div className="bg-muted/30 p-6 rounded-lg">
                    {formatContent(course.content)}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {!course.content && (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No content available for this course yet.</p>
              </CardContent>
            </Card>
          )}
        </div>
      ) : (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground">Course not found</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => window.location.href = "/courses"}
            >
              Return to Courses
            </Button>
          </CardContent>
        </Card>
      )}
    </PageContainer>
  );
}