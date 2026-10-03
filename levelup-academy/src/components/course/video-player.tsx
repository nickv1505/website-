/** Embeds YouTube/Vimeo links or plays direct video files (including signed storage URLs). */
export function VideoPlayer({ url, title }: { url: string; title: string }) {
  const embed = toEmbedUrl(url);
  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-black">
      <div className="relative aspect-video">
        {embed ? (
          <iframe
            src={embed}
            title={title}
            className="absolute inset-0 size-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            allowFullScreen
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
          />
        ) : (
          <video src={url} controls preload="metadata" className="absolute inset-0 size-full" title={title}>
            Your browser does not support embedded video.
          </video>
        )}
      </div>
    </div>
  );
}

export function toEmbedUrl(url: string): string | null {
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, '');
    if (host === 'youtube.com' || host === 'm.youtube.com') {
      const id = u.searchParams.get('v') || u.pathname.split('/').filter(Boolean).pop();
      return id ? `https://www.youtube-nocookie.com/embed/${id}` : null;
    }
    if (host === 'youtu.be') return `https://www.youtube-nocookie.com/embed/${u.pathname.slice(1)}`;
    if (host === 'vimeo.com') {
      const id = u.pathname.split('/').filter(Boolean)[0];
      return id ? `https://player.vimeo.com/video/${id}` : null;
    }
    if (host === 'player.vimeo.com' || host === 'youtube-nocookie.com') return url;
    return null;
  } catch {
    return null;
  }
}
