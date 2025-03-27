// src/pages/api/auth/validate-token.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import { pool } from '@/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Méthode non autorisée' });
  }

  const token = req.cookies.auth_token; // Récupération du token depuis le cookie

  if (!token) {
    return res.status(400).json({ message: 'Token manquant' });
  }

  try {
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: 'JWT_SECRET non défini' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET) as { userUUID: string };
    const userUUID = decoded.userUUID;
    console.log('decoded', decoded);

    // Vérification de l'utilisateur dans la base de données
    const userCheckQuery = `
      SELECT * FROM users
      WHERE uuid = $1;
    `;
    const userCheckResult = await pool.query(userCheckQuery, [userUUID]);

    console.log('userCheckQuery', userCheckQuery);
    console.log('userUUID', userUUID);
    console.log('userCheckResult.rows', userCheckResult.rows);

    if (userCheckResult.rows.length === 0) {
      return res.status(400).json({ message: 'Utilisateur non valide' });
    }

    return res.status(200).json({ message: 'Token valide', user: decoded });
  } catch (error) {
    return res.status(401).json({ message: 'Token invalide' });
  }
}
