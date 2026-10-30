import react from "react"; 
export default function Barrabusqueda() {
    return (
        <div className="barra-busqueda">
            <label htmlFor="search">🔎</label>
            <input type="text" id="search" name="search" placeholder="¿Que objeto buscas?" />
        </div>
    )
}