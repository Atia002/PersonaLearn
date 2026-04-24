import { LearnerProfile } from '../contexts/LearnerContext';

export function getLearnerInitials(learner: LearnerProfile | null): string {
  if (!learner || !learner.name) return 'U';
  
  const names = learner.name.split(' ');
  if (names.length >= 2) {
    return (names[0][0] + names[names.length - 1][0]).toUpperCase();
  }
  return learner.name.substring(0, 2).toUpperCase();
}

export function getLearnerFirstName(learner: LearnerProfile | null): string {
  if (!learner || !learner.name) return 'Student';
  
  const firstName = learner.name.split(' ')[0];
  return firstName;
}

export function getSubjectDisplayName(subjectId: string): string {
  const map: { [key: string]: string } = {
    'programming': 'Programming',
    'writing': 'Academic Writing',
    'science': 'Science',
  };
  return map[subjectId] || subjectId;
}

export function getPaceDisplayName(pace: string): string {
  return pace.charAt(0).toUpperCase() + pace.slice(1);
}

export function getGoalDisplayName(goal: string): string {
  const map: { [key: string]: string } = {
    'exam': 'Exam Preparation',
    'career': 'Career Development',
    'personal': 'Personal Growth',
    'academic': 'Academic Excellence',
  };
  return map[goal] || goal;
}
