import { useParams } from "react-router-dom";

function ApartmentDetailPage() {
    const { id } = useParams();
    return (
        <section>
            <h1>Detalle del apartamento</h1>
            <p>ID del apartamento: {id}</p>
        </section>
    )
}

export default ApartmentDetailPage;