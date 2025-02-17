import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export type Permission = 'admin' | 'instructor' | 'user' | 'manage_courses' | 'manage_instructors';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  permissions: string[];
  history: Array<{
    courseId: mongoose.Types.ObjectId;
    videoId?: string;
    type: 'course' | 'video';
    timestamp: number;
    viewedAt: Date;
  }>;
  accessibleCourses: Array<{
    courseId: mongoose.Types.ObjectId;
    grantedBy: {
      userId: mongoose.Types.ObjectId;
      name: string;
      email: string;
    };
    grantedAt: Date;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
    select: false,
  },
  permissions: {
    type: [String],
    enum: ['admin', 'instructor', 'user', 'manage_courses', 'manage_instructors'],
    default: ['user'],
  },
  history: [{
    courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    videoId: { type: String },
    type: { type: String, enum: ['course', 'video'], required: true },
    timestamp: { type: Number, default: 0 },
    viewedAt: { type: Date, default: Date.now }
  }],
  accessibleCourses: [{
    courseId: { type: Schema.Types.ObjectId, ref: 'Course' },
    grantedBy: {
      userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
      name: { type: String, required: true },
      email: { type: String, required: true }
    },
    grantedAt: { type: Date, default: Date.now }
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Method to check if password is correct
UserSchema.methods.comparePassword = async function(candidatePassword: string) {
  return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema); 