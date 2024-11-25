export const makeApiCall = async (token: string | null, path: string, method: string, body?: object) => {
  const headers = new Headers();
  headers.append('Content-Type', 'application/json');
  if (token) {
    headers.append('Authorization', 'Bearer ' + token);
  }

  const url = (process.env.EXPO_PUBLIC_API_BASE_URL as string) + path;
  return await fetch(url, {
    method,
    headers,
    body: JSON.stringify(body),
  });
};
