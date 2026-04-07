import { useEffect, useState } from "react";
import { useContext } from "react";
import { Link } from "react-router-dom";

import { AuthContext } from "../../context/authContext";
import {
  createReservation,
  getApartmentAvailability,
} from "../../services/reservationService";

function ReservationForm({ apartmentId }) {
  const { user, authReady } = useContext(AuthContext);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [unavailableRanges, setUnavailableRanges] = useState([]);
  const [availabilityLoading, setAvailabilityLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        setAvailabilityLoading(true);
        const data = await getApartmentAvailability(apartmentId);
        setUnavailableRanges(data.unavailableRanges);
      } catch (requestError) {
        console.error(requestError);
        setError("No se pudo cargar la disponibilidad.");
      } finally {
        setAvailabilityLoading(false);
      }
    };

    fetchAvailability();
  }, [apartmentId]);

  const hasOverlap = (nextStartDate, nextEndDate) => {
    const selectedStart = new Date(nextStartDate);
    const selectedEnd = new Date(nextEndDate);

    return unavailableRanges.some((range) => {
      const bookedStart = new Date(range.startDate);
      const bookedEnd = new Date(range.endDate);

      return selectedStart < bookedEnd && selectedEnd > bookedStart;
    });
  };

  const formatRange = (value) => new Date(value).toLocaleDateString("es-ES");

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setMessage("");

    if (!startDate || !endDate) {
      setError("Selecciona una fecha de inicio y una fecha de fin.");
      return;
    }

    if (new Date(startDate) >= new Date(endDate)) {
      setError("La fecha de fin debe ser posterior a la de inicio.");
      return;
    }

    if (startDate < today) {
      setError("No puedes seleccionar fechas pasadas.");
      return;
    }

    if (hasOverlap(startDate, endDate)) {
      setError("Las fechas seleccionadas no estan disponibles.");
      return;
    }

    try {
      setLoading(true);
      await createReservation({
        apartment: apartmentId,
        startDate,
        endDate,
      });
      setMessage("Reserva creada con exito.");
      setStartDate("");
      setEndDate("");
      const data = await getApartmentAvailability(apartmentId);
      setUnavailableRanges(data.unavailableRanges);
    } catch (requestError) {
      console.error(requestError);
      setError(requestError.response?.data?.message || "Error al crear la reserva.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <aside className="booking-card">
      <div className="booking-card-header">
        <p className="page-eyebrow">Reserva</p>
        <h2>Consulta fechas y envia la solicitud</h2>
      </div>

      <div className="booking-availability">
        <h3>Fechas ocupadas</h3>
        {availabilityLoading ? (
          <p>Cargando disponibilidad...</p>
        ) : unavailableRanges.length === 0 ? (
          <p>No hay fechas ocupadas por ahora.</p>
        ) : (
          <ul className="availability-list">
            {unavailableRanges.map((range) => (
              <li key={`${range.startDate}-${range.endDate}`} className="availability-item">
                <span>
                  {formatRange(range.startDate)} - {formatRange(range.endDate)}
                </span>
                <span className="neutral-pill">
                  {range.source === "block" ? "Bloqueo manual" : "Reserva"}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {!authReady ? (
        <p className="page-feedback">Comprobando sesion...</p>
      ) : !user ? (
        <div className="booking-auth-cta">
          <p className="page-feedback">
            Para reservar necesitas iniciar sesion o crear una cuenta.
          </p>
          <div className="hero-actions">
            <Link to="/login" className="site-cta site-cta-primary">
              Iniciar sesion
            </Link>
            <Link to="/register" className="site-cta site-cta-secondary">
              Crear cuenta
            </Link>
          </div>
        </div>
      ) : (
      <form className="booking-form" onSubmit={handleSubmit}>
        <label className="booking-field">
          <span>Fecha de inicio</span>
          <input
            type="date"
            value={startDate}
            min={today}
            onChange={(event) => setStartDate(event.target.value)}
          />
        </label>

        <label className="booking-field">
          <span>Fecha de fin</span>
          <input
            type="date"
            value={endDate}
            min={startDate || today}
            onChange={(event) => setEndDate(event.target.value)}
          />
        </label>

        {(message || error) && (
          <div className={error ? "page-feedback page-feedback-error" : "page-feedback page-feedback-success"}>
            {error || message}
          </div>
        )}

        <button type="submit" className="site-cta site-cta-primary booking-submit" disabled={loading}>
          {loading ? "Reservando..." : "Reservar"}
        </button>
      </form>
      )}
    </aside>
  );
}

export default ReservationForm;
