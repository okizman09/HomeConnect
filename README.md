# Landlord-Tenant Connection Platform

A modern digital platform that efficiently connects Landlords posting vacant properties with Tenants searching for them, facilitated by in-app chat and AI-powered tools. Built with the MERN stack (MongoDB, Express.js, React, Node.js).

## 📋 Project Overview

**Project Name:** Landlord-Tenant Connection Platform (MVP V3)
**Status:** Minimum Viable Product (MVP) - Ready for Deployment
**Document Version:** 3.2
**Last Updated:** November 12, 2026

### 🎯 Product Goals
To launch a functional digital platform that increases market transparency, improves access to adequate/affordable housing, and ensures trust through AI verification.

### 🌍 Sustainable Development Goal Alignment
**SDG 11 (Target 11.1):** Contributes to access to adequate and affordable housing by increasing market transparency and reducing information asymmetry in the housing market.

---

## 👤 Project Lead

| Name | Role | Responsibilities |
|------|------|------------------|
| **Daud Abdulrahman Okikiola** | **Project Lead & AI Software Developer** | • **Core Development:** Full-stack architecture, API design, and Database management.<br>• **AI Integration:** Implementation of Google Gemini features (**Chatbot**, **Image Verification**, **Maintenance Classifier**, **Lease Document Analyzer**).<br>• **Deployment:** Server management and CI/CD pipelines.<br>• **Technical Strategy:** Choosing the tech stack and roadmap execution.<br>• **Quality Assurance:** Testing features, identifying bugs, and ensuring UI consistency.<br>• **Documentation:** Maintaining PRDs, user guides, and compliance documents. |

---

## ✨ Features

### 1. User Experience & Profiles
- **Role-Based Dashboards:** Custom interfaces for Landlords (manage listings) and Tenants (browse & save).
- **Profile Management:** Update personal details and upload **Profile Pictures** (new feature).
- **Secure Authentication:** JWT-based login with hashed passwords.

### 2. Property Management
- **Create Listings:** Landlords can post properties with details (Price, Location, Type).
- **Image Uploads:** Drag-and-drop secure image uploading to Cloudinary.
- **Search & Filter:** Tenants can filter homes by price range, location, and property type.

### 3. Communication
- **Real-Time Chat:** Instant messaging between landlords and tenants using Socket.io.
- **Email Notifications:** Alerts for new messages (via Resend).

### 4. 🧠 AI-Powered Features (Powered by Google Gemini)

| Feature | Description |
|---------|-------------|
| **AI Property Verification** | When a landlord uploads images, the AI analyzes them to reject selfies/blur and verify it's a house. |
| **Smart Chat Assistant** | A 24/7 AI chatbot that answers tenant questions based on the Tenant Handbook using Markdown formatting. |
| **Maintenance AI** | Auto-classifies maintenance requests by urgency (High/Medium/Low) and category to help landlords prioritize. |
| **Lease Analyzer** | Extracts key terms and potential risks from uploaded lease PDF documents. |

---

## 🔮 Future Roadmap

### Phase 2: Trust & Transactions (Next Steps)
- **Identity Verification:** Integration with NIN/BVN APIs.
- **Secure Payments:** In-app rent collection via Paystack/Flutterwave.
- **Dispute Resolution:** Admin panel for handling reported users.

### Phase 3: Advanced Ecosystem
- **Virtual Tours:** 360-degree property views.
- **Service Marketplace:** Connect with vetted handymen and cleaners.
- **Mobile Application:** Native iOS and Android apps.

### Phase 4: Big Data & Analytics
- **Market Insights:** AI-driven rent price prediction based on location data.
- **Landlord Scoring:** Reputation systems based on tenant reviews and responsiveness.

---

## 🛠️ Technical Stack

### Frontend
- **Framework:** React 18 + Vite
- **Styling:** Tailwind CSS (Custom "Violet" Theme + Glassmorphism)
- **State:** Context API
- **Icons:** Lucide React

### Backend
- **Runtime:** Node.js + Express.js
- **Database:** MongoDB
- **AI Engine:** Google Generative AI (Gemini 1.5 Flash)
- **Storage:** Cloudinary
- **Real-time:** Socket.io

---

## 🚀 Getting Started

### 1. Backend Setup
```bash
cd backend
npm install
# Configure .env with GEMINI_API_KEY, CLOUDINARY_*, MONGODB_URI
npm run dev
```

### 2. Frontend Setup
```bash
cd Frontend
npm install
npm run dev
```

---

## 💬 Contact
- **Project Lead:** Daud Abdulrahman Okikiola
