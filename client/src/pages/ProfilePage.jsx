import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useParams } from 'react-router-dom';
import Profile from './Profile';
import WorkerProfile from '../components/WorkerProfile';
import EditProfile from './EditProfile';
import { Login } from './Login';

const ProfilePage = () => {
  const { user: currentUser, isAuthenticated, token } = useAuth();
  const { userId } = useParams(); 
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) return;

    if (!userId) {
      // Logged-in user's own profile
      setUser(currentUser);
    } else {
      // Fetch a worker profile by ID
      fetch(`http://localhost:5000/api/worker/${userId}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // send JWT if required
        },
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setUser(data.worker);
          } else {
            console.error("Failed to fetch worker profile", data.message);
          }
        })
        .catch(err => console.error("Error fetching worker profile:", err));
    }
  }, [userId, currentUser, isAuthenticated, token]);

  // Handle unauthenticated users
  if (!isAuthenticated) return <Login />;

  // While fetching / setting user
  if (!user) return <div>Loading...</div>;

  // Edit mode
  if (isEditing) return <EditProfile user={user} onCancel={() => setIsEditing(false)} />;

  // Decide which profile to render
  return user.role === 'worker' ? (
  <WorkerProfile user={user} onEditProfile={() => setIsEditing(true)} />
) : (
  <Profile user={user} onEditProfile={() => setIsEditing(true)} />

);


};

export default ProfilePage;
