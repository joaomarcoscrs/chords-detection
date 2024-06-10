function canvasInfo(canvasRef) {
  return {
    canvas: canvasRef,
    ctx: canvasRef.getContext('2d'),
  };
}

function drawTick(ctx, x, y) {
  ctx.beginPath();
  ctx.moveTo(x, y - 10);
  ctx.lineTo(x, y + 10);
  ctx.stroke();
}

function drawChord(ctx, chord, x, y) {
  ctx.font = '100 36px sans-serif';
  ctx.fillStyle = '#6D28D9';
  ctx.textAlign = 'center';
  ctx.fillText(chord, x, y);
}

function drawHorizontalLine(ctx, y) {
  ctx.beginPath();
  ctx.moveTo(0, y);
  ctx.lineTo(ctx.canvas.width, y);
  ctx.stroke();
}

export function drawTimeline(canvasRef, elapsedTime, bpm) {
  const { canvas, ctx } = canvasInfo(canvasRef);

  canvas.width = window.innerWidth;
  canvas.height = 200;

  const ticks = elapsedTime * (bpm / 60);
  const tickSpacing = canvas.width / ticks;
  const lineY = canvas.height / 2;
  const textY = lineY - 30;

  // Get chord from roboflow predictions
  const chord = 'C';

  drawHorizontalLine(ctx, lineY);

  for (let i = 1; i < ticks; i++) {
    const x = i * tickSpacing;
    drawTick(ctx, x, lineY);
    if (chord) drawChord(ctx, chord, x, textY);
  }
}
