import React, { useEffect, useState } from "react";
import api from "../../services/api";

function ProductoList() {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    api.get("productos/")
      .then((res) => setProductos(res.data))
      .catch((err) => console.error("Error al cargar productos:", err));
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>Lista de Productos</h2>
      <ul>
        {productos.map((p) => (
          <li key={p.id}>
            {p.nombre} - {p.stock} - ${p.precio}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ProductoList;
