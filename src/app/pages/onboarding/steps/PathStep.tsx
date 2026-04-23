import { Card } from '../../../components/ui/card';
import { Video, BookOpen, CheckSquare, Code, Shuffle } from 'lucide-react';

interface PathStepProps {
  data: { pathPreference: string };
  updateData: (data: any) => void;
}

const paths = [
  { id: 'video', label: 'Video-First', icon: <Video className="w-6 h-6" />, desc: 'Learn through visual content' },
  { id: 'reading', label: 'Reading-First', icon: <BookOpen className="w-6 h-6" />, desc: 'Prefer text-based materials' },
  { id: 'quiz', label: 'Quiz-First', icon: <CheckSquare className="w-6 h-6" />, desc: 'Test yourself, then learn' },
  { id: 'practice', label: 'Practice-First', icon: <Code className="w-6 h-6" />, desc: 'Learn by doing' },
  { id: 'mixed', label: 'Mixed', icon: <Shuffle className="w-6 h-6" />, desc: 'Variety of all formats' }
];

export default function PathStep({ data, updateData }: PathStepProps) {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-gray-900">How do you prefer to learn?</h2>
        <p className="text-gray-600">Choose your preferred content format</p>
      </div>

      <div className="grid md:grid-cols-3 gap-4 pt-4">
        {paths.map((path) => (
          <Card
            key={path.id}
            className={`p-6 cursor-pointer transition-all hover:shadow-md ${
              data.pathPreference === path.id
                ? 'border-2 border-[#1e40af] bg-blue-50'
                : 'border-2 border-transparent'
            }`}
            onClick={() => updateData({ pathPreference: path.id })}
          >
            <div className="flex flex-col items-center text-center gap-3">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                data.pathPreference === path.id ? 'bg-[#1e40af] text-white' : 'bg-gray-100'
              }`}>
                {path.icon}
              </div>
              <div>
                <div className="font-medium mb-1">{path.label}</div>
                <div className="text-sm text-gray-600">{path.desc}</div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
