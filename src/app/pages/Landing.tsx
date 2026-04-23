import { useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { 
  Brain, 
  Target, 
  Clock, 
  Sparkles, 
  BookOpen, 
  TrendingUp,
  Users,
  CheckCircle,
  ArrowRight,
  Menu,
  Upload,
  BarChart3,
  MessageSquare
} from 'lucide-react';

export default function Landing() {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Brain className="w-8 h-8 text-[#14b8a6]" />,
      title: "AI-Powered Learning",
      description: "Personalized explanations and examples tailored to your interests and learning style"
    },
    {
      icon: <Target className="w-8 h-8 text-[#a855f7]" />,
      title: "Adaptive Sequencing",
      description: "Dynamic learning paths that adjust based on your performance and pace"
    },
    {
      icon: <Upload className="w-8 h-8 text-[#3b82f6]" />,
      title: "Upload Your Materials",
      description: "AI tutor grounded in your class notes, slides, and study materials"
    },
    {
      icon: <MessageSquare className="w-8 h-8 text-[#14b8a6]" />,
      title: "Hobby-Aware Examples",
      description: "Concepts explained using your interests - from gaming to music to sports"
    },
    {
      icon: <BarChart3 className="w-8 h-8 text-[#a855f7]" />,
      title: "Explainable Recommendations",
      description: "Always know why you're learning what you're learning"
    },
    {
      icon: <Clock className="w-8 h-8 text-[#3b82f6]" />,
      title: "Weekly Study Planner",
      description: "Smart scheduling that adapts to your availability and goals"
    }
  ];

  const howItWorks = [
    {
      step: "1",
      title: "Share Your Goals",
      description: "Tell us what you want to learn, your available time, and your interests"
    },
    {
      step: "2",
      title: "Take Diagnostic",
      description: "Quick assessment to understand your current knowledge and weak areas"
    },
    {
      step: "3",
      title: "Get Your Plan",
      description: "Receive a personalized learning path designed just for you"
    },
    {
      step: "4",
      title: "Learn & Grow",
      description: "Follow adaptive lessons, get AI tutoring, and track your progress"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50/30 to-white">
      {/* Navbar */}
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1e40af] to-[#14b8a6] flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-[#1e40af]">PersonaLearn</h1>
                <p className="text-xs text-gray-500">Learn your way, at your pace</p>
              </div>
            </div>
            
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm text-gray-600 hover:text-[#1e40af] transition-colors">Features</a>
              <a href="#how-it-works" className="text-sm text-gray-600 hover:text-[#1e40af] transition-colors">How It Works</a>
              <a href="#for-students" className="text-sm text-gray-600 hover:text-[#1e40af] transition-colors">For Students</a>
              <Button variant="ghost" onClick={() => navigate('/login')}>Login</Button>
              <Button onClick={() => navigate('/signup')}>Get Started</Button>
            </div>

            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 md:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-teal-100 text-sm font-medium text-[#1e40af]">
              <Sparkles className="w-4 h-4" />
              AI-Powered Personalized Learning
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
              Learn your way,
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#1e40af] to-[#14b8a6]">
                at your pace
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 leading-relaxed">
              PersonaLearn creates a unique learning path for every student. Get personalized explanations, 
              hobby-aware examples, and AI tutoring grounded in your own class materials.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button 
                size="lg" 
                className="text-lg h-14 px-8"
                onClick={() => navigate('/signup')}
              >
                Get Started Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="text-lg h-14 px-8"
                onClick={() => navigate('/dashboard')}
              >
                View Demo
              </Button>
            </div>

            <div className="flex items-center gap-6 pt-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-sm text-gray-600">No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-sm text-gray-600">Free forever plan</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-[#1e40af]/20 to-[#14b8a6]/20 rounded-3xl blur-3xl"></div>
            <Card className="relative p-8 border-2 shadow-2xl">
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl">
                  <div className="w-10 h-10 rounded-lg bg-[#1e40af] flex items-center justify-center">
                    <Target className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Your Goal: Master JavaScript</p>
                    <p className="text-xs text-gray-500">Exam in 4 weeks</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-teal-50 rounded-xl">
                  <div className="w-10 h-10 rounded-lg bg-[#14b8a6] flex items-center justify-center">
                    <Brain className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Personalized Path Generated</p>
                    <p className="text-xs text-gray-500">Based on your pace & interests</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-xl">
                  <div className="w-10 h-10 rounded-lg bg-[#a855f7] flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Progress: 67% Complete</p>
                    <p className="text-xs text-gray-500">On track to finish early!</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-gradient-to-b from-gray-50 to-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why PersonaLearn is Different</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Not a generic course platform. Not just a chatbot. A truly personalized learning experience.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow border-2 hover:border-[#1e40af]/20">
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600">Get started in minutes, learn for a lifetime</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {howItWorks.map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#1e40af] to-[#14b8a6] text-white text-2xl font-bold flex items-center justify-center mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-[#1e40af] to-[#14b8a6] py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to transform your learning?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of students learning more effectively with PersonaLearn
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              variant="secondary"
              className="text-lg h-14 px-8"
              onClick={() => navigate('/signup')}
            >
              Start Learning Free
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#1e40af] to-[#14b8a6] flex items-center justify-center">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-white">PersonaLearn</span>
              </div>
              <p className="text-sm">Learn your way, at your pace.</p>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Demo</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>&copy; 2026 PersonaLearn. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
