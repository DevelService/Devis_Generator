// src/lib/db.ts
import { Pool } from 'pg';

const pool = new Pool({
    user: process.env.POSTGRES_USER, // Nom d'utilisateur PostgreSQL
    host: process.env.POSTGRES_HOST, // Hôte de la base de données
    database: process.env.POSTGRES_DB, // Nom de la base de données
    password: process.env.POSTGRES_PASSWORD, // Mot de passe de l'utilisateur PostgreSQL
    port: parseInt(process.env.PG_PORT || '5432', 10), // Port, 5432 est le port par défaut
});

export { pool };
