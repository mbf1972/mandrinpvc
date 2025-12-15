import React from 'react';
import { 
  PipeState, 
  PipeColor, 
  MIN_DIAMETER, MAX_DIAMETER, 
  MIN_THICKNESS, MAX_THICKNESS, 
  MIN_LENGTH, MAX_LENGTH 
} from '../types';

interface ControlsPanelProps {
  config: PipeState;
  onConfigChange: (newConfig: PipeState) => void;
  price: number;
}

const ControlsPanel: React.FC<ControlsPanelProps> = ({ config, onConfigChange, price }) => {
  
  const handleChange = (key: keyof PipeState, value: string | number) => {
    let newValue = value;
    
    // Numeric conversion for inputs
    if (key !== 'color' && typeof value === 'string') {
      newValue = parseFloat(value);
    }

    // Validation logic for thickness vs diameter
    if (key === 'wallThickness') {
      const maxThickness = (config.outerDiameter / 2) - 1; 
      if (newValue as number > maxThickness) return; // Prevent impossible geometry
    }
    if (key === 'outerDiameter') {
       // Ensure thickness remains valid if diameter shrinks
       const newRadius = (newValue as number) / 2;
       if (config.wallThickness >= newRadius) {
          onConfigChange({
            ...config,
            [key]: newValue as number,
            wallThickness: newRadius - 2
          });
          return;
       }
    }

    onConfigChange({ ...config, [key]: newValue } as PipeState);
  };

  const presetColors = Object.values(PipeColor);

  return (
    <div className="w-full h-full bg-white/90 backdrop-blur-md shadow-2xl p-6 overflow-y-auto border-t md:border-t-0 md:border-r border-slate-200 flex flex-col">
      
      {/* BRANDING HEADER */}
      <div className="mb-6 md:mb-8 border-b border-slate-100 pb-6">
        <div className="flex items-center gap-4 mb-3">
          {/* Logo Placeholder - Replace src with your actual logo file path */}
          <div className="w-16 h-16 bg-white rounded-full shadow-lg border border-slate-100 flex items-center justify-center overflow-hidden shrink-0 p-1">
             <img 
               src="https://placehold.co/100x100/ffffff/3b82f6?text=AM" 
               alt="Logo AMplast" 
               className="w-full h-full object-contain"
             />
          </div>
          
          <div>
             <h1 className="text-3xl font-black tracking-tighter leading-none">
               <span className="text-[#ef4444]">A</span>
               <span className="text-[#3b82f6]">M</span>
               <span className="text-slate-800">plast</span>
             </h1>
             <div className="h-1 w-12 bg-gradient-to-r from-[#ef4444] to-[#3b82f6] rounded-full mt-1"></div>
          </div>
        </div>
        
        <p className="text-xs md:text-sm text-slate-500 font-medium pl-1 border-l-2 border-slate-200 ml-2">
          Spécialité de tout genre de mandrins PVC et tuyaux.
        </p>
      </div>

      <div className="flex-1 space-y-6 md:space-y-8">
        {/* Outer Diameter */}
        <div className="space-y-3">
          <div className="flex justify-between">
            <label className="text-sm font-semibold text-slate-700">Diamètre Extérieur (mm)</label>
            <span className="text-sm font-mono text-blue-600 bg-blue-50 px-2 rounded">{config.outerDiameter} mm</span>
          </div>
          <input
            type="range"
            min={MIN_DIAMETER}
            max={MAX_DIAMETER}
            step={1}
            value={config.outerDiameter}
            onChange={(e) => handleChange('outerDiameter', e.target.value)}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600 hover:accent-blue-700 transition-all"
          />
          <div className="flex justify-between text-xs text-slate-400">
            <span>{MIN_DIAMETER}mm</span>
            <span>{MAX_DIAMETER}mm</span>
          </div>
        </div>

        {/* Wall Thickness */}
        <div className="space-y-3">
          <div className="flex justify-between">
            <label className="text-sm font-semibold text-slate-700">Épaisseur de Paroi (mm)</label>
            <span className="text-sm font-mono text-blue-600 bg-blue-50 px-2 rounded">{config.wallThickness} mm</span>
          </div>
          <input
            type="range"
            min={MIN_THICKNESS}
            max={MAX_THICKNESS}
            step={0.5}
            value={config.wallThickness}
            onChange={(e) => handleChange('wallThickness', e.target.value)}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600 hover:accent-blue-700 transition-all"
          />
          <div className="flex justify-between text-xs text-slate-400">
            <span>{MIN_THICKNESS}mm</span>
            <span>{MAX_THICKNESS}mm</span>
          </div>
        </div>

        {/* Length */}
        <div className="space-y-3">
          <div className="flex justify-between">
            <label className="text-sm font-semibold text-slate-700">Longueur (mm)</label>
            <span className="text-sm font-mono text-blue-600 bg-blue-50 px-2 rounded">{config.length} mm</span>
          </div>
          <input
            type="range"
            min={MIN_LENGTH}
            max={MAX_LENGTH}
            step={100}
            value={config.length}
            onChange={(e) => handleChange('length', e.target.value)}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600 hover:accent-blue-700 transition-all"
          />
          <div className="flex justify-between text-xs text-slate-400">
            <span>{MIN_LENGTH}mm</span>
            <span>{MAX_LENGTH}mm</span>
          </div>
        </div>

        {/* Color Selection Palette */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <label className="text-sm font-semibold text-slate-700">Couleur de Finition</label>
            <span className="text-xs text-slate-400 uppercase tracking-wide">
               {Object.values(PipeColor).includes(config.color as PipeColor) ? 'Standard' : 'Personnalisé'}
            </span>
          </div>
          
          {/* Added mr-2 to move it away from the right edge, and increased padding to p-5 */}
          <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 mr-2">
            {/* Presets Grid */}
            <div className="grid grid-cols-4 gap-3 mb-4">
              {presetColors.map((c) => (
                <button
                  key={c}
                  onClick={() => handleChange('color', c)}
                  className={`w-full aspect-square rounded-full shadow-sm border-2 transition-transform hover:scale-105 focus:outline-none ${
                    config.color === c 
                      ? 'border-slate-800 scale-105 ring-2 ring-slate-300 ring-offset-2' 
                      : 'border-slate-200 hover:border-slate-400'
                  }`}
                  style={{ backgroundColor: c }}
                  title={c}
                  aria-label={`Couleur ${c}`}
                />
              ))}
            </div>

            {/* Custom Picker */}
            <div className="relative flex items-center gap-3 pt-3 border-t border-slate-200">
              <div className="relative flex-1 h-10 overflow-hidden rounded-lg shadow-sm ring-1 ring-slate-200 group cursor-pointer hover:ring-slate-400 transition-all bg-white">
                <input 
                    type="color" 
                    value={config.color}
                    onChange={(e) => handleChange('color', e.target.value)}
                    // Added opacity-0 to hide the native input visual but keep it clickable
                    className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] p-0 m-0 border-0 cursor-pointer opacity-0"
                />
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center bg-white/50 group-hover:bg-white/20 transition-colors">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    SÉLECTEUR
                  </span>
                </div>
              </div>
              <div className="text-xs font-mono text-slate-600 bg-white px-2 py-2 rounded border border-slate-200 min-w-[5rem] text-center font-bold uppercase tracking-wider">
                {config.color}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Summary */}
      <div className="mt-8 pt-6 border-t border-slate-200">
        <div className="flex items-end justify-between">
          <div className="text-slate-500 text-sm">Prix Estimé</div>
          <div className="text-3xl font-bold text-slate-900">
            {price.toFixed(2)} Dh
          </div>
        </div>
        <p className="text-xs text-slate-400 mt-2">
          *Prix calculé sur la base du volume de PVC brut et de la qualité de la couleur. 
          {!Object.values(PipeColor).includes(config.color as PipeColor) && (
            <span className="text-orange-500 font-semibold block mt-1">Inclut +50% de frais pour couleur personnalisée.</span>
          )}
        </p>
        <button className="w-full mt-6 bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-4 rounded-xl transition-colors shadow-lg">
          Ajouter au Devis
        </button>
      </div>
    </div>
  );
};

export default ControlsPanel;