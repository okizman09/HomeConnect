const express = require('express');
const {
    updateProfile,
    toggleSavedListing,
    getSavedListings
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.put('/profile', updateProfile);
router.post('/saved', toggleSavedListing);
router.get('/saved', getSavedListings);

module.exports = router;
