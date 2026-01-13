const express = require('express');
const { analyzeLease, chat } = require('../controllers/AIController');
const { protect } = require('../middleware/auth');
const multer = require('multer');

const router = express.Router();

// Memory storage for file uploads
const memoryStorage = multer.memoryStorage();
const upload = multer({
    storage: memoryStorage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Only PDF files are allowed'), false);
        }
    }
});

router.use(protect);

router.post('/analyze-lease', upload.single('lease'), analyzeLease);
router.post('/chat', chat);

module.exports = router;
