'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api';
import { User } from '@/types/user';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Pagination } from '@/components/common/Pagination';
import { CheckCircle, XCircle, Ban } from 'lucide-react';
import { formatDate } from '@/utils/helpers';
import toast from 'react-hot-toast';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchUsers();
  }, [currentPage, statusFilter, search]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await apiClient.getUsers(
        {
          status: statusFilter !== 'all' ? statusFilter : undefined,
          search,
        },
        currentPage,
        10
      );
      setUsers(response.data);
      setTotalPages(response.pagination.totalPages);
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (userId: string, action: 'approved' | 'rejected' | 'revoked') => {
    try {
      if (action === 'approved') {
        await apiClient.approveUser(userId);
        toast.success('User approved successfully');
      } else if (action === 'rejected') {
        await apiClient.rejectUser(userId);
        toast.success('User rejected successfully');
      } else if (action === 'revoked') {
        await apiClient.revokeUser(userId);
        toast.success('User access revoked successfully');
      }
      fetchUsers();
    } catch (error: any) {
      toast.error(error.message || `Failed to ${action} user`);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
        <p className="mt-2 text-gray-600">Manage user accounts and permissions</p>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <Input
          placeholder="Search by email or name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          options={[
            { value: 'all', label: 'All Status' },
            { value: 'pending', label: 'Pending' },
            { value: 'approved', label: 'Approved' },
            { value: 'rejected', label: 'Rejected' },
            { value: 'revoked', label: 'Revoked' },
          ]}
          className="w-48"
        />
      </div>

      {/* Users Table */}
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Joined
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Last Login
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {user.name || 'No name'}
                            </div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge variant={(user as any).is_approved ? 'success' : 'default'}>
                            {(user as any).is_approved ? 'Approved' : 'Pending'}
                          </Badge>
                          {(user as any).is_admin && (
                            <Badge className="ml-2 bg-purple-100 text-purple-800">Admin</Badge>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(user.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.lastLogin ? formatDate(user.lastLogin) : 'Never'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center gap-2">
                            {!(user as any).is_approved && (
                              <Button
                                size="sm"
                                onClick={() => handleStatusUpdate(user.id, 'approved')}
                                title="Approve user"
                                className="bg-green-600 hover:bg-green-700 text-white"
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Approve
                              </Button>
                            )}
                            {(user as any).is_approved && (
                              <Button
                                size="sm"
                                onClick={() => handleStatusUpdate(user.id, 'rejected')}
                                title="Reject user"
                                className="bg-red-600 hover:bg-red-700 text-white"
                              >
                                <XCircle className="h-4 w-4 mr-1" />
                                Reject
                              </Button>
                            )}
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => handleStatusUpdate(user.id, 'revoked')}
                              title="Revoke access"
                            >
                              <Ban className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </>
      )}
    </div>
  );
}

