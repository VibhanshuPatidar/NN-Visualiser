import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function NNVisualizer({ data }) {
  const layers = data?.traces?.[0]?.layers || [];
  const totalLayers = layers.length;
  const inputVec = data?.traces?.[0]?.input_ascii || [];
  const firstLayerWeights = data?.first_layer_weights || null; // [num_neurons, input_size]

  const [selectedLayer, setSelectedLayer] = useState(0);
  const [selectedNeuron, setSelectedNeuron] = useState(0);
  const [hoverValue, setHoverValue] = useState(null);
  const [hoverPos, setHoverPos] = useState({ x: 0, y: 0 });

  // Adjust selected layer if totalLayers change
  useEffect(() => {
    if (totalLayers > 0 && selectedLayer >= totalLayers) {
      setSelectedLayer(totalLayers - 1);
    }
  }, [totalLayers, selectedLayer]);

  if (totalLayers === 0)
    return <div className="p-4 text-gray-400">No data loaded</div>;

  const layer = layers[selectedLayer];

  const getColor = (val) => {
    const intensity = Math.min(Math.abs(val) / 50, 1);
    if (val > 0) return `rgba(34,197,94,${intensity})`;
    if (val < 0) return `rgba(239,68,68,${intensity})`;
    return "rgba(107,114,128,0.3)";
  };

  // Compute input contributions for first layer neurons
  let contributions = [];
  if (
    layer &&
    selectedLayer === 0 &&
    layer.type === "Linear" &&
    firstLayerWeights &&
    inputVec.length
  ) {
    const weights = firstLayerWeights[selectedNeuron] || [];
    contributions = inputVec.map(
      (val, idx) => Math.abs(weights[idx] * val)
    );
    const maxContrib = Math.max(...contributions);
    contributions = contributions.map((c) => (maxContrib ? c / maxContrib : 0));
  }

  return (
    <div className="flex flex-col space-y-6 relative">
      {/* Layer Navigation */}
      <div className="flex items-center space-x-4">
        <label className="text-sm text-gray-300">Layer:</label>
        <input
          type="number"
          min={0}
          max={totalLayers - 1}
          value={selectedLayer}
          onChange={(e) => {
            let val = Number(e.target.value);
            if (isNaN(val)) val = 0;
            val = Math.max(0, Math.min(val, totalLayers - 1));
            setSelectedLayer(val);
          }}
          className="w-20 px-2 py-1 rounded bg-gray-800 border border-gray-600 text-white"
        />
        <input
          type="range"
          min={0}
          max={totalLayers - 1}
          value={selectedLayer}
          onChange={(e) => setSelectedLayer(Number(e.target.value))}
          className="flex-1"
        />
        <span className="text-sm text-gray-400">
          {selectedLayer + 1} / {totalLayers}
        </span>
      </div>

      {/* Neuron Selection (only meaningful for first layer) */}
      {selectedLayer === 0 && layer.type === "Linear" && firstLayerWeights && (
        <div className="flex items-center space-x-4">
          <label className="text-sm text-gray-300">Neuron:</label>
          <input
            type="number"
            min={0}
            max={firstLayerWeights.length - 1}
            value={selectedNeuron}
            onChange={(e) => {
              let val = Number(e.target.value);
              if (isNaN(val)) val = 0;
              val = Math.max(0, Math.min(val, firstLayerWeights.length - 1));
              setSelectedNeuron(val);
            }}
            className="w-20 px-2 py-1 rounded bg-gray-800 border border-gray-600 text-white"
          />
          <input
            type="range"
            min={0}
            max={firstLayerWeights.length - 1}
            value={selectedNeuron}
            onChange={(e) => setSelectedNeuron(Number(e.target.value))}
            className="flex-1"
          />
          <span className="text-sm text-gray-400">
            {selectedNeuron + 1} / {firstLayerWeights.length}
          </span>
        </div>
      )}

      {/* Layer Info */}
      <div className="text-sm text-gray-300">
        {layer.type} — {layer.shape?.join(" x ")}
      </div>

      {/* Input Contribution Highlight */}
      {selectedLayer === 0 && contributions.length > 0 && (
        <div className="flex space-x-1 mt-2 flex-wrap">
          {inputVec.map((ascii, idx) => {
            const char = String.fromCharCode(ascii);
            const intensity = contributions[idx];
            return (
              <span
                key={idx}
                style={{
                  backgroundColor: `rgba(34,197,94,${intensity})`,
                  color: intensity > 0.5 ? "white" : "gray",
                  padding: "0 2px",
                  borderRadius: "2px",
                  fontFamily: "monospace",
                }}
              >
                {char}
              </span>
            );
          })}
        </div>
      )}

      {/* Heatmap */}
      <div className="overflow-auto border border-gray-700 rounded bg-gray-900 p-2 relative">
        <div
          className="inline-grid gap-1"
          style={{
            gridTemplateColumns: `repeat(${Math.min(
              20,
              layer.activations.length
            )}, 24px)`,
          }}
        >
          <AnimatePresence>
            {layer.activations.map((val, idx) => (
              <motion.div
                key={idx}
                layout
                initial={{ opacity: 0.3 }}
                animate={{ opacity: 1, backgroundColor: getColor(val) }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="w-6 h-6 rounded cursor-pointer"
                onMouseEnter={(e) => {
                  let char = "";
                  // Show character only for first layer and if input vector exists
                  // if (selectedLayer === 0 && inputVec[idx] !== undefined) {
                    char = String.fromCharCode(val.toFixed(3));
                  // }
                  setHoverValue(`${val.toFixed(3)} ${char ? `(${char})` : ""}`);
                  setHoverPos({ x: e.clientX, y: e.clientY });
                }}
                onMouseLeave={() => setHoverValue(null)}
              />
            ))}
          </AnimatePresence>
        </div>
        <p className="text-xs text-gray-400 mt-2">
          Scroll horizontally if layer is wide
        </p>

        {/* Tooltip */}
        {hoverValue && (
          <div
            style={{
              position: "fixed",
              top: hoverPos.y + 12,
              left: hoverPos.x + 12,
              backgroundColor: "rgba(55,65,81,0.9)",
              color: "white",
              padding: "2px 6px",
              borderRadius: "4px",
              fontSize: "12px",
              pointerEvents: "none",
              zIndex: 9999,
            }}
          >
            {hoverValue}
          </div>
        )}
      </div>
    </div>
  );
}
