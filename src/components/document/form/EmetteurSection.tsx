'use client';

import React, { useState, useEffect } from 'react';
import TitreSection from './SectionAssets/TitreSection';
import { Data, Emetteur_devis } from '@/interfaces/document';
import EmetteurList from './Emetteur/EmetteurList';
import EmetteurForm from './Emetteur/EmetteurForm';

interface EmetteurProps {
    handleChangeData: (key: string, value: string) => void;
    data: Data;
}

export default function EmetteurSection({ handleChangeData, data }: EmetteurProps) {
    const [selectedEmetteur, setSelectedEmetteur] = useState<Emetteur_devis | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [searchTriggered, setSearchTriggered] = useState(true);

    const clearData = () => {
        handleChangeData('emetteur.nom', '');
        handleChangeData('emetteur.prenom', '');
        handleChangeData('emetteur.email', '');
        handleChangeData('emetteur.tel', '');
        handleChangeData('emetteur.adresse', '');
        handleChangeData('emetteur.entreprise', '');
        handleChangeData('emetteur.siren', '');
    };

    const handleSelectEmetteur = (emetteur: Emetteur_devis) => {
        clearData();
        setSelectedEmetteur(emetteur);
        if (emetteur.type === 'individual') {
            setSearchTerm(`${emetteur.nom} ${emetteur.prenom}`);
            handleChangeData('emetteur.nom', emetteur.nom);
            handleChangeData('emetteur.prenom', emetteur.prenom);
            handleChangeData('emetteur.type', 'individual');
        } else {
            setSearchTerm(emetteur.entreprise);
            handleChangeData('emetteur.entreprise', emetteur.entreprise);
            handleChangeData('emetteur.siren', emetteur.siren);
            handleChangeData('emetteur.type', 'pro');
        }
        handleChangeData('emetteur.email', emetteur.email);
        handleChangeData('emetteur.tel', emetteur.tel);
        handleChangeData('emetteur.adresse', emetteur.adresse);
    };

    const handleAddEmetteur = () => {
        setSelectedEmetteur(null);
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
            <TitreSection titre="Émetteur" description="Ceci est l'émetteur du document." />
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
                    onClick={handleAddEmetteur}
                    className="p-2 bg-blue-500 text-white rounded whitespace-nowrap"
                >
                    Ajouter un Émetteur
                </button>
                </div>
            </div>
            )}
            {showForm ? (
            <EmetteurForm
                setSearchTriggered={setSearchTriggered}
                handleChangeData={handleChangeData}
                data={data}
                setShowForm={setShowForm}
            />
            ) : (
            <EmetteurList
                searchTriggered={searchTriggered}
                searchTerm={searchTerm}
                handleSelectEmetteur={handleSelectEmetteur}
                setSearchTriggered={setSearchTriggered}
            />
            )}
        </section>
    );
}