const MAX_RETRIES = 3;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const getWithRetry = async <T>(
  source: string,
  get: () => Promise<T[]>,
  retries = 0,
): Promise<T[]> => {
  try {
    const events = await get();

    if (events.length === 0) {
      console.warn(`no events found for ${source}`);
    }

    return events;
  } catch (error) {
    if (retries < MAX_RETRIES) {
      const backoffMs = 1000 * Math.pow(2, retries);

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
