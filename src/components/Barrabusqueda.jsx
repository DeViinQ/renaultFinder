import react from "react"; 
export default function Barrabusqueda() {
    return (
        <div className="barra-busqueda">
            <label htmlFor="search">¿Que objeto buscas?</label>
            <input type="text" id="search" name="search" placeholder="Buscar..." />
        </div>
    )
}