'use client';

import React from 'react';
import { Data } from '@/interfaces/document';

export default function Preview({ data }: { data: Data }) {
	return (
		<div>
			<h2>--- Preview ---</h2>
			<div>
				<h3>Émetteur</h3>
				{data.emetteur.type === 'individual' ? (
					<p>Nom: {data.emetteur.nom}</p>
				) : data.emetteur.type === 'pro' ? (
					<p>SIREN: {data.emetteur.siren}</p>
				) : null}
				{data.emetteur.type === 'individual' ? <p>Prénom: {data.emetteur.prenom}</p>: <p>Entreprise: {data.emetteur.entreprise}</p>}
				<p>Téléphone: {data.emetteur.tel}</p>
				<p>Email: {data.emetteur.email}</p>
				<p>Adresse: {data.emetteur.adresse}</p>
			</div>
			<div>
				<h3>--- Client ---</h3>
				{data.client.type === 'individual' ? (
					<p>Nom: {data.client.nom}</p>
				) : data.client.type === 'pro' ? (
					<p>SIREN: {data.client.siren}</p>
				) : null}
				{data.client.type === 'individual' ? <p>Prénom: {data.client.prenom}</p>: <p>Entreprise: {data.client.entreprise}</p>}
				<p>Téléphone: {data.client.tel}</p>
				<p>Email: {data.client.email}</p>
				<p>Adresse: {data.client.adresse}</p>
			</div>
			<div>
				<h3>--- Prestations ---</h3>
				{data.prestations.map((prestation, index) => (
					<div key={prestation.id}>
						<h4>Prestation n°{index + 1}</h4>
						<p>Titre: {prestation.titre}</p>
						<p>Description: {prestation.description}</p>
						<p>Prix: {prestation.prix}</p>
						<p>Quantité: {prestation.quantite}</p>
					</div>
				))}
			</div>
		</div>
	);
}
