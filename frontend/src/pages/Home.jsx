import { useState } from "react";
import TransactionForm from "../components/TransactionForm";
import api from "../api";

function Home() {
const [symbol, setSymbol] = useState("");
const [price, setPrice] = useState(0);

const handleSubmit = async (e) => {
  e.preventDefault();

  try{
    const res = await api.get(`api/quote/?symbol=${symbol}`)

    setPrice(res.data);

  }
  catch(error)
  {
    console.error(error)
  }
}

  return (
    <div>
      <h1>Home</h1>
      <TransactionForm />
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Enter symbol"
        value={symbol}
        onChange={(e) => setSymbol(e.target.value)}
        ></input>
        <button type="submit">Quote</button>
      </form>
      <p value={price}>{price} $</p>
    </div>
  );
}

export default Home;