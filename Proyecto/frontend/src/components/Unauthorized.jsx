import React from 'react';

const UnauthorizedPage = () => {
    const goBack = () => {
        window.history.back();
    };

    const styles = {
        container: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh', // Ocupa toda la altura de la ventana
            backgroundColor: '#f8f9fa', // Fondo muy claro
            color: '#343a40', // Color de texto oscuro
            textAlign: 'center',
            fontFamily: 'Arial, sans-serif',
            padding: '20px',
        },
        title: {
            fontSize: '3.5em',
            color: '#dc3545', // Rojo para error
            marginBottom: '10px',
            fontWeight: 'bold',
        },
        subtitle: {
            fontSize: '1.5em',
            marginBottom: '20px',
        },
        message: {
            fontSize: '1.1em',
            marginBottom: '30px',
            maxWidth: '600px',
        },
        button: {
            padding: '10px 20px',
            fontSize: '1em',
            color: '#ffffff', // Texto blanco
            backgroundColor: '#007bff', // Azul primario para el botón
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            transition: 'background-color 0.3s ease',
            textDecoration: 'none', // Asegura que no haya decoración de enlace
        },
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>401</h1>
            <h2 style={styles.subtitle}>Acceso No Autorizado</h2>
            <p style={styles.message}>
                Parece que no tienes los permisos necesarios para ver esta página.
                Si crees que esto es un error, por favor contacta al administrador del sistema.
            </p>
            <button
                style={styles.button}
                onClick={goBack}
                // Añadir un poco de interacción visual
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#0056b3'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#007bff'}
            >
                &larr; Volver a la página anterior
            </button>
        </div>
    );
};

export default UnauthorizedPage;