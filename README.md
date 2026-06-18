# 🎨 PictoAI — AI-Powered Art Generation Platform

PictoAI is a modern full-stack web application that empowers users to synthesize premium digital art from text prompts using Stable Diffusion. The platform features an interactive futuristic UI workbench, robust fallback AI routing pipelines, and secure user management.

---

## 📸 Key Features

- 🧠 **Multi-Tiered Art Generation**:
  - **Local CUDA pipeline** (via Hugging Face Diffusers) for high-performance GPU execution.
  - **Hugging Face Inference API** (with `HF_TOKEN`) as a fast cloud GPU fallback.
  - **Clipdrop text-to-image API** as a highly reliable secondary backup.
  - **Premium offline placeholder generator** (geometric canvas drawer) in case of complete network isolation.
- 🔤 **Text-to-Image Parameters**: Supports custom styles (e.g. Cyberpunk, Anime), aspect ratios (1:1, 16:9, 9:16), and prompt guidance strength.
- 🔁 **Response Caching**: Computes MD5 prompt/style hashes and checks MongoDB to serve cached art instantly, saving credits and GPU cycles.
- 💾 **User authentication**: Secure JWT authentication (login, registration) and credits tracking.
- 🎨 **Futuristic visualizer UI**: Futuristic neon interface with smooth animations, Web Audio API sound effects, and persistent history drawers that survive page reloads.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React.js (Vite)
- **Styling**: CSS Custom Properties (HSL/Cyberpunk theme) + Lucide Icons
- **HTTP client**: Axios
- **State**: React Context (AppContext)

### Backend
- **Framework**: Python (Flask)
- **Database**: MongoDB (via PyMongo)
- **Authentication**: Flask-JWT-Extended
- **Image handling**: Pillow (PIL) for byte verification and formatting

---

## 📂 Project Structure

```bash
pictoai/
│
├── client/                 # React frontend (Vite)
│   ├── public/             # Static icons and assets
│   └── src/
│       ├── components/     # UI components (Workspace, Navbar, AuthModal)
│       ├── context/        # React Context (AppContext, useApp)
│       ├── App.jsx         # App router wrapper
│       └── index.css       # Core HSL styling system
│
├── server/                 # Python Flask backend
│   ├── config/             # Database (db.py) and AI model settings (model.py)
│   ├── controllers/        # Auth & image generation endpoints
│   ├── routes/             # Blueprints (auth, image, health)
│   ├── static/generated/   # Directory for saved PNG output images
│   ├── app.py              # Main Flask entrypoint
│   ├── requirements.txt    # Python dependencies list
│   └── test_endpoints.py   # Test execution suite
│
└── README.md
```

---

## ⚙️ Local Setup Instructions

### Prerequisites
- Node.js (v18+)
- Python (3.9+)
- MongoDB (running locally on `mongodb://localhost:27017`)

### 1. Backend Configuration
1. Navigate to the `server/` directory.
2. Create or open the `server/.env` file and configure the keys:
   ```env
   MONGODB_URI="mongodb://localhost:27017"
   JWT_SECRET="your-jwt-secret-key-32-plus-chars"
   CLIPDROP_API="your-clipdrop-api-key"
   HF_TOKEN="your-huggingface-inference-token"
   ```
3. Set up a Python virtual environment:
   ```bash
   python -m venv venv
   ./venv/Scripts/activate      # Windows Powershell/CMD
   # source venv/bin/activate   # Unix/MacOS
   ```
4. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
5. Run the server in unbuffered mode:
   ```bash
   python -u app.py
   ```
   The backend will boot on `http://localhost:3000`.

### 2. Frontend Configuration
1. Navigate to the `client/` directory.
2. Install Node packages:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
   The client will open on `http://localhost:5173/` (or `http://localhost:5174/` if 5173 is occupied).

---

## 🧪 Running API Tests

We have included a test suite inside `server/test_endpoints.py` that validates the registration, login, credits, and image generation routing.

With the Flask backend running, execute:
```bash
python server/test_endpoints.py
```
Outputs will trace the response JSON structure and confirm successful generation.
