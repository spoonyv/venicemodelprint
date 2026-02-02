export default async function handler(req, res) {
    const apiKey = process.env.VENICE_API_KEY;

    // Debug endpoint - add ?debug=1 to see diagnostics
    const debug = req.query.debug === '1';

    if (!apiKey) {
        return res.status(500).json({ error: 'API key not configured' });
    }

    const types = ['text', 'image', 'video', 'tts', 'asr', 'embedding', 'upscale', 'inpaint'];
    const errors = [];

    try {
        const responses = await Promise.all(
            types.map(async type => {
                try {
                    const r = await fetch(`https://api.venice.ai/api/v1/models?type=${type}`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${apiKey}`,
                            'Content-Type': 'application/json'
                        }
                    });
                    if (!r.ok) {
                        const text = await r.text();
                        errors.push({ type, status: r.status, body: text.slice(0, 200) });
                        return { data: [] };
                    }
                    return await r.json();
                } catch (e) {
                    errors.push({ type, error: e.message });
                    return { data: [] };
                }
            })
        );

        const allModels = responses.flatMap(r => r.data || []);

        res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate');

        if (debug) {
            return res.status(200).json({
                data: allModels,
                _debug: {
                    modelCount: allModels.length,
                    errors,
                    keyPrefix: apiKey.slice(0, 8) + '...'
                }
            });
        }

        return res.status(200).json({ data: allModels });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to fetch models', details: error.message });
    }
}
