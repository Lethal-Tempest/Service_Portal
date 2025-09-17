import React, { useState, useMemo, useEffect } from 'react';
import {
  Search as SearchIcon,
  Filter,
  MapPin,
  Star,
  Clock,
  Shield,
  Phone,
  MessageCircle,
} from 'lucide-react';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { StarRating } from '../components/ui/StarRating';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import axios from 'axios';
import { Link } from "react-router-dom";

export const Search = () => {
  const [mockWorkers, setMockWorkers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProfession, setSelectedProfession] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState('rating');
  const [isLoading, setIsLoading] = useState(false);

  // Professions and locations filters
  const professions = [
    'all',
    'Plumber',
    'Electrician',
    'House Cleaner',
    'Carpenter',
    'Painter',
    'Gardener',
  ];
  const locations = [
    'all',
    'Mumbai',
    'Delhi',
    'Bangalore',
    'Pune',
    'Chennai',
    'Hyderabad',
  ];

  // Fetch workers data once on mount
  useEffect(() => {
    const fetchWorkers = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get('https://service-portal-1.onrender.com/api/users/');
        // Assuming backend returns { workers: [...] }
        // Adjust if backend returns array directly with response.data
        const workersData = response.data.workers || response.data || [];
        setMockWorkers(workersData);
      } catch (error) {
        console.error('Error fetching workers:', error);
        setMockWorkers([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchWorkers();
  }, []);

  // Filter and sort workers based on search and filters
  const filteredWorkers = useMemo(() => {
    let filtered = mockWorkers.filter((worker) => {
      const search = searchQuery.toLowerCase();

      const matchesSearch =
        worker.name?.toLowerCase().includes(search) ||
        worker.profession?.toLowerCase().includes(search) ||
        (worker.skills || []).some((skill) =>
          skill.toLowerCase().includes(search)
        );

      const matchesProfession =
        selectedProfession === 'all' || worker.profession === selectedProfession;
      const matchesLocation =
        selectedLocation === 'all' ||
        worker.location?.toLowerCase().includes(selectedLocation.toLowerCase());
      const matchesRating = (worker.rating || 0) >= minRating;

      return matchesSearch && matchesProfession && matchesLocation && matchesRating;
    });

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'reviews':
          return (b.totalReviews || 0) - (a.totalReviews || 0);
        case 'experience':
          return (b.experience || 0) - (a.experience || 0);
        case 'price_low':
          return (a.hourlyRate || 0) - (b.hourlyRate || 0);
        case 'price_high':
          return (b.hourlyRate || 0) - (a.hourlyRate || 0);
        default:
          return 0;
      }
    });

    return filtered;
  }, [
    mockWorkers,
    searchQuery,
    selectedProfession,
    selectedLocation,
    minRating,
    sortBy,
  ]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Find Service Workers
          </h1>
          <p className="text-gray-600 mb-6">
            Browse through our verified professionals and find the perfect match
            for your needs
          </p>

          {/* Search Bar */}
          <div className="relative mb-6">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search by name, profession, or skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 text-lg w-full bg-white border border-black-200 focus:outline-none focus:border-black"
              disabled={isLoading}
            />
          </div>

          {/* Filters */}
          <Card className="p-4">
            <div className="flex items-center space-x-4 mb-4">
              <Filter className="w-5 h-5 text-gray-500" />
              <span className="font-medium text-gray-700">Filters</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Profession */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Profession
                </label>
                <Select
                  value={selectedProfession}
                  onValueChange={setSelectedProfession}
                  disabled={isLoading}
                >
                  <SelectTrigger className="w-full bg-white border border-black-200 focus:outline-none focus:border-black">
                    <SelectValue placeholder="All Professions" />
                  </SelectTrigger>
                  <SelectContent>
                    {professions.map((profession) => (
                      <SelectItem key={profession} value={profession}>
                        {profession === 'all' ? 'All Professions' : profession}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <Select
                  value={selectedLocation}
                  onValueChange={setSelectedLocation}
                  disabled={isLoading}
                >
                  <SelectTrigger className="w-full bg-white border border-black-200 focus:outline-none focus:border-black">
                    <SelectValue placeholder="All Locations" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map((location) => (
                      <SelectItem key={location} value={location}>
                        {location === 'all' ? 'All Locations' : location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Min Rating */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Min Rating
                </label>
                <Select
                  value={minRating.toString()}
                  onValueChange={(value) => setMinRating(Number(value))}
                  disabled={isLoading}
                >
                  <SelectTrigger className="w-full bg-white border border-black-200 focus:outline-none focus:border-black">
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

              {/* Sort By */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sort By
                </label>
                <Select
                  value={sortBy}
                  onValueChange={setSortBy}
                  disabled={isLoading}
                >
                  <SelectTrigger className="w-full bg-white border border-black-200 focus:outline-none focus:border-black">
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

              {/* Clear Filters */}
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
                  disabled={isLoading}
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Results Info */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredWorkers.length}{' '}
            {filteredWorkers.length === 1 ? 'result' : 'results'}
            {searchQuery && ` for "${searchQuery}"`}
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12 text-gray-500">Loading workers...</div>
        )}

        {/* Workers Grid */}
        {!isLoading && filteredWorkers.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWorkers.map((worker) => (
              <Card key={worker.id || worker._id} className="p-6 card-hover cursor-pointer border border-gray-200 rounded-xl shadow-sm">
                {/* Worker Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <img
                        src={worker.profilePicture || worker.profilePic || '/placeholder-avatar.png'}
                        alt={worker.name}
                        className="w-14 h-14 rounded-full object-cover border-2 border-gray-100"
                      />
                      {worker.isVerified && (
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                          <Shield className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">
                        {worker.name}
                      </h3>
                      <p className="text-blue-600 font-medium text-sm">{worker.profession}</p>
                    </div>
                  </div>
                </div>

                {/* Rating and Price */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="flex items-center bg-amber-100 px-2 py-1 rounded-md">
                      <Star className="w-4 h-4 text-amber-500 fill-current mr-1" />
                      <span className="font-semibold text-amber-700">{worker.rating || 0}</span>
                    </div>
                    <span className="text-sm text-gray-500 ml-2">
                      ({worker.totalReviews || 0} reviews)
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-900">
                      ₹{worker.hourlyRate || worker.price || 0}
                    </div>
                    <div className="text-xs text-gray-500">per hour</div>
                  </div>
                </div>

                {/* Location and Experience */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                    {worker.location}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="w-4 h-4 mr-2 text-gray-400" />
                    {worker.experience || 0} years experience
                  </div>
                </div>

                {/* Skills */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {(worker.skills || []).slice(0, 3).map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full border border-gray-200"
                      >
                        {skill}
                      </span>
                    ))}
                    {worker.skills?.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                        +{worker.skills.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Bio */}
                <p className="text-sm text-gray-600 mb-4 leading-relaxed">{worker.bio}</p>

                {/* Response Time */}
                {worker.responseTime && (
                  <p className="text-xs text-green-600 mb-4 font-medium">{worker.responseTime}</p>
                )}

                {/* Divider */}
                <div className="border-t border-gray-200 my-4"></div>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <Link to={`/worker/${worker.id || worker._id}`} className="flex-1">
                    <Button className="flex-1 bg-blue-600 hover:bg-blue-700">View Profile</Button>
                  </Link>

                  <Button variant="outline" size="sm" className="p-2 text-blue-600 border-blue-200 hover:bg-blue-50" title="Message">
                    <MessageCircle className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="p-2 text-blue-600 border-blue-200 hover:bg-blue-50" title="Call">
                    <Phone className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* No Results */}
        {!isLoading && filteredWorkers.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <SearchIcon className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No workers found</h3>
            <p className="text-gray-500 mb-4">
              Try adjusting your search criteria or filters
            </p>
            <Button
              onClick={() => {
                setSearchQuery('');
                setSelectedProfession('all');
                setSelectedLocation('all');
                setMinRating(0);
                setSortBy('rating');
              }}
            >
              Clear All Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};