// databaseb.js
import sql from 'mssql'

const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  server: process.env.DB_SERVER,
  port: 1433,
  options: {
    encrypt: true,
    trustServerCertificate: false
  },
  connectionTimeout: 30000,
  requestTimeout: 30000
};



const poolPromise = new sql.ConnectionPool(dbConfig).connect()
    .then(pool => {
        console.log("Conectado a SQL Server");
        return pool;
    })
    .catch(err => {
        
        console.error("Error, no se pudo conectar a la base de datos:", err);
    });

export {sql, poolPromise};
