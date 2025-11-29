import React from 'react'
import '../styles/Charts.css'
import PortfolioHistoryChart from '../components/PortfolioHistoryChart';

function Charts() {
  return (
//     <div class="portfolio-form-container">
//       <form id="add-transaction-form">
//           <h3>Dodaj transakcję</h3>

//           <div class="form-group">
//               <label for="asset-ticker">Aktywo (np. Ticker)</label>
//               <input type="text" id="asset-ticker" placeholder="np. VWCE.DE"/>
//           </div>


//           <div class="form-row">
//               <div class="form-group">
//                   <label for="volume">Ilość (Wolumen)</label>
//                   <input type="number" id="volume" value="1" step="0.0001"/>
//               </div>
//               <div class="form-group">
//                   <label for="price">Cena za jednostkę</label>
//                   <input type="number" id="price" placeholder="np. 102.84" step="0.01"/>
//               </div>
//           </div>

//           <div class="form-row">
//               <div class="form-group">
//                   <label for="transaction-date">Data transakcji</label>
//                   <input type="date" id="transaction-date"/>
//               </div>
              
//           </div>
          
//           <div class="total-value-summary">
//               <label>Całkowita wartość transakcji</label>
//               <strong id="total-value">0.00 EUR</strong>
//           </div>

//           <button type="submit" id="submit-btn" class="btn-submit btn-buy">Dodaj transakcję kupna</button>
//       </form>
//   </div>
    <div>
        <PortfolioHistoryChart />
    </div>
  )
}

export default Charts