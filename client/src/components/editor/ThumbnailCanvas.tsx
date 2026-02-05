import { useEffect, useRef } from "react";
import * as fabric from "fabric"; // Assumes Fabric v6
import type { Platform } from "../../types";

interface Props {
  imageUrl: string | null;
  platform: Platform;
  onReady: (canvas: fabric.Canvas) => void;
}

// Aspect ratios/Dimensions
const DIMENSIONS = {
  youtube: { width: 1280, height: 720 },
  instagram: { width: 1080, height: 1080 },
};

export const ThumbnailCanvas = ({ imageUrl, platform, onReady }: Props) => {
  const canvasEl = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<fabric.Canvas | null>(null);

  // 1. Initialize Canvas
  useEffect(() => {
    if (!canvasEl.current) return;

    // Calculate dimensions based on platform but scale down for UI display if needed
    // For simplicity, we create the canvas at full resolution and CSS handles the display size
    const { width, height } = DIMENSIONS[platform];

    const canvas = new fabric.Canvas(canvasEl.current, {
      width,
      height,
      backgroundColor: "#e2e8f0", // Slate-200 placeholder
      preserveObjectStacking: true,
    });

    fabricRef.current = canvas;
    onReady(canvas);

    return () => {
      canvas.dispose();
      fabricRef.current = null;
    };
  }, [platform]); // Re-init if platform changes

  // 2. Load Background Image
  useEffect(() => {
    const canvas = fabricRef.current;
    if (!canvas || !imageUrl) return;

    fabric.Image.fromURL(imageUrl, { crossOrigin: "anonymous" })
      .then((img) => {
        const { width, height } = DIMENSIONS[platform];

        // Scale logic: "Cover" fit
        const scaleX = width / img.width!;
        const scaleY = height / img.height!;
        const scale = Math.max(scaleX, scaleY);

        img.set({
          originX: "center",
          originY: "center",
          left: width / 2,
          top: height / 2,
          scaleX: scale,
          scaleY: scale,
          selectable: false, // Locked
          evented: false, // Ignore clicks
        });

        // Remove old background if exists
        const oldBg = canvas
          .getObjects()
          .find((obj) => (obj as any).data?.isBackground);
        if (oldBg) canvas.remove(oldBg);

        // Tag this object so we can find it later
        img.set("data", { isBackground: true });

        // Add image and ensure it's at bottom (use sendToBack)
        canvas.add(img);
        // sendToBack moves the object to the bottom of the stack
        (canvas as any).sendToBack(img);
        canvas.renderAll();
      })
      .catch((err) => {
        console.error("Failed to load image onto canvas", err);
      });
  }, [imageUrl, platform]);

  return (
    <div className="w-full h-full flex items-center justify-center bg-slate-800 p-8 rounded-lg overflow-hidden relative">
      <div className="shadow-2xl">
        {/* We use a style transform to fit the large canvas into the UI view */}
        <canvas ref={canvasEl} className="block" />
      </div>
    </div>
  );
};
