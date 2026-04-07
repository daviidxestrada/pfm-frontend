import { Link } from "react-router-dom";

function AdminDashboardPage() {
  const modules = [
    {
      title: "Apartamentos",
      description: "Gestionar el catalogo de apartamentos publicados.",
      to: "/admin/apartments",
      status: "CRUD operativo desde el panel",
    },
    {
      title: "Reservas",
      description: "Consultar y administrar las reservas registradas.",
      to: "/admin/reservations",
      status: "Solicitudes con aprobacion y denegacion",
    },
    {
      title: "Bloqueos",
      description: "Definir cierres manuales de disponibilidad por fechas.",
      to: "/admin/blocks",
      status: "Bloqueos manuales integrados en disponibilidad",
    },
  ];

  return (
    <section className="admin-page">
      <div className="admin-page-header">
        <p className="admin-eyebrow">Resumen</p>
        <h2>Panel de administracion</h2>
        <p>
          Ya existe una zona privada navegable. A partir de aqui iremos
          activando cada modulo por bloques.
        </p>
      </div>

      <div className="admin-kpis admin-kpis-compact">
        <article className="admin-kpi-card">
          <span>Autenticacion</span>
          <strong>Lista</strong>
          <p>Sesion persistente y rutas protegidas.</p>
        </article>

        <article className="admin-kpi-card">
          <span>Disponibilidad</span>
          <strong>Lista</strong>
          <p>Las reservas ya validan solapes reales.</p>
        </article>
      </div>

      <div className="admin-module-grid">
        {modules.map((module) => (
          <article key={module.title} className="admin-module-card">
            <h3>{module.title}</h3>
            <p>{module.description}</p>
            <p className="admin-module-status">{module.status}</p>
            <Link to={module.to} className="admin-module-link">
              Abrir modulo
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}

export default AdminDashboardPage;
