import { Card } from './ui/card';
import { Gamepad2, Music, Palette, Dumbbell, Camera, Sparkles } from 'lucide-react';

interface HobbyExampleProps {
  hobby: string;
  concept: string;
  example: string;
  code?: string;
}

const hobbyIcons = {
  gaming: <Gamepad2 className="w-5 h-5" />,
  music: <Music className="w-5 h-5" />,
  art: <Palette className="w-5 h-5" />,
  sports: <Dumbbell className="w-5 h-5" />,
  photography: <Camera className="w-5 h-5" />,
};

const hobbyColors = {
  gaming: 'from-purple-500 to-pink-500',
  music: 'from-blue-500 to-cyan-500',
  art: 'from-orange-500 to-red-500',
  sports: 'from-green-500 to-teal-500',
  photography: 'from-indigo-500 to-purple-500',
};

export default function HobbyExampleCard({ hobby, concept, example, code }: HobbyExampleProps) {
  const icon = hobbyIcons[hobby.toLowerCase() as keyof typeof hobbyIcons] || <Sparkles className="w-5 h-5" />;
  const gradient = hobbyColors[hobby.toLowerCase() as keyof typeof hobbyColors] || 'from-blue-500 to-teal-500';

  return (
    <Card className="overflow-hidden border-2 hover:shadow-lg transition-all duration-300">
      {/* Header with hobby indicator */}
      <div className={`bg-gradient-to-r ${gradient} p-4 text-white`}>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
            {icon}
          </div>
          <div>
            <div className="text-xs font-medium opacity-90">Your {hobby} Example</div>
            <div className="text-sm font-semibold">{concept}</div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <p className="text-sm text-gray-700 leading-relaxed">{example}</p>
        
        {code && (
          <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
            <pre className="text-xs text-gray-100">
              <code>{code}</code>
            </pre>
          </div>
        )}

        <div className="flex items-center gap-2 pt-2 text-xs text-gray-500">
          <Sparkles className="w-3.5 h-3.5 text-purple-500" />
          <span>Personalized for you based on your interests</span>
        </div>
      </div>
    </Card>
  );
}
