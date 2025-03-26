import type { NextApiRequest, NextApiResponse } from 'next';
import { pool } from '@/lib/db';
import jwt from 'jsonwebtoken';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        return handlePost(req, res);
    } else if (req.method === 'GET') {
        return handleGet(req, res);
    } else {
        return res.status(405).json({ message: 'Méthode non autorisée' });
    }
}

async function handlePost(req: NextApiRequest, res: NextApiResponse) {
    // Récupération et vérification du token JWT
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: 'Authentification requise' });
    }
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Authentification requise' });
    }

    try {
        // Décodage du token
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userUUID: string, email: string };
        const userUUID = decoded.userUUID;

        if (!userUUID) {
            return res.status(401).json({ message: 'Utilisateur non trouvé' });
        }

        // Récupération des données envoyées
        const { type, nom, prenom, entreprise, siren, email, tel, adresse } = req.body;

        // Validation des champs en fonction du type
        if (!type || !email || !adresse) {
            return res.status(400).json({ message: 'Les champs obligatoires sont manquants' });
        }

        if (type === 'individual' && (!nom || !prenom)) {
            return res.status(400).json({ message: 'Nom et prénom sont requis pour un particulier' });
        }

        if (type === 'pro' && (!entreprise || !siren)) {
            return res.status(400).json({ message: 'Entreprise et SIREN sont requis pour un professionnel' });
        }

        // Vérification si l'client existe déjà
        const checkQuery = `
            SELECT * FROM clients
            WHERE user_uuid = $1 AND email = $2;
        `;
        const checkValues = [userUUID, email];
        const checkResult = await pool.query(checkQuery, checkValues);

        if (checkResult.rows.length > 0) {
            return res.status(200).json({
            message: 'Client déjà existant',
            emetteur: checkResult.rows[0],
            });
        }

        // Insertion dans la base de données
        const query = `
            INSERT INTO clients (user_uuid, type, nom, prenom, entreprise, siren, email, tel, adresse)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING *;
        `;
        const values = [userUUID, type, nom || null, prenom || null, entreprise || null, siren || null, email, tel || null, adresse];

        const result = await pool.query(query, values);

        return res.status(201).json({
            message: 'Client ajouté avec succès',
            emetteur: result.rows[0],
        });

    } catch (error) {
        console.error('Erreur lors de l\'ajout de l\'client:', error);
        return res.status(500).json({ message: 'Erreur serveur' });
    }
}

async function handleGet(req: NextApiRequest, res: NextApiResponse) {
    // Récupération et vérification du token JWT
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: 'Authentification requise' });
    }
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Authentification requise' });
    }

    try {
        // Décodage du token
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userUUID: string, email: string };
        const userUUID = decoded.userUUID

        if (!userUUID) {
            return res.status(401).json({ message: 'Utilisateur non trouvé' });
        }

        // Récupération du terme de recherche
        const { searchTerm } = req.query;

        let query = `
            SELECT * FROM clients
            WHERE user_uuid = $1
        `;
        const values: (string | number)[] = [userUUID];

        if (searchTerm) {
            const terms = (searchTerm as string).split(' ').map(term => `%${term}%`);
            if (terms.length === 1) {
                query += ` AND (nom ILIKE $2 OR prenom ILIKE $2 OR entreprise ILIKE $2 OR email ILIKE $2)`;
                values.push(terms[0]);
            } else if (terms.length === 2) {
                query += ` AND ((nom ILIKE $2 AND prenom ILIKE $3) OR (nom ILIKE $3 AND prenom ILIKE $2) OR entreprise ILIKE $2 OR email ILIKE $2)`;
                values.push(terms[0], terms[1]);
            }
        }

        query += ` LIMIT 5;`;

        const result = await pool.query(query, values);

        return res.status(200).json({
            message: 'Clients récupérés avec succès',
            clients: result.rows,
        });

    } catch (error) {
        console.error('Erreur lors de la récupération des clients:', error);
        return res.status(500).json({ message: 'Erreur serveur' });
    }
}
