import mongoose from "mongoose";

const workerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
  },
  profilePicUrl: {
    type: String,
    required: true,
  },
  occupation: {
    type: String,
    required: true,
  },
  skills: {
    type: [String],
    required: true,
  },
  experience: {
    type: Number,
    required: true,
  },
  availability: {
    type: String,
    required: true,
  },
  bio: {
    type: String,
    required: true,
  },
  previousWorkPicsUrl: {
    type: [String],
    required: true,
  },
  reviews: [
    {
      ratings: {
        type: Number,
        required: true,
      },
      comments: {
        type: String,
        required: true,
      },
      dates: {
        type: Date,
        required: true,
      },
      clientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client',
        required: true,
      },
      isAnon: {
        type: Boolean,
        required: true,
      },
    },
  ],
  aadhar: {
    type: String,
    required: true,
  },
  aadharPicUrl: {
    type: String,
    required: true,
  },
  introVidUrl: {
    type: String,
    required: true,
  },
});

export default mongoose.model('Worker', workerSchema);

