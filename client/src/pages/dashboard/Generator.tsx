// import { useState, useEffect, useCallback } from "react";
// import { useLocation } from "react-router-dom";
// import { useAppStore } from "../../store/useAppstore";
// import { useJobStream } from "../../store/useJobStream";
// import { ThumbnailCanvas } from "../../components/editor/ThumbnailCanvas";
// import { generateThumbnail } from "../../api/client";
// import * as fabric from "fabric";
// import {
//   Download,
//   Type,
//   RefreshCw,
//   Upload,
//   Trash2,
//   Bold,
//   Italic,
//   Underline,
//   Image as ImageIcon,
//   Sparkles,
//   CheckSquare,
//   ArrowLeft,
//   Palette,
//   MousePointerClick,
// } from "lucide-react";
// import clsx from "clsx";
// import { getMockJobResult } from "../../api/mock";

// const FONTS = ["Arial", "Times New Roman", "Impact", "Verdana", "Helvetica"];

// export const Generator = () => {
//   const { state } = useLocation();
//   const { selectedPlatform, setPlatform, credits, decrementCredits } =
//     useAppStore();
//   const { startStream, status, data, progress } = useJobStream();

//   // --- INPUT STATES ---
//   const [description, setDescription] = useState(state?.prompt || "");
//   const [useStyleRef, setUseStyleRef] = useState(!!state?.styleId); // Checkbox for style
//   const [userUpload, setUserUpload] = useState<File | null>(null); // User context image

//   // --- FLOW STATES ---
//   // 1. generatedVariants: The array of 3 images returned by AI
//   // 2. selectedVariant: The single image chosen for editing
//   const [generatedVariants, setGeneratedVariants] = useState<string[]>([]);
//   const [selectedVariant, setSelectedVariant] = useState<string | null>(null);

//   // --- EDITOR STATES ---
//   const [canvasRef, setCanvasRef] = useState<fabric.Canvas | null>(null);
//   // const [activeObject, setActiveObject] = useState<fabric.Object | null>(null);
//   const [activeObject, setActiveObject] = useState<any>(null);
//   const [textProps, setTextProps] = useState({
//     fill: "#ffffff",
//     stroke: "#000000",
//     strokeWidth: 2,
//     fontFamily: "Impact",
//     fontWeight: "normal",
//     fontStyle: "normal",
//     underline: false,
//     fontSize: 60,
//   });

//   const isProcessing = status === "processing" || status === "pending";

//   // ---------------------------------------------------------------------------
//   // EFFECT: Handle Job Completion
//   // ---------------------------------------------------------------------------
//   useEffect(() => {
//     if (data?.result?.imageUrl) {
//       setGeneratedVariants(data.result.imageUrl);
//       setSelectedVariant(null); // Reset selection so user sees the 3 choices
//     }
//   }, [data]);

//   // ---------------------------------------------------------------------------
//   // ACTION: Generate
//   // ---------------------------------------------------------------------------
//   const handleAiGenerate = async () => {
//     if (!description.trim() || credits <= 0) return;

//     // In a real app, you would append 'userUpload' to FormData here
//     console.log("Generating with:", {
//       description,
//       platform: selectedPlatform,
//       useStyleRef,
//       userFile: userUpload?.name,
//     });

//     try {
//       // Clear previous
//       setGeneratedVariants([]);
//       setSelectedVariant(null);

//       const res = await generateThumbnail({
//         description,
//         platform: selectedPlatform,
//         styleReferenceId: useStyleRef ? "fav-123" : undefined,
//       });
//       // getMockJobResult("lajdf")

//       decrementCredits();
//       startStream(res.data.jobId);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   // ---------------------------------------------------------------------------
//   // ACTION: Handle File Upload
//   // ---------------------------------------------------------------------------
//   const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) {
//       setUserUpload(e.target.files[0]);
//     }
//   };

