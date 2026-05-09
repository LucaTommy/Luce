/* Text measurement via hidden SVG */

function measureTextWidth(text, fontFamily, fontSize, fontWeight, fontStyle) {
  const svg = document.getElementById('measureSVG');
  if (!svg) return fontSize * text.length * 0.6;
  const t = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  t.setAttribute('x', '0');
  t.setAttribute('y', '0');
  t.setAttribute('font-family', fontFamily);
  t.setAttribute('font-size', String(fontSize));
  if (fontWeight) t.setAttribute('font-weight', String(fontWeight));
  if (fontStyle)  t.setAttribute('font-style', fontStyle);
  t.textContent = text || '';
  svg.appendChild(t);
  const w = t.getBBox().width;
  t.remove();
  return w;
}

/* Only split on explicit newlines — no auto word-wrap */
function splitLines(text) {
  if (text == null) return [];
  return String(text).split(/\r?\n/);
}

/* Word-wrap: respects explicit \n, wraps by word.
   For words wider than contentW (unbreakable strings), splits
   at the last character that fits — never lets text overflow. */
function wrapWithHardBreaks(text, contentW, fontFamily, fontSize, fontWeight, fontStyle) {
  const hardLines = splitLines(text);
  if (!contentW || !fontSize || !fontFamily) return hardLines;
  const mw = (t) => measureTextWidth(t, fontFamily, fontSize, fontWeight, fontStyle);
  const result = [];
  for (const line of hardLines) {
    if (!line.trim()) { result.push(line); continue; }
    const words = line.split(' ');
    let current = '';
    for (const word of words) {
      const candidate = current ? current + ' ' + word : word;
      if (current && mw(candidate) > contentW) {
        result.push(current);
        current = word;
      } else {
        current = candidate;
      }
      // Single word wider than contentW → character-level break
      while (current === word && mw(current) > contentW) {
        let cut = current.length - 1;
        while (cut > 0 && mw(current.slice(0, cut)) > contentW) {
          cut--;
        }
        if (cut <= 0) cut = 1; // at least 1 character
        result.push(current.slice(0, cut));
        current = current.slice(cut);
      }
    }
    if (current) result.push(current);
  }
  return result;
}

function escapeXML(str) {
  return (str || '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}
