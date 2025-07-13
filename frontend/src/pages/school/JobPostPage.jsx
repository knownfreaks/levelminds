import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';

const JobPostPage = () => {
    const { register, handleSubmit, setValue } = useForm();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [jobTypes, setJobTypes] = useState([]);
    const [subjects, setSubjects] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [jobTypesRes, subjectsRes] = await Promise.all([
                    api.get('/admin/job-types'),
                    api.get('/admin/subjects')
                ]);
                if (jobTypesRes.data.success) setJobTypes(jobTypesRes.data.items);
                if (subjectsRes.data.success) setSubjects(subjectsRes.data.items);
            } catch (error) {
                console.error("Failed to fetch master data:", error);
            }
        };
        fetchData();
        // Pre-fill school name
        if (user?.profile?.school_name) {
            setValue('schoolName', user.profile.school_name);
        }
    }, [user, setValue]);

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            await api.post('/jobs', data);
            alert('Job posted successfully!');
            navigate('/school/jobs');
        } catch (error) {
            console.error('Failed to post job:', error);
            alert('An error occurred while posting the job.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Create a New Job Post</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                <Card>
                    <CardHeader><CardTitle>Basic Details</CardTitle></CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2"><Label>Job Title</Label><Input {...register('title', { required: true })} /></div>
                        <div className="space-y-2"><Label>School Name</Label><Input {...register('schoolName')} disabled /></div>
                        <div className="space-y-2"><Label>Job Type (Category)</Label>
                            <select {...register('jobTypeId', { required: true })} className="w-full h-10 border rounded-md px-3"><option value="">Select...</option>{jobTypes.map(jt => <option key={jt.id} value={jt.id}>{jt.name}</option>)}</select>
                        </div>
                        <div className="space-y-2"><Label>Application Deadline</Label><Input type="date" {...register('application_deadline', { required: true })} /></div>
                    </CardContent>
                </Card>

                 <Card>
                    <CardHeader><CardTitle>Subjects & Compensation</CardTitle></CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
                         <div className="space-y-2 md:col-span-1"><Label>Subject</Label>
                            <select {...register('subjectId', { required: true })} className="w-full h-10 border rounded-md px-3"><option value="">Select...</option>{subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}</select>
                        </div>
                        <div className="space-y-2"><Label>Minimum Salary (LPA)</Label><Input type="number" {...register('min_salary', { required: true })} /></div>
                        <div className="space-y-2"><Label>Maximum Salary (LPA)</Label><Input type="number" {...register('max_salary')} /></div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader><CardTitle>Job Details</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2"><Label>Job Description</Label><Textarea rows={5} {...register('description', { required: true })} /></div>
                        <div className="space-y-2"><Label>Key Responsibilities</Label><Textarea rows={5} {...register('responsibilities')} /></div>
                        <div className="space-y-2"><Label>Requirements</Label><Textarea rows={5} {...register('requirements')} /></div>
                    </CardContent>
                </Card>

                <div className="flex justify-end">
                    <Button type="submit" size="lg" disabled={loading}>
                        {loading ? 'Posting...' : 'Post Job'}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default JobPostPage;