//   // ---------------------------------------------------------------------------
//   // CANVAS HELPERS (Fabric.js)
//   // ---------------------------------------------------------------------------
//   const handleAddText = () => {
//     if (!canvasRef) return;
//     const text = new fabric.IText("CLICK TO EDIT", {
//       left: 100,
//       top: 100,
//       fontFamily: textProps.fontFamily,
//       fill: textProps.fill,
//       stroke: textProps.stroke,
//       strokeWidth: textProps.strokeWidth,
//       fontSize: 80,
//       fontWeight: "bold",
//     });
//     canvasRef.add(text);
//     canvasRef.setActiveObject(text);
//   };

//   const updateUIFromSelection = useCallback(() => {
//     if (!canvasRef) return;
//     const active = canvasRef.getActiveObject();
//     setActiveObject(active);
//     if (active instanceof fabric.IText) {
//       // Sync state... (omitted for brevity, same as previous step)
//     }
//   }, [canvasRef]);

//   useEffect(() => {
//     if (!canvasRef) return;
//     canvasRef.on("selection:created", updateUIFromSelection);
//     canvasRef.on("selection:updated", updateUIFromSelection);
//     canvasRef.on("selection:cleared", () => setActiveObject(null));
//     return () => {
//       canvasRef.off("selection:created");
//       canvasRef.off("selection:updated");
//       canvasRef.off("selection:cleared");
//     };
//   }, [canvasRef, updateUIFromSelection]);

//   const modifyActiveObject = (key: string, val: any) => {
//     if (canvasRef && activeObject) {
//       activeObject.set(key, val);
//       setTextProps((prev) => ({ ...prev, [key]: val }));
//       canvasRef.requestRenderAll();
//     }
//   };

//   const handleDownload = () => {
//     if (!canvasRef) return;
//     try {
//       const link = document.createElement("a");
//       link.href = canvasRef.toDataURL({
//         format: "png",
//         quality: 1,
//         multiplier: 2,
//       });
//       link.download = `thumbnail-${Date.now()}.png`;
//       link.click();
//     } catch (e) {
//       alert("CORS Error on Download");
//     }
//   };

//   // ---------------------------------------------------------------------------
//   // RENDER
//   // ---------------------------------------------------------------------------
//   return (
//     <div className="flex h-full bg-slate-50">
//       {/* ================= LEFT PANEL: INPUTS ================= */}
//       <div className="w-[380px] bg-white border-r border-gray-200 flex flex-col h-full overflow-y-auto">
//         <div className="p-6 space-y-6">
//           <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
//             <Sparkles className="text-primary" /> Generator
//           </h2>

//           {/* 1. Prompt */}
//           <div>
//             <label className="text-sm font-bold text-gray-700 block mb-2">
//               Description
//             </label>
//             <textarea
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//               disabled={isProcessing}
//               placeholder="E.g. A futuristic robot shaking hands with a human..."
//               className="w-full h-24 p-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary resize-none"
//             />
//           </div>

//           {/* 2. Context / Upload */}
//           <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-3">
//             <div className="flex items-center justify-between">
//               <label className="text-sm font-bold text-gray-700">
//                 Context Image
//               </label>
//               <span className="text-[10px] bg-gray-200 px-2 rounded text-gray-600">
//                 Optional
//               </span>
//             </div>

//             {!userUpload ? (
//               <label className="flex flex-col items-center justify-center h-20 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
//                 <Upload size={20} className="text-gray-400 mb-1" />
//                 <span className="text-xs text-gray-500">
//                   Upload Reference (Face/Product)
//                 </span>
//                 <input
//                   type="file"
//                   className="hidden"
//                   onChange={handleFileUpload}
//                   accept="image/*"
//                 />
//               </label>
//             ) : (
//               <div className="flex items-center justify-between bg-white p-2 rounded border">
//                 <span className="text-xs truncate max-w-[200px]">
//                   {userUpload.name}
//                 </span>
//                 <button
//                   onClick={() => setUserUpload(null)}
//                   className="text-red-500 hover:text-red-700"
//                 >
//                   <Trash2 size={14} />
//                 </button>
//               </div>
//             )}
//           </div>

