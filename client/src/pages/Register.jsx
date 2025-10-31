import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff, User, Briefcase, Upload, ArrowRight, ArrowLeft, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card } from '../components/ui/card';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../hooks/use-toast';

const ValidMsg = ({ ok, msg }) => (
  <div className={`mt-1 text-xs flex items-center gap-1 ${ok ? 'text-green-600' : 'text-red-600'}`}>
    {ok ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
    <span>{msg}</span>
  </div>
);

export const Register = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const roleFromUrl = searchParams.get('role') || 'customer';
  const [selectedRole, setSelectedRole] = useState(roleFromUrl);
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { register, login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (selectedRole !== roleFromUrl) setSelectedRole(roleFromUrl);
  }, [roleFromUrl, selectedRole]);

  const switchRole = (role) => {
    setSelectedRole(role);
    const next = new URLSearchParams(searchParams);
    next.set('role', role);
    setSearchParams(next, { replace: true });
    setCurrentStep(1);
  };

  const INDIAN_STATES = [
    'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Delhi','Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal'
  ];

  const professions = [
    'Plumber','Electrician','Carpenter','House Cleaner','Painter','Gardener','Mason','AC Technician','Appliance Repair','Driver'
  ];

  // Validation helpers
  const validateEmail = (email) => /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(String(email).trim());
  const normalizePhone = (p) => String(p || '').replace(/\D/g, '');
  const validateIndianPhone = (phone) => /^[6-9]\d{9}$/.test(normalizePhone(phone));
  const nonEmpty = (s) => String(s || '').trim().length > 0;
  const minLen = (s, n) => String(s || '').length >= n;

  // Customer state
  const [customerData, setCustomerData] = useState({
    name: '',
    email: '',
    phone: '',
    locality: '',  // UI only
    state: '',     // backend location
    password: '',
    confirmPassword: ''
  });

  // Worker state
  const [workerData, setWorkerData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    locality: '',  // UI only
    state: '',     // backend location
    profession: '',
    experience: '',
    bio: '',
    skills: '',
    secondno: '',
    secondmail: '',
    voterid: '',
    aadharNumber: '',
    availableImmediately: 'yes',
    profilePicFile: null,
    aadharPicFile: null,
    previousWorkPicsFiles: [],
    introVideo: null,
    price: 0,
  });

  // Live validation – customer
  const custValid = {
    name: nonEmpty(customerData.name),
    email: validateEmail(customerData.email),
    phone: validateIndianPhone(customerData.phone),
    state: nonEmpty(customerData.state),
    password: minLen(customerData.password, 8),
    confirm: customerData.confirmPassword === customerData.password && nonEmpty(customerData.confirmPassword),
  };
  const isCustomerFormValid = Object.values(custValid).every(Boolean);

  // Live validation – worker by step
  const workerStep1Valid = {
    firstLast: nonEmpty(workerData.name.split(' ')[0]) && nonEmpty(workerData.name.split(' ').slice(1).join(' ')),
    email: validateEmail(workerData.email),
    phone: validateIndianPhone(workerData.phone),
    state: nonEmpty(workerData.state),
    profession: nonEmpty(workerData.profession),
    experience: String(workerData.experience).length > 0 && Number(workerData.experience) >= 0,
  };
  const isWorkerStep1Valid = Object.values(workerStep1Valid).every(Boolean);

  const workerStep2Valid = {
    bio: nonEmpty(workerData.bio),
    skills: nonEmpty(workerData.skills),
  };
  const isWorkerStep2Valid = Object.values(workerStep2Valid).every(Boolean);

  const workerStep3Valid = {
    password: minLen(workerData.password, 8),
    confirm: workerData.confirmPassword === workerData.password && nonEmpty(workerData.confirmPassword),
    aadharNumber: nonEmpty(workerData.aadharNumber),
    aadharPicFile: !!workerData.aadharPicFile,
    profilePicFile: !!workerData.profilePicFile,
  };
  const isWorkerStep3Valid = Object.values(workerStep3Valid).every(Boolean);

  const isWorkerStepValid = useMemo(() => {
    if (currentStep === 1) return isWorkerStep1Valid;
    if (currentStep === 2) return isWorkerStep2Valid;
    if (currentStep === 3) return isWorkerStep3Valid;
    return true;
  }, [currentStep, isWorkerStep1Valid, isWorkerStep2Valid, isWorkerStep3Valid]);

  // Submit handlers (unchanged logic except validation gates)
  const handleCustomerSubmit = async (e) => {
    e.preventDefault();
    if (!isCustomerFormValid) {
      toast({ title: 'Please complete the form', description: 'Fix highlighted fields before continuing.', variant: 'destructive' });
      return;
    }
    setIsLoading(true);
    try {
      const payload = {
        name: customerData.name,
        email: customerData.email,
        phone: normalizePhone(customerData.phone),
        location: customerData.state,
        password: customerData.password,
        role: 'customer',
      };
      const success = await register(payload);
      if (success) {
        const result = await login(customerData.email, customerData.password, 'customer');
        if (result?.success) {
          toast({ title: 'Welcome to WorkerConnect!', description: 'Account created and logged in.' });
          navigate('/');
        } else {
          toast({ title: 'Account created', description: 'Please continue.' });
          navigate('/');
        }
      } else {
        toast({ title: 'Registration failed', description: 'Please try again.', variant: 'destructive' });
      }
    } catch (err) {
      toast({ title: 'Registration error', description: err.message || 'Something went wrong.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleWorkerSubmit = async (e) => {
    e.preventDefault();
    if (!isWorkerStep1Valid || !isWorkerStep2Valid || !isWorkerStep3Valid) {
      toast({ title: 'Complete all steps', description: 'Fix highlighted fields before continuing.', variant: 'destructive' });
      return;
    }
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', workerData.name);
      formData.append('email', workerData.email);
      formData.append('password', workerData.password);
      formData.append('phone', normalizePhone(workerData.phone));
      formData.append('location', workerData.state);
      formData.append('occupation', workerData.profession);
      const skillsArray = workerData.skills
        ? workerData.skills.split(',').map(s => s.trim()).filter(Boolean)
        : [];
      formData.append('skills', JSON.stringify(skillsArray));
      formData.append('experience', workerData.experience);
      formData.append('bio', workerData.bio);
      formData.append('aadhar', workerData.aadharNumber);
      formData.append('secondno', workerData.secondno || '');
      formData.append('secondmail', workerData.secondmail || '');
      formData.append('voterid', workerData.voterid || '');
      formData.append('availability', workerData.availableImmediately === 'yes' ? 'yes' : 'no');
      formData.append('price', workerData.price || 0);

      if (workerData.profilePicFile) formData.append('profilePic', workerData.profilePicFile);
      if (workerData.aadharPicFile) formData.append('aadharPic', workerData.aadharPicFile);
      if (workerData.introVideo) formData.append('introVid', workerData.introVideo);
      if (workerData.previousWorkPicsFiles?.length) {
        workerData.previousWorkPicsFiles.forEach((file) => formData.append('previousWorkPics', file));
      }

      const success = await register(formData, 'worker');
      if (success) {
        const result = await login(workerData.email, workerData.password, 'worker');
        if (result?.success) {
          toast({ title: 'Welcome to WorkerConnect!', description: 'Worker account created and logged in.' });
          navigate('/');
        } else {
          toast({ title: 'Account created', description: 'Please continue.' });
          navigate('/');
        }
      } else {
        toast({ title: 'Registration failed', description: 'Please try again.', variant: 'destructive' });
      }
    } catch (err) {
      toast({ title: 'Error', description: err.message || 'Something went wrong.', variant: 'destructive' });
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // UI renderers with live messages
  const renderCustomerForm = () => (
    <form onSubmit={handleCustomerSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
          <Input
            type="text"
            value={customerData.name}
            onChange={(e) => setCustomerData({ ...customerData, name: e.target.value })}
            placeholder="Enter your full name"
            className="w-full bg-white border border-black-200 focus:outline-none focus:border-black"
            required
          />
          {customerData.name !== '' && (
            <ValidMsg ok={custValid.name} msg={custValid.name ? 'Looks good' : 'Name is required'} />
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <Input
            type="email"
            value={customerData.email}
            onChange={(e) => setCustomerData({ ...customerData, email: e.target.value })}
            placeholder="Enter your email"
            className="w-full bg-white border border-black-200 focus:outline-none focus:border-black"
            required
          />
          {customerData.email !== '' && (
            <ValidMsg ok={custValid.email} msg={custValid.email ? 'Valid email' : 'Invalid email'} />
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
          <Input
            type="tel"
            value={customerData.phone}
            onChange={(e) => setCustomerData({ ...customerData, phone: e.target.value })}
            placeholder="+91 XXXXX XXXXX"
            className="w-full bg-white border border-black-200 focus:outline-none focus:border-black"
            required
          />
          {customerData.phone !== '' && (
            <ValidMsg ok={custValid.phone} msg={custValid.phone ? 'Valid phone' : 'Enter 10-digit mobile starting with 6-9'} />
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Locality </label>
          <Input
            type="text"
            value={customerData.locality}
            onChange={(e) => setCustomerData({ ...customerData, locality: e.target.value })}
            placeholder="Neighborhood / Area"
            className="w-full bg-white border border-black-200 focus:outline-none focus:border-black"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
        <Select value={customerData.state} onValueChange={(value) => setCustomerData({ ...customerData, state: value })}>
          <SelectTrigger className="bg-white border border-black-200 focus:outline-none focus:border-black">
            <SelectValue placeholder="Select your state" />
          </SelectTrigger>
          <SelectContent>
            {INDIAN_STATES.map((st) => (
              <SelectItem key={st} value={st}>{st}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {customerData.state !== '' && (
          <ValidMsg ok={custValid.state} msg={custValid.state ? 'State selected' : 'State is required'} />
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
          <div className="relative">
            <Input
              type={showPassword ? 'text' : 'password'}
              value={customerData.password}
              onChange={(e) => setCustomerData({ ...customerData, password: e.target.value })}
              placeholder="Create a password"
              className="w-full bg-white border border-black-200 focus:outline-none focus:border-black"
              required
              minLength={8}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {customerData.password !== '' && (
            <ValidMsg ok={custValid.password} msg={custValid.password ? 'Strong enough' : 'At least 8 characters required'} />
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
          <Input
            type="password"
            value={customerData.confirmPassword}
            onChange={(e) => setCustomerData({ ...customerData, confirmPassword: e.target.value })}
            placeholder="Confirm your password"
            className="w-full bg-white border border-black-200 focus:outline-none focus:border-black"
            required
          />
          {customerData.confirmPassword !== '' && (
            <ValidMsg ok={custValid.confirm} msg={custValid.confirm ? 'Passwords match' : 'Passwords do not match'} />
          )}
        </div>
      </div>

      <Button type="submit" disabled={isLoading || !isCustomerFormValid} className="w-full btn-primary">
        {isLoading ? 'Creating Account...' : 'Create Account'}
      </Button>
    </form>
  );

  const renderWorkerStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                <Input
                  type="text"
                  value={workerData.name.split(' ')[0] || ''}
                  onChange={(e) => {
                    const lastName = workerData.name.split(' ').slice(1).join(' ');
                    setWorkerData({ ...workerData, name: `${e.target.value} ${lastName}`.trim() });
                  }}
                  placeholder="First name"
                  className="w-full bg-white border border-black-200 focus:outline-none focus:border-black"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                <Input
                  type="text"
                  value={workerData.name.split(' ').slice(1).join(' ') || ''}
                  onChange={(e) => {
                    const firstName = workerData.name.split(' ')[0] || '';
                    setWorkerData({ ...workerData, name: `${firstName} ${e.target.value}`.trim() });
                  }}
                  placeholder="Last name"
                  className="w-full bg-white border border-black-200 focus:outline-none focus:border-black"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <Input
                  type="email"
                  value={workerData.email}
                  onChange={(e) => setWorkerData({ ...workerData, email: e.target.value })}
                  placeholder="Enter your email"
                  className="w-full bg-white border border-black-200 focus:outline-none focus:border-black"
                  required
                />
                {workerData.email !== '' && (
                  <ValidMsg ok={workerStep1Valid.email} msg={workerStep1Valid.email ? 'Valid email' : 'Invalid email'} />
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <Input
                  type="tel"
                  value={workerData.phone}
                  onChange={(e) => setWorkerData({ ...workerData, phone: e.target.value })}
                  placeholder="+91 XXXXX XXXXX"
                  className="w-full bg-white border border-black-200 focus:outline-none focus:border-black"
                  required
                />
                {workerData.phone !== '' && (
                  <ValidMsg ok={workerStep1Valid.phone} msg={workerStep1Valid.phone ? 'Valid phone' : 'Enter 10-digit mobile starting with 6-9'} />
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Locality </label>
                <Input
                  type="text"
                  value={workerData.locality}
                  onChange={(e) => setWorkerData({ ...workerData, locality: e.target.value })}
                  placeholder="Neighborhood / Area"
                  className="w-full bg-white border border-black-200 focus:outline-none focus:border-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                <Select
                  value={workerData.state}
                  onValueChange={(value) => setWorkerData({ ...workerData, state: value })}
                >
                  <SelectTrigger className="bg-white border border-black-200 focus:outline-none focus:border-black">
                    <SelectValue placeholder="Select your state" />
                  </SelectTrigger>
                  <SelectContent>
                    {INDIAN_STATES.map((st) => (
                      <SelectItem key={st} value={st}>{st}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {workerData.state !== '' && (
                  <ValidMsg ok={workerStep1Valid.state} msg={workerStep1Valid.state ? 'State selected' : 'State is required'} />
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Profession</label>
                <Select
                  value={workerData.profession}
                  onValueChange={(value) => setWorkerData({ ...workerData, profession: value })}
                >
                  <SelectTrigger className="bg-white border border-black-200 focus:outline-none focus:border-black">
                    <SelectValue placeholder="Select your profession" />
                  </SelectTrigger>
                  <SelectContent>
                    {professions.map((profession) => (
                      <SelectItem key={profession} value={profession}>{profession}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {workerData.profession !== '' && (
                  <ValidMsg ok={workerStep1Valid.profession} msg={workerStep1Valid.profession ? 'Profession selected' : 'Profession is required'} />
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Experience (Years)</label>
                <Input
                  type="number"
                  min="0"
                  max="50"
                  value={workerData.experience}
                  onChange={(e) => setWorkerData({ ...workerData, experience: e.target.value })}
                  placeholder="Years of experience"
                  required
                  className="w-full bg-white border border-black-200 focus:outline-none focus:border-black"
                />
                {String(workerData.experience).length > 0 && (
                  <ValidMsg ok={workerStep1Valid.experience} msg={workerStep1Valid.experience ? 'Looks good' : 'Enter a valid number'} />
                )}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
              <Textarea
                value={workerData.bio}
                onChange={(e) => setWorkerData({ ...workerData, bio: e.target.value })}
                placeholder="Tell us about your work experience..."
                className="w-full bg-white border border-black-200 focus:outline-none focus:border-black"
                rows={4}
                required
              />
              {workerData.bio !== '' && (
                <ValidMsg ok={workerStep2Valid.bio} msg={workerStep2Valid.bio ? 'Looks good' : 'Bio is required'} />
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Skills (comma-separated)</label>
              <Input
                type="text"
                value={workerData.skills}
                onChange={(e) => setWorkerData({ ...workerData, skills: e.target.value })}
                placeholder="e.g., Pipe Fitting, Leak Repair, Installation"
                className="w-full bg-white border border-black-200 focus:outline-none focus:border-black"
                required
              />
              {workerData.skills !== '' && (
                <ValidMsg ok={workerStep2Valid.skills} msg={workerStep2Valid.skills ? 'Looks good' : 'At least one skill required'} />
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Alternate Email (Optional)</label>
                <Input
                  type="email"
                  value={workerData.secondmail}
                  onChange={(e) => setWorkerData({ ...workerData, secondmail: e.target.value })}
                  placeholder="Enter alternate email"
                  className="w-full bg-white border border-black-200 focus:outline-none focus:border-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Additional Number (Optional)</label>
                <Input
                  type="tel"
                  value={workerData.secondno}
                  onChange={(e) => setWorkerData({ ...workerData, secondno: e.target.value })}
                  placeholder="+91 XXXXX XXXXX"
                  className="w-full bg-white border border-black-200 focus:outline-none focus:border-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Voter ID (Optional)</label>
                <Input
                  type="text"
                  value={workerData.voterid}
                  onChange={(e) => setWorkerData({ ...workerData, voterid: e.target.value })}
                  placeholder="Enter valid Voter ID"
                  className="w-full bg-white border border-black-200 focus:outline-none focus:border-black"
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={workerData.password}
                    onChange={(e) => setWorkerData({ ...workerData, password: e.target.value })}
                    placeholder="Create a password"
                    className="w-full bg-white border border-black-200 focus:outline-none focus:border-black"
                    required
                    minLength={8}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {workerData.password !== '' && (
                  <ValidMsg ok={workerStep3Valid.password} msg={workerStep3Valid.password ? 'Strong enough' : 'At least 8 characters required'} />
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                <Input
                  type="password"
                  value={workerData.confirmPassword}
                  onChange={(e) => setWorkerData({ ...workerData, confirmPassword: e.target.value })}
                  placeholder="Confirm your password"
                  className="w-full bg-white border border-black-200 focus:outline-none focus:border-black"
                  required
                />
                {workerData.confirmPassword !== '' && (
                  <ValidMsg ok={workerStep3Valid.confirm} msg={workerStep3Valid.confirm ? 'Passwords match' : 'Passwords do not match'} />
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Aadhaar Number</label>
              <Input
                type="text"
                value={workerData.aadharNumber}
                onChange={(e) => setWorkerData({ ...workerData, aadharNumber: e.target.value })}
                placeholder="XXXX-XXXX-XXXX"
                className="w-full bg-white border border-black-200 focus:outline-none focus:border-black"
                required
              />
              {workerData.aadharNumber !== '' && (
                <ValidMsg ok={workerStep3Valid.aadharNumber} msg={workerStep3Valid.aadharNumber ? 'Looks good' : 'Aadhaar number is required'} />
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Aadhaar Image</label>
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer"
                onClick={() => document.getElementById('aadharImageInput').click()}
              >
                {workerData.aadharPicFile ? (
                  <img
                    src={URL.createObjectURL(workerData.aadharPicFile)}
                    alt="Aadhaar Preview"
                    className="mx-auto max-h-40 object-contain rounded-md"
                  />
                ) : (
                  <>
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                    <p className="text-xs text-gray-500">PNG, JPG up to 5MB</p>
                  </>
                )}
                <input
                  id="aadharImageInput"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => setWorkerData({ ...workerData, aadharPicFile: e.target.files[0] })}
                  required
                />
              </div>
              {<ValidMsg ok={workerStep3Valid.aadharPicFile} msg={workerStep3Valid.aadharPicFile ? 'File attached' : 'Aadhaar image is required'} />}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Profile Photo</label>
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer"
                onClick={() => document.getElementById('profilePhotoInput').click()}
              >
                {workerData.profilePicFile ? (
                  <img
                    src={URL.createObjectURL(workerData.profilePicFile)}
                    alt="Profile Preview"
                    className="mx-auto max-h-40 object-contain rounded-md"
                  />
                ) : (
                  <>
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                    <p className="text-xs text-gray-500">PNG, JPG up to 5MB</p>
                  </>
                )}
                <input
                  id="profilePhotoInput"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => setWorkerData({ ...workerData, profilePicFile: e.target.files[0] })}
                  required
                />
              </div>
              {<ValidMsg ok={workerStep3Valid.profilePicFile} msg={workerStep3Valid.profilePicFile ? 'File attached' : 'Profile photo is required'} />}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Intro Video (Optional)</label>
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer"
                onClick={() => document.getElementById('introVideoInput').click()}
              >
                {workerData.introVideo ? (
                  <video
                    src={URL.createObjectURL(workerData.introVideo)}
                    controls
                    className="mx-auto max-h-40 object-contain rounded-md"
                  />
                ) : (
                  <>
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Upload your intro video</p>
                    <p className="text-xs text-gray-500">MP4, AVI, MOV up to 50MB</p>
                  </>
                )}
                <input
                  id="introVideoInput"
                  type="file"
                  accept="video/*"
                  className="hidden"
                  onChange={(e) => setWorkerData({ ...workerData, introVideo: e.target.files[0] })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Are you available immediately?</label>
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="availableImmediately"
                    value="yes"
                    checked={workerData.availableImmediately === 'yes'}
                    onChange={(e) => setWorkerData({ ...workerData, availableImmediately: e.target.value })}
                    className="h-4 w-4 text-primary border-gray-300 focus:ring-primary"
                  />
                  <span className="text-gray-700">Yes</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="availableImmediately"
                    value="no"
                    checked={workerData.availableImmediately === 'no'}
                    onChange={(e) => setWorkerData({ ...workerData, availableImmediately: e.target.value })}
                    className="h-4 w-4 text-primary border-gray-300 focus:ring-primary"
                  />
                  <span className="text-gray-700">No</span>
                </label>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Review Your Information</h3>
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <div><strong>Name:</strong> {workerData.name}</div>
              <div><strong>Email:</strong> {workerData.email}</div>
              <div><strong>Profession:</strong> {workerData.profession}</div>
              <div><strong>Experience:</strong> {workerData.experience} years</div>
              <div><strong>Locality (UI only):</strong> {workerData.locality || '-'}</div>
              <div><strong>State (sent as Location):</strong> {workerData.state || '-'}</div>
              <div><strong>Phone:</strong> {normalizePhone(workerData.phone)}</div>
              <div><strong>Skills:</strong> {workerData.skills}</div>
              <div><strong>Bio:</strong> {workerData.bio}</div>
              <div><strong>Available Immediately:</strong> {workerData.availableImmediately}</div>
            </div>
            <div className="text-sm text-gray-600">
              By creating an account, you agree to our Terms of Service and Privacy Policy.
            </div>
            <Button onClick={handleWorkerSubmit} disabled={isLoading || !isWorkerStep1Valid || !isWorkerStep2Valid || !isWorkerStep3Valid} className="w-full btn-primary">
              {isLoading ? 'Creating Account...' : 'Create Worker Account'}
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 mb-6">
            <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-2xl">W</span>
            </div>
            <span className="text-2xl font-bold gradient-text">WorkerConnect</span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Join WorkerConnect</h1>
          <p className="text-gray-600">Create your account to get started</p>
        </div>

        <Card className="p-6 card-gradient shadow-xl">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">I want to:</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => switchRole('customer')}
                className={`p-4 rounded-lg border-2 transition-all flex flex-col items-center space-y-2 ${selectedRole === 'customer' ? 'border-primary bg-primary/5 text-primary' : 'border-gray-200 hover:border-gray-300 text-gray-600'}`}
                aria-pressed={selectedRole === 'customer'}
              >
                <User className="w-8 h-8" />
                <span className="font-medium">Find Workers</span>
                <span className="text-xs text-center">I need services</span>
              </button>
              <button
                type="button"
                onClick={() => switchRole('worker')}
                className={`p-4 rounded-lg border-2 transition-all flex flex-col items-center space-y-2 ${selectedRole === 'worker' ? 'border-primary bg-primary/5 text-primary' : 'border-gray-200 hover:border-gray-300 text-gray-600'}`}
                aria-pressed={selectedRole === 'worker'}
              >
                <Briefcase className="w-8 h-8" />
                <span className="font-medium">Offer Services</span>
                <span className="text-xs text-center">I provide services</span>
              </button>
            </div>
          </div>

          {selectedRole === 'worker' && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Step {currentStep} of {selectedRole === 'worker' ? 4 : 1}</span>
                <span className="text-sm text-gray-500">{Math.round((currentStep / (selectedRole === 'worker' ? 4 : 1)) * 100)}% Complete</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-gradient-primary h-2 rounded-full transition-all duration-300" style={{ width: `${(currentStep / (selectedRole === 'worker' ? 4 : 1)) * 100}%` }}></div>
              </div>
            </div>
          )}

          {selectedRole === 'customer' ? renderCustomerForm() : renderWorkerStep()}

          {selectedRole === 'worker' && currentStep < 4 && (
            <div className="flex justify-between mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                disabled={currentStep === 1}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
              <Button
                type="button"
                onClick={() => setCurrentStep(Math.min(4, currentStep + 1))}
                className="btn-primary"
                disabled={!isWorkerStepValid}
                title={!isWorkerStepValid ? 'Complete required fields to continue' : undefined}
              >
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to={`/login?role=${selectedRole}`} className="text-primary font-medium hover:text-primary-dark">
                Sign in here
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};
