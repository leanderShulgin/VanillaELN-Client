// Variables de campos:
var idReporte = document.getElementById("idReporte");
var proyecto = document.getElementById("proyecto");
var etapa = document.getElementById("etapa");
var objetivo = document.getElementById("objetivo");
var fecha = document.getElementById("fecha");
var autor = document.getElementById("autor");
var responsable = document.getElementById("responsable");
var referencia = document.getElementById("referencia");

document
  .getElementById("btn-cargar-json")
  .addEventListener("click", function (event) {
    cargarJsonData("reporte-demo.json");
  });

function cargarJsonData(archivoJSON) {
  //lee un archivo json y luego completa la página con la info
  fetch(archivoJSON)
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      //   console.log("tipo de datos:");
      //   console.log(typeof data);
      //   console.log("datos:");
      //   console.log(data);
      mostrarData(data);
    });
}

function mostrarData(data) {
  // Carga en la página la data reporte
  // a partir del objeto data parseado de un json
  idReporte.innerHTML = data.idProyecto + "-" + data.idReporte;
  proyecto.innerHTML = data.nombreProyecto;
  etapa.innerHTML = data.etapa;
  fecha.innerHTML = data.fecha;
  autor.innerHTML = data.autor;
  objetivo.innerHTML = data.objetivo;
}

function cargarData(archivoJSON) {
  //Toma un objeto js con el contenido de un reporte
  //y los carga en la interfaz de lectura:
  var data = cargarJsonData(archivoJSON);
}
