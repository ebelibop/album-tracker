import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
} from "react";

const PlayerContext = createContext();

export const usePlayer = () => useContext(PlayerContext);

export function PlayerProvider({ children }) {
    const audioRef = useRef(null);
    if (audioRef.current == null) audioRef.current = new Audio();

    const [queue, setQueue] = useState([]);
    const [index, setIndex] = useState(-1);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [playbackError, setPlaybackError] = useState("");
    const current = queue[index] ?? null;

    const play = useCallback((track) => {
        const audio = audioRef.current;
        setPlaybackError("");
        setProgress(0);
        audio.src = track.previewUrl;
        audio.currentTime = 0;
        audio.play().catch((error) => {
            setIsPlaying(false);
            setPlaybackError(
                error.name === "NotAllowedError"
                    ? "Playback was blocked by your browser. Press Play to try again."
                    : "This preview could not be played. Try another track."
            );
        });
    }, []);

    useEffect(() => {
        const audio = audioRef.current;
        const onTime = () =>
            setProgress(audio.duration ? audio.currentTime / audio.duration : 0);
        const onPlay = () => {
            setPlaybackError("");
            setIsPlaying(true);
        };
        const onPause = () => setIsPlaying(false);
        const onError = () => {
            setIsPlaying(false);
            setPlaybackError("This preview could not be loaded. Try another track.");
        };
        const onEnd = () => {
            if (index < queue.length - 1) {
                const nextIndex = index + 1;
                const nextTrack = queue[nextIndex];
                setIndex(nextIndex);
                play(nextTrack);
            } else {
                setIsPlaying(false);
            }
        };

        audio.addEventListener("timeupdate", onTime);
        audio.addEventListener("play", onPlay);
        audio.addEventListener("pause", onPause);
        audio.addEventListener("error", onError);
        audio.addEventListener("ended", onEnd);
        return () => {
            audio.removeEventListener("timeupdate", onTime);
            audio.removeEventListener("play", onPlay);
            audio.removeEventListener("pause", onPause);
            audio.removeEventListener("error", onError);
            audio.removeEventListener("ended", onEnd);
        };
    }, [index, play, queue]);

    const toggle = () => {
        const audio = audioRef.current;
        if (audio.paused) {
            setPlaybackError("");
            audio.play().catch((error) => {
                setIsPlaying(false);
                setPlaybackError(
                    error.name === "NotAllowedError"
                        ? "Playback was blocked by your browser. Press Play to try again."
                        : "This preview could not be played. Try another track."
                );
            });
        } else {
            audio.pause();
        }
    };

    const playTrack = (track, tracks) => {
        if (current?.trackId === track.trackId) {
            toggle();
            return;
        }

        const playable = tracks.filter((item) => item.previewUrl);
        const trackIndex = playable.findIndex(
            (item) => item.trackId === track.trackId
        );
        if (trackIndex < 0) {
            setPlaybackError("A preview is not available for this track.");
            return;
        }

        setQueue(playable);
        setIndex(trackIndex);
        play(playable[trackIndex]);
    };

    const next = () => {
        if (index < queue.length - 1) {
            const nextIndex = index + 1;
            setIndex(nextIndex);
            play(queue[nextIndex]);
        }
    };

    const prev = () => {
        if (index > 0) {
            const previousIndex = index - 1;
            setIndex(previousIndex);
            play(queue[previousIndex]);
        }
    };

    const seek = (ratio) => {
        const audio = audioRef.current;
        if (audio.duration) {
            audio.currentTime = Math.max(0, Math.min(1, ratio)) * audio.duration;
        }
    };

    return (
        <PlayerContext.Provider
            value={{
                current,
                isPlaying,
                progress,
                playbackError,
                playTrack,
                toggle,
                next,
                prev,
                seek,
                hasNext: index < queue.length - 1,
                hasPrev: index > 0,
            }}
        >
            {children}
        </PlayerContext.Provider>
    );
}
