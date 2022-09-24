const express = require("express");
const router = express.Router();
const conexion = require("../db/db");

router.get("/", (req, res) => {
  res.render("index");
});

router.get("/carrito", (req, res) => {
  res.render("carritoCompra");
});

router.get("/admin", (req, res) => {
  res.render("admin");
});

router.get("/insertar", (req, res) => {
  res.render("insertar");
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.get("/registro", (req, res) => {
  res.render("registro");
});

router.get("/productos", (req, res) => {
  res.render("productos");
});

router.get("/coleccion", (req, res) => {
  res.render("coleccion");
});

router.get("/usuario", (req, res) => {
  res.render("usuario");
});







module.exports = router;
