import mongoose from 'mongoose';

const videoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a video title'],
  },
  bio: {
    type: String,
    default: ''
  },
  editing: {
    type: Boolean,
    default: false
  },
  url: {
    type: String,
    required: [true, 'Please provide a video URL'],
    validate: {
      validator: function(v: string) {
        // Basic URL validation
        try {
          new URL(v);
          return true;
        } catch {
          return false;
        }
      },
      message: 'Please provide a valid video URL'
    }
  },
  duration: String,
  order: Number,
});

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a course title'],
  },
  description: {
    type: String,
    required: [true, 'Please provide a course description'],
  },
  instructorName: {
    type: String,
    required: [true, 'Please provide an instructor name'],
  },
  image: {
    type: String,
    required: [true, 'Please provide a thumbnail URL'],
  },
  privacy: {
    type: String,
    enum: ['public', 'unlisted', 'private'],
    default: 'private'
  },
  videos: [videoSchema],
  price: {
    type: Number,
    required: [true, 'Please provide a price'],
    default: 0,
    min: [0, 'Price cannot be negative']
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  }
});

// Update the updatedAt timestamp before saving
courseSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  if (this.isModified('price')) {
    this.price = Number(this.price.toFixed(2));
  }
  next();
});

export default mongoose.models.Course || mongoose.model('Course', courseSchema);