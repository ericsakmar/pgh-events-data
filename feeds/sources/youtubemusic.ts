import { type Feed, filterInvalid } from "../feed.ts";

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY ?? "unknown";

const PLAYLIST_IDS = [
  "PLBqVYuULAKE0", // pghlmt aug 2026
  "PLPOi1Kq02ASs", // pghlmt july 2026
  "PLOcqw36Qk6Dc", // pghlmt june 2026
  "PLb6SQXhVAmc_M10HArQzrw0m7clOvmra5", // pghlmt may 2026
  "PLb6SQXhVAmc8DSYuqOoPr66c8pVq8SL6X", // pghlmt apr 2026
  "PLb6SQXhVAmc8OcBprcvdxWX0nPcRFBE9P", // pghlmt mar 2026
  "PLb6SQXhVAmc_5SkSe3KMt4GgZpNiUryA3", // pghlmt feb 2026
  "PLb6SQXhVAmc-0smSO_HEsiNXt6zYyCGwQ", // pghlmt jan 2026
  "PLb6SQXhVAmc9dqgP5Hz2KGDoBGXIiKvkp", // pghlmt best of 2025
];

const getDetails = async (id: string) => {
  const playlistUrl = `https://music.youtube.com/playlist?list=${id}`;

  const metaUrl = new URL("https://www.googleapis.com/youtube/v3/playlists");
  metaUrl.searchParams.set("part", "snippet");
  metaUrl.searchParams.set("id", id);
  metaUrl.searchParams.set("key", YOUTUBE_API_KEY);

  try {
    const metaRes = await fetch(metaUrl.toString());
    const metaJson = await metaRes.json();

    if (!metaJson.items || metaJson.items.length === 0) {
      console.error(`Playlist not found: ${id}`);
      return [];
    }

    const playlist = metaJson.items[0];

    const itemsUrl = new URL(
      "https://www.googleapis.com/youtube/v3/playlistItems",
    );
    itemsUrl.searchParams.set("part", "snippet");
    itemsUrl.searchParams.set("maxResults", "50");
    itemsUrl.searchParams.set("playlistId", id);
    itemsUrl.searchParams.set("key", YOUTUBE_API_KEY);

    return [
      {
        title: playlist.snippet.title,
        subtitle: "YouTube Music",
        url: playlistUrl,
        timestamp: playlist.snippet.publishedAt,
        tags: ["playlist"],
        image: playlist.snippet.thumbnails.standard?.url,
      },
    ];
  } catch (error) {
    console.error(`Error fetching YouTube details for ${id}:`, error);
    return [];
  }
};

export const getLinks = async (): Promise<Feed[]> => {
  const links = await Promise.all(PLAYLIST_IDS.map(getDetails));
  return filterInvalid(links.flatMap((l) => l));
};

export const name = "youtube music";
