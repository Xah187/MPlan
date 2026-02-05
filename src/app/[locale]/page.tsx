'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import OrganicBackground from '@/components/scene/OrganicBackground';
import { motion } from 'framer-motion';
import { ArrowRight, Building2, Briefcase, Users, ChevronDown } from 'lucide-react';
import { companies } from '@/data/companies';

export default function HomePage() {
  const t = useTranslations('Hero');
  const locale = useLocale();

  const scrollToCompanies = () => {
    document.getElementById('companies')?.scrollIntoView({ behavior: 'smooth' });
  };

  const stats = [
    { icon: Building2, value: '21+', label: locale === 'ar' ? 'شركة تابعة' : 'Subsidiaries' },
    { icon: Briefcase, value: '5+', label: locale === 'ar' ? 'قطاعات' : 'Sectors' },
    { icon: Users, value: '500+', label: locale === 'ar' ? 'موظف' : 'Employees' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <main className="relative min-h-screen">
      <Header />
      <OrganicBackground />

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center pt-20 relative z-10">
        <motion.div
          className="container mx-auto px-6 text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Badge */}
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--card-bg)] border border-[var(--card-border)] mb-8 shadow-sm"
          >
            <span className="w-2 h-2 rounded-full bg-[var(--primary)] animate-pulse" />
            <span className="text-sm font-medium text-[var(--muted)]">
              {locale === 'ar' ? 'مجموعة استثمارية رائدة' : 'Leading Investment Group'}
            </span>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            variants={itemVariants}
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
          >
            <span className="gradient-text">{t('title')}</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl text-[var(--muted)] max-w-3xl mx-auto mb-10"
          >
            {t('subtitle')}
          </motion.p>

          {/* Stats */}
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap justify-center gap-8 md:gap-16 mb-12"
          >
            {stats.map((stat, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-xl bg-[var(--primary)]/10 flex items-center justify-center mb-3">
                  <stat.icon className="w-6 h-6 text-[var(--primary)]" />
                </div>
                <div className="text-3xl font-bold gradient-text">{stat.value}</div>
                <div className="text-sm text-[var(--muted)]">{stat.label}</div>
              </div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <button
              onClick={scrollToCompanies}
              className="btn-primary flex items-center gap-2 group"
            >
              {locale === 'ar' ? 'استكشف الشركات' : 'Explore Companies'}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="btn-secondary">
              {locale === 'ar' ? 'تواصل معنا' : 'Contact Us'}
            </button>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            onClick={scrollToCompanies}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[var(--muted)] hover:text-[var(--primary)] transition-colors cursor-pointer"
          >
            <span className="text-xs uppercase tracking-widest">
              {locale === 'ar' ? 'اكتشف المزيد' : 'Scroll'}
            </span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <ChevronDown className="w-5 h-5" />
            </motion.div>
          </motion.button>
        </motion.div>
      </section>

      {/* Companies Section */}
      <section id="companies" className="py-20 relative z-10">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {locale === 'ar' ? 'شركاتنا' : 'Our Companies'}
            </h2>
            <p className="text-[var(--muted)] max-w-2xl mx-auto">
              {locale === 'ar'
                ? 'نفتخر بإدارة مجموعة متنوعة من الشركات الرائدة في قطاعات متعددة'
                : 'We proudly manage a diverse portfolio of leading companies across multiple sectors'}
            </p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {companies.slice(0, 10).map((company, index) => (
              <motion.div
                key={company.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -8 }}
                className="card p-6 flex flex-col items-center justify-center cursor-pointer group"
              >
                <img
                  src={company.logo}
                  alt={company.name}
                  className="h-16 w-auto object-contain mb-4 grayscale group-hover:grayscale-0 transition-all duration-300"
                />
                <span className="text-sm font-medium text-center line-clamp-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {company.name}
                </span>
              </motion.div>
            ))}
          </div>

          {companies.length > 10 && (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mt-10"
            >
              <Link href="/companies" className="btn-secondary inline-block">
                {locale === 'ar' ? 'عرض جميع الشركات' : 'View All Companies'} ({companies.length})
              </Link>
            </motion.div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
