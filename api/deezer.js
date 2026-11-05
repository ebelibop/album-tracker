export default async function handler(req, res) {
    if (req.query?.action === "tracks") {
        const id = String(req.query?.id ?? "");
        if (!/^\d+$/.test(id)) {
            return res.status(400).json({ error: "Invalid album ID." });
        }

        try {
            const r = await fetch(
                `https://api.deezer.com/album/${id}/tracks?limit=100`
            );
            if (!r.ok) {
                return res.status(502).json({ error: "Deezer is unavailable." });
            }
            const data = await r.json();
            if (data.error) {
                return res.status(502).json({ error: "Deezer returned an error." });
            }

            const tracks = (data.data ?? []).map((track) => ({
                id: track.id,
                title: track.title,
                duration: track.duration,
                preview: track.preview,
            }));
            return res.status(200).json({ tracks });
        } catch (error) {
            console.error("Deezer track lookup failed:", error);
            return res.status(502).json({ error: "Could not load Deezer previews." });
        }
    }

    const q = String(req.query?.q ?? "").trim().slice(0, 200);
    if (!q) return res.status(400).json({ error: "Missing search text." });
    try {
        const r = await fetch(
            `https://api.deezer.com/search/album?q=${encodeURIComponent(q)}&limit=5`);
        if (!r.ok) return res.status(502).json({
            error: "Deezer is unavailable."
        });
        const data = await r.json();
        if (data.error) return res.status(502).json({
            error: "Deezer returned an error." });

const albums = (data.data ?? []).map((a) => ({
                id: a.id,
                title: a.title,
                artist: a.artist?.name ?? "",
            }));
            // Albums rarely change, so let the host cache results for a day
            res.setHeader("Cache-Control", "s-maxage=86400, stale-while-revalidate");
            return res.status(200).json({ albums });
        } catch {
            return res.status(500).json({ error: "Something went wrong." });
        }
    }