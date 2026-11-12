const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');
const path = require('path');
const { PDFParse } = require('pdf-parse');

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Models to try in order: primary alias first, then pinned fallbacks.
// Override with a comma-separated GEMINI_MODELS env var.
const GEMINI_MODELS = (process.env.GEMINI_MODELS
    ? process.env.GEMINI_MODELS.split(',').map(s => s.trim()).filter(Boolean)
    : ['gemini-flash-latest', 'gemini-flash-lite-latest']
);

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class AIServiceError extends Error {
    constructor(message) {
        super(message);
        this.name = 'AIServiceError';
        this.statusCode = 502;
    }
}

// Call generateContent with per-model retries and fallback across models.
// Retries transient failures (429/5xx, network errors); anything else throws.
// Each attempt is capped so a hung upstream call can never stall a request forever.
const ATTEMPT_TIMEOUT_MS = 25000;
const generateWithFallback = async (parts, { triesPerModel = 2 } = {}) => {
    let lastError;
    for (const name of GEMINI_MODELS) {
        for (let attempt = 1; attempt <= triesPerModel; attempt++) {
            try {
                const result = await genAI.getGenerativeModel({ model: name })
                    .generateContent(parts, { timeout: ATTEMPT_TIMEOUT_MS });
                const response = await result.response;
                return response.text();
            } catch (error) {
                lastError = error;
                const status = error && error.status;
                const retryable = status === 429 || (status >= 500 && status <= 599) || status === undefined;
                console.error(`Gemini ${name} attempt ${attempt} failed:`, (error && error.message) || error);
                if (!retryable) break;
                await sleep(1000 * attempt);
            }
        }
    }
    throw lastError;
};

const stripCodeFences = (text) => text.replace(/```json/g, '').replace(/```/g, '').trim();

const getPolicyContent = async (filename) => {
    try {
        const policyPath = path.join(__dirname, '../policies', filename);
        return fs.readFileSync(policyPath, 'utf8');
    } catch (error) {
        console.error(`Error reading policy ${filename}:`, error);
        return "";
    }
};

const aiService = {
    /**
     * Classify a maintenance request
     * @param {string} description - User's issue description
     * @returns {Object} { category, urgency, recommendedAction }
     */
    classifyMaintenance: async (description) => {
        const prompt = `
        You are an AI assistant for a property management platform.
        Analyze the following maintenance request and provide a structured classification.

        Request: "${description}"

        Return ONLY a JSON object with these keys:
        - "category": (e.g., Plumbing, Electrical, HVAC, Appliance, Structural, Other)
        - "urgency": (High, Medium, Low)
        - "recommended_action": (Immediate advice for the tenant)

        JSON:
        `;

        try {
            const text = await generateWithFallback(prompt);
            // Clean up markdown code blocks if present
            return JSON.parse(stripCodeFences(text));
        } catch (error) {
            console.error("Gemini Maintenance Error:", error);
            // Fallback so request creation survives AI outages
            return { category: "General", urgency: "Medium", recommended_action: "Contact landlord." };
        }
    },

    /**
     * Analyze a Lease Agreement PDF
     * @param {Buffer} fileBuffer - The PDF file buffer
     * @returns {Object} Extracted lease details
     */
    analyzeLeaseDocument: async (fileBuffer) => {
        let textContent;
        try {
            const parser = new PDFParse({ data: fileBuffer });
            try {
                const data = await parser.getText();
                textContent = data.text;
            } finally {
                await parser.destroy().catch(() => { });
            }
        } catch (error) {
            console.error("Lease PDF parse error:", error);
            const badPdf = new Error("Could not read text from the uploaded PDF. Please upload a valid, text-based PDF file.");
            badPdf.statusCode = 400;
            throw badPdf;
        }

        if (!textContent || !textContent.trim()) {
            const empty = new Error("The uploaded PDF contains no readable text.");
            empty.statusCode = 400;
            throw empty;
        }

        // Truncate to avoid token limits if necessary (approx 30k chars is safe for simple models, Gemini Pro handles more)
        const truncatedText = textContent.substring(0, 30000);

        const prompt = `
        Analyze the following text from a lease agreement.

        Text:
        """
        ${truncatedText}
        """

        Extract the following information in a valid JSON format:
        - "monthly_rent": (Amount per month)
        - "lease_duration": (Length of lease)
        - "security_deposit": (Amount)
        - "notice_period": (Time required to end lease)
        - "risky_clauses": (Array of strings summarizing any unusual or strict clauses)

        JSON:
        `;

        try {
            const text = await generateWithFallback(prompt);
            return JSON.parse(stripCodeFences(text));
        } catch (error) {
            console.error("Gemini Lease Analysis Error:", error);
            throw new AIServiceError("Lease analysis is temporarily unavailable. Please try again shortly.");
        }
    },

    /**
     * General Chat Assistant using Policy Documents
     * @param {string} userMessage - The user's question
     * @returns {string} The AI response
     */
    chatAssistant: async (userMessage) => {
        // Load context
        const handbook = await getPolicyContent('TenantHandbook.md');
        const faqs = await getPolicyContent('FAQs.md');

        const prompt = `
        You are a helpful AI Property Assistant for "HomeConnect".
        
        Instructions:
        1. Answer the user's question based on the Context below.
        2. Be extremely CONCISE and helpful. Avoid long paragraphs.
        3. Use Markdown formatting (bolding **text**, bullet points) to make the text readable.
        4. If the answer is not in the context, refer to general property management best practices clearly.
        
        Context:
        ${handbook}
        
        ${faqs}
        
        User Question: "${userMessage}"
        
        Answer:
        `;

        try {
            return await generateWithFallback(prompt);
        } catch (error) {
            console.error("Gemini Chat Error:", error);
            throw new AIServiceError("The AI assistant is temporarily unavailable. Please try again shortly.");
        }
    },

    /**
     * Validate a property image
     * @param {Buffer} fileBuffer - Image buffer
     * @param {string} mimeType - Image mime type
     * @returns {Object} { isValid: boolean, reason: string }
     */
    validatePropertyImage: async (fileBuffer, mimeType) => {
        const prompt = `
        Analyze this image. I need to verify if it is a suitable photo for a real estate listing.
        
        Check for two things:
        1. Content: Is this clearly a photo of a house, apartment, room, or building interior/exterior? (Acceptable: living room, kitchen, bedroom, bathroom, house exterior, building facade, yard).
        2. Quality: Is the image clear enough to be useful? (Reject if extremely blurry, too dark to see anything, or completely irrelevant like a selfie or random object).

        Return ONLY a JSON object:
        {
            "is_property": boolean,
            "is_good_quality": boolean,
            "reason": "Short explanation of why it was accepted or rejected"
        }
        `;

        const imagePart = {
            inlineData: {
                data: fileBuffer.toString("base64"),
                mimeType: mimeType,
            },
        };

        try {
            const text = await generateWithFallback([prompt, imagePart]);
            const analysis = JSON.parse(stripCodeFences(text));

            if (analysis.is_property && analysis.is_good_quality) {
                return { isValid: true };
            } else {
                return { isValid: false, reason: analysis.reason };
            }

        } catch (error) {
            console.error("Gemini Image Validation Error:", error);
            // Default to true in case of AI error so we don't block users unnecessarily, 
            // but log it. Or could default to false if strict security is needed.
            // For now, let's be lenient on API failures but strict on content if API works.
            return { isValid: true, reason: "AI validation skipped due to error" };
        }
    }
};

module.exports = aiService;
