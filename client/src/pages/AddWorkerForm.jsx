import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const AddWorkerForm = ({ onClose, onAddWorker }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    workerNumber: "",
    name: "",
    skills: "",
    aadhaar: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.workerNumber || !formData.name || !formData.skills || !formData.aadhaar) {
      alert("Please fill all fields!");
      return;
    }

    const newWorker = {
      id: Date.now(),
      name: formData.name,
      profession: "Temporary Worker",
      skills: formData.skills.split(",").map((s) => s.trim()),
      aadhaar: formData.aadhaar,
      hourlyRate: 0,
      rating: 0,
      experience: 0,
      location: "Customer Added",
      isVerified: false,
      totalReviews: 0,
    };

    onAddWorker(newWorker);
    alert("Worker added successfully!");
    setFormData({ workerNumber: "", name: "", skills: "", aadhaar: "" });
    onClose();
  };

  const handleCancel = () => {
    // Reset form data
    setFormData({ workerNumber: "", name: "", skills: "", aadhaar: "" });

    // Optional: confirm navigation
    const confirmCancel = window.confirm("Are you sure you want to cancel? Unsaved changes will be lost.");
    if (confirmCancel) {
      // Redirect to home page
      navigate("/");
    }
  };

  return (
    <div className="fixed inset-0 bg-blue-900/50 flex justify-center items-center z-50 backdrop-blur-sm">
      <Card className="p-6 bg-gradient-to-b from-blue-100 to-yellow-50 w-[420px] rounded-2xl shadow-xl border border-blue-200 transition-transform transform hover:scale-[1.01]">
        <h2 className="text-2xl font-extrabold mb-6 text-center text-blue-800">
          Add Temporary Worker
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Worker Number */}
          <div>
            <label className="block text-sm font-semibold text-blue-800 mb-1">
              Worker Number
            </label>
            <Input
              type="text"
              name="workerNumber"
              value={formData.workerNumber}
              onChange={handleChange}
              placeholder="Enter worker number"
              className="border-blue-300 focus:border-blue-600 focus:ring focus:ring-blue-200 transition-all"
            />
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-semibold text-blue-800 mb-1">
              Name
            </label>
            <Input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter worker name"
              className="border-blue-300 focus:border-blue-600 focus:ring focus:ring-blue-200 transition-all"
            />
          </div>

          {/* Skills */}
          <div>
            <label className="block text-sm font-semibold text-blue-800 mb-1">
              Skills (comma separated)
            </label>
            <Input
              type="text"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              placeholder="e.g. Cleaning, Painting"
              className="border-blue-300 focus:border-blue-600 focus:ring focus:ring-blue-200 transition-all"
            />
          </div>

          {/* Aadhaar */}
          <div>
            <label className="block text-sm font-semibold text-blue-800 mb-1">
              Aadhaar Number
            </label>
            <Input
              type="text"
              name="aadhaar"
              value={formData.aadhaar}
              onChange={handleChange}
              placeholder="Enter Aadhaar Number"
              className="border-blue-300 focus:border-blue-600 focus:ring focus:ring-blue-200 transition-all"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-between pt-4">
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg px-4 py-2 transition-all"
            >
              Submit
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              className="border-yellow-400 text-yellow-600 hover:bg-yellow-100 font-semibold rounded-lg px-4 py-2 transition-all"
            >
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default AddWorkerForm;
