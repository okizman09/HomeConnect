const mongoose = require('mongoose');

const maintenanceSchema = new mongoose.Schema({
    tenantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    landlordId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    listingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Listing',
        required: true
    },
    description: {
        type: String,
        required: [true, 'Please add a description of the issue'],
        maxlength: [1000, 'Description cannot be more than 1000 characters']
    },
    images: [{
        type: String
    }],
    status: {
        type: String,
        enum: ['pending', 'in_progress', 'completed', 'cancelled'],
        default: 'pending'
    },
    // AI-Generated Fields
    category: {
        type: String,
        enum: ['Plumbing', 'Electrical', 'HVAC', 'Appliance', 'Structural', 'Other', 'General'],
        default: 'General'
    },
    urgency: {
        type: String,
        enum: ['High', 'Medium', 'Low'],
        default: 'Medium'
    },
    aiRecommendation: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Maintenance', maintenanceSchema);
