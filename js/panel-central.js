var bodyTablaProyectos = document.getElementById("body-tabla-proyectos");
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

cargarListaProyectos("./demos/proyectos-demo.json");
