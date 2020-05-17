// fUNCIONES GENERALES

function fechaHora() {
  var ahora = new Date();
  var hora = ahora.getHours();
  var minutos = ahora.getMinutes();
  var segundos = ahora.getSeconds();
  var dia = ahora.getDate();
  var mes = ahora.getMonth();
  var anio = ahora.getFullYear();
  return (
    dia +
    "-" +
    (mes + 1) +
    "-" +
    anio +
    " " +
    hora +
    ":" +
    minutos +
    ":" +
    segundos
  );
  //   return ahora.toDateString() + " "+ ahora.toTimeString();
}

function yyyymmdd(ahora) {
  ("0" + (ahora.getMonth() + 1)).slice(-2);
  var dia = ahora.getDate();
  var mes = ("0" + (ahora.getMonth() + 1)).slice(-2);
  var anio = ahora.getFullYear();
  return anio + "-" + mes + "-" + dia;
  //   return ahora.toDateString() + " "+ ahora.toTimeString();
}

function toggleBtn(btn, value) {
  // Cambia el aspecto de un botón
  if (value == "on") {
    btn.innerHTML = "Aceptar";
    btn.style.backgroundColor = "rgb(49,55,71)";
    btn.style.color = "rgb(238,236,236)";
  } else {
    btn.innerHTML = "Editar";
    btn.style.backgroundColor = "rgb(238,236,236)";
    btn.style.color = "rgb(49,55,71)";
  }
}

function qs(query) {
  //shorthand para querySelector
  return document.querySelector(query);
}

function qsa(query) {
  //shorthand para querySelectorAll
  return document.querySelectorAll(query);
}
