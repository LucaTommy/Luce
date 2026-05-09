/* colorPicker.js — Simplified: gradient square + hue slider + hex + swatches */

const CP_PRESETS = [
  '#ffffff','#f5f5f5','#212121','#000000',
  '#f44336','#e91e63','#9c27b0','#3f51b5',
  '#2196f3','#00bcd4','#4caf50','#8bc34a',
  '#cddc39','#ffeb3b','#ff9800','#795548',
];

function ColorPicker(mountId, onChange) {
  const mount = document.getElementById(mountId);
  if (!mount) return;
  mount.innerHTML = '';

  /* ── State ─────────────────────────────────────────── */
  let hue = 0, sat = 0, val = 1; // HSV
  let dragging = false;
  const SQ_W = 220, SQ_H = 130;

  /* ── DOM ────────────────────────────────────────────── */
  const wrap = document.createElement('div');
  wrap.className = 'cp-wrap';

  /* Gradient square */
  const sqWrap = document.createElement('div');
  sqWrap.className = 'cp-sq-wrap';
  const sqCanvas = document.createElement('canvas');
  sqCanvas.width  = SQ_W;
  sqCanvas.height = SQ_H;
  sqCanvas.className = 'cp-sq-canvas';
  const sqCursor = document.createElement('div');
  sqCursor.className = 'cp-sq-cursor';
  sqWrap.appendChild(sqCanvas);
  sqWrap.appendChild(sqCursor);

  /* Hue slider */
  const hueSlider = document.createElement('input');
  hueSlider.type  = 'range';
  hueSlider.className = 'cp-hue-slider';
  hueSlider.min   = '0';
  hueSlider.max   = '359';
  hueSlider.value = '0';

  /* Hex row */
  const hexRow = document.createElement('div');
  hexRow.className = 'cp-hex-row';
  const preview = document.createElement('div');
  preview.className = 'cp-preview';
  const hexInput = document.createElement('input');
  hexInput.type      = 'text';
  hexInput.className = 'cp-hex-input';
  hexInput.maxLength = 7;
  hexInput.value     = '#ffffff';
  hexRow.appendChild(preview);
  hexRow.appendChild(hexInput);

  /* Swatches */
  const swDiv = document.createElement('div');
  swDiv.className = 'cp-swatches-row';
  CP_PRESETS.forEach(color => {
    const sw = document.createElement('div');
    sw.className = 'cp-swatch';
    sw.style.background = color;
    sw.title = color;
    sw.addEventListener('click', () => applyHex(color));
    swDiv.appendChild(sw);
  });

  /* Recent */
  const recentLabel = document.createElement('p');
  recentLabel.className = 'cp-recent-label';
  recentLabel.textContent = 'Recenti';
  const recentDiv = document.createElement('div');
  recentDiv.className = 'cp-swatches-row';
  recentDiv.id = 'cp-recent';

  /* Assemble */
  wrap.appendChild(sqWrap);
  wrap.appendChild(hueSlider);
  wrap.appendChild(hexRow);
  wrap.appendChild(swDiv);
  wrap.appendChild(recentLabel);
  wrap.appendChild(recentDiv);
  mount.appendChild(wrap);

  /* ── Draw gradient square ─────────────────────────── */
  function drawSquare() {
    const ctx = sqCanvas.getContext('2d');
    ctx.clearRect(0, 0, SQ_W, SQ_H);

    ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;
    ctx.fillRect(0, 0, SQ_W, SQ_H);

    const gWhite = ctx.createLinearGradient(0, 0, SQ_W, 0);
    gWhite.addColorStop(0, 'rgba(255,255,255,1)');
    gWhite.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = gWhite;
    ctx.fillRect(0, 0, SQ_W, SQ_H);

    const gBlack = ctx.createLinearGradient(0, 0, 0, SQ_H);
    gBlack.addColorStop(0, 'rgba(0,0,0,0)');
    gBlack.addColorStop(1, 'rgba(0,0,0,1)');
    ctx.fillStyle = gBlack;
    ctx.fillRect(0, 0, SQ_W, SQ_H);
  }

  /* ── Square cursor position ────────────────────────── */
  function updateCursor() {
    const x = sat * SQ_W;
    const y = (1 - val) * SQ_H;
    sqCursor.style.left = x + 'px';
    sqCursor.style.top  = y + 'px';
    sqCursor.style.background = hsvToHex(hue, sat, val);
    sqCursor.style.borderColor = val > 0.5 ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.7)';
  }

  /* ── Square interaction ────────────────────────────── */
  function pickFromSquareEvent(e) {
    const rect = sqCanvas.getBoundingClientRect();
    const cx = e.touches ? e.touches[0].clientX : e.clientX;
    const cy = e.touches ? e.touches[0].clientY : e.clientY;
    sat = Math.max(0, Math.min(1, (cx - rect.left)  / SQ_W));
    val = Math.max(0, Math.min(1, 1 - (cy - rect.top) / SQ_H));
    syncFromHsv();
  }

  sqCanvas.addEventListener('mousedown',  e => { dragging = true; pickFromSquareEvent(e); });
  sqCanvas.addEventListener('touchstart', e => { dragging = true; pickFromSquareEvent(e); e.preventDefault(); }, { passive: false });
  document.addEventListener('mousemove',  e => { if (dragging) pickFromSquareEvent(e); });
  document.addEventListener('touchmove',  e => { if (dragging) { pickFromSquareEvent(e); e.preventDefault(); } }, { passive: false });
  document.addEventListener('mouseup',    () => { dragging = false; });
  document.addEventListener('touchend',   () => { dragging = false; });

  /* ── Hue slider ────────────────────────────────────── */
  hueSlider.addEventListener('input', () => {
    hue = parseInt(hueSlider.value, 10);
    drawSquare();
    syncFromHsv();
  });

  /* ── Hex input ─────────────────────────────────────── */
  hexInput.addEventListener('input', () => {
    if (/^#[0-9a-fA-F]{6}$/.test(hexInput.value)) applyHex(hexInput.value, false);
  });
  hexInput.addEventListener('blur', () => {
    if (!/^#[0-9a-fA-F]{6}$/.test(hexInput.value)) hexInput.value = hsvToHex(hue, sat, val);
  });

  /* ── Sync everything from current hue/sat/val ──────── */
  function syncFromHsv(updateHexField = true) {
    const hex = hsvToHex(hue, sat, val);
    preview.style.background = hex;
    if (updateHexField) hexInput.value = hex;
    updateCursor();
    onChange(hex);
  }

  /* ── Apply a hex from swatches or input ────────────── */
  function applyHex(hex, updateField = true) {
    const [r, g, b] = hexToRgb(hex);
    [hue, sat, val] = rgbToHsv(r, g, b);
    hueSlider.value = Math.round(hue);
    drawSquare();
    syncFromHsv(updateField);
    pushRecent(hex);
  }

  /* ── Recent ────────────────────────────────────────── */
  function readRecent() {
    try {
      const raw = localStorage.getItem('cp-recent');
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.warn('[ColorPicker] localStorage read failed:', e);
      return [];
    }
  }

  function pushRecent(hex) {
    let recent = readRecent();
    recent = [hex, ...recent.filter(c => c !== hex)].slice(0, 6);
    try {
      localStorage.setItem('cp-recent', JSON.stringify(recent));
    } catch (e) {
      console.warn('[ColorPicker] localStorage write failed:', e);
    }
    renderRecent(recent);
  }

  function renderRecent(recent) {
    recentDiv.innerHTML = '';
    if (!recent.length) { recentLabel.style.display = 'none'; return; }
    recentLabel.style.display = '';
    recent.forEach(color => {
      const sw = document.createElement('div');
      sw.className = 'cp-swatch';
      sw.style.background = color;
      sw.title = color;
      sw.addEventListener('click', () => applyHex(color));
      recentDiv.appendChild(sw);
    });
  }

  /* Init */
  drawSquare();
  syncFromHsv();
  renderRecent(readRecent());

  return { applyHex };
}

/* ── Color math ─────────────────────────────────────────── */

function hsvToRgb(h, s, v) {
  const i = Math.floor(h / 60) % 6;
  const f = (h / 60) - Math.floor(h / 60);
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);
  const m = [[v,t,p],[q,v,p],[p,v,t],[p,q,v],[t,p,v],[v,p,q]][i];
  return m.map(x => Math.round(x * 255));
}

function hsvToHex(h, s, v) {
  return rgbToHex(...hsvToRgb(h, s, v));
}

function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('');
}

function hexToRgb(hex) {
  const m = hex.replace('#', '').match(/.{2}/g);
  return m ? m.map(h => parseInt(h, 16)) : [0, 0, 0];
}

function rgbToHsv(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min;
  const v = max;
  const s = max === 0 ? 0 : d / max;
  let h = 0;
  if (d !== 0) {
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      default:h = ((r - g) / d + 4) / 6;
    }
  }
  return [h * 360, s, v];
}
