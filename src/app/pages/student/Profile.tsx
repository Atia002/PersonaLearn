import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Target, Clock, Zap, Heart, Brain, Edit } from 'lucide-react';
import { useLearner } from '../../contexts/LearnerContext';
import { getLearnerInitials } from '../../utils/learnerHelpers';
import { subjectData } from '../../data/subjectData';

export default function Profile() {
  const { learner } = useLearner();
  const subjectName = learner?.subject && subjectData[learner.subject] ? subjectData[learner.subject].name : 'Not selected';
  const hobbyLabels = learner?.hobbies?.length ? learner.hobbies : ['Gaming', 'Music', 'Sports'];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">My Profile</h1>
          <p className="text-gray-600">Your personalized learning preferences</p>
        </div>

        <Card className="p-8">
          <div className="flex items-center gap-6 mb-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#1e40af] to-[#14b8a6] flex items-center justify-center text-white text-3xl font-bold">
              {getLearnerInitials(learner)}
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-1">{learner?.name || 'Your Name'}</h2>
              <p className="text-gray-600">{learner?.email || 'you@example.com'}</p>
              <p className="text-sm text-gray-500 mt-2">Student • Joined March 2026</p>
            </div>
            <Button variant="outline">
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          </div>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <Target className="w-5 h-5 text-[#1e40af]" />
              </div>
              <h3 className="font-semibold">Learning Goal</h3>
            </div>
              <p className="text-gray-700">{learner?.goal || 'Exam Preparation'}</p>
              <p className="text-sm text-gray-500 mt-1">{learner?.reason || 'Your personalized learning goal'}</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-teal-100 flex items-center justify-center">
                <Clock className="w-5 h-5 text-[#14b8a6]" />
              </div>
              <h3 className="font-semibold">Time Commitment</h3>
            </div>
            <p className="text-gray-700">{learner?.weeklyHours || 5} hours per week</p>
            <p className="text-sm text-gray-500 mt-1">{learner?.sessionLength || 30}-minute sessions • {learner?.studyTime || 'Afternoon'} preferred</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <Zap className="w-5 h-5 text-[#a855f7]" />
              </div>
              <h3 className="font-semibold">Learning Pace</h3>
            </div>
            <p className="text-gray-700">{learner?.pace || 'Balanced'}</p>
            <p className="text-sm text-gray-500 mt-1">{learner?.pathPreference || 'Steady progress with good depth'}</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <Brain className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="font-semibold">Support Mode</h3>
            </div>
            <p className="text-gray-700">{learner?.supportMode || 'Balanced Support'}</p>
            <p className="text-sm text-gray-500 mt-1">{learner?.explanationLevel || 'Normal'} explanation level • {learner?.confidence ?? 50}% confidence</p>
          </Card>
        </div>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-pink-100 flex items-center justify-center">
              <Heart className="w-5 h-5 text-pink-600" />
            </div>
            <h3 className="font-semibold">Hobbies & Interests</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {hobbyLabels.map((hobby) => (
              <span key={hobby} className="px-3 py-1 bg-blue-100 text-[#1e40af] rounded-full text-sm">
                {hobby}
              </span>
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-3">
            These interests are used to create personalized examples in your lessons
          </p>
        </Card>

        <div className="flex gap-4">
          <Button>Update Preferences</Button>
          <Button variant="outline">Reset Learning Path</Button>
        </div>
      </div>
    </div>
  );
}
