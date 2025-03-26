"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams?.get("redirect") || "";

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password || !username) {
      setError("Email, mot de passe et nom d'utilisateur requis.");
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, username }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess("Utilisateur créé avec succès !");
        setTimeout(() => {
          router.push(`/login${redirect ? `?redirect=${encodeURIComponent(redirect)}` : ""}`);
        }, 2000);
      } else {
        setError(data.message || "Une erreur est survenue.");
      }
    } catch {
      setError("Erreur du serveur.");
    }
  };

  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold text-gray-800">S'enregistrer</h1>
      <form onSubmit={handleRegister} className="max-w-sm mx-auto mt-8">
        <div className="mb-4">
          <label htmlFor="username" className="block text-sm font-medium text-gray-600">
            Nom d'utilisateur
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-600">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="password" className="block text-sm font-medium text-gray-600">
            Mot de passe
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md"
          />
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}
        {success && <p className="text-green-500 text-sm">{success}</p>}

        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          S'enregistrer
        </button>
      </form>

      <div className="mt-4">
        <p className="text-sm">
          Déjà un compte ?{" "}
          <a href={`/login${redirect ? `?redirect=${encodeURIComponent(redirect)}` : ""}`} className="text-blue-500 cursor-pointer">
            Se connecter
          </a>
        </p>
      </div>
    </div>
  );
}
