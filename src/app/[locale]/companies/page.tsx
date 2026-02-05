'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { ArrowLeft, Hand, X } from 'lucide-react';
import { Link } from '@/i18n/routing';
import SolarSystemScene from '@/components/scene/SolarSystemScene';
import CompanyInfoPanel from '@/components/ui/CompanyInfoPanel';
import { companies, Company } from '@/data/companies';
import { useHandGesture } from '@/components/gestures/HandGestureManager';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { useTheme } from '@/components/ui/ThemeProvider';

export default function CompaniesPage() {
    const locale = useLocale();
    const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
    const { isActive: isHandActive, toggleActive: toggleHand } = useHandGesture();
    const { theme } = useTheme();

    const handleCompanyClick = (company: Company) => {
        setSelectedCompany(company);
    };

    const handleClosePanel = () => {
        setSelectedCompany(null);
    };

    return (
        <main className="relative h-screen w-screen overflow-hidden">
            {/* Full Screen Solar System Scene */}
            <div className="absolute inset-0 z-0">
                <SolarSystemScene
                    companies={companies}
                    onCompanyClick={handleCompanyClick}
                />
            </div>

            {/* Floating Header Controls */}
            <div className="absolute top-0 left-0 right-0 z-20 p-4 md:p-6">
                <div className="flex items-center justify-between">
                    {/* Left Side: Back + Logo */}
                    <div className="flex items-center gap-4">
                        <Link
                            href="/"
                            className="flex items-center gap-2 px-4 py-2 rounded-full glass-panel text-sm font-medium hover:bg-[var(--primary)]/10 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            <span className="hidden md:inline">
                                {locale === 'ar' ? 'الرئيسية' : 'Home'}
                            </span>
                        </Link>

                        <img
                            src="/logos/mplan-group-logo.png"
                            alt="Mplan Group"
                            className={`h-10 md:h-12 w-auto ${theme === 'dark' ? 'logo-dark-contrast' : ''}`}
                        />
                    </div>

                    {/* Right Side: Controls */}
                    <div className="flex items-center gap-3">
                        {/* Company Count */}
                        <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full glass-panel text-sm">
                            <span className="w-2 h-2 rounded-full bg-[var(--primary)]" />
                            {companies.length} {locale === 'ar' ? 'شركة' : 'Companies'}
                        </div>

                        {/* Hand Gesture Toggle */}
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={toggleHand}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${isHandActive
                                ? 'bg-[var(--primary)] text-white shadow-lg shadow-[var(--primary)]/30'
                                : 'glass-panel hover:bg-[var(--primary)]/10'
                                }`}
                        >
                            <Hand className={`w-5 h-5 ${isHandActive ? 'animate-pulse' : ''}`} />
                            <span className="hidden md:inline font-medium">
                                {isHandActive
                                    ? (locale === 'ar' ? 'مُفعّل' : 'Active')
                                    : (locale === 'ar' ? 'الإيماءات' : 'Gestures')
                                }
                            </span>
                        </motion.button>

                        {/* Theme Toggle */}
                        <ThemeToggle />
                    </div>
                </div>
            </div>

            {/* Floating Instructions (when gesture active) */}
            {isHandActive && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20 px-6 py-3 rounded-full glass-panel text-sm"
                >
                    <span className="text-[var(--primary)]">
                        {locale === 'ar'
                            ? '👋 حرّك يدك للتدوير • 🤏 قرّب إصبعيك للتكبير'
                            : '👋 Move hand to rotate • 🤏 Pinch to zoom'}
                    </span>
                </motion.div>
            )}

            {/* Bottom Info Bar */}
            <div className="absolute bottom-0 left-0 right-0 z-20 p-4 md:p-6">
                <div className="flex items-center justify-between">
                    <div className="glass-panel px-4 py-2 rounded-full text-sm">
                        <span className="text-[var(--muted)]">
                            {locale === 'ar' ? 'اضغط على أي شركة لمعرفة المزيد' : 'Click any company for details'}
                        </span>
                    </div>

                    {/* Mobile company count */}
                    <div className="md:hidden flex items-center gap-2 px-3 py-2 rounded-full glass-panel text-xs">
                        <span className="w-2 h-2 rounded-full bg-[var(--primary)]" />
                        {companies.length}
                    </div>
                </div>
            </div>

            {/* Company Info Panel */}
            <CompanyInfoPanel
                company={selectedCompany}
                onClose={handleClosePanel}
            />
        </main>
    );
}
