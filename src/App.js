// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;
import React, { useState, useRef } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";

export default function App() {
  const [mode, setMode] = useState("js");
  const [jsCode, setJsCode] = useState(`console.log('Hello, world!')`);
  const [htmlCode, setHtmlCode] = useState(`<h1>Hello HTML</h1>`);
  const [cssCode, setCssCode] = useState(`h1 { color: teal; }`);
  const [logs, setLogs] = useState([]);
  const previewRef = useRef();

  const run = () => {
    if (previewRef.current) {
      previewRef.current.innerHTML = `<style>${cssCode}</style>${htmlCode}`;
    }
    const printed = [];
    const origLog = console.log;
    console.log = (...args) => {
      printed.push(args.join(" "));
      setLogs([...printed]);
      origLog(...args);
    };
    try {
      // eslint-disable-next-line no-eval
      eval(jsCode);
    } catch (e) {
      printed.push(e.toString());
      setLogs([...printed]);
    }
    console.log = origLog;
  };

  return (
    <div className="container-fluid p-3">
      <h3 className="mb-3">JavaScript Playground</h3>
      <div className="row">
        <div className="col-md-6">
          <ul className="nav nav-tabs mb-2">
            <li className="nav-item">
              <button
                className={`nav-link ${mode === "js" ? "active" : ""}`}
                onClick={() => setMode("js")}
              >
                JS
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${mode === "html" ? "active" : ""}`}
                onClick={() => setMode("html")}
              >
                HTML
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${mode === "css" ? "active" : ""}`}
                onClick={() => setMode("css")}
              >
                CSS
              </button>
            </li>
          </ul>
          <CodeMirror
            value={
              mode === "js" ? jsCode : mode === "html" ? htmlCode : cssCode
            }
            extensions={[
              mode === "js" ? javascript() : mode === "html" ? html() : css(),
            ]}
            height="400px"
            onChange={(value) => {
              if (mode === "js") setJsCode(value);
              if (mode === "html") setHtmlCode(value);
              if (mode === "css") setCssCode(value);
            }}
          />
          <button className="btn btn-primary mt-2" onClick={run}>
            Run
          </button>
        </div>
        <div className="col-md-6">
          <div className="mb-3">
            <h5>Preview</h5>
            <div
              ref={previewRef}
              className="border"
              style={{ minHeight: "200px", padding: "1rem" }}
            />
          </div>
          <div>
            <h5>Console</h5>
            <div
              className="border bg-light"
              style={{ minHeight: "200px", padding: "1rem", overflowY: "auto" }}
            >
              {logs.map((line, i) => (
                <div key={i}>{line}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
