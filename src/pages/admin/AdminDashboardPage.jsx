import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

function AdminDashboardPage() {
  const { user, logout } = useContext(AuthContext);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <section>
      <h1>Panel de administracion</h1>
      <p>Sesion iniciada como {user.email ?? user.name ?? "administrador"}.</p>
      <button type="button" onClick={logout}>
        Cerrar sesion
      </button>
    </section>
  );
}

export default AdminDashboardPage;
