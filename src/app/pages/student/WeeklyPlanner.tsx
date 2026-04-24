import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Progress } from '../../components/ui/progress';
import { Calendar, Clock, CheckCircle, AlertCircle, ChevronLeft, ChevronRight, Sparkles, PlayCircle, Plus, Target } from 'lucide-react';
import PersonaProfile from '../../components/PersonaProfile';
import { useLearner } from '../../contexts/LearnerContext';

const weekDays = [
  { name: 'Monday', date: 'Mar 24', dayOfWeek: 'Mon' },
  { name: 'Tuesday', date: 'Mar 25', dayOfWeek: 'Tue' },
  { name: 'Wednesday', date: 'Mar 26', dayOfWeek: 'Wed' },
  { name: 'Thursday', date: 'Mar 27', dayOfWeek: 'Thu' },
  { name: 'Friday', date: 'Mar 28', dayOfWeek: 'Fri' },
  { name: 'Saturday', date: 'Mar 29', dayOfWeek: 'Sat' },
  { name: 'Sunday', date: 'Mar 30', dayOfWeek: 'Sun' },
];

type SessionStatus = 'upcoming' | 'completed' | 'missed';

type PlannerSession = {
  id: string;
  day: string;
  topic: string;
  taskTitle: string;
  durationMinutes: number;
  supportLevel: string;
  reason: string;
  recommendedResourceType: string;
  status: SessionStatus;
};

