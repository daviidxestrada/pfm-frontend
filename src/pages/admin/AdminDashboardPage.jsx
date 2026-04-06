import { useContext } from "react";
import { AuthContext } from "../../context/authContext";

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
