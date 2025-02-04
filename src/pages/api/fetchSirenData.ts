// src/pages/api/fetchSirenData.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { siren } = req.query;

    if (!siren) {
        return res.status(400).json({ error: 'SIREN is required' });
    }

    const apiKey = process.env.INSEE_API_KEY;
    if (!apiKey) {
        return res.status(500).json({ error: 'API key is not set' });
    }

    try {
        const response = await fetch(`https://api.insee.fr/entreprises/sirene/V3.11/siren/${siren}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
        });

        if (!response.ok) {
            return res.status(response.status).json({ error: 'Failed to fetch data from INSEE API' });
        }

        const data = await response.json();
        return res.status(200).json(data);
    } catch (error) {
        console.error('Error fetching data:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}