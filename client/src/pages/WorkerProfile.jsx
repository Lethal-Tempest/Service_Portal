import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Mail, Phone, MapPin, Calendar, User, Briefcase, 
  Clock, Shield, DollarSign, FileText, Edit, 
  Building, Users, Star, Award 
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import profileImage from '@/assets/profile-placeholder.jpg';

const WorkerProfile = ({ onEditProfile }) => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6'>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Worker Profile</h1>
            <p className="text-muted-foreground">Manage your professional information</p>
          </div>
          <Button variant="outline" className="gap-2" onClick={onEditProfile}>
            <Edit className="h-4 w-4" />
            Edit Profile
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Profile Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information Card */}
            <Card className="shadow-elegant">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  Personal Information
                </CardTitle>
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
                      <Badge variant="outline" className="gap-1 bg-gray-100">
                        <Shield className="h-3 w-3" />
                        {user.workStatus}
                      </Badge>
                    </div>
                    <p className="text-lg text-primary font-medium">{user.designation}</p>
                    <p className="text-muted-foreground">{user.department}</p>
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

            {/* Professional Details */}
            <Card className="shadow-elegant">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-primary" />
                  Professional Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="w-fit">Worker ID</Badge>
                      <span className="font-medium">{user.workerId}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Building className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Work Location</p>
                        <p className="text-sm text-muted-foreground">{user.workLocation}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Joining Date</p>
                        <p className="text-sm text-muted-foreground">{user.joiningDate}</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Shift Timing</p>
                        <p className="text-sm text-muted-foreground">{user.shiftTiming}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Supervisor</p>
                        <p className="text-sm text-muted-foreground">{user.supervisor}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Shield className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Last Login</p>
                        <p className="text-sm text-muted-foreground">{user.lastLogin}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Tasks */}
            <Card className="shadow-elegant">
              <CardHeader>
                <CardTitle className="text-xl">Recent Tasks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-3 rounded-lg border">
                    <div className="h-2 w-2 bg-primary rounded-full"></div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">Kitchen Sink Repair</p>
                      <p className="text-sm text-muted-foreground">Completed - 2 days ago</p>
                    </div>
                    <Badge variant="outline">Completed</Badge>
                  </div>
                  <div className="flex items-center gap-4 p-3 rounded-lg border">
                    <div className="h-2 w-2 bg-yellow-300 rounded-full"></div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">Bathroom Plumbing Installation</p>
                      <p className="text-sm text-muted-foreground">In Progress - Started today</p>
                    </div>
                    <Badge variant="secondary" className='bg-slate-100 text-black' >In Progress</Badge>
                  </div>
                  <div className="flex items-center gap-4 p-3 rounded-lg border">
                    <div className="h-2 w-2 bg-muted-foreground rounded-full"></div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">Water Heater Maintenance</p>
                      <p className="text-sm text-muted-foreground">Scheduled - Tomorrow at 2:00 PM</p>
                    </div>
                    <Badge variant="secondary" className='bg-slate-100 text-black'>Scheduled</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Work Status */}
            <Card className="shadow-elegant">
              <CardHeader>
                <CardTitle className="text-xl">Work Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-4 rounded-lg bg-gradient-primary">
                  <div className="text-2xl font-bold text-primary-foreground">Active</div>
                  <p className="text-primary-foreground/80">Current Status</p>
                </div>
                <div className="space-y-3">
                  <div className="text-center p-3 rounded-lg bg-blue-100/50">
                    <div className="text-lg font-bold text-foreground">15</div>
                    <p className="text-sm text-muted-foreground">Tasks This Month</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-blue-100/50">
                    <div className="text-lg font-bold text-foreground">4.9</div>
                    <p className="text-sm text-muted-foreground">Rating</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Compensation */}
            <Card className="shadow-elegant">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-yellow-300" />
                  Compensation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 rounded-lg bg-yellow-300/10 border border-yellow-100">
                  <p className="font-medium text-foreground">Salary</p>
                  <p className="text-sm text-muted-foreground">{user.salary}</p>
                </div>
                <div className="p-3 rounded-lg bg-blue-50">
                  <p className="font-medium text-foreground">Payment Cycle</p>
                  <p className="text-sm text-muted-foreground">{user.paymentCycle}</p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="shadow-elegant">
              <CardHeader>
                <CardTitle className="text-xl">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start gap-2 bg-white border border-gray-200 text-black" >
                  <Calendar className="h-4 w-4" />
                  View Schedule
                </Button>
                <Button className="w-full justify-start gap-2 bg-white border border-gray-200 text-black" >
                  <FileText className="h-4 w-4" />
                  Task Reports
                </Button>
                <Button className="w-full justify-start gap-2 bg-white border border-gray-200 text-black" >
                  <Mail className="h-4 w-4" />
                  Contact Manager
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkerProfile;