import { useEffect, useState } from "react";

const canvasWidth = 1080;
const canvasHeight = 1920;

export function AshesBackground() {

  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);
  const numAshes = 64;

  useEffect(() => {
    if (canvas == null) {
      return;
    }

    const context = canvas?.getContext('2d');
    if (context == null) {
      console.error('No context in canvas');
      return;
    }

    const ashes: Ash[] = [];
    for (let i = 0; i < numAshes; i++) {
      ashes.push(new Ash(context));
    }

    let isMounted = true;

    function animate() {
      if (!isMounted) return;

      context!.clearRect(0, 0, canvas!.width, canvas!.height);

      ashes.forEach(ash => {
        ash.update();
        ash.draw();
      });

      requestAnimationFrame(animate);
    }

    animate();

    return () => {
      isMounted = false;
    }
  }, [canvas]);

  return (
    <canvas width={canvasWidth} height={canvasHeight} ref={setCanvas} className="absolute top-0 left-0 z-20"></canvas>
  )
}

class Ash {
  canvasContext: CanvasRenderingContext2D;
  x = 0;
  y = 0;
  size = 0;
  speedX = 0;
  speedY = 0;
  alpha = 0;

  constructor(canvasContext: CanvasRenderingContext2D) {
    this.canvasContext = canvasContext;
    this.reset();
    this.y = Math.random() * canvasHeight;
  }

  reset() {
    this.x = Math.random() * 2 * canvasWidth - 0.5 * canvasWidth;
    this.y = canvasHeight;
    this.size = Math.random() * 4 + 4;
    this.speedX = (Math.random() + 0.2) * 1.5;
    this.speedY = Math.random() * -0.75 - 0.25;
    this.alpha = Math.random() * 0.4 + 0.2;
  }

  update() {
    this.x += this.speedX + Math.sin(performance.now() / 1000) * 0.2;
    this.y += this.speedY;
    // this.alpha -= 0.0008;
    if (this.alpha <= 0 || this.y < 0) this.reset();
  }

  draw() {
    const alpha = this.alpha * (this.y / canvasHeight + 0.4) / 1.4;
    this.canvasContext.fillStyle = `rgba(220, 161, 141, ${alpha})`;
    this.canvasContext.beginPath();
    this.canvasContext.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    this.canvasContext.fill();
  }
}
