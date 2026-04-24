const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

type RequestOptions = RequestInit & {
  json?: unknown;
};

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const headers = new Headers(options.headers || {});
  const method = (options.method || 'GET').toUpperCase();

  if (options.json !== undefined && method !== 'GET' && method !== 'HEAD') {
    headers.set('Content-Type', 'text/plain');
    // Keep requests CORS-simple for shared hosting by removing non-safelisted headers.
    headers.delete('Authorization');
    headers.delete('X-Requested-With');
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
    body: options.json !== undefined ? JSON.stringify(options.json) : options.body,
  });

  const contentType = response.headers.get('content-type') || '';
  const data = contentType.includes('application/json')
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const message = typeof data === 'object' && data && 'message' in data
      ? String((data as { message?: string }).message || 'Request failed')
      : 'Request failed';
    throw new Error(message);
  }

  return data as T;
}

export function getApiBaseUrl(): string {
  return API_BASE_URL;
}
