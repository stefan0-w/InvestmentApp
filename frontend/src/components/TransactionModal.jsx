import React from "react";
import "../styles/TransactionModal.css";
import TransactionForm from "./TransactionForm";
import ReactDOM from 'react-dom';

function TransactionModal({isOpen, onClose, onSuccess}) {
  
  if(!isOpen)
  {
    return null;
  }

  return ReactDOM.createPortal(
    <div className="modalOverlay">
      <div className="modalContainer">
        <button className="modalCloseBtn" onClick={onClose}> X </button>
        <TransactionForm onSuccess={onSuccess}></TransactionForm>
      </div>
    </div>,
    document.getElementById('modal-root')
  )
}

export default TransactionModal;