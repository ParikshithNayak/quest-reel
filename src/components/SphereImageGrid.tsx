import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X } from 'lucide-react';

/**
 * SphereImageGrid - Interactive 3D Image Sphere Component
 *
 * A React TypeScript component that displays images arranged in a 3D sphere layout.
 * Features:
 * - Drag to rotate with momentum
 * - Auto-rotation
 * - Click-to-enlarge modal
 * - Touch support
 * - Dynamic scaling and fade
 * - Collision avoidance
 */

export interface Position3D {
  x: number;
  y: number;
  z: number;
}

export interface SphericalPosition {
  theta: number;
  phi: number;
  radius: number;
}

export interface WorldPosition extends Position3D {
  scale: number;
  zIndex: number;
  isVisible: boolean;
  fadeOpacity: number;
  originalIndex: number;
}

export interface ImageData {
  id: string;
  src: string;
  alt: string;
  title?: string;
  description?: string;
}

export interface SphereImageGridProps {
  images?: ImageData[];
  containerSize?: number;
  sphereRadius?: number;
  dragSensitivity?: number;
  momentumDecay?: number;
  maxRotationSpeed?: number;
  baseImageScale?: number;
  hoverScale?: number;
  perspective?: number;
  autoRotate?: boolean;
  autoRotateSpeed?: number;
  className?: string;
}

interface RotationState {
  x: number;
  y: number;
  z: number;
}

interface VelocityState {
  x: number;
  y: number;
}

interface MousePosition {
  x: number;
  y: number;
}

// Math helpers
const SPHERE_MATH = {
  degreesToRadians: (degrees: number): number => degrees * (Math.PI / 180),
  normalizeAngle: (angle: number): number => {
    while (angle > 180) angle -= 360;
    while (angle < -180) angle += 360;
    return angle;
  },
};

