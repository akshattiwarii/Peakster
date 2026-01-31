import Image from "next/image";

export function PartnersSection() {
    const partners = [
        { name: "redBus", color: "text-red-600" },
        { name: "goibibo", color: "text-orange-500" },
        { name: "OYO", color: "text-red-500" },
        { name: "rapido", color: "text-yellow-500" },
    ];

    return (
        <div className="relative z-10 bg-white dark:bg-black py-16 -mt-10">
            <div className="container mx-auto px-4 text-center">
                <p className="text-slate-500 font-medium mb-8 dark:text-slate-400">
                    We find the best <span className="text-black font-bold dark:text-white">deals</span> from the top travel brands.
                </p>

                <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-80">
                    {partners.map((partner) => (
                        <div key={partner.name} className="flex items-center gap-2 group cursor-pointer hover:opacity-100 transition-opacity">
                            {/* Placeholder text logos styled to look like brands */}
                            <span className={`text-2xl md:text-3xl font-bold tracking-tight ${partner.color} saturate-100 md:saturate-0 md:group-hover:saturate-100 transition-all duration-300`}>
                                {partner.name}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
