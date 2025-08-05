import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('workerConnect_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email, password, role) => {
    const validCredentials = [
      { email: 'admin', password: '12345678', role: 'customer' },
      { email: 'worker', password: '12345678', role: 'worker' },
      { email: 'sharath', password: '12345678', role: 'customer' },
      { email: 'sharath', password: '12345678', role: 'worker' }
    ];

    const isValid = validCredentials.some(
      cred =>
        cred.email === email && cred.password === password && cred.role === role
    );

    if (isValid) {
      const baseUser = {
        email,
        role,
        name: role === 'customer' ? 'Sharath Kumar' : 'Sharath Singh',
        phone: '+91 9876543210',
        location: role === 'customer' ? 'Hyderabad' : 'Delhi',
        profilePicture:
          'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
      };

      const workerFields =
        role === 'worker'
          ? {
              workerId: 'WK001',
              profession: 'Plumber',
              experience: 5,
              bio: 'Experienced plumber with 5+ years in residential and commercial work.',
              skills: ['Pipe Fitting', 'Leak Repair', 'Bathroom Installation'],
              designation: 'Senior Plumber',
              department: 'Home Services',
              workLocation: 'Service Center',
              joiningDate: '2022-01-15',
              shiftTiming: '9 AM - 6 PM',
              supervisor: 'Mike Johnson',
              workStatus: 'Active',
              lastLogin: new Date().toLocaleString(),
              salary: '$55,000/year',
              paymentCycle: 'Monthly',
              rating: 4.8,
              totalReviews: 127
            }
          : {};

      const finalUser = { ...baseUser, ...workerFields };

      setUser(finalUser);
      localStorage.setItem('workerConnect_user', JSON.stringify(finalUser));
      return true;
    }

    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('workerConnect_user');
  };

  const updateProfile = (updatedData) => {
    if (!user) return;
    const updatedUser = { ...user, ...updatedData };
    setUser(updatedUser);
    localStorage.setItem('workerConnect_user', JSON.stringify(updatedUser));
  };

  const register = async (data) => {
    setUser(data);
    localStorage.setItem('workerConnect_user', JSON.stringify(data));
    return true;
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        logout,
        updateProfile,
        register
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
