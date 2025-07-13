import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Briefcase, IndianRupee, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const JobCard = ({ job, role = 'student' }) => {
    if (!job) return null;

    const location = job.SchoolProfile?.City?.name && job.SchoolProfile?.State?.name
        ? `${job.SchoolProfile.City.name}, ${job.SchoolProfile.State.name}`
        : 'Location not specified';

    return (
        <Card className="w-full hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                        <img
                            src={job.SchoolProfile?.logo_url || 'https://via.placeholder.com/150'}
                            alt={`${job.SchoolProfile?.school_name} logo`}
                            className="w-12 h-12 rounded-lg object-cover border"
                        />
                        <div>
                            <CardTitle className="text-lg">{job.title}</CardTitle>
                            <CardDescription>{job.SchoolProfile?.school_name}</CardDescription>
                        </div>
                    </div>
                     <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${job.status === 'open' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {job.status}
                    </span>
                </div>
            </CardHeader>
            <CardContent>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-1.5"><MapPin size={14} /> {location}</div>
                    <div className="flex items-center gap-1.5"><Briefcase size={14} /> {job.JobType?.name}</div>
                    <div className="flex items-center gap-1.5"><IndianRupee size={14} /> {job.min_salary} - {job.max_salary || 'N/A'} LPA</div>
                    <div className="flex items-center gap-1.5"><Clock size={14} /> {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}</div>
                </div>
                <p className="text-sm text-foreground/80 line-clamp-2 mb-4">
                    {job.description}
                </p>
                <div className="flex justify-end">
                    <Link to={`/${role}/jobs/${job.id}`}>
                        <Button variant="outline">View Details</Button>
                    </Link>
                </div>
            </CardContent>
        </Card>
    );
};

export default JobCard;