import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Mail, Phone, MapPin, Calendar, Star, Edit, Shield, Award } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import profileImage from "@/assets/profile-placeholder.jpg";

const Profile = ({ user, onEditProfile }) => {
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">No profile data available.</p>
      </div>
    );
  }

  const initials = user.name ? user.name.split(" ").map(n => n[0]).join("") : "U";

  const recentActivities = [
    { id: 1, title: "Plumbing Service Completed", description: "Kitchen sink repair - 2 days ago", status: "Completed" },
    { id: 2, title: "House Cleaning Scheduled", description: "Weekly cleaning - Tomorrow at 10:00 AM", status: "Scheduled" },
    { id: 3, title: "Electrical Work Completed", description: "Light fixture installation - 1 week ago", status: "Completed" },
  ];

  const achievements = [
    { id: 1, title: "Loyal Customer", description: "20+ bookings completed", color: "yellow-300", icon: <Award className="h-5 w-5 text-yellow-400" /> },
    { id: 2, title: "Top Reviewer", description: "Helpful reviews provided", color: "blue-100", icon: <Star className="h-5 w-5 text-blue-400" /> },
    { id: 3, title: "Verified Account", description: "Identity confirmed", color: "gray-100", icon: <Shield className="h-5 w-5 text-gray-400" /> },
  ];

  const stats = [
    { id: 1, title: "Total Bookings", value: 24 },
    { id: 2, title: "Completed", value: 22 },
    { id: 3, title: "Rating", value: 4.8 },
  ];

  return (
    <div className="min-h-screen b0g-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Profile</h1>
            <p className="text-muted-foreground">Manage your account information and preferences</p>
          </div>
          <Button variant="outline" className="gap-2" onClick={onEditProfile}>
            <Edit className="h-4 w-4" /> Edit Profile
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Info */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-elegant">
              <CardHeader className="pb-4"><CardTitle className="text-xl">Personal Information</CardTitle></CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start gap-6">
                  <Avatar className="h-24 w-24 shadow-glow">
                    <AvatarImage src={profileImage} alt={user.name || "User"} />
                    <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <h2 className="text-2xl font-semibold text-foreground">{user.name || "Unnamed User"}</h2>
                      <Badge variant="outline" className="gap-1 bg-green-500 text-white border-green-300">
                        <Shield className="h-3 w-3" /> Verified Customer
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium text-foreground">{user.rating ?? "—"}</span>
                      <span className="text-muted-foreground">Customer Rating</span>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InfoRow icon={<Mail />} label="Email" value={user.email} />
                  <InfoRow icon={<Phone />} label="Phone" value={user.phone} />
                  <InfoRow icon={<MapPin />} label="Location" value={user.location} />
                  <InfoRow icon={<Calendar />} label="Date of Birth" value={user.dateOfBirth} />
                </div>
              </CardContent>
            </Card>
            {/* ... rest of your activities & stats unchanged ... */}
          </div>
        </div>
      </div>
    </div>
  );
};

// ✅ Extracted info row to reduce repetition
const InfoRow = ({ icon, label, value }) => (
  <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-100/50">
    {React.cloneElement(icon, { className: "h-5 w-5 text-primary" })}
    <div>
      <p className="text-sm font-medium text-foreground">{label}</p>
      <p className="text-sm text-muted-foreground">{value || "—"}</p>
    </div>
  </div>
);

export default Profile;
