import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';

const ApplicantTable = ({ applicants, onStatusChange, onScheduleInterview }) => (
    <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
            <thead className="bg-gray-50">
                <tr>
                    <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Applicant</th>
                    <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Email</th>
                    <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Applied On</th>
                    <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Actions</th>
                </tr>
            </thead>
            <tbody className="text-gray-700">
                {applicants.map(app => (
                    <tr key={app.id} className="border-b">
                        <td className="text-left py-3 px-4">
                            <Link to={`/school/applicants/${app.StudentProfile.id}`} className="hover:underline text-primary">
                                {app.StudentProfile.first_name} {app.StudentProfile.last_name}
                            </Link>
                        </td>
                        <td className="text-left py-3 px-4">{app.StudentProfile.User.email}</td>
                        <td className="text-left py-3 px-4">{new Date(app.createdAt).toLocaleDateString()}</td>
                        <td className="text-left py-3 px-4 space-x-2">
                            {app.status === 'applied' && <Button size="sm" onClick={() => onStatusChange(app.id, 'shortlisted')}>Shortlist</Button>}
                            {app.status === 'shortlisted' && (
                                <>
                                    <Button size="sm" onClick={() => onScheduleInterview(app)}>Schedule Interview</Button>
                                    <Button size="sm" variant="outline" onClick={() => onStatusChange(app.id, 'applied')}>Remove from Shortlist</Button>
                                </>
                            )}
                             {app.status === 'interview_scheduled' && <span className="text-sm text-green-600 font-medium">Interview Scheduled</span>}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

const JobApplicantsPage = () => {
    const { id: jobId } = useParams();
    const [job, setJob] = useState(null);
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setModalOpen] = useState(false);
    const [selectedApp, setSelectedApp] = useState(null);
    const { register, handleSubmit, reset } = useForm();

    const fetchApplicants = async () => {
        setLoading(true);
        try {
            const [jobRes, appsRes] = await Promise.all([
                api.get(`/jobs/${jobId}`),
                api.get(`/schools/jobs/${jobId}/applicants`)
            ]);
            setJob(jobRes.data);
            setApplications(appsRes.data);
        } catch (error) {
            console.error("Failed to fetch applicants:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApplicants();
    }, [jobId]);

    const handleStatusChange = async (appId, status) => {
        try {
            await api.put(`/schools/applications/${appId}/status`, { status });
            alert('Status updated successfully!');
            fetchApplicants();
        } catch (error) {
            alert('Failed to update status.');
        }
    };
    
    const handleScheduleClick = (app) => {
        setSelectedApp(app);
        reset({ location: job?.SchoolProfile?.address || '' }); // Pre-fill location
        setModalOpen(true);
    };

    const onScheduleSubmit = async (data) => {
        try {
            await api.post(`/schools/applications/${selectedApp.id}/schedule-interview`, data);
            alert('Interview scheduled successfully!');
            setModalOpen(false);
            fetchApplicants();
        } catch (error) {
            alert('Failed to schedule interview.');
        }
    };

    const applicantsByStatus = useMemo(() => {
        return {
            all: applications,
            shortlisted: applications.filter(app => app.status === 'shortlisted'),
            scheduled: applications.filter(app => app.status === 'interview_scheduled'),
        };
    }, [applications]);

    if (loading) return <div>Loading applicants...</div>;
    if (!job) return <div>Job not found.</div>;

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Applicants for {job.title}</h1>
            <Tabs defaultValue="all">
                <TabsList>
                    <TabsTrigger value="all">All Applicants ({applicantsByStatus.all.length})</TabsTrigger>
                    <TabsTrigger value="shortlisted">Shortlisted ({applicantsByStatus.shortlisted.length})</TabsTrigger>
                    <TabsTrigger value="scheduled">Interview Scheduled ({applicantsByStatus.scheduled.length})</TabsTrigger>
                </TabsList>
                <Card className="mt-4">
                    <TabsContent value="all">
                        <ApplicantTable applicants={applicantsByStatus.all} onStatusChange={handleStatusChange} onScheduleInterview={handleScheduleClick} />
                    </TabsContent>
                    <TabsContent value="shortlisted">
                        <ApplicantTable applicants={applicantsByStatus.shortlisted} onStatusChange={handleStatusChange} onScheduleInterview={handleScheduleClick} />
                    </TabsContent>
                    <TabsContent value="scheduled">
                        <ApplicantTable applicants={applicantsByStatus.scheduled} onStatusChange={handleStatusChange} onScheduleInterview={handleScheduleClick} />
                    </TabsContent>
                </Card>
            </Tabs>

            {/* Schedule Interview Modal */}
            <Dialog open={isModalOpen} onOpenChange={setModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Schedule Interview</DialogTitle>
                        <DialogDescription>Schedule an interview with {selectedApp?.StudentProfile?.first_name}.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit(onScheduleSubmit)} className="space-y-4 pt-4">
                        <div className="space-y-2"><Label>Date</Label><Input type="date" {...register('interview_date', { required: true })} /></div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2"><Label>Start Time</Label><Input type="time" {...register('start_time', { required: true })} /></div>
                            <div className="space-y-2"><Label>End Time</Label><Input type="time" {...register('end_time', { required: true })} /></div>
                        </div>
                        <div className="space-y-2"><Label>Location</Label><Input {...register('location')} disabled /></div>
                        <DialogFooter>
                            <Button type="submit">Schedule</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default JobApplicantsPage;