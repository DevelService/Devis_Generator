CREATE TABLE users (
    uuid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL, -- Le mot de passe sera stocké haché
    username VARCHAR(255) UNIQUE NOT NULL, -- Nom d'utilisateur unique
    profile_picture VARCHAR(255), -- URL de la photo de profil
    address TEXT, -- Adresse de l'utilisateur
    phone_number VARCHAR(20), -- Numéro de téléphone
    premium BOOLEAN DEFAULT FALSE, -- Indique si l'utilisateur a un abonnement premium
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

CREATE TABLE documents (
    id SERIAL PRIMARY KEY,
    user_uuid UUID REFERENCES users(uuid) ON DELETE CASCADE NOT NULL, -- Relation avec l'utilisateur
    type VARCHAR(255) NOT NULL, -- Type de document
    template VARCHAR(255) NOT NULL, -- Modèle de document utilisé
    company BOOLEAN NOT NULL, -- Indique si le document est pour une entreprise
    date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, -- Date de création du document
    emetteur JSONB NOT NULL, -- Détails de l'émetteur (Individual ou Pro)
    client JSONB NOT NULL, -- Détails du client (Individual ou Pro)
    prestations JSONB NOT NULL, -- Liste des prestations
    reductions JSONB, -- Liste des réductions (optionnel)
    status VARCHAR(20) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'validated', 'cancelled')),
    numero_document VARCHAR(50), -- Numéro affecté uniquement à la validation
    document_hash TEXT, -- Hash SHA256 du document
    previous_document_hash TEXT -- Pour le chaînage de documents
);

CREATE TABLE templates (
    id SERIAL PRIMARY KEY, -- Identifiant unique du template
    name VARCHAR(255) UNIQUE NOT NULL, -- Nom du template
    description TEXT, -- Description du template
    file_path VARCHAR(255) NOT NULL, -- Chemin vers le fichier .ts contenant le code du template
    is_premium BOOLEAN DEFAULT FALSE, -- Indique si le template est premium
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Date de création
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Date de mise à jour
);

CREATE TABLE template_imports (
    id SERIAL PRIMARY KEY,
    file_path TEXT NOT NULL,
    imported_at TIMESTAMP DEFAULT now()
);

CREATE OR REPLACE FUNCTION import_templates_from_dir()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO templates (name, description, file_path, is_premium)
    SELECT 
        regexp_replace(file, '.ts$', '') AS name,
        'Auto-imported template',
        NEW.file_path || '/' || file,
        FALSE
    FROM pg_ls_dir(NEW.file_path) AS file
    WHERE file LIKE '%.ts';

    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_import_templates
AFTER INSERT ON template_imports
FOR EACH ROW
EXECUTE FUNCTION import_templates_from_dir();

-- 🔐 TABLE LOG D’AUDIT
CREATE TABLE audit_logs (
    id SERIAL PRIMARY KEY,
    user_uuid UUID REFERENCES users(uuid) ON DELETE SET NULL,
    action VARCHAR(255) NOT NULL,
    target_table VARCHAR(255),
    target_id TEXT,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 🔢 TABLE DE SUIVI DE NUMÉROTATION DE FACTURE PAR UTILISATEUR
CREATE TABLE invoice_counters (
    id SERIAL PRIMARY KEY,
    user_uuid UUID REFERENCES users(uuid) ON DELETE CASCADE,
    year INT NOT NULL,
    current_number INT DEFAULT 0,
    UNIQUE (user_uuid, year)
);