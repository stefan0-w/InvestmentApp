import { useState, useRef } from "react";
import "../styles/XtbImporter.css";
import api from "../api";
import xtbLogo from "../assets/xtb_logo.webp"
export default function Importer() {
  const [step, setStep] = useState(0); 
  const [broker, setBroker] = useState(null);
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const inputRef = useRef(null);

  const reset = () => {
    setStep(0);
    setBroker(null);
    setFile(null);
    setDragActive(false);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (["dragenter", "dragover"].includes(e.type)) setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files?.[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleImport = async () => {
    if (!file) {
      alert("Select a file before import!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      await api.post(`/api/import-${broker}/`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      alert("Import completed");
      reset();

    } catch (err) {
      console.error(err);
      alert("An error occured while importing");
    }
  };

  return (
    <div className="importer-wrapper">
      
      {/* --- STEP 0 --- */}
      {step === 0 && (
        <button className="importer-start-btn" onClick={() => setStep(1)}>
          Import transactions
        </button>
      )}

      {/* --- STEP 1: Wybór brokera --- */}
      {step === 1 && (
        <div className="importer-broker-select">
          <h4>Select your broker</h4>

          <button
            className="broker-btn"
            onClick={() => {
              setBroker("xtb");
              setStep(2);
            }}
          >
            <img src={xtbLogo} alt="XTB" className="broker-icon" />
          </button>

          <button className="importer-back-btn" onClick={reset}>
            Cancel
          </button>
        </div>
      )}

      {/* --- STEP 2: Upload pliku --- */}
      {step === 2 && (
        <div>
          <p className="importer-breadcrumb">
            Selected broker: <strong>{broker.toUpperCase()}</strong>
          </p>

          <div
            className={`xtb-dropzone ${dragActive ? "active" : ""}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => inputRef.current.click()}
          >
            <input
              ref={inputRef}
              type="file"
              accept=".xlsx"
              className="xtb-file-input"
              onChange={(e) => setFile(e.target.files[0])}
            />

            <p className="xtb-text">
              <strong>Drag .xlsx file here</strong><br />
              or click to select
            </p>

            {file && <p className="xtb-selected">Wybrano: {file.name}</p>}
          </div>

          <button className="xtb-button" onClick={handleImport}>
            Import
          </button>

          <button className="importer-back-btn" onClick={reset}>
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}
