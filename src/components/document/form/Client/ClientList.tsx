'use client';

import { useEffect, useState } from 'react';
import { Client_devis } from '@/interfaces/document';

interface ClientListProps {
    searchTriggered: boolean;
    searchTerm: string;
    handleSelectClient: (client: Client_devis) => void;
    setSearchTriggered: (triggered: boolean) => void;
}

export default function ClientList({ searchTriggered, searchTerm, handleSelectClient, setSearchTriggered }: ClientListProps) {
    const [clients, setClients] = useState<Client_devis[] | undefined>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!searchTriggered) return;

        async function fetchClients() {
            setLoading(true);
            try {
                const response = await fetch(`/api/client?searchTerm=${encodeURIComponent(searchTerm)}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                const data = await response.json();
                setClients(data.clients);
            } catch (error) {
                console.error('Error fetching clients:', error);
            } finally {
                setLoading(false);
                setSearchTriggered(false);
            }
        }

        fetchClients();
    }, [searchTriggered, searchTerm]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!clients || !clients.length) {
        return <div>Aucun client trouvé.</div>;
    }

    return (
        <div className="flex flex-col gap-9">
            <div className="grid grid-cols-1 gap-3 max-h-60 overflow-y-auto">
                {Array.isArray(clients) && clients.sort((a, b) => b.score - a.score).slice(0, 5).map((client) => (
                    <div key={client.id} className="border p-3 rounded-md cursor-pointer" onClick={() => handleSelectClient(client)}>
                        <h5>
                            {client.type === 'individual' ? `${client.nom} ${client.prenom}` : client.entreprise}
                            <span className="text-gray-500 ml-2">({client.type})</span>
                        </h5>
                        <p>{client.email}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
