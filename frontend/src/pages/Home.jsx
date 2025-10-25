import { useEffect, useState, useCallback } from "react";
import TransactionForm from "../components/TransactionForm";
import api from "../api";

import {Link} from 'react-router-dom'

function Home() {
  // const [portfolios, setPortfolios] = useState([]);
  // const [loading, setLoading] = useState(true);
  // const [isModalOpen, setIsModalOpen] = useState(false);

  // const getPortfolios = useCallback(async () => {
  //   // Ustawiamy ładowanie na true przy każdym odświeżeniu
  //   setLoading(true); 
  //   try {
  //     const res = await api.get('api/portfolios/');
  //     setPortfolios(res.data);
  //   } catch (err) {
  //     console.log("błąd podczas pobierania portfeli", err);
  //   } finally {
  //     setLoading(false);
  //   }
  // }, []); // Pusta tablica oznacza, że funkcja jest tworzona tylko raz

  // // KROK 2: Użyj tej funkcji wewnątrz useEffect
  // useEffect(() => {
  //   getPortfolios(); // Wywołaj przy pierwszym renderowaniu
  // }, [getPortfolios]); // Dodaj getPortfolios do tablicy zależności

  // const handlePortfolioCreated = () => {
  //   // KROK 3: Teraz możesz jej użyć również tutaj!
  //   getPortfolios(); 
  // };

  // if(loading)
  // {
  //   return <div>Loading portfolios...</div>;
  // }



  return (
    <div>
      {/* <h1>Your portfolios</h1>
      {portfolios.length > 0 ? (
        <ul>
          {portfolios.map((p) => (
            <li key={p.id}>
              <Link to={`/portfolio/${p.id}`}>{p.name}</Link>
              <small> Created on: {new Date(p.created_at).toLocaleDateString()}</small>
            </li>
          ))}
        </ul>
      ) : (
        <p>You don't have any portfolios yet. Create one!</p>
      )}
      <button onClick={() => setIsModalOpen(true)}>Create new portfolio</button>
      <CreatePortfolioModal isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onPortfolioCreated={handlePortfolioCreated}>
      </CreatePortfolioModal> */}
    </div>
  );
}

export default Home;