import React, { useState, useMemo } from 'react';
import { Search as SearchIcon, Filter, MapPin, Star, Clock, Shield, Phone, MessageCircle } from 'lucide-react';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { StarRating } from '../components/ui/StarRating';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';

const mockWorkers = [
  {
    id: '1',
    name: 'Rajesh Kumar',
    profession: 'Plumber',
    rating: 4.8,
    totalReviews: 127,
    location: 'Mumbai, Maharashtra',
    experience: 5,
    hourlyRate: 300,
    profilePicture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    skills: ['Pipe Fitting', 'Leak Repair', 'Bathroom Installation'],
    bio: 'Experienced plumber with 5+ years in residential and commercial work.',
    isVerified: true,
    responseTime: 'Usually responds within 2 hours'
  },
  {
    id: '2',
    name: 'Amit Singh',
    profession: 'Electrician',
    rating: 4.9,
    totalReviews: 89,
    location: 'Delhi, India',
    experience: 7,
    hourlyRate: 400,
    profilePicture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    skills: ['Wiring', 'Panel Installation', 'Lighting'],
    bio: 'Licensed electrician specializing in residential electrical systems.',
    isVerified: true,
    responseTime: 'Usually responds within 1 hour'
  },
  {
    id: '3',
    name: 'Priya Sharma',
    profession: 'House Cleaner',
    rating: 4.7,
    totalReviews: 156,
    location: 'Bangalore, Karnataka',
    experience: 3,
    hourlyRate: 250,
    profilePicture: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    skills: ['Deep Cleaning', 'Kitchen Cleaning', 'Bathroom Cleaning'],
    bio: 'Professional house cleaner with attention to detail.',
    isVerified: true,
    responseTime: 'Usually responds within 3 hours'
  },
  {
    id: '4',
    name: 'Vikram Patel',
    profession: 'Carpenter',
    rating: 4.6,
    totalReviews: 78,
    location: 'Pune, Maharashtra',
    experience: 8,
    hourlyRate: 350,
    profilePicture: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    skills: ['Furniture Making', 'Cabinet Installation', 'Wood Repair'],
    bio: 'Master carpenter with expertise in custom furniture and repairs.',
    isVerified: false,
    responseTime: 'Usually responds within 4 hours'
  },
  {
    id: '5',
    name: 'Sunita Devi',
    profession: 'Painter',
    rating: 4.5,
    totalReviews: 92,
    location: 'Chennai, Tamil Nadu',
    experience: 4,
    hourlyRate: 280,
    profilePicture: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    skills: ['Interior Painting', 'Exterior Painting', 'Wall Texturing'],
    bio: 'Professional painter specializing in residential painting services.',
    isVerified: true,
    responseTime: 'Usually responds within 2 hours'
  },
  {
    id: '6',
    name: 'Mohammed Ali',
    profession: 'Gardener',
    rating: 4.4,
    totalReviews: 45,
    location: 'Hyderabad, Telangana',
    experience: 6,
    hourlyRate: 200,
    profilePicture: 'https://images.unsplash.com/photo-1507038732509-8dfe0e84d454?w=150&h=150&fit=crop&crop=face',
    skills: ['Lawn Care', 'Plant Maintenance', 'Garden Design'],
    bio: 'Experienced gardener with knowledge of local plants and climate.',
    isVerified: true,
    responseTime: 'Usually responds within 5 hours'
  }
];

