import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface LearnerProfile {
  name: string;
  email: string;
  goal: string;
  reason: string;
  subject: 'programming' | 'writing' | 'science' | '';
  weeklyHours: number;
  studyDays: string[];
  sessionLength: number;
  studyTime: string;
  pace: string;
  pathPreference: string;
  hobbies: string[];
  confidence: number;
  explanationLevel: string;
  supportMode: string;
  diagnosticScore?: number;
  completedLessons: string[];
  masteryScores: { [key: string]: number };
  studyStreak: number;
  totalStudyMinutes: number;
}

interface LearnerContextType {
  learner: LearnerProfile | null;
  setLearner: (learner: LearnerProfile) => void;
  updateLearner: (updates: Partial<LearnerProfile>) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const defaultLearner: LearnerProfile = {
  name: '',
  email: '',
  goal: '',
  reason: '',
  subject: '',
  weeklyHours: 5,
  studyDays: [],
  sessionLength: 30,
  studyTime: 'afternoon',
  pace: 'balanced',
  pathPreference: 'mixed',
  hobbies: [],
  confidence: 50,
  explanationLevel: 'normal',
  supportMode: 'balanced',
  completedLessons: [],
  masteryScores: {},
  studyStreak: 0,
  totalStudyMinutes: 0,
};

const LearnerContext = createContext<LearnerContextType | undefined>(undefined);

export function LearnerProvider({ children }: { children: ReactNode }) {
  const [learner, setLearnerState] = useState<LearnerProfile | null>(() => {
    // Load from localStorage on init
    const stored = localStorage.getItem('personalearn_learner');
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    // Persist to localStorage whenever learner changes
    if (learner) {
      localStorage.setItem('personalearn_learner', JSON.stringify(learner));
    } else {
      localStorage.removeItem('personalearn_learner');
    }
  }, [learner]);

  const setLearner = (newLearner: LearnerProfile) => {
    setLearnerState(newLearner);
  };

  const updateLearner = (updates: Partial<LearnerProfile>) => {
    setLearnerState(prev => prev ? { ...prev, ...updates } : null);
  };

  const logout = () => {
    setLearnerState(null);
    localStorage.removeItem('personalearn_learner');
  };

  return (
    <LearnerContext.Provider
      value={{
        learner,
        setLearner,
        updateLearner,
        logout,
        isAuthenticated: learner !== null && learner.name !== '' && learner.email !== '',
      }}
    >
      {children}
    </LearnerContext.Provider>
  );
}

export function useLearner() {
  const context = useContext(LearnerContext);
  if (context === undefined) {
    throw new Error('useLearner must be used within a LearnerProvider');
  }
  return context;
}

export { defaultLearner };
