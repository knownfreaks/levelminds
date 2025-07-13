import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Award, BrainCircuit, GraduationCap, Star, User } from 'lucide-react';

const SectionCard = ({ icon, title, children }) => (
    <Card>
        <CardHeader><CardTitle className="flex items-center gap-2">{icon}<span>{title}</span></CardTitle></CardHeader>
        <CardContent>{children}</CardContent>
    </Card>
);

const ApplicantProfilePage = () => {
    const { id: studentId } = useParams();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true);
            try {
                const { data } = await api.get(`/schools/applicants/${studentId}`);
                setProfile(data);
            } catch (error) {
                console.error("Failed to fetch applicant profile:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [studentId]);

    if (loading) return <div>Loading applicant profile...</div>;
    if (!profile) return <div>Could not load applicant profile.</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Applicant Profile</h1>
                {/* In a real app, you'd find the specific application to pass to these functions */}
                <div className="space-x-2">
                    <Button variant="outline">Shortlist</Button>
                    <Button>Schedule Interview</Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 space-y-6">
                    <Card className="text-center">
                        <CardContent className="pt-6">
                            <img src={profile.image_url || 'https://via.placeholder.com/150'} alt="Profile" className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-primary" />
                            <h2 className="text-2xl font-bold">{profile.first_name} {profile.last_name}</h2>
                            <p className="text-muted-foreground">{profile.User?.email}</p>
                            <p className="text-muted-foreground">{profile.mobile}</p>
                        </CardContent>
                    </Card>
                     <SectionCard icon={<BrainCircuit size={20} />} title="Core Skills">
                        {/* Core skills data would be fetched and displayed here */}
                        <p className="text-sm text-muted-foreground">Core skills data coming soon.</p>
                    </SectionCard>
                </div>

                <div className="lg:col-span-2 space-y-6">
                    <SectionCard icon={<User size={20} />} title="About Applicant">
                        <p className="text-muted-foreground">{profile.about || 'No bio provided.'}</p>
                    </SectionCard>
                    <SectionCard icon={<GraduationCap size={20} />} title="Education">
                        <p>{profile.course_name} at {profile.college_name} ({profile.course_year})</p>
                        {profile.university_name && <p className="text-sm text-muted-foreground">{profile.university_name}</p>}
                    </SectionCard>
                    <SectionCard icon={<Star size={20} />} title="Personal Skills">
                        <div className="flex flex-wrap gap-2">
                            {profile.personalSkills.map(skill => <span key={skill.id} className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm">{skill.skill_name}</span>)}
                        </div>
                    </SectionCard>
                    <SectionCard icon={<Award size={20} />} title="Certifications">
                         {profile.certifications.length > 0 ? (
                            profile.certifications.map(cert => (
                                <div key={cert.id} className="mb-2">
                                    <p className="font-medium">{cert.name}</p>
                                    <p className="text-sm text-muted-foreground">{cert.given_by} - {new Date(cert.date).getFullYear()}</p>
                                </div>
                            ))
                         ) : (
                            <p className="text-sm text-muted-foreground">No certifications provided.</p>
                         )}
                    </SectionCard>
                </div>
            </div>
        </div>
    );
};

export default ApplicantProfilePage;