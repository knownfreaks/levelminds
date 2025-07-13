import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import JobCard from '@/components/jobs/JobCard';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

const JobOpportunitiesPage = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchJobs = async () => {
            setLoading(true);
            try {
                const response = await api.get('/jobs');
                setJobs(response.data);
            } catch (error) {
                console.error("Failed to fetch jobs:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchJobs();
    }, []);

    const filteredJobs = jobs.filter(job =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.SchoolProfile.school_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Job Opportunities</h1>
                <p className="text-muted-foreground">Browse jobs that match your skills and qualifications.</p>
            </div>

            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                    type="text"
                    placeholder="Search by job title or school..."
                    className="pl-10 w-full md:w-1/3"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            
            {loading ? (
                <p>Loading jobs...</p>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {filteredJobs.length > 0 ? (
                        filteredJobs.map(job => <JobCard key={job.id} job={job} />)
                    ) : (
                        <p className="text-center text-muted-foreground py-10">No matching jobs found.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default JobOpportunitiesPage;