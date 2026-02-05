'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useHandGesture } from '../gestures/HandGestureManager';

export default function GestureControlledParticles() {
    const { lastResult, isActive } = useHandGesture();
    const meshRef = useRef<THREE.Points>(null);
    const count = 2000;

    const [positions, initialPositions] = useMemo(() => {
        const pos = new Float32Array(count * 3);
        const initPos = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            const x = (Math.random() - 0.5) * 40;
            const y = (Math.random() - 0.5) * 40;
            const z = (Math.random() - 0.5) * 40;
            pos.set([x, y, z], i * 3);
            initPos.set([x, y, z], i * 3);
        }
        return [pos, initPos];
    }, []);

    useFrame((state) => {
        if (!meshRef.current || !isActive) return;

        const positionsArray = meshRef.current.geometry.attributes.position.array as Float32Array;
        const hands = lastResult?.landmarks || [];

        for (let i = 0; i < count; i++) {
            const ix = i * 3;
            const iy = i * 3 + 1;
            const iz = i * 3 + 2;

            let targetX = initialPositions[ix];
            let targetY = initialPositions[iy];
            let targetZ = initialPositions[iz];

            // If hand detected, influence particles
            hands.forEach(hand => {
                // Map 0-1 mediapipe coords to scene coords (-20 to 20 approx)
                // MediaPipe X is 0 (left) to 1 (right)
                // MediaPipe Y is 0 (top) to 1 (bottom)
                const hx = (0.5 - hand[8].x) * 40; // index finger tip
                const hy = (0.5 - hand[8].y) * 40;
                const hz = (0.5 - hand[8].z) * 40;

                const dx = hx - positionsArray[ix];
                const dy = hy - positionsArray[iy];
                const dz = hz - positionsArray[iz];
                const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

                if (dist < 10) {
                    const force = (10 - dist) / 10;
                    targetX += dx * force * 0.5;
                    targetY += dy * force * 0.5;
                    targetZ += dz * force * 0.5;
                }
            });

            // Smoothly move towards target
            positionsArray[ix] += (targetX - positionsArray[ix]) * 0.1;
            positionsArray[iy] += (targetY - positionsArray[iy]) * 0.1;
            positionsArray[iz] += (targetZ - positionsArray[iz]) * 0.1;
        }

        meshRef.current.geometry.attributes.position.needsUpdate = true;
    });

    const dotTexture = useMemo(() => {
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 64;
        const ctx = canvas.getContext('2d');
        if (ctx) {
            const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
            gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
            gradient.addColorStop(0.2, 'rgba(255, 255, 255, 0.8)');
            gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.2)');
            gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, 64, 64);
        }
        const texture = new THREE.CanvasTexture(canvas);
        return texture;
    }, []);

    if (!isActive) return null;

    return (
        <points ref={meshRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    args={[positions, 3]}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.4}
                color="#00f0ff"
                transparent
                opacity={0.8}
                map={dotTexture}
                sizeAttenuation
                blending={THREE.AdditiveBlending}
                depthWrite={false}
            />
        </points>
    );
}
