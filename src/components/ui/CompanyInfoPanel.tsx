'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Building2 } from 'lucide-react';
import { Company } from '@/data/companies';
import { useLocale } from 'next-intl';

interface CompanyInfoPanelProps {
    company: Company | null;
    onClose: () => void;
}

export default function CompanyInfoPanel({ company, onClose }: CompanyInfoPanelProps) {
    const locale = useLocale();

    return (
        <AnimatePresence>
            {company && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                    />

                    {/* Panel */}
                    <motion.div
                        initial={{ opacity: 0, x: 100, scale: 0.95 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: 100, scale: 0.95 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="fixed top-1/2 right-4 md:right-8 -translate-y-1/2 w-[90%] max-w-md bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl shadow-2xl z-50 overflow-hidden"
                    >
                        {/* Header */}
                        <div className="relative p-6 pb-4 border-b border-[var(--card-border)]">
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[var(--glass-bg)] border border-[var(--card-border)] flex items-center justify-center hover:bg-[var(--primary)] hover:text-white transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>

                            <div className="flex items-center gap-4">
                                <div className="w-20 h-20 rounded-xl bg-[var(--glass-bg)] border border-[var(--card-border)] flex items-center justify-center p-2">
                                    <img
                                        src={company.logo}
                                        alt={company.name}
                                        className="w-full h-full object-contain"
                                    />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold">
                                        {company.name}
                                    </h3>
                                    <div className="flex items-center gap-2 mt-1 text-[var(--muted)]">
                                        <Building2 className="w-4 h-4" />
                                        <span className="text-sm">
                                            {locale === 'ar' ? 'شركة تابعة' : 'Subsidiary'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                            <h4 className="text-sm font-semibold uppercase tracking-wider text-[var(--muted)] mb-3">
                                {locale === 'ar' ? 'نبذة عن الشركة' : 'About'}
                            </h4>
                            <p className="text-[var(--foreground)] leading-relaxed mb-6">
                                {company.description}
                            </p>

                            {/* Stats (placeholder) */}
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="p-4 rounded-xl bg-[var(--glass-bg)] border border-[var(--card-border)]">
                                    <div className="text-2xl font-bold gradient-text">2020</div>
                                    <div className="text-xs text-[var(--muted)]">
                                        {locale === 'ar' ? 'سنة التأسيس' : 'Founded'}
                                    </div>
                                </div>
                                <div className="p-4 rounded-xl bg-[var(--glass-bg)] border border-[var(--card-border)]">
                                    <div className="text-2xl font-bold gradient-text">50+</div>
                                    <div className="text-xs text-[var(--muted)]">
                                        {locale === 'ar' ? 'موظف' : 'Employees'}
                                    </div>
                                </div>
                            </div>

                            {/* Action Button */}
                            {company.url !== '#' && (
                                <a
                                    href={company.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn-primary w-full flex items-center justify-center gap-2"
                                >
                                    {locale === 'ar' ? 'زيارة الموقع' : 'Visit Website'}
                                    <ExternalLink className="w-4 h-4" />
                                </a>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
