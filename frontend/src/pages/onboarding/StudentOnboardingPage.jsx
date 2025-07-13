import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { X } from 'lucide-react';

const StudentOnboardingPage = () => {
    const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [personalSkills, setPersonalSkills] = useState([]);
    const [skillInput, setSkillInput] = useState('');
    
    const handleAddSkill = (e) => {
        if (e.key === 'Enter' && skillInput.trim() !== '' && personalSkills.length < 12) {
            e.preventDefault();
            const newSkills = [...personalSkills, skillInput.trim()];
            setPersonalSkills(newSkills);
            setValue('personalSkills', newSkills);
            setSkillInput('');
        }
    };

    const removeSkill = (skillToRemove) => {
        const newSkills = personalSkills.filter(skill => skill !== skillToRemove);
        setPersonalSkills(newSkills);
        setValue('personalSkills', newSkills);
    };

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            // Here you can add file upload logic for profile image and certificates
            // For now, we'll pass the form data directly.
            const response = await api.put('/students/onboarding', data);
            if (response.data.success) {
                alert('Profile updated successfully!');
                navigate('/student/dashboard');
            }
        } catch (error) {
            console.error('Onboarding failed:', error);
            alert('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
            <Card className="w-full max-w-2xl">
                <CardHeader>
                    <CardTitle>Complete Your Profile</CardTitle>
                    <CardDescription>Tell us a bit more about yourself to get started.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="first_name">First Name</Label>
                                <Input id="first_name" {...register('first_name', { required: true })} />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="last_name">Last Name</Label>
                                <Input id="last_name" {...register('last_name', { required: true })} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="about">About You</Label>
                            <Textarea id="about" placeholder="A brief bio..." {...register('about')} />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             <div className="space-y-2">
                                <Label htmlFor="mobile">Mobile Number</Label>
                                <Input id="mobile" {...register('mobile')} />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="image_url">Profile Picture URL</Label>
                                <Input id="image_url" placeholder="https://..." {...register('image_url')} />
                            </div>
                        </div>

                        <h3 className="text-lg font-semibold pt-4 border-t">Education</h3>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="college_name">College Name</Label>
                                <Input id="college_name" {...register('college_name')} />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="university_name">University Name (Optional)</Label>
                                <Input id="university_name" {...register('university_name')} />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="course_name">Course Name</Label>
                                <Input id="course_name" {...register('course_name')} />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="course_year">Course Year (e.g., 2020-2024)</Label>
                                <Input id="course_year" {...register('course_year')} />
                            </div>
                        </div>

                        <h3 className="text-lg font-semibold pt-4 border-t">Your Skills</h3>
                        <div className="space-y-2">
                            <Label>Add up to 12 skills</Label>
                             <div className="flex flex-wrap gap-2 p-2 border rounded-md min-h-[40px]">
                                {personalSkills.map((skill, index) => (
                                    <div key={index} className="flex items-center gap-1 bg-primary text-primary-foreground rounded-full px-3 py-1 text-sm">
                                        {skill}
                                        <button type="button" onClick={() => removeSkill(skill)} className="ml-1">
                                            <X size={14} />
                                        </button>
                                    </div>
                                ))}
                                <input
                                    type="text"
                                    value={skillInput}
                                    onChange={(e) => setSkillInput(e.target.value)}
                                    onKeyDown={handleAddSkill}
                                    placeholder={personalSkills.length < 12 ? "Type a skill and press Enter" : "Maximum skills reached"}
                                    className="flex-grow bg-transparent outline-none"
                                    disabled={personalSkills.length >= 12}
                                />
                            </div>
                        </div>

                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? 'Saving...' : 'Save and Continue'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default StudentOnboardingPage;