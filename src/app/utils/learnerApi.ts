import { apiRequest } from './api';
import type { LearnerProfile } from '../contexts/LearnerContext';

export interface LearnerResponse {
  ok: boolean;
  learner: {
    id: string;
    name: string;
    email: string;
    role?: 'student' | 'instructor' | 'admin';
    profile?: Partial<LearnerProfile>;
  };
  token?: string;
}

type LearnerResponseEnvelope = Partial<Record<'ok' | 'token' | 'learner' | 'user' | 'data', unknown>> & Record<string, unknown>;

export interface PlanResponse {
  ok: boolean;
  plan: Record<string, unknown>;
}

export interface MaterialRecord {
  id: string;
  userId: string;
  subject: string;
  concept: string;
  title: string;
  notesText: string;
  usableByTutor: boolean;
  createdAt: string;
}

export interface TutorResponse {
  ok: boolean;
  answer: string;
  sourceUsed: 'official' | 'uploaded' | 'both';
  usedNotes: boolean;
  notesSource?: Record<string, unknown> | null;
}

export async function registerLearner(payload: {
  name: string;
  email: string;
  password: string;
  role?: 'student' | 'instructor' | 'admin';
  profile?: Partial<LearnerProfile>;
}) {
  const response = await apiRequest<LearnerResponseEnvelope>('/api/learners/register', {
    method: 'POST',
    json: payload,
  });

  return normalizeLearnerResponse(response);
}

export async function loginLearner(payload: { email: string; password: string }) {
  const response = await apiRequest<LearnerResponseEnvelope>('/api/auth/login', {
    method: 'POST',
    json: payload,
  });

  return normalizeLearnerResponse(response);
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
      learnerId: profile.id || profile.email || 'guest',
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

export async function saveMaterial(payload: {
  userId: string;
  subject: string;
  concept: string;
  title?: string;
  notesText: string;
  usableByTutor?: boolean;
}) {
  return apiRequest<{ ok: boolean; material: MaterialRecord }>('/api/materials/save', {
    method: 'POST',
    json: payload,
  });
}

export async function listMaterials(userId: string) {
  return apiRequest<{ ok: boolean; materials: MaterialRecord[] }>(`/api/materials?userId=${encodeURIComponent(userId)}`);
}

export async function latestMaterial(userId: string, concept?: string) {
  const conceptQuery = concept ? `&concept=${encodeURIComponent(concept)}` : '';
  return apiRequest<{ ok: boolean; material: MaterialRecord | null }>(`/api/materials/latest?userId=${encodeURIComponent(userId)}${conceptQuery}`);
}

export async function askTutor(payload: {
  userId: string;
  subject: string;
  concept: string;
  question: string;
  sourceMode: 'official' | 'uploaded' | 'both';
  learnerProfile: Partial<LearnerProfile>;
  uploadedNotesText?: string;
  materialId?: string;
  actionType: 'normal' | 'explain_simpler' | 'another_example' | 'use_hobby' | 'uploaded_only';
}) {
  return apiRequest<TutorResponse>('/api/tutor/ask', {
    method: 'POST',
    json: payload,
  });
}

function normalizeLearnerResponse(response: LearnerResponseEnvelope): LearnerResponse {
  const candidate = asRecord(response.learner) || asRecord(response.user) || asRecord(response.data) || asRecord(response);
  if (!candidate) {
    throw new Error('Unexpected signup/login response format.');
  }

  const id = asNonEmptyString(candidate.id);
  if (!id) {
    throw new Error('Account created, but user id is missing in server response. Please try again.');
  }

  const roleValue = asNonEmptyString(candidate.role);
  const role = roleValue === 'student' || roleValue === 'instructor' || roleValue === 'admin' ? roleValue : undefined;

  return {
    ok: response.ok === undefined ? true : Boolean(response.ok),
    token: asNonEmptyString(response.token),
    learner: {
      id,
      name: asNonEmptyString(candidate.name) || '',
      email: asNonEmptyString(candidate.email) || '',
      role,
      profile: asRecord(candidate.profile) as Partial<LearnerProfile> | undefined,
    },
  };
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === 'object' && !Array.isArray(value) ? (value as Record<string, unknown>) : null;
}

function asNonEmptyString(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim() ? value : undefined;
}
