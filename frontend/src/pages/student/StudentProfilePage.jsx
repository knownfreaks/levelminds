import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Award, BrainCircuit, GraduationCap, Star, Upload, X } from 'lucide-react';

const SectionCard = ({ icon, title, children }) => (
    <Card>
        <CardHeader>
            <CardTitle className="flex items-center gap-2">
                {icon}
                <span>{title}</span>
            </CardTitle>
        </CardHeader>
        <CardContent>{children}</CardContent>
    </Card>
);

const StudentProfilePage = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditMode, setIsEditMode] = useState(false);
    const { register, handleSubmit, reset, setValue } = useForm();
    const [personalSkills, setPersonalSkills] = useState([]);
    const [skillInput, setSkillInput] = useState('');

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/students/profile');
            setProfile(data);
            reset(data); // Populate form with fetched data
            setPersonalSkills(data.personalSkills.map(s => s.skill_name));
        } catch (error) {
            console.error("Failed to fetch profile:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddSkill = (e) => {
        if (e.key === 'Enter' && skillInput.trim() !== '' && personalSkills.length < 12) {
            e.preventDefault();
            const newSkills = [...personalSkills, skillInput.trim()];
            setPersonalSkills(newSkills);
            setSkillInput('');
        }
    };

    const removeSkill = (skillToRemove) => {
        const newSkills = personalSkills.filter(skill => skill !== skillToRemove);
        setPersonalSkills(newSkills);
    };

    const onSubmit = async (data) => {
        const payload = {
            ...data,
            personalSkills: personalSkills,
            // In a real app, you would handle certificate updates separately
            // For now, we'll just update the main profile fields
        };
        
        try {
            await api.put('/students/onboarding', payload); // Using the same endpoint for updates
            alert('Profile updated successfully!');
            setIsEditMode(false);
            fetchProfile(); // Refresh data
        } catch (error) {
            console.error("Failed to update profile:", error);
            alert('Failed to update profile.');
        }
    };

    if (loading) return <div>Loading profile...</div>;
    if (!profile) return <div>Could not load profile.</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">My Profile</h1>
                <Button onClick={() => setIsEditMode(!isEditMode)}>
                    {isEditMode ? 'Cancel' : 'Edit Profile'}
                </Button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column */}
                    <div className="lg:col-span-1 space-y-6">
                        <Card className="text-center">
                            <CardContent className="pt-6">
                                <img src={profile.image_url || 'https://via.placeholder.com/150'} alt="Profile" className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-primary" />
                                {isEditMode && (
                                    <div className="space-y-2">
                                        <Label htmlFor="image_url">Profile Picture URL</Label>
                                        <Input id="image_url" {...register('image_url')} />
                                    </div>
                                )}
                                <h2 className="text-2xl font-bold mt-4">{profile.first_name} {profile.last_name}</h2>
                                <p className="text-muted-foreground">{profile.User?.email}</p>
                            </CardContent>
                        </Card>
                        <SectionCard icon={<BrainCircuit size={20} />} title="Core Skills">
                             <div className="space-y-4">
                                {profile.skillAssessments && profile.skillAssessments.length > 0 ? (
                                    profile.skillAssessments.map(assessment => (
                                        <div key={assessment.id}>
                                            <p className="font-medium">{assessment.AssessmentSkill.name}</p>
                                            <p className="text-sm text-muted-foreground">Score: {assessment.total_score}/40</p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-muted-foreground">No core skills have been assessed yet.</p>
                                )}
                            </div>
                        </SectionCard>
                    </div>

                    {/* Right Column */}
                    <div className="lg:col-span-2 space-y-6">
                         <SectionCard icon={<User size={20} />} title="Personal Information">
                            {isEditMode ? (
                                <div className="space-y-4">
                                     <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <Label>First Name</Label>
                                            <Input {...register('first_name')} />
                                        </div>
                                        <div className="space-y-1">
                                            <Label>Last Name</Label>
                                            <Input {...register('last_name')} />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <Label>Mobile</Label>
                                        <Input {...register('mobile')} />
                                    </div>
                                    <div className="space-y-1">
                                        <Label>About</Label>
                                        <Textarea {...register('about')} />
                                    </div>
                                </div>
                            ) : (
                                <p className="text-muted-foreground">{profile.about || 'No bio provided.'}</p>
                            )}
                        </SectionCard>

                        <SectionCard icon={<GraduationCap size={20} />} title="Education">
                            {isEditMode ? (
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1"><Label>College</Label><Input {...register('college_name')} /></div>
                                    <div className="space-y-1"><Label>University</Label><Input {...register('university_name')} /></div>
                                    <div className="space-y-1"><Label>Course</Label><Input {...register('course_name')} /></div>
                                    <div className="space-y-1"><Label>Year</Label><Input {...register('course_year')} /></div>
                                </div>
                            ) : (
                                <p>{profile.course_name} at {profile.college_name} ({profile.course_year})</p>
                            )}
                        </SectionCard>
                        
                        <SectionCard icon={<Star size={20} />} title="Personal Skills">
                            {isEditMode ? (
                                <div className="flex flex-wrap gap-2 p-2 border rounded-md min-h-[40px]">
                                    {personalSkills.map((skill, index) => (
                                        <div key={index} className="flex items-center gap-1 bg-secondary text-secondary-foreground rounded-full px-3 py-1 text-sm">
                                            {skill}
                                            <button type="button" onClick={() => removeSkill(skill)}><X size={14} /></button>
                                        </div>
                                    ))}
                                    <input type="text" value={skillInput} onChange={(e) => setSkillInput(e.target.value)} onKeyDown={handleAddSkill} placeholder="Type a skill and press Enter" className="flex-grow bg-transparent outline-none p-1"/>
                                </div>
                            ) : (
                                <div className="flex flex-wrap gap-2">
                                    {personalSkills.map(skill => <span key={skill} className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm">{skill}</span>)}
                                </div>
                            )}
                        </SectionCard>
                        
                        <SectionCard icon={<Award size={20} />} title="Certifications">
                            {/* Certificate management would be more complex (add/remove items). This is a simplified view. */}
                             {profile.certifications && profile.certifications.length > 0 ? (
                                profile.certifications.map(cert => (
                                    <div key={cert.id} className="mb-2">
                                        <p className="font-medium">{cert.name}</p>
                                        <p className="text-sm text-muted-foreground">{cert.given_by} - {new Date(cert.date).getFullYear()}</p>
                                    </div>
                                ))
                             ) : (
                                <p className="text-sm text-muted-foreground">No certifications added.</p>
                             )}
                        </SectionCard>

                        {isEditMode && (
                            <div className="flex justify-end">
                                <Button type="submit">Save Changes</Button>
                            </div>
                        )}
                    </div>
                </div>
            </form>
        </div>
    );
};

export default StudentProfilePage;