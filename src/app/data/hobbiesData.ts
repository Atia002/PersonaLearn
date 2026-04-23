export interface HobbyOption {
  id: string;
  label: string;
}

export const hobbiesData: HobbyOption[] = [
  { id: 'sports', label: 'Sports' },
  { id: 'music', label: 'Music' },
  { id: 'gaming', label: 'Gaming' },
  { id: 'art', label: 'Art & Design' },
  { id: 'business', label: 'Business' },
  { id: 'science', label: 'Science' },
  { id: 'movies', label: 'Movies & Anime' },
  { id: 'travel', label: 'Travel' },
  { id: 'social', label: 'Social Media' },
  { id: 'books', label: 'Books/Storytelling' },
  { id: 'coding', label: 'Coding/Tech' },
  { id: 'cooking', label: 'Cooking' },
  { id: 'nature', label: 'Nature' }
];

export function getHobbyLabel(hobbyId: string): string {
  const hobby = hobbiesData.find(h => h.id === hobbyId);
  return hobby ? hobby.label : hobbyId.charAt(0).toUpperCase() + hobbyId.slice(1);
}

export function getHobbyLabels(hobbyIds: string[]): string[] {
  return hobbyIds.map(id => getHobbyLabel(id));
}
