'use client';

import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { FilesetResolver, HandLandmarker, HandLandmarkerResult } from '@mediapipe/tasks-vision';

interface HandGestureContextType {
    lastResult: HandLandmarkerResult | null;
    isActive: boolean;
    error: string | null;
    toggleActive: () => void;
}

const HandGestureContext = createContext<HandGestureContextType | undefined>(undefined);

export const useHandGesture = () => {
    const context = useContext(HandGestureContext);
    if (!context) throw new Error('useHandGesture must be used within HandGestureProvider');
    return context;
};

export const HandGestureProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isActive, setIsActive] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [lastResult, setLastResult] = useState<HandLandmarkerResult | null>(null);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const handLandmarkerRef = useRef<HandLandmarker | null>(null);
    const requestRef = useRef<number | null>(null);

    const toggleActive = () => {
        setError(null);
        setIsActive(!isActive);
    };

    useEffect(() => {
        const initLandmarker = async () => {
            const vision = await FilesetResolver.forVisionTasks(
                "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
            );
            handLandmarkerRef.current = await HandLandmarker.createFromOptions(vision, {
                baseOptions: {
                    modelAssetPath: `https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task`,
                    delegate: "GPU"
                },
                runningMode: "VIDEO",
                numHands: 1, // Focus on one hand for higher performance
                minHandDetectionConfidence: 0.6,
                minHandPresenceConfidence: 0.6,
                minTrackingConfidence: 0.6
            });
        };

        initLandmarker();

        return () => {
            handLandmarkerRef.current?.close();
        };
    }, []);

    useEffect(() => {
        if (isActive) {
            startCamera();
        } else {
            stopCamera();
        }
    }, [isActive]);

    const startCamera = async () => {
        if (!videoRef.current) {
            const video = document.createElement('video');
            video.style.display = 'none';
            document.body.appendChild(video);
            videoRef.current = video;
        }

        if (!window.isSecureContext) {
            const msg = "Security Error: Camera access is disabled on insecure connections. Please use 'http://localhost:3002' instead of your IP address to test this feature.";
            setError(msg);
            setIsActive(false);
            return;
        }

        try {
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                throw new Error("Camera API is unavailable in this browser or context.");
            }
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            videoRef.current.srcObject = stream;
            videoRef.current.play();
            requestRef.current = requestAnimationFrame(predictWebcam);
        } catch (err: any) {
            console.error("Camera access failed:", err);
            setError(err.message || "Failed to access camera");
            setIsActive(false);
        }
    };

    const stopCamera = () => {
        if (videoRef.current?.srcObject) {
            const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
            tracks.forEach(track => track.stop());
            videoRef.current.srcObject = null;
        }
        if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };

    const predictWebcam = () => {
        if (videoRef.current && handLandmarkerRef.current && videoRef.current.readyState >= 2) {
            const startTimeMs = performance.now();
            const results = handLandmarkerRef.current.detectForVideo(videoRef.current, startTimeMs);
            setLastResult(results);
        }
        requestRef.current = requestAnimationFrame(predictWebcam);
    };

    return (
        <HandGestureContext.Provider value={{ lastResult, isActive, error, toggleActive }}>
            {children}
        </HandGestureContext.Provider>
    );
};
