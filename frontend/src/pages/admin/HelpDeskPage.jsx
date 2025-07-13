import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';

const HelpDeskPage = () => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [isModalOpen, setModalOpen] = useState(false);

    const fetchTickets = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/admin/help-tickets');
            if (data.success) setTickets(data.tickets);
        } catch (error) {
            console.error('Failed to fetch help tickets:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTickets();
    }, []);

    const handleViewDetails = (ticket) => {
        setSelectedTicket(ticket);
        setModalOpen(true);
    };

    const handleStatusChange = async (newStatus) => {
        if (!selectedTicket) return;
        try {
            await api.put(`/admin/help-tickets/${selectedTicket.id}`, { status: newStatus });
            alert('Status updated successfully!');
            setModalOpen(false);
            fetchTickets();
        } catch (error) {
            alert('Failed to update status.');
        }
    };

    if (loading) return <p>Loading tickets...</p>;

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Help Desk</h1>
            <Card>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="py-3 px-4 text-left">Subject</th>
                                    <th className="py-3 px-4 text-left">Submitted By</th>
                                    <th className="py-3 px-4 text-left">Status</th>
                                    <th className="py-3 px-4 text-left">Date</th>
                                    <th className="py-3 px-4 text-left">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tickets.map((ticket) => (
                                    <tr key={ticket.id} className="border-b">
                                        <td className="py-3 px-4 font-medium">{ticket.subject}</td>
                                        <td className="py-3 px-4 text-muted-foreground">{ticket.User.email}</td>
                                        <td className="py-3 px-4">
                                            <span className={`px-2 py-1 text-xs rounded-full capitalize ${
                                                ticket.status === 'open' ? 'bg-red-100 text-red-800' : 
                                                ticket.status === 'resolved' ? 'bg-green-100 text-green-800' : 
                                                'bg-yellow-100 text-yellow-800'}`}>{ticket.status.replace('_', ' ')}</span>
                                        </td>
                                        <td className="py-3 px-4 text-muted-foreground">{new Date(ticket.createdAt).toLocaleDateString()}</td>
                                        <td className="py-3 px-4">
                                            <Button variant="outline" size="sm" onClick={() => handleViewDetails(ticket)}>View & Update</Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            <Dialog open={isModalOpen} onOpenChange={setModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{selectedTicket?.subject}</DialogTitle>
                        <DialogDescription>From: {selectedTicket?.User.email}</DialogDescription>
                    </DialogHeader>
                    <div className="py-4 space-y-4">
                        <p className="text-sm text-foreground/80 border p-4 rounded-md bg-gray-50">{selectedTicket?.description}</p>
                        <div className="flex items-center gap-4">
                             <Label className="font-semibold">Update Status:</Label>
                             <select onChange={(e) => handleStatusChange(e.target.value)} defaultValue={selectedTicket?.status} className="h-10 border rounded-md px-3">
                                 <option value="open">Open</option>
                                 <option value="in_progress">In Progress</option>
                                 <option value="resolved">Resolved</option>
                                 <option value="closed">Closed</option>
                             </select>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default HelpDeskPage;