function logInfo(message: string) {
  console.log(message);
}

function logError(error: Error, message?: string) {
  console.error(error, message);
}

export { logError, logInfo };
