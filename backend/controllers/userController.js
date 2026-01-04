const User = require('../models/User');

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (user) {
            user.name = req.body.name || user.name;
            user.phone = req.body.phone || user.phone;
            user.location = req.body.location || user.location;

            // Email and Role are intentionally not updatable here for security/logic reasons

            if (req.body.password) {
                user.password = req.body.password;
            }

            const updatedUser = await user.save();

            res.json({
                success: true,
                user: {
                    id: updatedUser._id,
                    name: updatedUser.name,
                    email: updatedUser.email,
                    role: updatedUser.role,
                    phone: updatedUser.phone,
                    location: updatedUser.location,
                    savedListings: updatedUser.savedListings
                }
            });
        } else {
            res.status(404).json({ success: false, message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Toggle saved listing
// @route   POST /api/users/saved
// @access  Private
exports.toggleSavedListing = async (req, res) => {
    try {
        const { listingId } = req.body;
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Check if listing is already saved
        const index = user.savedListings.indexOf(listingId);

        if (index === -1) {
            // Add to saved
            user.savedListings.push(listingId);
        } else {
            // Remove from saved
            user.savedListings.splice(index, 1);
        }

        await user.save();

        res.json({
            success: true,
            savedListings: user.savedListings
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get saved listings
// @route   GET /api/users/saved
// @access  Private
exports.getSavedListings = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate({
            path: 'savedListings',
            populate: { path: 'landlordId', select: 'name email phone' }
        });

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.json({
            success: true,
            savedListings: user.savedListings
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
