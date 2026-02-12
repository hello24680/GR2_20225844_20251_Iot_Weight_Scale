import React, { useState, useEffect } from 'react';
import { userService } from '../services/userService';
import { ImageEditorModal } from '../components/userProfile/ImageEditorModal';
import { ProfileHeader } from '../components/userProfile/ProfileHeader';
import { AboutCard } from '../components/userProfile/AboutCard';
import { BioSection } from '../components/userProfile/BioSection';
import { AccountSettings } from '../components/userProfile/AccountSettings';

export const UserProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingImages, setIsEditingImages] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tempImageUrls, setTempImageUrls] = useState({ avatarUrl: '', coverUrl: '' });

  // Load user data from API
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const data = await userService.getProfile();
        setUserData(data);
      } catch (error) {
        console.error('Failed to load user data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  const handleSave = async () => {
    try {
      const updatedUser = await userService.updateProfile(userData);
      setUserData(updatedUser);
      setIsEditing(false);
      console.log('Profile updated successfully');
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  const handleOpenImageEditor = () => {
    setTempImageUrls({
      avatarUrl: userData.avatarUrl || '',
      coverUrl: userData.coverUrl || ''
    });
    setIsEditingImages(true);
  };

  const handleSaveImages = async () => {
    try {
      const updatedUser = await userService.updateProfile({
        avatarUrl: tempImageUrls.avatarUrl,
        coverUrl: tempImageUrls.coverUrl
      });
      setUserData(updatedUser);
      setIsEditingImages(false);
      console.log('Images updated successfully');
    } catch (error) {
      console.error('Failed to update images:', error);
    }
  };

  const handleDeleteAccount = () => {
    console.log('Delete account requested');
  };

  if (loading) {
    return (
      <div className="w-full max-w-5xl mx-auto flex items-center justify-center min-h-screen">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="w-full max-w-5xl mx-auto flex items-center justify-center min-h-screen">
        <div className="text-red-500">Failed to load user profile</div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto animate-in fade-in duration-500 pb-10">
      <ImageEditorModal 
        isOpen={isEditingImages}
        tempImageUrls={tempImageUrls}
        setTempImageUrls={setTempImageUrls}
        onSave={handleSaveImages}
        onClose={() => setIsEditingImages(false)}
      />

      <ProfileHeader
        userData={userData}
        isEditing={isEditing}
        onEdit={() => setIsEditing(true)}
        onCancel={() => setIsEditing(false)}
        onSave={handleSave}
        onOpenImageEditor={handleOpenImageEditor}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <AboutCard 
            userData={userData}
            isEditing={isEditing}
            setUserData={setUserData}
          />
        </div>

        <div className="lg:col-span-2 space-y-6">
          <BioSection 
            userData={userData}
            isEditing={isEditing}
            setUserData={setUserData}
          />

          <AccountSettings 
            userData={userData}
            setUserData={setUserData}
            onDeleteAccount={handleDeleteAccount}
          />
        </div>
      </div>
    </div>
  );
};
