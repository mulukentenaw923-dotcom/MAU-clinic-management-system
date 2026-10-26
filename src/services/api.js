const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function apiRequest(path, options = {}) {
  if (!API_BASE_URL) {
    throw new Error('VITE_API_BASE_URL must be configured before making API requests.');
  }

  const response = await fetch(new URL(path, `${API_BASE_URL.replace(/\/+$/, '')}/`), {
    headers: {
      Accept: 'application/json',
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}.`);
  }

  return response.json();
}
