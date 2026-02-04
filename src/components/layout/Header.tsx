'use client';

import { Link, usePathname, useRouter } from '@/i18n/routing';
import { useTranslations, useLocale } from 'next-intl';
import { useState } from 'react';
import { Menu, X, Globe } from 'lucide-react';

export default function Header() {
    const t = useTranslations('Navigation');
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleLanguage = () => {
        const nextLocale = locale === 'en' ? 'ar' : 'en';
        router.replace(pathname, { locale: nextLocale });
    };

    const navItems = [
        { label: t('home'), href: '/' },
        { label: t('about'), href: '/about' },
        { label: t('companies'), href: '/companies' },
        { label: t('contact'), href: '/contact' },
    ];

    return (
        <header className="fixed top-0 left-0 w-full z-50 glass-panel border-b-0 border-b-transparent transition-all duration-300">
            <div className="container mx-auto px-6 py-1 flex justify-between items-center">
                {/* Logo Area */}
                <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
                    <img
                        src="/logos/mplan.png"
                        alt="Mplan Group"
                        className="h-20 w-auto object-contain"
                    />
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-8">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="text-sm uppercase tracking-widest hover:text-mplan-cyan transition-colors relative group"
                        >
                            {item.label}
                            <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-mplan-cyan transition-all group-hover:w-full" />
                        </Link>
                    ))}

                    <button
                        onClick={toggleLanguage}
                        className="flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 hover:border-mplan-cyan/50 hover:bg-white/5 transition-all text-xs uppercase"
                    >
                        <Globe className="w-3 h-3" />
                        {locale === 'en' ? 'AR' : 'EN'}
                    </button>
                </nav>

                {/* Mobile Menu Toggle */}
                <button
                    className="md:hidden text-white"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    {isMenuOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Nav Overlay */}
            {isMenuOpen && (
                <div className="md:hidden absolute top-full left-0 w-full bg-black/95 backdrop-blur-xl border-b border-white/10 p-6 flex flex-col gap-4">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setIsMenuOpen(false)}
                            className="text-lg font-medium hover:text-mplan-cyan"
                        >
                            {item.label}
                        </Link>
                    ))}
                    <button
                        onClick={() => {
                            toggleLanguage();
                            setIsMenuOpen(false);
                        }}
                        className="text-left text-lg font-medium text-mplan-gold mt-4"
                    >
                        {locale === 'en' ? 'Switch to Arabic' : 'Switch to English'}
                    </button>
                </div>
            )}
        </header>
    );
}
