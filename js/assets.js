/* assets.js — font loading (uses pre-encoded base64 from font-data.js) */

function preloadFont() {
  const fp  = CONFIG.fonts.primary;
  const fpb = CONFIG.fonts.primaryBlack;
  const fs  = CONFIG.fonts.secondary;
  const fi  = CONFIG.fonts.icon;

  const css =
    `@font-face{font-family:'${fp.name}';src:url(data:font/${fp.fmt};base64,${QSCI_B64}) format('${fp.fmt}');font-weight:${fp.weight};font-style:normal;}` +
    `@font-face{font-family:'${fpb.name}';src:url(data:font/${fpb.fmt};base64,${QSCI_BLACK_B64}) format('${fpb.fmt}');font-weight:${fpb.weight};font-style:normal;}` +
    `@font-face{font-family:'${fs.name}';src:url(data:font/${fs.fmt};base64,${RONZINO_B64}) format('${fs.fmt}');font-weight:${fs.weight};font-style:normal;}` +
    `@font-face{font-family:'${fi.name}';src:url(data:font/${fi.fmt};base64,${QSCI_ICON_B64}) format('${fi.fmt}');font-weight:${fi.weight};font-style:normal;}`;

  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  return Promise.all([
    document.fonts.load(`1px '${fp.name}'`),
    document.fonts.load(`1px '${fpb.name}'`),
    document.fonts.load(`1px '${fs.name}'`),
    document.fonts.load(`1px '${fi.name}'`),
  ]);
}

function getFontFaceCSS() {
  const fp  = CONFIG.fonts.primary;
  const fpb = CONFIG.fonts.primaryBlack;
  const fs  = CONFIG.fonts.secondary;
  const fi  = CONFIG.fonts.icon;
  return (
    `@font-face{font-family:'${fp.name}';src:url(data:font/${fp.fmt};base64,${QSCI_B64}) format('${fp.fmt}');font-weight:${fp.weight};font-style:normal;}` +
    `@font-face{font-family:'${fpb.name}';src:url(data:font/${fpb.fmt};base64,${QSCI_BLACK_B64}) format('${fpb.fmt}');font-weight:${fpb.weight};font-style:normal;}` +
    `@font-face{font-family:'${fs.name}';src:url(data:font/${fs.fmt};base64,${RONZINO_B64}) format('${fs.fmt}');font-weight:${fs.weight};font-style:normal;}` +
    `@font-face{font-family:'${fi.name}';src:url(data:font/${fi.fmt};base64,${QSCI_ICON_B64}) format('${fi.fmt}');font-weight:${fi.weight};font-style:normal;}`
  );
}

function blobToDataURL(blob) {
  return new Promise(resolve => {
    const r = new FileReader();
    r.onload = () => resolve(r.result);
    r.readAsDataURL(blob);
  });
}

function probeImage(src) {
  return new Promise((resolve, reject) => {
    const i = new Image();
    i.onload  = () => resolve({ width: i.naturalWidth, height: i.naturalHeight });
    i.onerror = reject;
    i.src = src;
  });
}

function preloadDefaultLogo() {
  return fetch('Logo.svg')
    .then(r => r.blob())
    .then(blob => blobToDataURL(blob))
    .then(dataURL => probeImage(dataURL).then(({ width, height }) => ({
      dataURL,
      aspectRatio: height / width,
      isDefault: true
    })))
    .catch(() => null);
}
