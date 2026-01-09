"use client";

import { useDashboardAnalytics } from "@/lib/hooks/useDashboardAnalytics";
import { MetricCard } from "@/lib/components/Dashboard/MetricCard";
import { SubmissionStatusChart } from "@/lib/components/Dashboard/SubmissionStatusChart";
import { TimelineChart } from "@/lib/components/Dashboard/TimelineChart";
import { TopFormsChart } from "@/lib/components/Dashboard/TopFormsChart";
import { FormSubmissionsChart } from "@/lib/components/Dashboard/FormSubmissionsChart";
import { ApprovalStatusChart } from "@/lib/components/Dashboard/ApprovalStatusChart";
import { FileText, ClipboardList, CheckCircle, Clock, RefreshCw } from "lucide-react";
import { Skeleton } from "@/lib/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/lib/ui/card";
import { Button } from "@/lib/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/lib/ui/alert";
import { AlertCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/lib/ui/tabs";

function DashboardSkeleton() {
  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div>
        <Skeleton className="h-8 w-64 mb-2" />
        <Skeleton className="h-4 w-96" />
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader className="space-y-0 pb-2">
              <Skeleton className="h-4 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-20 mb-2" />
              <Skeleton className="h-3 w-24" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-48 mb-2" />
              <Skeleton className="h-4 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[300px] w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function ErrorState({ error, onRetry }: { error: string; onRetry: () => void }) {
  return (
    <div className="container mx-auto p-6">
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          {error}
          <Button
            variant="outline"
            size="sm"
            onClick={onRetry}
            className="ml-4"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </AlertDescription>
      </Alert>
    </div>
  );
}

function UserSubmissionsContent({ data }: { data: any }) {
  return (
    <div className="space-y-6">
      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Submissions"
          value={data.totalSubmissions}
          icon={FileText}
        />
        <MetricCard
          title="Recent Submissions"
          value={data.recentSubmissions.count}
          trend={data.recentSubmissions.period}
          icon={Clock}
          trendDirection={data.recentSubmissions.count > 0 ? "up" : "neutral"}
        />
        <MetricCard
          title="Completed"
          value={
            data.byWorkflowStatus.find((s: any) => s.status === "completed")?.count ||
            0
          }
          icon={CheckCircle}
        />
        <MetricCard
          title="Pending"
          value={
            data.byWorkflowStatus.find((s: any) => s.status === "pending")?.count || 0
          }
          icon={ClipboardList}
        />
      </div>

      {/* Charts */}
      {data.totalSubmissions > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SubmissionStatusChart data={data.byWorkflowStatus} />
          <ApprovalStatusChart data={data.byApprovalStatus} />
          <TimelineChart data={data.timeline} />
          <TopFormsChart data={data.topForms} />
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No submissions yet</h3>
            <p className="text-sm text-muted-foreground text-center max-w-md">
              Start submitting forms to see your analytics and track your submissions
              here.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function FormCreatorContent({ data }: { data: any }) {
  return (
    <div className="space-y-6">
      {/* Form Creator Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard title="Total Forms" value={data.forms.total} icon={FileText} />
        <MetricCard
          title="Active Forms"
          value={data.forms.active}
          icon={CheckCircle}
        />
        <MetricCard
          title="Total Submissions Received"
          value={data.submissions.total}
          icon={ClipboardList}
        />
        <MetricCard
          title="Recent Submissions"
          value={data.submissions.recent.count}
          trend={data.submissions.recent.period}
          icon={Clock}
          trendDirection={data.submissions.recent.count > 0 ? "up" : "neutral"}
        />
      </div>

      {/* Form Creator Charts */}
      {data.submissions.total > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <FormSubmissionsChart data={data.submissionsByForm} />
          <TimelineChart
            data={data.timeline}
            title="Submissions Received Timeline"
            description="Last 30 days"
          />
          {data.mostActiveForms.length > 0 && (
            <TopFormsChart
              data={data.mostActiveForms.map((f: any) => ({
                formId: f.formId,
                formName: f.formName,
                formSlug: f.formSlug,
                count: f.recentSubmissions,
              }))}
            />
          )}
          {data.approvalStatistics.length > 0 && (
            <ApprovalStatusChart data={data.approvalStatistics} />
          )}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <ClipboardList className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              No submissions received yet
            </h3>
            <p className="text-sm text-muted-foreground text-center max-w-md">
              Your forms haven't received any submissions yet. Share your forms to
              start collecting responses.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default function DashboardPage() {
  const { data, loading, error, refetch } = useDashboardAnalytics();

  if (loading) return <DashboardSkeleton />;
  if (error) return <ErrorState error={error} onRetry={refetch} />;
  if (!data) return null;

  const isFormCreator = data.formCreator !== null;

  return (
    <div className="container mx-auto p-6 space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Overview of your submissions and analytics
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={refetch}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Content with Tabs if form creator, otherwise just submissions */}
      {isFormCreator ? (
        <Tabs defaultValue="forms" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="forms">My Forms</TabsTrigger>
            <TabsTrigger value="submissions">My Submissions</TabsTrigger>
          </TabsList>

          <TabsContent value="forms" className="mt-6">
            <FormCreatorContent data={data.formCreator} />
          </TabsContent>

          <TabsContent value="submissions" className="mt-6">
            <UserSubmissionsContent data={data.userSubmissions} />
          </TabsContent>
        </Tabs>
      ) : (
        <UserSubmissionsContent data={data.userSubmissions} />
      )}
    </div>
  );
}
