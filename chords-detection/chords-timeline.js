function canvasInfo(canvasRef) {
  return {
    canvas: canvasRef,
    ctx: canvasRef.getContext('2d'),
  }
}

export function drawTimeline(canvasRef, elapsedTime, bpm) {
  const { canvas, ctx } = canvasInfo(canvasRef);

  canvas.width = window.innerWidth;
  const ticks = elapsedTime * (bpm / 60);
  const tickSpacing = canvas.width / ticks;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i <= ticks; i++) {
    const x = i * tickSpacing;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }
}