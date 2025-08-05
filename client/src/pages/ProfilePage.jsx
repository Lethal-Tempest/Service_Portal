import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Profile from './Profile';
import WorkerProfile from './WorkerProfile';
import EditProfile from './EditProfile';
import { Login } from './Login';

const ProfilePage = () => {
  const { user, isAuthenticated } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  if (!isAuthenticated) {
    return <Login />;
  }

  if (isEditing) {
    return <EditProfile onCancel={() => setIsEditing(false)} />;
  }

  if (user?.role === 'worker') {
    return <WorkerProfile onEditProfile={() => setIsEditing(true)} />;
  }

  return <Profile onEditProfile={() => setIsEditing(true)} />;
};

export default ProfilePage;
