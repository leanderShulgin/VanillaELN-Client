var state = {};
// Campos
var cas = document.getElementById("cas-target");
var descripcion = document.getElementById("descripcion");
var id = document.getElementById("id-proyecto");
var nombre = document.getElementById("nombre-proyecto");
var pm = document.getElementById("pm-target");
var responsable = document.getElementById("responsable");
var smiles = document.getElementById("smiles-target");
var tipo = document.getElementById("tipo-proyecto");

//Botones
var btnGuardarProyecto = document.getElementById("btn-guardar-proyecto");

//Funciones

function leerTodosLosCampos() {
  return {
    // fecha: se agrega en el server
    cas: cas.value,
    descripcion: descripcion.value,
    id: id.value,
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
    var data = JSON.stringify(state);
    let header = new Headers({
      "Access-Control-Allow-Origin": "",
      "Content-Type": "application/json",
    });
    var miInit = {
      method: "POST",
      body: JSON.stringify(data),
      headers: header,
      mode: "cors",
    };
    fetch("http:\\localhost:5000/api/proyecto", miInit).then((response) => {
      console.log(response);
    });
  }

//Eventos

btnGuardarProyecto.addEventListener("click", function (e) {
  e.preventDefault();
  guardarEstado(state);
});
