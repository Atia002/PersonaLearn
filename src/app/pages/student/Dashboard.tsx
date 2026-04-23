import { useNavigate } from 'react-router';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Progress } from '../../components/ui/progress';
import { Badge } from '../../components/ui/badge';
import { 
  Brain, 
  BookOpen, 
  Calendar, 
  TrendingUp, 
  Upload, 
  MessageSquare,
  Target,
  AlertCircle,
  CheckCircle,
  Clock,
  ArrowRight,
  Sparkles,
  Home,
  Map,
  BarChart3,
  FileText,
  Settings,
  LogOut,
  Bell,
  Search,
  Zap,
  Trophy,
  Flame,
  Award,
  Star,
  ChevronRight,
  Lightbulb,
  TrendingDown,
  Send
} from 'lucide-react';
import { Input } from '../../components/ui/input';
import PersonaProfile from '../../components/PersonaProfile';
import HobbyExampleCard from '../../components/HobbyExampleCard';
import { useLearner } from '../../contexts/LearnerContext';
import { getLearnerFirstName, getLearnerInitials } from '../../utils/learnerHelpers';
import { getSubjectData, getSubjectConcepts, getSubjectHobbyExamples } from '../../data/subjectData';

export default function Dashboard() {
  const navigate = useNavigate();
  const { learner, logout } = useLearner();

  const navItems = [
    { icon: <Home className="w-5 h-5" />, label: 'Dashboard', path: '/dashboard', active: true },
    { icon: <Map className="w-5 h-5" />, label: 'My Learning Path', path: '/learning-path' },
    { icon: <BookOpen className="w-5 h-5" />, label: 'Subjects', path: '/learning-path' },
    { icon: <Calendar className="w-5 h-5" />, label: 'Weekly Planner', path: '/planner' },
    { icon: <MessageSquare className="w-5 h-5" />, label: 'AI Tutor', path: '/lesson/1' },
    { icon: <Upload className="w-5 h-5" />, label: 'My Materials', path: '/materials' },
    { icon: <FileText className="w-5 h-5" />, label: 'Assessments', path: '/quiz/1' },
    { icon: <BarChart3 className="w-5 h-5" />, label: 'Progress', path: '/progress' },
    { icon: <Target className="w-5 h-5" />, label: 'Profile', path: '/profile' },
    { icon: <Settings className="w-5 h-5" />, label: 'Settings', path: '/settings' },
  ];

  const stats = [
    { 
      label: 'Current Level', 
      value: 'Intermediate', 
      icon: <TrendingUp className="w-6 h-6" />, 
      color: 'from-blue-500 to-blue-600',
      trend: '+2 levels',
      trendUp: true
    },
    { 
      label: 'Mastery Score', 
      value: '67%', 
      icon: <Target className="w-6 h-6" />, 
      color: 'from-purple-500 to-purple-600',
      trend: '+12%',
      trendUp: true
    },
    { 
      label: 'Study Streak', 
      value: '7 days', 
      icon: <Flame className="w-6 h-6" />, 
      color: 'from-orange-500 to-red-600',
      trend: 'Personal best!',
      trendUp: true
    },
    { 
      label: 'Weekly Goal', 
      value: '4.2/5h', 
      icon: <Trophy className="w-6 h-6" />, 
      color: 'from-green-500 to-teal-600',
      trend: '84% done',
      trendUp: true
    },
  ];

  const weakConcepts = [
    { 
      name: 'JavaScript Loops', 
      status: 'needs-review', 
      confidence: 45,
      lastStudied: '3 days ago',
      priority: 'high'
    },
    { 
      name: 'Array Methods', 
      status: 'in-progress', 
      confidence: 60,
      lastStudied: '1 day ago',
      priority: 'medium'
    },
    { 
      name: 'Async/Await', 
      status: 'not-started', 
      confidence: 20,
      lastStudied: 'Not started',
      priority: 'low'
    },
  ];

  const upcomingSessions = [
    { 
      day: 'Today', 
      time: '2:00 PM', 
      topic: 'JavaScript Functions', 
      duration: '30 min',
      isNext: true
    },
    { 
      day: 'Wed', 
      time: '2:00 PM', 
      topic: 'Object-Oriented Programming', 
      duration: '30 min',
      isNext: false
    },
    { 
      day: 'Fri', 
      time: '2:00 PM', 
      topic: 'DOM Manipulation', 
      duration: '30 min',
      isNext: false
    },
  ];

  const achievements = [
    { icon: <Star className="w-5 h-5" />, label: '7-day Streak', color: 'bg-yellow-500' },
    { icon: <Award className="w-5 h-5" />, label: 'Quick Learner', color: 'bg-purple-500' },
    { icon: <Trophy className="w-5 h-5" />, label: '10 Lessons', color: 'bg-blue-500' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20">
      {/* Premium Sidebar */}
      <div className="fixed left-0 top-0 bottom-0 w-64 bg-gradient-to-b from-[#0f172a] to-[#1e293b] text-white overflow-y-auto shadow-2xl">
        <div className="p-6">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#3b82f6] via-[#14b8a6] to-[#a855f7] flex items-center justify-center shadow-lg">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg">PersonaLearn</h1>
              <p className="text-xs text-gray-400">AI-Powered Learning</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="space-y-1">
            {navItems.map((item, index) => (
              <button
                key={index}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${ 
                  item.active
                    ? 'bg-gradient-to-r from-[#3b82f6] to-[#14b8a6] text-white shadow-lg scale-105'
                    : 'text-gray-400 hover:bg-[#1e293b] hover:text-white hover:scale-105'
                }`}
              >
                {item.icon}
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            ))}
          </nav>

          {/* Achievements Preview */}
          <div className="mt-8 p-4 bg-[#1e293b] rounded-xl border border-white/10">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold">Achievements</h3>
              <Trophy className="w-4 h-4 text-yellow-500" />
            </div>
            <div className="flex gap-2">
              {achievements.map((achievement, index) => (
                <div
                  key={index}
                  className={`w-10 h-10 ${achievement.color} rounded-lg flex items-center justify-center text-white shadow-lg`}
                  title={achievement.label}
                >
                  {achievement.icon}
                </div>
              ))}
            </div>
          </div>

          {/* Logout */}
          <div className="mt-6 pt-6 border-t border-white/10">
            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-400 hover:bg-[#1e293b] hover:text-white transition-all" onClick={logout}>
              <LogOut className="w-5 h-5" />
              <span className="text-sm">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64">
        {/* Premium Top Header */}
        <div className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 px-8 py-4 sticky top-0 z-40 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex-1 max-w-xl">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="search"
                  placeholder="Search lessons, topics, materials..."
                  className="pl-12 h-11 bg-gray-50 border-gray-200 rounded-xl"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Notifications */}
              <Button variant="ghost" size="icon" className="relative hover:bg-gray-100 rounded-xl">
                <Bell className="w-5 h-5" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
              </Button>

              {/* User Profile */}
              <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1e40af] via-[#14b8a6] to-[#a855f7] flex items-center justify-center text-white font-semibold shadow-md">
                  {getLearnerInitials(learner)}
                </div>
                <div>
                  <div className="font-semibold text-sm">{getLearnerFirstName(learner)}</div>
                  <div className="text-xs text-gray-500">Student • Level 12</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="p-8 space-y-8">
          {/* Premium Personalized Welcome Hero */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#1e40af] via-[#3b82f6] to-[#14b8a6] p-8 text-white shadow-xl">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>
            
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <h2 className="text-3xl font-bold">Good afternoon, {getLearnerFirstName(learner)}! ☀️</h2>
                    <Sparkles className="w-6 h-6 text-yellow-300 animate-pulse" />
                  </div>
                  <p className="text-blue-50 text-lg max-w-2xl">
                    You're on track with your {learner?.goal || 'learning goals'}! Based on your pace and recent progress, 
                    you're ready to continue with your personalized learning path.
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Flame className="w-12 h-12 text-orange-300" />
                  <span className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full">7 Day Streak 🔥</span>
                </div>
              </div>

              {/* Persona Profile Chips */}
              <div className="mb-4">
                <PersonaProfile variant="compact" />
              </div>

              {/* Quick Actions */}
              <div className="flex gap-3">
                <Button 
                  size="lg" 
                  onClick={() => navigate('/lesson/1')}
                  className="bg-white text-blue-600 hover:bg-blue-50 shadow-lg"
                >
                  <Zap className="w-5 h-5 mr-2" />
                  Continue Learning
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  onClick={() => navigate('/planner')}
                  className="border-white/30 text-white hover:bg-white/10"
                >
                  <Calendar className="w-5 h-5 mr-2" />
                  View Schedule
                </Button>
              </div>
            </div>
          </div>

          {/* Premium Stats Grid */}
          <div className="grid grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-all duration-300 border-gray-200/60">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white shadow-md`}>
                      {stat.icon}
                    </div>
                    {stat.trendUp && (
                      <TrendingUp className="w-5 h-5 text-green-500" />
                    )}
                  </div>
                  <div>
                    <div className="text-3xl font-bold mb-1">{stat.value}</div>
                    <div className="text-sm text-gray-600 mb-2">{stat.label}</div>
                    <div className="text-xs text-green-600 font-medium">{stat.trend}</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content Column */}
            <div className="lg:col-span-2 space-y-8">
              {/* AI Recommended Next - Enhanced */}
              <Card className="overflow-hidden border-2 border-blue-100 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 border-b border-blue-100">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center shadow-lg">
                        <Sparkles className="w-6 h-6 text-white animate-pulse" />
                      </div>
                      <div>
                        <h3 className="font-bold text-xl text-gray-900">Your Next Recommended Lesson</h3>
                        <p className="text-sm text-gray-600">Personalized by AI for your learning style</p>
                      </div>
                    </div>
                    <Badge className="bg-blue-500 text-white">AI Recommended</Badge>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  <div className="flex gap-6">
                    <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                      <BookOpen className="w-12 h-12 text-white" />
                    </div>
                    
                    <div className="flex-1 space-y-3">
                      <div>
                        <h4 className="font-bold text-xl mb-2">JavaScript Functions Deep Dive</h4>
                        <p className="text-gray-600">
                          Master function declarations, expressions, and arrow functions with personalized gaming examples 
                          tailored to your interests.
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-6 text-sm text-gray-500">
                        <span className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-blue-500" />
                          30 min
                        </span>
                        <span className="flex items-center gap-2">
                          <Target className="w-4 h-4 text-purple-500" />
                          Intermediate
                        </span>
                        <span className="flex items-center gap-2">
                          <Lightbulb className="w-4 h-4 text-yellow-500" />
                          92% Match
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Why This Recommendation - Enhanced */}
                  <div className="p-5 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                        <Sparkles className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <h5 className="font-semibold text-gray-900 mb-2">Why this recommendation?</h5>
                        <div className="space-y-2 text-sm text-gray-700">
                          <div className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span>Your diagnostic showed mastery in <strong>variables & data types</strong> (85% score)</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span>Functions are the natural next step in your <strong>balanced pace</strong> learning path</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span>We'll use <strong>gaming analogies</strong> (health bars, power-ups) based on your interests</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span>Perfect timing: fits your <strong>afternoon study schedule</strong> and 30-min session preference</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Button 
                    size="lg" 
                    onClick={() => navigate('/lesson/1')}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 shadow-lg"
                  >
                    <Zap className="w-5 h-5 mr-2" />
                    Start Learning Now
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              </Card>

              {/* Hobby-Aware Example Preview */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-xl text-gray-900">Examples Made For You</h3>
                  <Badge variant="outline" className="gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    Personalized
                  </Badge>
                </div>
                <HobbyExampleCard
                  hobby="gaming"
                  concept="JavaScript Variables"
                  example="Think of variables like a player's health bar. Just like health can increase or decrease during gameplay, a variable's value can change throughout your program."
                  code={`let playerHealth = 100;\nplayerHealth -= 20; // Takes damage\nplayerHealth += 15; // Healing potion\nconsole.log(playerHealth); // 95`}
                />
              </div>

              {/* Areas to Review - Enhanced */}
              <Card className="p-6 border-amber-200 shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                      <AlertCircle className="w-6 h-6 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">Areas Needing Attention</h3>
                      <p className="text-sm text-gray-600">Concepts identified by AI for review</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => navigate('/progress')}>
                    View All <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>

                <div className="space-y-4">
                  {weakConcepts.map((concept, index) => (
                    <div key={index} className="p-5 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-xl hover:shadow-md transition-all">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="font-semibold text-gray-900">{concept.name}</span>
                            <Badge 
                              variant="outline" 
                              className={`text-xs ${
                                concept.priority === 'high' ? 'border-red-300 text-red-700 bg-red-50' :
                                concept.priority === 'medium' ? 'border-orange-300 text-orange-700 bg-orange-50' :
                                'border-yellow-300 text-yellow-700 bg-yellow-50'
                              }`}
                            >
                              {concept.priority === 'high' ? 'High Priority' : 
                               concept.priority === 'medium' ? 'Medium Priority' : 'Low Priority'}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">Last studied: {concept.lastStudied}</p>
                        </div>
                        <Button size="sm" onClick={() => navigate('/lesson/1')} className="bg-amber-600 hover:bg-amber-700">
                          Review Now
                        </Button>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Confidence Level</span>
                          <span className="font-medium text-gray-900">{concept.confidence}%</span>
                        </div>
                        <Progress value={concept.confidence} className="h-3 bg-amber-100" />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
              {/* Today's Schedule - Enhanced */}
              <Card className="p-6 border-blue-200 shadow-lg">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    <h3 className="font-bold">Today's Schedule</h3>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => navigate('/planner')} className="h-8">
                    Full View
                  </Button>
                </div>

                <div className="space-y-3">
                  {upcomingSessions.map((session, index) => (
                    <div 
                      key={index} 
                      className={`p-4 rounded-xl transition-all cursor-pointer ${
                        session.isNext 
                          ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md hover:shadow-lg' 
                          : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                      onClick={() => navigate('/planner')}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-sm font-semibold ${session.isNext ? 'text-white' : 'text-gray-900'}`}>
                          {session.day}
                        </span>
                        <span className={`text-xs ${session.isNext ? 'text-blue-100' : 'text-gray-500'}`}>
                          {session.duration}
                        </span>
                      </div>
                      <div className={`text-sm mb-1 ${session.isNext ? 'text-white font-medium' : 'text-gray-700'}`}>
                        {session.topic}
                      </div>
                      <div className={`text-xs flex items-center gap-2 ${session.isNext ? 'text-blue-100' : 'text-gray-500'}`}>
                        <Clock className="w-3.5 h-3.5" />
                        {session.time}
                        {session.isNext && <Badge className="ml-auto bg-white/20 text-white text-xs">Up Next</Badge>}
                      </div>
                    </div>
                  ))}
                </div>

                <Button 
                  variant="outline" 
                  className="w-full mt-4 border-blue-200 hover:bg-blue-50" 
                  onClick={() => navigate('/planner')}
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  View Full Calendar
                </Button>
              </Card>

              {/* AI Tutor Quick Access - Premium */}
              <Card className="overflow-hidden border-purple-200 shadow-lg">
                <div className="bg-gradient-to-br from-purple-500 via-purple-600 to-pink-600 p-6 text-white">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <MessageSquare className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">AI Tutor</h3>
                      <p className="text-xs text-purple-100">Ask anything, anytime</p>
                    </div>
                  </div>
                </div>

                <div className="p-5 space-y-4">
                  <p className="text-sm text-gray-600">
                    Get instant personalized explanations tailored to your learning style and interests.
                  </p>

                  <div className="relative">
                    <Input 
                      placeholder="Ask your tutor..." 
                      className="pr-10 border-purple-200 focus:border-purple-400" 
                    />
                    <Button 
                      size="icon" 
                      className="absolute right-1 top-1 h-8 w-8 bg-gradient-to-r from-purple-500 to-pink-500"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs font-medium text-gray-500 uppercase">Quick Actions</p>
                    <button 
                      className="w-full text-left p-3 bg-purple-50 hover:bg-purple-100 rounded-lg text-sm transition-all flex items-center gap-2 group"
                      onClick={() => navigate('/lesson/1')}
                    >
                      <div className="w-8 h-8 rounded-lg bg-purple-100 group-hover:bg-purple-200 flex items-center justify-center flex-shrink-0">
                        💡
                      </div>
                      <span className="font-medium">Explain simpler</span>
                    </button>
                    <button 
                      className="w-full text-left p-3 bg-blue-50 hover:bg-blue-100 rounded-lg text-sm transition-all flex items-center gap-2 group"
                      onClick={() => navigate('/lesson/1')}
                    >
                      <div className="w-8 h-8 rounded-lg bg-blue-100 group-hover:bg-blue-200 flex items-center justify-center flex-shrink-0">
                        🎮
                      </div>
                      <span className="font-medium">Use gaming example</span>
                    </button>
                    <button 
                      className="w-full text-left p-3 bg-teal-50 hover:bg-teal-100 rounded-lg text-sm transition-all flex items-center gap-2 group"
                      onClick={() => navigate('/lesson/1')}
                    >
                      <div className="w-8 h-8 rounded-lg bg-teal-100 group-hover:bg-teal-200 flex items-center justify-center flex-shrink-0">
                        📝
                      </div>
                      <span className="font-medium">Summarize last lesson</span>
                    </button>
                  </div>
                </div>
              </Card>

              {/* Learning Insights */}
              <Card className="p-6 bg-gradient-to-br from-teal-50 to-cyan-50 border-teal-200">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-5 h-5 text-teal-600" />
                  <h3 className="font-bold">This Week's Insights</h3>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Best focus time: <strong>Afternoons</strong></span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Strongest skill: <strong>Problem Solving</strong></span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">You learn best with <strong>hands-on examples</strong></span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}