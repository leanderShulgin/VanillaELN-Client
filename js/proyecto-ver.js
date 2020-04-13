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

//Botones

document
  .getElementById("btn-cargar-json")
  .addEventListener("click", function (event) {
    cargarJsonData("proyecto-demo.json");
  });

// Funciones

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
