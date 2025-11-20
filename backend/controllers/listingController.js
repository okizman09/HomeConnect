const Listing = require('../models/Listing');

// @desc    Create new listing
// @route   POST /api/listings
// @access  Private (Landlord only)
exports.createListing = async (req, res) => {
  try {
    const { title, description, location, price, propertyType, occupancyLimit, images } = req.body;

    // Add landlordId from authenticated user
    const listing = await Listing.create({
      landlordId: req.user.id,
      title,
      description,
      location,
      price,
      propertyType,
      occupancyLimit,
      images
    });

    res.status(201).json({
      success: true,
      listing
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error creating listing'
    });
  }
};

// @desc    Get all listings
// @route   GET /api/listings
// @access  Public
exports.getListings = async (req, res) => {
  try {
    const listings = await Listing.find().populate('landlordId', 'name email phone');

    res.status(200).json({
      success: true,
      count: listings.length,
      listings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching listings'
    });
  }
};

// @desc    Get single listing
// @route   GET /api/listings/:id
// @access  Public
exports.getListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id).populate('landlordId', 'name email phone');

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found'
      });
    }

    res.status(200).json({
      success: true,
      listing
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching listing'
    });
  }
};

// @desc    Search listings
// @route   GET /api/listings/search
// @access  Public
exports.searchListings = async (req, res) => {
  try {
    const { location, propertyType, minPrice, maxPrice } = req.query;

    let query = {};

    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    if (propertyType) {
      query.propertyType = propertyType;
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const listings = await Listing.find(query).populate('landlordId', 'name email phone');

    res.status(200).json({
      success: true,
      count: listings.length,
      listings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error searching listings'
    });
  }
};

// @desc    Update listing
// @route   PUT /api/listings/:id
// @access  Private (Landlord only - own listings)
exports.updateListing = async (req, res) => {
  try {
    let listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found'
      });
    }

    // Make sure user is listing owner
    if (listing.landlordId.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this listing'
      });
    }

    listing = await Listing.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      listing
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating listing'
    });
  }
};

// @desc    Delete listing
// @route   DELETE /api/listings/:id
// @access  Private (Landlord only - own listings)
exports.deleteListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found'
      });
    }

    // Make sure user is listing owner
    if (listing.landlordId.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to delete this listing'
      });
    }

    await listing.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Listing deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting listing'
    });
  }
};
