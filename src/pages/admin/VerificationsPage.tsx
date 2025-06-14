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
  userId: string;
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

  // TEMPORARY: Test button to debug storage access
  // Remove after testing
  const testPath = 'business-verifications/4dd87a05-56c2-401e-9242-f55288012c29/registered/WID6534545454544.png';

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
            created_at,
            users!inner(
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
          console.log('Mapping business:', { businessId: b.id, user });
          // Determine status from is_verified or verification_documents
          let verificationStatus: 'pending' | 'approved' | 'rejected' = 'pending';
          if (user.is_verified) verificationStatus = 'approved';
          // If you have a field for rejected, add logic here
          return {
            id: b.id,
            userId: user.id,
            name: user.name,
            email: user.email,
            role: 'business',
            companyName: b.company_name,
            description: b.description,
            website: b.website,
            isVerified: user.is_verified,
            walletBalance: user.balance,
            balance: user.balance,
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

  const handleApprove = async (userId: string, businessId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      // Update is_verified in users table
      const { data: updateData, error: updateError } = await supabase
        .from('users')
        .update({ is_verified: true })
        .eq('id', userId);
      console.log('Approve result:', { updateData, updateError, userId, businessId });
      if (updateError) throw updateError;
      setVerifications(verifications.map(verification =>
        verification.id === businessId
          ? { ...verification, verificationStatus: 'approved', isVerified: true }
          : verification
      ));
    } catch (err: any) {
      setError('Failed to approve business: ' + (err.message || err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async (userId: string, businessId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      // Update is_verified in users table
      const { data: updateData, error: updateError } = await supabase
        .from('users')
        .update({ is_verified: false })
        .eq('id', userId);
      console.log('Reject result:', { updateData, updateError, userId, businessId });
      if (updateError) throw updateError;
      setVerifications(verifications.map(verification =>
        verification.id === businessId
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
    <div className="min-h-screen bg-black">
      {/* Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-black to-gray-900 border-b border-gray-800">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-primary rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-primary rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                Business <span className="text-primary">Verifications</span>
              </h1>
              <p className="text-xl text-gray-300">
                Review and approve business verification requests
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Search and Filter Section */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700 p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="md:flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search businesses..."
                  value={searchQuery}
                  onChange={handleSearch}
                  className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>
            <div className="md:w-64">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent appearance-none"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        {error && (
          <div className="bg-red-500 bg-opacity-10 border border-red-500 border-opacity-20 rounded-xl p-4">
            <p className="text-red-400 text-center">{error}</p>
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center py-12">
            <svg
              className="animate-spin h-8 w-8 text-primary"
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
              <div key={verification.id} className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700 overflow-hidden">
                <div className="p-6 border-b border-gray-700">
                  <div className="flex flex-row items-start justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-white">{verification.companyName}</h3>
                      <p className="text-sm text-gray-400 mt-1">Submitted: {formatDate(verification.submittedAt || '')}</p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                      verification.verificationStatus === 'approved' ? 'bg-green-500 bg-opacity-20 text-green-400' :
                      verification.verificationStatus === 'rejected' ? 'bg-red-500 bg-opacity-20 text-red-400' :
                      'bg-yellow-500 bg-opacity-20 text-yellow-400'
                    }`}>
                      {verification.verificationStatus === 'approved' ? 'Approved' :
                       verification.verificationStatus === 'rejected' ? 'Rejected' :
                       'Pending'}
                    </div>
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex items-center">
                    <Avatar name={verification.name} size="md" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-white">{verification.name}</p>
                      <p className="text-sm text-gray-400">{verification.email}</p>
                    </div>
                  </div>
                  <div className="border-t border-gray-700 pt-4">
                    <h3 className="text-sm font-medium text-white mb-3">Submitted Documents</h3>
                    <ul className="space-y-2">
                      {verification.verificationDocuments?.length ? verification.verificationDocuments.map((doc, index) => (
                        <li key={index} className="flex items-center text-sm bg-gray-900 rounded-lg p-3 border border-gray-700">
                          <FileCheck className="h-4 w-4 text-green-400 mr-3 flex-shrink-0" />
                          <span className="text-gray-300 flex-1 truncate">{doc}</span>
                          <button
                            className="ml-3 text-primary hover:text-primary-400 transition-colors"
                            onClick={async () => {
                              console.log('Document path:', doc);
                              const { data, error } = await supabase.storage.from('documents').createSignedUrl(doc, 60 * 60);
                              if (data?.signedUrl) {
                                window.open(data.signedUrl, '_blank');
                              } else {
                                alert('Unable to open document. ' + (error?.message || ''));
                                console.log('Signed URL error:', error);
                              }
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                        </li>
                      )) : <li className="text-gray-500 text-sm bg-gray-900 rounded-lg p-3 border border-gray-700">No documents submitted</li>}
                    </ul>
                  </div>
                  {verification.website && (
                    <div className="flex items-center text-sm pt-4 border-t border-gray-700">
                      <span className="text-gray-400 mr-2">Website:</span>
                      <a
                        href={verification.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:text-primary-400 flex items-center transition-colors"
                      >
                        {verification.website}
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </a>
                    </div>
                  )}
                  {verification.verificationNotes && (
                    <div className="bg-gray-900 border border-gray-700 p-4 rounded-lg">
                      <h3 className="text-sm font-medium text-white mb-2">Notes</h3>
                      <p className="text-sm text-gray-300">{verification.verificationNotes}</p>
                    </div>
                  )}
                </div>
                {verification.verificationStatus === 'pending' && (
                  <div className="border-t border-gray-700 p-6 flex justify-end space-x-3">
                    <Button
                      onClick={() => handleReject(verification.userId, verification.id)}
                      className="bg-red-600 hover:bg-red-700 text-white border-red-600"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Reject
                    </Button>
                    <Button
                      onClick={() => handleApprove(verification.userId, verification.id)}
                      className="bg-green-600 hover:bg-green-700 text-white border-green-600"
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Approve
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700">
            <FileCheck className="mx-auto h-12 w-12 text-gray-600 mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No verifications found</h3>
            <p className="text-gray-400">
              {searchQuery || statusFilter !== 'all'
                ? 'Try adjusting your filters to see more results.'
                : 'There are no business verification requests.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};