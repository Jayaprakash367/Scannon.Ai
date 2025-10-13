# SCANNON.AI - Video Privacy Protection

A modern React-based web application for AI-powered video privacy protection using face detection and blurring technology.

## 🚀 Features

- **AI-Powered Face Detection**: Advanced computer vision to detect and protect faces in videos
- **Real-time Processing**: Upload and process videos with live progress tracking
- **Modern UI/UX**: Beautiful dark theme with smooth animations
- **Global AI Assistant**: Interactive AI help available across all pages
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Framer Motion
- **Backend**: Python FastAPI, OpenCV
- **Deployment**: Vercel (Frontend), Backend deployment needed

## 📦 Installation

1. Clone the repository:

```bash
git clone https://github.com/Jayaprakash367/Scannon.Ai.git
cd Scannon.Ai/frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Update the `.env` file with your backend URL:
```env
VITE_API_URL=your_backend_url_here
```

5. Start development server:
```bash
npm run dev
```

## 🚀 Deployment

### Frontend Deployment (Vercel or Netlify)

#### Option 1: Vercel Deployment

1. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Vercel will automatically detect the React app

2. **Build Settings**:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

3. **Environment Variables**:
   - In Vercel dashboard, go to your project settings → Environment Variables
   - Add environment variable: `VITE_API_URL`
   - Set it to your deployed backend URL (e.g., `https://your-backend.herokuapp.com`)

4. **Deploy**:
   - Push to main branch or deploy manually
   - Vercel will build and deploy automatically

#### Option 2: Netlify Deployment

1. **Connect to Netlify**:
   - Go to [netlify.com](https://netlify.com)
   - Import your GitHub repository

2. **Build Settings**:
   - Build Command: `npm run build`
   - Publish Directory: `dist`
   - Base Directory: (leave empty or set to `frontend` if in monorepo)

3. **Environment Variables**:
   - In Netlify dashboard, go to Site settings → Build & deploy → Environment
   - Add environment variable: `VITE_API_URL`
   - Set it to your deployed backend URL

4. **Deploy**:
   - The `netlify.toml` and `_redirects` files are already configured
   - Push to main branch to deploy

### Backend Deployment

The backend needs to be deployed separately. Recommended platforms:

#### Railway (Recommended)
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

#### Render
1. Go to [render.com](https://render.com)
2. Create a new Web Service
3. Connect your repository
4. Set build command: `pip install -r requirements.txt`
5. Set start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`

#### Heroku
```bash
# Create Heroku app
heroku create your-app-name

# Deploy
git push heroku main
```

Make sure to update the `VITE_API_URL` environment variable in your frontend deployment with your backend's deployed URL.

## 🔧 Configuration

### Environment Variables

- `VITE_API_URL`: Backend API URL (defaults to `http://localhost:8000` for development)

### Build Commands

```bash
# Development
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## 📁 Project Structure

```
frontend/
├── public/                 # Static assets
├── src/
│   ├── components/         # Reusable components
│   │   ├── AIAssistantButton.jsx
│   │   ├── UploadCard.jsx
│   │   └── ...
│   ├── pages/              # Page components
│   │   ├── Home.jsx
│   │   ├── Upload.jsx
│   │   ├── About.jsx
│   │   └── StartingPage.jsx
│   ├── App.jsx             # Main app component
│   └── main.jsx            # App entry point
├── vercel.json             # Vercel deployment config
├── .env                    # Environment variables
└── package.json
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Troubleshooting

### Common Deployment Issues

1. **"Site not found" or 404 errors on Netlify/Vercel**:
   - ✅ Fixed: `netlify.toml`, `_redirects`, and `vercel.json` are configured
   - The issue was caused by React Router client-side routing not being handled by the server
   - These files tell the server to always serve `index.html` for any route

2. **API calls failing in production**:
   - Make sure `VITE_API_URL` is set correctly in Vercel/Netlify
   - Ensure your backend is deployed and accessible
   - Check CORS settings on your backend

3. **Build failing on Vercel/Netlify**:
   - Check that all dependencies are in `package.json`
   - Verify Node.js version compatibility
   - Ensure build command is `npm run build`
   - Ensure output directory is `dist`

4. **Environment variables not working**:
   - Vercel/Netlify environment variables MUST start with `VITE_` for client-side access
   - Redeploy after adding environment variables
   - Clear cache and redeploy if variables still don't work

5. **Blank page after deployment**:
   - Check browser console for errors
   - Verify that `base: '/'` is set in `vite.config.js`
   - Ensure all assets are loading correctly

6. **Routes not working (404 on refresh)**:
   - ✅ Fixed: Rewrite rules are configured in `vercel.json` and `netlify.toml`
   - The `_redirects` file in the public folder handles client-side routing

### Platform-Specific Issues

#### Vercel
- Error: `FUNCTION_INVOCATION_TIMEOUT` → Backend is taking too long
- Solution: Optimize backend processing or increase timeout limits

#### Netlify
- Error: `Site not found` → Routing not configured
- Solution: ✅ Already fixed with `netlify.toml` and `_redirects`

### Getting Help

If you encounter issues:
1. Check the browser console for errors
2. Verify your environment variables are set correctly
3. Ensure the backend is running and accessible
4. Check Vercel/Netlify deployment logs
5. Test locally first: `npm run build && npm run preview`