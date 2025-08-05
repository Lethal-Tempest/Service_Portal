// controllers/editControllers.js

import User from '../models/clientModel.js';
import Worker from '../models/workerModel.js';

// ------------------ Edit User Profile ------------------
export const editUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Update user fields
    user.firstName = req.body.firstName || user.firstName;
    user.lastName = req.body.lastName || user.lastName;
    user.email = req.body.email || user.email;
    user.phone = req.body.phone || user.phone;
    user.profilePicUrl = req.body.profilePicUrl || user.profilePicUrl;
    user.location = req.body.location || user.location;

    const updatedUser = await user.save();

    res.status(200).json({
      message: 'User profile updated successfully',
      user: updatedUser,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// ------------------ Edit Worker Profile ------------------
export const editWorkerProfile = async (req, res) => {
  try {
    const worker = await Worker.findById(req.user._id);
    if (!worker) return res.status(404).json({ message: 'Worker not found' });

    // Update worker fields
    worker.name = req.body.name || worker.name;
    worker.location = req.body.location || worker.location;
    worker.email = req.body.email || worker.email;
    worker.phone = req.body.phone || worker.phone;
    worker.profilePicUrl = req.body.profilePicUrl || worker.profilePicUrl;
    worker.occupation = req.body.occupation || worker.occupation;
    worker.skills = req.body.skills || worker.skills;
    worker.experience = req.body.experience || worker.experience;
    worker.availability = req.body.availability || worker.availability;
    worker.bio = req.body.bio || worker.bio;
    worker.previousWorkPicsUrl = req.body.previousWorkPicsUrl || worker.previousWorkPicsUrl;
    worker.aadhar = req.body.aadhar || worker.aadhar;
    worker.aadharPicUrl = req.body.aadharPicUrl || worker.aadharPicUrl;
    worker.introVidUrl = req.body.introVidUrl || worker.introVidUrl;

    const updatedWorker = await worker.save();

    res.status(200).json({
      message: 'Worker profile updated successfully',
      worker: updatedWorker,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
