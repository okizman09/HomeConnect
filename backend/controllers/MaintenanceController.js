const Maintenance = require('../models/Maintenance');
const Listing = require('../models/Listing');
const aiService = require('../services/aiService');

// @desc    Create a maintenance request
// @route   POST /api/maintenance
// @access  Private (Tenant)
exports.createMaintenanceRequest = async (req, res) => {
    try {
        const { listingId, description, images } = req.body;

        if (!listingId) {
            return res.status(400).json({ success: false, message: 'listingId is required' });
        }
        if (!description || !String(description).trim()) {
            return res.status(400).json({ success: false, message: 'description is required' });
        }

        // Verify listing and get landlord ID
        const listing = await Listing.findById(listingId);
        if (!listing) {
            return res.status(404).json({ success: false, message: 'Listing not found' });
        }

        // AI Classification
        const aiResult = await aiService.classifyMaintenance(description);

        const maintenance = await Maintenance.create({
            tenantId: req.user.id,
            landlordId: listing.landlordId,
            listingId,
            description,
            images,
            category: aiResult.category,
            urgency: aiResult.urgency,
            aiRecommendation: aiResult.recommended_action
        });

        res.status(201).json({
            success: true,
            data: maintenance
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get requests for current user (Tenant: own requests, Landlord: requests for their properties)
// @route   GET /api/maintenance
// @access  Private
exports.getMaintenanceRequests = async (req, res) => {
    try {
        let query;
        if (req.user.role === 'landlord') {
            query = { landlordId: req.user.id };
        } else {
            query = { tenantId: req.user.id };
        }

        const requests = await Maintenance.find(query)
            .populate('listingId', 'title location')
            .populate('tenantId', 'name email phone')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: requests.length,
            data: requests
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
