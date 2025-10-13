import { Shield, Users, Target, Globe, Heart } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-900 to-slate-900 py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
            About Scannon.AI
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            We're on a mission to make privacy protection accessible to everyone through
            cutting-edge AI technology that automatically protects sensitive information in videos.
          </p>
        </div>

        {/* Mission Section */}
        <div className="mb-16 bg-white/5 backdrop-blur-md rounded-2xl p-8 md:p-12 border border-white/10">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold text-white mb-4">
                Our Mission
              </h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                In an age where video content is everywhere, privacy has become more important than ever.
                Scannon.AI was created to give individuals and organizations the power to share videos
                without compromising personal privacy.
              </p>
              <p className="text-gray-300 leading-relaxed">
                Using state-of-the-art machine learning algorithms, we automatically detect and blur
                faces, license plates, and other sensitive information in seconds, making privacy
                protection effortless.
              </p>
            </div>
            <div className="bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-xl p-8 border border-cyan-500/30">
              <Shield className="w-20 h-20 text-cyan-400 mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">
                Privacy First
              </h3>
              <p className="text-gray-300">
                Every decision we make is guided by our commitment to protecting your privacy and data security.
              </p>
            </div>
          </div>
        </div>

        {/* Values Grid */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Our Values
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <ValueCard
              icon={Users}
              title="User-Centric"
              description="We build tools that put users first, with intuitive interfaces and powerful features."
            />
            <ValueCard
              icon={Target}
              title="Precision"
              description="Our AI achieves 99.9% accuracy in detecting and protecting sensitive information."
            />
            <ValueCard
              icon={Globe}
              title="Accessibility"
              description="Privacy protection should be available to everyone, everywhere, at any time."
            />
          </div>
        </div>

        {/* Technology Section */}
        <div className="mb-16 bg-white/5 backdrop-blur-md rounded-2xl p-8 md:p-12 border border-white/10">
          <h2 className="text-3xl font-bold text-white mb-6">
            The Technology
          </h2>
          <div className="space-y-4 text-gray-300">
            <p className="leading-relaxed">
              Scannon.AI leverages advanced computer vision and deep learning models trained on millions
              of images to provide industry-leading accuracy in face and object detection.
            </p>
            <p className="leading-relaxed">
              Our proprietary blurring algorithms ensure that protected information remains unreadable
              while maintaining the overall quality and watchability of your videos.
            </p>
            <div className="grid md:grid-cols-2 gap-6 mt-8">
              <TechFeature
                title="Real-time Processing"
                description="Advanced GPU acceleration enables processing of HD videos in seconds"
              />
              <TechFeature
                title="Multi-layer Detection"
                description="Simultaneous detection of faces, license plates, and custom sensitive areas"
              />
              <TechFeature
                title="Adaptive Blurring"
                description="Smart blur strength adjustment based on motion and scene complexity"
              />
              <TechFeature
                title="Frame-by-frame Analysis"
                description="Every single frame is analyzed to ensure complete privacy protection"
              />
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <StatCard
            number="50K+"
            label="Videos Processed"
          />
          <StatCard
            number="99.9%"
            label="Accuracy Rate"
          />
          <StatCard
            number="10M+"
            label="Faces Blurred"
          />
        </div>

        {/* Team Section */}
        <div className="text-center">
          <Heart className="w-16 h-16 text-pink-400 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-white mb-4">
            Built with Care
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Scannon.AI is built by a passionate team of engineers, designers, and privacy advocates
            who believe that everyone deserves control over their digital identity.
          </p>
        </div>
      </div>
    </div>
  );
};

const ValueCard = ({ icon: Icon, title, description }) => {
  return (
    <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10 hover:border-cyan-500/50 transition-all cursor-pointer group">
      <Icon className="w-12 h-12 text-cyan-400 mb-4 group-hover:text-cyan-300 transition-colors" />
      <h3 className="text-xl font-bold text-white mb-2">
        {title}
      </h3>
      <p className="text-gray-400 group-hover:text-gray-300 transition-colors">
        {description}
      </p>
    </div>
  );
};

const TechFeature = ({ title, description }) => {
  return (
    <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-lg p-4 border border-cyan-500/20 hover:border-cyan-400/50 transition-all cursor-pointer group">
      <h4 className="text-white font-semibold mb-2 group-hover:text-cyan-400 transition-colors">
        {title}
      </h4>
      <p className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors">
        {description}
      </p>
    </div>
  );
};

const StatCard = ({ number, label }) => {
  return (
    <div className="bg-gradient-to-br from-cyan-500 via-blue-500 to-purple-600 rounded-xl p-8 text-center hover:shadow-2xl hover:shadow-cyan-500/25 transition-all cursor-pointer group">
      <div className="text-5xl font-bold text-white mb-2 group-hover:text-cyan-100 transition-colors">
        {number}
      </div>
      <div className="text-white/90 font-medium group-hover:text-white transition-colors">
        {label}
      </div>
    </div>
  );
};

export default About;
