import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { mockBookings } from '../data/mockData';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Calendar, MapPin, Clock, User, Phone, MessageCircle } from 'lucide-react';
import { format } from 'date-fns';

export const Bookings = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('all');

  const filteredBookings = mockBookings.filter((booking) => {
    const roleMatch = user?.role === 'customer'
      ? booking.customerId === user.id
      : booking.workerId === user.id;

    const statusMatch = activeTab === 'all' || booking.status === activeTab;

    return roleMatch && statusMatch;
  });

  const getStatusBadge = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      approved: 'bg-blue-100 text-blue-800 border-blue-200',
      completed: 'bg-green-100 text-green-800 border-green-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200',
    };

    return (
      <Badge className={`${colors[status]} font-medium`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const tabs = [
    { key: 'all', label: 'All Bookings' },
    { key: 'pending', label: 'Pending' },
    { key: 'approved', label: 'Approved' },
    { key: 'completed', label: 'Completed' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
          <div className="container mx-auto px-4 py-8">
                  <div className="mb-8">
            <h1
              className={`text-3xl md:text-4xl font-bold mb-2 ${
                user?.role === 'worker'
                  ? 'text-black'
                  : 'gradient-text'
              }`}
            >
              {user?.role === 'customer' ? 'My Bookings' : 'Job Requests'}
            </h1>

            <p
              className={`${
                user?.role === 'worker' ? 'text-gray-500' : 'text-gray-600'
              }`}
            >
              {user?.role === 'customer'
                ? 'Track and manage your service requests'
                : 'View and manage incoming job requests'}
            </p>
          </div>


        <div className="mb-8">
            <div className="flex flex-wrap gap-2 p-1 bg-white rounded-lg shadow-sm border">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all
                    ${
                      activeTab === tab.key
                        ? user?.role === 'worker'
                          ? 'bg-gradient-to-r from-blue-500 to-green-500 text-white shadow-sm'
                          : 'bg-primary text-white shadow-sm'
                        : user?.role === 'worker'
                          ? 'text-gray-600 hover:text-green-600 hover:bg-green-50'
                          : 'text-gray-600 hover:text-primary hover:bg-primary/5'
                    }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
        </div>

        <div className="space-y-6">
          {filteredBookings.length === 0 ? (
            <Card className="p-12 text-center card-gradient">
              <div className="text-gray-400 mb-4">
                <Calendar className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No bookings found
              </h3>
              <p className="text-gray-600">
                {activeTab === 'all'
                  ? "You don't have any bookings yet."
                  : `No ${activeTab} bookings found.`}
              </p>
            </Card>
          ) : (
            filteredBookings.map((booking) => (
              <Card key={booking.id} className="p-6 card-gradient hover-scale">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-1">
                          {booking.service}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            {user?.role === 'customer' ? booking.workerName : booking.customerName}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {format(new Date(booking.scheduledDate), 'MMM dd, yyyy at HH:mm')}
                          </span>
                        </div>
                      </div>
                      {getStatusBadge(booking.status)}
                    </div>

                    <p className="text-gray-700 mb-4 leading-relaxed">{booking.description}</p>

                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {booking.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        Created {format(new Date(booking.createdAt), 'MMM dd, yyyy')}
                      </span>
                    </div>
                  </div>

                  <div className="lg:text-right">
                    <div className="text-2xl font-bold text-primary mb-4">
                      ₹{booking.price.toLocaleString()}
                    </div>

                    <div className="flex lg:flex-col gap-2">
                      {booking.status === 'pending' && (
                        <>
                          {user?.role === 'worker' && (
                            <>
                              <Button size="sm" className="btn-primary">
                                Accept
                              </Button>
                              <Button size="sm" variant="outline">
                                Decline
                              </Button>
                            </>
                          )}
                          {user?.role === 'customer' && (
                            <Button size="sm" variant="outline">
                              Cancel
                            </Button>
                          )}
                        </>
                      )}

                      {booking.status === 'approved' && (
                        <>
                          <Button size="sm" className="btn-primary">
                            <Phone className="w-4 h-4 mr-1" />
                            Contact
                          </Button>
                          {user?.role === 'worker' && (
                            <Button size="sm" variant="outline">
                              Mark Complete
                            </Button>
                          )}
                        </>
                      )}

                      {booking.status === 'completed' && user?.role === 'customer' && (
                        <Button size="sm" variant="outline">
                          Leave Review
                        </Button>
                      )}

                      <Button size="sm" variant="ghost">
                        <MessageCircle className="w-4 h-4 mr-1" />
                        Message
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
