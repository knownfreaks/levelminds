import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Briefcase, ClipboardCheck, School } from 'lucide-react';

const StatCard = ({ icon, label, count, color }) => (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{label}</CardTitle>
            <div className={`text-${color}-500`}>{icon}</div>
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold">{count}</div>
        </CardContent>
    </Card>
);

const AdminDashboardPage = () => {
    const [metrics, setMetrics] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMetrics = async () => {
            setLoading(true);
            try {
                const { data } = await api.get('/admin/dashboard-metrics');
                if (data.success) {
                    setMetrics(data.metrics);
                }
            } catch (error) {
                console.error("Failed to fetch admin metrics:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchMetrics();
    }, []);

    if (loading) return <div>Loading dashboard...</div>;
    if (!metrics) return <div>Failed to load metrics.</div>;

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard icon={<Users size={20} />} label="Total Users" count={metrics.totalUsers} color="blue" />
                <StatCard icon={<Users size={20} />} label="Total Students" count={metrics.totalStudents} color="green" />
                <StatCard icon={<School size={20} />} label="Total Schools" count={metrics.totalSchools} color="purple" />
                <StatCard icon={<Briefcase size={20} />} label="Total Jobs" count={metrics.totalJobs} color="orange" />
                <StatCard icon={<ClipboardCheck size={20} />} label="Total Applications" count={metrics.totalApplications} color="red" />
                <StatCard icon={<ClipboardCheck size={20} />} label="Pending Applications" count={metrics.pendingApplications} color="yellow" />
            </div>
            {/* You can add charts or more detailed tables here */}
        </div>
    );
};

export default AdminDashboardPage;