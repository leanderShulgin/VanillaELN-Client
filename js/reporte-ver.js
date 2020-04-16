// Variables de campos:
var idReporte = document.getElementById("id-reporte");
var idProyecto = document.getElementById("id-proyecto");
var etapa = document.getElementById("etapa");
var objetivo = document.getElementById("objetivo");
var fecha = document.getElementById("fecha");
var autor = document.getElementById("autor");
var responsable = document.getElementById("responsable");
var referencias = document.getElementById("referencias");
var masaProd = document.getElementById("masa-producto");
var purezaProd = document.getElementById("pureza-producto");
var masaTeo = document.getElementById("masa-teorica");
var rendimiento = document.getElementById("rendimiento");
var efAc = document.getElementById("efluente-acuoso");
var efOrg = document.getElementById("efluente-organico");
var factorE = document.getElementById("factor-e");
var conclusiones = document.getElementById("conclusiones");
var equipo = document.getElementById("equipo");
var seguridad = document.getElementById("seguridad");
var tablaReactivos = document.getElementById("tabla-reactivos");
var bodyTablaReactivos = document.getElementById("body-tabla-reactivos");

//Otras variables
var visorJournal = document.getElementById("visor-journal");

document
  .getElementById("btn-cargar-json")
  .addEventListener("click", function (event) {
    cargarJsonData("./demos/reporte-demo.json");
  });

// Funciones
function mostrarEncabezado(enc) {
  idReporte.innerHTML = enc.idProyecto + "-" + enc.idReporte;
  idProyecto.innerHTML = enc.idProyecto + " - " + enc.nombreProyecto;
  etapa.innerHTML = enc.etapa;
  fecha.innerHTML = enc.fecha;
  autor.innerHTML = enc.autor;
  responsable.innerHTML = enc.responsable;
  referencias.innerHTML = enc.referencias;
}
function generarFilasTabla(reactivos) {
  filas = "";
  for (var i = 0; i < reactivos.length; i++) {
    //
    filas +=
      "<tr>" +
      "<td>" +
      reactivos[i].nombre +
      "</td>" +
      "<td>" +
      reactivos[i].origen +
      "</td>" +
      "<td>" +
      reactivos[i].masa +
      "</td>" +
      "<td>" +
      reactivos[i].pureza +
      "</td>" +
      "<td>" +
      reactivos[i].pm +
      "</td>" +
      "<td>" +
      reactivos[i].moles +
      "</td>" +
      "<td>" +
      reactivos[i].rm +
      "</td>" +
      "</tr>";
  }
  return filas;
}
function mostrarReactivos(reactivos) {
  console.log(reactivos);
  bodyTablaReactivos.innerHTML = generarFilasTabla(reactivos);
}

function mostrarJournal(registros) {
  console.log(registros);
  for (var i = 0; i < registros.length; i++) {
    visorJournal.innerHTML +=
      "<p>" +
      '<span class="timeStamp">' +
      registros[i].hora +
      " | </span>" +
      registros[i].texto +
      "</p>";
  }
}

function mostrarResultados(results) {
  masaProd.innerHTML = results.masaProducto;
  purezaProd.innerHTML = results.purezaProducto;
  masaTeo.innerHTML = results.masaTeorica;
  rendimiento.innerHTML = results.rendimiento;
}

function mostrarAmbiental(amb) {
  efAc.innerHTML = amb.efluentesAcuosos;
  efOrg.innerHTML = amb.efluentesOrganicos;
  factorE.innerHTML = amb.factorE;
}

function mostrarData(data) {
  mostrarEncabezado(data.encabezado);
  mostrarResultados(data.resultados);
  mostrarAmbiental(data.ambiental);
  mostrarJournal(data.registros);
  mostrarReactivos(data.reactivos);
  objetivo.innerHTML = data.objetivo;
  conclusiones.innerHTML = data.conclusiones;
  equipo.innerHTML = data.equipo;
  seguridad.innerHTML = data.seguridad;
}

function cargarJsonData(archivoJSON) {
  console.log("cargarJsonData");
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

function cargarData(archivoJSON) {
  var data = cargarJsonData(archivoJSON);
}
