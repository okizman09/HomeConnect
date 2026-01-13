const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');
const path = require('path');
const pdf = require('pdf-parse');

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

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
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

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
            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();
            // Clean up markdown code blocks if present
            const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
            return JSON.parse(jsonStr);
        } catch (error) {
            console.error("Gemini Maintenance Error:", error);
            // Fallback
            return { category: "General", urgency: "Medium", recommended_action: "Contact landlord." };
        }
    },

    /**
     * Analyze a Lease Agreement PDF
     * @param {Buffer} fileBuffer - The PDF file buffer
     * @returns {Object} Extracted lease details
     */
    analyzeLeaseDocument: async (fileBuffer) => {
        try {
            const data = await pdf(fileBuffer);
            const textContent = data.text;

            // Truncate to avoid token limits if necessary (approx 30k chars is safe for simple models, Gemini Pro handles more)
            const truncatedText = textContent.substring(0, 30000);

            const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
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

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();
            const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
            return JSON.parse(jsonStr);

        } catch (error) {
            console.error("Gemini Lease Analysis Error:", error);
            throw new Error("Failed to analyze lease document.");
        }
    },

    /**
     * General Chat Assistant using Policy Documents
     * @param {string} userMessage - The user's question
     * @returns {string} The AI response
     */
    chatAssistant: async (userMessage) => {
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

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
            const result = await model.generateContent(prompt);
            const response = await result.response;
            return response.text();
        } catch (error) {
            console.error("Gemini Chat Error:", error);
            return "I'm having trouble connecting to the service right now. Please try again later.";
        }
    },

    /**
     * Validate a property image
     * @param {Buffer} fileBuffer - Image buffer
     * @param {string} mimeType - Image mime type
     * @returns {Object} { isValid: boolean, reason: string }
     */
    validatePropertyImage: async (fileBuffer, mimeType) => {
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

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
            const result = await model.generateContent([prompt, imagePart]);
            const response = await result.response;
            const text = response.text();
            const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
            const analysis = JSON.parse(jsonStr);

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
