var bodyTablaProyectos = document.getElementById("body-tabla-proyectos");
var bdyRepAc = document.getElementById("body-tabla-rep-ac");
// Funciones

function cargarListaProyectos(archivoJSON) {
  fetch(archivoJSON)
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      console.log("Cargar reportes pegó la siguiente data:");
      console.log(data);
      var filas = generarFilasProyectos(data);
      bodyTablaProyectos.innerHTML = filas;
    });
}

function generarFilasProyectos(proyectos) {
  filas = "";
  for (var i = 0; i < proyectos.length; i++) {
    //
    filas +=
      "<tr>" +
      "<td><a href='proyecto-ver.html?pid=" +
      proyectos[i].id +
      "'>" +
      proyectos[i].id +
      "</a></td>" +
      "<td>" +
      proyectos[i].nombreProyecto +
      "</td>" +
      "<td>" +
      proyectos[i].responsable +
      "</td>" +
      "</tr>";
  }
  return filas;
}

function cargarListaReportesActivos(archivoJSON) {
  fetch(archivoJSON)
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      console.log("Cargar reportes pegó la siguiente data:");
      console.log(data);
      var filas = generarFilasReportesActivos(data);
      bdyRepAc.innerHTML = filas;
    });
}

function generarFilasReportesActivos(reportes) {
  filas = "";
  for (var i = 0; i < reportes.length; i++) {
    //
    var urlvars =
      "?pid=" +
      reportes[i].encabezado.idProyecto +
      "&repid=" +
      reportes[i].encabezado.idReporte;
    filas +=
      "<tr>" +
      "<td><a href='reporte-ver.html" +
      urlvars +
      "'>" +
      reportes[i].encabezado.idProyecto +
      "</a></td>" +
      "<td>" +
      reportes[i].encabezado.idReporte +
      "</td>" +
      "<td>" +
      reportes[i].encabezado.etapa +
      "</td>" +
      "</tr>";
  }
  return filas;
}

/* MAIN */

cargarListaProyectos("./demos/proyectos-demo.json");
cargarListaReportesActivos("./demos/reportes-demo.json");
