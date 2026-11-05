// Lowercase and drop tags like (Deluxe) and punctuation so titles compare fairly
const norm = (s = "") =>
    s.toLowerCase().replace(/\(.*?\)|\[.*?\]/g, "").replace(/[^a-z0-9]/g, "");
export async function findDeezerAlbumId(title, artist) {
    const res = await fetch(`/api/deezer?q=${encodeURIComponent(`${title}
${artist}`)}`);
    if (!res.ok) {
        throw new Error("Could not search Deezer for this album.");
    }
    const { albums = [] } = await res.json();
    const t = norm(title);
    const a = norm(artist);
    // Only accept a confident match: better no player than the wrong album
    const match = albums.find((x) => {
        const xt = norm(x.title);
        const xa = norm(x.artist);
        const sameArtist = xa && a && (xa.includes(a) || a.includes(xa));
        const sameTitle = xt && t && (xt.includes(t) || t.includes(xt));
        return sameArtist && sameTitle;
    });
    return match?.id ?? null;
}

export async function getDeezerAlbumTracks(albumId) {
    const res = await fetch(`/api/deezer?action=tracks&id=${albumId}`);
    if (!res.ok) {
        throw new Error("Could not load Deezer track previews.");
    }
    const { tracks } = await res.json();
    if (!Array.isArray(tracks)) {
        throw new Error("Deezer returned an invalid track list.");
    }
    return tracks;
}

export const normalizeTrackTitle = (title = "") =>
    title
        .toLowerCase()
        .replace(/\s*\(.*?\)|\s*\[.*?\]/g, "")
        .replace(/[^a-z0-9]/g, "");