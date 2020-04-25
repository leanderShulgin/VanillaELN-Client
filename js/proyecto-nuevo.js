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

// Parametros URL
var queryString = window.location.search;
var params = new URLSearchParams(queryString);
var modoEdit = params.has("num"); //Si no hay parámetro es que es un nuevo proyecto

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

function createProyecto(state) {
  // Levanta la info de los campos y crea un nuevo doc en la base de datos
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

function updateProyecto(state) {
  // Levanta la info de los campos y actualiza el doc en la base de datos
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

function cargarCamposDeState() {
  //Completa los inputs con la info en el state
  cas.value = state.cas;
  descripcion.value = state.descripcion;
  num.value = state.num;
  nombre.value = state.nombreProyecto;
  pm.value = state.pm;
  responsable.value = state.responsable;
  smiles.value = state.smiles;
  tipo.value = state.tipo;
}

function deshabilitarCamposClave() {
  //Evita que se puedan editar campos sensibles
  num.disabled = true;
  nombre.disabled = true;
}

function cargarDesdeDB(numProyecto) {
  // Busca un proyecto en la base de datos, lo carga en el state
  // y lo muestra en la página.
  var miInit = {
    method: "GET",
    headers: header,
    mode: "cors",
  };
  fetch("http:\\localhost:5000/api/proyecto/" + numProyecto, miInit)
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      state = data;
      console.log("nuevo state: ", data);
      cargarCamposDeState();
      deshabilitarCamposClave();
    });
}

function cargarProyecto() {
  // decide si debe cargar un proyecto
  if (modoEdit) {
    var numProyecto = params.get("num");
    cargarDesdeDB(numProyecto);
  }
}

//Eventos

btnGuardarProyecto.addEventListener("click", function (e) {
  e.preventDefault();
  createProyecto(state);
});

btnActProyecto.addEventListener("click", function (e) {
  e.preventDefault();
  updateProyecto(state);
});

cargarProyecto();
