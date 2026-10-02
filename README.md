# 🚀 SnapLearn

**SnapLearn** is an AI-powered educational application built for fast, interactive learning. Simply snap a photo of any study material (like a textbook page, notes, or a diagram), and our AI will instantly generate a personalized study guide, complete with an interactive quiz, explanations, and an audio tutor!

Built for the hackathon using **React**, **Tailwind CSS**, and **AWS Bedrock**.

---

## ✨ Features

- 📸 **Smart Image Analysis:** Upload or capture an image of any study material.
- 🎚️ **Adaptive Difficulty:** Choose your learning level (Child 🧒, Standard 📚, or Advanced 🎓). The AI adjusts the complexity of the summary and quiz accordingly.
- 🧠 **Interactive Quizzes:** Test your knowledge instantly with auto-generated multiple-choice questions, featuring real-time feedback and detailed explanations.
- 🎧 **Audio Tutor:** Listen to your generated study guides with an integrated AI voice player (complete with visual equalizer animations).
- 💾 **Session History:** Your previous study guides and quiz answers are automatically saved to your local storage. Access past sessions via the sleek slide-out history drawer.
- 🎨 **Glassmorphism UI:** A highly polished, responsive dark-mode interface with beautiful gradients, pulse animations, and interactive elements.

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 18 + Vite
- **Styling:** Tailwind CSS v4
- **Icons:** Heroicons
- **Deployment:** AWS Amplify

### Backend / Infrastructure (AWS)
- **AI Model:** AWS Bedrock (Claude 3)
- **API:** AWS API Gateway + AWS Lambda
- **Storage/Persistence:** LocalStorage (Frontend)

---

## 📁 Project Structure

```text
frontend/
├── amplify.yml             # AWS Amplify CI/CD configuration
├── package.json            # Project dependencies and scripts
├── public/                 # Static assets (Favicon, etc.)
└── src/
    ├── App.jsx             # Main application logic & UI components
    ├── index.css           # Global Tailwind CSS & Custom Keyframes
    └── main.jsx            # React entry point
```

---

## 💻 Getting Started (Local Development)

### 1. Clone & Install Dependencies
Navigate into the `frontend` directory and install the required NPM packages.

```bash
cd frontend
npm install
```

### 2. Configure Environment Variables
Copy the example environment file and add your AWS API Gateway URL.

```bash
cp .env.example .env
```
Open `.env` and set your API endpoint:
```env
VITE_API_URL=https://your-api-gateway-url.amazonaws.com/analyze
```

### 3. Run the Development Server
Start the local Vite server with Hot Module Replacement (HMR).

```bash
npm run dev
```
The app will be available at `http://localhost:5173`.

---

## ☁️ AWS Deployment (Amplify)

This project is fully configured for seamless deployment on **AWS Amplify**.

### Option A: Continuous Deployment (Git-based - Recommended)
1. Push this repository to your Git provider (GitHub, GitLab, or Bitbucket).
2. Open the **AWS Amplify Console**.
3. Choose **Create App** and connect your Git repository.
4. Select your branch. Amplify will automatically detect the `amplify.yml` build spec.
5. **IMPORTANT:** Under "Advanced Settings" in the Amplify console, add an environment variable:
   - **Key:** `VITE_API_URL`
   - **Value:** `https://your-api-gateway-url.amazonaws.com/analyze`
6. Click **Save and deploy**. 
   *(Note: Client-side SPA routing and security headers are automatically handled by the provided `amplify.yml`!)*

### Option B: Manual Drag-and-Drop Deployment
1. Build the production application locally:
   ```bash
   npm run build
   ```
2. Compress the contents of the `dist/` folder into a `.zip` file.
3. Open the **AWS Amplify Console**.
4. Select **Deploy without Git provider**.
5. Drag and drop your `.zip` file.
6. **Set up Routing:** Go to "Rewrites and redirects" in the Amplify console and add the following rule for the SPA to work properly:
   - **Source:** `</^[^.]+$|\.(?!(css|gif|ico|jpg|jpeg|js|png|txt|svg|woff|woff2|ttf|map|json|webp|mp3|wav|ogg)$)([^.]+$)/>`
   - **Target:** `/index.html`
   - **Type:** `200 (Rewrite)`
