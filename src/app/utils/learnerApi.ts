import { apiRequest } from './api';
import type { LearnerProfile } from '../contexts/LearnerContext';

export interface NormalizedAuthResponse {
  userId: string;
  name: string;
  email: string;
  role?: 'student' | 'instructor' | 'admin';
  token?: string;
  profile?: Partial<LearnerProfile>;
}

type AuthResponseEnvelope = Partial<Record<'ok' | 'token' | 'learner' | 'user' | 'data' | 'id' | 'userId', unknown>> & Record<string, unknown>;

type AuthFallback = {
  name?: string;
  email?: string;
  role?: 'student' | 'instructor' | 'admin';
};

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
  const response = await apiRequest<AuthResponseEnvelope | string>('/api/learners/register', {
    method: 'POST',
    json: payload,
  });

  return normalizeAuthResponse(response, 'signup', {
    name: payload.name,
    email: payload.email,
    role: payload.role,
  });
}

export async function loginLearner(payload: { email: string; password: string }) {
  const response = await apiRequest<AuthResponseEnvelope | string>('/api/auth/login', {
    method: 'POST',
    json: payload,
  });

  return normalizeAuthResponse(response, 'login', {
    email: payload.email,
  });
}

export async function updateLearnerProfile(
  id: string,
  payload: Partial<LearnerProfile> & { name?: string; email?: string; password?: string; profile?: Partial<LearnerProfile> },
) {
  return apiRequest<{ ok: boolean; learner: { id: string; name: string; email: string; profile?: Partial<LearnerProfile> } }>(`/api/learners/${id}`, {
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

function normalizeAuthResponse(
  rawResponse: AuthResponseEnvelope | string,
  flow: 'signup' | 'login',
  fallback: AuthFallback = {},
): NormalizedAuthResponse {
  const response = normalizeEnvelope(rawResponse);
  if (!response) {
    console.error('Unable to parse auth response.', rawResponse);
    throw new Error('Unexpected signup/login response format.');
  }

  const data = asRecord(response.data);
  const candidates = [
    asRecord(response.learner),
    asRecord(response.user),
    asRecord(data?.learner),
    asRecord(data?.user),
    data,
    response,
  ].filter((value): value is Record<string, unknown> => Boolean(value));

  const id = firstString(candidates, ['id', 'userId', 'learnerId']);
  if (!id) {
    console.error('Auth response missing user id.', response);
    throw new Error(`${capitalize(flow)} succeeded but user id is missing in server response. Check console for response payload.`);
  }

  const roleValue = firstString(candidates, ['role']);
  const role = roleValue === 'student' || roleValue === 'instructor' || roleValue === 'admin' ? roleValue : undefined;

  return {
    userId: id,
    name: firstString(candidates, ['name']) || fallback.name || '',
    email: firstString(candidates, ['email']) || fallback.email || '',
    role: role || fallback.role,
    token: firstString([response, ...(data ? [data] : [])], ['token']),
    profile: firstRecord(candidates, ['profile']) as Partial<LearnerProfile> | undefined,
  };
}

function normalizeEnvelope(value: AuthResponseEnvelope | string): AuthResponseEnvelope | null {
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) {
      return null;
    }

    const parsed = parseJsonDeep(trimmed);
    if (parsed) {
      return parsed;
    }

    const extractedObject = trimmed.match(/\{[\s\S]*\}/)?.[0];
    if (extractedObject) {
      return parseJsonDeep(extractedObject);
    }

    return null;
  }

  return asRecord(value);
}

function parseJsonDeep(value: string): AuthResponseEnvelope | null {
  try {
    const parsed = JSON.parse(value) as unknown;
    if (typeof parsed === 'string') {
      return parseJsonDeep(parsed);
    }

    return asRecord(parsed);
  } catch {
    return null;
  }
}

function firstString(candidates: Array<Record<string, unknown>>, keys: string[]): string | undefined {
  for (const candidate of candidates) {
    for (const key of keys) {
      const value = asNonEmptyString(candidate[key]);
      if (value) {
        return value;
      }
    }
  }

  return undefined;
}

function firstRecord(candidates: Array<Record<string, unknown>>, keys: string[]): Record<string, unknown> | undefined {
  for (const candidate of candidates) {
    for (const key of keys) {
      const value = asRecord(candidate[key]);
      if (value) {
        return value;
      }
    }
  }

  return undefined;
}

function capitalize(value: string): string {
  return value ? `${value[0].toUpperCase()}${value.slice(1)}` : value;
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === 'object' && !Array.isArray(value) ? (value as Record<string, unknown>) : null;
}

function asNonEmptyString(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim() ? value : undefined;
}
