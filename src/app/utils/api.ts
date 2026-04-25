const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

type RequestOptions = RequestInit & {
  json?: unknown;
};

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const headers = new Headers(options.headers || {});
  const method = (options.method || 'GET').toUpperCase();
  const normalizedBase = API_BASE_URL.replace(/\/+$/, '');
  const normalizedPath = path.replace(/^\/+/, '');
  const apiPath = normalizedPath.startsWith('api/') ? normalizedPath : `api/${normalizedPath}`;

  if (options.json !== undefined && method !== 'GET' && method !== 'HEAD') {
    headers.set('Content-Type', 'application/json');
    headers.set('Accept', 'application/json');
  }

  const response = await fetch(`${normalizedBase}/${apiPath}`, {
    ...options,
    headers,
    body: options.json !== undefined ? JSON.stringify(options.json) : options.body,
  });

  const contentType = (response.headers.get('content-type') || '').toLowerCase();
  const isJsonResponse = contentType.includes('application/json');
  const hasBody = response.status !== 204 && response.status !== 205;

  let data: unknown = null;
  if (hasBody && isJsonResponse) {
    try {
      data = await response.json();
    } catch {
      throw new Error('Backend returned invalid JSON response');
    }
  } else if (hasBody) {
    const text = await response.text();
    if (text.trim()) {
      if (text.trimStart().startsWith('<')) {
        throw new Error('Backend returned non-JSON response');
      }

      data = text;
    }
  }

  if (!response.ok) {
    const message = typeof data === 'object' && data && 'message' in data
      ? String((data as { message?: string }).message || 'Request failed')
      : typeof data === 'string' && data.trim()
        ? data
        : 'Request failed';
    throw new Error(message);
  }

  if (!isJsonResponse && hasBody && typeof data === 'string' && data.trim()) {
    throw new Error('Backend returned non-JSON response');
  }

  return (data ?? ({} as T)) as T;
}

export function getApiBaseUrl(): string {
  return API_BASE_URL;
}
