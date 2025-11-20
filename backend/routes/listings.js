const express = require('express');
const {
  createListing,
  getListings,
  getListing,
  searchListings,
  updateListing,
  deleteListing
} = require('../controllers/listingController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.route('/')
  .get(getListings)
  .post(protect, authorize('landlord'), createListing);

router.get('/search', searchListings);

router.route('/:id')
  .get(getListing)
  .put(protect, authorize('landlord'), updateListing)
  .delete(protect, authorize('landlord'), deleteListing);

module.exports = router;
