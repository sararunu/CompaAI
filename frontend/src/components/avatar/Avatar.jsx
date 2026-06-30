import { useRef, useEffect, useState } from 'react';
import './Avatar.css';

export default function AvatarCanvas({
    speaking, thinking, listening, mood = 'neutral'
}) {
    const canvasRef = useRef(null);
    const animationRef = useRef(null);
    const [volume, setVolume] = useState(0);
    const [eyeOffset, setEyeOffset] = useState({ x: 0, y: 0 });
    const mouseRef = useRef({ x: 0.5, y: 0.5 });

    //seguir cursor
    useEffect(() => {
        const handleMove = (e) => {
            const rect = canvasRef.current?.getBoundingClientRect();
            if (!rect) return;
            mouseRef.current.x = (e.clientX - rect.left) / rect.width;
            mouseRef.current.y = (e.clientY - rect.top) / rect.height;
        };
        window.addEventListener('mousemove', handleMove);
        return () => window.removeEventListener('mousemove', handleMove);
    }, []);

    //hablar
    useEffect(() => {
        let frame = 0;
        const animate = () => {
            if (speaking) {
                const noise = Math.sin(frame * 0.7) * 0.4 + Math.sin(frame * 1.3) * 0.3 + Math.sin(frame * 2.1) * 0.2;
                const simulated = Math.max(0, 0.25 + noise * 0.5);
                setVolume(prev => prev * 0.3 + simulated * 0.7);
            } else {
                setVolume(prev => prev * 0.9);
            }
            frame++;
            animationRef.current = requestAnimationFrame(animate);
        };
        animate();
        return () => cancelAnimationFrame(animationRef.current);
    }, [speaking]);

    useEffect(() => {
        const update = () => {
            setEyeOffset(prev => ({
                x: prev.x + (mouseRef.current.x - 0.5 - prev.x) * 0.08,
                y: prev.y + (mouseRef.current.y - 0.5 - prev.y) * 0.08
            }));
            requestAnimationFrame(update);
        };
        update();
    }, []);

    //avatar compa
    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const dpr = window.devicePixelRatio || 1;
        const SIZE = 120;
        canvas.width = SIZE * dpr;
        canvas.height = SIZE * dpr;
        canvas.style.width = `${SIZE}px`;
        canvas.style.height = `${SIZE}px`;
        ctx.scale(dpr, dpr);

        const EYE_Y = -8;
        const EYE_SPACING = 18;
        const EYE_RADIUS = 12;
        const MOUTH_Y = 22;

        const browStyles = {
            happy: { left: { curve: 1, yOffset: 2 }, right: { curve: -1, yOffset: 2 } },
            sad: { left: { curve: -0.3, yOffset: 2 }, right: { curve: 0.3, yOffset: 2 } },
            angry: { left: { curve: -0.8, yOffset: -2 }, right: { curve: 0.8, yOffset: -2 } },
            thinking: { left: { curve: -0.5, yOffset: -1 }, right: { curve: 0, yOffset: 0 } },
            confused: { left: { curve: -0.8, yOffset: -2 }, right: { curve: 0.5, yOffset: 1 } },
            excited: { left: { curve: -1.2, yOffset: -3 }, right: { curve: -1.2, yOffset: -3 } },
            neutral: { left: { curve: 0, yOffset: 0 }, right: { curve: 0, yOffset: 0 } }
        };

        let rafId;

        const draw = (timestamp) => {
            ctx.clearRect(0, 0, 120, 120);

            const blinkPhase = (timestamp % 4000) / 4000;
            const isBlinking = blinkPhase > 0.45 && blinkPhase < 0.55;
            const blinkAmount = isBlinking ? Math.sin((blinkPhase - 0.45) * 10 * Math.PI) : 1;

            const mouthOpen = speaking ? Math.max(0.15, volume * 1.6) : 0;
            const bounce = speaking ? Math.sin(timestamp / 100) * 1.2 : 0;
            const pulse = listening ? (1 + Math.sin(timestamp / 200) * 0.05) : 1;

            const cx = 60;
            const cy = 60 + bounce;
            const faceRadius = 50 * pulse;
            ctx.save();
            ctx.translate(cx, cy);

            ctx.beginPath(); ctx.arc(2, 4, faceRadius, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(0,0,0,0.1)'; ctx.fill();

            ctx.beginPath(); ctx.arc(0, 0, faceRadius, 0, Math.PI * 2);
            const grad = ctx.createRadialGradient(-10, -10, 10, 0, 0, faceRadius);
            grad.addColorStop(0, '#6b4172');
            grad.addColorStop(1, '#5b346c');
            ctx.fillStyle = grad; ctx.fill();

            if (mood === 'happy') {
                ctx.beginPath(); ctx.arc(-30, 15, 12, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(196, 115, 141, 0.47)'; ctx.fill();
                ctx.beginPath(); ctx.arc(30, 15, 12, 0, Math.PI * 2); ctx.fill();
            }

            [-1, 1].forEach(side => {
                const ex = side * EYE_SPACING;

                ctx.beginPath();
                ctx.ellipse(ex, EYE_Y + 1, EYE_RADIUS, EYE_RADIUS * 0.9, 0, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(0,0,0,0.08)'; ctx.fill();

                ctx.beginPath();
                ctx.ellipse(ex, EYE_Y, EYE_RADIUS, EYE_RADIUS * 0.95, 0, 0, Math.PI * 2);
                ctx.fillStyle = '#fff'; ctx.fill();

                const px = speaking ? ex : ex + Math.max(-7, Math.min(7, eyeOffset.x * 6));
                const py = EYE_Y + (speaking ? 0 : Math.max(-5, Math.min(5, eyeOffset.y * 4)));
                const pupilRadius = mood === 'sad' ? 7 : 5;
                const highlightOffset = mood === 'sad' ? 3 : 2;
                const highlightSize = mood === 'sad' ? 3 : 2;

                ctx.beginPath(); ctx.arc(px, py, pupilRadius, 0, Math.PI * 2);
                ctx.fillStyle = '#2e261a'; ctx.fill();

                ctx.beginPath(); ctx.arc(px - highlightOffset, py - highlightOffset, highlightSize, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(255,255,255,0.6)'; ctx.fill();

                if (blinkAmount < 1) {
                    ctx.beginPath();
                    ctx.ellipse(ex, EYE_Y - EYE_RADIUS * (1 - blinkAmount) * 0.5, EYE_RADIUS, EYE_RADIUS * blinkAmount, 0, 0, Math.PI * 2);
                    ctx.fillStyle = '#3c264d'; ctx.fill();
                }
            });

            const browY = EYE_Y - EYE_RADIUS - 4;
            const brow = browStyles[mood] || browStyles.neutral;

            [-1, 1].forEach((side) => {
                const ex = side * EYE_SPACING;
                const isLeft = side === -1;
                const style = isLeft ? brow.left : brow.right;

                ctx.beginPath();
                ctx.lineWidth = 3;
                ctx.lineCap = 'round';
                ctx.strokeStyle = '#191918';

                const cx = ex;
                const cy = browY + style.yOffset;
                const curve = style.curve * side;

                if (style.curve === 0) {
                    ctx.moveTo(cx - 8, cy);
                    ctx.lineTo(cx + 8, cy);
                } else {
                    ctx.moveTo(cx - 8, cy);
                    ctx.quadraticCurveTo(cx, cy + curve * 6, cx + 8, cy);
                }
                ctx.stroke();
            });

            const mouthH = 4 + mouthOpen * 16;
            const mouthW = 18 + (speaking ? (0.35 + volume * 0.5) * 22 : 0.3 * 22);

            ctx.beginPath();
            if (speaking && mouthOpen > 0.1) {
                ctx.ellipse(0, MOUTH_Y, mouthW, mouthH, 0, 0, Math.PI * 2);
                ctx.fillStyle = '#221313'; ctx.fill();
            } else {
                ctx.moveTo(-mouthW / 2, MOUTH_Y);
                ctx.lineTo(mouthW / 2, MOUTH_Y);
                ctx.strokeStyle = '#221313';
                ctx.lineWidth = 3;
                ctx.stroke();
            }

            if (thinking) {
                ctx.font = '14px Arial';
                ctx.fillStyle = '#666';
                ctx.textAlign = 'center';
                const dots = '.'.repeat((Math.floor(timestamp / 400) % 3) + 1);
                ctx.fillText(dots, 0, -60);
            }

            ctx.restore();
            rafId = requestAnimationFrame(draw);
        };

        rafId = requestAnimationFrame(draw);
        return () => cancelAnimationFrame(rafId);

    }, [speaking, thinking, listening, volume, eyeOffset, mood]);

    return (
        <canvas
            ref={canvasRef}
            className={`avatar-canvas ${speaking ? 'speaking' : ''} ${thinking ? 'thinking' : ''} ${listening ? 'listening' : ''}`}
            width={120} height={120}
            aria-label={`Avatar ${speaking ? 'hablando' : thinking ? 'pensando' : 'esperando'}`}
        />
    );
}
