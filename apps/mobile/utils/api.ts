export const makeApiCall = async (token: string | null, path: string, method: string, body?: object) => {
  const headers = new Headers();
  headers.append('Content-Type', 'application/json');
  if (token) {
    headers.append('Authorization', 'Bearer ' + token);
  }
  return await fetch((process.env.EXPO_API_BASE_URL as string) + path, {
    method,
    headers,
    body: JSON.stringify(body),
  });
};
