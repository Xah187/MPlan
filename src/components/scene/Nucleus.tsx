'use client';

import { Float, Billboard, Image } from '@react-three/drei';
import * as THREE from 'three';

export default function Nucleus() {
    return (
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
            {/* Core Logo using Billboard to prevent distortion */}
            <Billboard follow={true}>
                <Image
                    url="/logos/mplan.png"
                    transparent
                    opacity={1}
                    scale={[4, 4]} // Adjust scale as needed
                    toneMapped={false}
                />
            </Billboard>

            {/* Wireframe overlay */}
            <mesh scale={[1.1, 1.1, 1.1]}>
                <sphereGeometry args={[3, 32, 32]} />
                <meshBasicMaterial color="#00f0ff" wireframe transparent opacity={0.1} />
            </mesh>

            {/* Outer Glow shell */}
            <mesh scale={[1.2, 1.2, 1.2]}>
                <sphereGeometry args={[3, 32, 32]} />
                <meshBasicMaterial color="#D4AF37" wireframe transparent opacity={0.05} />
            </mesh>
        </Float>
    );
}
