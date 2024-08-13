export const isValidRegex = (pattern: string) => {
  try {
    new RegExp(pattern);
    return true;
  } catch (e) {
    return false;
  }
};

export const isValidURL = (url: string) => {
  try {
    new URL(url);
    return url.startsWith('http://') || url.startsWith('https://');
  } catch {
    return false;
  }
};
