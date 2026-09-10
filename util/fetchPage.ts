const TIMEOUT = 10_000;

const getPage = async (url: string) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), TIMEOUT);

  const res = await fetch(url, {
    signal: controller.signal,
    // headers: {
    //   "User-Agent": "node-fetch",
    // },
  });

  clearTimeout(id);
  return res;
};

export const fetchPage = async (url: string) => {
  let res: Response;

  try {
    res = await getPage(url);
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
