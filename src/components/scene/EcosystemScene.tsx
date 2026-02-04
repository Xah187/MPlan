'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, PerspectiveCamera, Stars, Float, useTexture } from '@react-three/drei';
import { Suspense, useMemo, useEffect } from 'react';
import { companies } from '@/data/companies';
import Satellite from './Satellite';
import Nucleus from './Nucleus';

// Preload common logos
const preloadLogos = () => {
    useTexture.preload('/logos/mplan.png');
    companies.forEach(company => {
        if (company.logo) useTexture.preload(company.logo);
    });
};

export default function EcosystemScene() {
    useEffect(() => {
        preloadLogos();
    }, []);

    const satellites = useMemo(() => {
        return companies.map((company, i) => {
            // Distribute in 3 orbits/layers
            const layer = i % 3;
            const radius = 8 + layer * 4; // 8, 12, 16 radius
            const angleStep = (Math.PI * 2) / Math.ceil(companies.length / 3);
            const angleOffset = (Math.floor(i / 3) * angleStep) + (layer * 0.5);
            const speed = 0.5 - (layer * 0.1); // Inner moves faster
            const yOffset = (Math.random() - 0.5) * 4; // Random height variation

            return (
                <Satellite
                    key={company.id}
                    company={company}
                    radius={radius}
                    speed={speed}
                    angleOffset={angleOffset}
                    yOffset={yOffset}
                />
            );
        });
    }, []);

    return (
        <div className="w-full h-screen absolute top-0 left-0 -z-10 bg-mplan-dark text-white">
            <Canvas dpr={[1, 2]}>
                <PerspectiveCamera makeDefault position={[0, 10, 25]} fov={50} />

                {/* Background stars and basic lighting should appear immediately */}
                <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
                <ambientLight intensity={0.2} />
                <pointLight position={[10, 10, 10]} intensity={1} color="#00f0ff" />
                <pointLight position={[-10, -10, -10]} intensity={1} color="#D4AF37" />

                <Suspense fallback={null}>
                    <OrbitControls
                        enableZoom={true}
                        enablePan={false}
                        autoRotate
                        autoRotateSpeed={0.5}
                        maxPolarAngle={Math.PI / 1.5}
                        minPolarAngle={Math.PI / 4}
                        maxDistance={50}
                        minDistance={10}
                    />

                    {/* Central Nucleus (Mplan Group) */}
                    <Nucleus />

                    {satellites}

                    <Environment preset="city" />
                </Suspense>
            </Canvas>
        </div>
    );
}
