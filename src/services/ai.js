export async function getRecommendations(taste) {
    const res = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taste }),
    });

    let data;
    try {
        data = await res.json();
    } catch {
        throw new Error(
            "The recommendation service returned an invalid response. Check the server logs."
        );
    }

    if (!res.ok) throw new Error(data.error || "Could not get recommendations.");
    if (!Array.isArray(data.albums)) {
        throw new Error("The recommendation service returned no album list.");
    }

    return data;
}