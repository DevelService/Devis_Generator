'use client';



interface TitreSectionProps {
	titre: string;
	description: string;
}

export default function TitreSection({titre, description}: TitreSectionProps) {
	return (
			<div className="relative w-max my-2">
				<h2 className="text-lg flex">
					{titre} :
					<span className="relative ml-2 group">
						<div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
							<i className="fa fa-info-circle text-gray-400 text-[13px]"></i>
                            <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 p-2 text-xs text-white bg-black rounded opacity-0 group-hover:opacity-60 transition-opacity w-max whitespace-nowrap">
                                {description}
                            </span>
						</div>
					</span>
				</h2>
			</div>
    );
}