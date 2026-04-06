import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

function AdminDashboardPage() {
  const { user, logout } = useContext(AuthContext);

  return (
    <section>
      <h1>Panel de administración</h1>
      <p>Sesión iniciada como {user.email}</p>

      <button onClick={logout}>
        Cerrar sesión
      </button>
    </section>
  );
}

export default AdminDashboardPage;
