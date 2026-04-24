import { Card } from '../../../components/ui/card';
import { Code, FileText, Atom, Plus } from 'lucide-react';

interface SubjectStepProps {
  data: { subject: string };
  updateData: (data: any) => void;
}

const subjects = [
  {
    id: 'programming',
    name: 'Programming',
    icon: <Code className="w-8 h-8 text-[#3b82f6]" />,
    description: 'Learn coding fundamentals, variables, loops, and functions',
    difficulty: 'Beginner Friendly',
    duration: '12-16 weeks',
    color: 'from-blue-500 to-blue-600'
  },
  {
    id: 'writing',
    name: 'Academic Writing',
    icon: <FileText className="w-8 h-8 text-[#14b8a6]" />,
    description: 'Master thesis statements, paragraph structure, grammar, and referencing',
    difficulty: 'All Levels',
    duration: '8-10 weeks',
    color: 'from-teal-500 to-teal-600'
  },
  {
    id: 'science',
    name: 'Science',
    icon: <Atom className="w-8 h-8 text-[#a855f7]" />,
    description: 'Explore scientific concepts and principles',
    difficulty: 'Beginner Friendly',
    duration: '10-14 weeks',
    color: 'from-purple-500 to-purple-600'
  }
];

export default function SubjectStep({ data, updateData }: SubjectStepProps) {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-gray-900">What do you want to learn?</h2>
        <p className="text-gray-600">Choose your subject or learning track</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 pt-4">
        {subjects.map((subject) => (
          <Card
            key={subject.id}
              className={`p-6 cursor-pointer transition-all hover:shadow-lg ${
              data.subject === subject.id
                ? 'border-2 border-[#1e40af] shadow-lg'
                : 'border-2 border-transparent'
            }`}
            onClick={() => updateData({ subject: subject.id })}
          >
            <div className="flex items-start gap-4">
              <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${subject.color} flex items-center justify-center flex-shrink-0`}>
                {subject.icon}
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-lg mb-1">{subject.name}</h3>
                <p className="text-sm text-gray-600 mb-3">{subject.description}</p>
                
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {subject.difficulty}
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    {subject.duration}
                  </span>
                </div>
              </div>
            </div>

            {data.subject === subject.id && (
              <div className="mt-4 pt-4 border-t">
                <div className="flex items-center gap-2 text-[#1e40af]">
                  <div className="w-5 h-5 rounded-full bg-[#1e40af] flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium">Selected</span>
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>

      {data.subject && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm">
          <p className="text-gray-700">
            <strong>Note:</strong> You can always change subjects or add more tracks later from your dashboard.
          </p>
        </div>
      )}
    </div>
  );
}