export default function WeeklyPlanner() {
  const navigate = useNavigate();
  const { learner } = useLearner();
  const [currentWeek, setCurrentWeek] = useState(0);
  const [sessionStatuses, setSessionStatuses] = useState<Record<string, SessionStatus>>({});

  const generatedPlan = (learner?.generatedPlan || {}) as {
    weakConcept?: string;
    planItems?: Array<{ day: string; concept: string; taskTitle: string; estimatedMinutes: number; supportLevel: string; reason: string; status: string; recommendedResourceType: string }>;
    weeklyPlan?: Array<{ day: string; concept: string; taskTitle: string; estimatedMinutes: number; supportLevel: string; reason: string; status: string; recommendedResourceType: string }>;
  };

  const sessions = useMemo<PlannerSession[]>(() => {
    const planItems = generatedPlan.planItems?.length ? generatedPlan.planItems : (generatedPlan.weeklyPlan || []);

    if (planItems.length === 0) {
      return [
        {
          id: 'fallback-1',
          day: 'Monday',
          topic: learner?.diagnosticWeakConcept || generatedPlan.weakConcept || 'Variables',
          taskTitle: 'Review the weak concept',
          durationMinutes: learner?.sessionLength || 30,
          supportLevel: learner?.supportMode || 'balanced',
          reason: 'Fallback session for the demo.',
          recommendedResourceType: 'lesson',
          status: 'upcoming',
        },
        {
          id: 'fallback-2',
          day: 'Wednesday',
          topic: learner?.goal || 'Practice',
          taskTitle: 'Practice with examples',
          durationMinutes: learner?.sessionLength || 30,
          supportLevel: learner?.supportMode || 'balanced',
          reason: 'Fallback session for the demo.',
          recommendedResourceType: 'practice',
          status: 'upcoming',
        },
        {
          id: 'fallback-3',
          day: 'Friday',
          topic: learner?.subject || 'Review',
          taskTitle: 'Take a quick self-check',
          durationMinutes: learner?.sessionLength || 30,
          supportLevel: learner?.supportMode || 'balanced',
          reason: 'Fallback session for the demo.',
          recommendedResourceType: 'quiz',
          status: 'upcoming',
        },
      ];
    }

    return planItems.map((item, index) => ({
      id: `${item.day}-${item.concept}-${index}`,
      day: item.day,
      topic: item.concept,
      taskTitle: item.taskTitle,
      durationMinutes: item.estimatedMinutes,
      supportLevel: item.supportLevel,
      reason: item.reason,
      recommendedResourceType: item.recommendedResourceType,
      status: item.status as SessionStatus,
    }));
  }, [generatedPlan.planItems, generatedPlan.weeklyPlan, generatedPlan.weakConcept, learner?.diagnosticWeakConcept, learner?.goal, learner?.subject, learner?.sessionLength, learner?.supportMode]);

  useEffect(() => {
    setSessionStatuses({});
  }, [learner?.generatedPlan]);

  const totalSessions = sessions.length;
  const completedSessions = sessions.filter((session) => (sessionStatuses[session.id] || session.status) === 'completed').length;
  const missedSessions = sessions.filter((session) => (sessionStatuses[session.id] || session.status) === 'missed').length;
  const totalMinutes = sessions.reduce((sum, session) => sum + session.durationMinutes, 0);
  const completedMinutes = sessions.filter((session) => (sessionStatuses[session.id] || session.status) === 'completed').reduce((sum, session) => sum + session.durationMinutes, 0);
  const weekProgress = totalSessions > 0 ? (completedSessions / totalSessions) * 100 : 0;
  const weakConcept = learner?.diagnosticWeakConcept || generatedPlan.weakConcept || 'Review needed';

  const sessionsByDay = useMemo(() => {
    return weekDays.reduce((map, day) => {
      map[day.name] = sessions.filter((session) => session.day === day.name);
      return map;
    }, {} as Record<string, PlannerSession[]>);
  }, [sessions]);

  const updateSessionStatus = (sessionId: string, status: SessionStatus) => {
    setSessionStatuses((previous) => ({
      ...previous,
      [sessionId]: status,
    }));
  };

  const catchUpNeeded = missedSessions >= 2;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')} className="rounded-xl">
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-4xl font-bold text-gray-900">Weekly Planner</h1>
                <p className="text-gray-600 mt-1">A plan-backed schedule built from your profile and diagnostic weak concept.</p>
              </div>
            </div>
            <PersonaProfile variant="compact" />
          </div>
          <div className="flex gap-3">
            <Button variant="outline" size="icon" className="rounded-xl" onClick={() => setCurrentWeek((week) => week - 1)}>
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button variant="outline" className="rounded-xl">This Week</Button>
            <Button variant="outline" size="icon" className="rounded-xl" onClick={() => setCurrentWeek((week) => week + 1)}>
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>

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
                <div className="text-2xl font-bold text-gray-900">{completedMinutes}/{totalMinutes} min</div>
                <div className="text-sm text-gray-600">Study Time</div>
              </div>
            </div>
            <Progress value={totalMinutes > 0 ? (completedMinutes / totalMinutes) * 100 : 0} className="h-2 bg-purple-200" />
          </Card>

          <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{weakConcept}</div>
                <div className="text-sm text-gray-600">Weak Concept</div>
              </div>
            </div>
            <Progress value={85} className="h-2 bg-green-200" />
          </Card>

          <Card className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-lg text-2xl">
                🔥
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{missedSessions}</div>
                <div className="text-sm text-gray-600">Missed sessions</div>
              </div>
            </div>
          </Card>
        </div>

        {catchUpNeeded && (
          <Card className="p-6 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 shadow-lg">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center flex-shrink-0 shadow-lg">
                <AlertCircle className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                  Catch-up recommendation
                  <Badge className="bg-amber-100 text-amber-700">Missed sessions detected</Badge>
                </h3>
                <p className="text-sm text-gray-700 mb-4">
                  Two or more sessions were missed, so the planner suggests a shorter catch-up plan focused on {weakConcept}.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button className="rounded-xl bg-amber-600 hover:bg-amber-700">
                    Compress schedule
                  </Button>
                  <Button variant="outline" className="rounded-xl border-amber-200">
                    Focus weak topic only
                  </Button>
                  <Button variant="outline" className="rounded-xl border-amber-200">
                    Postpone remaining work
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        )}

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
                Your plan puts {weakConcept} first, then follows the pace and support mode saved in your learner profile.
              </p>
            </div>
          </div>
        </Card>

        <div className="grid gap-6">
          {weekDays.map((day) => {
            const daySessions = sessionsByDay[day.name] || [];
            const hasCompleted = daySessions.some((session) => (sessionStatuses[session.id] || session.status) === 'completed');
            const hasUpcoming = daySessions.some((session) => (sessionStatuses[session.id] || session.status) === 'upcoming');
            const isToday = day.name === 'Wednesday';

            return (
              <Card key={day.name} className={`overflow-hidden transition-all hover:shadow-xl ${isToday ? 'ring-2 ring-blue-400 shadow-lg' : ''}`}>
                <div className={`p-6 ${isToday ? 'bg-gradient-to-r from-blue-50 to-purple-50' : hasCompleted ? 'bg-gradient-to-r from-green-50 to-teal-50' : 'bg-white'}`}>
                  <div className="flex items-start gap-6">
                    <div className="w-32 flex-shrink-0">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="font-bold text-xl text-gray-900">{day.name}</div>
                        {isToday && <Badge className="bg-blue-500 text-white text-xs">Today</Badge>}
                      </div>
                      <div className="text-sm text-gray-600">{day.date}</div>
                      {daySessions.length > 0 && (
                        <div className="mt-3 flex items-center gap-2">
                          {hasCompleted && <CheckCircle className="w-4 h-4 text-green-600" />}
                          <span className="text-xs text-gray-600">{daySessions.reduce((sum, session) => sum + session.durationMinutes, 0)} min</span>
                        </div>
                      )}
                    </div>

                    <div className="flex-1">
                      {daySessions.length > 0 ? (
                        <div className="space-y-3">
                          {daySessions.map((session) => {
                            const status = sessionStatuses[session.id] || session.status;
                            return (
                              <div key={session.id} className={`group p-5 rounded-xl transition-all hover:scale-102 ${status === 'completed' ? 'bg-white border-2 border-green-200 shadow-sm' : status === 'missed' ? 'bg-white border-2 border-amber-200 shadow-sm' : 'bg-white border-2 border-blue-200 shadow-md hover:shadow-lg'}`}>
                                <div className="flex items-start justify-between">
                                  <div className="flex items-start gap-4 flex-1">
                                    <div className={`text-3xl ${status === 'completed' ? 'opacity-50' : ''}`}>{session.icon}</div>
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2 mb-2">
                                        <h4 className={`font-semibold text-lg ${status === 'completed' ? 'text-gray-600 line-through' : 'text-gray-900'}`}>{session.topic}</h4>
                                        {session.isOptimal && <Badge className="bg-yellow-100 text-yellow-800 text-xs flex items-center gap-1"><Sparkles className="w-3 h-3" />Optimal Time</Badge>}
                                        <Badge variant="outline" className="text-xs">{session.recommendedResourceType}</Badge>
                                      </div>

                                      <div className="flex items-center gap-4 text-sm text-gray-600">
                                        <span className="flex items-center gap-1.5">
                                          <Clock className="w-4 h-4" />
                                          {session.time}
                                        </span>
                                        <span className="flex items-center gap-1.5">
                                          <Clock className="w-4 h-4" />
                                          {session.duration}
                                        </span>
                                      </div>

                                      <p className="mt-2 text-sm text-gray-600">{session.taskTitle}</p>
                                      <p className="mt-2 text-xs text-gray-500">{session.reason}</p>
                                      <p className="mt-1 text-xs text-gray-500">Support: {session.supportLevel}</p>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-2 flex-wrap justify-end">
                                    {status !== 'completed' && (
                                      <Button size="sm" className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 shadow-md" onClick={() => navigate('/lesson/1')}>
                                        <PlayCircle className="w-4 h-4 mr-1.5" />
                                        Start
                                      </Button>
                                    )}
                                    <Button size="sm" variant="outline" onClick={() => updateSessionStatus(session.id, 'completed')}>
                                      <CheckCircle className="w-4 h-4 mr-1.5" />
                                      Complete
                                    </Button>
                                    <Button size="sm" variant="outline" onClick={() => updateSessionStatus(session.id, 'missed')}>
                                      <AlertCircle className="w-4 h-4 mr-1.5" />
                                      Missed
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-xl">
                          <Calendar className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                          <div className="text-gray-400 text-sm mb-3">No sessions scheduled</div>
                          <Button size="sm" variant="outline" className="rounded-xl">
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

        <div className="flex justify-center gap-4">
          <Button size="lg" variant="outline" className="rounded-xl border-2 gap-2">
            <Plus className="w-5 h-5" />
            Add Custom Session
          </Button>
          <Button size="lg" className="rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg gap-2" onClick={() => navigate('/lesson/1')}>
            <Sparkles className="w-5 h-5" />
            Continue with Recommended Lesson
          </Button>
        </div>
      </div>
    </div>
  );
}
