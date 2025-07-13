import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'; // You'll need to create this Select component or use a library

const UserManagementPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setModalOpen] = useState(false);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const { register, handleSubmit, reset, setValue } = useForm();
    const adminId = JSON.parse(localStorage.getItem('user'))?.id;

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/admin/users');
            if (data.success) setUsers(data.users);
        } catch (error) {
            console.error('Failed to fetch users:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleOpenModal = (user = null) => {
        setSelectedUser(user);
        reset(user ? { email: user.email } : { email: '', name: '', role: 'student' });
        setModalOpen(true);
    };

    const handleOpenDeleteModal = (user) => {
        setSelectedUser(user);
        setDeleteModalOpen(true);
    };

    const onSubmit = async (data) => {
        const method = selectedUser ? 'put' : 'post';
        const url = selectedUser ? `/admin/users/${selectedUser.id}` : '/admin/users';
        const action = selectedUser ? 'updated' : 'created';
        
        try {
            await api[method](url, data);
            alert(`User ${action} successfully!`);
            setModalOpen(false);
            fetchUsers();
        } catch (error) {
            alert(`Failed to ${action} user: ${error.response?.data?.message || 'Server error'}`);
        }
    };

    const handleDelete = async () => {
        try {
            await api.delete(`/admin/users/${selectedUser.id}`);
            alert('User deleted successfully!');
            setDeleteModalOpen(false);
            fetchUsers();
        } catch (error) {
            alert(`Failed to delete user: ${error.response?.data?.message || 'Server error'}`);
        }
    };

    if (loading) return <p>Loading users...</p>;

    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">User Management</h1>
                <Button onClick={() => handleOpenModal()}>Create New User</Button>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="py-3 px-4 text-left">Name / School</th>
                            <th className="py-3 px-4 text-left">Email</th>
                            <th className="py-3 px-4 text-left">Role</th>
                            <th className="py-3 px-4 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id} className="border-b">
                                <td className="py-3 px-4">{user.StudentProfile?.first_name || user.SchoolProfile?.school_name || 'Admin'}</td>
                                <td className="py-3 px-4">{user.email}</td>
                                <td className="py-3 px-4 capitalize">{user.role}</td>
                                <td className="py-3 px-4 space-x-2">
                                    <Button variant="outline" size="sm" onClick={() => handleOpenModal(user)}>Edit</Button>
                                    <Button variant="destructive" size="sm" onClick={() => handleOpenDeleteModal(user)} disabled={user.id === adminId}>Delete</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Create/Edit Modal */}
            <Dialog open={isModalOpen} onOpenChange={setModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{selectedUser ? 'Edit' : 'Create'} User</DialogTitle>
                        <DialogDescription>
                            {selectedUser ? "Update user details." : "An onboarding email with a temporary password will be sent."}
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
                        {!selectedUser && (
                             <div className="space-y-2">
                                <Label>Name / School Name</Label>
                                <Input {...register('name', { required: 'Name is required' })} />
                            </div>
                        )}
                        <div className="space-y-2">
                            <Label>Email</Label>
                            <Input type="email" {...register('email', { required: 'Email is required' })} />
                        </div>
                         {!selectedUser && (
                            <div className="space-y-2">
                                <Label>Role</Label>
                                <select {...register('role')} className="w-full h-10 border rounded-md px-3">
                                    <option value="student">Student</option>
                                    <option value="school">School</option>
                                </select>
                            </div>
                        )}
                         <div className="space-y-2">
                            <Label>New Password (Optional)</Label>
                            <Input type="password" {...register('password')} placeholder="Leave blank to keep unchanged" />
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
                            <Button type="submit">Save</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
            
            {/* Delete Modal */}
             <Dialog open={isDeleteModalOpen} onOpenChange={setDeleteModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete User</DialogTitle>
                        <DialogDescription>Are you sure you want to delete {selectedUser?.email}? All associated data will be removed. This action is irreversible.</DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="secondary" onClick={() => setDeleteModalOpen(false)}>Cancel</Button>
                        <Button variant="destructive" onClick={handleDelete}>Delete User</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default UserManagementPage;