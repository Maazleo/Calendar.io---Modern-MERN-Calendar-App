import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { IoPersonOutline, IoLockClosedOutline, IoSettingsOutline } from 'react-icons/io5';
import Button from '../components/ui/Button';

const Profile = () => {
  const { user, updateProfile, changePassword } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    preferences: {
      timezone: user?.preferences?.timezone || 'UTC',
      emailNotifications: user?.preferences?.emailNotifications ?? true,
      reminderTime: user?.preferences?.reminderTime || 15
    }
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleProfileChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.startsWith('preferences.')) {
      const prefKey = name.split('.')[1];
      setProfileData(prev => ({
        ...prev,
        preferences: {
          ...prev.preferences,
          [prefKey]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setProfileData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateProfileForm = () => {
    const newErrors = {};

    if (!profileData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!profileData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(profileData.email)) {
      newErrors.email = 'Email is invalid';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePasswordForm = () => {
    const newErrors = {};

    if (!passwordData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }

    if (!passwordData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (passwordData.newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters';
    }

    if (!passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateProfileForm()) {
      return;
    }

    setLoading(true);
    try {
      await updateProfile(profileData);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (!validatePasswordForm()) {
      return;
    }

    setLoading(true);
    try {
      await changePassword(passwordData.currentPassword, passwordData.newPassword);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      console.error('Error changing password:', error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'profile', name: 'Profile', icon: IoPersonOutline },
    { id: 'password', name: 'Password', icon: IoLockClosedOutline },
    { id: 'preferences', name: 'Preferences', icon: IoSettingsOutline }
  ];

  const timezones = [
    'UTC',
    'America/New_York',
    'America/Chicago',
    'America/Denver',
    'America/Los_Angeles',
    'Europe/London',
    'Europe/Paris',
    'Asia/Tokyo',
    'Asia/Shanghai',
    'Australia/Sydney'
  ];

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
          <p className="text-gray-600 mt-2">
            Manage your account settings and preferences
          </p>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm
                    ${activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                  `}
                >
                  <Icon size={16} />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {activeTab === 'profile' && (
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Profile Information</h2>
              <form onSubmit={handleProfileSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={profileData.name}
                      onChange={handleProfileChange}
                      className={`input ${errors.name ? 'border-red-300' : ''}`}
                    />
                    {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={profileData.email}
                      onChange={handleProfileChange}
                      className={`input ${errors.email ? 'border-red-300' : ''}`}
                    />
                    {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button type="submit" loading={loading}>
                    Update Profile
                  </Button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'password' && (
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Change Password</h2>
              <form onSubmit={handlePasswordSubmit} className="space-y-6">
                <div>
                  <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Current Password
                  </label>
                  <input
                    type="password"
                    id="currentPassword"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    className={`input ${errors.currentPassword ? 'border-red-300' : ''}`}
                  />
                  {errors.currentPassword && <p className="mt-1 text-sm text-red-600">{errors.currentPassword}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                      New Password
                    </label>
                    <input
                      type="password"
                      id="newPassword"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      className={`input ${errors.newPassword ? 'border-red-300' : ''}`}
                    />
                    {errors.newPassword && <p className="mt-1 text-sm text-red-600">{errors.newPassword}</p>}
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      className={`input ${errors.confirmPassword ? 'border-red-300' : ''}`}
                    />
                    {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button type="submit" loading={loading}>
                    Change Password
                  </Button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'preferences' && (
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Preferences</h2>
              <form onSubmit={handleProfileSubmit} className="space-y-6">
                <div>
                  <label htmlFor="timezone" className="block text-sm font-medium text-gray-700 mb-1">
                    Timezone
                  </label>
                  <select
                    id="timezone"
                    name="preferences.timezone"
                    value={profileData.preferences.timezone}
                    onChange={handleProfileChange}
                    className="input"
                  >
                    {timezones.map(tz => (
                      <option key={tz} value={tz}>{tz}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="reminderTime" className="block text-sm font-medium text-gray-700 mb-1">
                    Default Reminder Time (minutes before event)
                  </label>
                  <input
                    type="number"
                    id="reminderTime"
                    name="preferences.reminderTime"
                    min="1"
                    max="1440"
                    value={profileData.preferences.reminderTime}
                    onChange={handleProfileChange}
                    className="input"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="emailNotifications"
                    name="preferences.emailNotifications"
                    checked={profileData.preferences.emailNotifications}
                    onChange={handleProfileChange}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="emailNotifications" className="ml-2 block text-sm text-gray-900">
                    Receive email notifications for event reminders
                  </label>
                </div>

                <div className="flex justify-end">
                  <Button type="submit" loading={loading}>
                    Save Preferences
                  </Button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile; 