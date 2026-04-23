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

export default function Lesson() {
  const navigate = useNavigate();
  const { learner } = useLearner();
  const subject = getSubjectData(learner?.subject || 'programming');
  const lessonTitle = subject?.lessons[0]?.title || 'Your Lesson';
  const lessonDescription = subject?.lessons[0]?.description || 'This lesson is personalized to your selected subject and learning goals.';
  const hobbyExample = subject?.hobbyExamples[0];
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    {
      type: 'ai',
      message: `Hi! I'm your AI tutor. We're learning ${subject?.name || 'your chosen subject'} today, and I can explain concepts using your hobbies. What would you like to know?`,
      timestamp: '2:00 PM'
    }
  ]);

  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    setChatHistory([...chatHistory, {
      type: 'user',
      message: message,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);
    
    // Simulate AI response
    setTimeout(() => {
      setChatHistory(prev => [...prev, {
        type: 'ai',
        message: "Great question! Let me explain that with a gaming analogy...",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }, 1000);
    
    setMessage('');
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
                      <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl border border-blue-200">
                        <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-gray-900 mb-1">Reusability</p>
                          <p className="text-sm text-gray-700">Write code once, use it many times</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-4 bg-teal-50 rounded-xl border border-teal-200">
                        <CheckCircle className="w-5 h-5 text-teal-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-gray-900 mb-1">Parameters</p>
                          <p className="text-sm text-gray-700">Pass data into functions to customize behavior</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-4 bg-purple-50 rounded-xl border border-purple-200">
                        <CheckCircle className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-gray-900 mb-1">Return Values</p>
                          <p className="text-sm text-gray-700">Get results back from your functions</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Code Example */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-gray-900">Function Syntax</h3>
                    <div className="relative group">
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        Copy
                      </Button>
                      <pre className="bg-gray-900 text-gray-100 p-6 rounded-xl overflow-x-auto shadow-lg">
                        <code className="text-sm">{`// Define a function
function greetPlayer(name) {
  return "Welcome, " + name + "!";
}

// Use the function
let message = greetPlayer("Hero");
console.log(message); // Output: "Welcome, Hero!"

// Gaming example: Calculate damage
function calculateDamage(baseDamage, criticalHit) {
  if (criticalHit) {
    return baseDamage * 2; // Double damage!
  }
  return baseDamage;
}

let damage = calculateDamage(50, true);
console.log(damage); // Output: 100`}</code>
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
                      Create a function called <code className="px-2 py-1 bg-teal-100 rounded">powerUp</code> that increases 
                      a player's strength by 10 points.
                    </p>
                    <Button className="bg-teal-600 hover:bg-teal-700">
                      Start Practice Exercise
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
                  
                  <HobbyExampleCard
                    hobby="gaming"
                    concept="Function Parameters"
                    example="Just like a character's attack can have different power levels, function parameters let you customize behavior. The 'attackPower' parameter determines how much damage is dealt."
                    code={`function playerAttack(enemy, attackPower) {
  enemy.health -= attackPower;
  console.log(\`\${enemy.name} took \${attackPower} damage!\`);
}

let boss = { name: "Dragon", health: 500 };
playerAttack(boss, 75);`}
                  />

                  <HobbyExampleCard
                    hobby="music"
                    concept="Return Values"
                    example="Think of a music equalizer that takes a volume level and returns the adjusted sound. Functions can process input and return results, just like audio processing!"
                    code={`function adjustVolume(currentVolume, adjustment) {
  let newVolume = currentVolume + adjustment;
  // Keep volume between 0 and 100
  if (newVolume > 100) return 100;
  if (newVolume < 0) return 0;
  return newVolume;
}

let volume = adjustVolume(50, 25);
console.log(volume); // Output: 75`}
                  />
                </div>
              </TabsContent>

              <TabsContent value="practice" className="p-8">
                <div className="text-center py-12">
                  <Code2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Practice Exercises</h3>
                  <p className="text-gray-600 mb-6">Interactive coding challenges coming soon!</p>
                  <Button>Start Coding Challenge</Button>
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
                    <div className="flex gap-1">
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
        <div className="p-4 bg-gray-50 border-t border-gray-200">
          <p className="text-xs font-medium text-gray-500 uppercase mb-3">Quick Actions</p>
          <div className="grid grid-cols-2 gap-2">
            <button className="p-3 bg-white hover:bg-purple-50 border border-gray-200 hover:border-purple-300 rounded-xl text-left text-xs transition-all group">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-4 h-4 text-purple-500" />
                <span className="font-medium">Simpler</span>
              </div>
              <span className="text-gray-500 text-xs">Explain easier</span>
            </button>
            <button className="p-3 bg-white hover:bg-blue-50 border border-gray-200 hover:border-blue-300 rounded-xl text-left text-xs transition-all group">
              <div className="flex items-center gap-2 mb-1">
                <Gamepad2 className="w-4 h-4 text-blue-500" />
                <span className="font-medium">Gaming</span>
              </div>
              <span className="text-gray-500 text-xs">Use examples</span>
            </button>
            <button className="p-3 bg-white hover:bg-teal-50 border border-gray-200 hover:border-teal-300 rounded-xl text-left text-xs transition-all group">
              <div className="flex items-center gap-2 mb-1">
                <BookOpen className="w-4 h-4 text-teal-500" />
                <span className="font-medium">Summarize</span>
              </div>
              <span className="text-gray-500 text-xs">Key points</span>
            </button>
            <button className="p-3 bg-white hover:bg-orange-50 border border-gray-200 hover:border-orange-300 rounded-xl text-left text-xs transition-all group">
              <div className="flex items-center gap-2 mb-1">
                <Lightbulb className="w-4 h-4 text-orange-500" />
                <span className="font-medium">Quiz Me</span>
              </div>
              <span className="text-gray-500 text-xs">Test knowledge</span>
            </button>
          </div>
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-gray-200">
          <div className="flex gap-2">
            <Input
              placeholder="Ask anything about functions..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1 border-gray-300 focus:border-purple-500 rounded-xl"
            />
            <Button 
              size="icon"
              onClick={handleSendMessage}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-xl w-11 h-11 shadow-lg"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">
            Powered by AI • Personalized to your learning style
          </p>
        </div>
      </div>
    </div>
  );
}
