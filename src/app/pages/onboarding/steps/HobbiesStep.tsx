import { useState } from 'react';
import { Card } from '../../../components/ui/card';
import { Input } from '../../../components/ui/input';
import { Gamepad2, Music, Palette, DollarSign, Atom, Film, Plane, Smartphone, Book, Code, Utensils, TreePine, Star } from 'lucide-react';
import { getHobbyLabel } from '../../../data/hobbiesData';

interface HobbiesStepProps {
  data: { hobbies: string[] };
  updateData: (data: any) => void;
}

const hobbiesOptions = [
  { id: 'sports', label: 'Sports', icon: <Star className="w-5 h-5" /> },
  { id: 'music', label: 'Music', icon: <Music className="w-5 h-5" /> },
  { id: 'gaming', label: 'Gaming', icon: <Gamepad2 className="w-5 h-5" /> },
  { id: 'art', label: 'Art & Design', icon: <Palette className="w-5 h-5" /> },
  { id: 'business', label: 'Business', icon: <DollarSign className="w-5 h-5" /> },
  { id: 'science', label: 'Science', icon: <Atom className="w-5 h-5" /> },
  { id: 'movies', label: 'Movies & Anime', icon: <Film className="w-5 h-5" /> },
  { id: 'travel', label: 'Travel', icon: <Plane className="w-5 h-5" /> },
  { id: 'social', label: 'Social Media', icon: <Smartphone className="w-5 h-5" /> },
  { id: 'books', label: 'Books/Storytelling', icon: <Book className="w-5 h-5" /> },
  { id: 'coding', label: 'Coding/Tech', icon: <Code className="w-5 h-5" /> },
  { id: 'cooking', label: 'Cooking', icon: <Utensils className="w-5 h-5" /> },
  { id: 'nature', label: 'Nature', icon: <TreePine className="w-5 h-5" /> }
];

export default function HobbiesStep({ data, updateData }: HobbiesStepProps) {
  const [customHobby, setCustomHobby] = useState('');

  const toggleHobby = (hobbyId: string) => {
    const newHobbies = data.hobbies.includes(hobbyId)
      ? data.hobbies.filter(h => h !== hobbyId)
      : [...data.hobbies, hobbyId];
    updateData({ hobbies: newHobbies });
  };

  const addCustomHobby = () => {
    if (customHobby && !data.hobbies.includes(customHobby)) {
      updateData({ hobbies: [...data.hobbies, customHobby] });
      setCustomHobby('');
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-gray-900">What are your hobbies & interests?</h2>
        <p className="text-gray-600">We'll use these to create relatable examples you'll love</p>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-teal-50 border border-blue-200 rounded-lg p-4 text-sm">
        <p className="text-gray-700">
          <strong>Why this matters:</strong> If you love gaming, we might explain loops using game mechanics. 
          If you're into music, we could explain patterns through playlist creation!
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-4">
        {hobbiesOptions.map((hobby) => (
          <Card
            key={hobby.id}
            className={`p-4 cursor-pointer transition-all hover:shadow-md ${
              data.hobbies.includes(hobby.id)
                ? 'border-2 border-[#1e40af] bg-blue-50'
                : 'border-2 border-transparent'
            }`}
            onClick={() => toggleHobby(hobby.id)}
          >
            <div className="flex flex-col items-center text-center gap-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                data.hobbies.includes(hobby.id) ? 'bg-[#1e40af] text-white' : 'bg-gray-100'
              }`}>
                {hobby.icon}
              </div>
              <span className="text-sm font-medium">{hobby.label}</span>
            </div>
          </Card>
        ))}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Add your own</label>
        <div className="flex gap-2">
          <Input
            placeholder="e.g., Photography, Chess..."
            value={customHobby}
            onChange={(e) => setCustomHobby(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addCustomHobby()}
          />
          <button
            onClick={addCustomHobby}
            className="px-4 py-2 bg-[#1e40af] text-white rounded-lg hover:bg-[#1e40af]/90 whitespace-nowrap"
          >
            Add
          </button>
        </div>
      </div>

      {data.hobbies.length > 0 && (
        <div className="pt-2">
          <p className="text-sm text-gray-600 mb-2">Selected: {data.hobbies.length} interests</p>
          <div className="flex flex-wrap gap-2">
            {data.hobbies.map((hobby) => (
              <span
                key={hobby}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-blue-100 text-[#1e40af]"
              >
                {getHobbyLabel(hobby)}
                <button
                  onClick={() => toggleHobby(hobby)}
                  className="ml-1 hover:text-red-600"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}