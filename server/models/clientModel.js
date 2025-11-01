import mongoose from 'mongoose';

const clientSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

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

    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false, // exclude password by default
    },

    phone: {
      type: String, // store as string to preserve leading 0/+ and avoid numeric issues
      required: true,
      unique: true,
      index: true,
      trim: true,
      validate: {
        // 10-digit Indian mobile starting with 6–9
        validator: (v) => /^[6-9]\d{9}$/.test((v || '').replace(/\D/g, '')),
        message: 'Invalid Indian phone number',
      },
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },

    profilePic: {
      type: String,
      default:
        'https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg',
    },

    // Email verification
    emailVerified: {
      type: Boolean,
      default: false,
      index: true,
    },
    emailOTP: {
      type: String, // optionally store hash instead of plain
      select: false,
    },
    emailOTPExpires: {
      type: Date,
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Normalize phone before save (digits only)
clientSchema.pre('save', function normalizePhone(next) {
  if (this.isModified('phone') && typeof this.phone === 'string') {
    this.phone = this.phone.replace(/\D/g, '');
  }
  next();
});

// Helpful compound index for login queries by email or phone
clientSchema.index({ email: 1 });
clientSchema.index({ phone: 1 });

export default mongoose.model('Client', clientSchema);