//           {/* 3. Style Reference Checkbox */}
//           <div
//             onClick={() => setUseStyleRef(!useStyleRef)}
//             className={clsx(
//               "flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-all",
//               useStyleRef
//                 ? "bg-purple-50 border-purple-300"
//                 : "bg-white border-gray-200 hover:border-gray-300",
//             )}
//           >
//             <div
//               className={clsx(
//                 "w-5 h-5 rounded flex items-center justify-center border",
//                 useStyleRef
//                   ? "bg-purple-600 border-purple-600"
//                   : "bg-white border-gray-400",
//               )}
//             >
//               {useStyleRef && <CheckSquare size={14} className="text-white" />}
//             </div>
//             <div>
//               <p
//                 className={clsx(
//                   "text-sm font-bold",
//                   useStyleRef ? "text-purple-900" : "text-gray-700",
//                 )}
//               >
//                 Use Favorite Style
//               </p>
//               <p className="text-xs text-gray-500">
//                 Applies consistent branding/color grading.
//               </p>
//             </div>
//           </div>

//           {/* Generate Button */}
//           <button
//             onClick={handleAiGenerate}
//             disabled={isProcessing || !description}
//             className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2 mt-4"
//           >
//             {isProcessing ? (
//               <RefreshCw className="animate-spin" />
//             ) : (
//               <Sparkles />
//             )}
//             Generate 3 Variants
//           </button>
//         </div>

//         {/* EDITOR CONTROLS (Only show if editing) */}
//         {selectedVariant && (
//           <div className="mt-auto border-t border-gray-200 p-6 bg-slate-50">
//             <div className="flex items-center justify-between mb-4">
//               <h3 className="font-bold text-gray-700 flex items-center gap-2">
//                 <Palette size={16} /> Text Editor
//               </h3>
//             </div>

//             <button
//               onClick={handleAddText}
//               className="w-full py-2 bg-white border border-gray-300 rounded mb-4 text-sm font-medium hover:bg-gray-50"
//             >
//               + Add Big Text
//             </button>

//             {/* Simple Properties */}
//             <div className="grid grid-cols-2 gap-2">
//               <div>
//                 <label className="text-xs text-gray-500 font-bold">Font</label>
//                 <select
//                   value={textProps.fontFamily}
//                   onChange={(e) =>
//                     modifyActiveObject("fontFamily", e.target.value)
//                   }
//                   className="w-full text-sm border rounded p-1"
//                 >
//                   {FONTS.map((f) => (
//                     <option key={f} value={f}>
//                       {f}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//               <div>
//                 <label className="text-xs text-gray-500 font-bold">Color</label>
//                 <div className="flex items-center gap-2 border rounded bg-white p-1">
//                   <input
//                     type="color"
//                     value={textProps.fill}
//                     onChange={(e) => modifyActiveObject("fill", e.target.value)}
//                     className="w-full h-5 cursor-pointer"
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* ================= RIGHT PANEL: VIEWPORT ================= */}
//       <div className="flex-1 relative flex flex-col h-full overflow-hidden">
//         {/* Header */}
//         <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8">
//           {selectedVariant ? (
//             <button
//               onClick={() => setSelectedVariant(null)}
//               className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
//             >
//               <ArrowLeft size={18} /> Back to Results
//             </button>
//           ) : (
//             <h2 className="font-bold text-gray-700">Generation Results</h2>
//           )}

//           {selectedVariant && (
//             <button
//               onClick={handleDownload}
//               className="bg-green-600 text-white px-4 py-2 rounded-lg font-bold text-sm shadow hover:bg-green-700 flex items-center gap-2"
//             >
//               <Download size={16} /> Export
//             </button>
//           )}
//         </div>

//         {/* MAIN CONTENT AREA */}
//         <div className="flex-1 bg-slate-100 p-8 overflow-y-auto flex items-center justify-center">
//           {/* STATE 1: LOADING */}
//           {isProcessing && (
//             <div className="text-center">
//               <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-6"></div>
//               <h2 className="text-2xl font-bold text-gray-800">
//                 Generating 3 Concepts...
//               </h2>
//               <p className="text-gray-500 mt-2">
//                 Analyzing prompt • Applying style • Rendering
//               </p>
//               <div className="w-64 h-2 bg-gray-200 rounded-full mt-6 mx-auto overflow-hidden">
//                 <div
//                   className="h-full bg-blue-600 transition-all duration-300"
//                   style={{ width: `${progress}%` }}
//                 ></div>
//               </div>
//             </div>
//           )}

