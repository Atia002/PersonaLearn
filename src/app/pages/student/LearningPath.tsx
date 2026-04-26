import { useLearner } from '../../contexts/LearnerContext';
import { getSubjectData } from '../../data/subjectData';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Progress } from '../../components/ui/progress';
import { CheckCircle, Circle, Lock, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router';

export default function LearningPath() {
  const navigate = useNavigate();
  const { learner, updateLearner } = useLearner();
  const subject = getSubjectData(learner?.subject || 'programming');

  const modules = (subject?.concepts || []).map((concept, index) => ({
    id: index + 1,
    name: concept.name,
    status: concept.status === 'mastered' ? 'completed' : concept.status === 'learning' ? 'in-progress' : concept.status === 'needs-review' ? 'available' : 'locked',
    progress: concept.mastery,
    lessons: subject?.lessons.filter((lesson) => lesson.module.toLowerCase().includes(concept.name.split(' ')[0].toLowerCase())).length || 1,
  }));

  const getStatusIcon = (status: string) => {
    if (status === 'completed') return <CheckCircle className="w-6 h-6 text-green-500" />;
    if (status === 'in-progress') return <Circle className="w-6 h-6 text-blue-500" />;
    if (status === 'locked') return <Lock className="w-6 h-6 text-gray-400" />;
    return <Circle className="w-6 h-6 text-gray-300" />;
  };

  const openModuleLesson = (moduleName: string) => {
    updateLearner({
      diagnosticWeakConcept: moduleName,
    });
    navigate('/lesson/1');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">My Learning Path</h1>
          <p className="text-gray-600">Personalized sequence for {subject?.name || 'your selected subject'} based on your goals and progress</p>
        </div>

        <Card className="p-6">
          <h2 className="font-semibold mb-4">{subject?.name || 'Personalized'} Track</h2>
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
                      <Button onClick={() => openModuleLesson(module.name)}>
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
