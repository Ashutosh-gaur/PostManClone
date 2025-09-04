import React, { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import PostManLogo from  "../assets/PostManLogo.webp"

export default function Postmaster() {
  const [url, setUrl] = useState("");
  const [method, setMethod] = useState("GET");
  const [jsonBody, setJsonBody] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [params, setParams] = useState([{ key: "", value: "" }]);

  // Add new param row
  const addParam = () => {
    setParams([...params, { key: "", value: "" }]);
  };

  // Update param
  const updateParam = (index, field, value) => {
    const newParams = [...params];
    newParams[index][field] = value;
    setParams(newParams);
  };

  // Build URL with params
  const buildUrl = () => {
    const queryString = params
      .filter((p) => p.key.trim() !== "")
      .map((p) => 
      {
       return  `${encodeURIComponent(p.key)}=${encodeURIComponent(p.value)}`
      }).join("&");

      console.log(queryString)

    return queryString ? `${url}?${queryString}` : url;
  };

  const handleRequest = async () => {
    if (!url) return alert("Please enter URL!");
    setLoading(true);
    setResponse("");

    try {
      const options =
        method === "POST" || method === "PUT"
          ? {
              method,
              headers: { "Content-Type": "application/json" },
              body: jsonBody || "{}",
            }
          : { method };

      const finalUrl = buildUrl();
      const res = await fetch(finalUrl, options);

      let text = await res.text();
      try {
        text = JSON.stringify(JSON.parse(text), null, 2); 
      } catch (e) {
        // Non-JSON response
      }

      setResponse(text);
    } catch (error) {
      setResponse(" Error: " + error.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center">
      <div className="text-2xl font-bold mb-6 text-green-800 flex">
        <img src={ PostManLogo } className="w-15 px-2 " alt="" />
        <h1>Postmaster</h1> 
      </div>

      {/* Input Section */}
      <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-2xl space-y-4">
        <input
          type="text"
          placeholder="Enter Base URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full p-2 border rounded-lg"
        />

        {/* Method Selector */}
        <div className="flex gap-3">
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            className="p-2 border rounded-lg"
          >
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="PUT">PUT</option>
            <option value="DELETE">DELETE</option>
          </select>

          <button
            onClick={handleRequest}
            className="bg-green-500 text-white px-4 py-2 rounded-lg shadow hover:bg-green-800 transition ease-linear"
          >
            {loading ? "⏳ Sending..." : "Send"}
          </button>
        </div>

        {/* Params Section */}
        <div className="space-y-2">
          <h2 className="font-semibold"> Query Parameters</h2>
          {params.map((param, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                placeholder="Key"
                value={param.key}
                onChange={(e) => updateParam(index, "key", e.target.value)}
                className="w-1/2 p-2 border rounded-lg"
              />
              <input
                type="text"
                placeholder="Value"
                value={param.value}
                onChange={(e) => updateParam(index, "value", e.target.value)}
                className="w-1/2 p-2 border rounded-lg"
              />
            </div>
          ))}
          <button
            onClick={addParam}
            className="bg-gray-300 px-3 py-1 rounded-lg hover:bg-gray-400"
          >
            + Add Param
          </button>
        </div>

        {/* JSON Body Section */}
        {(method === "POST" || method === "PUT") && (
          <textarea
            placeholder="Enter Request JSON"
            value={jsonBody}
            onChange={(e) => setJsonBody(e.target.value)}
            rows="5"
            className="w-full p-2 border rounded-lg font-mono"
          ></textarea>
        )}
      </div>

      {/* Response Section */}
      <div className="bg-black p-4 mt-6 rounded-lg shadow-lg w-full max-w-2xl overflow-auto h-64 text-sm">
        {response ? (
          <SyntaxHighlighter
            language="json"
            style={vscDarkPlus}
            wrapLongLines
          >
            {response}
          </SyntaxHighlighter>
        ) : (
          <p className="text-gray-400">Response will appear here...</p>
        )}
      </div>
    </div>
  );
}
