import { useState, useEffect, useCallback, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useAppStore } from "../../store/useAppStore";
import { useJobStream } from "../../store/useJobStream";
import { ThumbnailCanvas } from "../../components/editor/ThumbnailCanvas";
import { generateThumbnail, handleMagicEdit } from "../../api/client";
import * as fabric from "fabric";
import {
  Download,
  Type,
  RefreshCw,
  Upload,
  Trash2,
  Bold,
  Italic,
  Underline,
  Sparkles,
  CheckSquare,
  ArrowLeft,
  Palette,
  Layers,
  Square,
  Circle,
  Youtube,
  Instagram,
  Wand2,
  ZoomIn,
  ZoomOut,
  MonitorPlay,
  X,
  Loader2,
} from "lucide-react";
import clsx from "clsx";

// --- CONSTANTS ---
const FONTS = [
  "Impact",
  "Arial",
  "Times New Roman",
  "Verdana",
  "Courier New",
  "Helvetica",
  "Inter",
];
const COLORS = [
  "#ffffff",
  "#000000",
  "#ef4444",
  "#facc15",
  "#3b82f6",
  "#10b981",
  "#8b5cf6",
  "#ec4899",
];
const VIBES = [
  "Cinematic",
  "Minimalist",
  "Gaming",
  "Clickbait",
  "Corporate",
  "Neon",
];

