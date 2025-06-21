import React, { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import "./index.css"; // Ensure the CSS file is imported

const themes = ["light", "vs-dark"];
const layouts = ["side-by-side", "full-preview"];

const CodeEditorWithPreview = () => {
  const [html, setHtml] = useState("<h1>Hello, World!</h1>");
  const [css, setCss] = useState("h1 { color: green; }");
  const [js, setJs] = useState("console.log('Hello, World!');");
  const [srcDoc, setSrcDoc] = useState("");
  const [theme, setTheme] = useState(themes[1]);
  const [layout, setLayout] = useState(layouts[0]);
  const [shareableLink, setShareableLink] = useState("");

  useEffect(() => {
  const urlParams = new URLSearchParams(window.location.search);
  const urlHtml = urlParams.get("html");
  const urlCss = urlParams.get("css");
  const urlJs = urlParams.get("js");

  setHtml(decodeURIComponent(urlHtml || "<h1>Hello, World!</h1>"));
  setCss(decodeURIComponent(urlCss || "h1 { color: green; }"));
  setJs(decodeURIComponent(urlJs || "console.log('Hello, World!');"));
}, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSrcDoc(`
        <html>
          <head>
            <style>${css}</style>
          </head>
          <body>
            ${html}
            <script>${js}</script>
          </body>
        </html>
      `);
    }, 500);

    return () => clearTimeout(timeout);
  }, [html, css, js]);

  const generateShareableLink = () => {
    setTimeout(() => {
        const encodedHtml = encodeURIComponent(html);
        const encodedCss = encodeURIComponent(css);
        const encodedJs = encodeURIComponent(js);
        const link = `${window.location.origin}?html=${encodedHtml}&css=${encodedCss}&js=${encodedJs}`;
        setShareableLink(link);
    }, 100);
  };

  return (
    <div>
      {/* Control Panel */}
      <div className="controls">
        <div>
          <label className="mr-2">Theme:</label>
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
          >
            {themes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>

          <label className="ml-4 mr-2">Layout:</label>
          <select
            value={layout}
            onChange={(e) => setLayout(e.target.value)}
          >
            {layouts.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        </div>

        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={generateShareableLink}
        >
          Generate Shareable Link
        </button>
      </div>

      {/* Shareable Link Display */}
      {shareableLink && (
        <div className="shareable-link p-4 bg-gray-100">
          <p>
            Share this link:{" "}
            <a href={shareableLink} target="_blank" rel="noopener noreferrer">
              {shareableLink}
            </a>
          </p>
        </div>
      )}

      {/* Grid Container */}
      <div className={`grid-container ${layout}`}>
        {layout === "side-by-side" && (
          <>
            {/* Editor Section */}
            <div className="editor">
              <h2>HTML</h2>
              <Editor
                height="20vh"
                defaultLanguage="html"
                theme={theme}
                value={html}
                onChange={(value) => setHtml(value || "")}
              />
              <h2>CSS</h2>
              <Editor
                height="20vh"
                defaultLanguage="css"
                theme={theme}
                value={css}
                onChange={(value) => setCss(value || "")}
              />
              <h2>JavaScript</h2>
              <Editor
                height="20vh"
                defaultLanguage="javascript"
                theme={theme}
                value={js}
                onChange={(value) => setJs(value || "")}
              />
            </div>

            {/* Preview Section */}
            <div className="preview">
              <h2>Live Preview</h2>
              <iframe
                srcDoc={srcDoc}
                title="Live Preview"
                sandbox="allow-scripts"
                frameBorder="0"
                width="100%"
                height="100%"
              ></iframe>
            </div>
          </>
        )}

        {/* Full Preview */}
        {layout === "full-preview" && (
          <div className="preview">
            <h2>Live Preview</h2>
            <iframe
              srcDoc={srcDoc}
              title="Live Preview"
              sandbox="allow-scripts"
              frameBorder="0"
              width="100%"
              height="100%"
            ></iframe>
          </div>
        )}
      </div>
    </div>
  );
};

export default CodeEditorWithPreview;
