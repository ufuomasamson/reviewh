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
    <div className="space-y-10">
      <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
      
      {successMessage && (
        <Alert variant="success">
          {successMessage}
        </Alert>
      )}
      
      {errorMessage && (
        <Alert variant="error">
          {errorMessage}
        </Alert>
      )}
      
      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>
            Update your account information
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handlePersonalInfoSubmit}>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Full Name"
                name="name"
                value={personalInfo.name}
                onChange={handlePersonalInfoChange}
                required
              />
              
              <Input
                label="Email"
                type="email"
                name="email"
                value={personalInfo.email}
                onChange={handlePersonalInfoChange}
                required
              />
            </div>
            
            {user?.role === 'reviewer' && (
              <Textarea
                label="Bio"
                name="bio"
                value={personalInfo.bio}
                onChange={handlePersonalInfoChange}
                placeholder="Tell us a bit about yourself"
                helpText="This information will be visible to businesses"
              />
            )}
            
            {user?.role === 'business' && (
              <>
                <Input
                  label="Company Name"
                  name="companyName"
                  value={personalInfo.companyName}
                  onChange={handlePersonalInfoChange}
                />
                
                <Input
                  label="Website"
                  name="website"
                  value={personalInfo.website}
                  onChange={handlePersonalInfoChange}
                  placeholder="https://example.com"
                />
              </>
            )}
          </CardContent>
          
          <CardFooter className="border-t pt-6 flex justify-end">
            <Button type="submit">
              Save Changes
            </Button>
          </CardFooter>
        </form>
      </Card>
      
      {/* Change Password */}
      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
          <CardDescription>
            Update your password to keep your account secure
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handlePasswordSubmit}>
          <CardContent className="space-y-6">
            <Input
              label="Current Password"
              type="password"
              name="current"
              value={password.current}
              onChange={handlePasswordChange}
              required
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="New Password"
                type="password"
                name="new"
                value={password.new}
                onChange={handlePasswordChange}
                required
                helpText="At least 8 characters with mixed case, numbers, and symbols"
              />
              
              <Input
                label="Confirm New Password"
                type="password"
                name="confirm"
                value={password.confirm}
                onChange={handlePasswordChange}
                required
              />
            </div>
          </CardContent>
          
          <CardFooter className="border-t pt-6 flex justify-end">
            <Button type="submit">
              Update Password
            </Button>
          </CardFooter>
        </form>
      </Card>
      
      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Notification Preferences</CardTitle>
          <CardDescription>
            Control how and when you receive notifications
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleNotificationsSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Email Notifications</h3>
                  <p className="text-sm text-gray-500">Receive updates about your campaigns or reviews</p>
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
                    <div className={`relative w-11 h-6 bg-gray-200 rounded-full transition-colors duration-300 ease-in-out ${notifications.email ? 'bg-blue-600' : 'bg-gray-200'}`}>
                      <div className={`absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow transform transition-transform duration-300 ease-in-out ${notifications.email ? 'translate-x-5' : 'translate-x-0'}`}></div>
                    </div>
                  </label>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Push Notifications</h3>
                  <p className="text-sm text-gray-500">Receive alerts on your device</p>
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
                    <div className={`relative w-11 h-6 bg-gray-200 rounded-full transition-colors duration-300 ease-in-out ${notifications.pushNotifications ? 'bg-blue-600' : 'bg-gray-200'}`}>
                      <div className={`absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow transform transition-transform duration-300 ease-in-out ${notifications.pushNotifications ? 'translate-x-5' : 'translate-x-0'}`}></div>
                    </div>
                  </label>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Marketing Emails</h3>
                  <p className="text-sm text-gray-500">Receive news, updates, and offers from ReviewHub</p>
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
                    <div className={`relative w-11 h-6 bg-gray-200 rounded-full transition-colors duration-300 ease-in-out ${notifications.marketingEmails ? 'bg-blue-600' : 'bg-gray-200'}`}>
                      <div className={`absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow transform transition-transform duration-300 ease-in-out ${notifications.marketingEmails ? 'translate-x-5' : 'translate-x-0'}`}></div>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="border-t pt-6 flex justify-end">
            <Button type="submit">
              Save Preferences
            </Button>
          </CardFooter>
        </form>
      </Card>
      
      {/* Account Deletion */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-red-600">Delete Account</CardTitle>
          <CardDescription>
            Permanently delete your account and all your data
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <p className="text-gray-700 mb-4">
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
          >
            Delete Account
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};