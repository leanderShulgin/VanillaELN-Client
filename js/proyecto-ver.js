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

/* -------------------- Carga de info -------------------------------------

cargarProyecto() engloba varias funciones cuyo fin es cargar la info en la página 
a partir de un json. La info tiene dos fuentes, por un lado la colección proyectos
que nos dice la info general del proyecto y luego la lista de los reportes que 
corresponden a dicho proyecto.

mostrarInfoProyecto() consulta a la coleccion de proyectos y carga la info general.

cargarListaReportes() carga, vía fetch, un json que contiene una lista de reportes. 
Cuando se resuelve la promesa del fetch devuelve  un array de objetos.
Cada objeto contiene la info para generar una fila de la tabla. El html del
body de la tabla se genera mediante la función generarFilasTabla() y luego
se inserta en la tabla  */

function cargarListaReportes(archivoJSON) {
  fetch(archivoJSON)
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      console.log("Cargar reportes pegó la siguiente data:");
      console.log(data);
      var filas = generarFilasTabla(data);
      bodyTablaEnsayos.innerHTML = filas;
    });
}

function generarFilasTabla(data) {
  var filas = "";
  var urlvars = "";
  for (var i = 0; i < data.length; i++) {
    urlvars =
      "?pid=" +
      data[i].encabezado.idProyecto +
      "&repid=" +
      data[i].encabezado.idReporte;
    //
    filas +=
      "<tr>" +
      "<td><a href='reporte-ver.html" +
      urlvars +
      "'>" +
      data[i].encabezado.idReporte +
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
    .then(function (data) {
      mostrarInfoProyecto(data);
      // cargarListaReportes("./demos/reportes-demo.json");
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
