import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Progress } from '../../components/ui/progress';
import { CheckCircle, Circle, Lock, ArrowRight } from 'lucide-react';

export default function LearningPath() {
  const modules = [
    { id: 1, name: 'Variables & Data Types', status: 'completed', progress: 100, lessons: 5 },
    { id: 2, name: 'Functions', status: 'in-progress', progress: 60, lessons: 8 },
    { id: 3, name: 'Loops & Iteration', status: 'available', progress: 0, lessons: 6 },
    { id: 4, name: 'Arrays & Objects', status: 'locked', progress: 0, lessons: 10 },
    { id: 5, name: 'DOM Manipulation', status: 'locked', progress: 0, lessons: 7 },
  ];

  const getStatusIcon = (status: string) => {
    if (status === 'completed') return <CheckCircle className="w-6 h-6 text-green-500" />;
    if (status === 'in-progress') return <Circle className="w-6 h-6 text-blue-500" />;
    if (status === 'locked') return <Lock className="w-6 h-6 text-gray-400" />;
    return <Circle className="w-6 h-6 text-gray-300" />;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">My Learning Path</h1>
          <p className="text-gray-600">Personalized sequence based on your goals and progress</p>
        </div>

        <Card className="p-6">
          <h2 className="font-semibold mb-4">JavaScript Fundamentals Track</h2>
          <div className="space-y-4">
            {modules.map((module, index) => (
              <div key={module.id}>
                <Card className={`p-6 ${module.status === 'locked' ? 'opacity-60' : 'hover:shadow-md'} transition-shadow`}>
                  <div className="flex items-center gap-4">
                    {getStatusIcon(module.status)}
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">{module.name}</h3>
                        <span className="text-sm text-gray-500">{module.lessons} lessons</span>
                      </div>
                      
                      {module.progress > 0 && (
                        <div className="space-y-1">
                          <Progress value={module.progress} className="h-2" />
                          <span className="text-xs text-gray-500">{module.progress}% complete</span>
                        </div>
                      )}

                      {module.status === 'locked' && (
                        <p className="text-sm text-gray-500">Complete previous modules to unlock</p>
                      )}
                    </div>

                    {module.status !== 'locked' && (
                      <Button>
                        {module.status === 'completed' ? 'Review' : module.status === 'in-progress' ? 'Continue' : 'Start'}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    )}
                  </div>
                </Card>

                {index < modules.length - 1 && (
                  <div className="flex justify-center my-2">
                    <div className="w-0.5 h-8 bg-gray-300"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
