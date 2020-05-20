/* Requiere Kekule.js, composer.js y scripts.js */

// Campos
var num = document.getElementById("num-proyecto");
var nombreProyecto = document.getElementById("nombre-proyecto");
var fecha = document.getElementById("fecha");
var responsable = document.getElementById("responsable");
var descripcion = document.getElementById("descripcion");
var tipo = document.getElementById("tipo-proyecto");
var cas = document.getElementById("cas");
var pm = document.getElementById("pm");
var smiles = document.getElementById("smiles");
var bodyTablaEnsayos = document.getElementById("body-tabla-ensayos");
var linkEditar = document.getElementById("editar");

// config
var header = new Headers({
  "Access-Control-Allow-Origin": "*",
  "Content-Type": "application/json",
});

// Funciones

function cargarListaReportes(data) {
  var filas = generarFilasTabla(data);
  bodyTablaEnsayos.innerHTML = filas;
}

function generarFilasTabla(data) {
  var filas = "";
  for (var i = 0; i < data.length; i++) {
    filas +=
      "<tr>" +
      "<td>" +
      "<a href='reporte-editar.html?_id=" +
      data[i]._id +
      "'>" +
      data[i].encabezado.numReporte +
      "</a></td>" +
      "<td>" +
      data[i].encabezado.via +
      "</td>" +
      "<td>" +
      data[i].encabezado.etapa +
      "</td>" +
      "<td>" +
      data[i].objetivo +
      "</td>" +
      "<td>" +
      data[i].resultados.rendimiento +
      "</td>" +
      "<td>" +
      data[i].conclusiones +
      "</td>" +
      "</tr>";
  }
  return filas;
}

function mostrarInfoProyecto(data) {
  fecha.innerHTML = data.fecha;
  num.innerHTML = data.num;
  nombreProyecto.innerHTML = data.nombreProyecto;
  responsable.innerHTML = data.responsable;
  descripcion.innerHTML = data.descripcion;
  tipo.innerHTML = data.tipo;
  cas.innerHTML = data.cas;
  pm.innerHTML = data.pm + " g/mol";
  smiles.innerHTML = data.smiles;
  var molJson = data.kekule;
  var mol = Kekule.IO.loadFormatData(molJson, "Kekule-JSON");
  painterMolecule2D(mol);
}

function setearEditar(numParam) {
  linkEditar.setAttribute("href", "./proyecto-nuevo.html?num=" + numParam);
}

function cargarProyecto() {
  var numParam = leerParamDeUrl("num");
  setearEditar(numParam);
  var miInit = {
    method: "GET",
    headers: header,
    mode: "cors",
  };
  fetch("http:\\localhost:5000/api/proyecto/" + numParam, miInit)
    .then(function (res) {
      return res.json();
    })
    .then(function (rawData) {
      let data = cleanData(rawData);
      mostrarInfoProyecto(data.proyecto);
      cargarListaReportes(data.reportes);
    });
}

/* Auxiliares */

// Eventos

function leerParamDeUrl(nombreParam) {
  var queryString = window.location.search;
  var params = new URLSearchParams(queryString);
  var param = params.get(nombreParam);
  console.log("el valor del parametro " + nombreParam + " es: " + param);
  return param;
}

// MaiN -----------------------------------------

cargarProyecto();
