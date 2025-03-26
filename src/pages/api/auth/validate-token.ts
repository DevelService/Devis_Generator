// src/pages/api/auth/validate-token.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Méthode non autorisée' });
  }

  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ message: 'Token manquant' });
  }

  try {
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: 'JWT_SECRET non défini' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return res.status(200).json({ message: 'Token valide', user: decoded });
  } catch (error) {
    return res.status(401).json({ message: 'Token invalide' });
  }
}
