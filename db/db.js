const mysql = require('mysql');
const conexion = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  password: '',
  user: 'root',
  database: 'crochetgonbel'
});

conexion.connect((error) => {
  if (!error) {
    console.log('conectado 7u7');
  } else {
    throw error
  }
})



module.exports = conexion;