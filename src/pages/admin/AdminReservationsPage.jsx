import { useEffect, useState } from "react";

import {
  deleteReservation,
  getReservations,
} from "../../services/reservationService";

const formatDate = (value) =>
  new Date(value).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

function AdminReservationsPage() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadReservations = async () => {
    try {
      setLoading(true);
      const data = await getReservations();
      const sortedReservations = [...data].sort(
        (firstReservation, secondReservation) =>
          new Date(secondReservation.startDate) - new Date(firstReservation.startDate)
      );
      setReservations(sortedReservations);
    } catch (err) {
      console.error(err);
      setError("No se pudieron cargar las reservas del panel.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReservations();
  }, []);

  const handleDelete = async (reservationId) => {
    const confirmed = window.confirm(
      "Se eliminara la reserva seleccionada. ¿Quieres continuar?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(reservationId);
      setError("");
      setMessage("");
      await deleteReservation(reservationId);
      setReservations((currentReservations) =>
        currentReservations.filter((reservation) => reservation._id !== reservationId)
      );
      setMessage("Reserva eliminada correctamente.");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "No se pudo eliminar la reserva.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <section className="admin-page">
      <div className="admin-page-header">
        <p className="admin-eyebrow">Modulo</p>
        <h2>Reservas</h2>
        <p>
          Gestion administrativa de reservas para revisar fechas, apartamento y
          precio total, con opcion de eliminar reservas.
        </p>
      </div>

      {(error || message) && (
        <div className={error ? "admin-feedback admin-error" : "admin-feedback admin-success"}>
          {error || message}
        </div>
      )}

      <section className="admin-list-card">
        <div className="admin-form-header">
          <h3>Reservas registradas</h3>
          <p>
            {loading
              ? "Cargando reservas..."
              : `${reservations.length} reservas disponibles en el panel.`}
          </p>
        </div>

        {loading ? (
          <p>Cargando reservas...</p>
        ) : reservations.length === 0 ? (
          <p>No hay reservas registradas todavia.</p>
        ) : (
          <div className="admin-reservation-list">
            {reservations.map((reservation) => (
              <article key={reservation._id} className="admin-reservation-item">
                <div className="admin-reservation-summary">
                  <div className="admin-reservation-top">
                    <h3>{reservation.apartment?.title || "Apartamento eliminado"}</h3>
                    <span className="admin-reservation-price">
                      {reservation.totalPrice} EUR
                    </span>
                  </div>

                  <p>
                    <strong>Ciudad:</strong>{" "}
                    {reservation.apartment?.city || "No disponible"}
                  </p>
                  <p>
                    <strong>Entrada:</strong> {formatDate(reservation.startDate)}
                  </p>
                  <p>
                    <strong>Salida:</strong> {formatDate(reservation.endDate)}
                  </p>
                  <p>
                    <strong>Creada:</strong> {formatDate(reservation.createdAt)}
                  </p>
                  <p>
                    <strong>Apartamento ID:</strong> {reservation.apartment?._id || "-"}
                  </p>
                  <p>
                    <strong>Usuario:</strong> {reservation.user || "Reserva publica sin usuario"}
                  </p>
                </div>

                <div className="admin-apartment-actions">
                  <button
                    type="button"
                    className="admin-danger-button"
                    disabled={deletingId === reservation._id}
                    onClick={() => handleDelete(reservation._id)}
                  >
                    {deletingId === reservation._id ? "Eliminando..." : "Eliminar"}
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </section>
  );
}

export default AdminReservationsPage;
