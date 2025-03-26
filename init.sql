DROP TABLE IF EXISTS emetteurs;
DROP TABLE IF EXISTS clients;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
    uuid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL, -- Le mot de passe sera stocké haché
    username VARCHAR(255) UNIQUE NOT NULL, -- Nom d'utilisateur unique
    profile_picture VARCHAR(255), -- URL de la photo de profil
    address TEXT, -- Adresse de l'utilisateur
    phone_number VARCHAR(20), -- Numéro de téléphone
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- Date de création
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- Date de mise à jour
    ip TEXT[] -- Tableau des adresses IP utilisées par l'utilisateur
);

CREATE TABLE emetteurs (
    id SERIAL PRIMARY KEY,
    user_uuid UUID REFERENCES users(uuid) ON DELETE CASCADE NOT NULL, -- Relation avec l'utilisateur
    type VARCHAR(20) NOT NULL CHECK (type IN ('individual', 'pro')), -- Détermine si l'émetteur est un particulier ou un professionnel
    nom VARCHAR(255), -- Utilisé pour un particulier
    prenom VARCHAR(255), -- Utilisé pour un particulier
    entreprise VARCHAR(255), -- Utilisé pour un professionnel
    siren VARCHAR(14), -- Utilisé pour un professionnel (SIREN à 9 chiffres mais peut inclure espace ou tiret)
    email VARCHAR(255) NOT NULL, -- Champ obligatoire pour tous
    tel VARCHAR(20), 
    adresse TEXT
);

CREATE TABLE clients (
    id SERIAL PRIMARY KEY,
    user_uuid UUID REFERENCES users(uuid) ON DELETE CASCADE NOT NULL, -- Relation avec l'utilisateur
    type VARCHAR(20) NOT NULL CHECK (type IN ('individual', 'pro')), -- Détermine si l'émetteur est un particulier ou un professionnel
    nom VARCHAR(255), -- Utilisé pour un particulier
    prenom VARCHAR(255), -- Utilisé pour un particulier
    entreprise VARCHAR(255), -- Utilisé pour un professionnel
    siren VARCHAR(14), -- Utilisé pour un professionnel (SIREN à 9 chiffres mais peut inclure espace ou tiret)
    email VARCHAR(255) NOT NULL, -- Champ obligatoire pour tous
    tel VARCHAR(20), 
    adresse TEXT
);