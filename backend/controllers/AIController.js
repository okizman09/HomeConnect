const aiService = require('../services/aiService');
const fs = require('fs');

// @desc    Analyze a lease agreement
// @route   POST /api/ai/analyze-lease
// @access  Private
exports.analyzeLease = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'Please upload a PDF file' });
        }

        // Read file buffer
        const fileBuffer = req.file.buffer;

        // Analyze using AI
        const analysis = await aiService.analyzeLeaseDocument(fileBuffer);

        res.status(200).json({
            success: true,
            data: analysis
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Analysis failed: ' + error.message });
    }
};

// @desc    Chat with AI Assistant
// @route   POST /api/ai/chat
// @access  Private
exports.chat = async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) {
            return res.status(400).json({ success: false, message: 'Message is required' });
        }

        const response = await aiService.chatAssistant(message);

        res.status(200).json({
            success: true,
            data: {
                response
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
