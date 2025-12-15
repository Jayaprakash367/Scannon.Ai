import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Shield, MessageCircle, Send } from 'lucide-react';
import { useState } from 'react';

// Pages
import StartingPage from './pages/StartingPage';
import Home from './pages/Home';
import Upload from './pages/Upload';
import About from './pages/About';
import RealTime from './pages/RealTime';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-900">
        <Navigation />
        <AIAssistantButton />
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<StartingPage />} />
            <Route path="/home" element={<Home />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/realtime" element={<RealTime />} />
            <Route path="/about" element={<About />} />
            {/* Catch all route - redirect to home */}
            <Route path="*" element={<Navigate to="/home" replace />} />
          </Routes>
        </AnimatePresence>
        <Footer />
      </div>
    </Router>
  );
}

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  // Don't show navigation on starting page
  if (location.pathname === '/') {
    return null;
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/home">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" fill="white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                Scannon.AI
              </span>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <NavLink to="/home">Home</NavLink>
            <NavLink to="/upload">Upload</NavLink>
            <NavLink to="/realtime">Real-Time</NavLink>
            <NavLink to="/about">About</NavLink>
            <Link to="/upload">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full text-white font-semibold"
              >
                Get Started
              </motion.button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-white p-2"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden pb-4"
            >
              <div className="flex flex-col gap-4">
                <MobileNavLink to="/home" onClick={() => setIsOpen(false)}>
                  Home
                </MobileNavLink>
                <MobileNavLink to="/upload" onClick={() => setIsOpen(false)}>
                  Upload
                </MobileNavLink>
                <MobileNavLink to="/realtime" onClick={() => setIsOpen(false)}>
                  Real-Time
                </MobileNavLink>
                <MobileNavLink to="/about" onClick={() => setIsOpen(false)}>
                  About
                </MobileNavLink>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

const NavLink = ({ to, children }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link to={to}>
      <motion.div
        whileHover={{ scale: 1.05 }}
        className={`relative font-medium transition-colors ${
          isActive ? 'text-cyan-400' : 'text-gray-300 hover:text-white'
        }`}
      >
        {children}
        {isActive && (
          <motion.div
            layoutId="activeNav"
            className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-500 to-blue-500"
          />
        )}
      </motion.div>
    </Link>
  );
};

const MobileNavLink = ({ to, children, onClick }) => {
  return (
    <Link to={to} onClick={onClick}>
      <div className="text-gray-300 hover:text-white font-medium py-2">
        {children}
      </div>
    </Link>
  );
};

