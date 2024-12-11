// This file extends the existing Three.js type definitions
import { Object3D, Material, BufferGeometry } from 'three';

declare module '@react-three/fiber' {
    interface ThreeElements {
        mesh: Object3D;
    }
}

declare module '@react-three/drei' {
    export interface SphereProps {
        args?: [radius?: number, widthSegments?: number, heightSegments?: number];
        children?: React.ReactNode;
        position?: [number, number, number];
        ref?: React.RefObject<THREE.Mesh>;
    }

    export interface MeshDistortMaterialProps {
        color?: string | number;
        attach?: string;
        distort?: number;
        speed?: number;
        roughness?: number;
    }
}