'use client';

import { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Billboard, Image } from '@react-three/drei';
import * as THREE from 'three';
import { Company } from '@/data/companies';
import { useRouter } from '@/i18n/routing';

interface SatelliteProps {
    company: Company;
    radius: number;
    speed: number;
    angleOffset: number;
    yOffset: number;
}

export default function Satellite({ company, radius, speed, angleOffset, yOffset }: SatelliteProps) {
    const groupRef = useRef<THREE.Group>(null);
    const [hovered, setHovered] = useState(false);
    const router = useRouter();

    useFrame(({ clock }) => {
        if (groupRef.current) {
            const t = clock.getElapsedTime() * speed * 0.1; // Slow orbit
            const x = Math.cos(t + angleOffset) * radius;
            const z = Math.sin(t + angleOffset) * radius;
            // bobbing motion
            const y = yOffset + Math.sin(t * 2 + angleOffset) * 0.5;

            groupRef.current.position.set(x, y, z);
        }
    });

    return (
        <group ref={groupRef}>
            <Billboard
                follow={true}
                lockX={false}
                lockY={false}
                lockZ={false}
            >
                <group
                    onClick={() => console.log('Clicked', company.name)}
                    onPointerOver={() => { document.body.style.cursor = 'pointer'; setHovered(true); }}
                    onPointerOut={() => { document.body.style.cursor = 'auto'; setHovered(false); }}
                    scale={hovered ? 1.5 : 1}
                >
                    {/* Glow effect backing */}
                    <mesh position={[0, 0, -0.1]}>
                        <circleGeometry args={[1.2, 32]} />
                        <meshBasicMaterial color={hovered ? "#00f0ff" : "#000000"} transparent opacity={hovered ? 0.5 : 0.2} />
                    </mesh>

                    <Image
                        url={company.logo}
                        scale={[2, 2]}
                        transparent
                        opacity={1}
                        color={hovered ? '#ffffff' : '#e0e0e0'}
                    />

                    {hovered && (
                        <Text
                            position={[0, -1.8, 0]}
                            fontSize={0.4}
                            color="white"
                            anchorX="center"
                            anchorY="middle"
                            outlineWidth={0.02}
                            outlineColor="#000000"
                        >
                            {company.name}
                        </Text>
                    )}
                </group>
            </Billboard>

            {/* Visual Orbit Line (Optional, can be expensive for many) */}
            {/* <mesh rotation={[-Math.PI / 2, 0, 0]}>
         <ringGeometry args={[radius - 0.05, radius + 0.05, 64]} />
         <meshBasicMaterial color="#ffffff" opacity={0.05} transparent side={THREE.DoubleSide} />
      </mesh> */}
        </group>
    );
}
