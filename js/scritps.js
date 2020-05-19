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
  var dia = ("0" + (ahora.getDate() + 1)).slice(-2);
  // var dia = ahora.getDate();
  var mes = ("0" + (ahora.getMonth() + 1)).slice(-2);
  var anio = ahora.getFullYear();
  return anio + "-" + mes + "-" + dia;
  //   return ahora.toDateString() + " "+ ahora.toTimeString();
}

function cleanData(rawData) {
  // si el valor es undefined o null lo cambia a string vacia
  // aprovecha el parametro "replace" de JSON.stringify
  var cleanData = JSON.stringify(rawData, function (key, value) {
    if (value == null || String(value) == "undefined") {
      return "";
    }
    return value;
  });
  return JSON.parse(cleanData);
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

function tableNumber(number) {
// Convierte nro en string formateada
  if (typeof number == "number") {
    if (number > 0.1) {
      return number.toFixed(2);
    } else {
      return number.toExponential(2);
    }
  } else {
    return "";
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
