import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Mail, Phone, MapPin, Calendar, Star, Edit, Shield, Award } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import profileImage from '@/assets/profile-placeholder.jpg';

const Profile = ({ onEditProfile }) => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6'>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Profile</h1>
            <p className="text-muted-foreground">Manage your account information and preferences</p>
          </div>
          <Button variant="outline" className="gap-2" onClick={onEditProfile}>
            <Edit className="h-4 w-4" />
            Edit Profile
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Information Card */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-elegant">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl">Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start gap-6">
                  <Avatar className="h-24 w-24 shadow-glow">
                    <AvatarImage src={profileImage} alt={user.name} />
                    <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <h2 className="text-2xl font-semibold text-foreground">{user.name}</h2>
                      <Badge variant="outline" className="gap-1 bg-green-500 text-white border-green-300">
                        <Shield className="h-3 w-3" />
                        Verified Customer
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium text-foreground">4.8</span>
                      <span className="text-muted-foreground">Customer Rating</span>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-100/50">
                    <Mail className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Email</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-100/50">
                    <Phone className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Phone</p>
                      <p className="text-sm text-muted-foreground">{user.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-100/50">
                    <MapPin className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Location</p>
                      <p className="text-sm text-muted-foreground">{user.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-100/50">
                    <Calendar className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Date of Birth</p>
                      <p className="text-sm text-muted-foreground">{user.dateOfBirth}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="shadow-elegant">
              <CardHeader>
                <CardTitle className="text-xl">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-3 rounded-lg border">
                    <div className="h-2 w-2 bg-primary rounded-full"></div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">Plumbing Service Completed</p>
                      <p className="text-sm text-muted-foreground">Kitchen sink repair - 2 days ago</p>
                    </div>
                    <Badge variant="outline">Completed</Badge>
                  </div>
                  <div className="flex items-center gap-4 p-3 rounded-lg border">
                    <div className="h-2 w-2 bg-yellow-200 rounded-full"></div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">House Cleaning Scheduled</p>
                      <p className="text-sm text-muted-foreground">Weekly cleaning - Tomorrow at 10:00 AM</p>
                    </div>
                    <Badge variant="secondary" className='bg-slate-100 text-black'>Scheduled</Badge>
                  </div>
                  <div className="flex items-center gap-4 p-3 rounded-lg border">
                    <div className="h-2 w-2 bg-muted-foreground rounded-full"></div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">Electrical Work Completed</p>
                      <p className="text-sm text-muted-foreground">Light fixture installation - 1 week ago</p>
                    </div>
                    <Badge variant="outline">Completed</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Stats and Quick Actions */}
          <div className="space-y-6">
            <Card className="shadow-elegant">
              <CardHeader>
                <CardTitle className="text-xl">Account Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center p-4 rounded-lg bg-gradient-primary">
                  <div className="text-3xl font-bold text-primary-foreground">24</div>
                  <p className="text-primary-foreground/80">Total Bookings</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 rounded-lg bg-gray-100/50">
                    <div className="text-2xl font-bold text-foreground">22</div>
                    <p className="text-sm text-muted-foreground">Completed</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-gray-100/50">
                    <div className="text-2xl font-bold text-foreground">4.8</div>
                    <p className="text-sm text-muted-foreground">Rating</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-elegant">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Award className="h-5 w-5 text-yellow-400 " />
                  Achievements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-yellow-300/10 border border-yellow-100">
                  <Award className="h-5 w-5 text-yellow-400" />
                  <div>
                    <p className="font-medium text-foreground">Loyal Customer</p>
                    <p className="text-xs text-muted-foreground">20+ bookings completed</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-100 border border-blue-300 ">
                  <Star className="h-5 w-5 text-blue-400" />
                  <div>
                    <p className="font-medium text-foreground">Top Reviewer</p>
                    <p className="text-xs text-muted-foreground">Helpful reviews provided</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-100 border border-gray-200">
                  <Shield className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="font-medium text-foreground">Verified Account</p>
                    <p className="text-xs text-muted-foreground">Identity confirmed</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-elegant">
              <CardHeader>
                <CardTitle className="text-xl">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start gap-2 bg-white border border-gray-200 text-black" variant="outline">
                  <Calendar className="h-4 w-4" />
                  View My Bookings
                </Button>
                <Button className="w-full justify-start gap-2 bg-white border border-gray-200 text-black" variant="outline">
                  <Star className="h-4 w-4" />
                  Leave a Review
                </Button>
                <Button className="w-full justify-start gap-2 bg-white border border-gray-200 text-black" variant="outline">
                  <Mail className="h-4 w-4" />
                  Contact Support
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;