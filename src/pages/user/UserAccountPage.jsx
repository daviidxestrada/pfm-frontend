import { useEffect, useState } from "react";

import { getMyReservations } from "../../services/reservationService";

const formatDate = (value) =>
  new Date(value).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

function UserAccountPage() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadReservations = async () => {
      try {
        setLoading(true);
        const data = await getMyReservations();
        setReservations(data);
      } catch (requestError) {
        console.error(requestError);
        setError("No se pudieron cargar tus reservas.");
      } finally {
        setLoading(false);
      }
    };

    loadReservations();
  }, []);

  return (
    <section className="page-stack">
      <div className="page-heading">
        <p className="page-eyebrow">Mi panel</p>
        <h1>Mis reservas</h1>
        <p className="page-lead">
          Aqui puedes consultar las reservas creadas con tu usuario.
        </p>
      </div>

      {loading ? (
        <p className="page-feedback">Cargando tus reservas...</p>
      ) : error ? (
        <p className="page-feedback page-feedback-error">{error}</p>
      ) : reservations.length === 0 ? (
        <section className="empty-card">
          <h2>Todavia no tienes reservas</h2>
          <p>Cuando reserves un apartamento desde la web apareceran aqui.</p>
        </section>
      ) : (
        <section className="user-reservation-list">
          {reservations.map((reservation) => (
            <article key={reservation._id} className="user-reservation-card">
              <div className="admin-reservation-top">
                <h2>{reservation.apartment?.title || "Apartamento no disponible"}</h2>
                <span className="price-pill">{reservation.totalPrice} EUR</span>
              </div>

              <p><strong>Ciudad:</strong> {reservation.apartment?.city || "No disponible"}</p>
              <p><strong>Entrada:</strong> {formatDate(reservation.startDate)}</p>
              <p><strong>Salida:</strong> {formatDate(reservation.endDate)}</p>
              <p><strong>Reserva creada:</strong> {formatDate(reservation.createdAt)}</p>
            </article>
          ))}
        </section>
      )}
    </section>
  );
}

export default UserAccountPage;
