const MAX_RETRIES = 3;
const TIMEOUT_MS = 30_000;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const withTimeout = <T>(promise: Promise<T>, ms: number): Promise<T> =>
  Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Request timed out')), ms),
    ),
  ]);

export const getWithRetry = async <T>(
  source: string,
  get: () => Promise<T[]>,
  retries = 0,
): Promise<T[]> => {
  try {
    const events = await withTimeout(get(), TIMEOUT_MS);

    if (events.length === 0) {
      console.warn(`no events found for ${source}`);
    }

    return events;
  } catch (error) {
    if (retries < MAX_RETRIES) {
      const jitter = Math.random() * 1000;
      const backoffMs = 1000 * Math.pow(2, retries) + jitter;

      console.warn(
        `Error on ${source}. Retrying in ${backoffMs}ms... (${retries + 1}/${MAX_RETRIES})`,
      );

      await delay(backoffMs);

      const retry = await getWithRetry(source, get, retries + 1);
      return retry;
    } else {
      console.warn(`max retries exceeded for ${source}`);
      console.warn(error);

      return [];
    }
  }
};
