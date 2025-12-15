/**
 * Generates a striped normal map/bump map data URI to simulate
 * extruded grooves or industrial finishing on the pipe without external assets.
 */
export const generateGrooveTexture = (): string => {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  if (!ctx) return '';

  // Background neutral
  ctx.fillStyle = '#808080';
  ctx.fillRect(0, 0, size, size);

  // Draw noise/lines
  for (let i = 0; i < size; i += 4) {
      const shade = Math.floor(Math.random() * 40) + 108; // 108-148
      const colorStr = `rgb(${shade}, ${shade}, ${shade})`;
      ctx.fillStyle = colorStr;
      // Horizontal lines for rotational extrusion look
      ctx.fillRect(0, i, size, 2); 
  }

  return canvas.toDataURL();
};
