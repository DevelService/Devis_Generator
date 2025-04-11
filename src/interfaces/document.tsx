export interface Prestation {
    id: number;
    titre: string;
    description: string;
    prix: number;
    quantite: number;
}

export interface Individual {
    id: number;
    score: number;
    type: 'individual';
    nom: string;
    prenom: string;
    email: string;
    tel: string;
    adresse: string;
}

export interface Pro {
    id: number;
    score: number;
    type: 'pro';
    siren: string;
    entreprise: string;
    email: string;
    tel: string;
    adresse: string;
}

export type Emetteur_devis = Individual | Pro;
export type Client_devis = Individual | Pro;

export interface Reduction {
    id: number;
    description: string;
    montant: number; // Montant de la réduction
    percentage?: number; // Pourcentage de réduction (optionnel)
}

export interface Data {
    id: number;
    documentType: string;
    company: boolean;
    date: string;
    emetteur: Emetteur_devis;
    client: Client_devis;
    prestations: Prestation[];
    reductions?: Reduction[]; // Liste des réductions globales (optionnelle)
}
