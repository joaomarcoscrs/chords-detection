function canvasInfo(canvasRef) {
  return {
    canvas: canvasRef,
    ctx: canvasRef.getContext('2d'),
  };
}

function drawTick(ctx, x, y) {
  ctx.strokeStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.moveTo(x, y - 10);
  ctx.lineTo(x, y + 10);
  ctx.stroke();
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
  ctx.arc(x, y, circleRadius, 0, Math.PI * 2); // Desenha um círculo
  ctx.closePath();

  ctx.shadowColor = '#00000033';
  ctx.shadowBlur = 2;
  ctx.shadowOffsetX = 1;
  ctx.shadowOffsetY = 1;

  ctx.fill();
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

  // Define o gradiente como a cor de preenchimento
  ctx.fillStyle = gradient;

  drawChordBackgroundShape(ctx, x, y);
  drawChordText(ctx, chord, x, y);
}

function drawHorizontalLine(ctx, y) {
  ctx.strokeStyle = '#FFFFFF';
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
  const textY = lineY - 40;

  // Simulação de um acorde obtido de previsões
  const chord = 'C';

  drawHorizontalLine(ctx, lineY);

  for (let i = 1; i < ticks; i++) {
    const x = i * tickSpacing;
    drawTick(ctx, x, lineY);
    if (chord) drawChord(ctx, chord, x, textY);
  }
}
