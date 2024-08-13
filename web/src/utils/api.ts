export const makeApiCall = async (token: string | null, path: string, method: string, body?: object) => {
  const headers = new Headers();
  headers.append('Content-Type', 'application/json');
  if (token) {
    headers.append('Authorization', 'Bearer ' + token);
  }
  return await fetch(import.meta.env.VITE_API_BASE_URL + path, {
    method,
    headers,
    body: JSON.stringify(body),
  });
};
