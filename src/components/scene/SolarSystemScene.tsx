'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Float, Billboard, Image, Text } from '@react-three/drei';
import { Suspense, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { Company } from '@/data/companies';
import { useHandGesture } from '../gestures/HandGestureManager';
import { useTheme } from '../ui/ThemeProvider';

interface SunProps {
    isDark: boolean;
}

function Sun({ isDark }: SunProps) {
    const glowRef = useRef<THREE.Mesh>(null);

    useFrame(({ clock }) => {
        if (glowRef.current) {
            const scale = 1 + Math.sin(clock.getElapsedTime() * 2) * 0.05;
            glowRef.current.scale.setScalar(scale);
        }
    });

    return (
        <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
            <Billboard follow={true}>
                <Image
                    url="/logos/mplan-group-logo.png"
                    transparent
                    opacity={1}
                    scale={[5, 5]}
                    toneMapped={false}
                />
            </Billboard>

            {/* Glow ring */}
            <mesh ref={glowRef} rotation={[0, 0, 0]}>
                <ringGeometry args={[3, 4.5, 64]} />
                <meshBasicMaterial
                    color={isDark ? "#A82728" : "#8B1D1E"}
                    transparent
                    opacity={0.15}
                    side={THREE.DoubleSide}
                />
            </mesh>

            {/* Contrast Backing for Black Text in Dark Mode */}
            {isDark && (
                <mesh position={[0, -0.2, -0.1]}>
                    <planeGeometry args={[7, 2.5]} />
                    <meshBasicMaterial
                        color="#FFFFFF"
                        transparent
                        opacity={0.4}
                        side={THREE.DoubleSide}
                    />
                    {/* Add soft edges via alpha map if possible, trying simple opacity first */}
                </mesh>
            )}

            {/* Glowing Center for better contrast */}
            {isDark && (
                <mesh position={[0, 0, -0.2]}>
                    <circleGeometry args={[2.5, 32]} />
                    <meshBasicMaterial color="#FFFFFF" transparent opacity={0.6} />
                </mesh>
            )}

            {/* Outer glow */}
            <mesh>
                <sphereGeometry args={[3, 32, 32]} />
                <meshBasicMaterial
                    color={isDark ? "#A82728" : "#8B1D1E"}
                    transparent
                    opacity={0.05}
                    side={THREE.BackSide}
                />
            </mesh>
        </Float>
    );
}

interface PlanetProps {
    company: Company;
    radius: number;
    speed: number;
    angleOffset: number;
    yOffset: number;
    onClick: (company: Company) => void;
    isDark: boolean;
}

function Planet({ company, radius, speed, angleOffset, yOffset, onClick, isDark }: PlanetProps) {
    const groupRef = useRef<THREE.Group>(null);
    const [hovered, setHovered] = useState(false);

    useFrame(({ clock }) => {
        if (groupRef.current) {
            const t = clock.getElapsedTime() * speed * 0.08;
            const x = Math.cos(t + angleOffset) * radius;
            const z = Math.sin(t + angleOffset) * radius;
            const y = yOffset + Math.sin(t * 2 + angleOffset) * 0.3;
            groupRef.current.position.set(x, y, z);
        }
    });

    const primaryColor = isDark ? "#A82728" : "#8B1D1E";
    const secondaryColor = isDark ? "#D4A84B" : "#B8860B";

    return (
        <group ref={groupRef}>
            {/* Orbit ring */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -yOffset, 0]}>
                <ringGeometry args={[radius - 0.03, radius + 0.03, 64]} />
                <meshBasicMaterial
                    color={primaryColor}
                    transparent
                    opacity={0.1}
                    side={THREE.DoubleSide}
                />
            </mesh>

            <Billboard follow={true}>
                <group
                    onClick={(e) => {
                        e.stopPropagation();
                        onClick(company);
                    }}
                    onPointerOver={() => {
                        document.body.style.cursor = 'pointer';
                        setHovered(true);
                    }}
                    onPointerOut={() => {
                        document.body.style.cursor = 'auto';
                        setHovered(false);
                    }}
                    scale={hovered ? 1.4 : 1}
                >
                    {/* Background circle */}
                    <mesh position={[0, 0, -0.1]}>
                        <circleGeometry args={[1.3, 32]} />
                        <meshBasicMaterial
                            color={hovered ? primaryColor : (isDark ? "#2A2A2A" : "#FFFFFF")}
                            transparent
                            opacity={hovered ? 0.8 : 0.9}
                        />
                    </mesh>

                    {/* Border ring */}
                    <mesh position={[0, 0, -0.05]}>
                        <ringGeometry args={[1.25, 1.35, 32]} />
                        <meshBasicMaterial
                            color={hovered ? primaryColor : secondaryColor}
                            transparent
                            opacity={hovered ? 1 : 0.3}
                        />
                    </mesh>

                    {/* Logo */}
                    <Image
                        url={company.logo}
                        scale={[2, 2]}
                        transparent
                        opacity={1}
                    />

                    {/* Company name on hover */}
                    {hovered && (
                        <Text
                            position={[0, -2, 0]}
                            fontSize={0.35}
                            color={isDark ? "#FAF9F7" : "#1A1A1A"}
                            anchorX="center"
                            anchorY="middle"
                            outlineWidth={0.02}
                            outlineColor={isDark ? "#1A1A1A" : "#FFFFFF"}
                        >
                            {company.name}
                        </Text>
                    )}
                </group>
            </Billboard>
        </group>
    );
}

