// Campos
var id = document.getElementById("id-proyecto");
var nombreProyecto = document.getElementById("nombre-proyecto");
var fecha = document.getElementById("fecha");
var responsable = document.getElementById("responsable");
var descripcion = document.getElementById("descripcion");
var tipo = document.getElementById("tipo-proyecto");
var cas = document.getElementById("cas");
var pm = document.getElementById("pm");
var smiles = document.getElementById("smiles");
var bodyTablaEnsayos = document.getElementById("body-tabla-ensayos");

//Botones

// document
//   .getElementById("btn-cargar-json")
//   .addEventListener("click", function (event) {
//     cargarJsonProyecto("./demos/proyecto-demo.json");
//   });

// Funciones

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

function mostrarData(data) {
  fecha.innerHTML = data.fecha;
  id.innerHTML = data.id;
  nombreProyecto.innerHTML = data.nombreProyecto;
  responsable.innerHTML = data.responsable;
  descripcion.innerHTML = data.descripcion;
  tipo.innerHTML = data.tipo;
  cas.innerHTML = data.cas;
  pm.innerHTML = data.pm + " g/mol";
  smiles.innerHTML = data.smiles;
  /*Cambiar esto por una consulta a la base de datos con el id del proyecto */
  cargarListaReportes("./demos/reportes-demo.json");
}

function cargarJsonProyecto(archivoJSON) {
  console.log("cargarJsonProyecto");
  fetch(archivoJSON)
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      console.log("Data:");
      console.log(data);
      mostrarData(data);
    });
}

// MaiN:
cargarJsonProyecto("./demos/proyecto-demo.json");