const SphereImageGrid: React.FC<SphereImageGridProps> = ({
  images = [],
  containerSize = 400,
  sphereRadius = 200,
  dragSensitivity = 0.5,
  momentumDecay = 0.95,
  maxRotationSpeed = 5,
  baseImageScale = 0.12,
  hoverScale = 1.2,
  perspective = 1000,
  autoRotate = false,
  autoRotateSpeed = 0.3,
  className = '',
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const [rotation, setRotation] = useState<RotationState>({ x: 15, y: 15, z: 0 });
  const [velocity, setVelocity] = useState<VelocityState>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [selectedImage, setSelectedImage] = useState<ImageData | null>(null);
  const [imagePositions, setImagePositions] = useState<SphericalPosition[]>([]);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const lastMousePos = useRef<MousePosition>({ x: 0, y: 0 });
  const animationFrame = useRef<number | null>(null);

  const actualSphereRadius = sphereRadius || containerSize * 0.5;
  const baseImageSize = containerSize * baseImageScale;

  // Generate Fibonacci sphere distribution
  const generateSpherePositions = useCallback((): SphericalPosition[] => {
    const positions: SphericalPosition[] = [];
    const count = images.length;
    const goldenRatio = (1 + Math.sqrt(5)) / 2;
    const angleIncrement = 2 * Math.PI / goldenRatio;

    for (let i = 0; i < count; i++) {
      const t = i / count;
      const inclination = Math.acos(1 - 2 * t);
      const azimuth = angleIncrement * i;

      const phi = inclination * (180 / Math.PI);
      const theta = azimuth * (180 / Math.PI);

      positions.push({ theta, phi, radius: actualSphereRadius });
    }

    return positions;
  }, [images.length, actualSphereRadius]);

  // Convert sphere positions to 3D screen positions
  const calculateWorldPositions = useCallback((): WorldPosition[] => {
    return imagePositions.map((pos, index) => {
      const thetaRad = SPHERE_MATH.degreesToRadians(pos.theta);
      const phiRad = SPHERE_MATH.degreesToRadians(pos.phi);
      const rotX = SPHERE_MATH.degreesToRadians(rotation.x);
      const rotY = SPHERE_MATH.degreesToRadians(rotation.y);

      let x = pos.radius * Math.sin(phiRad) * Math.cos(thetaRad);
      let y = pos.radius * Math.cos(phiRad);
      let z = pos.radius * Math.sin(phiRad) * Math.sin(thetaRad);

      // Rotate around Y
      const x1 = x * Math.cos(rotY) + z * Math.sin(rotY);
      const z1 = -x * Math.sin(rotY) + z * Math.cos(rotY);
      x = x1;
      z = z1;

      // Rotate around X
      const y2 = y * Math.cos(rotX) - z * Math.sin(rotX);
      const z2 = y * Math.sin(rotX) + z * Math.cos(rotX);
      y = y2;
      z = z2;

      const fadeStart = -10, fadeEnd = -30;
      const isVisible = z > fadeEnd;
      const fadeOpacity = z <= fadeStart ? Math.max(0, (z - fadeEnd) / (fadeStart - fadeEnd)) : 1;

      const scale = Math.max(0.3, (z + actualSphereRadius) / (2 * actualSphereRadius));

      return {
        x, y, z,
        scale,
        zIndex: Math.round(1000 + z),
        isVisible,
        fadeOpacity,
        originalIndex: index,
      };
    });
  }, [imagePositions, rotation, actualSphereRadius]);

  const clampSpeed = (v: number) =>
    Math.max(-maxRotationSpeed, Math.min(maxRotationSpeed, v));

  // Momentum + Auto rotate
  const updateMomentum = useCallback(() => {
    if (isDragging) return;

    setVelocity(prev => {
      const newVel = { x: prev.x * momentumDecay, y: prev.y * momentumDecay };
      if (!autoRotate && Math.abs(newVel.x) < 0.01 && Math.abs(newVel.y) < 0.01) {
        return { x: 0, y: 0 };
      }
      return newVel;
    });

    setRotation(prev => ({
      x: SPHERE_MATH.normalizeAngle(prev.x + clampSpeed(velocity.x)),
      y: SPHERE_MATH.normalizeAngle(prev.y + clampSpeed(velocity.y + (autoRotate ? autoRotateSpeed : 0))),
      z: prev.z,
    }));
  }, [isDragging, velocity, momentumDecay, autoRotate, autoRotateSpeed, maxRotationSpeed]);

  // Mouse/touch controls
  const handleDown = (x: number, y: number) => {
    setIsDragging(true);
    setVelocity({ x: 0, y: 0 });
    lastMousePos.current = { x, y };
  };

  const handleMove = (x: number, y: number) => {
    if (!isDragging) return;
    const dx = x - lastMousePos.current.x;
    const dy = y - lastMousePos.current.y;

    const delta = { x: -dy * dragSensitivity, y: -dx * dragSensitivity };

    setRotation(prev => ({
      x: SPHERE_MATH.normalizeAngle(prev.x + clampSpeed(delta.x)),
      y: SPHERE_MATH.normalizeAngle(prev.y + clampSpeed(delta.y)),
      z: prev.z,
    }));

    setVelocity({ x: clampSpeed(delta.x), y: clampSpeed(delta.y) });
    lastMousePos.current = { x, y };
  };

  const handleMouseDown = (e: React.MouseEvent) => handleDown(e.clientX, e.clientY);
  const handleMouseMove = (e: MouseEvent) => handleMove(e.clientX, e.clientY);
  const handleTouchStart = (e: React.TouchEvent) => handleDown(e.touches[0].clientX, e.touches[0].clientY);
  const handleTouchMove = (e: TouchEvent) => handleMove(e.touches[0].clientX, e.touches[0].clientY);
  const handleUp = () => setIsDragging(false);

  useEffect(() => {
    setIsMounted(true);
    setImagePositions(generateSpherePositions());
  }, [generateSpherePositions]);

  useEffect(() => {
    const animate = () => {
      updateMomentum();
      animationFrame.current = requestAnimationFrame(animate);
    };
    animationFrame.current = requestAnimationFrame(animate);
    return () => animationFrame.current && cancelAnimationFrame(animationFrame.current);
  }, [updateMomentum]);

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleUp);
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleUp);
    };
  }, [isDragging]);

  const worldPositions = calculateWorldPositions();

  const renderImageNode = useCallback(
    (image: ImageData, index: number) => {
      const pos = worldPositions[index];
      if (!pos || !pos.isVisible) return null;
      const size = baseImageSize * pos.scale;
      const hoverScaleValue = hoveredIndex === index ? hoverScale : 1;

      return (
        <div
          key={image.id}
          className="absolute cursor-pointer transition-transform duration-200 ease-out"
          style={{
            width: `${size}px`,
            height: `${size}px`,
            left: `${containerSize / 2 + pos.x}px`,
            top: `${containerSize / 2 + pos.y}px`,
            opacity: pos.fadeOpacity,
            transform: `translate(-50%, -50%) scale(${hoverScaleValue})`,
            zIndex: pos.zIndex,
          }}
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
          onClick={() => setSelectedImage(image)}
        >
          <div className="relative w-full h-full rounded-full overflow-hidden shadow-lg border border-white/10">
            <img src={image.src} alt={image.alt} className="w-full h-full object-cover" draggable={false} />
          </div>
        </div>
      );
    },
    [worldPositions, baseImageSize, containerSize, hoveredIndex, hoverScale]
  );

  const renderModal = () =>
    selectedImage && (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        onClick={() => setSelectedImage(null)}
      >
        <div
          className="bg-white rounded-xl max-w-sm w-full overflow-hidden relative shadow-2xl"
          onClick={e => e.stopPropagation()}
        >
          <img src={selectedImage.src} alt={selectedImage.alt} className="w-full h-auto max-h-[60vh] object-contain" />
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-2 right-2 bg-black/70 hover:bg-black rounded-full p-2 text-white transition-colors"
          >
            <X size={20} />
          </button>
          {(selectedImage.title || selectedImage.description) && (
            <div className="p-4">
              {selectedImage.title && <h3 className="text-lg font-semibold text-gray-900">{selectedImage.title}</h3>}
              {selectedImage.description && <p className="text-sm text-gray-600 mt-1">{selectedImage.description}</p>}
            </div>
          )}
        </div>
      </div>
    );

  if (!isMounted) {
    return (
      <div
        className="bg-gray-100 rounded-lg animate-pulse flex items-center justify-center"
        style={{ width: containerSize, height: containerSize }}
      >
        Loading...
      </div>
    );
  }

  if (!images.length) {
    return (
      <div
        className="bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center"
        style={{ width: containerSize, height: containerSize }}
      >
        <div className="text-gray-400 text-center">No images provided</div>
      </div>
    );
  }

  return (
    <>
      <div
        ref={containerRef}
        className={`relative select-none cursor-grab active:cursor-grabbing ${className}`}
        style={{ width: containerSize, height: containerSize, perspective: `${perspective}px` }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        <div className="relative w-full h-full">{images.map((img, i) => renderImageNode(img, i))}</div>
      </div>
      {renderModal()}
    </>
  );
};

export default SphereImageGrid;
