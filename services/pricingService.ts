import { PipeColor, PipeDimensions } from '../types';

// Density of PVC approx 1.4 g/cm^3
const PVC_DENSITY_G_CM3 = 1.4;
const PRICE_PER_KG = 3.50; // Base price in currency

// Color multiplier (some colors might be more expensive)
// We use a Record<string, number> to allow looking up standard colors
const COLOR_MULTIPLIERS: Record<string, number> = {
  [PipeColor.GRAY]: 1.0,
  [PipeColor.WHITE]: 1.1,
  [PipeColor.BLUE]: 1.25,
  [PipeColor.ORANGE]: 1.15,
  [PipeColor.GREEN]: 1.25,
  [PipeColor.RED]: 1.30,
  [PipeColor.BLACK]: 1.10,
  [PipeColor.YELLOW]: 1.20,
};

const CUSTOM_COLOR_MULTIPLIER = 1.5; // Premium for non-standard colors

export const calculatePrice = (
  dimensions: PipeDimensions,
  color: string
): number => {
  const { outerDiameter, wallThickness, length } = dimensions;

  // Validate geometry to avoid negative volume
  if (wallThickness * 2 >= outerDiameter) return 0;

  const outerRadius = outerDiameter / 2;
  const innerRadius = outerRadius - wallThickness;

  // Calculate volume in mm^3
  // V = π * h * (R^2 - r^2)
  const volumeMm3 = Math.PI * length * (Math.pow(outerRadius, 2) - Math.pow(innerRadius, 2));

  // Convert to cm^3 (1 cm^3 = 1000 mm^3)
  const volumeCm3 = volumeMm3 / 1000;

  // Weight in grams
  const weightGrams = volumeCm3 * PVC_DENSITY_G_CM3;

  // Weight in kg
  const weightKg = weightGrams / 1000;

  // Determine multiplier
  // Check if the exact hex exists in our standard list, otherwise apply custom rate
  const multiplier = COLOR_MULTIPLIERS[color] || CUSTOM_COLOR_MULTIPLIER;

  // Final price
  const basePrice = weightKg * PRICE_PER_KG;
  const finalPrice = basePrice * multiplier;

  // Return rounded to 2 decimals
  return Math.round(finalPrice * 100) / 100;
};