export const Search = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProfession, setSelectedProfession] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState('rating');

  const professions = ['all', 'Plumber', 'Electrician', 'House Cleaner', 'Carpenter', 'Painter', 'Gardener'];
  const locations = ['all', 'Mumbai', 'Delhi', 'Bangalore', 'Pune', 'Chennai', 'Hyderabad'];

  const filteredWorkers = useMemo(() => {
    let filtered = mockWorkers.filter(worker => {
      const matchesSearch = worker.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          worker.profession.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          worker.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesProfession = selectedProfession === 'all' || worker.profession === selectedProfession;
      const matchesLocation = selectedLocation === 'all' || worker.location.toLowerCase().includes(selectedLocation.toLowerCase());
      const matchesRating = worker.rating >= minRating;

      return matchesSearch && matchesProfession && matchesLocation && matchesRating;
    });

    // Sort workers
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'reviews':
          return b.totalReviews - a.totalReviews;
        case 'experience':
          return b.experience - a.experience;
        case 'price_low':
          return a.hourlyRate - b.hourlyRate;
        case 'price_high':
          return b.hourlyRate - a.hourlyRate;
        default:
          return 0;
      }
    });

    return filtered;
  }, [searchQuery, selectedProfession, selectedLocation, minRating, sortBy]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Find Service Workers</h1>
          <p className="text-gray-600 mb-6">Browse through our verified professionals and find the perfect match for your needs</p>
          
          {/* Search Bar */}
          <div className="relative mb-6">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search by name, profession, or skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 text-lg w-full bg-white border border-black-200 focus:outline-none focus:border-black"
            />
          </div>

          {/* Filters */}
          <Card className="p-4">
            <div className="flex items-center space-x-4 mb-4">
              <Filter className="w-5 h-5 text-gray-500" />
              <span className="font-medium text-gray-700">Filters</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Profession</label>
                <Select value={selectedProfession} onValueChange={setSelectedProfession}>
                  <SelectTrigger className='w-full bg-white border border-black-200 focus:outline-none focus:border-black'>
                    <SelectValue placeholder="All Professions" />
                  </SelectTrigger>
                  <SelectContent>
                    {professions.map(profession => (
                      <SelectItem key={profession} value={profession}>
                        {profession === 'all' ? 'All Professions' : profession}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                  <SelectTrigger className='w-full bg-white border border-black-200 focus:outline-none focus:border-black'>
                    <SelectValue placeholder="All Locations" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map(location => (
                      <SelectItem key={location} value={location}>
                        {location === 'all' ? 'All Locations' : location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Min Rating</label>
                <Select value={minRating.toString()} onValueChange={(value) => setMinRating(Number(value))}>
                  <SelectTrigger className='w-full bg-white border border-black-200 focus:outline-none focus:border-black'>
                    <SelectValue placeholder="Any Rating" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Any Rating</SelectItem>
                    <SelectItem value="3">3+ Stars</SelectItem>
                    <SelectItem value="4">4+ Stars</SelectItem>
                    <SelectItem value="4.5">4.5+ Stars</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className='w-full bg-white border border-black-200 focus:outline-none focus:border-black'>
                    <SelectValue placeholder="Sort By" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                    <SelectItem value="reviews">Most Reviews</SelectItem>
                    <SelectItem value="experience">Most Experienced</SelectItem>
                    <SelectItem value="price_low">Price: Low to High</SelectItem>
                    <SelectItem value="price_high">Price: High to Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button 
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedProfession('all');
                    setSelectedLocation('all');
                    setMinRating(0);
                    setSortBy('rating');
                  }}
                  variant="outline"
                  className="w-full"
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Results */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredWorkers.length} results
            {searchQuery && ` for "${searchQuery}"`}
          </p>
        </div>

        {/* Workers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWorkers.map((worker) => (
            <Card key={worker.id} className="p-6 card-hover cursor-pointer">
              {/* Worker Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <img
                      src={worker.profilePicture}
                      alt={worker.name}
                      className="w-14 h-14 rounded-full object-cover"
                    />
                    {worker.isVerified && (
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-success rounded-full flex items-center justify-center">
                        <Shield className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900">{worker.name}</h3>
                    <p className="text-primary font-medium">{worker.profession}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-gray-900">₹{worker.hourlyRate}</div>
                  <div className="text-sm text-gray-500">per hour</div>
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center justify-between mb-3">
                <StarRating rating={worker.rating} size="sm" showRating />
                <span className="text-sm text-gray-500">({worker.totalReviews} reviews)</span>
              </div>

              {/* Location and Experience */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="w-4 h-4 mr-2" />
                  {worker.location}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="w-4 h-4 mr-2" />
                  {worker.experience} years experience
                </div>
              </div>

              {/* Skills */}
              <div className="mb-4">
                <div className="flex flex-wrap gap-1">
                  {worker.skills.slice(0, 3).map((skill, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                  {worker.skills.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                      +{worker.skills.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              {/* Bio */}
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                {worker.bio}
              </p>

              {/* Response Time */}
              <p className="text-xs text-gray-500 mb-4">
                {worker.responseTime}
              </p>

              {/* Action Buttons */}
              <div className="flex space-x-2">
                <Button className="flex-1 btn-primary">
                  View Profile
                </Button>
                <Button variant="outline" size="sm" className="p-2">
                  <MessageCircle className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" className="p-2">
                  <Phone className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {filteredWorkers.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <SearchIcon className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No workers found</h3>
            <p className="text-gray-500 mb-4">
              Try adjusting your search criteria or filters
            </p>
            <Button onClick={() => {
              setSearchQuery('');
              setSelectedProfession('all');
              setSelectedLocation('all');
              setMinRating(0);
            }}>
              Clear All Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};