export const Generator = () => {
  const { state } = useLocation();
  const { selectedPlatform, setPlatform, credits, decrementCredits } =
    useAppStore();
  const { startStream, status, data } = useJobStream();

  // --- RESIZABLE SIDEBAR STATE ---
  const [sidebarWidth, setSidebarWidth] = useState(400);
  const [isResizing, setIsResizing] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  // --- INPUT STATES ---
  const [description, setDescription] = useState(state?.prompt || "");
  const [useStyleRef, setUseStyleRef] = useState(!!state?.styleId);
  const [userUpload, setUserUpload] = useState<File | null>(null);
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const [selectedVibe, setSelectedVibe] = useState<string | null>(null);

  // --- FLOW STATES ---
  const [generatedVariants, setGeneratedVariants] = useState<string[]>([]);
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);

  // --- EDITOR STATES ---
  const [canvasRef, setCanvasRef] = useState<fabric.Canvas | null>(null);
  const [activeObject, setActiveObject] = useState<fabric.Object | any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [zoomLevel, setZoomLevel] = useState(1);

  // --- EDIT MODE STATES ---
  const [editInstruction, setEditInstruction] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const isProcessing = status === "processing" || status === "pending";

  // --- ACTIONS ---

  const handleEditFunction = async () => {
    if (!selectedVariant || !editInstruction) return;

    // 1. Set Local Loading State
    setIsEditing(true);

    try {
      console.log("Sending Edit Request for:", selectedVariant);

      const res: any = await handleMagicEdit({
        prompt: editInstruction,
        platform: selectedPlatform,
        imageUrl: selectedVariant,
      });

      decrementCredits();

      // 2. Start Stream (Pass true for isEditMode if your hook supports it)
      startStream(res.data.jobId, true);

      setEditInstruction("");
    } catch (error) {
      console.error("Edit failed", error);
      alert("Failed to start magic edit. Check console.");
    } finally {
      setIsEditing(false); // Ensure we reset loading state
    }
  };

  const handleAiGenerate = async () => {
    if (!description.trim() || credits <= 0) return;

    // Append vibe to prompt if selected
    const finalPrompt = selectedVibe
      ? `${selectedVibe} style: ${description}`
      : description;

    try {
      setGeneratedVariants([]);
      setSelectedVariant(null);

      const res: any = await generateThumbnail({
        prompt: finalPrompt,
        platform: selectedPlatform,
        userUpload: userUpload,
        // Pass the styleId from state if available, or boolean flag
        useStyleRef: useStyleRef,
        styleId: state?.styleId,
      });

      decrementCredits();
      startStream(res.data.jobId, false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleVariantSelect = (url: string) => {
    setSelectedVariant(url);
    if (canvasRef) {
      // Only change background, don't clear canvas
      fabric.Image.fromURL(url, { crossOrigin: "anonymous" }).then((img) => {
        // Scale logic to fit canvas
        const canvasWidth = 1280;
        const canvasHeight = 720;
        const scale = Math.max(
          canvasWidth / img.width!,
          canvasHeight / img.height!,
        );

        img.set({
          originX: "center",
          originY: "center",
          left: canvasWidth / 2,
          top: canvasHeight / 2,
          scaleX: scale,
          scaleY: scale,
          selectable: false,
          evented: false,
        });

        // Remove old background if exists
        const oldBg = canvasRef
          .getObjects()
          .find((o) => (o as any).data?.type === "background");
        if (oldBg) canvasRef.remove(oldBg);

        img.set("data", { type: "background" });
        canvasRef.add(img);
        canvasRef.sendObjectToBack(img);
        canvasRef.renderAll();
      });
    }
  };

  const handleDownload = () => {
    if (!canvasRef) return;
    const link = document.createElement("a");
    link.href = canvasRef.toDataURL({
      format: "png",
      quality: 1,
      multiplier: 2, // High Res Export
    });
    link.download = `thumbnail-${Date.now()}.png`;
    link.click();
  };

  // --- CANVAS & UI STATE MANAGEMENT ---

  // Consolidated properties for UI
  const [props, setProps] = useState({
    fill: "#ffffff",
    backgroundColor: "",
    stroke: "#000000",
    strokeWidth: 0,
    fontFamily: "Impact",
    fontSize: 60,
    fontWeight: "normal",
    fontStyle: "normal",
    underline: false,
    textAlign: "left",
    opacity: 1,
    shadow: false,
  });

  // Sync Data from Stream
  useEffect(() => {
    if (data?.result?.imageUrls) {
      setGeneratedVariants(data.result.imageUrls);
      // Auto-select first variant only if we aren't already viewing one
      if (!selectedVariant && data.result.imageUrls.length > 0) {
        // Optional: setSelectedVariant(data.result.imageUrls[0]);
      }
    }
  }, [data]);

  // Update UI when selection changes on Canvas
  const updateUIFromSelection = useCallback(() => {
    if (!canvasRef) return;
    const active = canvasRef.getActiveObject();
    setActiveObject(active);

    if (active) {
      setProps((prev) => ({
        ...prev,
        fill: (active.fill as string) || "#ffffff",
        opacity: active.opacity ?? 1,
        // @ts-ignore
        backgroundColor: active.backgroundColor || "",
      }));

      if (active instanceof fabric.IText) {
        setProps((prev) => ({
          ...prev,
          fontFamily: active.fontFamily || "Arial",
          fontSize: active.fontSize || 60,
          fontWeight: (active.fontWeight as string) || "normal",
          fontStyle: (active.fontStyle as string) || "normal",
          underline: active.underline || false,
          textAlign: active.textAlign || "left",
          shadow: !!active.shadow,
        }));
      }
    }
  }, [canvasRef]);

  useEffect(() => {
    if (!canvasRef) return;
    canvasRef.on("selection:created", updateUIFromSelection);
    canvasRef.on("selection:updated", updateUIFromSelection);
    canvasRef.on("selection:cleared", () => setActiveObject(null));
    canvasRef.on("object:modified", updateUIFromSelection);
    return () => {
      canvasRef.off("selection:created");
      canvasRef.off("selection:updated");
      canvasRef.off("selection:cleared");
      canvasRef.off("object:modified");
    };
  }, [canvasRef, updateUIFromSelection]);

  // Helper: Modify Object Properties
  const modify = (key: string, value: any) => {
    if (!canvasRef || !activeObject) return;
    if (key === "shadow") {
      activeObject.set(
        "shadow",
        value
          ? new fabric.Shadow({
              color: "black",
              blur: 15,
              offsetX: 5,
              offsetY: 5,
            })
          : null,
      );
    } else {
      activeObject.set(key, value);
    }
    setProps((prev) => ({ ...prev, [key]: value }));
    canvasRef.requestRenderAll();
  };

  // Helper: Layer Ordering
  const layerAction = (action: "up" | "down") => {
    if (!canvasRef || !activeObject) return;
    action === "up"
      ? activeObject.bringToFront()
      : activeObject.sendBackwards();
    canvasRef.renderAll();
  };

  // --- FILE HANDLING ---
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUserUpload(file);
      const objectUrl = URL.createObjectURL(file);
      setUploadPreview(objectUrl);
    }
  };

  const clearUpload = (e: React.MouseEvent) => {
    e.stopPropagation();
    setUserUpload(null);
    setUploadPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // --- RESIZE HANDLERS ---
  const startResizing = useCallback(() => setIsResizing(true), []);
  const stopResizing = useCallback(() => setIsResizing(false), []);
  const resize = useCallback(
    (mouseMoveEvent: MouseEvent) => {
      if (isResizing) {
        const newWidth = mouseMoveEvent.clientX;
        if (newWidth >= 300 && newWidth <= 600) setSidebarWidth(newWidth);
      }
    },
    [isResizing],
  );

  useEffect(() => {
    window.addEventListener("mousemove", resize);
    window.addEventListener("mouseup", stopResizing);
    return () => {
      window.removeEventListener("mousemove", resize);
      window.removeEventListener("mouseup", stopResizing);
    };
  }, [resize, stopResizing]);

  // --- FABRIC HELPERS ---
  const addText = () => {
    if (!canvasRef) return;
    const t = new fabric.IText("HEADLINE", {
      left: 100,
      top: 100,
      fontFamily: "Impact",
      fill: "#ffffff",
      fontSize: 80,
      shadow: new fabric.Shadow({
        color: "black",
        blur: 10,
        offsetX: 4,
        offsetY: 4,
      }),
    });
    canvasRef.add(t);
    canvasRef.setActiveObject(t);
  };

  const addShape = (type: "rect" | "circle") => {
    if (!canvasRef) return;
    const shape =
      type === "rect"
        ? new fabric.Rect({
            left: 150,
            top: 150,
            width: 200,
            height: 100,
            fill: "#3b82f6",
          })
        : new fabric.Circle({
            left: 150,
            top: 150,
            radius: 60,
            fill: "#ef4444",
          });
    canvasRef.add(shape);
    canvasRef.setActiveObject(shape);
  };

  return (
    <div
      className={clsx(
        "flex h-full bg-[#131314] text-[#E3E3E3] font-sans overflow-hidden",
        isResizing && "select-none cursor-col-resize",
      )}
    >
      {/* ================= LEFT PANEL ================= */}
      <div
        ref={sidebarRef}
        className="flex flex-col border-r border-white/10 bg-[#1E1F20] z-20 shadow-2xl shrink-0"
        style={{ width: sidebarWidth }}
      >
        <div className="flex-1 overflow-y-hidden custom-scrollbar p-5 space-y-4">
          {/* 1. PLATFORM SELECTOR */}
          {!selectedVariant && (
            <div className="animate-in fade-in slide-in-from-left-4 duration-500">
              <label className="text-[11px] font-bold text-[#C4C7C5] uppercase tracking-wider mb-2 flex items-center gap-2">
                <MonitorPlay size={12} /> Target Platform
              </label>
              <div className="grid grid-cols-2 bg-[#131314] p-1 rounded-lg border border-white/10">
                <button
                  onClick={() => setPlatform("youtube")}
                  className={clsx(
                    "flex items-center justify-center gap-2 py-2.5 rounded-md text-sm font-medium transition-all",
                    selectedPlatform === "youtube"
                      ? "bg-[#2D2E30] text-white shadow-sm border border-white/5"
                      : "text-[#80868B] hover:text-[#E3E3E3]",
                  )}
                >
                  <Youtube
                    size={16}
                    className={
                      selectedPlatform === "youtube" ? "text-red-500" : ""
                    }
                  />
                  <span className="truncate">YouTube</span>
                </button>
                <button
                  onClick={() => setPlatform("instagram")}
                  className={clsx(
                    "flex items-center justify-center gap-2 py-2.5 rounded-md text-sm font-medium transition-all",
                    selectedPlatform === "instagram"
                      ? "bg-[#2D2E30] text-white shadow-sm border border-white/5"
                      : "text-[#80868B] hover:text-[#E3E3E3]",
                  )}
                >
                  <Instagram
                    size={16}
                    className={
                      selectedPlatform === "instagram" ? "text-pink-500" : ""
                    }
                  />
                  <span className="truncate">Instagram</span>
                </button>
              </div>
            </div>
          )}

          {/* 2. PROMPT INPUT */}
          {!selectedVariant && (
            <div className="animate-in fade-in slide-in-from-left-4 duration-500 delay-75">
              <div className="flex items-center justify-between mb-2">
                <label className="text-[11px] font-bold text-[#C4C7C5] uppercase tracking-wider">
                  Prompt
                </label>
                <button className="text-[10px] flex items-center gap-1 text-[#A8C7FA] hover:text-white transition-colors">
                  <Wand2 size={10} /> Enhance
                </button>
              </div>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isProcessing}
                placeholder={`Describe your thumbnail...`}
                className="w-full h-32 bg-[#131314] border border-white/10 rounded-lg p-4 text-sm text-[#E3E3E3] placeholder:text-white/20 focus:outline-none focus:border-[#A8C7FA] focus:ring-1 focus:ring-[#A8C7FA]/20 resize-none transition-all leading-relaxed"
              />
              <div className="mt-3 flex flex-wrap gap-2">
                {VIBES.map((vibe) => (
                  <button
                    key={vibe}
                    onClick={() =>
                      setSelectedVibe(selectedVibe === vibe ? null : vibe)
                    }
                    className={clsx(
                      "text-[10px] px-3 py-1 rounded-full border transition-all",
                      selectedVibe === vibe
                        ? "bg-[#A8C7FA] text-[#040404] border-[#A8C7FA] font-medium"
                        : "bg-transparent border-white/10 text-[#C4C7C5] hover:border-white/30",
                    )}
                  >
                    {vibe}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 3. ASSETS & REFERENCE */}
          {!selectedVariant && (
            <div className="animate-in fade-in slide-in-from-left-4 duration-500 delay-100">
              <label className="text-[11px] font-bold text-[#C4C7C5] uppercase tracking-wider mb-3 block">
                Reference Assets
              </label>
              <div className="space-y-3">
                {/* Visual Image Dropzone */}
                <div
                  className={clsx(
                    "relative group border border-dashed rounded-xl transition-all h-28 flex flex-col items-center justify-center cursor-pointer overflow-hidden",
                    uploadPreview
                      ? "border-[#A8C7FA]/50 bg-[#A8C7FA]/5"
                      : "border-white/20 hover:border-[#A8C7FA] hover:bg-[#131314]",
                  )}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {uploadPreview ? (
                    <>
                      <img
                        src={uploadPreview}
                        alt="Preview"
                        className="absolute inset-0 w-full h-full object-cover opacity-60"
                      />
                      <button
                        onClick={clearUpload}
                        className="absolute inset-0 m-auto w-8 h-8 flex items-center justify-center bg-black/60 hover:bg-red-500/80 text-white rounded-full backdrop-blur-sm z-10"
                      >
                        <X size={16} />
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="w-10 h-10 rounded-full bg-[#131314] flex items-center justify-center mb-2 group-hover:scale-110 transition-transform text-[#C4C7C5] group-hover:text-[#A8C7FA]">
                        <Upload size={18} />
                      </div>
                      <span className="text-xs text-[#C4C7C5]">
                        Click to upload face/product
                      </span>
                    </>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileUpload}
                  />
                </div>

                {/* Style Reference Toggle */}
                <div
                  onClick={() => setUseStyleRef(!useStyleRef)}
                  className={clsx(
                    "flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all",
                    useStyleRef
                      ? "bg-[#A8C7FA]/10 border-[#A8C7FA]"
                      : "bg-[#131314] border-white/10 hover:border-white/30",
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={clsx(
                        "p-2 rounded-md",
                        useStyleRef
                          ? "bg-[#A8C7FA] text-black"
                          : "bg-[#1E1F20] text-[#C4C7C5]",
                      )}
                    >
                      <Palette size={16} />
                    </div>
                    <div>
                      <div
                        className={clsx(
                          "text-xs font-medium",
                          useStyleRef ? "text-[#A8C7FA]" : "text-[#E3E3E3]",
                        )}
                      >
                        Match Visual Style
                      </div>
                      <div className="text-[10px] text-[#80868B]">
                        Uses favorite style preset
                      </div>
                    </div>
                  </div>
                  <div
                    className={clsx(
                      "w-4 h-4 rounded border flex items-center justify-center transition-colors",
                      useStyleRef
                        ? "bg-[#A8C7FA] border-[#A8C7FA]"
                        : "border-white/30",
                    )}
                  >
                    {useStyleRef && (
                      <CheckSquare size={10} className="text-black" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* GENERATE BUTTON */}
          {!selectedVariant && (
            <div className="pt-4 animate-in fade-in slide-in-from-left-4 duration-500 delay-150">
              <button
                onClick={handleAiGenerate}
                disabled={isProcessing || !description}
                className="w-full relative group overflow-hidden bg-[#A8C7FA] hover:bg-[#D3E3FD] disabled:opacity-50 disabled:cursor-not-allowed text-[#040404] font-semibold py-4 rounded-xl shadow-lg transition-all"
              >
                <div className="relative z-10 flex items-center justify-center gap-2">
                  {isProcessing ? (
                    <RefreshCw size={18} className="animate-spin" />
                  ) : (
                    <Sparkles size={18} />
                  )}
                  <span>
                    {isProcessing ? "Generating..." : "Generate Thumbnails"}
                  </span>
                </div>
              </button>
            </div>
          )}

          {/* 4. CANVAS EDIT MODE CONTROLS */}
          {selectedVariant && (
            <div className="animate-in slide-in-from-right-4 duration-300 space-y-6">
              <button
                onClick={() => setSelectedVariant(null)}
                className="flex items-center gap-2 text-xs text-[#C4C7C5] hover:text-white transition-colors"
              >
                <ArrowLeft size={14} /> Back to Generation
              </button>

              <div className="grid grid-cols-3 gap-2">
                {[
                  { icon: Type, label: "Text", action: addText },
                  {
                    icon: Square,
                    label: "Box",
                    action: () => addShape("rect"),
                  },
                  {
                    icon: Circle,
                    label: "Circle",
                    action: () => addShape("circle"),
                  },
                ].map((tool, i) => (
                  <button
                    key={i}
                    onClick={tool.action}
                    className="flex flex-col items-center justify-center gap-2 p-4 bg-[#131314] border border-white/10 rounded-lg hover:border-[#A8C7FA] hover:bg-[#1A1B1E] transition-all text-[#C4C7C5] hover:text-[#A8C7FA]"
                  >
                    <tool.icon size={20} />
                    <span className="text-[10px] font-medium">
                      {tool.label}
                    </span>
                  </button>
                ))}
              </div>

              {/* PROPERTIES / MAGIC EDIT PANEL */}
              {activeObject ? (
                <div className="bg-[#131314] rounded-xl border border-white/10 p-4 space-y-5 shadow-inner">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <span className="text-xs font-semibold text-white">
                      Edit Properties
                    </span>
                    <button
                      onClick={() =>
                        activeObject &&
                        (canvasRef?.remove(activeObject),
                        canvasRef?.discardActiveObject())
                      }
                      className="p-1.5 hover:bg-red-500/20 text-[#C4C7C5] hover:text-red-500 rounded"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  {/* ... Color/Font/Size Controls ... */}
                  <div className="flex flex-wrap gap-2">
                    {COLORS.map((c) => (
                      <button
                        key={c}
                        onClick={() => modify("fill", c)}
                        className={`w-5 h-5 rounded-full border border-white/20 hover:scale-110 transition-transform ${props.fill === c ? "ring-2 ring-white" : ""}`}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                  {/* Slider */}
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={props.opacity}
                    onChange={(e) =>
                      modify("opacity", parseFloat(e.target.value))
                    }
                    className="w-full h-1 bg-[#2D2E30] rounded-lg cursor-pointer accent-[#A8C7FA]"
                  />
                </div>
              ) : (
                // MAGIC EDIT INPUT
                <div className="h-36 flex flex-col items-center justify-center border border-dashed border-white/10 rounded-xl bg-[#131314/50] text-[#80868B] p-4">
                  <textarea
                    value={editInstruction}
                    onChange={(e) => setEditInstruction(e.target.value)}
                    disabled={isProcessing || isEditing}
                    placeholder="✨ Describe AI edit (e.g. 'Make the background purple')..."
                    className="w-full h-full bg-transparent border-none text-sm text-[#E3E3E3] placeholder:text-white/20 focus:ring-0 resize-none text-center"
                  />
                  <button
                    onClick={handleEditFunction}
                    disabled={!editInstruction || isEditing}
                    className="w-full py-2 bg-[#2D2E30] hover:bg-[#A8C7FA] hover:text-black text-white text-xs font-bold rounded-lg mt-2 transition-all flex justify-center gap-2"
                  >
                    {isEditing ? (
                      <Loader2 className="animate-spin" size={14} />
                    ) : (
                      <Wand2 size={14} />
                    )}
                    Magic Edit
                  </button>
                </div>
              )}

              <button
                onClick={handleDownload}
                className="w-full py-3 bg-[#E3E3E3] hover:bg-white text-black font-semibold rounded-lg shadow flex items-center justify-center gap-2 transition-all"
              >
                <Download size={18} /> Export Final
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ================= RESIZE HANDLE ================= */}
      <div
        onMouseDown={startResizing}
        className={clsx(
          "w-1 h-full cursor-col-resize hover:bg-[#A8C7FA] transition-colors z-30 flex flex-col justify-center items-center group",
          isResizing ? "bg-[#A8C7FA]" : "bg-transparent",
        )}
      >
        <div className="h-8 w-1 bg-white/10 rounded-full group-hover:bg-transparent transition-colors"></div>
      </div>

      {/* ================= RIGHT PANEL ================= */}
      <div className="flex-1 flex flex-col relative bg-[#131314] overflow-hidden">
        {/* CANVAS AREA */}
        <div className="flex-1 flex items-center justify-center p-10 overflow-hidden relative">
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          ></div>

          {isProcessing ? (
            <div className="text-center z-10">
              <div className="relative w-24 h-24 mx-auto mb-6">
                <div className="absolute inset-0 border-4 border-white/5 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-[#A8C7FA] border-t-transparent rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Sparkles
                    className="text-[#A8C7FA] animate-pulse"
                    size={32}
                  />
                </div>
              </div>
              <h2 className="text-xl font-medium text-white mb-2">
                Generating Assets
              </h2>
              <p className="text-sm text-[#80868B]">
                AI is analyzing your prompt and reference...
              </p>
            </div>
          ) : generatedVariants.length === 0 ? (
            <div className="text-center max-w-md">
              <div className="w-20 h-20 bg-[#1E1F20] rounded-2xl border border-white/5 flex items-center justify-center mx-auto mb-6 shadow-2xl">
                <Palette size={32} className="text-[#80868B]" />
              </div>
              <h2 className="text-xl font-medium text-[#E3E3E3] mb-2">
                Ready to Design
              </h2>
              <p className="text-sm text-[#80868B]">
                Configure your platform and prompt on the left.
              </p>
            </div>
          ) : (
            // CANVAS
            <>
              <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1 bg-[#1E1F20] border border-white/10 rounded-lg p-1 shadow-2xl">
                <button
                  className="p-2 text-[#C4C7C5] hover:text-white rounded"
                  onClick={() => setZoomLevel((z) => Math.max(z - 0.1, 0.2))}
                >
                  <ZoomOut size={16} />
                </button>
                <span className="text-xs text-[#80868B] font-mono px-2">
                  {Math.round(zoomLevel * 100)}%
                </span>
                <button
                  className="p-2 text-[#C4C7C5] hover:text-white rounded"
                  onClick={() => setZoomLevel((z) => Math.min(z + 0.1, 2))}
                >
                  <ZoomIn size={16} />
                </button>
              </div>
              <div
                className={clsx(
                  "relative shadow-2xl transition-all duration-500",
                  selectedVariant
                    ? "scale-100 opacity-100"
                    : "scale-95 opacity-0 hidden",
                )}
              >
                <div
                  className="border border-white/10 rounded-sm overflow-hidden ring-1 ring-white/5 "
                  style={{
                    transform: `scale(${zoomLevel})`,
                    willChange: "transform",
                  }}
                >
                  <ThumbnailCanvas
                    platform={selectedPlatform}
                    imageUrl={selectedVariant}
                    onReady={setCanvasRef}
                  />
                </div>
              </div>
            </>
          )}

          {/* GRID SELECTION (If generated but not editing) */}
          {!selectedVariant &&
            generatedVariants.length > 0 &&
            !isProcessing && (
              <div className="absolute inset-0 z-10 p-12 py-4 flex flex-col items-center overflow-auto custom-scrollbar ">
                <div className="max-w-5xl w-full">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {generatedVariants.map((img, i) => (
                      <div
                        key={i}
                        onClick={() => {
                          setSelectedVariant(img);
                        }}
                        className="group cursor-pointer relative bg-[#1E1F20] rounded-xl overflow-hidden border border-white/10 hover:border-[#A8C7FA] transition-all hover:-translate-y-1"
                      >
                        {/* object-cover aspect-video */}
                        <img
                          src={img}
                          className="w-full h-full "
                          alt={`Variant ${i}`}
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button className="bg-white text-black px-6 py-2 rounded-full text-xs font-bold">
                            Customize
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
        </div>

        {/* FILMSTRIP */}
        {selectedVariant && generatedVariants.length > 1 && (
          <div className="h-auto bg-[#1E1F20] border-t border-white/10 flex items-center justify-center gap-4 p-6 py-3 z-20 shrink-0 ">
            {generatedVariants.map((img, i) => (
              <div
                key={i}
                onClick={() => {
                  setSelectedVariant(img);
                  handleVariantSelect(img);
                }}
                className={clsx(
                  "h-14 rounded-md overflow-hidden cursor-pointer transition-all border-2",
                  selectedVariant === img
                    ? "border-[#A8C7FA] opacity-100 scale-105"
                    : "border-transparent opacity-40 hover:opacity-100",
                )}
              >
                <img
                  src={img}
                  className="w-full h-full object-cover aspect-video"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
