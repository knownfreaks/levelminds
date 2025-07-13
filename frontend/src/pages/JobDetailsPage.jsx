import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { MapPin, Briefcase, IndianRupee, Calendar, Building, Link as LinkIcon } from 'lucide-react';

const JobDetailsPage = () => {
    const { id } = useParams();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchJob = async () => {
            setLoading(true);
            try {
                const { data } = await api.get(`/jobs/${id}`);
                setJob(data);
            } catch (error) {
                console.error("Failed to fetch job details:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchJob();
    }, [id]);

    const handleApply = async () => {
        try {
            await api.post(`/jobs/${id}/apply`);
            alert('Successfully applied for the job!');
        } catch (error) {
            alert(error.response?.data?.msg || 'Failed to apply.');
        }
    };

    if (loading) return <div>Loading job details...</div>;
    if (!job) return <div>Job not found.</div>;

    return (
        <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <div className="flex items-start justify-between">
                                <div>
                                    <CardTitle className="text-3xl">{job.title}</CardTitle>
                                    <CardDescription className="text-base">{job.SchoolProfile.school_name}</CardDescription>
                                </div>
                                {user.role === 'student' && <Button onClick={handleApply}>Apply Now</Button>}
                                {user.role === 'school' && <Button onClick={() => navigate(`/school/jobs/${id}/applicants`)}>View Applicants</Button>}
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div>
                                <h3 className="font-semibold mb-2">Job Overview</h3>
                                <p className="text-muted-foreground">{job.description}</p>
                            </div>
                             <div>
                                <h3 className="font-semibold mb-2">Key Responsibilities</h3>
                                <p className="text-muted-foreground">{job.responsibilities}</p>
                            </div>
                             <div>
                                <h3 className="font-semibold mb-2">Requirements</h3>
                                <p className="text-muted-foreground">{job.requirements}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <div className="md:col-span-1 space-y-6">
                    <Card>
                        <CardHeader><CardTitle>Job Overview</CardTitle></CardHeader>
                        <CardContent className="space-y-3 text-sm">
                            <div className="flex items-center gap-2"><MapPin size={16} /><span>{job.SchoolProfile.City.name}, {job.SchoolProfile.State.name}</span></div>
                            <div className="flex items-center gap-2"><Briefcase size={16} /><span>{job.JobType.name}</span></div>
                            <div className="flex items-center gap-2"><IndianRupee size={16} /><span>{job.min_salary} - {job.max_salary || 'N/A'} LPA</span></div>
                            <div className="flex items-center gap-2"><Calendar size={16} /><span>Apply by {format(new Date(job.application_deadline), 'do MMM, yyyy')}</span></div>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader><CardTitle>About {job.SchoolProfile.school_name}</CardTitle></CardHeader>
                        <CardContent className="space-y-3 text-sm">
                           <p className="text-muted-foreground">{job.SchoolProfile.about}</p>
                           {job.SchoolProfile.website && (
                               <a href={job.SchoolProfile.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-primary hover:underline">
                                   <LinkIcon size={16} />
                                   <span>Visit Website</span>
                               </a>
                           )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default JobDetailsPage;