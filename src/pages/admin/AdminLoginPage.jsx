import { useState, useContext } from "react";
import { loginUser } from "../../services/authService";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";


function AdminLoginPage() {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            setLoading(true);
            const data = await loginUser({ email, password });
            login(data);
            navigate('/admin');
        } catch (err) {
            console.error(err);
            setError("Credenciales incorrectas.");
        } finally {
            setLoading(false);
        }
};

    return (
        <section>
            <h1>Login Admin</h1>
            <form onSubmit={handleSubmit}>
                <input 
                   type="email"
                   placeholder="Email"
                   value={email}
                   onChange={(e) => setEmail(e.target.value)} 
                   />

                   <input 
                     type="password"
                     placeholder="Password"
                     value={password}
                     onChange={(e) => setPassword(e.target.value)} 
                     />

                <button
                 type="submit">
                 {loading ? "Cargando..." : "Login"}
                 </button>
                </form>
            {error && <p>{error}</p>}
        </section>
    );
}

export default AdminLoginPage;
