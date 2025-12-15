import React, { useState, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import PipeModel from './components/PipeModel';
import ControlsPanel from './components/ControlsPanel';
import { PipeState, PipeColor } from './types';
import { calculatePrice } from './services/pricingService';

const App: React.FC = () => {
  // Initial State
  const [config, setConfig] = useState<PipeState>({
    outerDiameter: 200, 
    wallThickness: 8,   
    length: 3000,       
    color: PipeColor.GRAY,
  });

  const [price, setPrice] = useState<number>(0);
  
  // Reference to the 3D mesh to manipulate rotation directly
  const pipeRef = useRef<THREE.Mesh>(null);

  // Update price whenever config changes
  useEffect(() => {
    const newPrice = calculatePrice(config, config.color);
    setPrice(newPrice);
  }, [config]);

  // Rotation Handlers
  const handleRotate = (axis: 'x' | 'y', direction: 1 | -1) => {
    if (pipeRef.current) {
      const step = Math.PI / 8; // 22.5 degrees per click
      pipeRef.current.rotation[axis] += step * direction;
    }
  };

  return (
    // Main Container: Flex Column on Mobile, Flex Row on Desktop
    <div className="relative w-full h-screen bg-slate-50 overflow-hidden flex flex-col md:flex-row">
      
      {/* 
         SIDEBAR CONTAINER 
         Mobile: Order 2 (Bottom), Height 55%
         Desktop: Order 1 (Left), Width 96 (Fixed), Height 100%
      */}
      <div className="order-2 md:order-1 w-full h-[55%] md:h-full md:w-96 relative z-20 shadow-2xl">
        <ControlsPanel 
          config={config} 
          onConfigChange={setConfig} 
          price={price} 
        />
      </div>

      {/* 
         3D VIEWPORT CONTAINER
         Mobile: Order 1 (Top), Height 45%
         Desktop: Order 2 (Right), Flex-1 (Takes remaining space), Height 100%
      */}
      <div className="order-1 md:order-2 w-full h-[45%] md:h-full flex-1 relative bg-gradient-to-b from-gray-100 to-gray-200 z-10">
        
        {/* 2D Rotation Controls (HUD) - Scaled down on mobile */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2 z-20 flex flex-col items-center gap-2 pointer-events-auto scale-75 md:scale-100 origin-left">
          {/* Up */}
          <button 
            onClick={() => handleRotate('x', -1)}
            className="w-12 h-12 bg-white/90 backdrop-blur rounded-xl shadow-lg border border-slate-200 text-slate-700 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all active:scale-95 flex items-center justify-center"
            aria-label="Pivoter Haut"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m18 15-6-6-6 6"/></svg>
          </button>
          
          <div className="flex gap-2">
            {/* Left */}
            <button 
              onClick={() => handleRotate('y', -1)}
              className="w-12 h-12 bg-white/90 backdrop-blur rounded-xl shadow-lg border border-slate-200 text-slate-700 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all active:scale-95 flex items-center justify-center"
              aria-label="Pivoter Gauche"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            </button>
            
            {/* Center Dot (Decoration) */}
            <div className="w-12 h-12 bg-slate-100/50 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-slate-300 rounded-full"></div>
            </div>

            {/* Right */}
            <button 
              onClick={() => handleRotate('y', 1)}
              className="w-12 h-12 bg-white/90 backdrop-blur rounded-xl shadow-lg border border-slate-200 text-slate-700 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all active:scale-95 flex items-center justify-center"
              aria-label="Pivoter Droite"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </button>
          </div>

          {/* Down */}
          <button 
            onClick={() => handleRotate('x', 1)}
            className="w-12 h-12 bg-white/90 backdrop-blur rounded-xl shadow-lg border border-slate-200 text-slate-700 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all active:scale-95 flex items-center justify-center"
            aria-label="Pivoter Bas"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
          </button>
          
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2 hidden md:block">PIVOTER</span>
        </div>

        <Canvas shadows dpr={[1, 2]} camera={{ position: [3, 2, 4], fov: 45 }}>
          <fog attach="fog" args={['#f3f4f6', 10, 50]} />
          
          {/* Lighting */}
          <ambientLight intensity={0.7} />
          <directionalLight position={[10, 10, 5]} intensity={1.5} castShadow />
          <Environment preset="warehouse" />

          {/* Scene Content */}
          <group position={[0, 0, 0]}>
             <PipeModel ref={pipeRef} config={config} />
          </group>
          
          <ContactShadows 
            opacity={0.4} 
            scale={20} 
            blur={2} 
            far={4} 
            resolution={256} 
            color="#000000" 
            position={[0, -1, 0]}
          />

          <OrbitControls 
            makeDefault 
            minPolarAngle={0} 
            maxPolarAngle={Math.PI / 1.5} 
            enableZoom={true} 
            minDistance={2} 
            maxDistance={10}
            mouseButtons={{
              LEFT: THREE.MOUSE.PAN,
              MIDDLE: THREE.MOUSE.DOLLY,
              RIGHT: THREE.MOUSE.ROTATE
            }}
          />
        </Canvas>

        {/* Overlay Badge */}
        <div className="absolute top-4 right-4 bg-white/80 backdrop-blur px-3 py-1 md:px-4 md:py-2 rounded-lg shadow-sm pointer-events-none select-none">
          <p className="text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-wider">APERÇU 3D</p>
        </div>
      </div>
    </div>
  );
};

export default App;