import { useEffect, useRef } from "react";
import * as fabric from "fabric";
import type { Platform } from "../../types";

interface Props {
  imageUrl: string | null;
  platform: Platform;
  onReady: (canvas: fabric.Canvas) => void;
}

export const ThumbnailCanvas = ({ imageUrl, onReady }: Props) => {
  const canvasEl = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<fabric.Canvas | null>(null);
  const backgroundRef = useRef<fabric.Image | null>(null);

  // ----------------------------------------------------
  // 1. Initialize Canvas (NO fixed dimensions)
  // ----------------------------------------------------
  useEffect(() => {
    if (!canvasEl.current) return;

    const canvas = new fabric.Canvas(canvasEl.current, {
      backgroundColor: "#e2e8f0",
      preserveObjectStacking: true,
    });

    fabricRef.current = canvas;
    onReady(canvas);

    return () => {
      canvas.dispose();
      fabricRef.current = null;
      backgroundRef.current = null;
    };
  }, [onReady]);

  // ----------------------------------------------------
  // 2. Load Image → Resize Canvas Automatically
  // ----------------------------------------------------
  useEffect(() => {
    const canvas = fabricRef.current;
    if (!canvas || !imageUrl) return;

    fabric.Image.fromURL(imageUrl, { crossOrigin: "anonymous" })
      .then((img) => {
        const imgWidth = img.width ?? 0;
        const imgHeight = img.height ?? 0;

        if (!imgWidth || !imgHeight) return;

        // Resize canvas to image size
        canvas.setDimensions({ width: imgWidth, height: imgHeight });

        // Remove previous background
        if (backgroundRef.current) {
          canvas.remove(backgroundRef.current);
        }

        img.set({
          originX: "left",
          originY: "top",
          left: 0,
          top: 0,
          selectable: false,
          evented: false,
          name: "background",
        });

        backgroundRef.current = img;
        canvas.add(img);
        // canvas.moveTo(img, 0);
        canvas.renderAll();
      })
      .catch((err) => {
        console.error("Failed to load image onto canvas", err);
      });
  }, [imageUrl]);

  // ----------------------------------------------------
  // 3. Render
  // ----------------------------------------------------
  return (
    <div className="flex items-center justify-center bg-[#1E1F20] p-6 rounded-lg overflow-hidden">
      <canvas ref={canvasEl} className="block max-w-full max-h-full" />
    </div>
  );
};
