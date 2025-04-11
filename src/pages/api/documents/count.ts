import type { NextApiRequest, NextApiResponse } from 'next';
import { pool } from '@/lib/db';

// src/pages/api/documents/count.ts

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Méthode non autorisée' });
    }

    const { type } = req.query;

    if (!type || typeof type !== 'string') {
        return res.status(400).json({ message: 'Le type de document est requis' });
    }

    try {
        // Requête pour compter les documents du type spécifié
        const result = await pool.query(
            'SELECT COUNT(*) FROM documents WHERE type = $1',
            [type]
        );

        const count = parseInt(result.rows[0].count, 10);

        return res.status(200).json({ count });
    } catch (error) {
        console.error('Erreur lors de la récupération du nombre de documents:', error);
        return res.status(500).json({ message: 'Erreur du serveur' });
    }
}