// src/components/Profile.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Mail, Phone, MapPin, Calendar, Star, Edit, Shield, Award } from "lucide-react";

const Profile = ({ user, onEditProfile }) => {
  const navigate = useNavigate();

  // ⭐ Local state for review section
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [reviews, setReviews] = useState([]);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">No profile data available.</p>
      </div>
    );
  }

  const initials = user.name ? user.name.split(" ").map((n) => n).join("") : "U";
  const avatarSrc = user.profilePic || user.profilePicture || "";

  const recentActivities = [
    { id: 1, title: "Plumbing Service Completed", description: "Kitchen sink repair - 2 days ago", status: "Completed" },
    { id: 2, title: "House Cleaning Scheduled", description: "Weekly cleaning - Tomorrow at 10:00 AM", status: "Scheduled" },
    { id: 3, title: "Electrical Work Completed", description: "Light fixture installation - 1 week ago", status: "Completed" },
  ];

  const achievements = [
    { id: 1, title: "Loyal Customer", description: "20+ bookings completed", icon: <Award className="h-5 w-5 text-yellow-400" /> },
    { id: 2, title: "Top Reviewer", description: "Helpful reviews provided", icon: <Star className="h-5 w-5 text-blue-400" /> },
    { id: 3, title: "Verified Account", description: "Identity confirmed", icon: <Shield className="h-5 w-5 text-gray-400" /> },
  ];

  const stats = [
    { id: 1, title: "Total Bookings", value: user.totalBookings ?? 24 },
    { id: 2, title: "Completed", value: user.completedBookings ?? 22 },
    { id: 3, title: "Rating", value: user.rating ?? "—" },
  ];

  const handleSubmitReview = () => {
    if (!rating) return alert("Please select a rating");
    const newReview = { rating, text: reviewText || "No comment" };
    setReviews([...reviews, newReview]);
    setRating(0);
    setReviewText("");
    // 🔗 Here you can send `newReview` to your backend API.
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
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
              <CardHeader className="pb-4">
                <CardTitle className="text-xl">Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start gap-6">
                  <Avatar className="h-24 w-24 shadow-glow">
                    <AvatarImage src={avatarSrc} alt={user.name || "User"} />
                    <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <h2 className="text-2xl font-semibold text-foreground">{user.name || "Unnamed User"}</h2>
                      <Badge variant="outline" className="gap-1 bg-green-500 text-white border-green-300">
                        <Shield className="h-3 w-3" /> {user.role === "worker" ? "Verified Worker" : "Verified Customer"}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium text-foreground">{user.rating ?? "—"}</span>
                      <span className="text-muted-foreground">
                        {user.role === "worker" ? "Worker Rating" : "Customer Rating"}
                      </span>
                    </div>
                    {user.role === "worker" && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span className="font-medium text-foreground">{user.occupation || "—"}</span>
                        <span>•</span>
                        <span>{Array.isArray(user.skills) ? user.skills.join(", ") : user.skills || "—"}</span>
                      </div>
                    )}
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

            {/* Recent Activities */}
            <Card className="shadow-elegant">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentActivities.map((a) => (
                  <div key={a.id} className="flex items-center justify-between p-3 rounded-lg bg-white">
                    <div className="space-y-1">
                      <p className="font-medium text-foreground">{a.title}</p>
                      <p className="text-sm text-muted-foreground">{a.description}</p>
                    </div>
                    <Badge variant="secondary">{a.status}</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Stats */}
            <Card className="shadow-elegant">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Stats</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-3 gap-3">
                {stats.map((s) => (
                  <div key={s.id} className="rounded-lg bg-white p-4 text-center">
                    <p className="text-2xl font-bold text-foreground">{s.value}</p>
                    <p className="text-xs text-muted-foreground">{s.title}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card className="shadow-elegant">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Achievements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {achievements.map((ach) => (
                  <div key={ach.id} className="flex items-center gap-3 rounded-lg bg-white p-3">
                    {ach.icon}
                    <div>
                      <p className="font-medium text-foreground">{ach.title}</p>
                      <p className="text-sm text-muted-foreground">{ach.description}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* ⭐ Customer Reviews Section */}
            {user.role === "worker" && (
              <Card className="shadow-elegant">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-400" /> Customer Reviews
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Rating Input */}
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-6 w-6 cursor-pointer ${
                          star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                        }`}
                        onClick={() => setRating(star)}
                      />
                    ))}
                  </div>
                  <textarea
                    className="w-full p-2 border rounded-md text-sm"
                    rows="3"
                    placeholder="Write your review..."
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                  />
                  <Button className="w-full" onClick={handleSubmitReview}>
                    Submit Review
                  </Button>

                  {/* Display Submitted Reviews */}
                  {reviews.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="font-medium text-foreground">Previous Reviews</h4>
                      {reviews.map((r, index) => (
                        <div key={index} className="rounded-lg bg-white p-3">
                          <div className="flex items-center gap-1">
                            {[...Array(r.rating)].map((_, i) => (
                              <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            ))}
                          </div>
                          <p className="text-sm text-muted-foreground">{r.text}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            <Button className="w-full" variant="secondary" onClick={() => navigate("/")}>
              Go Home
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Small utility component
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
