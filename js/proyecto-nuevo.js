var state = {};
// Campos
var cas = document.getElementById("cas-target");
var descripcion = document.getElementById("descripcion");
var num = document.getElementById("id-proyecto");
var nombre = document.getElementById("nombre-proyecto");
var pm = document.getElementById("pm-target");
var responsable = document.getElementById("responsable");
var smiles = document.getElementById("smiles-target");
var tipo = document.getElementById("tipo-proyecto");

// Config

var header = new Headers({
  "Access-Control-Allow-Origin": "*",
  "Content-Type": "application/json",
});

//Botones
var btnGuardarProyecto = document.getElementById("btn-guardar-proyecto");
var btnActProyecto = document.getElementById("btn-actualizar-proyecto");

//Funciones

function leerTodosLosCampos() {
  return {
    // fecha: se agrega en el server
    cas: cas.value,
    descripcion: descripcion.value,
    num: num.value,
    nombreProyecto: nombre.value,
    pm: pm.value,
    responsable: responsable.value,
    smiles: smiles.value,
    tipo: tipo.value,
  };
}

// function guardarEstado(state) {
//   state = leerTodosLosCampos();
//   console.log("se enviará al servidor el siguiente estado: ");
//   console.log(state);
// }

// ESTA ES LA FUNCION QUE HAY QUE USAR CON LA API:

function guardarEstado(state) {
  state = leerTodosLosCampos();
  console.log("se enviará al servidor el siguiente estado: ");
  console.log(state);
  var miInit = {
    method: "POST",
    body: JSON.stringify(state),
    headers: header,
    mode: "cors",
  };
  fetch("http:\\localhost:5000/api/proyecto", miInit).then((response) => {
    console.log("respuesta del servidor: ", response);
  });
}

function actProyecto(state) {
  state = leerTodosLosCampos();
  console.log("se enviará al servidor el siguiente estado: ");
  console.log(state);
  var miInit = {
    method: "PUT",
    body: JSON.stringify(state),
    headers: header,
    mode: "cors",
  };
  fetch("http:\\localhost:5000/api/proyecto/" + state.num, miInit).then(
    (response) => {
      console.log("respuesta del servidor: ", response);
    }
  );
}

//Eventos

btnGuardarProyecto.addEventListener("click", function (e) {
  e.preventDefault();
  guardarEstado(state);
});

btnActProyecto.addEventListener("click", function (e) {
  e.preventDefault();
  actProyecto(state);
});
