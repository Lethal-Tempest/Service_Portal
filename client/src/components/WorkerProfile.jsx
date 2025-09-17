// src/components/WorkerProfile.jsx
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Mail, Phone, MapPin, Calendar, User, Briefcase,
  Clock, Shield, DollarSign, FileText, Edit,
  Building, Users, Star
} from "lucide-react";
import axios from "axios";

const WorkerProfile = ({ onEditProfile, worker }) => {
  const data = worker;

  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('')
  const [profilePic, setProfilePic] = useState('')

  useEffect(() => {
    if (data?._id) {
      fetchReviews();
    }
  }, [data?._id]);

  useEffect(()=>{
    const data = JSON.parse(localStorage.getItem("workerConnect_user"));
    setName(data.name)
    setProfilePic(data.profilePic)
  })

const fetchReviews = async () => {
  setLoading(true);
  try {
    const token = localStorage.getItem("token"); // adjust key if needed
    const res = await axios.get(`https://service-portal-1.onrender.com/api/worker/${data._id}/reviews`, {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });
    const json = res.data;
    if (json.success) setReviews(json.reviews);
    else setReviews([]);
  } catch (e) {
    console.error("Fetch reviews error:", e);
    setReviews([]);
  } finally {
    setLoading(false);
  }
};



  const handleSubmitReview = async () => {
  if (!rating) {
    alert("Please select a rating");
    return;
  }
  try {
    const token = localStorage.getItem("token");
    const res = await axios.post(
      `https://service-portal-1.onrender.com/api/worker/${data._id}/addReview`,
      { rating, comment: reviewText, isAnon: false, name, profilePic },
      {
        headers: {
          "Content-Type": "application/json",
          ...(token && { "token": `${token}` }),
        },
      }
    );
    const json = res.data;
    if (json.success) {
      setRating(0);
      setReviewText("");
      fetchReviews();
    } else {
      alert(json.message || "Review submission failed");
    }
  } catch (e) {
    console.error("Submit review error:", e);
    alert("Error submitting review");
  }
};


  if (!data) return null;

  const initials = data.name ? data.name.split(" ").map(n => n[0]).join("") : "U";
  const avatarSrc = data.profilePic || "";

  const mapped = {
    workStatus: data.availability || "Unavailable",
    designation: data.occupation || "—",
    department: data.skills ? (Array.isArray(data.skills) ? data.skills.join(", ") : data.skills) : "—",
    workLocation: data.location || "—",
    joiningDate: data.experience ? `${data.experience} yrs` : "—",
    shiftTiming: data.shiftTiming || "—",
    supervisor: data.supervisor || "—",
    lastLogin: data.lastLogin || "—",
    salary: data.price ? `₹ ${data.price}` : "—",
    paymentCycle: data.paymentCycle || "Per task",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
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
                    <AvatarImage src={avatarSrc} alt={data.name || "Worker"} />
                    <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <h2 className="text-2xl font-semibold text-foreground">{data.name || "Unnamed Worker"}</h2>
                      <Badge variant="outline" className="gap-1 bg-gray-100">
                        <Shield className="h-3 w-3" />
                        {mapped.workStatus}
                      </Badge>
                    </div>
                    <p className="text-lg text-primary font-medium">{mapped.designation}</p>
                    <p className="text-muted-foreground">{mapped.department}</p>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field icon={<Mail />} label="Email" value={data.email} />
                  <Field icon={<Phone />} label="Phone" value={data.phone} />
                  <Field icon={<MapPin />} label="Location" value={data.location} />
                  <Field icon={<Calendar />} label="Date of Birth" value={data.dateOfBirth} />
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
                      <span className="font-medium">{data._id || "—"}</span>
                    </div>
                    <Detail icon={<Building />} title="Work Location" value={mapped.workLocation} />
                    <Detail icon={<Calendar />} title="Experience" value={mapped.joiningDate} />
                  </div>
                  <div className="space-y-4">
                    <Detail icon={<Clock />} title="Shift Timing" value={mapped.shiftTiming} />
                    <Detail icon={<Users />} title="Supervisor" value={mapped.supervisor} />
                    <Detail icon={<Shield />} title="Last Login" value={mapped.lastLogin} />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Tasks - placeholder */}
            <Card className="shadow-elegant">
              <CardHeader>
                <CardTitle className="text-xl">Recent Tasks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <TaskRow title="Kitchen Sink Repair" status="Completed" hint="Completed - 2 days ago" />
                  <TaskRow title="Bathroom Plumbing Installation" status="In Progress" hint="In Progress - Started today" />
                  <TaskRow title="Water Heater Maintenance" status="Scheduled" hint="Scheduled - Tomorrow at 2:00 PM" />
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
                  <div className="text-2xl font-bold text-primary-foreground">{mapped.workStatus === "True" ? "Active" : "Inactive"}</div>
                  <p className="text-primary-foreground/80">Current Status</p>
                </div>
                <div className="space-y-3">
                  <div className="text-center p-3 rounded-lg bg-blue-100/50">
                    <div className="text-lg font-bold text-foreground">{data.tasksThisMonth ?? 15}</div>
                    <p className="text-sm text-muted-foreground">Tasks This Month</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-blue-100/50">
                    <div className="text-lg font-bold text-foreground">{data.rating ?? "4.9"}</div>
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
                  <p className="font-medium text-foreground">Price</p>
                  <p className="text-sm text-muted-foreground">{mapped.salary}</p>
                </div>
                <div className="p-3 rounded-lg bg-blue-50">
                  <p className="font-medium text-foreground">Payment Cycle</p>
                  <p className="text-sm text-muted-foreground">{mapped.paymentCycle}</p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="shadow-elegant">
              <CardHeader>
                <CardTitle className="text-xl">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start gap-2 bg-white border border-gray-200 text-black">
                  <Calendar className="h-4 w-4" />
                  View Schedule
                </Button>
                <Button className="w-full justify-start gap-2 bg-white border border-gray-200 text-black">
                  <FileText className="h-4 w-4" />
                  Task Reports
                </Button>
                <Button className="w-full justify-start gap-2 bg-white border border-gray-200 text-black">
                  <Mail className="h-4 w-4" />
                  Contact Manager
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Customer Reviews Section */}
        <Card className="shadow-elegant max-w-6xl mx-auto mt-6">
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
                  className={`h-6 w-6 cursor-pointer ${star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
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

            {loading && <p>Loading reviews...</p>}
            {!loading && reviews.length === 0 && <p className="text-muted-foreground">No reviews yet.</p>}

            {!loading && reviews.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-medium text-foreground">Previous Reviews</h4>
                {reviews.map((r, index) => (
                  <div key={index} className="rounded-lg bg-white p-3 flex justify-between px-2">
                    <div>
                      <div className="flex items-center gap-1">
                      {[...Array(r.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground">{r.comment || r.text}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <img src={r.profilePic} className="h-8 w-8 rounded-full" />
                      <p>{r.name}</p>
                    </div>
                    
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const Field = ({ icon, label, value }) => (
  <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-100/50">
    {React.cloneElement(icon, { className: "h-5 w-5 text-primary" })}
    <div>
      <p className="text-sm font-medium text-foreground">{label}</p>
      <p className="text-sm text-muted-foreground">{value || "—"}</p>
    </div>
  </div>
);

const Detail = ({ icon, title, value }) => (
  <div className="flex items-center gap-3">
    {React.cloneElement(icon, { className: "h-4 w-4 text-muted-foreground" })}
    <div>
      <p className="text-sm font-medium">{title}</p>
      <p className="text-sm text-muted-foreground">{value || "—"}</p>
    </div>
  </div>
);

const TaskRow = ({ title, status, hint }) => (
  <div className="flex items-center gap-4 p-3 rounded-lg border">
    <div className={`h-2 w-2 rounded-full ${status === "Completed" ? "bg-primary" : status === "In Progress" ? "bg-yellow-300" : "bg-muted-foreground"}`}></div>
    <div className="flex-1">
      <p className="font-medium text-foreground">{title}</p>
      <p className="text-sm text-muted-foreground">{hint}</p>
    </div>
    <Badge variant={status === "Completed" ? "outline" : "secondary"} className={status !== "Completed" ? "bg-slate-100 text-black" : ""}>
      {status}
    </Badge>
  </div>
);

export default WorkerProfile;
