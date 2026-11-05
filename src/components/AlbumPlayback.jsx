import { useEffect, useState } from "react";
import TrackList from "./TrackList.jsx";
import {
    findDeezerAlbumId,
    getDeezerAlbumTracks,
    normalizeTrackTitle,
} from "../services/deezer.js";
import { usePlayer } from "../context/PlayerContext.jsx";

export default function AlbumPlayback({ title, artist, tracks }) {
    const {
        current,
        isPlaying,
        progress,
        playTrack,
        toggle,
        next,
        prev,
        seek,
        hasNext,
        hasPrev,
    } = usePlayer();
    const albumKey = `${title}\u0000${artist}`;
    const [deezerMatch, setDeezerMatch] = useState(null);
    const matchedAlbum =
        deezerMatch?.albumKey === albumKey ? deezerMatch : null;
    const previewTracks = matchedAlbum?.tracks ?? tracks.map((track) => ({
        ...track,
        previewUrl: "",
    }));
    const selectedTrack = previewTracks.find(
        (track) => track.trackId === current?.trackId
    ) ?? previewTracks.find((track) => track.previewUrl) ?? null;
    const isAlbumTrack = selectedTrack?.trackId === current?.trackId;

    useEffect(() => {
        let cancelled = false;
        const loadDeezerTracks = async () => {
            try {
                const id = await findDeezerAlbumId(title, artist);
                if (!id) {
                    if (!cancelled) setDeezerMatch({ albumKey, id: null });
                    return;
                }

                const deezerTracks = await getDeezerAlbumTracks(id);
                const playableTracks = tracks.map((track) => {
                    const normalizedTitle = normalizeTrackTitle(track.trackName);
                    const match = deezerTracks.find(
                        (candidate) =>
                            candidate.preview &&
                            normalizeTrackTitle(candidate.title) === normalizedTitle
                    );
                    return match
                        ? { ...track, previewUrl: match.preview }
                        : { ...track, previewUrl: "" };
                });
                if (!cancelled) {
                    setDeezerMatch({ albumKey, id, tracks: playableTracks });
                }
            } catch (error) {
                console.error("Could not prepare Deezer previews:", error);
                if (!cancelled) setDeezerMatch({ albumKey, id: null });
            }
        };
        loadDeezerTracks();
        return () => {
            cancelled = true;
        };
    }, [albumKey, artist, title, tracks]);

    return (
        <>
            <div className="album-audio-player" aria-label="Album preview player">
                <div className="album-audio-track">
                    <strong>{selectedTrack?.trackName ?? title}</strong>
                    <span>{artist}</span>
                </div>
                <div className="controls">
                    <button
                        onClick={prev}
                        disabled={!isAlbumTrack || !hasPrev}
                        aria-label="Previous track"
                    >
                        ⏮
                    </button>
                    <button
                        className="main"
                        onClick={() =>
                            isAlbumTrack
                                ? toggle()
                                : selectedTrack?.previewUrl &&
                                  playTrack(selectedTrack, previewTracks)
                        }
                        disabled={!selectedTrack?.previewUrl}
                        aria-label={isAlbumTrack && isPlaying ? "Pause" : "Play"}
                    >
                        {isAlbumTrack && isPlaying ? "❚❚" : "▶"}
                    </button>
                    <button
                        onClick={next}
                        disabled={!isAlbumTrack || !hasNext}
                        aria-label="Next track"
                    >
                        ⏭
                    </button>
                </div>
                <input
                    className="seek"
                    type="range"
                    min="0"
                    max="1000"
                    value={Math.round(
                        (isAlbumTrack ? progress : 0) * 1000
                    )}
                    onChange={(event) => seek(event.target.value / 1000)}
                    disabled={!isAlbumTrack}
                    aria-label="Seek preview"
                />
            </div>
            <p className="card-meta" role="status">
                {matchedAlbum === null
                    ? "Loading playable previews…"
                    : matchedAlbum.id
                      ? "Previews provided by Deezer."
                      : "No playable previews were found for this album."}
            </p>
            <TrackList tracks={previewTracks} />
        </>
    );
}