const express = require("express");
const app = express();
const port = 3000;
const bodyParser = require("body-parser");
const db = require("./db/db");

// Settings
app.set("view engine", "ejs");

// Middlewares
app.use("/", require("./router/router"));
app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.listen(process.env.PORT || port, () => {
  console.log("corre el servidor");
});

app.post("/registro", (req, res) => {
  let nombre = req.body.nombre;
  let documento = req.body.documento;
  let correo = req.body.correo;
  let contra = req.body.contra;

  db.query(
    `INSERT INTO usuarios(nombre_usuario, documento_usuario, correo, contraseña) VALUES (?,?,?,?)`,
    [nombre, documento, correo, contra],
    function (error) {
      if (!error) {
        return res.redirect("/login");
      } else {
        return console.log(error);
      }
    }
  );
});

app.post("/login", (req, res) => {
  let correo = req.body.correo;
  let contraseña = req.body.contraseña;

  db.query(
    `SELECT * FROM usuarios WHERE correo = ? AND contraseña= ?`,
    [correo, contraseña],
    (error, rows) => {
      if (rows.length > 0) {
        res.send("exito!");
      } else {
        console.log(error);
        return res.send("error¡");
      }
    }
  );
});








