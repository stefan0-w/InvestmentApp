import React, { useState } from "react";
import api from "../api";
import "../styles/CreatePortfolioModal.css";

function CreatePortfolioModal({isOpen, onClose, onPortfolioCreated}) {
  const [name, setName] = useState("");
  
  if(!isOpen)
  {
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try{
      const res = await api.post('api/portfolios/', {name})

      onPortfolioCreated();
      onClose();
    } catch(err){
      console.error("Błąd podczas tworzenia nowego portfela: ", err)
    }


  }

  return (
    <div className="modalOverlay">
      <div className="modalContainer">
        <button className="modalCloseBtn" onClick={onClose}> X </button>
        <form onSubmit={handleSubmit} className="modalForm">
          <input placeholder="Name of the new portfolio" onChange={(e) => setName(e.target.value)}></input>
          <button type="submit">Create portfolio</button>
        </form>
      </div>
    </div>
  )
}

export default CreatePortfolioModal;