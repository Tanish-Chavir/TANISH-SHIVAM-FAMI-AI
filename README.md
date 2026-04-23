# 🌾 Farm AI & B2B Marketplace

A premium, all-in-one agricultural platform for Indian farmers. This project combines an AI-powered farming assistant with a direct-to-enterprise marketplace, enabling farmers to optimize their yields and sell directly to verified companies.

## 🚀 Key Features

- **Direct B2B Marketplace**: Sell crops directly to companies like AgroCorp and EcoHarvest.
- **AI Farm Assistant**: Get expert advice on pest control, fertilizers, and irrigation.
- **Crop Disease Scanner**: Upload images of crops for instant AI-powered diagnosis.
- **Market Discovery**: Find nearby Mandis and track live crop prices (MSP) across India.
- **Location-Aware Weather**: Real-time weather updates based on your coordinates.

## 🛠️ Technology Stack

- **Frontend**: React, Tailwind CSS, Framer Motion, Vanilla JS, Leaflet.js (Maps).
- **Backend**: Node.js (Express), MongoDB (Mongoose), Google Gemini AI API.
- **Styling**: Premium Glassmorphism UI with dark/light mode support.

## 📦 Project Structure

```text
├── server/             # Unified Express Backend
│   ├── models/         # MongoDB Schemas (Company, Request)
│   └── server.js       # Main server logic & APIs
├── frontend/           # Marketplace Source (React)
│   └── src/            # Components, Hooks, Assets
├── marketplace/        # Built Marketplace static files (embedded)
├── index.html          # Main application entry (Vanilla JS)
├── app.js              # Original application logic
└── styles.css          # Main stylesheet
```

## 🚥 Getting Started

### 1. Prerequisites
- Node.js (v18+)
- MongoDB (Running locally or via Atlas)
- Google Gemini API Key (Optional, for AI features)

### 2. Installation
```bash
git clone https://github.com/Tanish-Chavir/FOXES.git
cd FOXES/server
npm install
```

### 3. Running the App
```bash
npm start
```
The application will be available at `http://localhost:3000`.

## 🤝 How to Collaborate

We welcome contributions from the community! To collaborate on this project:

1. **Fork the Repository**: Create your own copy of the project.
2. **Create a Branch**: `git checkout -b feature/AmazingFeature`.
3. **Make Changes**: Implement your feature or fix.
4. **Commit Changes**: `git commit -m 'Add some AmazingFeature'`.
5. **Push to Branch**: `git push origin feature/AmazingFeature`.
6. **Open a Pull Request**: Submit your changes for review.

### 👥 Inviting Collaborators
If you are the owner of this repository, you can invite specific people to collaborate:
1. Go to your repository on GitHub.
2. Click on **Settings** -> **Collaborators**.
3. Click **Add people** and enter their username or email.

## 📄 License
Distributed under the MIT License. See `LICENSE` for more information.

---
Built with ❤️ for Indian Farmers.
