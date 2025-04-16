// src/pages/api/auth/login.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '@/lib/db';
import { serialize } from 'cookie';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Méthode non autorisée' });
    }

    const { email, password } = req.body;
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    // Vérification des données envoyées
    if (!email || !password) {
        return res.status(400).json({ message: 'Email et mot de passe sont requis' });
    }

    try {
        // Recherche de l'utilisateur dans la base de données
        const userResult = await pool.query('SELECT * FROM users WHERE LOWER(email) = LOWER($1)', [email]);

        // Si l'utilisateur n'existe pas
        if (userResult.rows.length === 0) {
            return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
        }

        const user = userResult.rows[0];

        // Vérification du mot de passe
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
        }

        // Mise à jour des adresses IP utilisées
        await pool.query('UPDATE users SET ip = array_append(ip, $1) WHERE uuid = $2', [ip, user.uuid]);

        // Génération du JWT
        const token = jwt.sign(
            { userUUID: user.uuid, email: user.email },
            process.env.JWT_SECRET as string, // Assurez-vous d'avoir une clé secrète dans votre .env
            { expiresIn: '30d' } 
        );

        // Stockage du JWT dans un cookie HTTP-only
        const cookie = serialize('auth_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Assurez-vous que le cookie est sécurisé en production
            sameSite: 'strict',
            path: '/',
            maxAge: 30 * 24 * 60 * 60, // 30 jours
        });

        res.setHeader('Set-Cookie', cookie);

        // Réponse sans inclure le token dans le corps
        return res.status(200).json({
            message: 'Connexion réussie',
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Erreur du serveur' });
    }
}
