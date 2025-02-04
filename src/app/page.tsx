"use client";

import { useState } from "react";
import Form from "@/components/Form";
import Preview from "@/components/Preview";

export default function Home() {
  const [formData, setFormData] = useState({
    company: "",
    siret: "",
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
RIB : FR76 1732 8844 0043 6713 2165 397`,
    documentType: "quote",
  });

  const handleChange = (updatedData: any) => {
    setFormData(updatedData);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen p-6 bg-gray-100 gap-6">
      <Form formData={formData} handleChange={handleChange} />

      <Preview formData={formData} />
    </div>
  );
}