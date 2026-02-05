'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    radius: number;
}

export default function OrganicBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const particlesRef = useRef<Particle[]>([]);
    const mouseRef = useRef({ x: 0, y: 0 });
    const animationRef = useRef<number | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // Initialize particles
        const particleCount = 60;
        particlesRef.current = Array.from({ length: particleCount }, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            radius: Math.random() * 2 + 1,
        }));

        const handleMouseMove = (e: MouseEvent) => {
            mouseRef.current = { x: e.clientX, y: e.clientY };
        };
        window.addEventListener('mousemove', handleMouseMove);

        const animate = () => {
            if (!ctx || !canvas) return;

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const particles = particlesRef.current;
            const isDark = document.documentElement.classList.contains('dark');

            // Colors based on theme
            const particleColor = isDark ? 'rgba(34, 211, 238, 0.6)' : 'rgba(8, 145, 178, 0.5)';
            const lineColor = isDark ? 'rgba(34, 211, 238, 0.15)' : 'rgba(8, 145, 178, 0.1)';

            // Update and draw particles
            particles.forEach((particle, i) => {
                // Move particle
                particle.x += particle.vx;
                particle.y += particle.vy;

                // Bounce off walls
                if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
                if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

                // Mouse interaction
                const dx = mouseRef.current.x - particle.x;
                const dy = mouseRef.current.y - particle.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 150) {
                    particle.vx -= dx * 0.0005;
                    particle.vy -= dy * 0.0005;
                }

                // Draw particle
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
                ctx.fillStyle = particleColor;
                ctx.fill();

                // Draw connections
                for (let j = i + 1; j < particles.length; j++) {
                    const other = particles[j];
                    const lineDx = particle.x - other.x;
                    const lineDy = particle.y - other.y;
                    const lineDist = Math.sqrt(lineDx * lineDx + lineDy * lineDy);

                    if (lineDist < 150) {
                        ctx.beginPath();
                        ctx.moveTo(particle.x, particle.y);
                        ctx.lineTo(other.x, other.y);
                        ctx.strokeStyle = lineColor;
                        ctx.lineWidth = 1 - lineDist / 150;
                        ctx.stroke();
                    }
                }
            });

            animationRef.current = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            window.removeEventListener('mousemove', handleMouseMove);
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, []);

    return (
        <div className="fixed inset-0 -z-10 overflow-hidden">
            {/* Gradient Blobs */}
            <motion.div
                className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full blob bg-[var(--primary)]"
                animate={{
                    scale: [1, 1.1, 1],
                    x: [0, 30, 0],
                    y: [0, -20, 0],
                }}
                transition={{
                    duration: 15,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />
            <motion.div
                className="absolute bottom-[-30%] left-[-15%] w-[700px] h-[700px] rounded-full blob bg-[var(--secondary)]"
                animate={{
                    scale: [1, 1.15, 1],
                    x: [0, -20, 0],
                    y: [0, 30, 0],
                }}
                transition={{
                    duration: 18,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />
            <motion.div
                className="absolute top-[40%] left-[30%] w-[400px] h-[400px] rounded-full blob bg-[var(--primary)] opacity-30"
                animate={{
                    scale: [1, 1.2, 1],
                    x: [0, 40, 0],
                    y: [0, -40, 0],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />

            {/* Canvas for particle network */}
            <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full"
            />
        </div>
    );
}
