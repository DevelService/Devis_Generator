'use client';

import { Data } from '@/interfaces/document';

interface HeaderProps {
	data: Data;
}

export default function Header({ data }: HeaderProps) {
	return (
		<section className="flex flex-col gap-7">
			<h1 className="text-5xl">
				Crée {data.documentType === 'devis' ? 'un' : 'une'} {data.documentType}, c’est
				gratuit et facile !
			</h1>
			<h3 className="text-lg text-[#71717A]">
				Consectetur deserunt fugiat consequat ex sint irure nulla est
				excepteur. Qui non est occaecat sint tempor esse adipisicing.
			</h3>
		</section>
	);
}