interface SceneContentProps {
    companies: Company[];
    onCompanyClick: (company: Company) => void;
    isDark: boolean;
}

function SceneContent({ companies, onCompanyClick, isDark }: SceneContentProps) {
    const { lastResult, isActive } = useHandGesture();
    const groupRef = useRef<THREE.Group>(null);
    const prevHandPos = useRef<{ x: number; y: number } | null>(null);
    const rotationVelocity = useRef({ x: 0, y: 0 });
    const targetScale = useRef(1);
    const currentScale = useRef(1);

    useFrame(() => {
        if (!groupRef.current) return;

        if (isActive && lastResult?.landmarks?.[0]) {
            const landmarks = lastResult.landmarks[0];
            const thumb = landmarks[4];
            const index = landmarks[8];
            const currentPos = { x: index.x, y: index.y };

            if (prevHandPos.current) {
                const dx = currentPos.x - prevHandPos.current.x;
                const dy = currentPos.y - prevHandPos.current.y;
                rotationVelocity.current.y += dx * 1.5;
                rotationVelocity.current.x += dy * 1.5;
            }
            prevHandPos.current = currentPos;

            const distance = Math.sqrt(
                Math.pow(thumb.x - index.x, 2) +
                Math.pow(thumb.y - index.y, 2)
            );
            targetScale.current = THREE.MathUtils.mapLinear(distance, 0.05, 0.3, 0.5, 2.5);
            targetScale.current = THREE.MathUtils.clamp(targetScale.current, 0.4, 3.0);
        } else {
            prevHandPos.current = null;
        }

        groupRef.current.rotation.y += rotationVelocity.current.y;
        groupRef.current.rotation.x += rotationVelocity.current.x;
        rotationVelocity.current.x *= 0.92;
        rotationVelocity.current.y *= 0.92;

        currentScale.current = THREE.MathUtils.lerp(currentScale.current, targetScale.current, 0.15);
        groupRef.current.scale.setScalar(currentScale.current);
    });

    const planets = useMemo(() => {
        return companies.map((company, i) => {
            const totalCompanies = companies.length;
            const layer = Math.floor(i / 7);
            const posInLayer = i % 7;
            const radius = 8 + layer * 5;
            const angleStep = (Math.PI * 2) / Math.min(7, totalCompanies - layer * 7);
            const angleOffset = posInLayer * angleStep + layer * 0.4;
            const speed = 0.4 - layer * 0.08;
            const yOffset = (layer - 1) * 1.5;

            return (
                <Planet
                    key={company.id}
                    company={company}
                    radius={radius}
                    speed={speed}
                    angleOffset={angleOffset}
                    yOffset={yOffset}
                    onClick={onCompanyClick}
                    isDark={isDark}
                />
            );
        });
    }, [companies, onCompanyClick, isDark]);

    return (
        <Suspense fallback={null}>
            <OrbitControls
                enableZoom={true}
                enablePan={false}
                autoRotate={!isActive}
                autoRotateSpeed={0.3}
                maxPolarAngle={Math.PI / 1.5}
                minPolarAngle={Math.PI / 4}
                maxDistance={60}
                minDistance={12}
            />

            <Sun isDark={isDark} />

            <group ref={groupRef}>
                {planets}
            </group>
        </Suspense>
    );
}

interface SolarSystemSceneProps {
    companies: Company[];
    onCompanyClick: (company: Company) => void;
}

export default function SolarSystemScene({ companies, onCompanyClick }: SolarSystemSceneProps) {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const bgColor = isDark ? '#1A1A1A' : '#FAF9F7';
    const lightColor1 = isDark ? '#A82728' : '#8B1D1E';
    const lightColor2 = isDark ? '#D4A84B' : '#B8860B';

    return (
        <div
            className="w-full h-full"
            style={{ background: bgColor }}
        >
            <Canvas dpr={[1, 2]}>
                <PerspectiveCamera makeDefault position={[0, 12, 30]} fov={50} />

                <ambientLight intensity={isDark ? 0.3 : 0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} color={lightColor1} />
                <pointLight position={[-10, -10, -10]} intensity={0.8} color={lightColor2} />
                <pointLight position={[0, 15, 0]} intensity={0.5} color="#ffffff" />

                <SceneContent
                    companies={companies}
                    onCompanyClick={onCompanyClick}
                    isDark={isDark}
                />
            </Canvas>
        </div>
    );
}
