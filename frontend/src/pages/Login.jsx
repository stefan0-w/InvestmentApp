import Form from "../components/Form"
import { Link } from "react-router-dom";

function Login() {
  return (
    <div>
      <Form route="api/token/" method="login"/>
      <p style={{ textAlign: 'center', marginTop: '1rem' }}>
          Don't have an account? <Link to="/register">Sign up</Link>
        </p>
    </div>
  );
}

export default Login