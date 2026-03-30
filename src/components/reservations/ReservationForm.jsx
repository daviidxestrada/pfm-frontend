import { useState } from "react";
import { createReservation } from "../../services/reservationService";

function ReservationForm({ apartmentId }) {
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

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
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || "Error al crear la reserva.");
        } finally {
            setLoading(false);
        }
    };

    const today = new Date().toISOString().split("T")[0];

    return (
        <section>
            <h2>Reservar</h2>

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
