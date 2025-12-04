import { useState, useRef } from "react";
import "../styles/XtbImporter.css";
import api from "../api";

export default function XtbImporter() {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef(null);

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
      alert("Wybierz plik przed importem!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      await api.post("/api/import-xtb/", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      alert("Import zakończony pomyślnie");
    } catch (err) {
      console.error(err);
      alert("Wystąpił błąd podczas importu");
    }
  };

  return (
    <div className="xtb-wrapper">
      <button className="xtb-toggle" onClick={() => setOpen(!open)}>
        {open ? "Zamknij importer" : "Import z XTB"}
      </button>

      {open && (
        <div
          className={`xtb-dropzone ${dragActive ? "active" : ""}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".xlsx"
            className="xtb-file-input"
            onChange={(e) => setFile(e.target.files[0])}
          />

          <p className="xtb-text" onClick={() => inputRef.current.click()}>
            <strong>Przeciągnij tutaj plik .xlsx</strong>
            <br />
            lub kliknij, aby wybrać
          </p>

          {file && <p className="xtb-selected">Wybrano: {file.name}</p>}

          <button className="xtb-button" onClick={handleImport}>
            Importuj
          </button>
        </div>
      )}
    </div>
  );
}
