'use client';

import { useEffect, useState } from 'react';
import { Emetteur_devis } from '@/interfaces/document';

interface EmetteurListProps {
    searchTriggered: boolean;
    searchTerm: string;
    handleSelectEmetteur: (emetteur: Emetteur_devis) => void;
    setSearchTriggered: (triggered: boolean) => void;
}

export default function EmetteurList({ searchTriggered, searchTerm, handleSelectEmetteur, setSearchTriggered }: EmetteurListProps) {
    const [emetteurs, setEmetteurs] = useState<Emetteur_devis[] | undefined>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!searchTriggered) return;

        async function fetchEmetteurs() {
            setLoading(true);
            try {
                const response = await fetch(`/api/emetteur?searchTerm=${encodeURIComponent(searchTerm)}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                const data = await response.json();
                setEmetteurs(data.emetteurs);
            } catch (error) {
                console.error('Error fetching emetteurs:', error);
            } finally {
                setLoading(false);
                setSearchTriggered(false);
            }
        }

        fetchEmetteurs();
    }, [searchTriggered, searchTerm]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!emetteurs || !emetteurs.length) {
        return <div>Aucun émetteur trouvé.</div>;
    }

    return (
        <div className="flex flex-col gap-9">
            <div className="grid grid-cols-1 gap-3 max-h-60 overflow-y-auto">
                {Array.isArray(emetteurs) && emetteurs.sort((a, b) => b.score - a.score).slice(0, 5).map((emetteur) => (
                    <div key={emetteur.id} className="border p-3 rounded-md cursor-pointer" onClick={() => handleSelectEmetteur(emetteur)}>
                        <h5>
                            {emetteur.type === 'individual' ? `${emetteur.nom} ${emetteur.prenom}` : emetteur.entreprise}
                            <span className="text-gray-500 ml-2">({emetteur.type})</span>
                        </h5>
                        <p>{emetteur.email}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
