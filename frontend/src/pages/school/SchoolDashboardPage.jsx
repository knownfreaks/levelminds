import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Briefcase, Users, Clock } from 'lucide-react';
import JobCard from '@/components/jobs/JobCard';

const StatCard = ({ icon, label, count }) => (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{label}</CardTitle>
            {icon}
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold">{count}</div>
        </CardContent>
    </Card>
);

const SchoolDashboardPage = () => {
    const [metrics, setMetrics] = useState(null);
    const [recentJobs, setRecentJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [metricsRes, jobsRes] = await Promise.all([
                    api.get('/admin/dashboard-metrics'), // Using admin metrics for school for now, should be a school-specific endpoint
                    api.get('/schools/jobs')
                ]);
                
                if (metricsRes.data.success) {
                    setMetrics(metricsRes.data.metrics);
                }
                setRecentJobs(jobsRes.data.slice(0, 4)); // Get most recent 4 jobs

            } catch (error) {
                console.error("Failed to fetch dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return <div>Loading school dashboard...</div>;
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">School Dashboard</h1>
            
            {/* Metrics */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <StatCard icon={<Briefcase className="h-4 w-4 text-muted-foreground" />} label="Active Job Postings" count={metrics?.totalJobs || 0} />
                <StatCard icon={<Users className="h-4 w-4 text-muted-foreground" />} label="Total Applications" count={metrics?.totalApplicationsReceived || 0} />
                <StatCard icon={<Clock className="h-4 w-4 text-muted-foreground" />} label="Pending Reviews" count={metrics?.pendingApplications || 0} />
            </div>

            {/* Recent Job Postings */}
            <div>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">Recent Job Postings</h2>
                    <Link to="/school/jobs/post">
                        <Button>Create Job Post</Button>
                    </Link>
                </div>
                {recentJobs.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {recentJobs.map(job => (
                            <JobCard key={job.id} job={job} role="school" />
                        ))}
                    </div>
                ) : (
                    <Card>
                        <CardContent className="pt-6 text-center">
                            <p className="text-muted-foreground">You haven't posted any jobs yet.</p>
                            <Link to="/school/jobs/post" className="mt-2 inline-block">
                                <Button>Post Your First Job</Button>
                            </Link>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
};

export default SchoolDashboardPage;