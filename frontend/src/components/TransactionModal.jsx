import React, { useState } from "react";
import api from "../api";
import "../styles/TransactionModal.css";
import TransactionForm from "./TransactionForm";

function TransactionModal({isOpen, onClose, onSuccess}) {
  
  if(!isOpen)
  {
    return null;
  }

  return (
    <div className="modalOverlay">
      <div className="modalContainer">
        <button className="modalCloseBtn" onClick={onClose}> X </button>
        <TransactionForm onSuccess={onSuccess} className="modalForm"></TransactionForm>
      </div>
    </div>
  )
}

export default TransactionModal;