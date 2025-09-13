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
  profilePic: {
    type: String,
    required: false,
    default: 'https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg'
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
    required: false, 
    default: []
  },
  price: {
    type: Number,
    required: false,
  },
  reviews: [
    {
      rating: {
        type: Number,
        required: true,
      },
      comment: {
        type: String,
      },
      date: {
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
        default: false,
        required: true,
      },
      name: {
        type: String,
        default: "Anonymous",
        required: false,
      },
      profilePic: {
        type: String,
        required: false,
        default: 'https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg'
      }
    },
  ],
  aadhar: {
    type: String,
    required: true,
  },
  aadharPicUrl: {
    type: String,
    required: false,
  },
  introVidUrl: {
    type: String,
    required: false,
    default: null
  },
});

export default mongoose.model('Worker', workerSchema);