const Footer = () => {
  const location = useLocation();

  // Don't show footer on starting page
  if (location.pathname === '/') {
    return null;
  }

  return (
    <footer className="bg-slate-900 border-t border-white/10 py-12 px-4">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" fill="white" />
              </div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                Scannon.AI
              </h3>
            </div>
            <p className="text-gray-400 text-sm">
              AI-powered video privacy protection for everyone.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-white font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><Link to="/home" className="hover:text-cyan-400 transition-colors">Features</Link></li>
              <li><Link to="/upload" className="hover:text-cyan-400 transition-colors">Upload</Link></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors">API</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><Link to="/about" className="hover:text-cyan-400 transition-colors">About</Link></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Cookie Policy</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} Scannon.AI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

const AIAssistantButton = () => {
  const location = useLocation();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { type: 'ai', content: 'Hello! I can help you customize privacy protection for your videos. What would you like to blur or hide?' }
  ]);
  const [showTooltip, setShowTooltip] = useState(false);

  // Don't show on starting page
  if (location.pathname === '/') {
    return null;
  }

  const handleChatSubmit = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    // Add user message
    setChatMessages(prev => [...prev, { type: 'user', content: chatInput }]);

    // Simulate AI response (in a real app, this would call an API)
    setTimeout(() => {
      setChatMessages(prev => [...prev, {
        type: 'ai',
        content: `I'll help you ${chatInput.toLowerCase()}. Our AI will automatically detect and protect this information in your uploaded video.`
      }]);
    }, 1000);

    setChatInput('');
  };

  return (
    <>
      {/* Floating AI Chat Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50 flex items-center gap-3"
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        {/* Tooltip */}
        <AnimatePresence>
          {showTooltip && (
            <motion.div
              initial={{ opacity: 0, x: 50, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.8 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 25,
                exit: { duration: 0.3 }
              }}
              className="bg-slate-800/90 backdrop-blur-md text-white px-3 py-2 rounded-lg border border-white/10 shadow-lg max-w-xs"
            >
              <div className="text-sm font-medium">AI assistance for help</div>
              <div className="text-xs text-gray-300 mt-1">Click to customize privacy protection</div>
              {/* Arrow pointing to button */}
              <div className="absolute top-1/2 right-0 transform translate-x-full -translate-y-1/2 border-l-8 border-l-slate-800/90 border-y-4 border-y-transparent"></div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Button */}
        <motion.button
          onClick={() => setIsChatOpen(true)}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          className="group relative"
          whileHover={{
            scale: 1.15,
            rotate: [0, -5, 5, 0],
            transition: { duration: 0.3 }
          }}
          whileTap={{ scale: 0.9 }}
          animate={{
            boxShadow: [
              "0 0 0 0 rgba(168, 85, 247, 0.4)",
              "0 0 0 10px rgba(168, 85, 247, 0)",
              "0 0 0 0 rgba(168, 85, 247, 0)"
            ]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="relative">
            {/* Enhanced glow effect on hover */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-lg"
              animate={{ opacity: [0.75, 1, 0.75] }}
              transition={{ duration: 2, repeat: Infinity }}
              whileHover={{
                opacity: 1,
                scale: 1.2,
                boxShadow: "0 0 30px rgba(168, 85, 247, 0.8)"
              }}
            />

            {/* Button background with hover effect */}
            <motion.div
              className="relative bg-gradient-to-r from-purple-500 to-pink-500 rounded-full p-4 shadow-2xl border border-white/20"
              whileHover={{
                background: "linear-gradient(45deg, #ec4899, #8b5cf6, #06b6d4)",
                boxShadow: "0 0 25px rgba(168, 85, 247, 0.6)"
              }}
            >
              <motion.div
                whileHover={{
                  rotate: 360,
                  scale: 1.1
                }}
                transition={{ duration: 0.5 }}
              >
                <MessageCircle className="w-6 h-6 text-white group-hover:text-cyan-100 transition-colors duration-300" />
              </motion.div>
            </motion.div>

            {/* Pulse animation with enhanced hover */}
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full opacity-30"
              whileHover={{
                opacity: 0.6,
                scale: 1.3
              }}
            />

            {/* Additional sparkle effect on hover */}
            <motion.div
              className="absolute inset-0 rounded-full"
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
            >
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-cyan-400 rounded-full"
                  style={{
                    top: `${20 + Math.random() * 60}%`,
                    left: `${20 + Math.random() * 60}%`,
                  }}
                  animate={{
                    scale: [0, 1, 0],
                    opacity: [0, 1, 0]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.2,
                    ease: "easeInOut"
                  }}
                />
              ))}
            </motion.div>
          </div>
        </motion.button>
      </motion.div>

      {/* AI Chat Popup Modal */}
      <AnimatePresence>
        {isChatOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsChatOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            />

            {/* Chat Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 100 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 100 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed bottom-24 right-6 w-96 max-w-[calc(100vw-3rem)] z-50"
            >
              <div className="bg-slate-900/95 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center border border-purple-400/30">
                      <span className="text-purple-400 font-bold text-sm">AI</span>
                    </div>
                    <h3 className="text-white font-semibold">AI Assistant</h3>
                  </div>
                  <button
                    onClick={() => setIsChatOpen(false)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Chat Content */}
                <div className="p-4">
                  {/* Chat Messages */}
                  <div className="bg-slate-800/50 rounded-xl p-4 border border-white/10 max-h-80 overflow-y-auto mb-4">
                    <div className="space-y-3">
                      {chatMessages.map((message, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`max-w-xs px-4 py-2 rounded-lg ${
                            message.type === 'user'
                              ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white'
                              : 'bg-slate-700/50 text-gray-300 border border-white/10'
                          }`}>
                            {message.content}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Chat Input */}
                  <form onSubmit={handleChatSubmit} className="relative">
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder="Ask me about privacy protection options..."
                      className="w-full bg-slate-700/50 border border-white/20 rounded-lg px-4 py-3 pr-12 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                    <button
                      type="submit"
                      title="Send message"
                      aria-label="Send message"
                      className="absolute right-2 top-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white p-2 rounded-md transition-colors disabled:opacity-50"
                      disabled={!chatInput.trim()}
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </form>

                  <div className="text-xs text-gray-400 text-center mt-2">
                    Examples: &ldquo;blur all faces&rdquo;, &ldquo;hide license plates&rdquo;, &ldquo;remove text overlays&rdquo;, &ldquo;mask personal information&rdquo;
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default App;
