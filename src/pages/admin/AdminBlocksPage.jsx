function AdminBlocksPage() {
  return (
    <section className="admin-page">
      <div className="admin-page-header">
        <p className="admin-eyebrow">Modulo</p>
        <h2>Bloqueo manual de fechas</h2>
        <p>
          Este modulo se usara despues para bloquear rangos manualmente sin
          crear reservas reales.
        </p>
      </div>

      <div className="admin-placeholder-card">
        <strong>Estado actual</strong>
        <p>La logica de bloqueos todavia no esta implementada.</p>
      </div>
    </section>
  );
}

export default AdminBlocksPage;
