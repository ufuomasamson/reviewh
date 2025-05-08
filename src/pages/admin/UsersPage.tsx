import React, { useEffect, useState } from 'react';
import { Users, Search, Filter, Check, X, Briefcase, Star, Eye } from 'lucide-react';
import { Business, Reviewer, User } from '../../lib/types';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { formatDate } from '../../lib/utils';
import { Avatar } from '../../components/ui/Avatar';
import { supabase } from '../../lib/supabase';

export const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<(User | Business | Reviewer)[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<(User | Business | Reviewer)[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [verificationFilter, setVerificationFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        // Fetch all users
        const { data: usersData, error: usersError } = await supabase
          .from('users')
          .select('*')
          .order('created_at', { ascending: false });

        if (usersError) throw usersError;

        // Fetch business profiles
        const { data: businessesData, error: businessesError } = await supabase
          .from('businesses')
          .select('*');

        if (businessesError) throw businessesError;

        // Fetch reviewer profiles
        const { data: reviewersData, error: reviewersError } = await supabase
          .from('reviewers')
          .select('*');

        if (reviewersError) throw reviewersError;

        // Create a map of business and reviewer profiles
        const businessMap = new Map(businessesData?.map(b => [b.id, b]));
        const reviewerMap = new Map(reviewersData?.map(r => [r.id, r]));
        
        // Combine user data with their respective profiles
        const combinedUsers = usersData?.map(user => {
          if (user.role === 'business') {
            const businessProfile = businessMap.get(user.id);
            return {
              ...user,
              companyName: businessProfile?.company_name,
              description: businessProfile?.description,
              website: businessProfile?.website,
              walletBalance: businessProfile?.wallet_balance,
            };
          } else if (user.role === 'reviewer') {
            const reviewerProfile = reviewerMap.get(user.id);
            return {
              ...user,
              bio: reviewerProfile?.bio,
              reviewCount: reviewerProfile?.review_count,
              walletBalance: reviewerProfile?.wallet_balance,
              earnings: reviewerProfile?.total_earnings,
            };
          }
          return user;
        }) || [];
        
        setUsers(combinedUsers);
        setFilteredUsers(combinedUsers);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUsers();
  }, []);
  
  useEffect(() => {
    // Apply filters when search query or filters change
    let results = users;
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      results = results.filter(user => 
        user.name.toLowerCase().includes(query) || 
        user.email.toLowerCase().includes(query)
      );
    }
    
    if (roleFilter !== 'all') {
      results = results.filter(user => user.role === roleFilter);
    }
    
    if (verificationFilter !== 'all') {
      const isVerified = verificationFilter === 'verified';
      results = results.filter(user => user.isVerified === isVerified);
    }
    
    setFilteredUsers(results);
  }, [searchQuery, roleFilter, verificationFilter, users]);
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  const handleRoleChange = (value: string) => {
    setRoleFilter(value);
  };
  
  const handleVerificationChange = (value: string) => {
    setVerificationFilter(value);
  };
  
  const handleVerifyUser = async (userId: string) => {
    const { error } = await supabase
      .from('users')
      .update({ is_verified: true })
      .eq('id', userId);
    if (!error) {
      setUsers(users.map(user => 
        user.id === userId ? { ...user, isVerified: true } : user
      ));
    } else {
      alert('Failed to verify user');
    }
  };
  
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Manage Users</h1>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4">
        <div className="md:flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
          <Input
            placeholder="Search users..."
            value={searchQuery}
            onChange={handleSearch}
              className="pl-10"
          />
          </div>
        </div>
        
        <div className="md:w-48">
          <div className="flex items-center">
            <Filter className="h-5 w-5 text-gray-500 mr-2" />
          <Select
            options={[
              { value: 'all', label: 'All Roles' },
              { value: 'business', label: 'Businesses' },
              { value: 'reviewer', label: 'Reviewers' },
            ]}
            value={roleFilter}
            onChange={handleRoleChange}
          />
          </div>
        </div>
        
        <div className="md:w-48">
          <Select
            options={[
              { value: 'all', label: 'All Status' },
              { value: 'verified', label: 'Verified' },
              { value: 'unverified', label: 'Unverified' },
            ]}
            value={verificationFilter}
            onChange={handleVerificationChange}
          />
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-12">
          <svg 
            className="animate-spin h-8 w-8 text-blue-600" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24"
          >
            <circle 
              className="opacity-25" 
              cx="12" 
              cy="12" 
              r="10" 
              stroke="currentColor" 
              strokeWidth="4"
            />
            <path 
              className="opacity-75" 
              fill="currentColor" 
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </div>
      ) : filteredUsers.length > 0 ? (
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Joined
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <Avatar name={user.name} size="md" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {user.role === 'business' ? (
                          <>
                            <Briefcase className="h-5 w-5 text-blue-500 mr-2" />
                            <span className="text-sm text-gray-900 capitalize">Business</span>
                          </>
                        ) : user.role === 'reviewer' ? (
                          <>
                            <Star className="h-5 w-5 text-amber-500 mr-2" />
                            <span className="text-sm text-gray-900 capitalize">Reviewer</span>
                          </>
                        ) : (
                          <>
                            <Users className="h-5 w-5 text-gray-500 mr-2" />
                            <span className="text-sm text-gray-900 capitalize">{user.role}</span>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{formatDate(user.createdAt)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.isVerified ? (
                        <Badge variant="success">Verified</Badge>
                      ) : (
                        <Badge variant="warning">Unverified</Badge>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          leftIcon={<Eye className="h-4 w-4" />}
                          // In a real app, this would navigate to a user detail page
                          onClick={() => alert(`View user ${user.id}`)}
                        >
                          View
                        </Button>
                        
                        {!user.isVerified && (
                          <Button
                            size="sm"
                            variant="success"
                            leftIcon={<Check className="h-4 w-4" />}
                            onClick={() => handleVerifyUser(user.id)}
                          >
                            Verify
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Users className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">No users found</h3>
          <p className="mt-1 text-gray-500">
            {searchQuery || roleFilter !== 'all' || verificationFilter !== 'all'
              ? 'Try adjusting your filters to see more results.'
              : 'There are no users registered yet.'}
          </p>
        </div>
      )}
    </div>
  );
};