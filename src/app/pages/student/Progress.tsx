import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Progress as ProgressBar } from '../../components/ui/progress';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  RadarChart, 
  Radar, 
  PolarGrid, 
  PolarAngleAxis, 
  AreaChart,
  Area,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { 
  TrendingUp, 
  Target, 
  Award, 
  Clock, 
  Brain,
  Flame,
  Trophy,
  Calendar,
  ChevronRight,
  Sparkles,
  TrendingDown,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router';
import PersonaProfile from '../../components/PersonaProfile';

export default function Progress() {
  const navigate = useNavigate();

  const progressData = [
    { week: 'Week 1', mastery: 30, studyHours: 4, goalHours: 5 },
    { week: 'Week 2', mastery: 45, studyHours: 5.5, goalHours: 5 },
    { week: 'Week 3', mastery: 67, studyHours: 6, goalHours: 5 },
    { week: 'Week 4', mastery: 75, studyHours: 4.5, goalHours: 5 },
  ];

  const topicData = [
    { topic: 'Variables', mastery: 95, confidence: 'high', status: 'mastered' },
    { topic: 'Functions', mastery: 70, confidence: 'medium', status: 'learning' },
    { topic: 'Loops', mastery: 45, confidence: 'low', status: 'needs-review' },
    { topic: 'Arrays', mastery: 30, confidence: 'low', status: 'just-started' },
    { topic: 'Objects', mastery: 60, confidence: 'medium', status: 'learning' },
  ];

  const radarData = [
    { subject: 'Variables', score: 95, fullMark: 100 },
    { subject: 'Functions', score: 70, fullMark: 100 },
    { subject: 'Loops', score: 45, fullMark: 100 },
    { subject: 'Objects', score: 60, fullMark: 100 },
    { subject: 'DOM', score: 40, fullMark: 100 },
    { subject: 'Arrays', score: 30, fullMark: 100 },
  ];

  const dailyActivityData = [
    { day: 'Mon', minutes: 45 },
    { day: 'Tue', minutes: 30 },
    { day: 'Wed', minutes: 60 },
    { day: 'Thu', minutes: 0 },
    { day: 'Fri', minutes: 40 },
    { day: 'Sat', minutes: 75 },
    { day: 'Sun', minutes: 50 },
  ];

  const stats = [
    { 
      label: 'Overall Mastery', 
      value: '67%', 
      icon: <Target className="w-6 h-6" />, 
      color: 'from-blue-500 to-blue-600',
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
      label: 'Total Study Time', 
      value: '18.5 hrs', 
      icon: <Clock className="w-6 h-6" />, 
      color: 'from-purple-500 to-purple-600',
      trend: '4.2h this week',
      trendUp: true
    },
    { 
      label: 'Weekly Trend', 
      value: '+8%', 
      icon: <TrendingUp className="w-6 h-6" />, 
      color: 'from-green-500 to-teal-600',
      trend: 'Improving',
      trendUp: true
    },
  ];

  const achievements = [
    { title: '7-Day Streak', icon: '🔥', date: 'Today', color: 'bg-orange-50 border-orange-200' },
    { title: 'First Function', icon: '🎯', date: '2 days ago', color: 'bg-blue-50 border-blue-200' },
    { title: 'Quick Learner', icon: '⚡', date: '3 days ago', color: 'bg-purple-50 border-purple-200' },
    { title: '10 Lessons Done', icon: '🏆', date: '1 week ago', color: 'bg-green-50 border-green-200' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Premium Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => navigate('/dashboard')}
                className="rounded-xl"
              >
                <ChevronRight className="w-5 h-5 rotate-180" />
              </Button>
              <div>
                <h1 className="text-4xl font-bold text-gray-900">Progress Analytics</h1>
                <p className="text-gray-600 mt-1">Track your learning journey and celebrate your growth</p>
              </div>
            </div>
            <PersonaProfile variant="compact" />
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="rounded-xl">
              <Calendar className="w-4 h-4 mr-2" />
              This Week
            </Button>
            <Button variant="outline" className="rounded-xl">
              Export Report
            </Button>
          </div>
        </div>

        {/* Premium Stats Grid */}
        <div className="grid grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="p-6 hover:shadow-xl transition-all duration-300 border-gray-200 group">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}>
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
          {/* Left Column - Charts */}
          <div className="lg:col-span-2 space-y-8">
            {/* Mastery Over Time - Enhanced */}
            <Card className="p-8 shadow-lg border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">Mastery Growth</h3>
                  <p className="text-sm text-gray-600">Your learning progress over the past 4 weeks</p>
                </div>
                <Badge className="bg-green-100 text-green-700">
                  <TrendingUp className="w-3.5 h-3.5 mr-1" />
                  +45% increase
                </Badge>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={progressData}>
                  <defs>
                    <linearGradient id="masteryGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="week" 
                    stroke="#6b7280"
                    style={{ fontSize: '12px' }}
                  />
                  <YAxis 
                    stroke="#6b7280"
                    style={{ fontSize: '12px' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '12px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="mastery" 
                    stroke="#3b82f6" 
                    strokeWidth={3}
                    fill="url(#masteryGradient)"
                    dot={{ fill: '#3b82f6', strokeWidth: 2, r: 5 }}
                    activeDot={{ r: 7 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Card>

            {/* Topic Mastery - Enhanced */}
            <Card className="p-8 shadow-lg border-gray-200">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-1">Topic Mastery Breakdown</h3>
                <p className="text-sm text-gray-600">How well you understand each concept</p>
              </div>
              <div className="space-y-5">
                {topicData.map((topic, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="font-semibold text-gray-900">{topic.topic}</span>
                        {topic.status === 'mastered' && (
                          <Badge className="bg-green-100 text-green-700 text-xs">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Mastered
                          </Badge>
                        )}
                        {topic.status === 'needs-review' && (
                          <Badge className="bg-amber-100 text-amber-700 text-xs">
                            <AlertCircle className="w-3 h-3 mr-1" />
                            Needs Review
                          </Badge>
                        )}
                        {topic.status === 'learning' && (
                          <Badge className="bg-blue-100 text-blue-700 text-xs">
                            In Progress
                          </Badge>
                        )}
                      </div>
                      <span className="font-bold text-lg">{topic.mastery}%</span>
                    </div>
                    <ProgressBar 
                      value={topic.mastery} 
                      className={`h-3 ${
                        topic.mastery >= 80 ? 'bg-green-100' :
                        topic.mastery >= 50 ? 'bg-blue-100' :
                        'bg-amber-100'
                      }`}
                    />
                  </div>
                ))}
              </div>
              <Button 
                variant="outline" 
                className="w-full mt-6 rounded-xl border-2 hover:bg-blue-50"
                onClick={() => navigate('/learning-path')}
              >
                View Full Learning Path
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </Card>

            {/* Knowledge Radar - Enhanced */}
            <Card className="p-8 shadow-lg border-gray-200">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-1">Knowledge Map</h3>
                <p className="text-sm text-gray-600">Visual representation of your skill coverage</p>
              </div>
              <ResponsiveContainer width="100%" height={400}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#e5e7eb" />
                  <PolarAngleAxis 
                    dataKey="subject" 
                    tick={{ fill: '#6b7280', fontSize: 12 }}
                  />
                  <Radar 
                    name="Your Mastery" 
                    dataKey="score" 
                    stroke="#a855f7" 
                    fill="#a855f7" 
                    fillOpacity={0.5}
                    strokeWidth={2}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '12px'
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </Card>

            {/* Daily Activity */}
            <Card className="p-8 shadow-lg border-gray-200">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-1">This Week's Activity</h3>
                <p className="text-sm text-gray-600">Daily study time in minutes</p>
              </div>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={dailyActivityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="day" 
                    stroke="#6b7280"
                    style={{ fontSize: '12px' }}
                  />
                  <YAxis 
                    stroke="#6b7280"
                    style={{ fontSize: '12px' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '12px'
                    }}
                  />
                  <Bar 
                    dataKey="minutes" 
                    fill="#14b8a6"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>

          {/* Right Column - Insights */}
          <div className="space-y-6">
            {/* AI Insights */}
            <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200 shadow-lg">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">AI Insights</h3>
                  <p className="text-xs text-gray-600">Personalized for you</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <div className="flex items-start gap-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <div className="text-sm">
                      <p className="font-semibold text-gray-900 mb-1">Great Progress!</p>
                      <p className="text-gray-600">You've improved 45% in 4 weeks. At this pace, you'll master JavaScript fundamentals in 6 more weeks.</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <div className="flex items-start gap-2 mb-2">
                    <Brain className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                    <div className="text-sm">
                      <p className="font-semibold text-gray-900 mb-1">Best Study Time</p>
                      <p className="text-gray-600">Your focus peaks on <strong>Saturday afternoons</strong> with 75 min sessions.</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-white rounded-xl border border-amber-200">
                  <div className="flex items-start gap-2 mb-2">
                    <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                    <div className="text-sm">
                      <p className="font-semibold text-gray-900 mb-1">Needs Attention</p>
                      <p className="text-gray-600"><strong>Loops</strong> could use more practice. Try 2-3 more exercises this week.</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Recent Achievements */}
            <Card className="p-6 shadow-lg border-gray-200">
              <div className="flex items-center gap-2 mb-5">
                <Trophy className="w-5 h-5 text-yellow-600" />
                <h3 className="font-bold text-gray-900">Recent Achievements</h3>
              </div>
              <div className="space-y-3">
                {achievements.map((achievement, index) => (
                  <div key={index} className={`p-4 rounded-xl border-2 ${achievement.color} transition-all hover:scale-105 cursor-pointer`}>
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">{achievement.icon}</div>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900">{achievement.title}</div>
                        <div className="text-xs text-gray-600">{achievement.date}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Button 
                variant="outline" 
                className="w-full mt-4 rounded-xl"
                onClick={() => navigate('/profile')}
              >
                View All Achievements
              </Button>
            </Card>

            {/* Goals Card */}
            <Card className="p-6 bg-gradient-to-br from-green-50 to-teal-50 border-green-200">
              <div className="flex items-center gap-2 mb-4">
                <Target className="w-5 h-5 text-green-600" />
                <h3 className="font-bold text-gray-900">Weekly Goal</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-700">Study Time</span>
                    <span className="text-sm font-semibold">4.2 / 5 hours</span>
                  </div>
                  <ProgressBar value={84} className="h-2.5 bg-green-100" />
                </div>
                <div className="p-3 bg-white rounded-lg border border-green-200 text-center">
                  <div className="text-2xl font-bold text-green-600">0.8h</div>
                  <div className="text-xs text-gray-600">to reach your weekly goal</div>
                </div>
              </div>
            </Card>

            {/* Learning Style */}
            <Card className="p-6 shadow-lg border-gray-200">
              <div className="flex items-center gap-2 mb-4">
                <Brain className="w-5 h-5 text-purple-600" />
                <h3 className="font-bold text-gray-900">Your Learning Style</h3>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Visual learner with hands-on preference</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Best with gaming & music examples</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Thrives in afternoon sessions</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
