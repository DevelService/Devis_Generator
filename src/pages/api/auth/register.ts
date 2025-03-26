// src/pages/api/auth/register.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import { pool } from '@/lib/db';

console.log('Database pool configuration:', pool.options);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Méthode non autorisée' });
    }

    const { email, password, username } = req.body; // Récupère le champ username
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress; // Capture l'adresse IP

    // Vérification des données envoyées
    if (!email || !password || !username) { // Ajoute la vérification pour username
        return res.status(400).json({ message: 'Email, mot de passe et nom d\'utilisateur sont requis' });
    }

    try {
        // Vérification si l'utilisateur existe déjà dans la base de données
        const checkUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

        if (checkUser.rows.length > 0) {
            return res.status(400).json({ message: 'L\'utilisateur existe déjà' });
        }

        // Hachage du mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insertion de l'utilisateur dans la base de données
        const newUser = await pool.query(
            'INSERT INTO users (email, password, username, ip) VALUES ($1, $2, $3, $4) RETURNING *',
            [email, hashedPassword, username, [ip]]  // Ajoute username et ip à l'insertion
        );

        // Réponse avec l'utilisateur enregistré (sans renvoyer le mot de passe)
        return res.status(201).json({
            message: 'Utilisateur créé avec succès',
            user: {
                id: newUser.rows[0].id,
                email: newUser.rows[0].email,
                username: newUser.rows[0].username, // Inclure le username dans la réponse
                ip: newUser.rows[0].ip, // Inclure l'IP dans la réponse
            },
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Erreur du serveur' });
    }
}