//           {/* STATE 2: EMPTY START */}
//           {!isProcessing && generatedVariants.length === 0 && (
//             <div className="text-center opacity-40">
//               <ImageIcon size={64} className="mx-auto mb-4" />
//               <p className="text-xl font-medium">Enter a prompt to start</p>
//             </div>
//           )}

//           {/* STATE 3: SELECTION GRID (The "3 AI Images" View) */}
//           {!isProcessing &&
//             generatedVariants.length > 0 &&
//             !selectedVariant && (
//               <div className="w-full max-w-6xl">
//                 <div className="text-center mb-8">
//                   <h2 className="text-2xl font-bold text-gray-800">
//                     Select the best variant
//                   </h2>
//                   <p className="text-gray-500">
//                     Click an image to edit and add text
//                   </p>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                   {generatedVariants.map((imgUrl, idx) => (
//                     <div
//                       key={idx}
//                       onClick={() => setSelectedVariant(imgUrl)}
//                       className="group relative aspect-video bg-white rounded-xl shadow-md overflow-hidden cursor-pointer hover:ring-4 hover:ring-blue-500 hover:shadow-xl transition-all transform hover:-translate-y-1"
//                     >
//                       <img
//                         src={imgUrl}
//                         alt={`Variant ${idx}`}
//                         className="w-full h-full object-cover"
//                       />

//                       {/* Hover Overlay */}
//                       <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white">
//                         <MousePointerClick size={32} className="mb-2" />
//                         <span className="font-bold bg-white/20 backdrop-blur px-4 py-1 rounded-full">
//                           Select & Edit
//                         </span>
//                       </div>
//                       <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
//                         Option {idx + 1}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}

//           {/* STATE 4: CANVAS EDITOR (One Image Selected) */}
//           {selectedVariant && (
//             <div className="w-full h-full flex items-center justify-center">
//               <div className="shadow-2xl rounded-lg overflow-hidden border-8 border-white transform scale-90">
//                 <ThumbnailCanvas
//                   platform={selectedPlatform}
//                   imageUrl={selectedVariant}
//                   onReady={setCanvasRef}
//                 />
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

import { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { useAppStore } from "../../store/useAppstore";
import { useJobStream } from "../../store/useJobStream";
import { ThumbnailCanvas } from "../../components/editor/ThumbnailCanvas";
import { generateThumbnail } from "../../api/client";
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
  Image as ImageIcon,
  Sparkles,
  CheckSquare,
  ArrowLeft,
  Palette,
  MousePointerClick,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Layers,
  Square,
  Circle,
  Move,
  Sun,
  Type as TypeIcon,
} from "lucide-react";
import clsx from "clsx";

const FONTS = [
  "Impact",
  "Arial",
  "Times New Roman",
  "Verdana",
  "Courier New",
  "Helvetica",
];
const COLORS = [
  "#ffffff",
  "#000000",
  "#ef4444",
  "#facc15",
  "#3b82f6",
  "#10b981",
  "#8b5cf6",
];

