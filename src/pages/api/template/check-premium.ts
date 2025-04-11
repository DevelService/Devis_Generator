// src/pages/api/templates/check-premium.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { pool } from '@/lib/db';
import jwt from 'jsonwebtoken';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Méthode non autorisée' });
    }

    const { name } = req.query;

    if (!name || typeof name !== 'string') {
        return res.status(400).json({ message: 'Le nom du template est requis' });
    }

    try {
        // Recherche du template dans la base de données
        const templateResult = await pool.query('SELECT * FROM templates WHERE name = $1', [name]);
    
        if (templateResult.rows.length === 0) {
            return res.status(404).json({ message: 'Template non trouvé' });
        }
    
        const template = templateResult.rows[0];
    
        // Vérification si le template est premium
        const isPremium = template.is_premium;
    
        // Logique d'accès (par exemple, vérifier si l'utilisateur a un abonnement premium)
        const hasAccess = !isPremium || (isPremium && (await userHasPremiumAccess(req))); // Ajout de await ici
    
        return res.status(200).json({
            isPremium,
            hasAccess,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Erreur du serveur' });
    }
}

// Fonction mise à jour pour vérifier si l'utilisateur a un abonnement premium
async function userHasPremiumAccess(req: NextApiRequest): Promise<boolean> {
    const token = req.cookies.auth_token; // Récupération du token depuis le cookie

    if (!token) {
        return false;
    }

    try {
        if (!process.env.JWT_SECRET) {
            console.error('JWT_SECRET non défini');
            return false;
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET) as { userUUID: string };
        const userUUID = decoded.userUUID;

        // Vérification de l'utilisateur dans la base de données
        const userCheckQuery = `
            SELECT premium FROM users
            WHERE uuid = $1;
        `;
        const userCheckResult = await pool.query(userCheckQuery, [userUUID]);

        if (userCheckResult.rows.length === 0) {
            return false;
        }

        return userCheckResult.rows[0].premium === true; // Vérifie si l'utilisateur a un abonnement premium
    } catch (error) {
        console.error('Erreur lors de la validation du token ou de la vérification de l\'utilisateur:', error);
        return false;
    }
}
