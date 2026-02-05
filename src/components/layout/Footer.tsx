'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Linkedin, Twitter, Instagram, Mail, MapPin, Phone } from 'lucide-react';

export default function Footer() {
    const t = useTranslations('Metadata');

    const socialLinks = [
        { icon: Linkedin, href: '#', label: 'LinkedIn' },
        { icon: Twitter, href: '#', label: 'Twitter' },
        { icon: Instagram, href: '#', label: 'Instagram' },
    ];

    return (
        <footer className="w-full py-8 border-t border-[var(--card-border)] bg-[var(--card-bg)]">
            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    {/* Logo and Copyright */}
                    <div className="flex items-center gap-4">
                        <img
                            src="/logos/mplan-group-logo.png"
                            alt="Mplan Group"
                            className="h-12 w-auto dark:logo-dark-contrast"
                        />
                        <div className="text-sm text-[var(--muted)]">
                            © {new Date().getFullYear()} Mplan Group. All rights reserved.
                        </div>
                    </div>

                    {/* Social Links */}
                    <div className="flex items-center gap-4">
                        {socialLinks.map((social) => (
                            <motion.a
                                key={social.label}
                                href={social.href}
                                whileHover={{ scale: 1.1, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                className="w-10 h-10 rounded-full bg-[var(--glass-bg)] border border-[var(--card-border)] flex items-center justify-center text-[var(--muted)] hover:text-[var(--primary)] hover:border-[var(--primary)] transition-colors"
                                aria-label={social.label}
                            >
                                <social.icon className="w-4 h-4" />
                            </motion.a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}
