import React, { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { supabase } from '../../lib/supabase';
import { Button } from '../../components/ui/Button';
import { useNavigate } from 'react-router-dom';

export const VerifyBusinessPage: React.FC = () => {
  const { user } = useAuthStore();
  console.log('VerifyBusinessPage:', { user });
  const [filesRegistered, setFilesRegistered] = useState<FileList | null>(null);
  const [filesFreelancer, setFilesFreelancer] = useState<FileList | null>(null);
  const [isSubmittingRegistered, setIsSubmittingRegistered] = useState(false);
  const [isSubmittingFreelancer, setIsSubmittingFreelancer] = useState(false);
  const [errorRegistered, setErrorRegistered] = useState<string | null>(null);
  const [errorFreelancer, setErrorFreelancer] = useState<string | null>(null);
  const [successRegistered, setSuccessRegistered] = useState(false);
  const [successFreelancer, setSuccessFreelancer] = useState(false);
  const navigate = useNavigate();

  if (!user || user.role !== 'business') {
    return <div className="text-center py-12">You do not have access to this page.</div>;
  }

  const handleFileChangeRegistered = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilesRegistered(e.target.files);
  };
  const handleFileChangeFreelancer = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilesFreelancer(e.target.files);
  };

  const handleSubmit = async (
    files: FileList | null,
    setError: (msg: string | null) => void,
    setSuccess: (val: boolean) => void,
    setIsSubmitting: (val: boolean) => void,
    verificationType: 'registered' | 'freelancer'
  ) => {
    setError(null);
    setSuccess(false);
    if (!files || files.length === 0) {
      setError('Please select at least one document to upload.');
      return;
    }
    setIsSubmitting(true);
    try {
      const uploadedUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const path = `business-verifications/${user.id}/${verificationType}/${file.name}`;
        const { error: uploadError } = await supabase.storage.from('documents').upload(path, file, { upsert: true });
        if (uploadError) throw uploadError;
        uploadedUrls.push(path);
      }
      // Update businesses table with document paths and verification_type
      const { error: updateError } = await supabase
        .from('businesses')
        .update({ verification_documents: uploadedUrls, verification_type: verificationType })
        .eq('id', user.id);
      if (updateError) throw updateError;
      setSuccess(true);
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err: any) {
      setError('Failed to submit documents: ' + (err.message || err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-10 space-y-10">
      <h1 className="text-2xl font-bold mb-4">Business Verification</h1>
      <p className="mb-6 text-gray-700">Please choose the option that best describes your business and upload the required documents for verification.</p>
      {/* Registered Business Section */}
      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-2">Registered Business</h2>
        <p className="mb-4 text-gray-600">If your business is officially registered, please upload your CAC certificate, business ID, or other official documents.</p>
        <form onSubmit={e => { e.preventDefault(); handleSubmit(filesRegistered, setErrorRegistered, setSuccessRegistered, setIsSubmittingRegistered, 'registered'); }} className="space-y-4">
          <input
            type="file"
            multiple
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleFileChangeRegistered}
            className="block w-full border border-gray-300 rounded-md p-2"
          />
          {errorRegistered && <div className="text-red-600 text-sm">{errorRegistered}</div>}
          {successRegistered && <div className="text-green-600 text-sm">Documents submitted successfully! Redirecting...</div>}
          <Button type="submit" isLoading={isSubmittingRegistered} fullWidth>
            Submit Registered Business Documents
          </Button>
        </form>
      </div>
      {/* Freelancer/Unregistered Business Section */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-2">Freelancer / Unregistered Business</h2>
        <p className="mb-4 text-gray-600">If you operate as a freelancer or your business is not officially registered, please upload a government-issued ID, proof of address, or other supporting documents.</p>
        <form onSubmit={e => { e.preventDefault(); handleSubmit(filesFreelancer, setErrorFreelancer, setSuccessFreelancer, setIsSubmittingFreelancer, 'freelancer'); }} className="space-y-4">
          <input
            type="file"
            multiple
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleFileChangeFreelancer}
            className="block w-full border border-gray-300 rounded-md p-2"
          />
          {errorFreelancer && <div className="text-red-600 text-sm">{errorFreelancer}</div>}
          {successFreelancer && <div className="text-green-600 text-sm">Documents submitted successfully! Redirecting...</div>}
          <Button type="submit" isLoading={isSubmittingFreelancer} fullWidth>
            Submit Freelancer Documents
          </Button>
        </form>
      </div>
    </div>
  );
}; 