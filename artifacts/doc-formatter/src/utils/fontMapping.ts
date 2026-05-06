/** Maps web font names to DejaVu TTF equivalents for ReportLab */
export const fontMapping: Record<string, 'DVSans' | 'DVSerif'> = {
  // Sans-serif → DVSans
  'Inter': 'DVSans',
  'Roboto': 'DVSans',
  'Open Sans': 'DVSans',
  'Lato': 'DVSans',
  'Poppins': 'DVSans',
  'Nunito': 'DVSans',
  'Source Sans Pro': 'DVSans',
  'Raleway': 'DVSans',
  'Montserrat': 'DVSans',
  'DM Sans': 'DVSans',
  'Noto Sans': 'DVSans',
  'Ubuntu': 'DVSans',
  'Outfit': 'DVSans',
  'Arial': 'DVSans',
  'Helvetica': 'DVSans',
  'Helvetica Neue': 'DVSans',
  'Source Code Pro': 'DVSans',

  // Serif → DVSerif
  'Lora': 'DVSerif',
  'Merriweather': 'DVSerif',
  'Playfair Display': 'DVSerif',
  'Georgia': 'DVSerif',
  'EB Garamond': 'DVSerif',
  'Libre Baskerville': 'DVSerif',
  'Crimson Text': 'DVSerif',
  'Source Serif Pro': 'DVSerif',
  'Noto Serif': 'DVSerif',
  'PT Serif': 'DVSerif',
  'Times New Roman': 'DVSerif',
};

/**
 * Resolves a web font family string to its DejaVu equivalent.
 * Extracts the primary font name from a CSS font-family string like "Inter, sans-serif"
 * and looks it up in fontMapping. Defaults to 'DVSans'.
 */
export function resolveFont(fontFamily: string): 'DVSans' | 'DVSerif' {
  const primaryFont = fontFamily.split(',')[0].trim();
  return fontMapping[primaryFont] || 'DVSans';
}
