'use client';

import { useTranslations } from 'next-intl';

export default function Footer() {
    const t = useTranslations('Metadata');

    return (
        <footer className="w-full py-4 border-t border-white/5 bg-black/50 backdrop-blur-md">
            <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
                <div className="flex items-center gap-2">
                    &copy; {new Date().getFullYear()} <img src="/logos/mplan.png" alt="Mplan Group" className="h-14 w-auto" /> All rights reserved.
                </div>
                <div className="flex gap-4 mt-4 md:mt-0">
                    <a href="#" className="hover:text-mplan-cyan transition-colors">LinkedIn</a>
                    <a href="#" className="hover:text-mplan-cyan transition-colors">Twitter</a>
                    <a href="#" className="hover:text-mplan-cyan transition-colors">Instagram</a>
                </div>
            </div>
        </footer>
    );
}
