// import { users } from '../contexts/AuthContext'; // optional — if you're using mockWorkers from there

export const mockWorkers = [
  {
    id: '1',
    name: 'Rajesh Kumar',
    email: 'rajesh@example.com',
    role: 'worker',
    phone: '+91 9876543210',
    location: 'Mumbai, Maharashtra',
    profilePicture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    profession: 'Plumber',
    experience: 5,
    bio: 'Experienced plumber with 5+ years in residential and commercial work. Specializing in pipe fitting, leak repairs, and bathroom installations.',
    skills: ['Pipe Fitting', 'Leak Repair', 'Bathroom Installation', 'Water Heater Repair'],
    aadharNumber: '1234-5678-9012',
    workPortfolio: [
      'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=300&h=200&fit=crop',
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=300&h=200&fit=crop'
    ],
    rating: 4.8,
    totalReviews: 127
  },
  {
    id: '2',
    name: 'Amit Singh',
    email: 'amit@example.com',
    role: 'worker',
    phone: '+91 8765432109',
    location: 'Delhi, India',
    profilePicture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    profession: 'Electrician',
    experience: 7,
    bio: 'Licensed electrician specializing in residential electrical systems. Expert in wiring, panel installations, and lighting solutions.',
    skills: ['Wiring', 'Panel Installation', 'Lighting', 'Electrical Repair'],
    aadharNumber: '2345-6789-0123',
    workPortfolio: [
      'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=300&h=200&fit=crop'
    ],
    rating: 4.9,
    totalReviews: 89
  }
];

export const mockBookings = [
  {
  id: '1',
  customerId: 'user123',
  workerId: 'worker456',
  status: 'pending',
  service: 'Plumbing',
  scheduledDate: '2025-08-05T14:00:00Z',
  createdAt: '2025-08-01T12:00:00Z',
  customerName: 'Sharath',
  workerName: 'John Doe',
  price: 999,
  location: 'Hyderabad',
  description: 'Fix leaking pipe'
}
,
  {
  id: '2',
  customerId: 'user12',
  workerId: 'worker456',
  status: 'pending',
  service: 'Plumbing',
  scheduledDate: '2025-08-05T14:00:00Z',
  createdAt: '2025-08-01T12:00:00Z',
  customerName: 'Sharath',
  workerName: 'John Doe',
  price: 999,
  location: 'Hyderabad',
  description: 'Fix leaking pipe'
}

];

export const mockReviews = [
  {
    id: '1',
    bookingId: '1',
    customerId: '1',
    workerId: '1',
    customerName: 'John Customer',
    rating: 5,
    comment: 'Excellent work! Rajesh was very professional and fixed the problem quickly. Highly recommended.',
    createdAt: '2024-01-16T09:30:00.000Z',
    isAnonymous: false
  },
  {
    id: '2',
    bookingId: '2',
    customerId: '2',
    workerId: '1',
    customerName: 'Sarah Wilson',
    rating: 4,
    comment: 'Good service, arrived on time and completed the work efficiently.',
    createdAt: '2024-01-14T14:20:00.000Z',
    isAnonymous: true
  }
];
