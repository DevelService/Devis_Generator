'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function Login() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const router = useRouter();
	const searchParams = useSearchParams();
	const redirect = searchParams?.get('redirect') || '/dashboard';

	useEffect(() => {
		const token = sessionStorage.getItem('token');
		if (token) {
			fetch('/api/auth/validate-token', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ token }),
			})
				.then((res) => res.json())
				.then((data) => {
					if (data.ok) {
						setIsAuthenticated(true);
					} else {
						sessionStorage.removeItem('token');
					}
				})
				.catch(() => {
					sessionStorage.removeItem('token');
				});
		}
	}, []);

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!email || !password) {
			setError('Email et mot de passe requis.');
			return;
		}

		try {
			const res = await fetch('/api/auth/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ email, password }),
			});

			const data = await res.json();

			if (res.ok) {
				sessionStorage.setItem('token', data.token);
				setSuccess('Connexion réussie !');
				setIsAuthenticated(true);
				router.push(redirect); // Redirection après connexion
			} else {
				setError(data.message || 'Une erreur est survenue.');
			}
		} catch {
			setError('Erreur du serveur.');
		}
	};

	return (
		<div className="text-center">
			<h1 className="text-4xl font-bold text-gray-800">Se connecter</h1>
			<form onSubmit={handleLogin} className="max-w-sm mx-auto mt-8">
				<div className="mb-4">
					<label
						htmlFor="email"
						className="block text-sm font-medium text-gray-600"
					>
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
					<label
						htmlFor="password"
						className="block text-sm font-medium text-gray-600"
					>
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
					Se connecter
				</button>
			</form>
			<div className="mt-4">
				<p className="text-sm">
					Pas encore inscrit ?{' '}
					<a
						href={`/register?redirect=${encodeURIComponent(
							redirect
						)}`}
						className="text-blue-500 cursor-pointer"
					>
						S'enregistrer
					</a>
				</p>
			</div>
		</div>
	);
}
