"use client";

import { useState } from "react";
import Form from "@/components/Form";
import Preview from "@/components/Preview";
import ConfirmationPopup from "@/components/ConfirmationPopup";

export default function Document() {
  const COMPANY_RIB = process.env.COMPANY_RIB;

  const [formData, setFormData] = useState({
    company: "",
    siren: "",
    address: "",
    email: "",
    phone: "",
    vat: 20,
    quoteNumber: `2025-0000`,
    prestations: [],
    additionalInfo: `*Acompte*
50 % du montant total TTC, soit [50%total],
à verser à la signature du devis.

*Solde*
Le solde de [50%total] sera payé en [3x50%total] chacune,
le premier paiement étant dû à la fin de la prestation,
puis un mois après chaque échéance.

*Mode de paiement*
Virement bancaire
RIB : ${COMPANY_RIB}`,
    documentType: "quote",
  });

  const [showConfirmationPopup, setShowConfirmationPopup] = useState(false);

  const handleChange = (updatedData: any) => {
    setFormData(updatedData);
  };

  const confirmAndRemoveAllPrestations = () => {
    setShowConfirmationPopup(true);
  };

  const handleConfirmDelete = () => {
    setFormData((prevData) => ({ ...prevData, prestations: [] }));
    setShowConfirmationPopup(false);
  };

  const handleCancelDelete = () => {
    setShowConfirmationPopup(false);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen p-6 bg-gray-100 gap-6">
      <Form
        formData={formData}
        handleChange={handleChange}
        confirmAndRemoveAllPrestations={confirmAndRemoveAllPrestations}
        removeAllPrestations={() => setFormData((prevData) => ({ ...prevData, prestations: [] }))}
      />
      <Preview formData={formData} />
      <ConfirmationPopup
        show={showConfirmationPopup}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        message="Cette action est irréversible. Êtes-vous sûr de vouloir continuer ?"
      />
    </div>
  );
}