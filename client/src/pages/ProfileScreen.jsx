// src/pages/ProfileScreen.jsx
import React, { useEffect } from "react";
import axios from "axios";
import Profile from "@/pages/Profile"; // your visual component from earlier
import { useAuth } from "@/contexts/AuthContext";

const ProfileScreen = () => {
  const { user, updateProfile } = useAuth();

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.token) return;
      const url =
        user.role === "worker"
          ? "https://service-portal-hppp.onrender.com/api/worker/profile"
          : "https://service-portal-hppp.onrender.com/api/client/profile";
      try {
        const { data } = await axios.get(url);
        if (data?.success) {
          const fresh = data.worker || data.user;
          if (fresh) updateProfile(fresh);
        }
      } catch {}
    };
    fetchProfile();
  }, [user?.token, user?.role, updateProfile]);

  return <Profile user={user} onEditProfile={() => {}} />;
};

export default ProfileScreen;
