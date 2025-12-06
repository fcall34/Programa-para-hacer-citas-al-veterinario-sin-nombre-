import React from "react";

export default function CitasEnEspera() {
  const citas = [
    { username: "@feruve", email: "fernanda222@gmail.com" },
    { username: "@emi_garza", email: "emiliano.garza@hotmail.com" }
  ];

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Citas en espera</h1>

      <table style={styles.table}>
        <thead>
          <tr>
            <th>Username</th>
            <th>Correo</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {citas.map((cita, index) => (
            <tr key={index}>
              <td>{cita.username}</td>
              <td>{cita.email}</td>
              <td>
                <span style={styles.check}>✔</span>
                <span style={styles.cross}>✖</span>
              </td>
            </tr>
          ))}
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
    backgroundColor: "#f0ece4"
  },
  check: { color: "green", fontSize: "22px", marginRight: "10px" },
  cross: { color: "red", fontSize: "22px" }
};
