import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useParams } from 'react-router-dom';
import Profile from './Profile';
import WorkerProfile from './WorkerProfile';
import EditProfile from './EditProfile';
import { Login } from './Login';

const ProfilePage = () => {
  const { user: currentUser, isAuthenticated } = useAuth();
  const { userId } = useParams(); // dynamic param
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (!userId) {
      // No userId in URL → show logged-in user
      setUser(currentUser);
    } else {
      // Fetch the worker data by ID (replace with your API or context)
      fetch(`/api/users/${userId}`)
        .then(res => res.json())
        .then(data => setUser(data));
    }
  }, [userId, currentUser]);

  if (!isAuthenticated) return <Login />;
  if (!user) return <div>Loading...</div>;
  if (isEditing) return <EditProfile onCancel={() => setIsEditing(false)} />;

  // Decide which component to render
  return user.role === 'worker' ? (
    <WorkerProfile user={user} onEditProfile={() => setIsEditing(true)} />
  ) : (
    <Profile user={user} onEditProfile={() => setIsEditing(true)} />
  );
};

export default ProfilePage;
