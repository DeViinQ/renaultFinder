import { useState } from "react";

export default function ReportarPerdidos() {
    const [Perdido, setPerdido] = useState({
        nombre: "",
        imagen: "",
        descripcion: "",
        lugar: "",
        fecha: "",
    });
    const [Perdidos, setPerdidos] = useState([]);

    const handleChangeSubmit = (e) => {
        e.preventDefault();
        setPerdidos([...Perdidos, Perdido]);
        setPerdido({
            nombre: "",
            imagen: "",
            descripcion: "",
            lugar: "",
            fecha: "",
        });
    }
    
    return(
        <div className="reportar-perdidos">
            <h2>Reportar objeto perdido</h2>
            <form onSubmit={handleChangeSubmit}>
                <input type="text" name="nombre" placeholder="Nombre del objeto" value={Perdido.nombre} onChange={(e) => setPerdido({...Perdido, nombre: e.target.value})} />
                <input type="text" name="imagen" placeholder="URL de la imagen" value={Perdido.imagen} onChange={(e) => setPerdido({...Perdido, imagen: e.target.value})} />
                <input type="text" name="descripcion" placeholder="Descripción del objeto" value={Perdido.descripcion} onChange={(e) => setPerdido({...Perdido, descripcion: e.target.value})} />
                <input type="text" name="lugar" placeholder="Lugar donde se perdió" value={Perdido.lugar} onChange={(e) => setPerdido({...Perdido, lugar: e.target.value})} />
                <input type="date" name="fecha" placeholder="Fecha en que se perdió" value={Perdido.fecha} onChange={(e) => setPerdido({...Perdido, fecha: e.target.value})} />
                <button type="submit">Reportar</button>
            </form>
        </div>
    )
}