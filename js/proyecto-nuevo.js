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
var titulo = document.getElementById("titulo");

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
var btnCrearProyecto = document.getElementById("btn-guardar-proyecto");
var btnUpdateProyecto = document.getElementById("btn-actualizar-proyecto");

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

function mostrarProyecto() {
  //Completa los inputs con la info en el state
  titulo.innerHTML = state.nombreProyecto;
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

function cargarProyectoDeDB(numProyecto) {
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
    .then(function (rawData) {
      var data = cleanData(rawData);
      state = data.proyecto;
      console.log("se cargo el proyecto: ", data);
      mostrarProyecto();
      deshabilitarCamposClave();
    });
}

function cambiarModo() {
  console.log("modoEdit: ", modoEdit);
  if (modoEdit) {
    btnCrearProyecto.setAttribute("style", "display: none;");
  } else {
    btnUpdateProyecto.setAttribute("style", "display: none;");
  }
}

function setup() {
  // decide si debe cargar un proyecto
  cambiarModo();
  if (modoEdit) {
    var numProyecto = params.get("num");
    console.log("setup dice: numProyecto=", numProyecto);
    cargarProyectoDeDB(numProyecto);
  }
}

//Eventos

btnCrearProyecto.addEventListener("click", function (e) {
  e.preventDefault();
  createProyecto(state);
});

btnUpdateProyecto.addEventListener("click", function (e) {
  e.preventDefault();
  updateProyecto(state);
});

setup();
