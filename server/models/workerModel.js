import mongoose from 'mongoose';

const reviewSubSchema = new mongoose.Schema(
  {
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, trim: true, maxlength: 2000 },
    date: { type: Date, required: true, default: Date.now },
    clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
    isAnon: { type: Boolean, default: false, required: true },
    name: { type: String, default: 'Anonymous', trim: true },
    profilePic: {
      type: String,
      default:
        'https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg',
    },
  },
  { _id: false }
);

const workerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 100 },

    location: { type: String, required: true, trim: true },

    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: (v) => /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(v),
        message: 'Invalid email format',
      },
    },

    password: { type: String, required: true, minlength: 8, select: false },

    phone: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
      validate: {
        validator: (v) => /^[6-9]\d{9}$/.test((v || '').replace(/\D/g, '')),
        message: 'Invalid Indian phone number',
      },
    },

    profilePic: {
      type: String,
      default:
        'https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg',
    },

    occupation: { type: String, required: true, trim: true, maxlength: 100 },

    skills: {
      type: [String],
      required: true,
      validate: {
        validator: (arr) => Array.isArray(arr) && arr.length > 0,
        message: 'At least one skill is required',
      },
    },

    experience: { type: Number, required: true, min: 0, max: 60 },

    availability: {
      type: String,
      required: true,
      enum: ['True', 'False'],
      default: 'True',
    },

    bio: { type: String, required: true, trim: true, maxlength: 5000 },

    previousWorkPicsUrl: { type: [String], default: [] },

    price: { type: Number, min: 0 },

    reviews: { type: [reviewSubSchema], default: [] },

    aadhar: {
      type: String,
      required: true,
      trim: true,
      validate: {
        // 12 digits Aadhaar basic check
        validator: (v) => /^\d{12}$/.test((v || '').replace(/\D/g, '')),
        message: 'Invalid Aadhaar number',
      },
    },

    aadharPicUrl: { type: String },

    introVidUrl: { type: String, default: null },

    // Email verification
    emailVerified: { type: Boolean, default: false, index: true },
    emailOTP: { type: String, select: false },
    emailOTPExpires: { type: Date, index: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Normalize fields
workerSchema.pre('save', function normalizeFields(next) {
  if (this.isModified('phone') && typeof this.phone === 'string') {
    this.phone = this.phone.replace(/\D/g, '');
  }
  if (this.isModified('skills') && Array.isArray(this.skills)) {
    this.skills = this.skills.map((s) => String(s).trim()).filter(Boolean);
  }
  next();
});

workerSchema.index({ email: 1 });
workerSchema.index({ phone: 1 });
workerSchema.index({ occupation: 1, location: 1 }); // useful for finding workers by role and location

export default mongoose.model('Worker', workerSchema);
