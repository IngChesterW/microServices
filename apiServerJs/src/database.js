const mysql = require('mysql');
const {database} = require('./keys');
const pool = mysql.createPool(database);
const {promisify} = require ('util');
pool.getConnection ((err, connection) => {
    if (err) {
                if (err.code === 'PROTOCOL_CONNECTION_LOST'){
                console.error('LA CONEXION HA MORIDO  ');
                } 
                if (err.code === 'ER_CON_COUNT_ERROR'){
                    console.error('DEMASIADAS CONEXIONES ');
                } 
                if (err.code === 'ENCONNREFUSED'){
                    console.error('LA DB TE RECHAZO  ');
                }   
             }
    if(connection) connection.release();
      
});
pool.query= promisify(pool.query);
module.exports = pool;