import Form from "../components/Form"
import { Link } from "react-router-dom";

function Register() {
  return (
    <div>
      <Form route="api/user/register/" method="register"/>
      <p style={{ textAlign: 'center', marginTop: '1rem' }}>
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </div>
  );
}

export default Register