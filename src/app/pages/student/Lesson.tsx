import { useState } from 'react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Badge } from '../../components/ui/badge';
import { Progress } from '../../components/ui/progress';
import { 
  MessageSquare, 
  Sparkles, 
  Send, 
  BookOpen, 
  CheckCircle,
  Clock,
  ArrowLeft,
  ArrowRight,
  Target,
  Lightbulb,
  Code2,
  PlayCircle,
  Gamepad2,
  Volume2,
  Loader2,
  Bot,
  User,
  ThumbsUp,
  ThumbsDown,
  Copy
} from 'lucide-react';
import { useNavigate } from 'react-router';
import HobbyExampleCard from '../../components/HobbyExampleCard';
import PersonaProfile from '../../components/PersonaProfile';
import { useLearner } from '../../contexts/LearnerContext';
import { getSubjectData } from '../../data/subjectData';
import { askTutor } from '../../utils/learnerApi';

function normalizeSubjectId(rawSubject?: string): 'programming' | 'writing' | 'science' {
  const normalized = (rawSubject || '').trim().toLowerCase();

  if (normalized === 'writing' || normalized === 'academic writing' || normalized === 'academic-writing') {
    return 'writing';
  }

  if (normalized === 'science') {
    return 'science';
  }

  return 'programming';
}

