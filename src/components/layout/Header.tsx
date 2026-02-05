'use client';

import { Link, usePathname, useRouter } from '@/i18n/routing';
import { useTranslations, useLocale } from 'next-intl';
import { useState, useEffect } from 'react';
import { Menu, X, Globe, Hand } from 'lucide-react';
import { useHandGesture } from '@/components/gestures/HandGestureManager';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { useTheme } from '@/components/ui/ThemeProvider';
import { motion, AnimatePresence } from 'framer-motion';

export default function Header() {
    const t = useTranslations('Navigation');
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const { isActive: isHandActive, toggleActive: toggleHand, error: handError } = useHandGesture();
    const { theme } = useTheme();

    useEffect(() => {
        if (handError) {
            alert(handError);
        }
    }, [handError]);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

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
        <motion.header
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled
                ? 'glass-panel shadow-lg py-2'
                : 'bg-transparent py-4'
                }`}
        >
            <div className="container mx-auto px-6 flex justify-between items-center">
                {/* Logo Area */}
                <Link href="/" className="flex items-center group">
                    <motion.img
                        whileHover={{ scale: 1.05 }}
                        src="/logos/mplan-group-logo.png"
                        alt="Mplan Group"
                        className={`h-14 md:h-16 w-auto object-contain transition-all duration-300 ${scrolled ? 'brightness-100' : 'brightness-100'
                            } ${theme === 'dark' ? 'logo-dark-contrast' : ''}`}
                    />
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-6">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="relative text-sm font-medium uppercase tracking-wide text-[var(--muted)] hover:text-[var(--foreground)] transition-colors group"
                        >
                            {item.label}
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[var(--primary)] transition-all group-hover:w-full" />
                        </Link>
                    ))}

                    {/* Separator */}
                    <div className="w-px h-6 bg-[var(--card-border)]" />

                    {/* Hand Control Button */}
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={toggleHand}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all text-xs uppercase font-medium ${isHandActive
                            ? 'bg-[var(--primary)]/20 border-[var(--primary)] text-[var(--primary)]'
                            : 'border-[var(--card-border)] text-[var(--muted)] hover:border-[var(--primary)] hover:text-[var(--primary)]'
                            }`}
                        title="Hand Control"
                    >
                        <Hand className={`w-4 h-4 ${isHandActive ? 'animate-pulse' : ''}`} />
                        <span className="hidden lg:inline">{isHandActive ? 'Active' : 'Hand'}</span>
                    </motion.button>

                    {/* Language Button */}
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={toggleLanguage}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--card-border)] hover:border-[var(--primary)] transition-all text-xs uppercase font-medium text-[var(--muted)] hover:text-[var(--primary)]"
                    >
                        <Globe className="w-4 h-4" />
                        {locale === 'en' ? 'AR' : 'EN'}
                    </motion.button>

                    {/* Theme Toggle */}
                    <ThemeToggle />
                </nav>

                {/* Mobile Controls */}
                <div className="flex md:hidden items-center gap-3">
                    <ThemeToggle />
                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="p-2"
                    >
                        {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </motion.button>
                </div>
            </div>

            {/* Mobile Nav Overlay */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden glass-panel border-t border-[var(--card-border)]"
                    >
                        <div className="p-6 flex flex-col gap-4">
                            {navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setIsMenuOpen(false)}
                                    className="text-lg font-medium hover:text-[var(--primary)] transition-colors"
                                >
                                    {item.label}
                                </Link>
                            ))}

                            <div className="divider my-2" />

                            <button
                                onClick={() => {
                                    toggleHand();
                                    setIsMenuOpen(false);
                                }}
                                className={`flex items-center gap-3 text-lg font-medium ${isHandActive ? 'text-[var(--primary)]' : ''
                                    }`}
                            >
                                <Hand className="w-5 h-5" />
                                {isHandActive ? 'Disable Hand Control' : 'Enable Hand Control'}
                            </button>

                            <button
                                onClick={() => {
                                    toggleLanguage();
                                    setIsMenuOpen(false);
                                }}
                                className="flex items-center gap-3 text-lg font-medium text-[var(--secondary)]"
                            >
                                <Globe className="w-5 h-5" />
                                {locale === 'en' ? 'Switch to Arabic' : 'Switch to English'}
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.header>
    );
}
