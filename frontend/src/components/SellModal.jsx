import ReactDOM from 'react-dom'
import "../styles/TransactionModal.css";
import SellForm from "./SellForm";

function SellModal({isOpen, onClose, onSuccess, assetToSell}) {
  
  if(!isOpen)
  {
    return null;
  }

  return ReactDOM.createPortal(
    <div className="modalOverlay">
      <div className="modalContainer">
        <button className="modalCloseBtn" onClick={onClose}> X </button>
        <SellForm 
          onSuccess={onSuccess}
          assetToSell={assetToSell} 
        />
      </div>
    </div>,
    document.getElementById('modal-root')
  )
}

export default SellModal;