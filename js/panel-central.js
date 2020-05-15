var bodyTablaProyectos = document.getElementById("body-tabla-proyectos");
var bdyRepAc = document.getElementById("body-tabla-rep-ac");

// config
var header = new Headers({
  "Access-Control-Allow-Origin": "*",
  "Content-Type": "application/json",
});

// Funciones

/* Cargar la lista de proyectos desde la base de datos */
function cargarProyectos() {
  var miInit = {
    method: "GET",
    headers: header,
    mode: "cors",
  };
  fetch("http:\\localhost:5000/api/proyectos", miInit)
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      console.log("La base de datos devolvió estos proyectos:", data);
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
      "<td><a href='proyecto-ver.html?num=" +
      proyectos[i].num +
      "'>" +
      proyectos[i].num +
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

/* MAIN */

cargarProyectos();
