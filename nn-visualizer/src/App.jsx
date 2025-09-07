import React, { useState, useRef } from "react";
import NNVisualizer from "./components/NNVisualizer";

export default function App() {
  const [inputStr, setInputStr] = useState("hello world");
  const [layerOutputs, setLayerOutputs] = useState([]);
  const [loading, setLoading] = useState(false);
  const cacheRef = useRef(new Map());

  const fetchTrace = async (str) => {
    if (!str) return;

    if (cacheRef.current.has(str)) {
      setLayerOutputs(cacheRef.current.get(str));
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:8000/get_activations?input=${encodeURIComponent(str)}`
      );
      const data = await res.json();
      cacheRef.current.set(str, data.layers);
      setLayerOutputs(data.layers);
    } catch (e) {
      console.error(e);
      setLayerOutputs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    fetchTrace(inputStr);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      fetchTrace(inputStr);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold text-blue-400 mb-4">
        🔍 NN Activation Heatmap Visualizer
      </h1>

      <div className="flex space-x-2 mb-6">
        <input
          type="text"
          placeholder="Type input string (max 55 chars)"
          className="px-3 py-2 rounded bg-gray-800 border border-gray-600 text-white w-64"
          value={inputStr}
          onChange={(e) => setInputStr(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-500"
          onClick={handleSubmit}
        >
          Enter
        </button>
      </div>

      {loading && <p className="text-gray-400 mb-4">Fetching activations...</p>}

      <NNVisualizer
        data={{
          layers: layerOutputs.map((l) => ({ type: l.type })),
          traces: layerOutputs.length
            ? [
                {
                  input: inputStr,
                  layers: layerOutputs.map((l) => ({
                    type: l.type,
                    activations: l.activations,
                    shape: [l.activations.length],
                  })),
                },
              ]
            : [],
        }}
      />
    </div>
  );
}
