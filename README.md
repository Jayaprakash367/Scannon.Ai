# SCANNON.AI

<div align="center">
  <h1>🎥 Scannon.AI - AI-Powered Video Privacy Protection</h1>
  <p>Automatically blur faces and sensitive information in your videos with cutting-edge AI technology</p>
  
  [![FastAPI](https://img.shields.io/badge/FastAPI-0.104.1-009688?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
  [![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
  [![Vite](https://img.shields.io/badge/Vite-5.0.8-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev/)
  [![TailwindCSS](https://img.shields.io/badge/Tailwind-3.3.6-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
</div>

---

## 🌟 Features

- **⚡ Lightning Fast Processing** - Process videos in seconds with optimized AI engine
- **� Real-Time Blurring** - Live face and document blurring from your webcam
- **🔒 Privacy First** - End-to-end encryption and secure processing
- **🎯 High Accuracy** - 95%+ face detection accuracy using MediaPipe AI
- **🤖 AI-Powered Detection** - YOLOv8 + MediaPipe + EasyOCR for comprehensive privacy
- **🎨 Modern UI** - Beautiful, responsive interface built with React and Tailwind CSS
- **🚀 Real-time Updates** - See processing progress in real-time
- **📱 Responsive Design** - Works seamlessly on desktop, tablet, and mobile

## 🏗️ Project Structure

```
SCANNON.AI/
├── backend/                    # Python FastAPI Backend
│   ├── main.py                # Main application file with API endpoints
│   ├── requirements.txt       # Python dependencies
│   ├── uploads/               # Uploaded videos (auto-created)
│   └── processed/             # Processed videos (auto-created)
├── frontend/                  # React Frontend
│   ├── src/
│   │   ├── components/       # Reusable React components
│   │   │   ├── Hero.jsx
│   │   │   ├── Features.jsx
│   │   │   ├── UploadCard.jsx
│   │   │   └── VideoPrivacyAnimation.jsx
│   │   ├── pages/           # Page components
│   │   │   ├── Home.jsx
│   │   │   ├── Upload.jsx
│   │   │   ├── About.jsx
│   │   │   └── StartingPage.jsx
│   │   ├── App.jsx          # Main app component with routing
│   │   ├── main.jsx         # React entry point
│   │   └── index.css        # Global styles with Tailwind
│   ├── public/              # Static assets
│   ├── package.json         # Node dependencies
│   ├── vite.config.js       # Vite configuration
│   ├── tailwind.config.js   # Tailwind configuration
│   └── postcss.config.js    # PostCSS configuration
├── manager.py               # Project management script
├── README.md               # This file
└── TODO.md                 # Development tasks
```

## 🚀 Quick Start

### Prerequisites

- **Python 3.8+** installed
- **Node.js 16+** and npm installed
- **Git** installed

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/scannon-ai.git
   cd scannon-ai
   ```

2. **Set up the project using the manager script**
   ```bash
   python manager.py setup
   ```

   Or set up manually:

   **Backend Setup:**
   ```bash
   cd backend
   python -m venv venv
   
   # On Windows
   venv\Scripts\activate
   
   # On macOS/Linux
   source venv/bin/activate
   
   pip install -r requirements.txt
   ```

   **Frontend Setup:**
   ```bash
   cd frontend
   npm install
   ```

### Running the Application

#### Option 1: Using Manager Script

**Start Backend:**
```bash
python manager.py start-backend
```

**Start Frontend (in a new terminal):**
```bash
python manager.py start-frontend
```

#### Option 2: Manual Start

**Start Backend:**
```bash
cd backend
# Activate virtual environment first
python main.py
```
Backend will be available at: `http://localhost:8000`

**Start Frontend:**
```bash
cd frontend
npm run dev
```
Frontend will be available at: `http://localhost:5173`

## 🎯 Usage

### 📹 Upload Mode (Video/Image Processing)
1. **Visit** `http://localhost:5174` in your browser
2. **Navigate** to the Upload page
3. **Drag & drop** or select a video/image file
4. **Click** "Process" to start AI processing
5. **Download** your privacy-protected file when complete

### 🔴 Real-Time Mode (Live Webcam)
1. **Navigate** to the Real-Time page
2. **Click** "Start Stream" to access your webcam
3. **Grant** camera permissions when prompted
4. **Watch** as faces and documents are blurred live!
5. **Click** "Stop Stream" when done

**What Gets Blurred:**
- ✅ **Faces** - Any human face (MediaPipe AI - 95%+ accuracy)
- ✅ **Documents** - Certificates, IDs, papers (shape + text detection)
- ✅ **License Plates** - Car number plates (edge detection)
- ✅ **Screens** - Phones, laptops, monitors (YOLOv8)
- ✅ **Sensitive Text** - Phone numbers, emails, SSN (EasyOCR)

## 🛠️ Technology Stack

### Backend
- **FastAPI** - Modern, fast Python web framework
- **OpenCV** - Computer vision and video processing
- **NumPy** - Numerical computing
- **Uvicorn** - ASGI server

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Lucide React** - Icon library

## 📚 API Documentation

Once the backend is running, visit `http://localhost:8000/docs` for interactive API documentation.

### Main Endpoints

- `POST /api/upload` - Upload and process video/image
- `GET /api/status/{filename}` - Check processing status
- `GET /api/download/{filename}` - Download processed file
- `DELETE /api/cleanup` - Clean up old files
- `WS /ws/realtime` - WebSocket for real-time video streaming

## 🔧 Development

### Project Management Commands

```bash
# Setup entire project
python manager.py setup

# Setup backend only
python manager.py setup-backend

# Setup frontend only
python manager.py setup-frontend

# Start backend server
python manager.py start-backend

# Start frontend dev server
python manager.py start-frontend

# Build frontend for production
python manager.py build

# Check project status
python manager.py status
```

### Building for Production

```bash
# Build frontend
cd frontend
npm run build

# The built files will be in frontend/dist/
```

## 🎨 Design System

### Color Palette
- **Primary Cyan:** `#06b6d4`
- **Primary Blue:** `#3b82f6`
- **Primary Purple:** `#8b5cf6`
- **Background Dark:** `#0f172a`
- **Background Blue:** `#1e3a8a`

### Typography
- Font Family: Inter (Google Fonts)
- Weights: 300-900

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Authors

- **Your Name** - *Initial work* - [YourGitHub](https://github.com/jayaprakash367)

## 🙏 Acknowledgments

- OpenCV for computer vision capabilities
- FastAPI for the amazing Python framework
- React team for the excellent UI library
- Tailwind CSS for the utility-first CSS framework

## 📧 Contact

Project Link: [https://github.com/Jayaprakash367/Scannon.Ai](https://github.com/Jayaprakash367/Scannon.Ai)

---

<div align="center">
  <p>Made with ❤️ by the Scannon.AI team</p>
  <p>⭐ Star us on GitHub if you like this project!</p>
</div>