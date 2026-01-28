export default async function handler(req, res) {
    const apiKey = process.env.VENICE_API_KEY;

    if (!apiKey) {
        return res.status(500).json({ error: 'API key not configured' });
    }

    const types = ['text', 'image', 'video', 'tts', 'asr', 'embedding', 'upscale', 'inpaint'];

    try {
        const responses = await Promise.all(
            types.map(type =>
                fetch(`https://api.venice.ai/api/v1/models?type=${type}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${apiKey}`,
                        'Content-Type': 'application/json'
                    }
                }).then(r => r.ok ? r.json() : { data: [] })
                  .catch(() => ({ data: [] }))
            )
        );

        const allModels = responses.flatMap(r => r.data || []);

        res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate');
        return res.status(200).json({ data: allModels });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to fetch models' });
    }
}