export const Generator = () => {
  const { state } = useLocation();
  const { selectedPlatform, setPlatform, credits, decrementCredits } =
    useAppStore();
  const { startStream, status, data, progress } = useJobStream();

  // --- INPUT STATES ---
  const [description, setDescription] = useState(state?.prompt || "");
  const [useStyleRef, setUseStyleRef] = useState(!!state?.styleId);
  const [userUpload, setUserUpload] = useState<File | null>(null);

  // --- FLOW STATES ---
  const [generatedVariants, setGeneratedVariants] = useState<string[]>([]);
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);

  // --- EDITOR STATES ---
  const [canvasRef, setCanvasRef] = useState<fabric.Canvas | null>(null);
  const [activeObject, setActiveObject] = useState<fabric.Object | any>(null);

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
    charSpacing: 0,
    lineHeight: 1.2,
    opacity: 1,
    shadow: false,
  });

  const isProcessing = status === "processing" || status === "pending";

  // ---------------------------------------------------------------------------
  // SYNC CANVAS & UI
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (data?.result?.imageUrl) {
      setGeneratedVariants(data.result.imageUrl);
      // Automatically select the first one if not set
      if (!selectedVariant) setSelectedVariant(null);
    }
  }, [data]);

  const updateUIFromSelection = useCallback(() => {
    if (!canvasRef) return;
    const active = canvasRef.getActiveObject();
    setActiveObject(active);

    if (active) {
      setProps((prev) => ({
        ...prev,
        fill: (active.fill as string) || "#ffffff",
        opacity: active.opacity ?? 1,
        // @ts-ignore - Fabric types can be tricky
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
          stroke: (active.stroke as string) || "#000000",
          strokeWidth: active.strokeWidth || 0,
          textAlign: active.textAlign || "left",
          charSpacing: active.charSpacing || 0,
          lineHeight: active.lineHeight || 1.2,
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
    // Listen for object modification (drag/resize)
    canvasRef.on("object:modified", updateUIFromSelection);
    return () => {
      canvasRef.off("selection:created");
      canvasRef.off("selection:updated");
      canvasRef.off("selection:cleared");
      canvasRef.off("object:modified");
    };
  }, [canvasRef, updateUIFromSelection]);

  // ---------------------------------------------------------------------------
  // ACTIONS: EDITOR
  // ---------------------------------------------------------------------------

  // Generic modifier for any property
  const modify = (key: string, value: any) => {
    if (!canvasRef || !activeObject) return;

    if (key === "shadow") {
      if (value) {
        activeObject.set(
          "shadow",
          new fabric.Shadow({
            color: "black",
            blur: 15,
            offsetX: 5,
            offsetY: 5,
          }),
        );
      } else {
        activeObject.set("shadow", null);
      }
    } else {
      activeObject.set(key, value);
    }

    setProps((prev) => ({ ...prev, [key]: value }));
    canvasRef.requestRenderAll();
  };

  const addText = (text = "NEW TEXT", size = 80) => {
    if (!canvasRef) return;
    const t = new fabric.IText(text, {
      left: 100,
      top: 100,
      fontFamily: props.fontFamily,
      fill: props.fill,
      fontSize: size,
      fontWeight: "bold",
      shadow: new fabric.Shadow({
        color: "rgba(0,0,0,0.8)",
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
    let shape;
    if (type === "rect") {
      shape = new fabric.Rect({
        left: 150,
        top: 150,
        width: 200,
        height: 100,
        fill: props.fill,
      });
    } else {
      shape = new fabric.Circle({
        left: 150,
        top: 150,
        radius: 60,
        fill: props.fill,
      });
    }
    canvasRef.add(shape);
    canvasRef.setActiveObject(shape);
  };

  const layerAction = (action: "up" | "down") => {
    if (!canvasRef || !activeObject) return;
    if (action === "up") activeObject.bringToFront();
    else activeObject.sendBackwards();
    // Ensure background image stays at very back?
    // The canvas wrapper usually locks bg, but this helps organize new text vs shapes
    canvasRef.renderAll();
  };

  // ---------------------------------------------------------------------------
  // ACTIONS: API
  // ---------------------------------------------------------------------------
  const handleAiGenerate = async () => {
    if (!description.trim() || credits <= 0) return;
    try {
      setGeneratedVariants([]);
      setSelectedVariant(null);
      const res = await generateThumbnail({
        description,
        platform: selectedPlatform,
        styleReferenceId: useStyleRef ? "fav-1" : undefined,
      });
      decrementCredits();
      startStream(res.data.jobId);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDownload = () => {
    if (!canvasRef) return;
    try {
      const link = document.createElement("a");
      link.href = canvasRef.toDataURL({
        format: "png",
        quality: 1,
        multiplier: 2,
      });
      link.download = `thumbnail-${Date.now()}.png`;
      link.click();
    } catch (e) {
      alert("CORS Error: Canvas tainted.");
    }
  };

  // ---------------------------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------------------------
  return (
    <div className="flex h-full bg-slate-50 overflow-hidden">
      {/* ================= LEFT PANEL: TOOLS ================= */}
      <div className="w-[360px] bg-white border-r border-gray-200 flex flex-col h-full z-10 shadow-xl">
        {/* HEADER */}
        <div className="p-4 border-b border-gray-100 flex items-center gap-2">
          <div className="p-2 bg-blue-100 rounded-lg text-primary">
            <Palette size={20} />
          </div>
          <div>
            <h1 className="font-bold text-gray-800 leading-tight">
              Studio Editor
            </h1>
            <p className="text-[10px] text-gray-500 uppercase tracking-wider">
              Professional Mode
            </p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {/* 1. SELECTION / PROMPT MODE */}
          {!selectedVariant && (
            <div className="p-5 space-y-5">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">
                  Prompt
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={isProcessing}
                  placeholder="Describe your thumbnail..."
                  className="w-full h-32 p-3 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all resize-none"
                />
              </div>

              {/* Upload & Options */}
              <div className="grid grid-cols-2 gap-3">
                <label className="border border-dashed border-gray-300 rounded-lg p-3 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50">
                  <Upload size={16} className="text-gray-400 mb-1" />
                  <span className="text-[10px] font-bold text-gray-500">
                    Context Img
                  </span>
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => setUserUpload(e.target.files?.[0] || null)}
                  />
                </label>
                <div
                  onClick={() => setUseStyleRef(!useStyleRef)}
                  className={clsx(
                    "border rounded-lg p-3 flex flex-col items-center justify-center cursor-pointer",
                    useStyleRef
                      ? "bg-purple-50 border-purple-300"
                      : "hover:bg-gray-50 border-gray-300",
                  )}
                >
                  <Sparkles
                    size={16}
                    className={
                      useStyleRef
                        ? "text-purple-600 mb-1"
                        : "text-gray-400 mb-1"
                    }
                  />
                  <span
                    className={clsx(
                      "text-[10px] font-bold",
                      useStyleRef ? "text-purple-700" : "text-gray-500",
                    )}
                  >
                    Style Ref
                  </span>
                </div>
              </div>

              <button
                onClick={handleAiGenerate}
                disabled={isProcessing || !description}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-blue-200 hover:shadow-blue-300 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <RefreshCw className="animate-spin" />
                ) : (
                  <Sparkles />
                )}
                Generate Variants
              </button>
            </div>
          )}

          {/* 2. EDITING MODE */}
          {selectedVariant && (
            <div className="p-5 space-y-6 animate-in slide-in-from-left-4 duration-300">
              <button
                onClick={() => setSelectedVariant(null)}
                className="flex items-center gap-1 text-xs font-bold text-gray-500 hover:text-blue-600 mb-2"
              >
                <ArrowLeft size={14} /> BACK TO GENERATION
              </button>

              {/* Add Items */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => addText("HEADLINE")}
                  className="p-3 border rounded-lg hover:bg-gray-50 flex flex-col items-center gap-1"
                >
                  <TypeIcon size={20} className="text-gray-700" />
                  <span className="text-[10px] font-bold">Text</span>
                </button>
                <button
                  onClick={() => addShape("rect")}
                  className="p-3 border rounded-lg hover:bg-gray-50 flex flex-col items-center gap-1"
                >
                  <Square size={20} className="text-gray-700" />
                  <span className="text-[10px] font-bold">Rect</span>
                </button>
                <button
                  onClick={() => addShape("circle")}
                  className="p-3 border rounded-lg hover:bg-gray-50 flex flex-col items-center gap-1"
                >
                  <Circle size={20} className="text-gray-700" />
                  <span className="text-[10px] font-bold">Circle</span>
                </button>
              </div>

              {activeObject ? (
                <div className="space-y-5">
                  <div className="flex items-center justify-between border-b pb-2">
                    <span className="text-xs font-bold uppercase text-gray-400">
                      Properties
                    </span>
                    <div className="flex gap-1">
                      <button
                        onClick={() => layerAction("up")}
                        className="p-1 hover:bg-gray-100 rounded"
                        title="Bring Forward"
                      >
                        <Layers size={14} />
                      </button>
                      <button
                        onClick={() =>
                          activeObject &&
                          (canvasRef?.remove(activeObject),
                          canvasRef?.discardActiveObject())
                        }
                        className="p-1 hover:bg-red-50 text-red-500 rounded"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Color Pickers */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-500">
                      COLORS
                    </label>
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 border rounded p-1">
                          <input
                            type="color"
                            value={props.fill}
                            onChange={(e) => modify("fill", e.target.value)}
                            className="w-6 h-6 border-none bg-transparent cursor-pointer"
                          />
                          <span className="text-xs text-gray-500">Fill</span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 border rounded p-1">
                          <input
                            type="color"
                            value={props.stroke}
                            onChange={(e) => modify("stroke", e.target.value)}
                            className="w-6 h-6 border-none bg-transparent cursor-pointer"
                          />
                          <span className="text-xs text-gray-500">Stroke</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-1 overflow-x-auto pb-1">
                      {COLORS.map((c) => (
                        <button
                          key={c}
                          onClick={() => modify("fill", c)}
                          className="w-6 h-6 rounded-full border border-gray-200 flex-shrink-0"
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Text Specifics */}
                  {activeObject instanceof fabric.IText && (
                    <>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-500">
                          TYPOGRAPHY
                        </label>
                        <select
                          value={props.fontFamily}
                          onChange={(e) => modify("fontFamily", e.target.value)}
                          className="w-full text-xs border rounded p-2 bg-white"
                        >
                          {FONTS.map((f) => (
                            <option key={f} value={f}>
                              {f}
                            </option>
                          ))}
                        </select>
                        <div className="flex gap-1">
                          {[
                            {
                              icon: Bold,
                              key: "fontWeight",
                              val: "bold",
                              active: props.fontWeight === "bold",
                            },
                            {
                              icon: Italic,
                              key: "fontStyle",
                              val: "italic",
                              active: props.fontStyle === "italic",
                            },
                            {
                              icon: Underline,
                              key: "underline",
                              val: true,
                              active: props.underline,
                            },
                          ].map((btn, i) => (
                            <button
                              key={i}
                              onClick={() =>
                                modify(btn.key, btn.active ? "normal" : btn.val)
                              }
                              className={clsx(
                                "flex-1 py-2 border rounded flex justify-center",
                                btn.active
                                  ? "bg-blue-100 text-blue-600 border-blue-200"
                                  : "bg-white text-gray-600",
                              )}
                            >
                              <btn.icon size={14} />
                            </button>
                          ))}
                        </div>
                        <div className="flex gap-1">
                          {["left", "center", "right"].map((align) => (
                            <button
                              key={align}
                              onClick={() => modify("textAlign", align)}
                              className={clsx(
                                "flex-1 py-2 border rounded flex justify-center",
                                props.textAlign === align
                                  ? "bg-gray-200"
                                  : "bg-white",
                              )}
                            >
                              {align === "left" && <AlignLeft size={14} />}
                              {align === "center" && <AlignCenter size={14} />}
                              {align === "right" && <AlignRight size={14} />}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Text Highlight */}
                      <div>
                        <label className="text-[10px] font-bold text-gray-500 mb-1 block">
                          BACKGROUND HIGHLIGHT
                        </label>
                        <div className="flex gap-2 items-center">
                          <button
                            onClick={() => modify("backgroundColor", "")}
                            className="p-1 border rounded text-[10px] px-2"
                          >
                            None
                          </button>
                          <button
                            onClick={() => modify("backgroundColor", "#000000")}
                            className="w-6 h-6 bg-black border rounded"
                          ></button>
                          <button
                            onClick={() => modify("backgroundColor", "#ffffff")}
                            className="w-6 h-6 bg-white border rounded"
                          ></button>
                          <button
                            onClick={() => modify("backgroundColor", "#ef4444")}
                            className="w-6 h-6 bg-red-500 border rounded"
                          ></button>
                          <button
                            onClick={() => modify("backgroundColor", "#facc15")}
                            className="w-6 h-6 bg-yellow-400 border rounded"
                          ></button>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Opacity & Shadow */}
                  <div className="space-y-3 pt-2 border-t">
                    <div>
                      <div className="flex justify-between text-[10px] font-bold text-gray-500 mb-1">
                        <span>OPACITY</span>
                        <span>{Math.round(props.opacity * 100)}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={props.opacity}
                        onChange={(e) =>
                          modify("opacity", parseFloat(e.target.value))
                        }
                        className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={props.shadow}
                        onChange={(e) => modify("shadow", e.target.checked)}
                        className="rounded text-blue-600"
                      />
                      <span className="text-xs font-medium">Drop Shadow</span>
                    </label>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center border-2 border-dashed border-gray-200 rounded-xl">
                  <MousePointerClick
                    className="mx-auto text-gray-300 mb-2"
                    size={32}
                  />
                  <p className="text-xs text-gray-400">
                    Select an object on the canvas to customize it.
                  </p>
                </div>
              )}

              <button
                onClick={handleDownload}
                className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg shadow-sm flex items-center justify-center gap-2 transition-all mt-4"
              >
                <Download size={18} /> Export PNG
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ================= RIGHT PANEL: CANVAS & FILMSTRIP ================= */}
      <div className="flex-1 flex flex-col relative bg-slate-900">
        {/* Canvas Area */}
        <div className="flex-1 flex items-center justify-center p-8 overflow-hidden relative">
          {/* Loading State */}
          {isProcessing && (
            <div className="text-center text-white z-20">
              <div className="w-16 h-16 border-4 border-white/20 border-t-blue-500 rounded-full animate-spin mx-auto mb-6"></div>
              <h2 className="text-2xl font-bold">Creating Magic...</h2>
            </div>
          )}

          {/* Empty State */}
          {!isProcessing && generatedVariants.length === 0 && (
            <div className="text-center opacity-30 text-white">
              <Sparkles size={64} className="mx-auto mb-4" />
              <p className="text-xl font-medium">Your canvas is waiting</p>
            </div>
          )}

          {/* Canvas Container */}
          <div
            className={clsx(
              "transition-all duration-500",
              selectedVariant
                ? "scale-100 opacity-100"
                : "scale-90 opacity-0 hidden",
            )}
          >
            <div className="shadow-2xl overflow-hidden border border-gray-700">
              <ThumbnailCanvas
                platform={selectedPlatform}
                imageUrl={selectedVariant}
                onReady={setCanvasRef}
              />
            </div>
          </div>

          {/* Grid Selection (When no specific variant selected but we have results) */}
          {!selectedVariant && generatedVariants.length > 0 && (
            <div className="w-full max-w-5xl animate-in fade-in zoom-in duration-300">
              <h2 className="text-white text-2xl font-bold text-center mb-8">
                Choose a style to edit
              </h2>
              <div className="grid grid-cols-3 gap-8">
                {generatedVariants.map((img, i) => (
                  <div
                    key={i}
                    onClick={() => setSelectedVariant(img)}
                    className="group cursor-pointer relative"
                  >
                    <img
                      src={img}
                      className="rounded-xl shadow-2xl hover:scale-105 transition-transform duration-300 border-4 border-transparent hover:border-blue-500"
                    />
                    <div className="absolute -bottom-10 left-0 right-0 text-center opacity-0 group-hover:opacity-100 transition-opacity text-white font-bold">
                      Click to Edit
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* FILMSTRIP: Show other variants at bottom */}
        {selectedVariant && generatedVariants.length > 1 && (
          <div className="h-24 bg-slate-800 border-t border-slate-700 flex items-center justify-center gap-4 px-4 z-20">
            {generatedVariants.map((img, i) => (
              <div
                key={i}
                onClick={() => setSelectedVariant(img)}
                className={clsx(
                  "h-16 aspect-video rounded-md overflow-hidden cursor-pointer border-2 transition-all hover:scale-110",
                  selectedVariant === img
                    ? "border-blue-500 ring-2 ring-blue-500/50"
                    : "border-transparent opacity-50 hover:opacity-100",
                )}
              >
                <img src={img} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
