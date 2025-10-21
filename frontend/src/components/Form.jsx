import { useState } from "react"
import api from "../api"
import { useNavigate } from "react-router-dom"
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants"

function Form({ route, method }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const name = method === "login" ? "Login" : "Register";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      let res;
      if (method === "login") {
        res = await api.post(route, { username: email, password });
        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
        navigate("/");
      } else {
        if(password !== password2)
        {
          setError("Passwords do not match");
          setLoading(false);
          return;
        }
        await api.post(route, {
          email,
          password,
          first_name: firstName,
          last_name: lastName,
        });
        navigate("/login");
      }
    } catch (error) {
      // ZMIANA: Ustawiamy bardziej czytelny błąd
      const errorData = error.response?.data;
      if (errorData) {
        // Spróbuj znaleźć konkretny błąd, np. dla pola email
        const errorMessage = Object.values(errorData).flat().join(' ');
        setError(errorMessage || "Wystąpił nieznany błąd.");
      } else {
        setError(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <h1>{name}</h1>

      {method === "login" ? (
        <>
          <input
            className="form-input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />
          <input
            className="form-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
        </>
      ) : (
        <>
          <input
            className="form-input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />
          <input
            className="form-input"
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="First name"
          />
          <input
            className="form-input"
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Last name"
          />
          <input
            className="form-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
          <input
            className="form-input"
            type="password"
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
            placeholder="Confirm password"
          />

        </>
      )}

      {error && <p className="error-message">{error}</p>}

      <button className="form-button" type="submit" disabled={loading}>
        {loading ? "Loading..." : name}
      </button>
    </form>
  );
}

export default Form;
