'use client';

import { useTranslations } from 'next-intl';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import EcosystemScene from '@/components/scene/EcosystemScene';
import { motion } from 'framer-motion';

export default function HomePage() {
  const t = useTranslations('Hero');

  return (
    <main className="relative min-h-screen flex flex-col font-sans">
      <Header />

      {/* Hero Content Overlay */}
      <div className="flex-grow flex items-start justify-center relative z-10 pointer-events-none pt-28 md:pt-36">
        <motion.div
          className="container mx-auto px-6 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h1 className="text-2xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-500 mb-6 tracking-tight drop-shadow-lg">
            {t('title')}
          </h1>
          <p className="text-sm md:text-base text-gray-300 max-w-2xl mx-auto mb-6 font-light">
            {t('subtitle')}
          </p>

          <button className="pointer-events-auto px-6 py-2 text-sm bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md rounded-full transition-all duration-300 transform hover:scale-105 hover:border-mplan-cyan hover:shadow-[0_0_20px_rgba(0,240,255,0.3)]">
            Explore Ecosystem
          </button>
        </motion.div>
      </div>

      {/* 3D Background */}
      <EcosystemScene />

      <Footer />
    </main>
  );
}
