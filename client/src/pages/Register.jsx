import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff, User, Briefcase, Upload, ArrowRight, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card } from '../components/ui/card';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../hooks/use-toast';

export const Register = () => {
  const [searchParams] = useSearchParams();
  const [selectedRole, setSelectedRole] = useState(
    searchParams.get('role') || 'customer'
  );
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [customerData, setCustomerData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    password: '',
    confirmPassword: ''
  });

  const [workerData, setWorkerData] = useState({
    ...customerData,
    profession: '',
    experience: '',
    bio: '',
    skills: '',
    aadharNumber: '',
    aadharImage: null,
    introVideo: null,
  });

  const { register } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const professions = [
    'Plumber', 'Electrician', 'Carpenter', 'House Cleaner', 'Painter',
    'Gardener', 'Mason', 'AC Technician', 'Appliance Repair', 'Driver'
  ];

  const maxSteps = selectedRole === 'customer' ? 1 : 4;

  const handleCustomerSubmit = async (e) => {
    e.preventDefault();

    if (customerData.password !== customerData.confirmPassword) {
      toast({
        title: "Password mismatch",
        description: "Please ensure both passwords match.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const success = await register({
        ...customerData,
        role: 'customer'
      });

      if (success) {
        toast({
          title: "Welcome to WorkerConnect!",
          description: "Your account has been created successfully.",
        });
        navigate('/');
      }
    } catch (error) {
      toast({
        title: "Registration failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleWorkerSubmit = async (e) => {
  e.preventDefault();
  setIsLoading(true);

  try {
    const formData = new FormData();
    formData.append('name', workerData.name);
    formData.append('email', workerData.email);
    formData.append('password', workerData.password);
    formData.append('phone', workerData.phone);
    formData.append('location', workerData.location);
    formData.append('occupation', workerData.profession);
    formData.append('skills', JSON.stringify(workerData.skills)); // or comma-separated string
    formData.append('experience', workerData.experience);
    formData.append('availability', workerData.availability || '');
    formData.append('bio', workerData.bio);
    formData.append('aadhar', workerData.aadharNumber);
    formData.append('price', workerData.price || 0);

    if (workerData.profilePicFile) {
      formData.append('profilePic', workerData.profilePicFile);
    }
    if (workerData.aadharPicFile) {
      formData.append('aadharPic', workerData.aadharPicFile);
    }
    if (workerData.introVidFile) {
      formData.append('introVid', workerData.introVidFile);
    }
    if (workerData.previousWorkPicsFiles) {
      workerData.previousWorkPicsFiles.forEach((file) =>
        formData.append('previousWorkPics', file)
      );
    }

    // Only call register here, which handles the POST request internally
    const success = await register(formData, 'worker');

    if (success) {
      toast({
        title: 'Welcome back!',
        description: 'You have been successfully logged in.',
      });
      navigate('/');
    } else {
      toast({
        title: 'Registration failed',
        description: 'Please try again.',
        variant: 'destructive',
      });
    }
  } catch (error) {
    toast({
      title: 'Error',
      description: error.message || 'Something went wrong.',
      variant: 'destructive',
    });
    console.error(error);
  } finally {
    setIsLoading(false);
  }
};

  const renderCustomerForm = () => (
    <form onSubmit={handleCustomerSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
          <Input
            type="text"
            value={customerData.name}
            onChange={(e) => setCustomerData({...customerData, name: e.target.value})}
            placeholder="Enter your full name"
            className='w-full bg-white border border-black-200 focus:outline-none focus:border-black'
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <Input
            type="email"
            value={customerData.email}
            onChange={(e) => setCustomerData({...customerData, email: e.target.value})}
            placeholder="Enter your email"
            className='w-full bg-white border border-black-200 focus:outline-none focus:border-black'
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
          <Input
            type="tel"
            value={customerData.phone}
            onChange={(e) => setCustomerData({...customerData, phone: e.target.value})}
            placeholder="+91 XXXXX XXXXX"
            className='w-full bg-white border border-black-200 focus:outline-none focus:border-black'
            required
          />
        </div>

        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
          <Input
            type="text"
            value={customerData.location}
            onChange={(e) => setCustomerData({...customerData, location: e.target.value})}
            placeholder="City, State"
            className='w-full bg-white border border-black-200 focus:outline-none focus:border-black'
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
          <div className="relative">
            <Input
              type={showPassword ? 'text' : 'password'}
              value={customerData.password}
              onChange={(e) => setCustomerData({...customerData, password: e.target.value})}
              placeholder="Create a password"
              className='w-full bg-white border border-black-200 focus:outline-none focus:border-black'
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
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
          <Input
            type="password"
            value={customerData.confirmPassword}
            onChange={(e) => setCustomerData({...customerData, confirmPassword: e.target.value})}
            placeholder="Confirm your password"
            className='w-full bg-white border border-black-200 rounded-md focus:outline-none focus:ring-0'
            required
          />
        </div>
      </div>

      <Button type="submit" disabled={isLoading} className="w-full btn-primary">
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
                    setWorkerData({...workerData, name: `${e.target.value} ${lastName}`.trim()});
                  }}
                  placeholder="First name"
                  className='w-full bg-white border border-black-200 focus:outline-none focus:border-black'
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
                    setWorkerData({...workerData, name: `${firstName} ${e.target.value}`.trim()});
                  }}
                  placeholder="Last name"
                  className='w-full bg-white border border-black-200 focus:outline-none focus:border-black'
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 ">Profession</label>
                <Select value={workerData.profession} onValueChange={(value) => setWorkerData({...workerData, profession: value})}>
                  <SelectTrigger className='bg-white border border-black-200 focus:outline-none focus:border-black'>
                    <SelectValue placeholder="Select your profession" />
                  </SelectTrigger>
                  <SelectContent>
                    {professions.map(profession => (
                      <SelectItem key={profession} value={profession}>
                        {profession}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Experience (Years)</label>
                <Input
                  type="number"
                  min="0"
                  max="50"
                  value={workerData.experience}
                  onChange={(e) => setWorkerData({...workerData, experience: e.target.value})}
                  placeholder="Years of experience"
                  required
                  className='w-full bg-white border border-black-200 focus:outline-none focus:border-black'
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <Input
                type="text"
                value={workerData.location}
                onChange={(e) => setWorkerData({...workerData, location: e.target.value})}
                placeholder="City, State"
                className='w-full bg-white border border-black-200 focus:outline-none focus:border-black'
                required
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <Input
                  type="email"
                  value={workerData.email}
                  onChange={(e) => setWorkerData({...workerData, email: e.target.value})}
                  placeholder="Enter your email"
                  className='w-full bg-white border border-black-200 focus:outline-none focus:border-black'
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <Input
                  type="tel"
                  value={workerData.phone}
                  onChange={(e) => setWorkerData({...workerData, phone: e.target.value})}
                  placeholder="+91 XXXXX XXXXX"
                  className='w-full bg-white border border-black-200 focus:outline-none focus:border-black'
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
              <Textarea
                value={workerData.bio}
                onChange={(e) => setWorkerData({...workerData, bio: e.target.value})}
                placeholder="Tell us about yourself and your work experience..."
                className='w-full bg-white border border-black-200 focus:outline-none focus:border-black'
                rows={4}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Skills (comma-separated)</label>
              <Input
                type="text"
                value={workerData.skills}
                onChange={(e) => setWorkerData({...workerData, skills: e.target.value})}
                placeholder="e.g., Pipe Fitting, Leak Repair, Installation"
                className='w-full bg-white border border-black-200 focus:outline-none focus:border-black'
                required
              />
            </div>
          </div>
        );

         case 3:
  return (
    <div className="space-y-4">
      {/* Password Fields */}
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
        </div>
      </div>

      {/* Aadhaar Number */}
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
      </div>

      {/* Aadhaar Image */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Aadhaar Image</label>
        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer"
          onClick={() => document.getElementById('aadharImageInput').click()}
        >
          {workerData.aadharImage ? (
            <img
              src={URL.createObjectURL(workerData.aadharImage)}
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
            onChange={(e) => setWorkerData({ ...workerData, aadharImage: e.target.files[0] })}
            required
          />
        </div>
      </div>

      {/* Profile Photo */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Profile Photo</label>
        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer"
          onClick={() => document.getElementById('profilePhotoInput').click()}
        >
          {workerData.profilePhoto ? (
            <img
              src={URL.createObjectURL(workerData.profilePhoto)}
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
            onChange={(e) => setWorkerData({ ...workerData, profilePhoto: e.target.files[0] })}
            required
          />
        </div>
      </div>

      {/* Work Portfolio */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Work Portfolio (Optional)</label>
        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer"
          onClick={() => document.getElementById('workPortfolioInput').click()}
        >
          {workerData.workPortfolio?.length > 0 ? (
            <div className="flex gap-2 overflow-x-auto">
              {workerData.workPortfolio.map((file, idx) => (
                <img
                  key={idx}
                  src={URL.createObjectURL(file)}
                  alt={`Portfolio ${idx + 1}`}
                  className="h-20 object-contain rounded-md"
                />
              ))}
            </div>
          ) : (
            <>
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Upload photos of your work</p>
              <p className="text-xs text-gray-500">Multiple files allowed</p>
            </>
          )}
          <input
            id="workPortfolioInput"
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => setWorkerData({ ...workerData, workPortfolio: Array.from(e.target.files) })}
          />
        </div>
      </div>

      {/* Intro Video */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Intro Video</label>
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
              <p className="text-sm text-gray-600">Click to upload or drag and drop your intro video</p>
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

      {/* Availability */}
<div>
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Are you available immediately?
  </label>
  <div className="flex items-center gap-6">
    <label className="flex items-center gap-2">
      <input
        type="checkbox"
        name="availability"
        value="yes"
        checked={workerData.availableImmediately === 'yes'}
        onChange={(e) => setWorkerData({ ...workerData, availableImmediately: e.target.value })}
        className="h-4 w-4 text-primary border-gray-300 focus:ring-primary"
      />
      <span className="text-gray-700">Yes</span>
    </label>
    <label className="flex items-center gap-2">
      <input
        type="checkbox"
        name="availability"
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
              <div><strong>Profession:</strong> {workerData.profession}</div>
              <div><strong>Experience:</strong> {workerData.experience} years</div>
              <div><strong>Location:</strong> {workerData.location}</div>
              <div><strong>Email:</strong> {workerData.email}</div>
              <div><strong>Phone:</strong> {workerData.phone}</div>
              <div><strong>Skills:</strong> {workerData.skills}</div>
              <div><strong>Bio:</strong> {workerData.bio}</div>
            </div>

            <div className="text-sm text-gray-600">
              By creating an account, you agree to our Terms of Service and Privacy Policy.
            </div>

            <Button
              onClick={handleWorkerSubmit}
              disabled={isLoading}
              className="w-full btn-primary"
            >
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
          {/* Role Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              I want to:
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setSelectedRole('customer');
                  setCurrentStep(1);
                }}
                className={`p-4 rounded-lg border-2 transition-all flex flex-col items-center space-y-2 ${
                  selectedRole === 'customer'
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-gray-200 hover:border-gray-300 text-gray-600'
                }`}
              >
                <User className="w-8 h-8" />
                <span className="font-medium">Find Workers</span>
                <span className="text-xs text-center">I need services</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedRole('worker');
                  setCurrentStep(1);
                }}
                className={`p-4 rounded-lg border-2 transition-all flex flex-col items-center space-y-2 ${
                  selectedRole === 'worker'
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-gray-200 hover:border-gray-300 text-gray-600'
                }`}
              >
                <Briefcase className="w-8 h-8" />
                <span className="font-medium">Offer Services</span>
                <span className="text-xs text-center">I provide services</span>
              </button>
            </div>
          </div>

          {/* Progress indicator for worker registration */}
          {selectedRole === 'worker' && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Step {currentStep} of {maxSteps}</span>
                <span className="text-sm text-gray-500">{Math.round((currentStep / maxSteps) * 100)}% Complete</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(currentStep / maxSteps) * 100}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Form Content */}
          {selectedRole === 'customer' ? renderCustomerForm() : renderWorkerStep()}

          {/* Navigation buttons for worker registration */}
          {selectedRole === 'worker' && currentStep < maxSteps && (
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
                onClick={() => setCurrentStep(Math.min(maxSteps, currentStep + 1))}
                className="btn-primary"
              >
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link
                to={`/login?role=${selectedRole}`}
                className="text-primary font-medium hover:text-primary-dark"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};