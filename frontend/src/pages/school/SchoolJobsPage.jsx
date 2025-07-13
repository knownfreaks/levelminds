import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import JobCard from '@/components/jobs/JobCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; // You'll need to create this Select component or use a library
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const SchoolJobsPage = () => {
    const [jobs, setJobs] = useState([]);
    const [jobTypes, setJobTypes] = useState([]);
    const [selectedJobType, setSelectedJobType] = useState('all');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [jobsRes, jobTypesRes] = await Promise.all([
                    api.get('/schools/jobs'),
                    api.get('/admin/job-types') // Assuming this is accessible or you have a public one
                ]);
                setJobs(jobsRes.data);
                if (jobTypesRes.data.success) {
                    setJobTypes(jobTypesRes.data.items);
                }
            } catch (error) {
                console.error("Failed to fetch data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const filteredJobs = jobs.filter(job => 
        selectedJobType === 'all' || job.jobTypeId === parseInt(selectedJobType)
    );

    const openJobs = filteredJobs.filter(job => job.status === 'open');
    const closedJobs = filteredJobs.filter(job => job.status === 'closed');

    return (
        <div className="space-y-6">
             <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">My Job Postings</h1>
                <Link to="/school/jobs/post">
                    <Button>Post a New Job</Button>
                </Link>
            </div>
            
            <Tabs defaultValue="open">
                <div className="flex justify-between items-center">
                    <TabsList>
                        <TabsTrigger value="open">Open Jobs ({openJobs.length})</TabsTrigger>
                        <TabsTrigger value="closed">Closed Jobs ({closedJobs.length})</TabsTrigger>
                    </TabsList>
                    {/* A placeholder for a Select component */}
                    {/* <Select onValueChange={setSelectedJobType} defaultValue="all">
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Filter by category" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Categories</SelectItem>
                            {jobTypes.map(type => <SelectItem key={type.id} value={String(type.id)}>{type.name}</SelectItem>)}
                        </SelectContent>
                    </Select> */}
                </div>
                <TabsContent value="open" className="mt-4">
                    {loading ? <p>Loading...</p> : openJobs.length > 0 ? (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {openJobs.map(job => <JobCard key={job.id} job={job} role="school" />)}
                        </div>
                    ) : <p className="text-center text-muted-foreground py-10">No open jobs found.</p>}
                </TabsContent>
                <TabsContent value="closed" className="mt-4">
                     {loading ? <p>Loading...</p> : closedJobs.length > 0 ? (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {closedJobs.map(job => <JobCard key={job.id} job={job} role="school" />)}
                        </div>
                    ) : <p className="text-center text-muted-foreground py-10">No closed jobs found.</p>}
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default SchoolJobsPage;