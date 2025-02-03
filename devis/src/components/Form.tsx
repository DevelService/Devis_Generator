"use client";

import { useState, useEffect } from "react";

interface FormProps {
  formData: {
    company: string;
    siret: string;
    address: string;
    email: string;
    phone: string;
    vat: string;
    quoteNumber: string;
    prestations: { title: string, description: string, price: number, quantity: number }[];
    additionalInfo: string;
    documentType: 'quote' | 'invoice';
  };
  handleChange: (formData: any) => void;
}

export default function Form({ formData, handleChange }: FormProps) {
  const [prestations, setPrestations] = useState(formData.prestations || []);
  const [expanded, setExpanded] = useState(prestations.map(() => true));
  const [adding, setAdding] = useState(false);
  const [removingIndex, setRemovingIndex] = useState<number | null>(null);

  const [documentType, setDocumentType] = useState(formData.documentType || 'quote');

  useEffect(() => {
    handleChange({ ...formData, prestations });
  }, [prestations]);

  const addPrestation = () => {
    setAdding(true);
    setPrestations([...prestations, { title: "", description: "", price: NaN, quantity: NaN }]);
    setExpanded([...expanded, true]);
    setTimeout(() => setAdding(false), 500);
  };

  const handlePrestationChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name) {
      const newPrestations = prestations.map((prestation, i) => {
        if (i === index) {
          return { ...prestation, [name]: name === "price" || name === "quantity" ? (value === "" ? NaN : Number(value)) : value };
        }
        return prestation;
      });
      setPrestations(newPrestations);
    }
  };

  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name) {
      if (name === "vat" && value !== "") {
        const vatValue = Math.max(-100, Math.min(100, Number(value)));
        handleChange({ ...formData, [name]: vatValue });
      } else if (name === "siret" && value.length <= 9) {
        handleChange({ ...formData, [name]: value });
      } else if (name !== "siret") {
        handleChange({ ...formData, [name]: value });
      }
    }
  };

  const toggleExpand = (index: number) => {
    const newExpanded = expanded.map((exp, i) => (i === index ? !exp : exp));
    setExpanded(newExpanded);
  };

  const removePrestation = (index: number) => {
    setRemovingIndex(index);
    setTimeout(() => {
      const newPrestations = prestations.filter((_, i) => i !== index);
      setPrestations(newPrestations);
      const newExpanded = expanded.filter((_, i) => i !== index);
      setExpanded(newExpanded);
      setRemovingIndex(null);
    }, 500);
  };

  const toggleDocumentType = () => {
    const newDocumentType = documentType === 'quote' ? 'invoice' : 'quote';
    setDocumentType(newDocumentType);
    handleChange({ ...formData, documentType: newDocumentType });
  };

  return (
    <div className="md:fixed md:top-0 md:left-0 md:h-full md:w-1/3 w-full bg-white p-6 shadow-md overflow-y-auto">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">
        Génération de {documentType === 'quote' ? 'Devis' : 'Factures'}
      </h1>
      <button type="button" onClick={toggleDocumentType} className="bg-[#4B3CE4] text-white px-4 py-2 rounded-lg mb-4">
        {documentType === 'quote' ? 'Passer à la Facture' : 'Passer au Devis'}
      </button>
      <form className="space-y-4">
        <p className="text-base font-bold mb-4 text-gray-800">Le client</p>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex gap-1 flex-col">
            <div className="flex gap-1">
              <label className="font-medium text-xs text-gray-700 block">Siret/Siren</label>
              <p className="text-xs font-bold text-[#4B3CE4]">*</p>
            </div>
            <input
              id="siret"
              type="text"
              name="siret"
              placeholder="SIREN"
              className="w-full p-2 border rounded-lg text-gray-800"
              onChange={handleFieldChange}
              value={formData.siret}
            />
          </div>
          <div className="flex gap-1 flex-col">
            <div className="flex gap-1">
              <label className="font-medium text-xs text-gray-700 block">Raison sociale</label>
              <p className="text-xs font-bold text-[#4B3CE4]">*</p>
            </div>
            <input
              id="company"
              type="text"
              name="company"
              placeholder="Nom de l'entreprise"
              className="w-full p-2 border rounded-lg text-gray-800"
              onChange={handleFieldChange}
              value={formData.company}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex gap-1 flex-col">
            <div className="flex gap-1">
              <label className="font-medium text-xs text-gray-700 block">Adresse mail</label>
              <p className="text-xs font-bold text-[#4B3CE4]"></p>
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-2">
                <i className="fas fa-envelope text-[#A1A1AA]"></i>
              </span>
              <input
                id="email"
                type="email"
                name="email"
                placeholder="john.smith@example.com"
                className="w-full p-2 pl-8 border rounded-lg text-gray-800"
                onChange={handleFieldChange}
                value={formData.email}
              />
            </div>
          </div>
          <div className="flex gap-1 flex-col">
            <div className="flex gap-1">
              <label className="font-medium text-xs text-gray-700 block">Téléphone</label>
              <p className="text-xs font-bold text-[#4B3CE4]"></p>
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-2">
                <i className="fas fa-phone text-[#A1A1AA]"></i>
              </span>
              <input
                id="phone"
                type="text"
                name="phone"
                placeholder="01.23.45.67.89"
                className="w-full p-2 pl-8 border rounded-lg text-gray-800"
                onChange={handleFieldChange}
                value={formData.phone}
              />
            </div>
          </div>
        </div>
        <div className="flex gap-1 flex-col">
          <div className="flex gap-1">
            <label className="font-medium text-xs text-gray-700 block">Adresse complète</label>
            <p className="text-xs font-bold text-[#4B3CE4]">*</p>
          </div>
          <input
            id="address"
            type="text"
            name="address"
            placeholder="1 Av. Gustave Eiffel, 75007 Paris"
            className="w-full p-2 border rounded-lg text-gray-800"
            onChange={handleFieldChange}
            value={formData.address}
          />
        </div>

        <hr className="my-4 border-gray-300" />

        <p className="text-base font-bold mb-4 text-gray-800">{documentType === 'quote' ? 'Le devis' : 'La facture'}</p>

        <div className="flex gap-1 flex-col">
          <div className="flex gap-1">
            <label className="font-medium text-xs text-gray-700 block">Numéro du {documentType === 'quote' ? 'devis' : 'facture'}</label>
            <p className="text-xs font-bold text-[#4B3CE4]">*</p>
          </div>
          <input
            id="quoteNumber"
            type="text"
            name="quoteNumber"
            placeholder={`2025-0000`}
            className="w-full p-2 border rounded-lg text-gray-800"
            onChange={handleFieldChange}
            value={formData.quoteNumber}
          />
        </div>

        <div className="space-y-4">
          {prestations.map((prestation, index) => (
            <div
              key={index}
              className={`px-4 rounded-xl space-y-2 transition-all duration-500 bg-[#F6F6F6] ${
                adding && index === prestations.length - 1 ? 'transform scale-95 opacity-0' : 'transform scale-100 opacity-100'
              } ${
                removingIndex === index ? 'transform scale-95 opacity-0' : 'transform scale-100 opacity-100'
              }`}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <p className="font-bold text-gray-800 text-lg mr-2">Prestation n°{index + 1}</p>
                  <button
                    type="button"
                    className="p-2 text-blue-600"
                    onClick={() => toggleExpand(index)}
                  >
                    <i className={`fas ${expanded[index] ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
                  </button>
                </div>
                <button
                  type="button"
                  className="p-2 text-red-600"
                  onClick={() => removePrestation(index)}
                >
                  <i className="fas fa-trash"></i>
                </button>
              </div>
              <div className={`${expanded[index] ? 'max-h-screen opacity-100 pb-3' : 'max-h-0 opacity-0 pb-0'} overflow-hidden transition-all duration-500 ease-in-out`}>
                <div className="flex gap-1 flex-col">
                  <div className="flex gap-1">
                    <label className="font-medium text-xs text-gray-700 block">Titre de la prestation</label>
                    <p className="text-xs font-bold text-[#4B3CE4]">*</p>
                  </div>
                  <input
                    type="text"
                    name="title"
                    placeholder="Maquette web"
                    className="w-full p-2 border rounded-lg text-gray-800"
                    onChange={(e) => handlePrestationChange(index, e)}
                    value={prestation.title || ""}
                  />
                </div>
                <div className="flex gap-1 flex-col">
                  <div className="flex gap-1">
                    <label className="font-medium text-xs text-gray-700 block">Description de la prestation</label>
                    <p className="text-xs font-bold text-[#4B3CE4]">*</p>
                  </div>
                  <textarea
                    name="description"
                    placeholder="Nous voulons un site internet..."
                    className="w-full p-2 border rounded-lg text-gray-800"
                    onChange={(e) => handlePrestationChange(index, e)}
                    value={prestation.description || ""}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex gap-1 flex-col">
                    <div className="flex gap-1">
                      <label className="font-medium text-xs text-gray-700 block">Prix</label>
                      <p className="text-xs font-bold text-[#4B3CE4]">*</p>
                    </div>
                    <input
                      type="text"
                      name="price"
                      placeholder="200,00"
                      className="w-full p-2 border rounded-lg text-gray-800"
                      onChange={(e) => handlePrestationChange(index, e)}
                      value={Number.isNaN(prestation.price) ? "" : prestation.price}
                    />
                  </div>
                  <div className="flex gap-1 flex-col">
                    <div className="flex gap-1">
                      <label className="font-medium text-xs text-gray-700 block">Quantité</label>
                      <p className="text-xs font-bold text-[#4B3CE4]">*</p>
                    </div>
                    <input
                      type="text"
                      name="quantity"
                      placeholder="Quantité"
                      className="w-full p-2 border rounded-lg text-gray-800"
                      onChange={(e) => handlePrestationChange(index, e)}
                      value={Number.isNaN(prestation.quantity) ? "" : prestation.quantity}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
          <button
            type="button"
            className="bg-transparent text-gray-800 px-4 py-2 rounded border"
            onClick={addPrestation}
          >
            Ajouter une prestation
          </button>
        </div>

        <hr className="my-4 border-gray-300" />

        <p className="text-base font-bold mb-4 text-gray-800">Informations complémentaires</p>
        <div className="flex gap-1 flex-col">
          <div className="flex gap-1">
            <label className="font-medium text-xs text-gray-700 block">TVA Applicable</label>
            <p className="text-xs font-bold text-[#4B3CE4]">*</p>
          </div>
          <input
            id="vat"
            type="number"
            name="vat"
            placeholder="TVA (%)"
            className="w-full p-2 border rounded-lg text-gray-800"
            onChange={handleFieldChange}
            value={formData.vat}
            min={-100}
            max={100}
          />
        </div>
        <div className="flex gap-1 flex-col">
          <div className="flex gap-1">
            <label className="font-medium text-xs text-gray-700 block">Informations</label>
            <p className="text-xs font-bold text-[#4B3CE4]">*</p>
          </div>
          <textarea
            id="additionalInfo"
            name="additionalInfo"
            placeholder="Un acompte de 50 % est demandé dès la validation du devis. Le solde restant sera dû à la livraison."
            className="w-full h-52 p-2 border rounded-lg text-gray-800"
            onChange={handleFieldChange}
            value={formData.additionalInfo}
          />
        </div>
      </form>
    </div>
  );
}