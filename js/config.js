const CONFIG = {

  MM_TO_PX: 300 / 25.4, // 300 DPI

  pagePresets: {
    a4: {
      label: 'A4', wMM: 210, hMM: 297,
      width: 2480, height: 3508,
      margins: { top: 240, right: 200, bottom: 240, left: 200 },
      displayLabel: 'A4 · 210 × 297 mm',
    },
    a3: {
      label: 'A3', wMM: 297, hMM: 420,
      width: 3508, height: 4961,
      margins: { top: 340, right: 280, bottom: 340, left: 280 },
      displayLabel: 'A3 · 297 × 420 mm',
    },
    instagram: {
      label: 'Instagram', wMM: 91.44, hMM: 121.92,
      width: 1080, height: 1440,
      margins: { top: 108, right: 86, bottom: 108, left: 86 },
      displayLabel: 'Instagram · 1080 × 1440 px',
    },
    instagramStory: {
      label: 'IG Story', wMM: 91.44, hMM: 162.56,
      width: 1080, height: 1920,
      margins: { top: 108, right: 86, bottom: 108, left: 86 },
      displayLabel: 'IG Story · 1080 × 1920 px',
    },
    hd: {
      label: 'HD', wMM: 216.75, hMM: 121.92,
      width: 2560, height: 1440,
      margins: { top: 144, right: 256, bottom: 144, left: 256 },
      displayLabel: 'HD · 2560 × 1440 px',
    },
    a5Landscape: {
      label: 'A5 Orizzontale', wMM: 210, hMM: 148,
      width: 2480, height: 1748,
      margins: { top: 120, right: 160, bottom: 120, left: 160 },
      displayLabel: 'A5 Orizzontale · 210 × 148 mm',
    },
  },

  typography: {
    // Font sizes as ratio of canvas width
    titoloSizeRatio: 1 / 12,
    testoSizeRatio:  1 / 20,
    // Data+Luogo font size ratio
    dataLuogoSizeRatio: 1 / 28,
    // Slider ranges
    sizeSliderMin: 1 / 40,
    sizeSliderMax: 1 / 6,
    // Titolo line-height multiplier
    titoloLHNormal:   1.0,
    titoloLHModified: 1.2,
    // Testo line-height
    testoLineHeight: 1.1,
    // Gap between Data+Luogo row and Titolo
    dataTitoloGap: 1 / 60,
    // Logo sizing as ratio of canvas min dimension
    logoHeightRatio: 0.072,
  },

  // QR code defaults
  qrDefaults: {
    defaultUrl: '',
    sizeRatio: 0.1,
    vpos: 'bottom',
    vAlign: 'bottom',
    hAlign: 'center',
    gapRatio: 0.02,
  },

  // Sidebar width constraints
  sidebarWidth: { min: 200, max: 500, default: 272 },

  // Tutorial state keys
  tutorial: {
    patternTutorialKey: 'pattern_tutorial_done',
  },

  palette: [
    { name: 'Rosso',        hex: '#e63323' },
    { name: 'Rosa',         hex: '#f6b1a6' },
    { name: 'Verde Chiaro', hex: '#cacc84' },
    { name: 'Azzurro',      hex: '#66c1bf' },
    { name: 'Crema',        hex: '#f6f5ee' },
    { name: 'Verde',        hex: '#4a6741' },
    { name: 'Nero',         hex: '#302d2e' },
  ],

  gradients: [
    { name: 'Rosso → Rosa',          from: '#e63323', to: '#f6b1a6', angle: 90 },
    { name: 'Rosa → Rosso',          from: '#f6b1a6', to: '#e63323', angle: 90 },
    { name: 'Verde → Rosa',          from: '#4a6741', to: '#f6b1a6', angle: 90 },
    { name: 'Rosa → Verde',          from: '#f6b1a6', to: '#4a6741', angle: 90 },
    { name: 'Rosso → Verde Chiaro',  from: '#e63323', to: '#cacc84', angle: 90 },
    { name: 'Verde Chiaro → Rosso',  from: '#cacc84', to: '#e63323', angle: 90 },
    { name: 'Rosso → Azzurro',       from: '#e63323', to: '#66c1bf', angle: 90 },
    { name: 'Azzurro → Rosso',       from: '#66c1bf', to: '#e63323', angle: 90 },
  ],

  // Per-color gradient variations — built after CONFIG is fully defined (see bottom of file)

  // Side-fade gradient preset: 85% offset means first color dominates 85% of the area
  sideFade85: { stopOffset: '85%' },

  background: { defaultColor: '#f6f5ee' },
  text:       { defaultColor: '#302d2e' },

  fonts: {
    primary:      { name: 'QSci',  fmt: 'opentype', weight: '400' },
    primaryBlack: { name: 'QSci Black', fmt: 'opentype', weight: '700' },
    secondary:    { name: 'Ronzino', fmt: 'opentype', weight: '400' },
    icon:         { name: 'QSciIcon', fmt: 'opentype', weight: '400' },
  },

  // Shape library definitions
  shapes: [
    { id: 'circle',    label: 'Cerchio',     icon: '●' },
    { id: 'square',    label: 'Quadrato',    icon: '■' },
    { id: 'rectangle', label: 'Rettangolo',  icon: '▬' },
  ],

  // Blend modes for shapes (text blend modes removed)
  blendModes: [
    { value: 'normal',   label: 'Normale' },
    { value: 'multiply', label: 'Multiply' },
    { value: 'screen',   label: 'Screen'  },
    { value: 'overlay',  label: 'Overlay' },
  ],

  // kept for back-compat
  font: { name: 'QSci', file: 'Q-Sci.otf', fmt: 'opentype', weight: '400' },

  export: { defaultScale: 1, maxScale: 4 },
};

// Build per-color gradient variation tints AFTER CONFIG is fully assigned
(function() {
  const hexToRGB = (h) => ({
    r: parseInt(h.slice(1,3), 16),
    g: parseInt(h.slice(3,5), 16),
    b: parseInt(h.slice(5,7), 16),
  });
  const rgbToHex = (r,g,b) => '#' + [r,g,b].map(c => Math.max(0, Math.min(255, Math.round(c))).toString(16).padStart(2,'0')).join('');
  const lerp = (a,b,t) => a + (b-a) * t;
  const vars = [
    { label: 'chiarissimo', t: 0.75 },
    { label: 'chiaro',      t: 0.45 },
    { label: 'medio',       t: 0 },
    { label: 'scuro',       t: -0.4 },
    { label: 'scurissimo',  t: -0.75 },
  ];
  const result = {};
  for (const c of CONFIG.palette) {
    const rgb = hexToRGB(c.hex);
    const steps = vars.map(v => {
      const target = v.t >= 0 ? { r:255,g:255,b:255 } : { r:0,g:0,b:0 };
      const amt = Math.abs(v.t);
      return {
        label: v.label,
        from: c.hex,
        to: rgbToHex(
          Math.round(lerp(rgb.r, target.r, amt)),
          Math.round(lerp(rgb.g, target.g, amt)),
          Math.round(lerp(rgb.b, target.b, amt)),
        ),
      };
    });
    result[c.name] = steps;
  }
  CONFIG.gradVariations = result;
})();
