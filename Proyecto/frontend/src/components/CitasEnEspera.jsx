import React, { useEffect, useState } from "react";

export default function CitasEnEspera() {
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    fetchCitas();
  }, []);

  const fetchCitas = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:3000/api/provider/miscitas", {
        headers: { "Authorization": `Bearer ${token}` }
      });

      const data = await res.json();
      console.log("fetchCitas:", data);

      if (data.success && Array.isArray(data.data)) {
        // 1) Normalizar tipos y 2) eliminar duplicados por Appointment_id (mantener la primera aparición)
        const seen = new Map();
        const normalized = [];

        for (const item of data.data) {
          // Convertir valores esperados a números para comparaciones seguras
          const id = item.Appointment_id !== undefined ? Number(item.Appointment_id) : undefined;
          const status =
            item.Appointment_status !== undefined
              ? Number(item.Appointment_status)
              : item.status !== undefined
                ? Number(item.status)
                : 0;

          // crear nuevo objeto con campos normalizados
          const obj = {
            ...item,
            Appointment_id: id,
            Appointment_status: status
          };

          // Si ya vimos este id, saltarlo (evita filas duplicadas causadas por joins)
          if (id === undefined) {
            // si no tiene id, igual lo agregamos (raro), pero no como duplicado
            normalized.push(obj);
          } else if (!seen.has(id)) {
            seen.set(id, true);
            normalized.push(obj);
          } else {
            // duplicado: ignorar
            console.warn("Registro duplicado omitido (Appointment_id):", id);
          }
        }

        setCitas(normalized);
      } else {
        setCitas([]);
      }
    } catch (error) {
      console.error("Error cargando citas:", error);
      setCitas([]);
    } finally {
      setLoading(false);
    }
  };

  // 🔵 Cambiar estado
  const cambiarEstado = async (appointmentId, status) => {
    try {
      // Asegurar tipo numérico
      const idNum = Number(appointmentId);
      setProcessingId(idNum);

      const token = localStorage.getItem("token");

      const res = await fetch(`http://localhost:3000/api/provider/status/${idNum}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });

      const data = await res.json();
      console.log("Update:", data);

      if (res.ok && data && data.success) {
        // actualizar solo esa cita por comparación numérica
        setCitas(prev =>
          prev.map(c =>
            Number(c.Appointment_id) === idNum
              ? { ...c, Appointment_status: Number(status) }
              : c
          )
        );
      } else {
        alert("No se pudo actualizar la cita");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Ocurrió un error al actualizar.");
    } finally {
      setProcessingId(null);
    }
  };

  // 🔵 Formato fecha YYYY-MM-DD
  const formatearFecha = (fecha) => {
    if (!fecha) return "";
    // fecha viene como "2025-01-25"
    const [anio, mes, dia] = fecha.split("-");
    return `${dia}/${mes}/${anio}`;
  };

  // 🔵 Formato hora HH:mm:ss (mantengo tu lógica para appointment_time)
  const formatearHora = (fechaIso) => {
    if (!fechaIso) return "";
    const fecha = new Date(fechaIso);
    if (isNaN(fecha)) return "";
    return fecha.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  if (loading) return <p>Cargando citas...</p>;

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Citas en espera</h1>

      <table style={styles.table}>
        <thead>
          <tr>
            <th>Cliente</th>
            <th>Email</th>
            <th>Fecha</th>
            <th>Hora</th>
            <th>Servicio</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {citas.length === 0 ? (
            <tr>
              <td colSpan="6">No tienes citas.</td>
            </tr>
          ) : (
            citas.map(cita => (
              <tr key={cita.Appointment_id ?? `noid-${Math.random()}`}>
                <td>{cita.client_name}</td>
                <td>{cita.client_email}</td>
                <td>{formatearFecha(cita.appointment_date)}</td>
                <td>{formatearHora(cita.appointment_time)}</td>
                <td>{cita.title}</td>

                <td>
                  {cita.Appointment_status === 1 ? (
                    <span style={{ color: "green", fontWeight: "bold" }}>
                      Aceptada
                    </span>
                  ) : cita.Appointment_status === 2 ? (
                    <span style={{ color: "red", fontWeight: "bold" }}>
                      Rechazada
                    </span>
                  ) : (
                    <>
                      <button
                        onClick={() => cambiarEstado(cita.Appointment_id, 1)}
                        style={styles.accept}
                        disabled={processingId === Number(cita.Appointment_id)}
                      >
                        {processingId === Number(cita.Appointment_id) ? "..." : "Aceptar"}
                      </button>

                      <button
                        onClick={() => cambiarEstado(cita.Appointment_id, 2)}
                        style={styles.reject}
                        disabled={processingId === Number(cita.Appointment_id)}
                      >
                        {processingId === Number(cita.Appointment_id) ? "..." : "Rechazar"}
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

const styles = {
  container: { padding: "40px" },
  title: { fontSize: "40px", marginBottom: "20px" },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    backgroundColor: "#f0ece4",
    padding: "10px"
  },
  accept: {
    backgroundColor: "green",
    color: "white",
    padding: "6px 12px",
    marginRight: "8px",
    border: "none",
    cursor: "pointer"
  },
  reject: {
    backgroundColor: "red",
    color: "white",
    padding: "6px 12px",
    border: "none",
    cursor: "pointer"
  }
};
