import React, { useState, useEffect } from 'react';
import { FileCheck, Search, Filter, Check, X, Eye, ExternalLink } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Business } from '../../lib/types';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../../components/ui/Card';
import { Avatar } from '../../components/ui/Avatar';
import { formatDate } from '../../lib/utils';

// Extended business type with verification documents
interface BusinessWithVerification extends Business {
  verificationDocuments?: string[];
  verificationStatus?: 'pending' | 'approved' | 'rejected';
  verificationNotes?: string;
  submittedAt?: string;
}

export const VerificationsPage: React.FC = () => {
  const [verifications, setVerifications] = useState<BusinessWithVerification[]>([]);
  const [filteredVerifications, setFilteredVerifications] = useState<BusinessWithVerification[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVerifications = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Join users and businesses tables
        const { data, error: fetchError } = await supabase
          .from('businesses')
          .select(`
            id,
            company_name,
            description,
            website,
            verification_documents,
            wallet_balance,
            created_at,
            users:users!inner(
              id,
              name,
              email,
              is_verified,
              created_at
            )
          `)
          .order('created_at', { ascending: false });

        if (fetchError) throw fetchError;
        if (!data) {
          setVerifications([]);
          setFilteredVerifications([]);
          setIsLoading(false);
          return;
        }

        // Map to UI format
        const verificationData: BusinessWithVerification[] = data.map((b: any) => {
          const user = b.users || {};
          // Determine status from is_verified or verification_documents
          let verificationStatus: 'pending' | 'approved' | 'rejected' = 'pending';
          if (user.is_verified) verificationStatus = 'approved';
          // If you have a field for rejected, add logic here
          return {
            id: b.id,
            name: user.name,
            email: user.email,
            role: 'business',
            companyName: b.company_name,
            description: b.description,
            website: b.website,
            isVerified: user.is_verified,
            walletBalance: b.wallet_balance,
            createdAt: user.created_at,
            verificationDocuments: Array.isArray(b.verification_documents)
              ? b.verification_documents
              : (b.verification_documents ? Object.values(b.verification_documents) : []),
            verificationStatus,
            verificationNotes: '', // Add logic if you have notes
            submittedAt: b.created_at,
          };
        });
        setVerifications(verificationData);
        setFilteredVerifications(verificationData);
      } catch (err: any) {
        setError('Failed to fetch verifications: ' + (err.message || err));
        setVerifications([]);
        setFilteredVerifications([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchVerifications();
  }, []);

  useEffect(() => {
    let results = verifications;
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      results = results.filter(verification =>
        verification.name?.toLowerCase().includes(query) ||
        verification.email?.toLowerCase().includes(query) ||
        verification.companyName?.toLowerCase().includes(query)
      );
    }
    if (statusFilter !== 'all') {
      results = results.filter(verification => verification.verificationStatus === statusFilter);
    }
    setFilteredVerifications(results);
  }, [searchQuery, statusFilter, verifications]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
  };

  const handleApprove = async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      // Update is_verified in users table
      const { error: updateError } = await supabase
        .from('users')
        .update({ is_verified: true })
        .eq('id', id);
      if (updateError) throw updateError;
      // Optionally update verification status in businesses table if you have such a field
      setVerifications(verifications.map(verification =>
        verification.id === id
          ? { ...verification, verificationStatus: 'approved', isVerified: true }
          : verification
      ));
    } catch (err: any) {
      setError('Failed to approve business: ' + (err.message || err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      // Update is_verified in users table
      const { error: updateError } = await supabase
        .from('users')
        .update({ is_verified: false })
        .eq('id', id);
      if (updateError) throw updateError;
      // Optionally update verification status in businesses table if you have such a field
      setVerifications(verifications.map(verification =>
        verification.id === id
          ? { ...verification, verificationStatus: 'rejected', isVerified: false }
          : verification
      ));
    } catch (err: any) {
      setError('Failed to reject business: ' + (err.message || err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Business Verifications</h1>
      </div>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="md:flex-1">
          <Input
            placeholder="Search businesses..."
            icon={<Search className="h-5 w-5" />}
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
        <div className="md:w-64">
          <Select
            options={[
              { value: 'all', label: 'All Status' },
              { value: 'pending', label: 'Pending' },
              { value: 'approved', label: 'Approved' },
              { value: 'rejected', label: 'Rejected' },
            ]}
            value={statusFilter}
            onChange={handleStatusChange}
          />
        </div>
      </div>
      {error && (
        <div className="text-red-600 text-center py-2">{error}</div>
      )}
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
      ) : filteredVerifications.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-6">
          {filteredVerifications.map((verification) => (
            <Card key={verification.id}>
              <CardHeader className="flex flex-row items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{verification.companyName}</CardTitle>
                  <p className="text-sm text-gray-500 mt-1">Submitted: {formatDate(verification.submittedAt || '')}</p>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                  verification.verificationStatus === 'approved' ? 'bg-green-100 text-green-800' :
                  verification.verificationStatus === 'rejected' ? 'bg-red-100 text-red-800' :
                  'bg-amber-100 text-amber-800'
                }`}>
                  {verification.verificationStatus === 'approved' ? 'Approved' :
                   verification.verificationStatus === 'rejected' ? 'Rejected' :
                   'Pending'}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center">
                  <Avatar name={verification.name} size="md" />
                  <div className="ml-3">
                    <p className="text-sm font-medium">{verification.name}</p>
                    <p className="text-sm text-gray-500">{verification.email}</p>
                  </div>
                </div>
                <div className="border-t border-b py-4">
                  <h3 className="text-sm font-medium mb-2">Submitted Documents</h3>
                  <ul className="space-y-2">
                    {verification.verificationDocuments?.length ? verification.verificationDocuments.map((doc, index) => (
                      <li key={index} className="flex items-center text-sm">
                        <FileCheck className="h-4 w-4 text-green-500 mr-2" />
                        <span className="text-gray-600">{doc}</span>
                        <button className="ml-auto text-blue-600 hover:text-blue-800">
                          <Eye className="h-4 w-4" />
                        </button>
                      </li>
                    )) : <li className="text-gray-400 text-sm">No documents submitted</li>}
                  </ul>
                </div>
                {verification.website && (
                  <div className="flex items-center text-sm">
                    <span className="text-gray-500 mr-2">Website:</span>
                    <a
                      href={verification.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 flex items-center"
                    >
                      {verification.website}
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </a>
                  </div>
                )}
                {verification.verificationNotes && (
                  <div className="bg-gray-50 p-3 rounded-md">
                    <h3 className="text-sm font-medium mb-1">Notes</h3>
                    <p className="text-sm text-gray-600">{verification.verificationNotes}</p>
                  </div>
                )}
              </CardContent>
              {verification.verificationStatus === 'pending' && (
                <CardFooter className="border-t pt-4 flex justify-end space-x-3">
                  <Button
                    variant="outline"
                    size="sm"
                    leftIcon={<X className="h-4 w-4" />}
                    onClick={() => handleReject(verification.id)}
                  >
                    Reject
                  </Button>
                  <Button
                    variant="success"
                    size="sm"
                    leftIcon={<Check className="h-4 w-4" />}
                    onClick={() => handleApprove(verification.id)}
                  >
                    Approve
                  </Button>
                </CardFooter>
              )}
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <FileCheck className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">No verifications found</h3>
          <p className="mt-1 text-gray-500">
            {searchQuery || statusFilter !== 'all'
              ? 'Try adjusting your filters to see more results.'
              : 'There are no business verification requests.'}
          </p>
        </div>
      )}
    </div>
  );
};