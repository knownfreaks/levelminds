import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import JobCard from '@/components/jobs/JobCard';
import { useAuth } from '@/contexts/AuthContext';

const StudentDashboardPage = () => {
    const { user } = useAuth();
    const [profile, setProfile] = useState(null);
    const [shortlistedJobs, setShortlistedJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const profileRes = await api.get('/students/profile');
                setProfile(profileRes.data);

                const appsRes = await api.get('/students/applications');
                const shortlisted = appsRes.data
                    .filter(app => app.status === 'shortlisted' || app.status === 'interview_scheduled')
                    .map(app => app.Job);
                setShortlistedJobs(shortlisted);

            } catch (error) {
                console.error("Failed to fetch dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return <div className="flex items-center justify-center h-full">Loading dashboard...</div>;
    }

    if (!profile) {
        return <div className="flex items-center justify-center h-full">Could not load profile data.</div>;
    }
    
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-6">
                <Card>
                    <CardHeader className="items-center text-center">
                        <img src={profile.image_url || 'https://via.placeholder.com/150'} alt="Profile" className="w-24 h-24 rounded-full mb-4 border-2 border-primary" />
                        <CardTitle>{profile.first_name} {profile.last_name}</CardTitle>
                        <CardDescription>{profile.User?.email}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <h3 className="font-semibold mb-4 text-center">Core Skills Overview</h3>
                        <div className="space-y-4">
                            {profile.skillAssessments && profile.skillAssessments.length > 0 ? (
                                profile.skillAssessments.map(assessment => (
                                    <div key={assessment.id}>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="font-medium">{assessment.AssessmentSkill.name}</span>
                                            <span className="text-muted-foreground">{assessment.total_score} / 40</span>
                                        </div>
                                        <Progress value={(assessment.total_score / 40) * 100} />
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-center text-muted-foreground">No core skills assessed yet.</p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="lg:col-span-2">
                <h2 className="text-2xl font-bold mb-4">Shortlisted Job Opportunities</h2>
                <div className="space-y-4">
                    {shortlistedJobs.length > 0 ? (
                        shortlistedJobs.map(job => <JobCard key={job.id} job={job} />)
                    ) : (
                        <Card>
                            <CardContent className="pt-6">
                                <p className="text-center text-muted-foreground">You have no shortlisted jobs yet. Keep applying!</p>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StudentDashboardPage;