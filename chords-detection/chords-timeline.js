const LINE_SHADOW = '#AE4EF399';

function canvasInfo(canvasRef) {
  return {
    canvas: canvasRef,
    ctx: canvasRef.getContext('2d'),
  };
}

function drawTick(ctx, x, y) {
  ctx.strokeStyle = '#FFFFFF';
  ctx.shadowColor = LINE_SHADOW;
  ctx.shadowBlur = 10;
  ctx.shadowOffsetX = 4;
  ctx.shadowOffsetY = 0;

  ctx.beginPath();
  ctx.moveTo(x, y - 10);
  ctx.lineTo(x, y + 10);
  ctx.stroke();

  ctx.shadowColor = 'transparent'; // Reset shadow
}

function chordGradient(ctx, x, y) {
  const gradient = ctx.createLinearGradient(x, y - 20, x + 20, y + 20);
  gradient.addColorStop(0, '#FFFFFF');
  gradient.addColorStop(1, '#F9F9F9');

  return gradient;
}

function drawChordBackgroundShape(ctx, x, y) {
  const circleRadius = 20;

  ctx.beginPath();
  ctx.arc(x, y, circleRadius, 0, Math.PI * 2); // Draw a circle
  ctx.closePath();

  ctx.shadowColor = LINE_SHADOW;
  ctx.shadowBlur = 4;
  ctx.shadowOffsetX = 2;
  ctx.shadowOffsetY = 2;

  ctx.fill();

  ctx.shadowColor = 'transparent'; // Reset shadow
}

function drawChordText(ctx, chord, x, y) {
  const fontSize = 30;
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;

  ctx.font = `bold ${fontSize}px Arial`;
  ctx.fillStyle = '#394150';
  ctx.textAlign = 'center';

  ctx.fillText(chord, x, y + 10);
}

function drawChord(ctx, chord, x, y) {
  const gradient = chordGradient(ctx, x, y);

  // Set the gradient as the fill color
  ctx.fillStyle = gradient;

  drawChordBackgroundShape(ctx, x, y);
  drawChordText(ctx, chord, x, y);
}

function drawHorizontalLine(ctx, y) {
  ctx.strokeStyle = '#FFFFFF';
  ctx.shadowColor = LINE_SHADOW;
  ctx.shadowBlur = 10;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 4;

  ctx.beginPath();
  ctx.moveTo(0, y);
  ctx.lineTo(ctx.canvas.width, y);
  ctx.stroke();

  ctx.shadowColor = 'transparent'; // Reset shadow
}

export function drawTimeline(canvasRef, elapsedTime, bpm, chords) {
  const { canvas, ctx } = canvasInfo(canvasRef);

  canvas.width = window.innerWidth;
  canvas.height = 200;

  const ticks = elapsedTime * (bpm / 60);
  const tickSpacing = canvas.width / ticks;
  const lineY = canvas.height / 2;
  const textY = lineY - 40;

  drawHorizontalLine(ctx, lineY);

  for (let i = 1; i < ticks; i++) {
    const x = i * tickSpacing;
    drawTick(ctx, x, lineY);
    const chord = chords[i];
    if (chord) drawChord(ctx, chord, x, textY);
  }
}
