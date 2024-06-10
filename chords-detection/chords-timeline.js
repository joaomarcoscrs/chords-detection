function canvasInfo(canvasRef) {
  return {
    canvas: canvasRef,
    ctx: canvasRef.getContext('2d'),
  }
}

export function drawTimeline(canvasRef, elapsedTime, bpm) {
  const { canvas, ctx } = canvasInfo(canvasRef);

  canvas.width = window.innerWidth;
  canvas.height = 200; // Define a altura da timeline

  const ticks = elapsedTime * (bpm / 60);
  const tickSpacing = canvas.width / ticks;
  const lineY = canvas.height / 2; // Define a posição Y da linha de chão

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Desenha a linha de chão horizontal contínua
  ctx.beginPath();
  ctx.moveTo(0, lineY);
  ctx.lineTo(canvas.width, lineY);
  ctx.stroke();

  // Desenha os traços verticais em cada intervalo
  for (let i = 0; i <= ticks; i++) {
    const x = i * tickSpacing;
    ctx.beginPath();
    ctx.moveTo(x, lineY - 10); // Define a posição Y do traço vertical
    ctx.lineTo(x, lineY + 10); // Define a posição Y do traço vertical
    ctx.stroke();
  }
}
