import { useEffect, useState } from "react";
import {
    createReservation,
    getApartmentAvailability,
} from "../../services/reservationService";

function ReservationForm({ apartmentId }) {
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
            } catch (err) {
                console.error(err);
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

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setMessage("");

        if (!startDate || !endDate) {
            setError("Por favor, ingrese una fecha de inicio y una fecha de fin.");
            return;
        }

        if (new Date(startDate) >= new Date(endDate)) {
            setError("La fecha de fin debe ser posterior a la de inicio.");
            return;
        }

        if (startDate < today) {
            setError("No puedes seleccionar fechas pasadas");
            return;
        }

        if (hasOverlap(startDate, endDate)) {
            setError("Las fechas seleccionadas no están disponibles.");
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
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || "Error al crear la reserva.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section>
            <h2>Reservar</h2>

            <h3>Fechas ocupadas</h3>
            {availabilityLoading ? (
                <p>Cargando disponibilidad...</p>
            ) : unavailableRanges.length === 0 ? (
                <p>No hay fechas bloqueadas por reservas todavía.</p>
            ) : (
                <ul>
                    {unavailableRanges.map((range) => (
                        <li key={`${range.startDate}-${range.endDate}`}>
                            {formatRange(range.startDate)} - {formatRange(range.endDate)}
                            {" "}
                            {range.source === "block" ? "(bloqueo manual)" : "(reserva)"}
                        </li>
                    ))}
                </ul>
            )}

            <form onSubmit={handleSubmit}>
                <div>
                    <label>Fecha de Inicio</label>
                    <input
                        type="date"
                        value={startDate}
                        min = {today}
                        onChange={(e) => setStartDate(e.target.value)}
                    />
                </div>

                <div>
                    <label>Fecha fin</label>
                    <input
                        type="date"
                        value={endDate}
                        min = {startDate || today}
                        onChange={(e) => setEndDate(e.target.value)}
                    />
                </div>

                <button type="submit" disabled={loading}>
                    {loading ? "Reservando..." : "Reservar"}
                </button>
            </form>

            {message && <p>{message}</p>}
            {error && <p>{error}</p>}
        </section>
    );
}

export default ReservationForm;
