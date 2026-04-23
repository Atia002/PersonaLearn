import { useState } from 'react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Progress } from '../../components/ui/progress';
import { 
  Calendar, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  ChevronLeft,
  ChevronRight,
  Plus,
  Target,
  Sparkles,
  PlayCircle,
  Edit,
  Trash2,
  Coffee,
  Moon,
  Sun,
  Sunrise
} from 'lucide-react';
import { useNavigate } from 'react-router';
import PersonaProfile from '../../components/PersonaProfile';

export default function WeeklyPlanner() {
  const navigate = useNavigate();
  const [currentWeek, setCurrentWeek] = useState(0);

  const days = [
    { name: 'Monday', date: 'Mar 24', dayOfWeek: 'Mon' },
    { name: 'Tuesday', date: 'Mar 25', dayOfWeek: 'Tue' },
    { name: 'Wednesday', date: 'Mar 26', dayOfWeek: 'Wed' },
    { name: 'Thursday', date: 'Mar 27', dayOfWeek: 'Thu' },
    { name: 'Friday', date: 'Mar 28', dayOfWeek: 'Fri' },
    { name: 'Saturday', date: 'Mar 29', dayOfWeek: 'Sat' },
    { name: 'Sunday', date: 'Mar 30', dayOfWeek: 'Sun' },
  ];
  
  const sessions = {
    Monday: [
      { 
        time: '2:00 PM', 
        topic: 'JavaScript Functions', 
        duration: '30 min',
        durationMinutes: 30,
        status: 'completed',
        type: 'lesson',
        icon: '📚',
        completedAt: '2:25 PM'
      }
    ],
    Tuesday: [],
    Wednesday: [
      { 
        time: '2:00 PM', 
        topic: 'Object-Oriented Programming', 
        duration: '30 min',
        durationMinutes: 30,
        status: 'upcoming',
        type: 'lesson',
        icon: '💻',
        isOptimal: true
      }
    ],
    Thursday: [],
    Friday: [
      { 
        time: '2:00 PM', 
        topic: 'DOM Manipulation', 
        duration: '30 min',
        durationMinutes: 30,
        status: 'upcoming',
        type: 'lesson',
        icon: '🎯'
      }
    ],
    Saturday: [
      { 
        time: '3:00 PM', 
        topic: 'Practice Exercises', 
        duration: '45 min',
        durationMinutes: 45,
        status: 'upcoming',
        type: 'practice',
        icon: '✏️'
      }
    ],
    Sunday: [
      { 
        time: '1:00 PM', 
        topic: 'Weekly Review Quiz', 
        duration: '20 min',
        durationMinutes: 20,
        status: 'upcoming',
        type: 'quiz',
        icon: '📝'
      }
    ],
  };

  // Calculate weekly stats
  const totalSessions = Object.values(sessions).flat().length;
  const completedSessions = Object.values(sessions).flat().filter(s => s.status === 'completed').length;
  const totalMinutes = Object.values(sessions).flat().reduce((sum, s) => sum + s.durationMinutes, 0);
  const completedMinutes = Object.values(sessions).flat().filter(s => s.status === 'completed').reduce((sum, s) => sum + s.durationMinutes, 0);
  const weekProgress = (completedSessions / totalSessions) * 100;

  const getTimeIcon = (time: string) => {
    const hour = parseInt(time.split(':')[0]);
    if (hour >= 6 && hour < 12) return <Sunrise className="w-4 h-4" />;
    if (hour >= 12 && hour < 17) return <Sun className="w-4 h-4" />;
    if (hour >= 17 && hour < 21) return <Coffee className="w-4 h-4" />;
    return <Moon className="w-4 h-4" />;
  };

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
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-4xl font-bold text-gray-900">Weekly Planner</h1>
                <p className="text-gray-600 mt-1">Week of March 24-30, 2026</p>
              </div>
            </div>
            <PersonaProfile variant="compact" />
          </div>
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              size="icon"
              className="rounded-xl"
              onClick={() => setCurrentWeek(currentWeek - 1)}
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button 
              variant="outline"
              className="rounded-xl"
            >
              This Week
            </Button>
            <Button 
              variant="outline" 
              size="icon"
              className="rounded-xl"
              onClick={() => setCurrentWeek(currentWeek + 1)}
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Weekly Stats */}
        <div className="grid md:grid-cols-4 gap-6">
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{completedSessions}/{totalSessions}</div>
                <div className="text-sm text-gray-600">Sessions Done</div>
              </div>
            </div>
            <Progress value={weekProgress} className="h-2 bg-blue-200" />
          </Card>

          <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{completedMinutes}/{totalMinutes}min</div>
                <div className="text-sm text-gray-600">Study Time</div>
              </div>
            </div>
            <Progress value={(completedMinutes / totalMinutes) * 100} className="h-2 bg-purple-200" />
          </Card>

          <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">84%</div>
                <div className="text-sm text-gray-600">On Track</div>
              </div>
            </div>
            <Progress value={84} className="h-2 bg-green-200" />
          </Card>

          <Card className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-lg text-2xl">
                🔥
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">7 Days</div>
                <div className="text-sm text-gray-600">Study Streak</div>
              </div>
            </div>
          </Card>
        </div>

        {/* AI Recommendation */}
        <Card className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 shadow-lg">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0 shadow-lg">
              <Sparkles className="w-6 h-6 text-white animate-pulse" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                AI Schedule Recommendation
                <Badge className="bg-purple-100 text-purple-700">Optimized for you</Badge>
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                Based on your <strong>afternoon preference</strong> and <strong>balanced pace</strong>, 
                we've scheduled sessions at your peak focus time. Wednesday at 2 PM has the highest 
                success rate based on your pattern!
              </p>
            </div>
          </div>
        </Card>

        {/* Calendar Grid */}
        <div className="grid gap-6">
          {days.map((day) => {
            const daySessions = sessions[day.name as keyof typeof sessions] || [];
            const hasCompleted = daySessions.some(s => s.status === 'completed');
            const hasUpcoming = daySessions.some(s => s.status === 'upcoming');
            const isToday = day.name === 'Wednesday'; // Mock today

            return (
              <Card 
                key={day.name} 
                className={`overflow-hidden transition-all hover:shadow-xl ${
                  isToday ? 'ring-2 ring-blue-400 shadow-lg' : ''
                }`}
              >
                <div className={`p-6 ${
                  isToday 
                    ? 'bg-gradient-to-r from-blue-50 to-purple-50' 
                    : hasCompleted 
                    ? 'bg-gradient-to-r from-green-50 to-teal-50' 
                    : 'bg-white'
                }`}>
                  <div className="flex items-start gap-6">
                    {/* Date Column */}
                    <div className="w-32 flex-shrink-0">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="font-bold text-xl text-gray-900">{day.name}</div>
                        {isToday && (
                          <Badge className="bg-blue-500 text-white text-xs">Today</Badge>
                        )}
                      </div>
                      <div className="text-sm text-gray-600">{day.date}</div>
                      {daySessions.length > 0 && (
                        <div className="mt-3 flex items-center gap-2">
                          {hasCompleted && (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          )}
                          <span className="text-xs text-gray-600">
                            {daySessions.reduce((sum, s) => sum + s.durationMinutes, 0)} min
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Sessions Column */}
                    <div className="flex-1">
                      {daySessions.length > 0 ? (
                        <div className="space-y-3">
                          {daySessions.map((session, index) => (
                            <div 
                              key={index} 
                              className={`group p-5 rounded-xl transition-all hover:scale-102 ${
                                session.status === 'completed' 
                                  ? 'bg-white border-2 border-green-200 shadow-sm' 
                                  : 'bg-white border-2 border-blue-200 shadow-md hover:shadow-lg'
                              }`}
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex items-start gap-4 flex-1">
                                  {/* Session Icon */}
                                  <div className={`text-3xl ${
                                    session.status === 'completed' ? 'opacity-50' : ''
                                  }`}>
                                    {session.icon}
                                  </div>

                                  {/* Session Details */}
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                      <h4 className={`font-semibold text-lg ${
                                        session.status === 'completed' 
                                          ? 'text-gray-600 line-through' 
                                          : 'text-gray-900'
                                      }`}>
                                        {session.topic}
                                      </h4>
                                      {session.isOptimal && (
                                        <Badge className="bg-yellow-100 text-yellow-800 text-xs flex items-center gap-1">
                                          <Sparkles className="w-3 h-3" />
                                          Optimal Time
                                        </Badge>
                                      )}
                                    </div>
                                    
                                    <div className="flex items-center gap-4 text-sm text-gray-600">
                                      <span className="flex items-center gap-1.5">
                                        {getTimeIcon(session.time)}
                                        {session.time}
                                      </span>
                                      <span className="flex items-center gap-1.5">
                                        <Clock className="w-4 h-4" />
                                        {session.duration}
                                      </span>
                                      <Badge variant="outline" className="text-xs">
                                        {session.type}
                                      </Badge>
                                    </div>

                                    {session.status === 'completed' && session.completedAt && (
                                      <div className="mt-2 flex items-center gap-2 text-xs text-green-600">
                                        <CheckCircle className="w-3.5 h-3.5" />
                                        Completed at {session.completedAt}
                                      </div>
                                    )}
                                  </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2">
                                  {session.status === 'upcoming' && (
                                    <Button 
                                      size="sm"
                                      className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 shadow-md"
                                      onClick={() => navigate('/lesson/1')}
                                    >
                                      <PlayCircle className="w-4 h-4 mr-1.5" />
                                      Start
                                    </Button>
                                  )}
                                  <Button 
                                    size="icon" 
                                    variant="ghost"
                                    className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8"
                                  >
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                  <Button 
                                    size="icon" 
                                    variant="ghost"
                                    className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 text-red-500 hover:text-red-600"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-xl">
                          <Calendar className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                          <div className="text-gray-400 text-sm mb-3">No sessions scheduled</div>
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="rounded-xl"
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Session
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4">
          <Button 
            size="lg"
            variant="outline"
            className="rounded-xl border-2 gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Custom Session
          </Button>
          <Button 
            size="lg"
            className="rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg gap-2"
          >
            <Sparkles className="w-5 h-5" />
            Let AI Optimize Schedule
          </Button>
        </div>
      </div>
    </div>
  );
}
