import { LayoutConfig } from "./layouts";

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function drawSprockets(ctx: CanvasRenderingContext2D, cw: number, ch: number) {
  const count = 14;
  const r = 14;
  const gap = cw / count;
  ctx.fillStyle = "#555";
  for (let i = 0; i < count; i++) {
    const cx = gap * i + gap / 2;
    ctx.beginPath();
    ctx.arc(cx, 22, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(cx, ch - 22, r, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawPolaroid(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  slot: { x: number; y: number; w: number; h: number; rotation?: number },
  filterStr: string
) {
  const rot = ((slot.rotation ?? 0) * Math.PI) / 180;
  const padL = 20;
  const padT = 20;
  const padB = 70;
  const totalW = slot.w + padL * 2;
  const totalH = slot.h + padT + padB;
  const cx = slot.x + slot.w / 2;
  const cy = slot.y + slot.h / 2;

  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(rot);

  // White polaroid card
  ctx.shadowColor = "rgba(0,0,0,0.35)";
  ctx.shadowBlur = 24;
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(-totalW / 2, -totalH / 2, totalW, totalH);
  ctx.shadowBlur = 0;

  // Photo
  ctx.filter = filterStr;
  ctx.drawImage(img, -slot.w / 2, -totalH / 2 + padT, slot.w, slot.h);
  ctx.filter = "none";

  ctx.restore();
}

function drawNeonGlow(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number,
  color: string
) {
  ctx.shadowColor = color;
  ctx.shadowBlur = 40;
  ctx.strokeStyle = color;
  ctx.lineWidth = 6;
  roundRect(ctx, x - 8, y - 8, w + 16, h + 16, 8);
  ctx.stroke();
  ctx.shadowBlur = 80;
  ctx.stroke();
  ctx.shadowBlur = 0;
}

function drawPremiumBackground(ctx: CanvasRenderingContext2D, cw: number, ch: number, baseColor: string) {
  const isLight = baseColor === "#ffffff" || baseColor === "#fdf6e3";
  
  // Base fill
  ctx.fillStyle = baseColor;
  ctx.fillRect(0, 0, cw, ch);
  
  // Subtle gradient overlay for depth
  const grad = ctx.createLinearGradient(0, 0, 0, ch);
  if (isLight) {
    grad.addColorStop(0, "rgba(255,255,255,0.9)");
    grad.addColorStop(1, "rgba(240,240,245,1)");
  } else {
    grad.addColorStop(0, "rgba(20,20,30,0.8)");
    grad.addColorStop(1, "rgba(5,5,10,1)");
  }
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, cw, ch);
}

function drawCaption(
  ctx: CanvasRenderingContext2D,
  caption: string,
  cw: number,
  ch: number,
  color = "#444"
) {
  if (!caption.trim()) return;
  ctx.fillStyle = color;
  ctx.font = "600 32px 'Outfit', 'Arial', sans-serif";
  ctx.textAlign = "center";
  (ctx as any).letterSpacing = "2px";
  ctx.fillText(caption.toUpperCase(), cw / 2, ch - 54);
  (ctx as any).letterSpacing = "0px";
}

function drawWatermark(ctx: CanvasRenderingContext2D, cw: number, ch: number, isLight: boolean) {
  ctx.save();
  const color = isLight ? "rgba(0,0,0,0.4)" : "rgba(255,255,255,0.4)";
  const lineColor = isLight ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.08)";
  
  // Draw subtle separator line
  ctx.strokeStyle = lineColor;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(40, ch - 36);
  ctx.lineTo(cw - 40, ch - 36);
  ctx.stroke();

  // Branding Footer
  ctx.fillStyle = color;
  ctx.textBaseline = "middle";
  
  ctx.textAlign = "left";
  ctx.font = "bold 13px 'Outfit', sans-serif";
  (ctx as any).letterSpacing = "4px";
  ctx.fillText("NEXTGEN STUDIO", 40, ch - 18);
  
  ctx.textAlign = "right";
  ctx.font = "13px 'Inter', sans-serif";
  (ctx as any).letterSpacing = "2px";
  ctx.fillText(new Date().toLocaleDateString('en-GB'), cw - 40, ch - 18);
  
  ctx.restore();
}

function drawDiagonalMask(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  side: "left" | "right",
  cw: number,
  ch: number,
  filterStr: string
) {
  ctx.save();
  ctx.beginPath();
  if (side === "left") {
    ctx.moveTo(0, 0);
    ctx.lineTo(cw * 0.58, 0);
    ctx.lineTo(cw * 0.42, ch);
    ctx.lineTo(0, ch);
  } else {
    ctx.moveTo(cw * 0.58, 0);
    ctx.lineTo(cw, 0);
    ctx.lineTo(cw, ch);
    ctx.lineTo(cw * 0.42, ch);
  }
  ctx.closePath();
  ctx.clip();
  ctx.filter = filterStr;
  ctx.drawImage(img, side === "left" ? 0 : cw * 0.42, 0, cw * 0.58, ch);
  ctx.filter = "none";
  ctx.restore();
}

export async function exportCanvas(
  layout: LayoutConfig,
  photos: string[],
  filterId: string,
  caption: string
): Promise<string> {
  const filterStr = filterId === "none" ? "none" : getFilterString(filterId);
  const hasCaption = caption.trim().length > 0;
  const extraBottom = hasCaption ? 100 : 60; // Always give space for footer, extra for caption

  const canvas = document.createElement("canvas");
  canvas.width = layout.canvasWidth;
  canvas.height = layout.canvasHeight + extraBottom;
  const ctx = canvas.getContext("2d")!;

  const cw = canvas.width;
  const ch = canvas.height;
  const isLight = layout.canvasBg === "#ffffff" || layout.canvasBg === "#fdf6e3";

  // Background
  drawPremiumBackground(ctx, cw, ch, layout.canvasBg);

  // Load images
  const images = await Promise.all(photos.map(p => loadImage(p)));

  // ── Sprockets (retro-film) ──────────────────────────────────────────────
  if (layout.showSprockets) {
    ctx.fillStyle = layout.canvasBg;
    ctx.fillRect(0, 0, cw, ch);
    drawSprockets(ctx, cw, ch);
  }

  // ── Diagonal layout ─────────────────────────────────────────────────────
  if (layout.isDiagonal) {
    if (images[0]) drawDiagonalMask(ctx, images[0], "left", cw, ch, filterStr);
    if (images[1]) drawDiagonalMask(ctx, images[1], "right", cw, ch, filterStr);
    // Diagonal divider line
    ctx.strokeStyle = layout.borderColor;
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(cw * 0.58, 0);
    ctx.lineTo(cw * 0.42, ch);
    ctx.stroke();
    drawCaption(ctx, caption, cw, ch, "#fff");
    drawWatermark(ctx, cw, ch, isLight);
    return canvas.toDataURL("image/jpeg", 0.95);
  }

  // ── Polaroid layout ─────────────────────────────────────────────────────
  if (layout.showPolaroidBase) {
    layout.slots.forEach((slot, i) => {
      if (images[i]) drawPolaroid(ctx, images[i], slot, filterStr);
    });
    drawCaption(ctx, caption, cw, ch);
    drawWatermark(ctx, cw, ch, isLight);
    return canvas.toDataURL("image/jpeg", 0.95);
  }

  // ── Standard layouts ────────────────────────────────────────────────────
  layout.slots.forEach((slot, i) => {
    const img = images[i];
    if (!img) return;

    ctx.save();
    
    // Draw drop shadow
    if (isLight && !layout.showSprockets) {
      ctx.shadowColor = "rgba(0, 0, 0, 0.15)";
      ctx.shadowBlur = 24;
      ctx.shadowOffsetY = 12;
    } else if (!isLight && !layout.isNeon && !layout.showSprockets) {
      ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
      ctx.shadowBlur = 30;
      ctx.shadowOffsetY = 16;
    }
    
    ctx.fillStyle = layout.canvasBg === "#ffffff" ? "#fff" : "#222";
    const radius = layout.id === "neon-single" ? 12 : 6;
    roundRect(ctx, slot.x, slot.y, slot.w, slot.h, radius);
    ctx.fill();
    
    // Disable shadow for clipping & image drawing
    ctx.shadowColor = "transparent";
    ctx.clip();
    ctx.filter = filterStr;
    // Cover-fit the image into the slot
    const imgAr = img.width / img.height;
    const slotAr = slot.w / slot.h;
    let sx = 0, sy = 0, sw = img.width, sh = img.height;
    if (imgAr > slotAr) {
      sw = img.height * slotAr;
      sx = (img.width - sw) / 2;
    } else {
      sh = img.width / slotAr;
      sy = (img.height - sh) / 2;
    }
    ctx.drawImage(img, sx, sy, sw, sh, slot.x, slot.y, slot.w, slot.h);
    ctx.filter = "none";
    ctx.restore();
  });

  // ── Neon glow ───────────────────────────────────────────────────────────
  if (layout.isNeon && layout.slots[0]) {
    const s = layout.slots[0];
    drawNeonGlow(ctx, s.x, s.y, s.w, s.h, layout.borderColor);
    // Outer frame
    ctx.strokeStyle = layout.borderColor;
    ctx.lineWidth = 2;
    ctx.strokeRect(20, 20, cw - 40, ch - 40);
  }

  // ── Caption & Watermark ──────────────────────────────────────────────────
  const captionColor = isLight ? "#333" : "#eee";
  drawCaption(ctx, caption, cw, ch, captionColor);
  drawWatermark(ctx, cw, ch, isLight);

  return canvas.toDataURL("image/jpeg", 0.95);
}

function getFilterString(id: string): string {
  const map: Record<string, string> = {
    bw:      "grayscale(100%) contrast(110%)",
    vintage: "sepia(60%) saturate(80%) brightness(90%) contrast(105%)",
    cool:    "saturate(80%) hue-rotate(180deg) brightness(105%)",
    vivid:   "saturate(200%) contrast(115%) brightness(105%)",
    fade:    "brightness(130%) saturate(60%) contrast(75%)",
    glam:    "brightness(115%) saturate(140%) contrast(95%) hue-rotate(-10deg)",
    lofi:    "contrast(145%) saturate(65%) brightness(82%)",
    dreamy:  "brightness(115%) saturate(80%) contrast(90%)",
    noir:    "grayscale(100%) contrast(160%) brightness(75%)",
    studio:  "contrast(115%) brightness(110%) saturate(120%) drop-shadow(0px 0px 4px rgba(255,255,255,0.2))",
  };
  return map[id] ?? "none";
}
