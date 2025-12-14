// databaseb.js
import sql from 'mssql'

const dbConfig = { 
    user: "miUsuario", 
    password: "miPassword", 
    database: "apointdate", 
    server: "localhost", 
    options: { encrypt : true, 
        trustServerCertificate: true } };

const poolPromise = new sql.ConnectionPool(dbConfig).connect()
    .then(pool => {
        console.log("Conectado a SQL Server usando autenticación de Windows");
        return pool;
    })
    .catch(err => {
        console.error("Error, no se pudo conectar a la base de datos:", err);
    });

export {sql, poolPromise};
