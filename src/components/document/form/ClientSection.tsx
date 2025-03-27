'use client';

import React, { useState, useEffect } from 'react';
import TitreSection from './SectionAssets/TitreSection';
import { Data, Client_devis } from '@/interfaces/document';
import ClientList from './Client/ClientList';
import ClientForm from './Client/ClientForm';

interface ClientProps {
    handleChangeData: (key: string, value: string) => void;
    data: Data;
}

export default function ClientSection({ handleChangeData, data }: ClientProps) {
    const [selectedClient, setSelectedClient] = useState<Client_devis | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [searchTriggered, setSearchTriggered] = useState(true);

    const clearData = () => {
        handleChangeData('client.nom', '');
        handleChangeData('client.prenom', '');
        handleChangeData('client.email', '');
        handleChangeData('client.tel', '');
        handleChangeData('client.adresse', '');
        handleChangeData('client.entreprise', '');
        handleChangeData('client.siren', '');
    };

    const handleSelectClient = (client: Client_devis) => {
        clearData();
        setSelectedClient(client);
        if (client.type === 'individual') {
            setSearchTerm(`${client.nom} ${client.prenom}`);
            handleChangeData('client.nom', client.nom);
            handleChangeData('client.prenom', client.prenom);
            handleChangeData('client.type', 'individual');
        } else {
            setSearchTerm(client.entreprise);
            handleChangeData('client.entreprise', client.entreprise);
            handleChangeData('client.siren', client.siren);
            handleChangeData('client.type', 'pro');
        }
        handleChangeData('client.email', client.email);
        handleChangeData('client.tel', client.tel);
        handleChangeData('client.adresse', client.adresse);
    };

    const handleAddClient = () => {
        setSelectedClient(null);
        setSearchTerm('');
        clearData();
        setShowForm(true);
    };

    const handleSearch = () => {
        setSearchTriggered(true);
    };

    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <section>
            <TitreSection titre="Client" description="Ceci est l'émetteur du document." />
            {!showForm && (
                <div className="flex flex-wrap items-center mb-4">
                    <input
                        type="text"
                        placeholder="Rechercher..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="p-2 border rounded mr-2 flex-grow"
                    />
                    <div className="flex flex-wrap mt-2 sm:mt-0">
                        <button
                            onClick={handleSearch}
                            className="p-2 bg-blue-500 text-white rounded mr-2 whitespace-nowrap"
                        >
                            Rechercher
                        </button>
                        <button
                            onClick={handleAddClient}
                            className="p-2 bg-blue-500 text-white rounded whitespace-nowrap"
                        >
                            Ajouter un Client
                        </button>
                    </div>
                </div>
            )}
            {showForm ? (
                <ClientForm
                    setSearchTriggered={setSearchTriggered}
                    handleChangeData={handleChangeData}
                    data={data}
                    setShowForm={setShowForm}
                />
            ) : (
                <ClientList
                    searchTriggered={searchTriggered}
                    searchTerm={searchTerm}
                    handleSelectClient={handleSelectClient}
                    setSearchTriggered={setSearchTriggered}
                />
            )}
        </section>
    );
}