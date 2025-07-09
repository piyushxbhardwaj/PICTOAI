# 🎨 PictoAI — AI-Powered Art Generation Platform

PictoAI is a full-stack web platform that empowers users to generate stunning AI art using Stable Diffusion. With a seamless and responsive UI, powerful image rendering backend, and efficient cloud integration, PictoAI transforms creative imagination into visual reality.



## 📸 Key Features
- 🧠 **AI Art Generation** with Stable Diffusion
- 🔤 **Text-to-Image** prompts with real-time previews
- 🔁 Regenerate, download, and save artwork
- 💾 **User Authentication** (login/signup)
- 🎨 Clean & responsive **React.js** frontend
- 🔧 **Node.js + Flask** backend architecture
- 📦 REST API support for prompt handling & image generation
- ☁️ Cloud storage support (optional)

---

## 🛠️ Tech Stack

### Frontend
- React.js (with Hooks)
- TailwindCSS
- Axios for API handling

### Backend
- Node.js (Express) – API Gateway & user management
- Python (Flask) – AI model handler
- Stable Diffusion (via HuggingFace or Local Pipeline)
- MongoDB (or Firebase) – for user data & image storage

---

## 📂 Project Structure

```bash
pictoai/
│
├── client/           # React frontend
│   ├── public/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── services/ # Axios API
│       └── App.jsx
│
├── server/           # Node.js backend
│   ├── routes/
│   ├── controllers/
│   └── index.js
│
├── ai-engine/        # Flask + Stable Diffusion
│   ├── app.py
│   ├── inference.py
│   └── requirements.txt
│
└── README.md
