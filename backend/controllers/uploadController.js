const cloudinary = require('../utils/cloudinary');
const aiService = require('../services/aiService');

// @desc    Upload images to Cloudinary
// @route   POST /api/upload
// @access  Private
exports.uploadImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please upload at least one image'
      });
    }

    // AI Content Verification
    for (const file of req.files) {
      console.log(`Analyzing image: ${file.originalname}`);
      const validation = await aiService.validatePropertyImage(file.buffer, file.mimetype);
      console.log(`AI Validation Result:`, validation);
      if (!validation.isValid) {
        return res.status(400).json({
          success: false,
          message: `Image rejected by AI: ${validation.reason || 'Image does not appear to be a valid property photo.'}`
        });
      }
    }

    const uploadPromises = req.files.map(file => {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: 'homeconnect/listings',
            resource_type: 'image'
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result.secure_url);
          }
        );
        uploadStream.end(file.buffer);
      });
    });

    const imageUrls = await Promise.all(uploadPromises);

    res.status(200).json({
      success: true,
      urls: imageUrls
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error uploading images'
    });
  }
};

// @desc    Upload profile image to Cloudinary
// @route   POST /api/upload/profile
// @access  Private
exports.uploadProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload an image'
      });
    }

    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'homeconnect/profiles',
          resource_type: 'image'
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(req.file.buffer);
    });

    res.status(200).json({
      success: true,
      url: result.secure_url
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error uploading profile image'
    });
  }
};
