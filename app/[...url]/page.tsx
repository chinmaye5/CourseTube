import { redirect } from 'next/navigation';

interface Props {
  params: Promise<{ url: string[] }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

/**
 * This catch-all route handles YouTube URLs pasted directly after the base domain.
 * Example: http://localhost:3000/https://www.youtube.com/watch?v=dQw4w9WgXcQ
 * It extracts the video or playlist ID and redirects to the course player.
 */
export default async function CatchAllYouTubeRedirect({ params, searchParams }: Props) {
  const { url: segments } = await params;
  const sParams = await searchParams;

  if (!segments || segments.length === 0) {
    return redirect('/');
  }

  // 1. Check searchParams first (handles v=... or list=... if they were passed through by the browser)
  // This happens when the user types http://localhost:3000/https://youtube.com/watch?v=ID
  const v = sParams.v as string | undefined;
  const list = sParams.list as string | undefined;

  if (v || list) {
    const query = new URLSearchParams();
    if (v) query.set('v', v);
    if (list) query.set('list', list);
    return redirect(`/courses?${query.toString()}`);
  }

  // 2. Check if it's a direct Video ID or Playlist ID in the first segment
  // Example: http://localhost:3000/dQw4w9WgXcQ
  const firstSegment = segments[0];
  if (segments.length === 1) {
    if (firstSegment.length === 11) {
      // Likely a video ID
      return redirect(`/courses?v=${firstSegment}`);
    } else if (firstSegment.startsWith('PL')) {
      // Likely a playlist ID
      return redirect(`/courses?list=${firstSegment}`);
    }
  }

  // 3. Try to reconstruct the URL from segments to see if it's a YouTube link
  // e.g. ['https:', 'www.youtube.com', 'watch'] -> "https:/www.youtube.com/watch"
  const reconstructedPath = segments.join('/');
  
  // Regex to find video IDs in various YT URL formats
  const videoMatch = reconstructedPath.match(/(?:v=|youtu\.be\/|youtube\.com\/shorts\/|embed\/|v\/|watch\/|live\/)([a-zA-Z0-9_-]{11})/);
  if (videoMatch) {
    return redirect(`/courses?v=${videoMatch[1]}`);
  }

  // Extract playlist ID from path if present (e.g. .../playlist/PL...)
  const playlistMatch = reconstructedPath.match(/list=([a-zA-Z0-9_-]+)/);
  if (playlistMatch) {
    return redirect(`/courses?list=${playlistMatch[1]}`);
  }

  // Special case: check if any segment looks like a playlist ID (starts with PL)
  const potentialPlaylistId = segments.find(s => s.startsWith('PL') && s.length > 15);
  if (potentialPlaylistId) {
    return redirect(`/courses?list=${potentialPlaylistId}`);
  }

  // If it's a short URL like youtu.be/ID which became ['youtu.be', 'ID'] or ['https:', 'youtu.be', 'ID']
  const lastSegment = segments[segments.length - 1];
  if (lastSegment.length === 11) {
    return redirect(`/courses?v=${lastSegment}`);
  }

  // Fallback: If no YouTube markers are found, redirect home
  // This also serves as a catch-all 404 handler that brings users back to the landing page
  return redirect('/');
}
