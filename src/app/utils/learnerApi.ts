import { apiRequest } from './api';
import type { LearnerProfile } from '../contexts/LearnerContext';

export interface LearnerResponse {
  ok: boolean;
  learner: {
    id: string;
    name: string;
    email: string;
    profile?: Partial<LearnerProfile>;
  };
  token?: string;
}

export interface PlanResponse {
  ok: boolean;
  plan: Record<string, unknown>;
}

export async function registerLearner(payload: {
  name: string;
  email: string;
  password: string;
  profile?: Partial<LearnerProfile>;
}) {
  return apiRequest<LearnerResponse>('/api/learners/register', {
    method: 'POST',
    json: payload,
  });
}

export async function loginLearner(payload: { email: string; password: string }) {
  return apiRequest<LearnerResponse>('/api/auth/login', {
    method: 'POST',
    json: payload,
  });
}

export async function updateLearnerProfile(
  id: string,
  payload: Partial<LearnerProfile> & { name?: string; email?: string; password?: string; profile?: Partial<LearnerProfile> },
) {
  return apiRequest<LearnerResponse>(`/api/learners/${id}`, {
    method: 'PUT',
    json: payload,
  });
}

export async function generateLearningPlan(profile: Partial<LearnerProfile>) {
  return apiRequest<PlanResponse>('/api/plans/generate', {
    method: 'POST',
    json: {
      learnerId: profile.email || 'guest',
      profile,
    },
  });
}

export async function searchFreeResources(topic: string) {
  return apiRequest<{
    ok: boolean;
    topic: string;
    wikipedia: Array<Record<string, unknown>> | Record<string, unknown> | [];
    openLibraryBooks: Array<Record<string, unknown>>;
  }>(`/api/resources/search?topic=${encodeURIComponent(topic)}`);
}
