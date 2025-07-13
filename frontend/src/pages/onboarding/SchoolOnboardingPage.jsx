import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const SchoolOnboardingPage = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);
    const [selectedState, setSelectedState] = useState('');

    useEffect(() => {
        api.get('/admin/states').then(res => setStates(res.data.items));
    }, []);

    useEffect(() => {
        if (selectedState) {
            api.get(`/admin/cities/by-state/${selectedState}`).then(res => setCities(res.data.items));
        } else {
            setCities([]);
        }
    }, [selectedState]);

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            const response = await api.put('/schools/onboarding', data);
            if (response.data.success) {
                alert('Profile updated successfully!');
                navigate('/school/dashboard');
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
                    <CardTitle>Complete Your School's Profile</CardTitle>
                    <CardDescription>Provide details about your institution to get started.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="about">About Your School</Label>
                            <Textarea id="about" placeholder="A brief description of your institution..." {...register('about', { required: true })} />
                        </div>

                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="logo_url">Logo URL</Label>
                                <Input id="logo_url" placeholder="https://..." {...register('logo_url')} />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="website">Website</Label>
                                <Input id="website" placeholder="https://example.com" {...register('website')} />
                            </div>
                        </div>

                        <h3 className="text-lg font-semibold pt-4 border-t">Location</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             <div className="space-y-2">
                                <Label htmlFor="address">Address</Label>
                                <Input id="address" {...register('address')} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="pincode">Pincode</Label>
                                <Input id="pincode" {...register('pincode')} />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="stateId">State</Label>
                                <select id="stateId" {...register('stateId', { required: true })} onChange={(e) => setSelectedState(e.target.value)} className="w-full h-10 border rounded-md px-3">
                                    <option value="">Select a state</option>
                                    {states.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="cityId">City</Label>
                                <select id="cityId" {...register('cityId', { required: true })} className="w-full h-10 border rounded-md px-3" disabled={!selectedState}>
                                    <option value="">Select a city</option>
                                    {cities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
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

export default SchoolOnboardingPage;