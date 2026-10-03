const TIMEOUT = 10_000;

export const fetchPage = async (url: string) => {
  let res: Response;

  try {
    res = await fetch(url, {
      signal: AbortSignal.timeout(TIMEOUT),
      // headers: {
      //   "User-Agent": "node-fetch",
      // },
    });
  } catch (exception) {
    const error = {
      exception,
      url,
    };

    throw error;
  }

  const body = await res.text();

  if (res.ok) {
    return body;
  }

  const error = {
    code: res.status,
    url,
    body,
  };

  throw error;
};