export default function Lesson() {
  const navigate = useNavigate();
  const { learner, updateLearner } = useLearner();
  const subjectId = normalizeSubjectId(learner?.subject);
  const subject = getSubjectData(subjectId);
  const currentConcept = learner?.diagnosticWeakConcept || subject?.concepts.find((concept) => concept.status !== 'mastered')?.name || subject?.concepts[0]?.name || 'Variables';
  const lessonTitle = subject?.lessons[0]?.title || 'Your Lesson';
  const lessonDescription = subject?.lessons[0]?.description || 'This lesson is personalized to your selected subject and learning goals.';
  const hobbyExample = subject?.hobbyExamples[0];
  const lessonContentBySubject: Record<'programming' | 'writing' | 'science', {
    keyConcepts: Array<{ title: string; detail: string; color: string }>;
    syntaxTitle: string;
    syntaxSnippet: string;
    practicePrompt: string;
    practiceCta: string;
    examples: Array<{ hobby: string; concept: string; example: string; code: string }>;
    practiceComingSoon: string;
  }> = {
    programming: {
      keyConcepts: [
        { title: 'Reusability', detail: 'Write code once, use it many times', color: 'blue' },
        { title: 'Parameters', detail: 'Pass data into functions to customize behavior', color: 'teal' },
        { title: 'Return Values', detail: 'Get results back from your functions', color: 'purple' },
      ],
      syntaxTitle: 'Function Syntax',
      syntaxSnippet: `// Define a function\nfunction greetPlayer(name) {\n  return "Welcome, " + name + "!";\n}\n\n// Use the function\nlet message = greetPlayer("Hero");\nconsole.log(message); // Output: "Welcome, Hero!"\n\n// Gaming example: Calculate damage\nfunction calculateDamage(baseDamage, criticalHit) {\n  if (criticalHit) {\n    return baseDamage * 2; // Double damage!\n  }\n  return baseDamage;\n}\n\nlet damage = calculateDamage(50, true);\nconsole.log(damage); // Output: 100`,
      practicePrompt: 'Create a function called powerUp that increases a player\'s strength by 10 points.',
      practiceCta: 'Start Practice Exercise',
      examples: [
        {
          hobby: 'gaming',
          concept: 'Function Parameters',
          example: 'Just like a character\'s attack can have different power levels, function parameters let you customize behavior.',
          code: `function playerAttack(enemy, attackPower) {\n  enemy.health -= attackPower;\n  console.log(\`${'${enemy.name}'} took ${'${attackPower}'} damage!\`);\n}\n\nlet boss = { name: "Dragon", health: 500 };\nplayerAttack(boss, 75);`,
        },
        {
          hobby: 'music',
          concept: 'Return Values',
          example: 'Think of a music equalizer that takes a volume level and returns the adjusted sound.',
          code: `function adjustVolume(currentVolume, adjustment) {\n  let newVolume = currentVolume + adjustment;\n  if (newVolume > 100) return 100;\n  if (newVolume < 0) return 0;\n  return newVolume;\n}\n\nconsole.log(adjustVolume(50, 25)); // 75`,
        },
      ],
      practiceComingSoon: 'Interactive coding challenges coming soon!',
    },
    writing: {
      keyConcepts: [
        { title: 'Clear Claim', detail: 'A thesis states your main argument clearly', color: 'blue' },
        { title: 'Focused Evidence', detail: 'Each paragraph supports one main point', color: 'teal' },
        { title: 'Strong Structure', detail: 'Organize ideas logically from intro to conclusion', color: 'purple' },
      ],
      syntaxTitle: 'Thesis and Paragraph Model',
      syntaxSnippet: `Thesis statement:\n"School libraries should stay open after class because they improve study access, reduce distraction, and support exam performance."\n\nBody paragraph structure:\n1) Topic sentence (point)\n2) Evidence (fact/example)\n3) Explanation (why it supports thesis)\n4) Link sentence (connect back to argument)\n\nQuick template:\nPoint -> Evidence -> Explanation -> Link`,
      practicePrompt: 'Write one thesis statement on a topic you care about, then draft a 4-sentence supporting paragraph.',
      practiceCta: 'Start Writing Practice',
      examples: [
        {
          hobby: 'music',
          concept: 'Paragraph Structure',
          example: 'Like a song, a paragraph needs a clear opening line, supporting lines, and a strong close.',
          code: `Topic sentence: Social media affects student focus in class.\nEvidence: A 2024 school survey found frequent phone use lowered quiz scores.\nExplanation: This suggests attention drops when notifications interrupt learning.\nLink: Therefore, phone limits can improve classroom concentration.`,
        },
        {
          hobby: 'gaming',
          concept: 'Thesis Statement',
          example: 'A thesis is like your game objective: one clear mission that guides every move.',
          code: `Weak thesis: Gaming is popular.\nStrong thesis: Story-based games can improve reading comprehension because players analyze dialogue, infer meaning, and track complex plots.`,
        },
      ],
      practiceComingSoon: 'Interactive writing drills coming soon!',
    },
    science: {
      keyConcepts: [
        { title: 'Cause and Effect', detail: 'Forces cause changes in motion', color: 'blue' },
        { title: 'Evidence First', detail: 'Use observations and data to justify claims', color: 'teal' },
        { title: 'Model Thinking', detail: 'Use simple models to explain real-world behavior', color: 'purple' },
      ],
      syntaxTitle: 'Scientific Explanation Pattern',
      syntaxSnippet: `Question: Why does a ball speed up when kicked harder?\n\nClaim: A stronger force increases acceleration.\nEvidence: In repeated trials, larger kick force produced higher speed.\nReasoning: By Newton\'s second law, more net force causes greater acceleration.\n\nFormula reminder: F = m * a`,
      practicePrompt: 'Choose one everyday motion example and explain it using claim, evidence, and reasoning.',
      practiceCta: 'Start Science Practice',
      examples: [
        {
          hobby: 'gaming',
          concept: 'Forces and Motion',
          example: 'In racing games, a boost applies extra force so your car accelerates faster.',
          code: `Observation: Boost activated -> speed rises quickly.\nConcept: Extra force changes velocity.\nConclusion: Greater applied force means greater acceleration (if mass is constant).`,
        },
        {
          hobby: 'sports',
          concept: 'Scientific Method',
          example: 'You can test which running shoe gives better sprint time by controlling distance and surface.',
          code: `Question: Which shoe improves sprint speed?\nHypothesis: Shoe A reduces sprint time.\nTest: Run 5 timed trials per shoe on same track.\nResult: Compare average times.`,
        },
      ],
      practiceComingSoon: 'Interactive science investigations coming soon!',
    },
  };
  const activeLessonContent = lessonContentBySubject[subjectId];
  const [message, setMessage] = useState('');
  const [sourceMode, setSourceMode] = useState<'official' | 'uploaded' | 'both'>('both');
  const [sending, setSending] = useState(false);
  const [chatHistory, setChatHistory] = useState([
    {
      type: 'ai',
      message: `Hi! I'm your AI tutor. We're learning ${subject?.name || 'your chosen subject'} today, and I can explain ${currentConcept} using your hobbies or saved notes.`,
      timestamp: '2:00 PM',
      sourceUsed: 'official'
    }
  ]);
  const sourceModeLabel = sourceMode === 'official' ? 'official' : sourceMode === 'uploaded' ? 'uploaded' : 'both';

  const handleSendMessage = async (actionType: 'normal' | 'explain_simpler' | 'another_example' | 'use_hobby' | 'uploaded_only' = 'normal', promptOverride?: string) => {
    const questionText = (promptOverride || message).trim();

    if (!questionText) {
      return;
    }

    const userMessage = {
      type: 'user',
      message: questionText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatHistory((previous) => [...previous, userMessage]);
    setMessage('');
    setSending(true);

    try {
      const response = await askTutor({
        userId: learner?.id || '',
        subject: subjectId,
        concept: currentConcept,
        question: questionText,
        sourceMode,
        learnerProfile: learner || {},
        actionType,
      });

      const aiMessage = {
        type: 'ai',
        message: response.answer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sourceUsed: response.sourceUsed,
      };

      setChatHistory((previous) => [...previous, aiMessage]);
      updateLearner({
        recentTutorActivity: {
          concept: currentConcept,
          question: questionText,
          sourceUsed: response.sourceUsed,
          answerPreview: response.answer.slice(0, 140),
          createdAt: new Date().toISOString(),
        },
      });
    } catch {
      setChatHistory((previous) => [...previous, {
        type: 'ai',
        message: 'I could not reach the tutor service, so I am using the lesson content and your profile to keep the explanation going.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sourceUsed: sourceMode,
      }]);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20 flex">
      {/* Main Content */}
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Premium Header */}
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => navigate('/dashboard')}
                  className="rounded-xl"
                >
                  <ArrowLeft className="w-5 h-5" />
                </Button>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h1 className="text-3xl font-bold">{lessonTitle}</h1>
                    <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-200">Intermediate</Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4" />
                      Module 2 • Lesson 3
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4" />
                      {subject?.lessons[0]?.duration || '~30 min'}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Target className="w-4 h-4" />
                      Personalized Match
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <Button size="lg" className="bg-green-600 hover:bg-green-700 shadow-lg">
              <CheckCircle className="w-5 h-5 mr-2" />
              Mark Complete
            </Button>
          </div>

          {/* Learning Profile Context */}
          <Card className="p-5 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-600" />
                <span className="font-semibold text-gray-900">Personalized for Your Learning Style</span>
              </div>
            </div>
            <PersonaProfile variant="compact" />
          </Card>

          {/* Lesson Progress */}
          <Card className="p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-700">Lesson Progress</span>
              <span className="text-sm font-semibold text-purple-600">35% Complete</span>
            </div>
            <Progress value={35} className="h-2.5" />
            <div className="flex justify-between mt-3">
              <Button variant="outline" size="sm" className="rounded-xl">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous Lesson
              </Button>
              <Button size="sm" className="rounded-xl bg-gradient-to-r from-blue-500 to-purple-500">
                Next Lesson
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </Card>

          {/* Main Content Card */}
          <Card className="shadow-lg border-gray-200">
            <Tabs defaultValue="lesson" className="w-full">
              <div className="border-b border-gray-200 px-6 pt-4">
                <TabsList className="bg-gray-100 p-1 rounded-xl">
                  <TabsTrigger value="lesson" className="rounded-lg">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Lesson
                  </TabsTrigger>
                  <TabsTrigger value="examples" className="rounded-lg">
                    <Gamepad2 className="w-4 h-4 mr-2" />
                    Your Examples
                  </TabsTrigger>
                  <TabsTrigger value="practice" className="rounded-lg">
                    <Code2 className="w-4 h-4 mr-2" />
                    Practice
                  </TabsTrigger>
                  <TabsTrigger value="notes" className="rounded-lg">
                    <Lightbulb className="w-4 h-4 mr-2" />
                    Notes
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="lesson" className="p-8 space-y-6">
                <div className="prose max-w-none">
                  {/* Introduction */}
                  <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-gray-900">About this lesson</h2>
                    <p className="text-gray-700 leading-relaxed text-lg">
                      {lessonDescription}
                    </p>
                  </div>

                  {/* Gaming Example Callout */}
                  <div className="my-6 p-6 bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-2xl">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0 shadow-lg">
                        <Gamepad2 className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-purple-900 mb-2">{hobbyExample ? `🎮 Your ${hobbyExample.hobby} Example` : '🎮 Your Example'}</p>
                        <p className="text-gray-700 leading-relaxed">
                          {hobbyExample?.example || 'This section uses your saved hobbies and subject to explain the concept in a familiar way.'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Key Concepts */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-gray-900">Key Concepts</h3>
                    <div className="grid gap-4">
                      {activeLessonContent.keyConcepts.map((concept) => (
                        <div
                          key={concept.title}
                          className={`flex items-start gap-3 p-4 rounded-xl border ${
                            concept.color === 'teal'
                              ? 'bg-teal-50 border-teal-200'
                              : concept.color === 'purple'
                              ? 'bg-purple-50 border-purple-200'
                              : 'bg-blue-50 border-blue-200'
                          }`}
                        >
                          <CheckCircle
                            className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                              concept.color === 'teal'
                                ? 'text-teal-600'
                                : concept.color === 'purple'
                                ? 'text-purple-600'
                                : 'text-blue-600'
                            }`}
                          />
                          <div>
                            <p className="font-semibold text-gray-900 mb-1">{concept.title}</p>
                            <p className="text-sm text-gray-700">{concept.detail}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Code Example */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-gray-900">{activeLessonContent.syntaxTitle}</h3>
                    <div className="relative group">
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        Copy
                      </Button>
                      <pre className="bg-gray-900 text-gray-100 p-6 rounded-xl overflow-x-auto shadow-lg whitespace-pre-wrap">
                        <code className="text-sm">{activeLessonContent.syntaxSnippet}</code>
                      </pre>
                      <Button 
                        size="sm" 
                        className="mt-3 bg-green-600 hover:bg-green-700"
                      >
                        <PlayCircle className="w-4 h-4 mr-2" />
                        Run Code
                      </Button>
                    </div>
                  </div>

                  {/* Try it yourself */}
                  <div className="p-6 bg-gradient-to-r from-teal-50 to-cyan-50 border-2 border-teal-200 rounded-2xl">
                    <div className="flex items-center gap-3 mb-4">
                      <Lightbulb className="w-6 h-6 text-teal-600" />
                      <h4 className="text-lg font-bold text-gray-900">Try It Yourself</h4>
                    </div>
                    <p className="text-gray-700 mb-4">
                      {activeLessonContent.practicePrompt}
                    </p>
                    <Button className="bg-teal-600 hover:bg-teal-700">
                      {activeLessonContent.practiceCta}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="examples" className="p-8">
                <div className="space-y-6">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold mb-2">Examples Tailored to Your Interests</h3>
                    <p className="text-gray-600">These examples use gaming and music - your favorite hobbies!</p>
                  </div>
                  
                  {activeLessonContent.examples.map((example) => (
                    <HobbyExampleCard
                      key={`${example.hobby}-${example.concept}`}
                      hobby={example.hobby}
                      concept={example.concept}
                      example={example.example}
                      code={example.code}
                    />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="practice" className="p-8">
                <div className="text-center py-12">
                  <Code2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Practice Exercises</h3>
                  <p className="text-gray-600 mb-6">{activeLessonContent.practiceComingSoon}</p>
                  <Button>{activeLessonContent.practiceCta}</Button>
                </div>
              </TabsContent>

              <TabsContent value="notes" className="p-8">
                <div className="text-center py-12">
                  <Lightbulb className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Your Notes</h3>
                  <p className="text-gray-600 mb-6">Take notes while you learn</p>
                  <Button>Create Note</Button>
                </div>
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </div>

      {/* Premium AI Tutor Sidebar */}
      <div className="w-[420px] bg-white border-l border-gray-200 flex flex-col overflow-hidden shadow-xl">
        {/* Header */}
        <div className="bg-gradient-to-br from-purple-600 via-purple-700 to-pink-600 p-6 text-white">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Bot className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-lg">AI Tutor</h2>
              <p className="text-xs text-purple-100">Personalized for you</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-purple-100">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span>Online & Ready to Help</span>
          </div>
          <div className="mt-4 flex flex-wrap gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/90">
            <span className="rounded-full bg-white/15 px-2.5 py-1">Uses learner profile</span>
            <span className="rounded-full bg-white/15 px-2.5 py-1">Uses uploaded notes when selected</span>
            <span className="rounded-full bg-white/15 px-2.5 py-1">Source mode: {sourceModeLabel}</span>
          </div>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-gray-50 to-white">
          {chatHistory.map((chat, index) => (
            <div key={index} className={`flex gap-3 ${chat.type === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                chat.type === 'ai'
                  ? 'bg-gradient-to-br from-purple-500 to-pink-500'
                  : 'bg-gradient-to-br from-blue-500 to-teal-500'
              }`}>
                {chat.type === 'ai' ? (
                  <Bot className="w-5 h-5 text-white" />
                ) : (
                  <User className="w-5 h-5 text-white" />
                )}
              </div>
              <div className={`flex-1 ${chat.type === 'user' ? 'text-right' : ''}`}>
                <div className={`inline-block max-w-[85%] p-4 rounded-2xl ${
                  chat.type === 'ai'
                    ? 'bg-white border border-gray-200 shadow-sm'
                    : 'bg-gradient-to-r from-blue-500 to-teal-500 text-white'
                }`}>
                  <p className="text-sm leading-relaxed">{chat.message}</p>
                </div>
                <div className="flex items-center gap-3 mt-2 px-2">
                  <span className="text-xs text-gray-500">{chat.timestamp}</span>
                  {chat.type === 'ai' && (
                    <div className="flex gap-1 items-center">
                      <span className="text-[10px] uppercase tracking-wide text-purple-600 bg-purple-50 px-2 py-1 rounded-full">
                        {chat.sourceUsed || 'official'}
                      </span>
                      <Button size="icon" variant="ghost" className="h-6 w-6 hover:bg-gray-100">
                        <ThumbsUp className="w-3 h-3" />
                      </Button>
                      <Button size="icon" variant="ghost" className="h-6 w-6 hover:bg-gray-100">
                        <ThumbsDown className="w-3 h-3" />
                      </Button>
                      <Button size="icon" variant="ghost" className="h-6 w-6 hover:bg-gray-100">
                        <Copy className="w-3 h-3" />
                      </Button>
                      <Button size="icon" variant="ghost" className="h-6 w-6 hover:bg-gray-100">
                        <Volume2 className="w-3 h-3" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="border-t border-gray-200 bg-gray-50 p-4 space-y-4">
          <div>
            <p className="mb-3 text-xs font-medium uppercase text-gray-500">Quick Actions</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                className="rounded-xl border border-gray-200 bg-white p-3 text-left text-xs transition-all hover:border-purple-300 hover:bg-purple-50"
                onClick={() => void handleSendMessage('explain_simpler', 'Explain this more simply.')}
              >
                <div className="mb-1 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-purple-500" />
                  <span className="font-medium">Simpler</span>
                </div>
                <span className="text-gray-500">Explain easier</span>
              </button>

              <button
                type="button"
                className="rounded-xl border border-gray-200 bg-white p-3 text-left text-xs transition-all hover:border-blue-300 hover:bg-blue-50"
                onClick={() => void handleSendMessage('another_example', 'Give me another example.')}
              >
                <div className="mb-1 flex items-center gap-2">
                  <Gamepad2 className="h-4 w-4 text-blue-500" />
                  <span className="font-medium">Gaming</span>
                </div>
                <span className="text-gray-500">Use examples</span>
              </button>

              <button
                type="button"
                className="rounded-xl border border-gray-200 bg-white p-3 text-left text-xs transition-all hover:border-teal-300 hover:bg-teal-50"
                onClick={() => void handleSendMessage('use_hobby', 'Use my hobby in the example.')}
              >
                <div className="mb-1 flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-teal-500" />
                  <span className="font-medium">Summarize</span>
                </div>
                <span className="text-gray-500">Use notes</span>
              </button>

              <button
                type="button"
                className="rounded-xl border border-gray-200 bg-white p-3 text-left text-xs transition-all hover:border-orange-300 hover:bg-orange-50"
                onClick={() => void handleSendMessage('uploaded_only', 'Use my uploaded notes.')}
              >
                <div className="mb-1 flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-orange-500" />
                  <span className="font-medium">Quiz Me</span>
                </div>
                <span className="text-gray-500">Test knowledge</span>
              </button>
            </div>
          </div>

          <div>
            <p className="mb-2 text-xs font-medium uppercase text-gray-500">Source Mode</p>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'official', label: 'Official content only' },
                { id: 'uploaded', label: 'My uploaded notes only' },
                { id: 'both', label: 'Both' },
              ].map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setSourceMode(option.id as 'official' | 'uploaded' | 'both')}
                  className={`rounded-xl border px-3 py-2 text-xs transition-all ${
                    sourceMode === option.id
                      ? 'border-purple-500 bg-purple-50 text-purple-700'
                      : 'border-gray-200 bg-white text-gray-600 hover:border-purple-300'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-200 bg-white p-4">
          <div className="flex gap-2">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && void handleSendMessage()}
              placeholder={`Ask about ${currentConcept}...`}
              className="flex-1 rounded-xl border-gray-300 focus:border-purple-500"
            />
            <Button
              onClick={() => void handleSendMessage()}
              disabled={sending}
              className="h-11 w-11 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg hover:from-purple-600 hover:to-pink-600"
            >
              {sending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
            </Button>
          </div>
          <p className="mt-2 text-center text-xs text-gray-500">
            Powered by AI when available, with a deterministic fallback when the key is missing.
          </p>
        </div>
      </div>
    </div>
  );
}
