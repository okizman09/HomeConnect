const express = require('express');
const { createMaintenanceRequest, getMaintenanceRequests } = require('../controllers/MaintenanceController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.route('/')
    .get(getMaintenanceRequests)
    .post(createMaintenanceRequest);

module.exports = router;
