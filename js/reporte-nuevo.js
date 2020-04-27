var autor = document.getElementById("autor");
var encabezado = {}; // Aqui almaceno los datos ingresados
var etapa = document.getElementById("etapa");
var fecha = document.getElementById("fecha");
var numProyecto = document.getElementById("num-proyecto");
var numReporte = document.getElementById("num-reporte");
var pmProducto = document.getElementById("pm-producto");
var referencias = document.getElementById("referencias");
var responsable = document.getElementById("responsable");
var via = document.getElementById("via");

var objetivo = document.getElementById("objetivo");

var btnRegistrar = document.getElementById("btn-registrar");

/* Config */

var header = new Headers({
  "Access-Control-Allow-Origin": "*",
  "Content-Type": "application/json",
});

function leerDatos() {
  return {
    encabezado: {
      numProyecto: numProyecto.value,
      numReporte: numReporte.value,
      etapa: etapa.value,
      via: via.value,
      pmProducto: pmProducto.value,
      fecha: fecha.value,
      referencias: referencias.value,
      autor: autor.value,
      responsable: responsable.value,
    },
    objetivo: objetivo.value,
  };
}

function crearReporte() {
  datos = leerDatos();
  console.log("se va a guardar lo siguiente: ", datos);
  var miInit = {
    method: "POST",
    body: JSON.stringify(datos),
    headers: header,
    mode: "cors",
  };
  fetch("http:\\localhost:5000/api/reporte", miInit).then((response) => {
    console.log(response);
  });
}

btnRegistrar.addEventListener("click", function (e) {
  e.preventDefault();
  crearReporte();
});
