'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, PerspectiveCamera, Stars, Float, useTexture } from '@react-three/drei';
import { Suspense, useMemo, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { companies } from '@/data/companies';
import Satellite from './Satellite';
import Nucleus from './Nucleus';
import { useHandGesture } from '../gestures/HandGestureManager';

// Preload common logos
const preloadLogos = () => {
    useTexture.preload('/logos/mplan-group-logo.png');
    companies.forEach(company => {
        if (company.logo) useTexture.preload(company.logo);
    });
};

function SceneContent({ satellites }: { satellites: React.ReactNode }) {
    const { lastResult, isActive } = useHandGesture();
    const groupRef = useRef<THREE.Group>(null);
    const prevHandPos = useRef<{ x: number, y: number } | null>(null);
    const rotationVelocity = useRef({ x: 0, y: 0 });
    const targetScale = useRef(1);
    const currentScale = useRef(1);

    useFrame((_state, delta) => {
        if (!groupRef.current) return;

        if (isActive && lastResult?.landmarks?.[0]) {
            const landmarks = lastResult.landmarks[0];
            const thumb = landmarks[4];
            const index = landmarks[8];
            const currentPos = { x: index.x, y: index.y };

            // Rotation Logic
            if (prevHandPos.current) {
                const dx = currentPos.x - prevHandPos.current.x;
                const dy = currentPos.y - prevHandPos.current.y;
                // Increased sensitivity (0.5 -> 1.2)
                rotationVelocity.current.y += dx * 1.2;
                rotationVelocity.current.x += dy * 1.2;
            }
            prevHandPos.current = currentPos;

            // Zoom (Pinch) Logic
            const distance = Math.sqrt(
                Math.pow(thumb.x - index.x, 2) +
                Math.pow(thumb.y - index.y, 2)
            );

            // Map distance (roughly 0.05 to 0.4) to scale (0.5 to 2.5)
            // If fingers are together (~0.05), scale is small. If apart (~0.3), scale is large.
            targetScale.current = THREE.MathUtils.mapLinear(distance, 0.05, 0.3, 0.5, 2.5);
            targetScale.current = THREE.MathUtils.clamp(targetScale.current, 0.4, 3.0);
        } else {
            prevHandPos.current = null;
            // Optionally reset zoom or keep it? Keeping it feels more stable.
        }

        // Apply Rotation with damping
        groupRef.current.rotation.y += rotationVelocity.current.y;
        groupRef.current.rotation.x += rotationVelocity.current.x;
        rotationVelocity.current.x *= 0.92; // Slightly lower damping (0.95 -> 0.92) for crisper stop
        rotationVelocity.current.y *= 0.92;

        // Apply Zoom with faster smoothing (Lerp 0.1 -> 0.2)
        currentScale.current = THREE.MathUtils.lerp(currentScale.current, targetScale.current, 0.2);
        groupRef.current.scale.setScalar(currentScale.current);
    });

    return (
        <Suspense fallback={null}>
            <OrbitControls
                enableZoom={true}
                enablePan={false}
                autoRotate={!isActive}
                autoRotateSpeed={0.5}
                maxPolarAngle={Math.PI / 1.5}
                minPolarAngle={Math.PI / 4}
                maxDistance={50}
                minDistance={10}
            />

            <Nucleus />

            <group ref={groupRef}>
                {satellites}
            </group>

            <Environment preset="city" />
        </Suspense>
    );
}

export default function EcosystemScene() {
    useEffect(() => {
        preloadLogos();
    }, []);

    const satellites = useMemo(() => {
        return companies.map((company, i) => {
            const layer = i % 3;
            const radius = 8 + layer * 4;
            const angleStep = (Math.PI * 2) / Math.ceil(companies.length / 3);
            const angleOffset = (Math.floor(i / 3) * angleStep) + (layer * 0.5);
            const speed = 0.5 - (layer * 0.1);
            const yOffset = (Math.random() - 0.5) * 4;

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
                <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
                <ambientLight intensity={0.2} />
                <pointLight position={[10, 10, 10]} intensity={1} color="#00f0ff" />
                <pointLight position={[-10, -10, -10]} intensity={1} color="#D4AF37" />

                <SceneContent satellites={satellites} />
            </Canvas>
        </div>
    );
}
