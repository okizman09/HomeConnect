const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
  landlordId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  location: {
    type: String,
    required: [true, 'Please add a location']
  },
  price: {
    type: Number,
    required: [true, 'Please add a price']
  },
  propertyType: {
    type: String,
    required: [true, 'Please add a property type'],
    enum: ['self contain', '1-bedroom', '2-bedroom', '3-bedroom', '4-bedroom', 'duplex']
  },
  occupancyLimit: {
    type: Number,
    required: [true, 'Please add occupancy limit']
  },
  images: [{
    type: String,
    required: true
  }],
  dateCreated: {
    type: Date,
    default: Date.now
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual populate for landlord details
listingSchema.virtual('landlord', {
  ref: 'User',
  localField: 'landlordId',
  foreignField: '_id',
  justOne: true
});

module.exports = mongoose.model('Listing', listingSchema);
