import React, { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Button } from '../../components/ui/Button';
import { Alert } from '../../components/ui/Alert';

export const SettingsPage: React.FC = () => {
  const { user } = useAuthStore();
  
  const [personalInfo, setPersonalInfo] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: (user?.role === 'reviewer' && 'bio' in user) ? user.bio : '',
    website: (user?.role === 'business' && 'website' in user) ? user.website : '',
    companyName: (user?.role === 'business' && 'companyName' in user) ? user.companyName : '',
  });
  
  const [password, setPassword] = useState({
    current: '',
    new: '',
    confirm: '',
  });
  
  const [notifications, setNotifications] = useState({
    email: true,
    pushNotifications: false,
    marketingEmails: true,
  });
  
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setPersonalInfo({
      ...personalInfo,
      [e.target.name]: e.target.value,
    });
  };
  
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword({
      ...password,
      [e.target.name]: e.target.value,
    });
  };
  
  const handleNotificationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNotifications({
      ...notifications,
      [e.target.name]: e.target.checked,
    });
  };
  
  const handlePersonalInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would call an API to update the user info
    setSuccessMessage('Personal information updated successfully!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };
  
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password.new !== password.confirm) {
      setErrorMessage('New passwords do not match');
      setTimeout(() => setErrorMessage(''), 3000);
      return;
    }
    
    // In a real app, this would call an API to update the password
    setSuccessMessage('Password updated successfully!');
    setPassword({
      current: '',
      new: '',
      confirm: '',
    });
    setTimeout(() => setSuccessMessage(''), 3000);
  };
  
  const handleNotificationsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would call an API to update notification preferences
    setSuccessMessage('Notification preferences updated successfully!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };
  
  return (
    <div className="min-h-screen bg-black">
      <div className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-black to-gray-900 border-b border-gray-800">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-primary rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-primary rounded-full blur-3xl"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                Account <span className="text-primary">Settings</span>
              </h1>
              <p className="text-xl text-gray-300">
                Manage your profile, security, and preferences
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {successMessage && (
          <div className="bg-green-500 bg-opacity-10 border border-green-500 border-opacity-20 rounded-xl p-4">
            <Alert variant="success">
              {successMessage}
            </Alert>
          </div>
        )}

        {errorMessage && (
          <div className="bg-red-500 bg-opacity-10 border border-red-500 border-opacity-20 rounded-xl p-4">
            <Alert variant="error">
              {errorMessage}
            </Alert>
          </div>
        )}
      
        {/* Personal Information */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700 overflow-hidden">
          <div className="p-6 border-b border-gray-700">
            <h3 className="text-xl font-bold text-white mb-2">Personal Information</h3>
            <p className="text-gray-400 text-sm">Update your account information</p>
          </div>

          <form onSubmit={handlePersonalInfoSubmit}>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={personalInfo.name}
                    onChange={handlePersonalInfoChange}
                    required
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={personalInfo.email}
                    onChange={handlePersonalInfoChange}
                    required
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>

              {user?.role === 'reviewer' && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Bio</label>
                  <textarea
                    name="bio"
                    value={personalInfo.bio}
                    onChange={handlePersonalInfoChange}
                    placeholder="Tell us a bit about yourself"
                    rows={4}
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                  />
                  <p className="text-xs text-gray-400 mt-2">This information will be visible to businesses</p>
                </div>
              )}

              {user?.role === 'business' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Company Name</label>
                    <input
                      type="text"
                      name="companyName"
                      value={personalInfo.companyName}
                      onChange={handlePersonalInfoChange}
                      className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Website</label>
                    <input
                      type="url"
                      name="website"
                      value={personalInfo.website}
                      onChange={handlePersonalInfoChange}
                      placeholder="https://example.com"
                      className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </>
              )}
            </div>

            <div className="border-t border-gray-700 pt-6 px-6 pb-6 flex justify-end">
              <Button type="submit" className="bg-primary hover:bg-primary-600 text-black">
                Save Changes
              </Button>
            </div>
          </form>
        </div>

        {/* Change Password */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700 overflow-hidden">
          <div className="p-6 border-b border-gray-700">
            <h3 className="text-xl font-bold text-white mb-2">Change Password</h3>
            <p className="text-gray-400 text-sm">Update your password to keep your account secure</p>
          </div>

          <form onSubmit={handlePasswordSubmit}>
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Current Password</label>
                <input
                  type="password"
                  name="current"
                  value={password.current}
                  onChange={handlePasswordChange}
                  required
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">New Password</label>
                  <input
                    type="password"
                    name="new"
                    value={password.new}
                    onChange={handlePasswordChange}
                    required
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  <p className="text-xs text-gray-400 mt-2">At least 8 characters with mixed case, numbers, and symbols</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Confirm New Password</label>
                  <input
                    type="password"
                    name="confirm"
                    value={password.confirm}
                    onChange={handlePasswordChange}
                    required
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-gray-700 pt-6 px-6 pb-6 flex justify-end">
              <Button type="submit" className="bg-primary hover:bg-primary-600 text-black">
                Update Password
              </Button>
            </div>
          </form>
        </div>

        {/* Notification Settings */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700 overflow-hidden">
          <div className="p-6 border-b border-gray-700">
            <h3 className="text-xl font-bold text-white mb-2">Notification Preferences</h3>
            <p className="text-gray-400 text-sm">Control how and when you receive notifications</p>
          </div>

          <form onSubmit={handleNotificationsSubmit}>
            <div className="p-6 space-y-6">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-white">Email Notifications</h3>
                    <p className="text-sm text-gray-400">Receive updates about your campaigns or reviews</p>
                  </div>
                  <div>
                    <label className="inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="email"
                        className="sr-only"
                        checked={notifications.email}
                        onChange={handleNotificationChange}
                      />
                      <div className={`relative w-11 h-6 rounded-full transition-colors duration-300 ease-in-out ${notifications.email ? 'bg-primary' : 'bg-gray-600'}`}>
                        <div className={`absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow transform transition-transform duration-300 ease-in-out ${notifications.email ? 'translate-x-5' : 'translate-x-0'}`}></div>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-white">Push Notifications</h3>
                    <p className="text-sm text-gray-400">Receive alerts on your device</p>
                  </div>
                  <div>
                    <label className="inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="pushNotifications"
                        className="sr-only"
                        checked={notifications.pushNotifications}
                        onChange={handleNotificationChange}
                      />
                      <div className={`relative w-11 h-6 rounded-full transition-colors duration-300 ease-in-out ${notifications.pushNotifications ? 'bg-primary' : 'bg-gray-600'}`}>
                        <div className={`absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow transform transition-transform duration-300 ease-in-out ${notifications.pushNotifications ? 'translate-x-5' : 'translate-x-0'}`}></div>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-white">Marketing Emails</h3>
                    <p className="text-sm text-gray-400">Receive news, updates, and offers from ReviewHub</p>
                  </div>
                  <div>
                    <label className="inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="marketingEmails"
                        className="sr-only"
                        checked={notifications.marketingEmails}
                        onChange={handleNotificationChange}
                      />
                      <div className={`relative w-11 h-6 rounded-full transition-colors duration-300 ease-in-out ${notifications.marketingEmails ? 'bg-primary' : 'bg-gray-600'}`}>
                        <div className={`absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow transform transition-transform duration-300 ease-in-out ${notifications.marketingEmails ? 'translate-x-5' : 'translate-x-0'}`}></div>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-700 pt-6 px-6 pb-6 flex justify-end">
              <Button type="submit" className="bg-primary hover:bg-primary-600 text-black">
                Save Preferences
              </Button>
            </div>
          </form>
        </div>

        {/* Account Deletion */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-red-500 border-opacity-30 overflow-hidden">
          <div className="p-6 border-b border-red-500 border-opacity-20">
            <h3 className="text-xl font-bold text-red-400 mb-2">Delete Account</h3>
            <p className="text-gray-400 text-sm">Permanently delete your account and all your data</p>
          </div>

          <div className="p-6">
            <p className="text-gray-300 mb-6">
              This action cannot be undone. Once you delete your account, all of your data will be permanently removed.
            </p>

            <Button
              variant="danger"
              onClick={() => {
                if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                  // In a real app, this would call an API to delete the account
                  alert('In a real application, your account would be deleted now.');
                }
              }}
              className="bg-red-500 bg-opacity-20 border border-red-500 border-opacity-30 text-red-400 hover:bg-red-500 hover:bg-opacity-30 hover:text-red-300"
            >
              Delete Account
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};